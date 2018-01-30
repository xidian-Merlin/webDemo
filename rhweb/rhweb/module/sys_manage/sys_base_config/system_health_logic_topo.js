$(document).ready(function (){
require(['/js/plugin/ABPanel/abPanel.js',
         '/js/plugin/tree/tree.js',
         '/js/plugin/timepicker/timepicker.js',
         '/js/plugin/topo/editor.js',
         /*'/js/plugin/topo/network.js',
         '/js/plugin/topo/topologyProperties.js',*/
         /*'/js/plugin/topo/jtopo-min.js',*/
         '/js/plugin/topo/jtopo-0.4.8-dev.js'] ,function (abPanel ,plot,tree,publicObj,editor,jtopo){


var testjson = [
{
	"agentServers":[
	{
		"appServeIp":"115.28.155.158",
		"appServeName":"dota23",
		"currentPageNum":0,
		"name":"dota23",
		"nodeId":"100002",
		"order":"",
		"orderBy":"",
		"pageSize":0,
		"recordCount":1,
		"regionId":"",
		"tip":"115.28.155.158",
		"type":"agentServer",
		"userId":""
	}
	],
	"name":"dota23",
	"type":"appServer",
	"tip":"115.28.155.158"
}
];

init();

function init(){

	index_menuHide();

	um_ajax_get({
		url : "socnode/queryApplServerAgentInfo",
		successCallBack : function (data){
			if(!!data.appServers){
				var canvas = document.getElementById('canvas');
				canvas.width = $("#flashContent").width();
				canvas.height = $("#flashContent").height();
            	var stage = new JTopo.Stage(canvas);
            	var scene = new JTopo.Scene();
            	stage.add(scene);
            	var imagesPath = '/img/system_health_logic_topo/';
            	scene.background = imagesPath+'background.jpg';
            	var monitorCenterNode = new JTopo.Node('监控中心');
            	monitorCenterNode.fontColor = "0,0,0";
            	monitorCenterNode.setSize(70, 60);
            	monitorCenterNode.setImage(imagesPath+'monitorcenter.png');
            	monitorCenterNode.setLocation(canvas.width/2-35,50);

            	scene.add(monitorCenterNode);
            	// debugger;
				for(var i=0;i<data.appServers.length;i++){
					var appServer = data.appServers[i];
					var appServersNode = new JTopo.Node(appServer.name);
					appServersNode.fontColor = "0,0,0";
					appServersNode.setSize(70,60);
					appServersNode.setImage(imagesPath+'appServer.png');
					appServersNode.setLocation(monitorCenterNode.x * Math.random(), monitorCenterNode.y +100);
					// appServersNode.alarm=appServer.tip;
					// appServersNode.alarmColor = '0,0,0';
					appServersNode.addEventListener("mouseover",function (event){
						$("#tipDiv").show().css('left',event.x+10).css('top',event.y-10);
						$("#tipDiv").text(appServer.tip);
						// appServersNode.alarm=appServer.tip;
					});
					appServersNode.addEventListener("mouseout",function (event){
						$("#tipDiv").hide();
						// appServersNode.alarm=null;
					});
					appServersNode.addEventListener("mousedown",function (event){
						$("#tipDiv").hide();
						// appServersNode.alarm=null;
					});
					scene.add(appServersNode);
					var link = new JTopo.Link(monitorCenterNode,appServersNode);
					scene.add(link);
					for(var j=0;j<appServer.agentServers.length;j++){
						var agentServer = appServer.agentServers[j];
						var agentServerNode = new JTopo.Node(agentServer.name);
						agentServerNode.fontColor = "0,0,0";
						agentServerNode.setSize(70,60);
						agentServerNode.setImage(imagesPath+'agentServer.png');
						agentServerNode.setLocation(monitorCenterNode.x * Math.random(), appServersNode.y + 100);
						agentServerNode.addEventListener("mouseover",function (event){
							$("#tipDiv").show().css('left',event.x+10).css('top',event.y-10);
							$("#tipDiv").text(agentServer.tip);
							// agentServerNode.alarm=appServer.tip;
						});
						agentServerNode.addEventListener("mouseout",function (event){
							$("#tipDiv").hide();
							// agentServerNode.alarm=null;
						});
						agentServerNode.addEventListener("mousedown",function (event){
							$("#tipDiv").hide();
							// agentServerNode.alarm=null;
						});
						scene.add(agentServerNode);
						var link = new JTopo.Link(appServersNode,agentServerNode);
						scene.add(link);
					}
					delete appServersNode;
				}
				scene.doLayout(JTopo.layout.TreeLayout('down', 30, 107));
			}else {
				$("#canvas").remove();
				var $p = $('<p></p>');
				$p.css("text-align","center").css("display","table-cell").css("vertical-align","middle").css("font-size","24px").css("color","gray");
				$p.append("暂无数据！");
				var $div = $('<div></div>');
				$div.css("height","100%").css("width","100%").css("display","table");
				$div.append($p);
				$("#flashContent").append($div);
			}
		}
	});

}

function hostLink(nodeA, nodeZ){                
	var link = new JTopo.FlexionalLink(nodeA, nodeZ);                
	link.shadow = false;
	link.offsetGap = 44;
	scene.add(link);
	return link;
}
function linkNode(nodeA, nodeZ, f){
	var link;
	if(f){
		link = new JTopo.FoldLink(nodeA, nodeZ);
	}else{
		link = new JTopo.Link(nodeA, nodeZ);
	}
	link.direction = 'vertical';
	scene.add(link);
	return link;
}
function node(x, y, img){
	var node = new JTopo.Node();
	node.setImage('./img/statistics/' + img, true);                
	node.setLocation(x, y);
	scene.add(node);
	return node;
}

});
});