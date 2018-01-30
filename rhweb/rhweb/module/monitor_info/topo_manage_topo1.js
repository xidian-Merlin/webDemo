$(document).ready(function (){
require(['/js/plugin/topo/jtopo-0.4.8-dev.js',
         '/js/plugin/topo/editor.js',
         '/js/plugin/topo/network.js',
         '/js/plugin/topo/topologyProperties.js',
         '/js/lib/JsonTools.js',
         '/js/lib/Json2xml.js'] ,function (jtopo,editorJs,network,topologyProperties,JsonTools,Json2xml){

var url = {
	importUrl : 'topoManage/getTopoMonitor'
};
var this_params = index_query_param_get();
var topoId = this_params.topoId;

var json2xml = new Json2xml({
	attributePrefix : ""
});

init();
function init(){
	um_ajax_get({
		url : url.importUrl + "?topoId="+topoId,
		successCallBack : function (data){
			if(data){
				var jsonobj = json2xml.xml_str2json(data);
				console.log(jsonobj);
				formatJson(jsonobj);
			}else {
				g_dialog.operateAlert(null,"暂无默认拓扑图","error");
			}
		}
	})
}
function formatJson(jsonobj){
	if(jsonobj.root){
		var canvas = document.getElementById('canvas');
		canvas.width = $(canvas).parent().width();
		canvas.height = $(canvas).parent().height();
		var stage = new JTopo.Stage(canvas);
    	stage.id=jsonobj.root.id;
    	stage.width = 5000;
    	stage.height = 5000;
    	stage.wheelZoom = 0.85;
    	var _root = jsonobj.root;

    	var scene = new JTopo.Scene();
    	stage.add(scene);
    	if(_root.bgImg&&_root.bgImg!=""){
    		console.log(_root.bgImg);
    	}else {
	    	var imagesPath = '/img/topo/';
	    	scene.background = imagesPath+'backgroundImage.jpg';
    	}
    	scene.translateX = Number(_root.x)
    	scene.translateY = Number(_root.y)

    	//添加节点
    	if(_root.nodes.node){	
	    	for(var i=0;i<_root.nodes.node.length;i++){
	    		var item = _root.nodes.node[i];
	    		var node = itemToNode(item);
	    		scene.add(node);
	    	}
    	}
    	//添加连线
    	if(_root.lines.line){
	    	for(var i=0;i<_root.lines.line.length;i++){
	    		var dependence = _root.lines.line[i];
	    		var link = dependenceToLink(dependence,scene);
	    		scene.add(link);
	    	}
    	}
	}else {
		g_dialog.operateAlert(null,"数据加载出错","error");
	}
}

// 节点
function newNode(x, y, w, h, text ,imgurl){
    var node = new JTopo.Node(text);
    node.setLocation(x, y);
    node.setSize(w, h);
    node.setImage(imgurl);
    return node;
}
function itemToNode(item){
	var x = Number(item.x) ;
	var y = Number(item.y);
	var width = Number(item.width || 40);
	var height = Number(item.height || 40);
	var w = Number(width);
	var h = Number(height);
	var id = item.id;
	var name = item.name;
	var imgurl = index_web_app + "img/" + item.img;
	var node = newNode(x,y,w,h,name,imgurl);
	node.attr = item ;
	if(item.eventlevel!="0"){
		if(item.eventlevel=="1"){
			node.alarm = "性能事件";
			node.alarmColor = "255,255,0";
		}else if(item.eventlevel=="2"){
			node.alarm = "故障事件";
			node.alarmColor = "255,0,0";
		}else if(item.eventlevel=="3"){
			node.alarm = "性能&故障事件";
			node.alarmColor = "255,128,0";
		}
	}
	return node;
}
// 简单连线
function newLink(nodeA, nodeZ, text, direction){
    var link = new JTopo.Link(nodeA, nodeZ, text);
    // link.direction = direction || 'horizontal';
    // link.arrowsRadius = 15; //箭头大小
    link.lineWidth = 3; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = '0,200,255';//JTopo.util.randomColor(); // 线条颜色随机
    return link;
}
function dependenceToLink(dependence,scene){
	var startNode = scene.findElements(function (a){
		return a.attr.id == dependence.startId;
	})[0];
	var endNode = scene.findElements(function (a){
		return a.attr.id == dependence.endId;
	})[0];
	var link = newLink(startNode, endNode);
	link.attr = dependence;
	link.myTopoStyle = true;
	var startPort,endPort;
	if(startNode.attr.asset.ports.port){
		if(startNode.attr.asset.ports.port instanceof Array){
			for(var i=0;i<startNode.attr.asset.ports.port.length;i++){
				var tempPort = startNode.attr.asset.ports.port[i];
				if(tempPort.id==dependence.networkLink.startPort){
					startPort = tempPort;
					break;
				}
			}
		}else {
			if(startNode.attr.asset.ports.port.id==dependence.networkLink.startPort){
				startPort = startNode.attr.asset.ports.port;
			}
		}
	}
	if(endNode.attr.asset.ports.port){
		if(endNode.attr.asset.ports.port instanceof Array){
			for(var i=0;i<endNode.attr.asset.ports.port.length;i++){
				var tempPort = endNode.attr.asset.ports.port[i];
				if(tempPort.id==dependence.networkLink.endPort){
					endPort = tempPort;
					break;
				}
			}
		}else {
			if(endNode.attr.asset.ports.port.id==dependence.networkLink.endPort){
				endPort = endNode.attr.asset.ports.port;
			}
		}
	}
	link.textS = startPort?startPort.name:undefined;
	link.textE = endPort?endPort.name:undefined;
	console.log(startPort);
	if(dependence.color=="red"){
		link.strokeColor = "255,0,0";
	}else if(dependence.color=="green"){
		link.strokeColor = "0,255,0";
	}else {

	}
	link.text = dependence.interfaceSpeed;
	return link;
}
function addAttributes(base,extend,attrName){
	var rootKeyset = Object.keys(extend);
	var _attrName = attrName || "attributes";
	base[_attrName] = {};
	for(var i=0;i<rootKeyset.length;i++){
		if((typeof extend[rootKeyset[i]]) == "string"){
			base[_attrName][rootKeyset[i]] = extend[rootKeyset[i]];
		}
	}
}


         });
});