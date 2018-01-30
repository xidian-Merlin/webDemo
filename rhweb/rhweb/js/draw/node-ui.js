String.prototype.gblen = function(){
    var len = 0;    
    for (var i=0; i<this.length; i++) {    
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;    
}
function getStrLength(str){
    var len = 0;    
    for (var i=0; i<str.length; i++) {    
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;  
}
function checkIsNULL(obj)
{
	if(obj != undefined && obj != "undefined" && 
			obj != null && obj != "null" && obj != ""){
		return false;
	}
	return true;
}
Array.prototype.remove=function(dx)
{
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
		if(this[i]!=this[dx])
		{
			this[n++]=this[i];
		}
	}
	this.length-=1;
}
Array.prototype.clear=function()
{
	for(var i=0;i<this.length;i++){
		this.remove(i);
		i--;
	}
}
define([
	'/js/plugin/topo/jtopo-0.4.8-dev.js',
    '/js/draw/node-ui-function.js',
    '/js/draw/group.js',
    '/js/lib/Json2xml.js',
    '/js/plugin/drag/drag.js'
    ],function (jtopo,nodeFunction,group,Json2xml,drag){
	return{
			_nodeFunction:nodeFunction,
			_group:group,
			_customToolEvent:null,
			json2xml:new Json2xml({
				attributePrefix : ""
			}),
			init:function(){
				this._nodeFunction.setNodeFactory(this);
				this._nodeFunction.setSize(60,60);//默认大小
				this._nodeFunction.setEnCode([
				                              {rep:/</g,code:"&lt;",text:"<",backRep:/\&lt;/g},
				                              {rep:/>/g,code:"&gt;",text:">",backRep:/\&gt;/g},
				                              {rep:/&/g,code:"&amp;",text:"&",backRep:/\&amp;/g},
				                              {rep:/\'/g,code:"&apos;",text:"'",backRep:/\&apos;/g},
				                              {rep:/\"/g,code:"&quot;",text:"\"",backRep:/\&quot;/g},
				                              ]);//设置特殊字符默认编码
				//设置无背景图片的节点类型
				this._nodeFunction.setCustomComTypes([{type:"generalAgreement",text:"通信协议",classStr:"Node",parent:"customNode"},
				                                      {type:"middleware",text:"中间件",classStr:"CircleNode",parent:"customNode"}]);
			},
			customComEvent:function(option){
				var customToolEvent = $.extend(true, {
					type:"",
					click:null,
					dblclick:null,
					node:null,
					line:null
					}, option);
				if(this._customToolEvent == null)
					this._customToolEvent = new Array();
				var i=0;
				for(;i<this._customToolEvent.length;i++){
					if(this._customToolEvent[i].type == customToolEvent.type){
						break;
					}
				}
				this._customToolEvent[i] = customToolEvent;
			},
			getCustomComEventByType:function(type,node){
				if(this._customToolEvent == null)
					return null;
				for(var i=0;i<this._customToolEvent.length;i++){
					if(this._customToolEvent[i].type == type){
						return this._customToolEvent[i];
					}
				}
				if(checkIsNULL(node)==false){
					if(node.customnode != true)
						return null;
				}
				else
					return null;
				//查找是否属于自定义节点
				for(var i=0;i<this._nodeFunction.getNodeEntry().customComTypes.length;i++){
					if(this._nodeFunction.getNodeEntry().customComTypes[i].type == type){
						for(var j=0;j<this._customToolEvent.length;j++){
							if(this._customToolEvent[j].type == this._nodeFunction.getNodeEntry().customComTypes[i].parent){
								return this._customToolEvent[j];
							}
						}
					}
				}
				return null;
			},
			node:
			{
				x:0,
				y:0,
				id:"node0",
				domainId:0,
				width:0,
				height:0,
				type:"node",
				bimg:null,
				bcolor:"255,255,0",
				data:new Object(),
				name:"",
				textColor:"0,0,0",
				canMove:false,
				myTopoStyle:true,
				// healthlevel:-1,
				compType:"", //挂载的监控器类型
				compName:"", //挂载的监控器名称
				compId:"",	//挂载的监控器ID
				cloneCount:0,//克隆次数
				selected:false,//是否选中
				isClone:false,//是否是复制品
				configstatus:0,//未配置监控器
				monitor:{
					compType:null,	//监控器大类
					entry:null		//具体的监控器对象
				},
				mPoint:new Array(),
				newToolNode:function(){
					this.cannClone = true;
					this.isClone = true;
					this.x = 200;
					this.y = 200;
					var node = null;
					var tip = "请双击复制";
					var draggable = true;
					if(this.compType == "line" || this.compType == "arrow" || this.compType == "layer" )
						tip = "单击选中后再画图区单击连线",draggable = false;
					if(this.compType == "text")
					{
						node = this.newTextNode();
					}
					//自定义类型
					else if(this.compType == "customNode")
					{
						node = this.newCustomNodeParent();
					}
					else
						node = this.newNode();
					//将node存储在全局变量中
					if(node!=null)
						nodeFunction.addToolsNodeList(node);
					var div = $('<div id="'+this.id+'" style="display:inline-block;text-align: center;cursor: pointer;width:"'+(nodeFunction.getNodeEntry().size[0]+4)+'"px;padding:2px" title="'+tip+'" compType="'+this.compType+'">'+
									'<img src="'+this.bimg+'" draggable='+draggable+' width="'+nodeFunction.getNodeEntry().size[0]+'" height="'+nodeFunction.getNodeEntry().size[1]+'"/>'+
									'<p style="text-align: center;font-size: 12px;color: white;">'+this.name+'</p>'+
								'</div>');
					div.hover(function(){
						var clicktime = $(this).attr("clicktime");
						if(clicktime == 1)
							return false;
						$(this).css("background-color","rgb(23,26,31)");
					},function(){
						var clicktime = $(this).attr("clicktime");
						if(clicktime == 1)
							return false;
						$(this).css("background-color","");
					});
					div.click(function(){
						var type = $(this).attr("compType");
						var customToolEvent = nodeFunction.nodeFactory.getCustomComEventByType(type);
						if(customToolEvent != null){
							if(customToolEvent.click != null)
							{
								customToolEvent.click({
									nodeFactory:nodeFunction.nodeFactory,
									node:nodeFunction.getToolsNodeByType(type),
									el:$(this)
								});
								return;
							}
						}
						//清除同级的clicktime
						$(this).siblings().removeAttr("clicktime");
						$(this).siblings().css("background-color","");
						var clicktime = $(this).attr("clicktime");
						if(clicktime == 1)
						{
							$(this).removeAttr("clicktime");
							$(this).css("background-color","");
							nodeFunction.getNodeEntry().drawLineFlag = false;
							return false;
						}
						
						$(this).attr("clicktime",1);
						$(this).css("background-color","rgb(23,26,31)");
						
						if((type == "line" || type == "arrow" || type == "layer") && 
								nodeFunction.getNodeEntry().scene.scaleX == 1)//没有缩放的情况下才能拖拽画
						{
							nodeFunction.getNodeEntry().drawLineFlag = true;
						}
						else if((type == "line" || type == "arrow" || type == "layer") && 
								nodeFunction.getNodeEntry().scene.scaleX != 1 && 
								nodeFunction.getNodeEntry().alert != true)//有缩放的情况就不让拖拽画线
							{
							nodeFunction.getNodeEntry().drawLineFlag = false;
						}
						if((type == "line" || type == "arrow" || type == "layer"))
							nodeFunction.getNodeEntry().LineType = type;
						
					});
					var pageX,pageY;
					div.find('img').bind("dragstart",function (ev){
						return true;
					}).bind("dragend",dropHandler);
					$("#canvasDraw").bind("dragenter",function (ev){
						return false;
					}).bind("dragleave",function (ev){
						return false;
					}).bind("dragover",function (ev){
						if(navigator.userAgent.indexOf("Firefox")>0){
							pageX = ev.originalEvent.pageX;
							pageY = ev.originalEvent.pageY;
						}
						return false;
					}).bind("drop",function (ev){
						return false;
					});
					function dropHandler(ev){
						ev.preventDefault();
						// console.log(ev);

						var endx,endy;
						var originalEvent = ev.originalEvent;
						if(navigator.userAgent.indexOf("Firefox")>0){
							endx = pageX;
							endy = pageY;
						}else {
							endx = originalEvent.pageX;
							endy = originalEvent.pageY;
						}

						var el = $(this).parent();

						el.siblings().removeAttr("clicktime");
						el.siblings().css("background-color","");
						el.css("background-color","");
						
						var type = el.attr("compType");
						var customToolEvent = nodeFunction.nodeFactory.getCustomComEventByType(type);
						if(customToolEvent != null){
							if(customToolEvent.dblclick != null)
							{
								customToolEvent.dblclick({
									nodeFactory:nodeFunction.nodeFactory,
									node:nodeFunction.getToolsNodeByType(type),
									el:el
								});
								return;
							}
						}
						if(type != "line" && type != "arrow" && type != "layer")
						{
							nodeFunction.getNodeEntry().drawLineFlag = false;
							var toolsNode =  nodeFunction.getOneToolsNodeByType(type);
							if(toolsNode != null){
								toolsNode.attributes.cloneCount = toolsNode.attributes.cloneCount+1;
								var tempnode = nodeFunction.copyNode(toolsNode.attributes);
								nodeFunction.setNodeMaxId(nodeFunction.getNodeMaxId()+1);
								tempnode.id=nodeFunction.getNodeMaxId();
								tempnode.name=toolsNode.attributes.name+"-clone"+toolsNode.attributes.cloneCount;
								toolsNode.cloneCount = toolsNode.cloneCount+1;
								var scaleX = nodeFunction.getNodeEntry().scene.scaleX;
								var scaleY = nodeFunction.getNodeEntry().scene.scaleY;
								var canvasHeight = $("#canvasDraw").height();
								var canvasWidth = $("#canvasDraw").width();
								var ox = nodeFunction.getNodeEntry().scene.getOffsetTranslate().translateX;
								var oy = nodeFunction.getNodeEntry().scene.getOffsetTranslate().translateY
								// canvasWidth*(1-1/scaleX)
								tempnode.x = (endx-tempnode.width/2*scaleX)*1/scaleX-ox;
								tempnode.y = (endy-tempnode.height/2*scaleY)*1/scaleY-oy;
								
								tempnode.myTopoStyle = toolsNode.myTopoStyle;
								//tempnode.healthlevel = "-1";
								
								var node = tempnode.newNode();
								node.configstatus = 0;
								node.domainId = nodeFunction.getNodeEntry().canDrawId;
								node.cannClone = true;
								nodeFunction.getNodeEntry().scene.add(node);
							}
						}
						else 
						{
							return false;
						}
						return false;
					}
					div.dblclick(function(event){
						
						$(this).siblings().removeAttr("clicktime");
						$(this).siblings().css("background-color","");
						$(this).css("background-color","");
						
						var type = $(this).attr("compType");
						var customToolEvent = nodeFunction.nodeFactory.getCustomComEventByType(type);
						if(customToolEvent != null){
							if(customToolEvent.dblclick != null)
							{
								customToolEvent.dblclick({
									nodeFactory:nodeFunction.nodeFactory,
									node:nodeFunction.getToolsNodeByType(type),
									el:$(this)
								});
								return;
							}
						}
						if(type != "line" && type != "arrow" && type != "layer")
						{
							nodeFunction.getNodeEntry().drawLineFlag = false;
							var toolsNode =  nodeFunction.getOneToolsNodeByType(type);
							if(toolsNode != null){
								toolsNode.attributes.cloneCount = toolsNode.attributes.cloneCount+1;
								var tempnode = nodeFunction.copyNode(toolsNode.attributes);
								nodeFunction.setNodeMaxId(nodeFunction.getNodeMaxId()+1);
								tempnode.id=nodeFunction.getNodeMaxId();
								tempnode.name=toolsNode.attributes.name+"-clone"+toolsNode.attributes.cloneCount;
								toolsNode.cloneCount = toolsNode.cloneCount+1;
								tempnode.x = (200-nodeFunction.getNodeEntry().scene.translateX)*nodeFunction.getNodeEntry().sizeProportion;
								tempnode.y = (200-nodeFunction.getNodeEntry().scene.translateY)*nodeFunction.getNodeEntry().sizeProportion;
								//根据实际的缩放比例设置高宽度
								tempnode.width = nodeFunction.getNodeEntry().sizeProportion*tempnode.width;
								tempnode.height = nodeFunction.getNodeEntry().sizeProportion*tempnode.height;
								tempnode.myTopoStyle = toolsNode.myTopoStyle;
								//tempnode.healthlevel = "-1";
								
								var node = tempnode.newNode();
								node.configstatus = 0;
								node.domainId = nodeFunction.getNodeEntry().canDrawId;
								node.cannClone = true;
								nodeFunction.getNodeEntry().scene.add(node);
							}
						}
						else 
						{
							try{
								if(checkIsNULL(nodeFunction.getNodeEntry().dblclicTimes) == true)
									nodeFunction.getNodeEntry().dblclicTimes = 1;
								else
									nodeFunction.getNodeEntry().dblclicTimes +=1;
								var location = new Object();
								location.x = (400-nodeFunction.getNodeEntry().scene.translateX);
								location.y = (100-nodeFunction.getNodeEntry().scene.translateY)+nodeFunction.getNodeEntry().dblclicTimes*8;
								
								//第一个点
								var _node = nodeFunction.nodeFactory.node.createNode(nodeFunction.getNodeEntry().canDrawId);
								_node.x = (location.x);
								_node.y = (location.y);
								_node.width = 4;
								_node.height = 4;
								//第二个点
								var _node2 = nodeFunction.nodeFactory.node.createNode(nodeFunction.getNodeEntry().canDrawId);
								_node2.x = location.x+100;
								_node2.y = location.y;
								_node2.width = 4;
								_node2.height = 4;
								
								
								//初始化第一个点
								_node.id=nodeFunction.getNodeEntry().LineType+"start_"+nodeFunction.getNodeEntry().drawLineClickTimes;
								_node.type=nodeFunction.getNodeEntry().LineType+"Start";
								var temp1 = _node.newNode();
								nodeFunction.getNodeEntry().drawLineNodes[0] = new Object();
								nodeFunction.getNodeEntry().scene.add(temp1);
								//初始化第二个点
								nodeFunction.getNodeEntry().drawLineClickTimes = nodeFunction.getNodeEntry().drawLineClickTimes + 1;
								_node2.id=nodeFunction.getNodeEntry().LineType+"end_"+nodeFunction.getNodeEntry().drawLineClickTimes;
								_node2.type=nodeFunction.getNodeEntry().LineType+"End";
								var temp2 = _node2.newNode();
								nodeFunction.getNodeEntry().drawLineNodes[1] = new Object();
								nodeFunction.getNodeEntry().scene.add(temp2);
								
								//设置节点数
								nodeFunction.getNodeEntry().drawLineClickTimes = nodeFunction.getNodeEntry().drawLineClickTimes + 1;
								//将两点连接起来
								_node.newLink(nodeFunction.getNodeEntry().scene,
										nodeFunction.findNodeByScene(nodeFunction.getNodeEntry().scene,temp1.id),
										nodeFunction.findNodeByScene(nodeFunction.getNodeEntry().scene,temp2.id),"",
										nodeFunction.getNodeEntry().LineType);
								//状态还原
								nodeFunction.reSetDrawLineParam();
							}catch(e){
								alert(e);
							}

						}
						
					});
					
					return div;
				},
				//
				newTextNode:function(id){
					var textNode = new JTopo.TextNode(this.name);
					textNode.name = this.name;
					if(checkIsNULL(this.fontSize) == true){
						this.fontSize = 60;
					}
					if(checkIsNULL(id) == false)
					{
						textNode.id = this.id;
					}
					else{
						textNode.id = (Math.random()*1000000+"");
					}

					textNode.id = textNode.id.replace(".","");
					textNode.cannClone = true;
		            textNode.font = 'bold '+this.fontSize+'px 微软雅黑';
		            textNode.fontSize = this.fontSize;
		            textNode.fontColor = this.fontColor;
		            textNode.setLocation(Number(this.x), Number(this.y));
		            textNode.type = this.type;
		            textNode.compType = this.compType;
		            textNode.cloneCount = this.cloneCount;
		            textNode.attributes = this;
		            nodeFunction.getNodeEvent().addEventForNode(textNode);
		            return textNode;
				},
				newCustomNodeParent:function(){
					var name = this.name;
				    var node = new JTopo.Node(name);
				    node.name = name;
				    node.type = this.type;
				    node.isClone = this.isClone;
				    node.compType = this.compType;
					node.cloneCount = this.cloneCount;
					node.attributes = this;
					return node;
				},
				newCustomNode:function(){
					var typeObj = null;
					if(checkIsNULL(this.type) == true){
						this.type=nodeFunction.getNodeEntry().customComTypes[0].type;
						typeObj = nodeFunction.getNodeEntry().customComTypes[0];
					}
					else{
						for(var i=0;i<nodeFunction.getNodeEntry().customComTypes.length;i++){
							if(nodeFunction.getNodeEntry().customComTypes[i].type == this.type){
								typeObj = nodeFunction.getNodeEntry().customComTypes[i];
								break;
							}
						}
					}
					if(typeObj == null){
						this.type=nodeFunction.getNodeEntry().customComTypes[0].type;
						typeObj = nodeFunction.getNodeEntry().customComTypes[0];
					}
					
					var defaultNode = null;
					if(typeObj.classStr == "CircleNode"){
						defaultNode = new JTopo.CircleNode(this.name);
						
					}
					else if(typeObj.classStr == "Node"){
						defaultNode = new JTopo.Node();
						defaultNode.text = this.name;
					}
					if(checkIsNULL(this.id) == false)
					{
						defaultNode.id = this.id;
					}
					else{
						nodeFunction.setNodeMaxId(nodeFunction.getNodeMaxId()+1);
						defaultNode.id=nodeFunction.getNodeMaxId();
					}

					defaultNode.name = this.name;
		            defaultNode.textPosition = 'Middle_Center';// 文字居中
		            
		            var height = 36;
		            var width = 100;
		            if(checkIsNULL(this.fontSize) == false){

		            	defaultNode.font = this.fontSize+'px 微软雅黑';
		            	height = Number(this.fontSize)+20;
		            	width = this.name.length*Number(this.fontSize)+20;
		            }
		            else
		            {
		            	defaultNode.font = '12px 微软雅黑';
		            	width = this.name.length*12+20;
		            }
		            if(typeObj.classStr == "CircleNode"){
		            	//圆就固定32
		            	defaultNode.radius = 32; // 半径
		            }
		            else if(typeObj.classStr == "Node"){
			            defaultNode.setSize(width, height);  // 尺寸
			            defaultNode.borderRadius = 5; // 圆角
			            defaultNode.borderWidth = 2; // 边框的宽度
			            defaultNode.borderColor = '255,255,255'; //边框颜色   
		            }
		            defaultNode.fillColor = this.fillColor; // 填充颜色
		            defaultNode.cannClone = true;
		            defaultNode.fontSize = this.fontSize;
		            defaultNode.fontColor = this.fontColor;
		            defaultNode.alpha = this.alpha; //透明度
		            if(checkIsNULL(defaultNode.alpha) == true)
		            	defaultNode.alpha = 1;
		            defaultNode.setLocation(Number(this.x), Number(this.y));
		            
		            defaultNode.type = this.type;
		            defaultNode.compType = this.compType;
				    defaultNode.monitor = this.monitor;
				    
				    //挂载监控器的提示
				    defaultNode.myTopoStyle = this.myTopoStyle;
				    defaultNode.healthlevel = this.healthlevel;
				    defaultNode.configstatus = this.configstatus;
				    defaultNode.customnode = true;
		            
		            defaultNode.attributes = this;
		            nodeFunction.getNodeEvent().addEventForNode(defaultNode);
		            return defaultNode;
				},
				newNode:function(id)
				{
					var x = Number(this.x) ;
					var y = Number(this.y);
					var w = Number(this.width);
					var h = Number(this.height);
					var name = this.name;
					var imgurl = this.bimg;
					
				    var node = new JTopo.Node(name);
				    if(id!=undefined)
				    	node.id = id;
				    else
				    	node.id = this.id;
				    node.name = name;
				    //是否需要求情暂时没用
				    if(this.queryMonitorUrl != undefined)
				    	node.queryMonitorUrl = this.queryMonitorUrl;
				    if(this.alpha !=undefined)
				    	node.alpha = this.alpha;
				    //类型
				    node.type = this.type;
				    node.isClone = this.isClone;
				    if(this.cannClone != undefined)
				    	node.cannClone = this.cannClone;
				    if(this.mounts != undefined)
				    	node.mounts = this.mounts;
				    node.setLocation(x, y);
				    node.setSize(w, h);
				    if(imgurl!=null)
				    	node.setImage(imgurl);
				    
	
				    node.compType = this.compType;
					node.cloneCount = this.cloneCount;
					node.monitor = this.monitor;
					//特殊处理一下
					if(this.lineColor!=undefined)
						node.lineColor = this.lineColor;
					if(this.lineSize != undefined)
						node.lineSize = this.lineSize;
					if(this.lineText != undefined)
						node.lineText = this.lineText;
					//处理自由线条
					if(checkIsNULL(this.lineModel) == false){
						node.lineModel = this.lineModel;
					}
					if(checkIsNULL(this.lineAlpha) == false){
						node.lineAlpha = this.lineAlpha;
					}
					//
					if(checkIsNULL(this.bossDisplayType) == false){
						node.bossDisplayType = this.bossDisplayType;
					}
					//

					//
					node.myTopoStyle = this.myTopoStyle;
					node.healthlevel = this.healthlevel;
					node.configstatus = this.configstatus;
					node.fillColor = '32,42,52';
					
					node.attributes = this;
					nodeFunction.getNodeEvent().addEventForNode(node);
				    return node;
				},

				linkNode:function(_scene,startNode,endNode,color,text,size){
					this.id = startNode.id+"::"+endNode.id;
					var modify = nodeFunction.findModifyStyle(startNode, endNode.id);
					color = modify.lineColor;
					text = modify.lineText;
					size = modify.lineSize;
					
					
					var link = null;
					if(startNode.lineModel == "FoldLink")
						link = new JTopo.FoldLink(startNode, endNode, text);
					else if(startNode.lineModel == "FlexionalLink")
						link = new JTopo.FlexionalLink(startNode, endNode, text);
					else if(startNode.lineModel == "SquarelyFlexionalLink"){
						link = new JTopo.SquarelyFlexionalLink(startNode, endNode, text);
						if(checkIsNULL(startNode.offsetGap) == false)
							link.offsetGap = startNode.offsetGap;
					}
					else
						link = new JTopo.Link(startNode, endNode, text);
				    link.arrowsRadius = 10; //箭头大小
				    if(startNode.lineModel ==  "NoLink")
				    	link.arrowsRadius = 0; //箭头大小
				    link.lineWidth = 2; // 线宽
				    link.strokeColor = '0,200,200';//JTopo.util.randomColor(); // 线条颜色随机
				    link.bundleGap = 20; // 线条之间的间隔
				    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
				    link.type = "dependence";
				    link.id=this.id;
				    link.alpha = 0.5;
				    if(checkIsNULL(startNode.lineAlpha) == false ){
				    	link.alpha = startNode.lineAlpha;
				    }
				    
				    if(color!=undefined && color!="")
				    	link.strokeColor = color;
				    
				    if(size!=undefined && size!="")
				    	link.lineWidth = size;
				    
				    if(startNode.dependenceRatio == "10" && 
				    		startNode.dependenceType == "REF"){
				    	link.dashedPattern = 4;
				    }
				    if(checkIsNULL(startNode.direction) == false)
				    	link.direction = startNode.direction;
				    link.attributes = new Object();
				    link.attributes.start = startNode;
				    link.attributes.end = endNode;
				    link.x = startNode.x;
				    link.y = startNode.y;
				    if(nodeFunction.getNodeEntry().isEditer==true)
				    	nodeFunction.getNodeEvent().linkDbClick(link);
				    _scene.add(link);
					//添加事件监控一遍回退
				},
				newLink:function(scene,startNode,endNode, text,type,color,lineSize, dashedPattern){
					this.id = startNode.id+"::"+endNode.id;
		            var link = new JTopo.Link(startNode, endNode, text);     
		            if(type == "arrow")
		            	link.arrowsRadius = 8; //箭头大小
		            if(type == "layer"){
		            	link.dashedPattern = 4;
		            	link.lineWidth = 1; // 线宽
		            	link.strokeColor = '206,206,206';
		            }
		            else{
		            	link.dashedPattern = dashedPattern; // 虚线
		            	link.lineWidth = 3; // 线宽
		            	link.strokeColor = '0,200,255';
		            }
		            if(color != undefined && color != "")
		            	link.strokeColor = color;
		            
		            if(lineSize !=undefined && lineSize != "")
		            	link.lineWidth = lineSize;
		            
		            link.alpha = 0.5;
				    if(checkIsNULL(startNode.lineAlpha) == false ){
				    	link.alpha = startNode.lineAlpha;
				    }
		            
		            link.bundleOffset = 60; // 折线拐角处的长度
		            link.bundleGap = 20; // 线条之间的间隔
		            link.textOffsetY = 3; // 文本偏移量（向下3个像素）
		            
		            startNode.lineWidth = link.lineWidth;
		            startNode.lineColor = link.strokeColor;
		            endNode.lineWidth = link.lineWidth;
		            endNode.lineColor = link.strokeColor;
		            link.type = type;//线段
		            link.id=this.id;
		            if(nodeFunction.getNodeEntry().isEditer==true)
		            	nodeFunction.getNodeEvent().linkDbClick(link);
		            scene.add(link);
					//添加事件监控一遍回退
//					nodeFunction.addNodeObjListener(link);
		        },
		        
				createNode:function(domainId){
					var node = $.extend(true, {}, this);
					node.x = $("#"+domainId).offset().left;
					node.y = $("#"+domainId).offset().top;
					node.width = nodeFunction.getNodeEntry().size[0];
					node.height = nodeFunction.getNodeEntry().size[1];
					node.domainId = domainId;
					return node;
				}
			}
			
	}
});