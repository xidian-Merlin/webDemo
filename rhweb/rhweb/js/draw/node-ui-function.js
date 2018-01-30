define([
	'/js/plugin/dialog/dialog.js',
	'/js/draw/node-ui-param.js',
	'/js/lib/JsonTools.js',
	'/js/plugin/topo/jtopo-0.4.8-dev.js',
	'/js/draw/node-ui-event.js',
    ],function (dialog,nodeEntry,JsonTools,jtopo,_nodeEvent){

	return{
		nodeFactory:null,
		nodeEvent:null,
		setEnCode:function(arr){
			nodeEntry.enCode = arr;
		},
		getJson2xml:function(){
			return this.nodeFactory.json2xml;
		},
		nodeIsHidden:function(node){
			if(node.bossDisplayType == '0')
				return true;
			return false;
		},
		setCustomComTypes:function(array){
			nodeEntry.customComTypes = array;
		},
		setSize:function(w,h){
			nodeEntry.size[0] = w;
			nodeEntry.size[1] = h;
		},
		setAppSystemName:function(name){
			nodeEntry.appSystem = name;
		},
		isShowMonitorImgInEdit:function(){
			nodeEntry.showMonitorImgInEdit = true;
		},
		//重要
		getNodeEvent:function(){
			return this.nodeEvent;
		},
		//重要
		getNodeEntry:function(){
			return nodeEntry;
		},
		//重要
		getNodeFactory:function(){
			return this.nodeFactory;
		},
		//重要
		setNodeFactory:function(nodeFactory){
			this.nodeFactory = nodeFactory;
			//初始化事件
			_nodeEvent.setNodeFunction(this);
			this.nodeEvent = _nodeEvent;
		},
		
		setNodeMaxId:function(nodeMaxId){
			nodeEntry.nodeMaxId = nodeMaxId;
		},
		getNodeMaxId:function(){
			return nodeEntry.nodeMaxId;
		},
		getSceneXY:function(){
			return [nodeEntry.scene.translateX,nodeEntry.scene.translateY];
		},
		isAddApp:function(url){
			nodeEntry.scene.translateX = -2500;
			nodeEntry.scene.translateY = -2500;
			nodeEntry.addApp = true;
			nodeEntry.addAppUrl = url;
		},
		addAppStatus:function(){
			return nodeEntry.addApp;
		},
		isEditerJob:function(){
			nodeEntry.isEditer = true;
		},
		setCustomMonitorImgePath:function(path,suffix){
			nodeEntry.customMonitorImgePath = path;
			if(suffix!=undefined)
				nodeEntry.imgsuffix = suffix;
		},
		setImgePath:function(path){
			nodeEntry.imgPath = path;
		},
		 _clearTimer:function(_timer){
			if(_timer!=null){
				clearTimeout(_timer);
				_timer = null;
				this.queryNodeMonitorStatusIdex = 0;
				this.queryNodeMonitorStatusDownIdex = 0;
				this.queryNodeMonitorStatusDownTime = 0;
			}
		},
		firstInitData : null,
		queryNodeMonitorStatusIdex : 0,
		queryNodeMonitorStatusDownIdex : 0,
		queryNodeMonitorStatusDownTime : 0,
		queryNodeMonitorStatusTimer : null,
		getAllMonitors:function(pObj)
		{
			var allNodes = nodeEntry.scene.getAllNodes();
			if(pObj.queryNodeMonitorStatusIdex >= allNodes.length)
			{
				//大于5秒就结束
				if(this.queryNodeMonitorStatusDownTime > 4)
				{
					pObj._clearTimer(this.queryNodeMonitorStatusTimer);
					
					return;
				}
				//已完成
				if(pObj.queryNodeMonitorStatusDownIdex >= pObj.queryNodeMonitorStatusIdex)
				{
					pObj._clearTimer(pObj.queryNodeMonitorStatusTimer);
					return ;
				}
				else
					pObj.queryNodeMonitorStatusTimer = setTimeout(function(){ pObj.getAllMonitors(pObj);}, 500);
				pObj.queryNodeMonitorStatusDownTime = pObj.queryNodeMonitorStatusDownTime+1;
				return ;
			}
			else
			{
				var node = allNodes[pObj.queryNodeMonitorStatusIdex];
//				if(nodeEntry.isEditer == false && nodeEntry.queryOneMonitorStatusByIdUrl != "" && node.monitor != undefined && node.monitor.entry != undefined && node.monitor.entry != null)
//				{
//					//获取监控器状态
//					um_ajax_get({
//						url : nodeEntry.queryOneMonitorStatusByIdUrl,
//						paramObj : {monitorId : compId},
//						isLoad : false,
//						successCallBack : function (data){
//							pObj.queryNodeMonitorStatusDownIdex = pObj.queryNodeMonitorStatusDownIdex+1;
//						}
//					});
//				}
//				else 
				if(nodeEntry.isEditer == true && node.monitor != undefined && node.monitor.id != undefined && node.monitor.entry == undefined)
				{
					//先查监控器
					um_ajax_get({
						url : nodeEntry.queryMonitorUrl + "?&compType="+node.type,
						isLoad : false,
						successCallBack : function (data){
							while(data.indexOf("\\")!=-1){
								data = data.replace("\\","");
							}
							pObj.queryNodeMonitorStatusDownIdex = pObj.queryNodeMonitorStatusDownIdex+1;
							if(data == "" || undefined)
								return;
							var jsonObj = json2xml.xml_str2json(data).root.item;
							var index = nodeEntry.monitors.length;
							//保存到全局中，
							if(nodeEntry.monitors[index] == undefined)
								nodeEntry.monitors[index] = new Object();
							nodeEntry.monitors[index].compType = node.type;
							nodeEntry.monitors[index].list = jsonObj;
							//这么处理也实属无赖...
							for(var j=0;j<nodeEntry.monitors[index].list.length;j++){
								if(nodeEntry.monitors[index].list[j].en_type != undefined)
									nodeEntry.monitors[index].list[j].type = nodeEntry.monitors[index].list[j].en_type;
							}
							var nodes = nodeEntry.scene.getAllNodes();
							for(var i=0;i<nodes.length;i++){

								if(nodes[i].monitor != undefined && nodes[i].monitor.id != undefined){
									//将自己挂载的监控器取过来
									for(var j=0;j<jsonObj.length;j++){
										if(nodes[i].monitor.id == jsonObj[j].id){
											nodes[i].monitor = new Object();
											nodes[i].monitor.entry = jsonObj[j];
											if(nodes[i].monitor.entry.en_type != undefined)
												nodes[i].monitor.entry.type = nodes[i].monitor.entry.en_type;
											break;
										}
									}
								}
							}


						}
					});
				}
				else
					pObj.queryNodeMonitorStatusDownIdex = pObj.queryNodeMonitorStatusDownIdex+1;
				//已经查询到第几条数据
				pObj.queryNodeMonitorStatusIdex = pObj.queryNodeMonitorStatusIdex+1;
			}
				
			this.queryNodeMonitorStatusTimer = setTimeout(function(){ pObj.getAllMonitors(pObj);}, 80);
			
		},
		getToolsNodeList:function(){
			return nodeEntry.toolsNodeList;
		},
		getOneToolsNodeByType:function(type){
			for(var i=0;i<nodeEntry.toolsNodeList.length;i++){
				if(nodeEntry.toolsNodeList[i].compType == type){
					return nodeEntry.toolsNodeList[i];
				}
			}
			return null;
		},
		addToolsNodeList:function(node){
			nodeEntry.toolsNodeList[nodeEntry.toolsNodeList.length] = node;
		},
		getToolsNodeByType:function(type){
			for(var i=0;i<nodeEntry.toolsNodeList.length;i++){
				if(nodeEntry.toolsNodeList[i].type == type)
					return nodeEntry.toolsNodeList[i];
			}
			return null;
		},
		backToDataList:function(url){
			var pObj = this;
			if(this.firstInitData !=null){
				g_dialog.operateConfirm("是否保存？",{saveclick : function (){
					pObj.exportJSONData();
				}});
			}
			window.location.href = url;
		},
		backToFirstIn:function(){
			var pObj = this;
			if(this.firstInitData !=null){
				g_dialog.operateConfirm("返回到初始化状态？",{saveclick : function (){
					pObj.emptyScene();
					pObj.initPanelData(nodeEntry.drawAppId);
				}});
			}
		},
		goBackState:function(){
			
		},
		doinitPanelData:function(root){
			this.firstInitData = root;
			var jsonObj = null;
			var dependence = null;
			var pLines = null;
			var containerObjs = null;
			var texts = null;
			if(root.item instanceof Array){
				jsonObj = root.item;
			}else {
				jsonObj = new Array();
				if(root.item != null && root.item != undefined)
					jsonObj[0] = root.item;
			}
			if(root.dependence != undefined){
				if(root.dependence instanceof Array){
					dependence = root.dependence;
				}else{
					dependence = new Array();
					dependence[0] = root.dependence;
				}
			}

			if(root.line != undefined){
				if(root.line instanceof Array)
				{
					pLines = root.line;
				}else
				{
					pLines = new Array();
					pLines[0] = root.line;
				}
			}
			
			if(root.textnode != undefined){
				if(root.textnode instanceof Array)
				{
					texts = root.textnode;
				}else
				{
					texts = new Array();
					texts[0] = root.textnode;
				}
			}
			//分组
			if(root.container != undefined){
				if(root.container instanceof Array){
					containerObjs = root.container;
				}else{
					containerObjs = new Array();
					containerObjs[0] = root.container;
				}
			}
			//将root保存
			nodeEntry.drawScalingX = Number(root.x);
			nodeEntry.drawScalingY = Number(root.y);
			//默认画布是宽：5000,高：5000
			nodeEntry.scene.translateX = nodeEntry.drawScalingX;
			nodeEntry.scene.translateY = nodeEntry.drawScalingY;
			
			
			root.item = undefined;
			root.dependence = undefined;
			root.line = undefined;
			root.text = undefined;
			//定义在param中
			nodeEntry.rootObj = root;
			nodeEntry.scene.scaleX = nodeEntry.rootObj.zoom;
			nodeEntry.scene.scaleY = nodeEntry.rootObj.zoom;
			nodeEntry.sizeProportion = 1;
			//
			if(pLines != null && pLines != undefined)
			{
				for(var i=0;i<pLines.length;i++)
				{
					var flag = false;
					//检查是否有重复的ID
					for(var j = 0 ;j<jsonObj.length;j++){
						try{
							if(jsonObj[j].id == pLines[i].id)
							{
								flag = true;
								break;
							}
						}catch(e){}
					}
					if(flag == true)
						continue;
					var node = this.nodeFactory.node.createNode(nodeEntry.canDrawId);
					//将item复制
					node = $.extend(true, node, pLines[i]);
					//初始化 drawLineClickTimes ，设置线段的起始计数ID
					if(Number(pLines[i].id.split("_")[1]) > Number(nodeEntry.drawLineClickTimes))
						nodeEntry.drawLineClickTimes = Number(node.id.split("_")[1]);
					//如果是非编辑状态下需要隐藏
					if(nodeEntry.isEditer == false){
						node.alpha = 0;
					}
					node.isLine = true;
					jsonObj.insert(jsonObj.length, node);
				}
			}
			//画文字
			if(texts != null){
				for(var i=0;i<texts.length;i++){
					var node = this.nodeFactory.node.createNode(nodeEntry.canDrawId);
					if(checkIsNULL(texts[i].name) == true){
						continue;
					}
					node = $.extend(true, node, texts[i]);
					nodeEntry.scene.add(node.newTextNode(node.id));
				}
			}
			// 不指定布局的时候，容器的布局为自动(容器边界随元素变化）
			for(var i=0;i<jsonObj.length;i++){
		    	//bossDisplayType
				if(checkIsNULL(jsonObj[i].bossDisplayType) == false){
					//编辑状态下生效
					if(nodeEntry.isEditer == true){
						//
					}
					//如果是隐藏
					else if(this.nodeIsHidden(jsonObj[i]) == true){
//						jsonObj[i].alpha = 0;
						continue;
					}
						
				}

				//野节点,这是垃圾数据
				if(jsonObj[i].type == "node"){
					continue;
				}
				var node = this.nodeFactory.node.createNode(nodeEntry.canDrawId);
				var w1 = Number(node.width);
				//将item复制
				node = $.extend(false, node, jsonObj[i]);
				//
				if(nodeEntry.enCode.length>0){
					for(var l=0;l<nodeEntry.enCode.length;l++){
						var code = nodeEntry.enCode[l];
						//反编码
						
						if(node.name.indexOf(code.code)!=-1){
							node.name = node.name.replace(code.backRep,code.text);
						}
						//反编码
						if(node.compName.indexOf(code.code)!=-1){
							node.compName = node.compName.replace(code.backRep,code.text);
						}
					}

				}

				if(node.compType == "" || node.compType == undefined){
					node.compType = node.type;
				}
				if(		(node.type == "" || node.type == undefined || node.type =="node") && 
						(node.compType != "" && node.compType != undefined)){
					node.type = node.compType;
				}
				//如果挂载了监控器
				if(node.compId != "" && node.compId != undefined){
					node.monitor = new Object();
					node.monitor.id = node.compId;
					//有配置监控
					node.configstatus = 1;
					if(node.monitor.id == nodeEntry.rootObj.id){
						if(checkIsNULL(node.bossDisplayType)==true){
							node.bossDisplayType = 1;
						}
							
					}
					//只要有监控器
					{
						node.monitor.entry = new Object();
						node.monitor.entry.id = node.compId;
						node.monitor.entry.name = node.compName;
						node.monitor.entry.type = node.compTypeC;
					}
				}
				else{
					if(nodeEntry.isEditer == true)
						node.configstatus = undefined;
					else
						node.configstatus = 0;
					node.compTypeC = "";
				}
				//isEditer
				if(nodeEntry.isEditer == true)//是编辑状态
				{
					if(nodeEntry.showMonitorImgInEdit == true && node.compTypeC != "" && node.compTypeC != undefined)
						node.bimg = nodeEntry.customMonitorImgePath+node.compTypeC+nodeEntry.imgsuffix;//".svg";
					else
						node.bimg = nodeEntry.imgPath+node.type+".svg";
				}
				else 
				{
					if(node.compTypeC != "" && node.compTypeC != undefined)
					{
						node.bimg = nodeEntry.customMonitorImgePath+node.compTypeC+nodeEntry.imgsuffix;//".svg";
					}
					else
						node.bimg = nodeEntry.customMonitorImgePath+node.compType+nodeEntry.imgsuffix;//".svg";
				}
				//如果有自定义图片
				if(checkIsNULL(node.imgurl)==false){
					node.bimg = node.imgurl;
					node.imgurl = null;
				}
				//重新初始化高，宽度
				if(node.isLine == true){
					node.width = 4;
					node.height = 4;
				}
				else{
					node.width = this.getNodeEntry().size[0];
					node.height = this.getNodeEntry().size[1];
				}

					
				//
				//如果没有大类类型
				if(nodeEntry.nodeMaxId == 0)
				{
					nodeEntry.nodeMaxId = Number(node.id);
				}
				else if(Number(node.id) > nodeEntry.nodeMaxId)
				{
					nodeEntry.nodeMaxId = Number(node.id);
				}
		    	node.cannClone = true;
		    	var tempnode = null;
		    	if(checkIsNULL(node.customnode)== false && (node.customnode == true || node.customnode == 'true')){
		    		node.old = true;
		    		tempnode = node.newCustomNode();
		    	}
		    	else{
		    		tempnode = node.newNode();
		    	}
		    	
		    	
		    	
		    	nodeEntry.scene.add(tempnode);
				
			}

			//转换连接线
			if(dependence != null){
				for(var i=0;i<dependence.length;i++)
				{

					//
					var dep = dependence[i];
					if(dep.dependenceRatio == undefined || dep.dependenceRatio == "undefined" || dep.dependenceRatio == "NaN")
						dep.dependenceRatio = "80";
					if(dep.dependenceType == undefined || dep.dependenceType == "undefined" || dep.dependenceType == "NaN")
						dep.dependenceType = "KEY";
					var endNode = this.findNodeByScene(nodeEntry.scene,dep.endId);
					//出现这种情况只有在显示的时候，有隐藏节点
					if(checkIsNULL(endNode) == true)
						continue;
					var startNode = this.findNodeByScene(nodeEntry.scene,dep.startId);
					if(checkIsNULL(startNode) == true)
						continue;
					if(endNode.mounts == undefined)
						endNode.mounts = new Array();
					var index = endNode.mounts.length;
					endNode.mounts[index] = new Object();
					endNode.mounts[index].id = dep.startId;
					endNode.mounts[index].visible = dep.visible;
					endNode.mounts[index].dependenceRatio = dep.dependenceRatio;
					endNode.mounts[index].dependenceType = dep.dependenceType;
					startNode.dependenceRatio = dep.dependenceRatio;
					startNode.dependenceType = dep.dependenceType;
					//设置模式
					if(checkIsNULL(dep.lineModel) == false){
						startNode.lineModel = dep.lineModel;
					}
					else{
						startNode.lineModel = "Link";
					}
					//设置透明度
					if(checkIsNULL(dep.lineAlpha) == false){
						startNode.lineAlpha = dep.lineAlpha;
					}
					if(checkIsNULL(dep.offsetGap) == false){
						startNode.offsetGap = dep.offsetGap;
					}
					if(checkIsNULL(dep.direction) == false){
						startNode.direction = dep.direction;
					}
					//
					


					//将有修改个线条属性存放在起始节点上
					this.putModifyStyle(startNode,dep);
						
					//没有隐藏
					endNode.mounts[index].hidden = false;
					//有隐藏
					if(nodeEntry.isEditer == false && checkIsNULL(endNode.bossDisplayType) == false){
						//不显示
						if(this.nodeIsHidden(endNode) == true){
							endNode.mounts[index].hidden = true;
						}
						else{
							endNode.mounts[index].hidden = false;
						}
					}
					else if(dep.hidden != undefined && dep.hidden != ""){
						endNode.mounts[index].hidden = (dep.hidden == "true"?true:false);
					}
				}
			}
			//分组
			this.nodeFactory._group.appendAllNodeToContainer(nodeEntry.scene,containerObjs);
			//获取所有的监控器，监控器获取完成后再画关系连线,如果是编辑状态下
			var allNodes = nodeEntry.scene.getAllNodes();
			this.drawLine(allNodes);
			this.getAllMonitors(this);
			

		},
		putModifyStyle:function(node,dep,ismodify){
			if(node.lineModify == undefined){
				node.lineModify = new Array();
			}
			var i = 0;
			for(;i<node.lineModify.length;i++){
				if(node.lineModify[i].endId == dep.endId){
					break;
				}
			}
			if(node.lineModify[i] == undefined)
				node.lineModify[i] = new Object();
			node.lineModify[i] = $.extend(true, {lineColor:nodeEntry.linkLineColor,lineSize:2,lineText:""}, dep);
			if(checkIsNULL(ismodify)==false)
				node.lineModify[i].ismodify = ismodify;
		},
		findModifyStyle:function(node,endId){
			var i = 0;
			if(node.lineModify != undefined){
				for(;i<node.lineModify.length;i++){
					if(node.lineModify[i].endId == endId){
						if(checkIsNULL(node.lineModify[i].ismodify) == true){
							node.lineModify[i].lineColor = nodeEntry.linkLineColor;
						}
						return node.lineModify[i];
					}
				}
			}
			return {lineColor:nodeEntry.linkLineColor,lineSize:2,lineText:""};
		},
		initPanelData:function(id){
			nodeEntry.drawAppId = id;
			var pObj = this;
			um_ajax_get({
				url : nodeEntry.xmlModuleDataUrl+"&id="+id,
				isLoad : false,
				successCallBack : function (data){
					nodeEntry.tmpXmlObj = json2xml.xml_str2json(data);
					var root = nodeEntry.tmpXmlObj.root;
					console.log(data);
					root.id = nodeEntry.drawAppId;
					root.dataStatus = "UPDATE";
					pObj.doinitPanelData(root);

				}
			});
		},

		setSaveDataUrl:function(url){
			nodeEntry.saveDataUrl = url;
		},
		setXmlModuleUrl:function(url){
			nodeEntry.xmlModuleDataUrl = url;
		},
		setQueryOneMonitorStatusUrl:function(url){
			nodeEntry.queryOneMonitorStatusUrl = url;
		},
		 setQueryOneMonitorStatusByIdUrl:function(url){
			 nodeEntry.queryOneMonitorStatusByIdUrl = url;
		},
		 setQueryMonitorUrl:function(url){
			 nodeEntry.queryMonitorUrl = url;
		},
		 fillMonitorData:function(data){
			 var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			if(data.type == undefined)
				$("#"+canDrawShowAttr).find("#mtype").text("");
			else
				$("#"+canDrawShowAttr).find("#mtype").text(data.type);
			$("#"+canDrawShowAttr).find("#mname").text(data.name);
			if(data.assetName == undefined)
				$("#"+canDrawShowAttr).find("#assetname").text("");
			else
				$("#"+canDrawShowAttr).find("#assetname").text(data.assetName);
			$("#"+canDrawShowAttr).find("#monitorObj").show();
			$("#"+canDrawShowAttr).find("#monitorList").hide();
		},
		 refillMonitorData:function(){
			 var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			$("#"+canDrawShowAttr).find("#mtype").text("");
			$("#"+canDrawShowAttr).find("#mname").text("");
			$("#"+canDrawShowAttr).find("#assetname").text("");
			$("#"+canDrawShowAttr).find("#monitorObj").hide();
			$("#"+canDrawShowAttr).find("#monitorList").show();
		},
		 clearAllData:function(){
			 var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			this.refillMonitorData();
			$("#"+canDrawShowAttr).find("#select_monitor1").html("");
			$("#"+canDrawShowAttr).find("#monitorList").hide();
		},
		 getMonitorsByType:function(compType,noid){
			 
			 var pObj = this;
			 
			//线检查一遍如果有监控器就不执行下面的操作
			var nodeid = null;
			if(checkIsNULL(noid) ==false)
				nodeid = noid;
			else
				nodeid = $("#"+nodeEntry.canDrawShowAttr).find("#pid").text();
			var node  = this.findNodeByScene(nodeEntry.scene,nodeid);
			if(		node.monitor != undefined && 
					node.monitor.entry != null && 
					node.monitor.entry != undefined){
				this.fillMonitorData(node.monitor.entry);
				return ;
			}
			var select = $("#"+nodeEntry.canDrawShowAttr).find("#select_monitor1");
			$(select).html("");
			$("#"+nodeEntry.canDrawShowAttr).find("#monitorObj").hide();
			$("#"+nodeEntry.canDrawShowAttr).find("#monitorList").show();
			
			um_ajax_get({
				url : nodeEntry.queryMonitorUrl + "?&compType="+compType,
				isLoad : false,
				successCallBack : function (data){
					while(data.indexOf("\\")!=-1){
						data = data.replace("\\","");
					}
					if(data == "" || data == undefined)
					{
						var select = $("#"+nodeEntry.canDrawShowAttr).find("#select_monitor1");
						$(select).html("");
						$("#"+nodeEntry.canDrawShowAttr).find("#monitorList").hide();
						$("#"+nodeEntry.canDrawShowAttr).find("#monitorObj").hide();
						return;
					}
					var jsonObj = json2xml.xml_str2json(data).root.item;
					if( !(jsonObj instanceof Array) ){
						var temp = jsonObj;
						jsonObj = new Array();
						jsonObj.push(temp);
					}
					if(jsonObj != undefined && jsonObj.length > 0){
						var index = nodeEntry.monitors.length;
						if(index != 0){
							for(var j = 0;j<index;j++){
								if(compType == nodeEntry.monitors[j].compType){
									index = j;
									break;
								}
							}
						}
						if(nodeEntry.monitors[index] == undefined)
							nodeEntry.monitors[index] = new Object();
						nodeEntry.monitors[index].compType = compType;
						nodeEntry.monitors[index].list = jsonObj;
						//这么处理也实属无赖...
						for(var j=0;j<nodeEntry.monitors[index].list.length;j++){
							if(nodeEntry.monitors[index].list[j].en_type != undefined)
								nodeEntry.monitors[index].list[j].type = nodeEntry.monitors[index].list[j].en_type;
						}
						
						//检索一遍查找哪些监控不需要显示
						var nodes  = nodeEntry.scene.getAllNodes();
						
						for(var i = 0;i<nodeEntry.monitors.length;i++){
							for(var j=0;j<nodes.length;j++){
								//大类判断类型
								if(		nodes[j].monitor != null && 
										nodes[j].monitor != undefined && 
										nodes[j].monitor.entry != null && 
										nodes[j].monitor.entry != undefined){
									
									for(var k = 0;k<nodeEntry.monitors[i].list.length;k++){
										//小类判断ID
										if(nodeEntry.monitors[i].list[k].id == nodes[j].monitor.entry.id){
											nodeEntry.monitors[i].list.remove(k);
											break;
										}
									}
									
								}
							}
						}
						
						$("#"+nodeEntry.canDrawShowAttr).find("#monitorObj").hide();
						$("#"+nodeEntry.canDrawShowAttr).find("#monitorList").show();
						//填充到select区
						var select = $("#"+nodeEntry.canDrawShowAttr).find("#select_monitor1");
						$(select).html("");
						for(var i=0;i<nodeEntry.monitors.length;i++)
						{
							//找到大类
							if(nodeEntry.monitors[i].compType == compType){
								for(var j=0;j<nodeEntry.monitors[i].list.length;j++){
									//
									var tr = pObj.createMonitorTr(nodeEntry.monitors[i].list[j],compType);
									tr.hover(function(){
										$(this).css("background-color","rgb(220,220,220)");
									},function(){
										$(this).css("background-color","");
									});
									tr.dblclick(function(){
										$(this).css("background-color","rgb(220,220,220)");
										//挂载
										var mid = $(this).attr("id");
										g_dialog.operateConfirm("添加监控器？",{saveclick : function (){
											var nodeid = $("#"+nodeEntry.canDrawShowAttr).find("#pid").text();
											var node  = pObj.findNodeByScene(nodeEntry.scene,nodeid);
											if(node.monitor == undefined)
												node.monitor = new Object();
											node.monitor.compType = compType;
//											node.configstatus = 1;

											
											for(var l1=0;l1<nodeEntry.monitors.length;l1++){
												
												if(nodeEntry.monitors[l1].compType == compType){
													for(var l2=0;l2<nodeEntry.monitors[l1].list.length;l2++){
														if(mid == nodeEntry.monitors[l1].list[l2].id)
														{
															node.monitor.entry = nodeEntry.monitors[l1].list[l2];
															node.configstatus = 1;
															node.text = node.monitor.entry.name;
															node.name = node.monitor.entry.name;
															if(	nodeEntry.showMonitorImgInEdit == true && 
																checkIsNULL(node.monitor.entry.type) == false &&
																pObj.isCustomNode(node) == false){
																node.setImage(nodeEntry.customMonitorImgePath+node.monitor.entry.type+nodeEntry.imgsuffix);
															}
															//更新宽度
															if(pObj.isCustomNode(node) == true){
																//node.width = getStrLength(node.name.length)/2*Number(node.fontSize)+2;
															}
															//如果添加的监控器是root
															if(checkIsNULL(pObj.getNodeEntry().rootObj) == false  && 
																	node.monitor.entry.id == pObj.getNodeEntry().rootObj.id)
																node.bossDisplayType = 1;
															//设置名称
															$("#"+pObj.canDrawShowAttr).find("#pname").val(node.name);
															pObj.closeCanvasDrawShowAttrDiv();
															pObj.fillMonitorData(node.monitor.entry);
															
															//清空
															return;
														}
													}
												}
											}
										}});
										
									});
									$(select).append(tr);
								}
							}
						}
					}
				},
				//如果失败
				failCallBack:function(data){
					g_dialog.operateAlert(null,"未能获取监控器列表，请稍后重试！","error");
					$("#"+nodeEntry.canDrawShowAttr).find("#monitorObj").hide();
					$("#"+nodeEntry.canDrawShowAttr).find("#monitorList").show();
				}
			});
		},
		createMonitorTr:function(entry,compType){
			if(nodeEntry.appSystem == compType){
				return $('<tr class="um-grid-head-tr" style="border-top-style: none;" id="'+entry.id+'" title="'+entry.name+'">'+
						'<td style="">'+
						'<div style="font-size: 12px;">'+
						'<span class="custom-down" data-id="sort"></span>'+entry.name+
						'<span class="resize" data-id="resize_span"></span>'+
						'</div>'+
						'</td>'+
						'</tr>');
			}
			return $('<tr class="um-grid-head-tr" style="border-top-style: none;" id="'+entry.id+'" title="'+entry.name+'">'+
					'<td style="">'+
					'<div style="font-size: 12px;">'+
					'<span class="custom-down" data-id="sort"></span>'+entry.name+
					'<span class="resize" data-id="resize_span"></span>'+
					'</div>'+
					'</td>'+
					'<td style="">'+
					'<div style="font-size: 12px;text-align:left;">'+
					'<span class="custom-down" data-id="sort"></span>'+(entry.type==undefined?"":entry.type)+
					'<span class="resize" data-id="resize_span"></span>'+
					'</div>'+
					'</td>'+
					'<td style="">'+
					'<div style="font-size: 12px;">'+
					'<span class="custom-down" data-id="sort"></span>'+(entry.assetName==undefined?"":entry.assetName)+
					'<span class="resize" data-id="resize_span"></span>'+
					'</div>'+
					'</td>'+
					'</tr>');
		},
		 queryMonitorStatu:function(){
			
		},
		 unmountMoniter:function(){
			var pObj = this;
			var nodeid = $("#"+nodeEntry.canDrawShowAttr).find("#pname").val();
			g_dialog.operateConfirm("是否删除节点 '"+nodeid+"' 的监控器配置？",{saveclick : function (){
				nodeid = $("#"+nodeEntry.canDrawShowAttr).find("#pid").text();
				var node  = pObj.findNodeByScene(nodeEntry.scene,nodeid);
				if(		node.monitor != undefined && 
						node.monitor.entry != null && 
						node.monitor.entry != undefined){

					node.name = node.name+"(已删除)";
					node.text = node.name;
					if(	nodeEntry.showMonitorImgInEdit == true && 
						pObj.isCustomNode(node) == false)
					{
						node.setImage(nodeEntry.imgPath+node.type+".svg");
					}
					//更新宽度
					if(pObj.isCustomNode(node) == true)
					{
						node.width = (node.name.gblen/2)*Number(node.fontSize)+20;
					}
					//如果添加的监控器是root
					if(		checkIsNULL(pObj.getNodeEntry().rootObj) == false  && 
							node.monitor.entry.id == pObj.getNodeEntry().rootObj.id)
						node.bossDisplayType = undefined;
					
					node.monitor = null;
					node.monitor = new Object();
					node.configstatus = undefined;
					
					pObj.refillMonitorData();
					//重新获取一遍监控器列表
					pObj.getMonitorsByType(node.type);
				}
			}});
		},
		 setMonitors:function(objs,compType){
			 nodeEntry.monitors[monitors.length].compType = compType;
			 nodeEntry.monitors[monitors.length].list = objs;
		},
		 updateScaling:function(){
			try{
			}catch(e){
				
			}

		},
		 formattingJSONData:function(JSONData){
			return jQuery.parseJSON(JSONData);
		},
		 importData:function(JSONobj){

			this.drawNode(JSONobj);
			this.drawLine(JSONobj);
		},
		 drawNode:function(JSONobj){
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			var scene = nodeEntry.scene;
			//画节点
			for(var i=0;i<JSONobj.length;i++){
				var jobj = JSONobj[i];
				var node = this.nodeFactory.node.createNode(canDrawShowAttr);
				node = $.extend(true, node, jobj);
				if(jobj.type.indexOf("arrow") != -1 || 
						jobj.type.indexOf("layer") != -1 ||
						jobj.type.indexOf("line") != -1 ){
					node.alpha = 0;
				}
					
				
				var tempnode = node.newNode();
				scene.add(tempnode);
			}
		},
		 drawLine:function(JSONobj){
			 var scene = nodeEntry.scene;
			//先画普通连线
			for(var i=0;i<JSONobj.length;i++){
				
				var jobj = JSONobj[i];
				if(jobj.type.indexOf("arrow") != -1 || 
						jobj.type.indexOf("layer") != -1 ||
						jobj.type.indexOf("line") != -1 )
					continue;
				var endNode = this.findNodeByScene(scene,jobj.id);
				if(jobj.mounts != undefined)
					endNode.mounts = jobj.mounts;
				else
					continue;
				//自己是终点的
				if(endNode.mounts != undefined){
					for(var j=0;j<endNode.mounts.length;j++)
					{
						if(endNode.mounts[j].hidden != true)
						{
							var startNode = this.findNodeByScene(scene,endNode.mounts[j].id);
							var mofidy = this.findModifyStyle(startNode,endNode.id);
							endNode.attributes.linkNode(scene,
									startNode,
									endNode,
									mofidy.lineColor,
									mofidy.lineText,
									mofidy.lineSize);
						}
					}
				}
			}
			var drawList = new Array();
			//再画自由线段，包括直线、虚线、自由箭头
			for(var i=0;i<JSONobj.length;i++){
				
				var jobj = JSONobj[i];
				if(jobj.type.indexOf("arrow") == -1 && 
						jobj.type.indexOf("layer") == -1 &&
						jobj.type.indexOf("line") == -1 )
					continue;
				var flag = false;
				for(var j=0;j<drawList.length;j++){
					if(drawList[j] == jobj.id){
						flag = true;
						break;
					}
				}
				if(flag == true)
					continue;
				var type = "";
				if(jobj.type.indexOf("arrow") != -1 || 
						jobj.type.indexOf("layer") != -1 ||
						jobj.type.indexOf("line") != -1 )
				{
					if(jobj.type.indexOf("arrow") != -1)
						type = "arrow";
					else if(jobj.type.indexOf("layer") != -1)
						type = "layer";
					else if(jobj.type.indexOf("line") != -1)
						type = "line";
					var startId = "";
					var endId = "";
					if(jobj.id.indexOf(type) != -1){
						if(jobj.id.indexOf(type+"start_") != -1){
							startId = jobj.id;
							var temp  = jobj.id;
							endId = (parseInt(temp.replace(type+"start_",""))+1);
							endId = type+"end_"+endId;
						}
						else
						{
							endId = jobj.id;
							var temp  = jobj.id;
							startId = (parseInt(temp.replace(type+"end_",""))-1);
							startId = type+"start_"+startId;
						}
					}
					
					drawList[drawList.length] = startId;
					drawList[length] = endId;
					var startNode = this.findNodeByScene(scene,startId);
					var endNode = this.findNodeByScene(scene,endId);
					//画线
					if(startNode !=undefined && endNode != undefined)
						endNode.attributes.newLink(scene,
								startNode,
								endNode,
								startNode.lineText,
								type,
								startNode.lineColor,
								startNode.lineSize);
				}
			}
		},
//		_addAppFunction : function(){
//			
//		},
//		 setAddAppFunction:function( func){
//			this._addAppFunction = func;
//		},
		 exportJSONData:function(){
			 var addApp = nodeEntry.addApp;
			 var drawAppId = nodeEntry.drawAppId;
			//如果是新增
			if(addApp == true){
				this.addAppFunction();
			}
			else{
				if(nodeEntry.rootObj.id == "" || nodeEntry.rootObj.id == undefined){
					nodeEntry.rootObj.id = drawAppId;
				}
				nodeEntry.rootObj.dataStatus = "UPDATE";
				this.exportJSONDataQuery();
			}
		},
		 exportJSONDataQuery:function()
		 {
			var pObj = this;
			nodeEntry.drawLineFlag = false;//是否是点击直线后
			nodeEntry.isMouseDown = false;
			
			var xmldateStr = this.formatObjectToXml(nodeEntry.scene);
			if(nodeEntry.isEditer == true)
				this.emptyScene();
			//保存
			$.ajax({
		        url: index_web_app+nodeEntry.saveDataUrl,
		        type: 'POST',
		        data:{id:nodeEntry.rootObj.id,xml:xmldateStr},
		        xhrFields: {
					withCredentials: true
				},
		        success: function(data)
		        {
		        	if(nodeEntry.isEditer == false){
		        		g_dialog.operateAlert(null,data.saveInfo,"error");
		        		return;
		        	}
		        	if(nodeEntry.addApp == true && data.id!=undefined && data.id!="" ){
		        		nodeEntry.addAppUrl = nodeEntry.addAppUrl.replace("=undefined&", "="+data.id+"&");
		        		nodeEntry.addAppUrl = nodeEntry.addAppUrl.replace("appId=&fromType=", "appId="+data.id+"&fromType=");
		        		nodeEntry.addApp = false;
		    			nodeEntry.scene = null;
		    			nodeEntry.stage = null;
		        		window.location.href = nodeEntry.addAppUrl;
		        		
		        	}
		        	else
		        	{
		               	var root = json2xml.xml_str2json(xmldateStr).root;
		               	pObj.doinitPanelData(root);
		        	}
		 
		          }  
		        }); 
		},
		 setLinkLineColor:function(color){
			 nodeEntry.linkLineColor = color;
		},

		 initSceneTools:function(canvasId)
		{
			 if(nodeEntry.sceneTool == null)
				 nodeEntry.sceneTool = new JTopo.Scene();
			 nodeEntry.canvasToolBarId = canvasId;
		},
		 getScene:function(){
			return nodeEntry.scene;
		},
		 getStage:function(){
			return nodeEntry.stage;
		},
		backMode:null,
		 changeSceneModel:function(mode)
		 {
			if(mode != nodeEntry.scene.mode && this.backMode == null)
				this.backMode = nodeEntry.scene.mode;
			if(nodeEntry.scene.mode == mode)
				nodeEntry.scene.mode = this.backMode;
			else
				nodeEntry.scene.mode = mode;
			
		},

		 initScene:function(canvasDrawId){
			var canvas = document.getElementById(canvasDrawId);
			canvas.width = $("#flashContent").width();
			canvas.height = $("#flashContent").height();
			if(nodeEntry.scene == null){
				nodeEntry.scene = new JTopo.Scene();
			}
				
			if(nodeEntry.stage == null)
				nodeEntry.stage = new JTopo.Stage(canvas);
			nodeEntry.canDrawId = canvasDrawId;
			nodeEntry.stage.id=canvasDrawId+"-Draw";
			nodeEntry.stage.width = canvas.width;
			nodeEntry.stage.height = canvas.height;
			nodeEntry.stage.wheelZoom = 0.85;
			nodeEntry.stage.mode = "normal";
			nodeEntry.stage.myTopoStyle = true;
			nodeEntry.stage.add(nodeEntry.scene);
			//中点偏移量
			nodeEntry.scene.translateX = -2500;
			nodeEntry.scene.translateY = -2500;
		},
		 initOperatingBox:function(id)
		 {
			nodeEntry.canDrawShowAttr = id;
			$("#"+id).draggable();
			this.initDeleteNodeButton(id);
			if(checkIsNULL(nodeEntry.closeEl) ==false){
				g_dialog.hide(nodeEntry.closeEl);
				nodeEntry.closeEl = undefined;
			}

		},
		initDeleteNodeButton:function(id,el){
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			var scene = nodeEntry.scene;
			var pObj = this;
			$("#"+id).find("#deleteNode").click(function(){
				var thisId= $("#"+canDrawShowAttr).find("#pid").text();
				if(thisId == "" || thisId == null || thisId == undefined){
					g_dialog.operateAlert(div, "未选中任何节点", "error");
				}
				else 
				{
					g_dialog.operateConfirm("是否删除此节点？",{saveclick : function (){
						var no = pObj.findNodeByScene(scene,thisId);
						pObj.deleteNodeByScene(scene,no);
						pObj.resetOperatingBox();
						pObj.clearAllData();
						if(el != undefined)
							g_dialog.hide(el);
					}});
				}
			});
		},
		 initOperatingBoxForLine:function(id)
		 {
			nodeEntry.canDrawShowAttrLine = id;
			
			
			$("#"+id).draggable();
			this.initDeleteLineButton(id);
			this.initDrawLineLockArea();
			if(checkIsNULL(nodeEntry.closeEl) ==false){
				g_dialog.hide(nodeEntry.closeEl);
				nodeEntry.closeEl = undefined;
			}
		},
		initDeleteLineButton:function(id,el){
			var pObj = this;
			$("#"+id).find("#deleteLine").click(function(){
				var thisId= $("#"+nodeEntry.canDrawShowAttrLine).find("#pidLine").val();
				if(thisId == "" || thisId == null || thisId == undefined){
					g_dialog.operateAlert(div, "未选中任何节点", "error");
				}
				else 
				{
					g_dialog.operateConfirm("是否删除此节点？",{saveclick : function (){
						
						var no = pObj.findNodeByScene(nodeEntry.scene,thisId);
						//删除的是自由线段
						if(		no.type.indexOf("line") !=-1  || 
								no.type.indexOf("arrow") != -1  || 
								no.type.indexOf("layer") != -1){
							var ids = no.id.split("::");
							try{
								pObj.deleteNodeByScene(nodeEntry.scene,
										pObj.findNodeByScene(nodeEntry.scene,ids[0]));
								pObj.deleteNodeByScene(nodeEntry.scene,
										pObj.findNodeByScene(nodeEntry.scene,ids[1]));
							}catch(e){
								
							}
						}
						else
							pObj.deleteNodeByScene(nodeEntry.scene,no);
						pObj.resetOperatingBox();
						//如果属于分组从分组中删除
						pObj.nodeFactory._group.deleteNodeFromContainer(nodeEntry.scene,thisId);
						if(el != undefined)
							g_dialog.hide(el);
					}});
				}

			});
		},
		 closeCanvasDrawShowAttrLineDiv:function(){
			$("#"+nodeEntry.canDrawShowAttrLine).hide();
			if(checkIsNULL(nodeEntry.closeEl) ==false){
				g_dialog.hide(nodeEntry.closeEl);
				nodeEntry.closeEl = undefined;
			}
		},
		 closeCanvasDrawShowAttrDiv:function(){
			$("#"+nodeEntry.canDrawShowAttr).hide();
			if(checkIsNULL(nodeEntry.closeEl) ==false){
				g_dialog.hide(nodeEntry.closeEl);
				nodeEntry.closeEl = undefined;
			}
		},
		 resetOperatingBox:function(){
			var input = $("#"+nodeEntry.canDrawShowAttr);
			$(input).find("#pname").val("");
			$(input).find("#pid").text("");
		},
		 findOnlyNodeByScene:function(_scene){
			try
			{
				var node =  _scene.findElements(function (a){
					return a.type != "dependence" && a.type != "arrow" && a.type != "layer" && a.type != "line" && a.id == nodeId;
				})[0];
				return node;
			}catch(e){
			}
			return null;
		},
		 findNodeByScene:function(_scene,nodeId){
			try
			{
				var node =  _scene.findElements(function (a){
					return a.id == nodeId;
				})[0];
				return node;
			}catch(e){
			}
			return null;
		},
		 findNodeBySceneByType:function(_scene,type){
				try
				{
					var node =  _scene.findElements(function (a){
						return a.type == type || a.attributes.type == type;
					});
					return node;
				}catch(e){
				}
				return null;
			},
		findLineByScene:function(_scene,lineId){
			try
			{
				var node =  _scene.findElements(function (a){
					return a.id == lineId && (a.type == "dependence" || a.type == "line"  || a.type == "arrow" || a.type == "layer") ;
				})[0];
				return node;
			}catch(e){
			}
			return null;
		},
		 deleteLinesByScene:function(ids)
		{
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			var scene = nodeEntry.scene;
			
			var thisNodeId = $("#"+canDrawShowAttr).find("#pid").text();
			for(var i=0;i<ids.length;i++){
				var node = this.findNodeByScene(scene,ids[i]+"::"+thisNodeId);

				var endNode = this.findNodeByScene(scene,thisNodeId);
				this.deleteNodeByScene(scene,node);
				//删除依赖
				for(var j = 0 ;j<endNode.mounts.length;j++){
					//隐性依赖
					if((node == null || node == undefined) && (endNode.mounts[j].id == ids[i])){
						endNode.mounts.remove(j);
						break;
					}
					else if( node !=null && node !=undefined && endNode.mounts[j].id == node.id){
						endNode.mounts.remove(j);
						break;
					}
				}
			}
		},
		 emptyScene:function(text)
		 {
			if(text!=undefined){
				if(confirm(text)){
					nodeEntry.scene.clear();
					this.resetDependency();
					return ;
				}
				return;
			}
			nodeEntry.scene.clear();
		},
		 deleteNodeByScene:function(_scene,node){
			try
			{
				//如果是线段需要更新endNode中的连线节点
				if(node.type == "dependence")
				{
					var ids = node.id.split("::");
					var endNodeId = ids[1];
					var endNode = this.findNodeByScene(_scene,endNodeId);
					if(endNode.mounts!=undefined){
						for(var i=0;i<endNode.mounts.length;i++){
							if(endNode.mounts[i].id == ids[0]){
								endNode.mounts.remove(i);
								break;
							}
						}
					}
				}
				else if(node.type == "line"  ||
						node.type == "arrow" || 
						node.type == "layer"){
					var ids = node.id.split("::");
					_scene.remove(this.findNodeByScene(_scene,ids[0]));
					_scene.remove(this.findNodeByScene(_scene,ids[1]));
				}
				//检查自己是否已经被依赖，如果有被依赖需要将其删除
				else{
					var allNodes = _scene.getAllNodes();
					for(var i=0;i<allNodes.length;i++){
						if(allNodes[i].id != node.id && checkIsNULL(allNodes[i].mounts) == false)
						{
							for(var j=0;j<allNodes[i].mounts.length;j++){
								if(allNodes[i].mounts[j].id == node.id)
								{
									allNodes[i].mounts.remove(j);
									break;
								}
							}
						}
					}
				}
				_scene.remove(node);
				//清空提操作框内容
				//resetDependency();
				//关闭操作框
				this.closeCanvasDrawShowAttrDiv();
			}catch(e){
			}
		},
		 copyNode:function(node){
			return $.extend(true, {}, node);
		},
		 resetDependency:function(){
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			$("#"+canDrawShowAttr).find("#select1").html("");
			$("#"+canDrawShowAttr).find("#select2").html("");
			$("#"+canDrawShowAttr).find("#pname").val("");
			$("#"+canDrawShowAttr).find("#pid").text("");
			$("#"+canDrawShowAttr).find("#ptype").text("");
		},
		checkIsChildType:function(scene,node,type){
			try
			{
				if(node.mounts != undefined){
					for(var i=0;i<node.mounts.length;i++){
						var endNode = this.findNodeByScene(scene,node.mounts[i].id);
						if(checkIsNULL(endNode) == false && endNode.type == type && node.type == type)
						{
							return true;
						}
					}
				}
			}catch(e)
			{
				
			}
			return false;
			
		},
		 setDependency:function()
		 {
			var pObj = this;
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			var scene = nodeEntry.scene;
			
			var select = $("#"+canDrawShowAttr).find("#select1");
			$(select).html("");
			var thisNodeId = $("#"+canDrawShowAttr).find("#pid").text();
			if(thisNodeId == "" || thisNodeId == undefined)
				return;
			//systemApp_displayType_Id,检查是否应该显示“隐藏和显示界面”
			var nodes  = scene.getAllNodes();
			var endNode = this.findNodeByScene(scene,thisNodeId);
			//检查挂载点是否是应用系统
			var flag = this.checkIsChildType(scene,endNode,nodeEntry.appSystem);
			if(flag == true){
				$("#"+canDrawShowAttr).find("#systemApp_displayType_Id").show();
				//初始化值
				if(checkIsNULL(endNode.bossDisplayType) == true){
					endNode.bossDisplayType = '1';
				}
				//解决设置selected无效的问题
				$("#"+canDrawShowAttr).find("#systemApp_displayType").val(endNode.bossDisplayType);
				$("#"+canDrawShowAttr).find("#systemApp_displayType").attr("name",endNode.id);
				//监听改变事件
				$("#"+canDrawShowAttr).find("#systemApp_displayType").change(function(){
					var linkId = $(this).attr("name");
					
					if(checkIsNULL(linkId) == false){
						var _node = pObj.findNodeByScene(scene,linkId);
						_node.bossDisplayType = $(this).val();
					}
				});
			}
			else{
				$("#"+canDrawShowAttr).find("#systemApp_displayType_Id").hide();
			}
			for(var i=0;i<nodes.length;i++)
			{
				//线条不能存在依赖关系，以及自由线条
				if(nodes[i].type == "dependence" ||
						nodes[i].type == "line"  ||
						nodes[i].type == "arrow" || 
						nodes[i].type == "layer" ||
						//连接自由线条的端点
						nodes[i].type.indexOf("line")!=-1 ||
						nodes[i].type.indexOf("arrow")!=-1 ||
						nodes[i].type.indexOf("layer")!=-1 ||
						//文本节点
						nodes[i].type == "text" || 
						//分组节点
						nodes[i].type == "container" ||
						//野节点
						nodes[i].type == "node"){
					continue;
				}
				var flag = false;
				if(endNode.mounts != undefined)
				for(var j=0;j<endNode.mounts.length;j++){
					if(endNode.mounts[j].id == nodes[i].id){
						flag = true;
						break;
					}
				}
				//如果已经连线
				if(flag == true){
					continue;
				}
				else
				{
					//检查自己是不是起点
					var startNode = nodes[i];
					if(startNode.mounts != undefined)
					for(var j=0;j<startNode.mounts.length;j++){
						if(startNode.mounts[j].id == thisNodeId){
							flag = true;
							break;
						}
					}
				}
				if(flag == true){
					continue;
				}
				if(thisNodeId != nodes[i].id)
					$(select).append($("<option title='"+nodes[i].name+"' value='"+nodes[i].id+"'>"+nodes[i].name+"</option>"));
			}
			//初始化右边已经选中的
			select = $("#"+canDrawShowAttr).find("#select2");
			$(select).html("");
			if(endNode.mounts != undefined){
				for(var i=0;i<endNode.mounts.length;i++)
				{
					var node = this.findNodeByScene(scene,endNode.mounts[i].id);
					$(select).append($("<option value='"+node.id+"'>"+node.name+"</option>"));
				}
			}
		},
		 reMountPoint:function(node){
			 var scene = nodeEntry.scene;
			var nodes  = nodeEntry.scene.getAllNodes();
			//如果自己是end节点
			if(node.mounts != undefined){
				for(var l=0;l<node.mounts.length;l++)
				{
					for(var i=0;i<nodes.length;i++)
					{
						if(nodes[i].id == node.mounts[l].id && 
								node.mounts[l].hidden != true)
						{
							var mofidy = this.findModifyStyle(nodes[i],node.id);
							node.attributes.linkNode(scene,nodes[i],node,
									mofidy.lineColor,
									mofidy.lineText,
									mofidy.lineSize);
						}
					}
				}
			}
			for(var i=0;i<nodes.length;i++)
			{
				if(nodes[i].mounts != undefined){
					for(var j=0;j<nodes[i].mounts.length;j++)
					{
						if(nodes[i].mounts[j].id == node.id&& 
								node.mounts[j].hidden != true)
						{
							//
							var mofidy = this.findModifyStyle(node,nodes[i].id);
							node.attributes.linkNode(scene,node,nodes[i],
									mofidy.lineColor,
									mofidy.lineText,
									mofidy.lineSize);
							break;
						}
					}
				}

			}

		},
		deleteAllMountPoint:function(node){
			this.mountPoint("delete",node.mounts,node);
		},
		dleteAllSelectMounts:function(pnode){
			var ids = [];
			var tipname = [];
			var pObj = this;
			var nodes =pObj.getScene().selectedElements;
			for(var i=0;nodes!=null&&i<nodes.length;i++){
				//屏蔽自己,以及各种线条和文字
				if(nodes[i].id != pnode.id && 
						nodes[i].type != "dependence" && 
						nodes[i].type.indexOf("arrow") == -1 && 
						nodes[i].type.indexOf("layer") == -1 && 
						nodes[i].type.indexOf("line") == -1 && 
						nodes[i].type.indexOf("text") == -1 &&
						nodes[i].type.indexOf("node") == -1 ){
					ids[ids.length] = nodes[i].id;
					tipname[tipname.length] = nodes[i].text;
				}
			}
			if(ids.length>0)
			{
				var tip = "";
				var delmodel = "";
				if(establishRelationshipModel_isDelete()){
					delmodel = "delete";
					tip = "请再次确认是否将 ["+tipname.join("，")+"] 从 [ "+pnode.text+"] 上解除关联关系";
				}
				else{
					tip = "请再次确认是否将 ["+tipname.join("，")+"] 关联到 ["+pnode.text+"] 上？";
				}
				g_dialog.operateConfirm(tip,{saveclick : function (){
					pObj.mountPoint(delmodel,ids,pnode);
					//如果有提示框开启的必须关闭,防止数据不同步的误操作
					pObj.closeCanvasDrawShowAttrDiv();
				}});
			}
			else{
				g_dialog.operateAlert(null,"此模式下需选择其他节点才能进行关联！");
			}
		},
		 mountPoint:function(typeStaus,ids,pnode){
			 var _flag = false;
			var canDrawShowAttr = nodeEntry.canDrawShowAttr;
			var scene = nodeEntry.scene;
			
			var relyIds = [];
			//如果有手动传入id
			if(checkIsNULL(ids) == false){
				relyIds = ids;
			}
			else
			{
				var options = $("#"+canDrawShowAttr).find("#select2 option");

				for(var i=0;i<options.length;i++)
				{
					relyIds[relyIds.length] = $(options[i]).val();
				}
				
			}
			var endNode = null;
			if(checkIsNULL(pnode) == false)
			{
				endNode = pnode;
			}
			else
			{
				var endNodeId = $("#"+canDrawShowAttr).find("#pid").text();
				if(checkIsNULL(endNodeId)==true)
				{
					return _flag;
				}
				endNode = this.findNodeByScene(scene,endNodeId);
			}
			if(checkIsNULL(endNode)==true)
			{
				return _flag;
			}
			if(relyIds == undefined || relyIds == null || relyIds =="" || relyIds.length <=0 )
			{
				endNode.mounts = undefined;
				return _flag;
			}
			var delLength = 0;
			//这里是卸载依赖点
			if(typeStaus == "delete"){
				for(var i = 0;i<relyIds.length;i++){
					//删除样式
					var startNode = this.findNodeByScene(scene, relyIds[i]);
					if(startNode != undefined && startNode.lineModify != undefined)
					{
						for(var j=0;j<startNode.lineModify.length;j++){
							if(startNode.lineModify[j].endId == endNode.id)
							{
								startNode.lineModify.remove(j);
								break;
							}
						}
					}
					if(checkIsNULL(endNode.mounts) == false)
					for(var j=0;j<endNode.mounts.length;j++){
						//如果找到
						if(relyIds[i] == endNode.mounts[j].id){
							//删除连线
							var lineNode = this.findNodeByScene(scene, relyIds[i]+"::"+endNode.id);
							//隐性关联将没有node节点连线
							if(lineNode != null || lineNode!=undefined)
								nodeEntry.scene.remove(lineNode);
							delLength = delLength +1;
							endNode.mounts.remove(j);
							break;
						}
					}
				}
				if(delLength <=0)
					g_dialog.operateAlert(null,"选中部分与 【"+endNode.text+"】不存在关联关系");
				else if(delLength < relyIds.length)
					g_dialog.operateAlert(null,"部分关系为成功解除！");
				else
					g_dialog.operateAlert(null,"已成功解除关联关系！");
				
				return _flag;
			}

			

			var addLength = 0;

			if(endNode.mounts == undefined)
				endNode.mounts = new Array();

			
			//获取是否隐藏关联关系连线
			var hiddenvalue = $("#"+canDrawShowAttr).find("input[type='checkbox']").is(':checked');
			//检查并屏蔽反向关联，如果被关联节点是关联节点的父节点将被屏蔽
			var isSanitizedRoundtrip = false;
			for(var i=0;i<relyIds.length;i++)
			{
				//反向判断
				var start = this.findNodeByScene(scene,relyIds[i]);
				if(checkIsNULL(start.mounts)==false){
					for(var j=0;j<start.mounts.length;j++){
						if(start.mounts[j].id == endNode.id){
							relyIds.remove(i);
							i--;
							isSanitizedRoundtrip = true;
							break;
						}
						
					}
				}

				if(i>0 && checkIsNULL(endNode.mounts)==false){
					//正向判断
					for(var j=0;j<endNode.mounts.length;j++){
						if(endNode.mounts[j].id == relyIds[i]){
							relyIds.remove(i);
							i--;
							isSanitizedRoundtrip = true;
							break;
						}
					}
				}
				
			}
			for(var i=0;i<relyIds.length;i++){
				try
				{
					var flag = false;
					//去重
					for(var j=0;j<endNode.mounts.length;j++){
						//多的将删除
						if(endNode.mounts[j].id == relyIds[i]){
							flag = true;
							break;
						}
					}
					if(flag == false)
					{
						var startNode = this.findNodeByScene(scene,relyIds[i]);
						//创建连线
						var index = endNode.mounts.length;
						if(endNode.mounts[index] == undefined)
							endNode.mounts[index] = new Object();
						endNode.mounts[index].id = relyIds[i];
						//隐藏连线
						if(hiddenvalue == true){
							endNode.mounts[index].hidden = true;
						}
						else{
							endNode.attributes.linkNode(scene,startNode,endNode,nodeEntry.linkLineColor,"");
						}
						_flag = true;
						addLength = addLength+1;
							
					}

				}catch(e){
				}

			}
			//说明有重复添加的
			if(addLength != relyIds.length){
				g_dialog.operateAlert(null,"已屏蔽重复关联！");
			}
			//
			else
			{
				if(isSanitizedRoundtrip == true)
					g_dialog.operateAlert(null,"根据业务需求已屏蔽反向关联！");
				else
					g_dialog.operateAlert(null,"已完成关联操作！");
			}
			
			return _flag;
		},
		 getMousePos:function(canvas, evt) { 
			var rect = canvas.getBoundingClientRect(); 
			   return { 
				    x: evt.clientX - rect.left * (canvas.width / rect.width),
				     y: evt.clientY - rect.top * (canvas.height / rect.height)
			   }
		},
		 initDrawLineLockArea:function()
		{
			var div = document.getElementById(nodeEntry.canDrawId);
			var pObj = this;
			div.onmouseover=function(event)
			{  
			}
			div.onmouseout=function(event)
			{  
				nodeEntry.drawLineFlag == false;
				nodeEntry.drawLineNodes[0] = undefined;
				nodeEntry.drawLineNodes[1] = undefined;
				nodeEntry.isMouseDown = false;
			}
			div.ondblclick=function(event){
				nodeEntry.drawLineFlag == false;
				nodeEntry.drawLineNodes[0] = undefined;
				nodeEntry.drawLineNodes[1] = undefined;
				nodeEntry.isMouseDown = false;
			}
			//鼠标按下
			div.onmousedown=function(event)
			{
				var select = $("#"+nodeEntry.canvasToolBarId).find("div[compType='"+nodeEntry.LineType+"']").attr("clicktime");
				if(3 != event.which && nodeEntry.scene.scaleX != 1 && select == 1){
					g_dialog.operateAlert(null,"画布已缩放，不再支持拖拽画线，请双击！","error");
					console.log(nodeEntry.LineType);
					pObj.reSetDrawLineParam();
					return;
				}
				
				var canvas = document.getElementById(nodeEntry.canDrawId);
				var location = pObj.getMousePos(canvas,event);
				
				
				if(3 == event.which)
				{
		            if(nodeEntry.drawLineFlag == true && nodeEntry.isMouseDown == true && 
		            		nodeEntry.drawLineNodes[0] != undefined && nodeEntry.drawLineNodes[0].node != undefined ){
		            	pObj.deleteNodeByScene(nodeEntry.scene,nodeEntry.drawLineNodes[0].node);
		            	pObj.deleteNodeByScene(nodeEntry.scene,nodeEntry.drawLineNodes[0].tempnode);
		            }
		            nodeEntry.drawLineFlag == false;
		            nodeEntry.isMouseDown = false;
		            return false;
		        }
				//更新缩放比例;
				/**
				 * 	drawScalingX 
					drawScalingY 
				 */
				pObj.updateScaling();
				var node = pObj.nodeFactory.node.createNode(nodeEntry.canDrawId);
				node.x = (location.x-nodeEntry.scene.translateX)*nodeEntry.scene.scaleX;
				node.y = (location.y-nodeEntry.scene.translateY)*nodeEntry.scene.scaleX;
				node.width = 4;
				node.height = 4;
				
				if(nodeEntry.drawLineNodes[0] == undefined )
					nodeEntry.drawLineNodes[0] = new Object();
				if(nodeEntry.drawLineNodes[1] == undefined )
					nodeEntry.drawLineNodes[1] = new Object();
				
				if(nodeEntry.drawLineFlag == true && nodeEntry.drawLineNodes[0].node == undefined)
				{
					node.id=nodeEntry.LineType+"start_"+nodeEntry.drawLineClickTimes;
					node.type=nodeEntry.LineType+"Start";
					var temp = node.newNode();
					nodeEntry.scene.add(temp);
					nodeEntry.drawLineNodes[0].node = temp;
					nodeEntry.drawLineClickTimes = nodeEntry.drawLineClickTimes + 1;
					nodeEntry.isMouseDown = true;
				}
				else if(nodeEntry.drawLineFlag == true && nodeEntry.drawLineNodes[1].node == undefined){
					node.id=nodeEntry.LineType+"end_"+nodeEntry.drawLineClickTimes;
					node.type=nodeEntry.LineType+"End";
					var temp = node.newNode();
					nodeEntry.scene.add(temp);
					nodeEntry.drawLineNodes[1].node = temp;
					nodeEntry.drawLineClickTimes = nodeEntry.drawLineClickTimes + 1;
					//将两点连接起来
					node.newLink(nodeEntry.scene,nodeEntry.drawLineNodes[0].node,nodeEntry.drawLineNodes[1].node,"",nodeEntry.LineType);
					pObj.reSetDrawLineParam();
				}
				
			}
			div.onmousemove=function(event){

				{
					
        			if(checkIsNULL($(this).attr("doMoveId")) == false){
        				var x = (event.clientX - Number($(this).attr("doMoveX")))/pObj.getNodeEntry().scene.scaleX;
        				var y = (event.clientY - Number($(this).attr("doMoveY")))/pObj.getNodeEntry().scene.scaleX;
            			var ids = $(this).attr("doMoveId").split("::");
        				var start = pObj.findNodeByScene(pObj.getNodeEntry().scene,ids[0]);
        				var end = pObj.findNodeByScene(pObj.getNodeEntry().scene,ids[1]);
        				start.x = x+start.x;
        				start.y = y+start.y;
        				end.x = x+end.x;
        				end.y = y+end.y;
        				$(this).attr("doMoveX",event.clientX);
        				$(this).attr("doMoveY",event.clientY);
        				console.log("阻止事件冒泡");
        				event.stopPropagation();
        				return false;
        			}
				}
					
				//先创建节点,最后一个点没有画
				if(nodeEntry.drawLineFlag == true && nodeEntry.isMouseDown == true){
					
					try{
						if(nodeEntry.drawLineNodes[0].node == undefined)
							return false;
						if(nodeEntry.drawLineNodes[1].node != undefined)
							return false;
					}catch(e){
						alert(e);
					}
					//更新缩放比例;
					/**
					 * 	drawScalingX 
						drawScalingY 
					 */
					pObj.updateScaling();
					
					var canvas = document.getElementById(nodeEntry.canDrawId);
					var location = pObj.getMousePos(canvas,event);
					
					var node = pObj.nodeFactory.node.createNode(nodeEntry.canDrawId);
					node.x = (location.x-nodeEntry.scene.translateX)*nodeEntry.scene.scaleX;
					node.y = (location.y-nodeEntry.scene.translateY)*nodeEntry.scene.scaleX;
					node.id=nodeEntry.drawLineNodes[0].node.id+"-end";
					node.width = 4;
					node.height = 4;
					var temp = node.newNode();
					if(nodeEntry.drawLineNodes[0].tempnode != undefined)
					{
						//先删除原来的在创建新的节点并连线
						pObj.deleteNodeByScene(nodeEntry.scene,nodeEntry.drawLineNodes[0].tempnode);
						nodeEntry.drawLineNodes[0].tempnode = temp;
					}
					else
					{
						nodeEntry.drawLineNodes[0].tempnode = temp;
					}
					node.newLink(nodeEntry.scene,nodeEntry.drawLineNodes[0].node,temp,"",nodeEntry.LineType);
				}
			}
		},
		reSetDrawLineParam:function(){
			try{
				this.deleteNodeByScene(nodeEntry.scene,nodeEntry.drawLineNodes[0].tempnode);
			}catch(e){
				
			}
			try{
				nodeEntry.drawLineNodes[0] = undefined;
				nodeEntry.drawLineNodes[1] = undefined;
			}catch(e){
				
			}

			nodeEntry.drawLineFlag = false;
			nodeEntry.isMouseDown = false;
			$("#"+nodeEntry.canvasToolBarId).find("div[compType='"+nodeEntry.LineType+"']").css("background-color","");;
			$("#"+nodeEntry.canvasToolBarId).find("div[compType='"+nodeEntry.LineType+"']").attr("clicktime","0");
			$("#"+nodeEntry.canvasToolBarId).find("div[compType='"+nodeEntry.LineType+"']").removeAttr("clicktime");
		},
		nodeClickEventFunction : function(){
			
		},
		 setNodeClickEventFunction:function( func){
			this.nodeClickEventFunction = func;
		},
		 nodeDBClickEventFunction : function(){
			
		},
		 setNodeDBClickEventFunction:function( func){
			this.nodeDBClickEventFunction = func;
		},

		/**
		 * 更新线段关键依赖以及连线模式 需要优化不需要删除后再连
		 */
		 updateNodeRe:function(num,type,lineModel,vh)
		 {
			 var scene = nodeEntry.scene;
			 var canDrawShowAttrLine = nodeEntry.canDrawShowAttrLine;
			 var div = $("#"+canDrawShowAttrLine);
			 if($(div).find("#pLine_dependence").css("display") != "block"){
				 return;
			 }
			var node = this.findNodeByScene(scene,$(div).find("#pidLine").val());
			var ids = node.id.split("::");
			var startNode = this.findNodeByScene(scene,ids[0]);
			var endNode = this.findNodeByScene(scene,ids[1]);
			if(checkIsNULL(vh)==false){
				node.direction = vh;
				startNode.direction = vh;
				return;
			}
			if(num!=null)
				startNode.dependenceRatio = num+"";
			if(type!=null)
				startNode.dependenceType = type;
			if(lineModel != undefined && lineModel != null)
				startNode.lineModel = lineModel;
			//如果有手动修改连线属性
			var mofidy = this.findModifyStyle(startNode,endNode.id);
			//将连续改成虚线
			scene.remove(node);
			endNode.attributes.linkNode(scene,startNode,endNode,
					mofidy.lineColor,
					mofidy.lineText,
					mofidy.lineSize);
			
		},
		 fillLineAttr:function(node)
		 {
			var scene = nodeEntry.scene;
			var canDrawShowAttrLine = nodeEntry.canDrawShowAttrLine;
			var ids = node.id.split("::");
			var startNode = this.findNodeByScene(scene,ids[0]);
			var div = $("#"+canDrawShowAttrLine);
			var inputSlider = $(div).find("input[name='slider']");
			var inputColor = $(div).find("input[name='color']");
			var inputText = $(div).find("input[name='lineText']");
			var input = $(div).find("input[name='size']");
			
			if(checkIsNULL(node.offsetGap) == false)
				$(div).find("#canvasDrawShowAttrLine_distance").val(node.offsetGap);
			
			
			input.val(node.lineWidth);
			inputColor.val(node.strokeColor);
			inputText.val(node.text);
			if(input.attr("trgfunction")!=undefined){
				eval(input.attr("trgfunction")+"('"+node.lineWidth+"')");
			}
			if(inputColor.attr("trgfunction")!=undefined){
				eval(inputColor.attr("trgfunction")+"('"+node.strokeColor+"')");
			}
			if(inputSlider.attr("trgfunction")!=undefined){
				eval(inputSlider.attr("trgfunction")+"('"+node.alpha+"')");
			}
			//如果不是修改纯线条的情况下
			if($(div).find("#pLine_dependence").css("display") == "block")
			{
				if(checkIsNULL(startNode.dependenceType) == true)
					startNode.dependenceType = "KEY";
					$(":radio[name='reType'][value='" + startNode.dependenceType + "']").prop("checked", "checked");
				if(checkIsNULL(startNode.lineModel) == true){
					startNode.lineModel = "Link";
				}
				 $(":radio[name='reLineType'][value='" + startNode.lineModel + "']").prop("checked", "checked");
				if(checkIsNULL(startNode.direction) == false)
					$(":radio[name='vhLineType'][value='" + startNode.direction + "']").prop("checked", "checked");
			}
		},
		findAllSameLevelLine:function(_scene,includeId){
			try
			{
				var pObj = this;
				var nodes =  _scene.findElements(function (a){
					var ids = a.id.split("::");
					var start = pObj.findNodeByScene(_scene, ids[0]);
					return (start.id==includeId) && a.type == "dependence";
				});
				return nodes;
			}catch(e){
			}
			return null;
		},
		updateLineDistance:function(_node){
			var scene = nodeEntry.scene;
			var canDrawShowAttrLine = nodeEntry.canDrawShowAttrLine;
			var div = $("#"+canDrawShowAttrLine);
			var node = undefined;
			if(checkIsNULL(_node) == false){
				node = _node;
			}
			else
				node = this.findNodeByScene(scene,$(div).find("#pidLine").val());
			if(node == undefined)
				return;
			
			var checked = $(div).find("#canvasDrawShowAttrLine_doMod").attr("clicktimes");
			var distance = $(div).find("#canvasDrawShowAttrLine_distance").val();
			//需要批量修改
			var ids = node.id.split("::");
			
			if(checked == "true" || checked == true || checked == "checked"){
				var color = $(div).find("input[name='color']").val();
				var lineSize = $(div).find("input[name='size']").val();
				var text = $(div).find("input[name='lineText']").val();
				var alpha = Number($(div).find("input[name='slider']").val());
				
				//正向
				var endNode = this.findNodeByScene(scene,ids[1]);
				for(var i=0;i<endNode.mounts.length;i++){
					//结束点
					var no = this.findNodeByScene(scene,endNode.mounts[i].id);
					var li = this.findNodeByScene(scene,endNode.mounts[i].id+"::"+endNode.id);
					//在起点增加属性
					if(checkIsNULL(no) == false)
					{
						no.offsetGap = distance;
//						no.lineColor = color;
//						no.lineSize = lineSize;
//						no.lineAlpha = alpha;
					}
					//改线
					if(checkIsNULL(li) == false)
					{
						li.offsetGap = distance;
						li.text = text;
						li.strokeColor = color;
						li.lineWidth = lineSize;
						li.alpha = alpha;
					}
					this.putModifyStyle(no,{lineColor:color,lineSize:lineSize,lineText:text,endId:endNode.id},true);
				}
				//反向，同级的
				var lines = this.findAllSameLevelLine(scene,ids[0]);
				if(lines!=null)
				{
					for(var i=0;i<lines.length;i++)
					{
						var _ids = lines[i].id.split("::");
						var no = this.findNodeByScene(scene,_ids[0]);
						no.offsetGap = distance;
						lines[i].offsetGap = distance;
						lines[i].text = text;
						lines[i].strokeColor = color;
						lines[i].lineWidth = lineSize;
						lines[i].alpha = alpha;
						this.putModifyStyle(no,{lineColor:color,lineSize:lineSize,lineText:text,endId:_ids[1]},true);
					}
				}
				
			}
			//修改自己
			else
			{
				var no = this.findNodeByScene(scene,ids[0]);
				if(checkIsNULL(no) == false){
					node.offsetGap = distance;
				}
				node.offsetGap = distance;
			}
				
			
			
			
		},
		 updateLineAttr:function()
		 {
			
			var scene = nodeEntry.scene;
			var canDrawShowAttrLine = nodeEntry.canDrawShowAttrLine;
			
			var div = $("#"+canDrawShowAttrLine);
			var node = this.findNodeByScene(scene,$(div).find("#pidLine").val());
			if(node == undefined)
				return;
			var color = $(div).find("input[name='color']").val();
			var lineSize = $(div).find("input[name='size']").val();
			var text = $(div).find("input[name='lineText']").val();
			var alpha = Number($(div).find("input[name='slider']").val());
			var type = node.type;
			
			scene.remove(node);
			var ids = node.id.split("::");
			var startNode = this.findNodeByScene(scene,ids[0]);
			var endNode = this.findNodeByScene(scene,ids[1]);
			startNode.lineAlpha = alpha;
			
			
			if(type == "dependence"){
				this.putModifyStyle(startNode,{lineColor:color,lineSize:lineSize,lineText:text,endId:ids[1]},true);
				endNode.attributes.linkNode(scene,startNode,endNode,color,text,lineSize);
				this.updateLineDistance();
			}
			//重新连线
			else{
				//设置线段描述,只在起始节点设置
				startNode.lineText = text;
				endNode.lineText = text;
				//重置一下线条颜色
				startNode.lineColor = color;
				endNode.lineColor = color;
				startNode.lineSize = lineSize;
				endNode.lineSize = lineSize;
				endNode.attributes.newLink(scene,startNode,endNode,text,type,color,lineSize);
			}
			
			$(div).hide();
		},
		/**
		 * 
		 * 添加应用函数
		 * 
		 */
		addAppFunction:function(){
			var pObj = this;
			var isUpdate = false;
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_topo1_tpl.html",
				success : function (data){
					g_dialog.dialog(
						$(data).find("[id=addApp]"),
						{
							width:"480px",
							title:"应用信息",
							init:init,
							saveclick:save_click
						}
					);
					function init(el){
						um_ajax_get({
							url : "appMonitor/queryConfigXml?1=1&compType=topo",
							isLoad : false,
							successCallBack : function (data) 
							{
								var select = $(el).find("#reselect");
								var jsObj = json2xml.xml_str2json(data);
								var item = jsObj.root.item;
								if(item.length > 0)
								{
									$(select).html("");
								}
								for(var i=0;i<item.length;i++){
									var option = $("<option value='"+item[i].id+"'>"+item[i].name+"</option>");
									select.append(option);
								}
							}
						});
						if(checkIsNULL(nodeEntry.rootObj) == false){
							isUpdate = true;
							$(el).find("input[data-id='name']").val(nodeEntry.rootObj.name);
							$(el).find("input[data-id='contact']").val(nodeEntry.rootObj.contact);
							$(el).find("input[data-id='tel']").val(nodeEntry.rootObj.tel);
							$(el).find("input[data-id='email']").val(nodeEntry.rootObj.email);
							$(el).find("select[data-id='topoId']").val(nodeEntry.rootObj.topoId);
							$(el).find("input[data-id='desc']").val(nodeEntry.rootObj.desc);
						}
						
					}
					function save_click(el,saveObj){
						
						try{
							if(isUpdate == false)
							{
								nodeEntry.rootObj = {
										id:""+Math.random()*100000,
										name:saveObj.name,
										contact:saveObj.contact,
										tel:saveObj.tel,
										email:saveObj.email,
										desc:saveObj.desc,
										dataStatus:"ADD",
										topoId:(saveObj.topoId==undefined||saveObj.topoId==""?"-1":saveObj.topoId),
										bgImg:"",
										zoom:pObj.getScene().scaleX,
										thumbmailId:"",
										x:Number(pObj.getSceneXY()[0]),
										y:Number(pObj.getSceneXY()[1]),
										autoRefreshTime:new Date().getTime()
								};
								nodeEntry.rootObj.isSelf = "false";
							}
							else{
								nodeEntry.rootObj.name = saveObj.name;
								nodeEntry.rootObj.contact = saveObj.contact;
								nodeEntry.rootObj.tel = saveObj.tel;
								nodeEntry.rootObj.email = saveObj.email;
								nodeEntry.rootObj.desc = saveObj.desc;
								nodeEntry.rootObj.topoId = saveObj.topoId;
								nodeEntry.rootObj.zoom = pObj.getScene().scaleX;
								nodeEntry.rootObj.x = Number(pObj.getSceneXY()[0]);
								nodeEntry.rootObj.y = Number(pObj.getSceneXY()[1]);
							}
								
							pObj.exportJSONDataQuery();
						}catch(e){
							alert(e);
						}
						g_dialog.hide(el);
					}
				}
			});
		},
//		/**
//		 * 事件处理
//		 * @param event
//		 * @param node
//		 * @returns
//		 */
//		 dealClickAndDblclick:function(event,node){
//			this.closeCanvasDrawShowAttrDiv();
//			nodeEntry.drawLineFlag == false;
//			nodeEntry.isMouseDown == false;
//			
//			var pObj = this;
//			
//			//将选择框置空
//			this.resetDependency();
//			var div = $("#"+nodeEntry.canDrawShowAttrLine);
//			//设置焦点
//			$(div).unbind("focus");
//			div.focus(function(){
//				
//			});
//			$(div).unbind("blur");
//			div.blur(function(){
//				$(this).hide();
//			});
//			$(div).find("#pidLine").val(node.id);
//			$(div).show();
//
//			$(div).find("#deleteLine").unbind("click");
//			$(div).find("#deleteLine").click(function(){
//				var div = $("#"+nodeEntry.canDrawShowAttrLine);
//				if(confirm("删除线段？")){
//					var no = pObj.findNodeByScene(nodeEntry.scene,$(div).find("#pidLine").val());
//					pObj.deleteNodeByScene(nodeEntry.scene,no);
//					//清除所有编辑值
//					pObj.clearAllData();
//				}
//				$(div).hide();
//			});
//			if(node.type == "dependence"){
//				$(div).find("#pLine_dependence").show();
//				$(div).find("#pLine_line_arrow_layer").show();
////				$(div).find("span[name=canhide]").hide();
//				
//			}
//			else{
//				$(div).find("#pLine_dependence").hide();
//				$(div).find("#pLine_line_arrow_layer").show();
////				$(div).find("span[name=canhide]").show();
//			}
//			//填充相关属性
//			this.fillLineAttr(node);
//		},
//		//线条处理函数
//		linkDbClick:function(link)
//		{
//			var pObj = this;
//        	if(link.type == "line" || link.type == "layer" || link.type == "arrow"){
//        		link.mousedown(function(event){
//	        		if(3 == event.which)
//	        		{
//	        			var div = document.getElementById(pObj.getNodeEntry().canDrawId);
//	        			this.dotype = "move";
//	        			$(div).attr("doMoveId",this.id);
//	        			$(div).attr("doMoveX",event.clientX);
//	        			$(div).attr("doMoveY",event.clientY);
//	                }
//
//        		});
//        	}
//        	link.mouseup(function(event){
//        		//自定义了线段事件
//        		var customToolEvent = pObj.nodeFactory.getCustomComEventByType(this.type);
//				if(customToolEvent != null)
//				{
//					if(customToolEvent.line != null && customToolEvent.line.mousedown != null)
//					{
//						customToolEvent.line.mousedown({
//							nodeFactory:pObj.nodeFactory,
//							event:event||window.event,
//							node:this
//						});
//						return;
//					}
//				}
//	        	if(link.type == "line" || link.type == "layer" || link.type == "arrow"){
//	        		this.dotype = undefined;
//        			var div = document.getElementById(pObj.getNodeEntry().canDrawId);
//        			$(div).removeAttr("doMoveId");
//        			$(div).removeAttr("doMoveX");
//        			$(div).removeAttr("doMoveY");
//        			
//	        	}
////        		if(3 == event.which)
////        		{
////        			nodeFunction.dealClickAndDblclick(event,this);
////                }
//        	});
//        	link.click(function(){
//        		//自定义了线段事件
//        		var customToolEvent = pObj.nodeFactory.getCustomComEventByType(this.type);
//				if(customToolEvent != null)
//				{
//					if(customToolEvent.line != null && customToolEvent.line.click != null)
//					{
//						customToolEvent.line.click({
//							nodeFactory:pObj.nodeFactory,
//							event:event||window.event,
//							node:this
//						});
//						return;
//					}
//				}
//				pObj.getNodeEntry().drawLineFlag == false;
//				pObj.getNodeEntry().isMouseDown == false;
//        	});
//		    link.dbclick(function(event){ 
//        		//自定义了线段事件
//		    	var customToolEvent = pObj.nodeFactory.getCustomComEventByType(this.type);
//				if(customToolEvent != null)
//				{
//					if(customToolEvent.line != null && customToolEvent.line.dbclick != null)
//					{
//						customToolEvent.line.dbclick({
//							nodeFactory:pObj.nodeFactory,
//							event:event||window.event,
//							node:this
//						});
//						return;
//					}
//				}
//				pObj.dealClickAndDblclick(event,this);
//		    });
//        },
//		addEventForNode:function(node){
//			//如果自己定义了节点处理函数
//			var pObj = this;
//			var customToolEvent = pObj.nodeFactory.getCustomComEventByType(node.type,node);
//
//			if(pObj.getNodeEntry().isEditer==false){
//				node.dragable = false;
//				if(customToolEvent != null && customToolEvent.node.click != null)
//				{
//					if(customToolEvent.node != null)
//					{
//						customToolEvent.node.click({
//							nodeFactory:pObj.nodeFactory,
//							event:event||window.event,
//							node:this
//						});
//					}
//				}
//				else
//				{
//					node.click(function(event){
//						//初始化一条数据
//						try{
//							pObj.nodeClickEventFunction(this);
//						}catch(e){
//							alert(e);
//						}
//					});
//				}
//
//			}
//			else if(pObj.getNodeEntry().isEditer==true)
//			node.mouseup(function(event)
//			{
//
//				//修改成右键
//				if(3 != event.which){
//					//关闭提示框
//					pObj.closeCanvasDrawShowAttrDiv();
//					return;
//				}
//
//				if(pObj.getNodeEntry().scene.mode == "select"){
//					g_dialog.operateConfirm("设置为一组？",{saveclick : function (){
//						pObj.nodeFactory._group.appendNodeToContainer(pObj.getNodeEntry().scene);
//					}});
//					return;
//				}
//				//如果自定义了节点处理函数
//				if(customToolEvent != null)
//				{
//					if(customToolEvent.node != null && customToolEvent.node.mouseup != null)
//					{
//						customToolEvent.node.mouseup({
//							nodeFactory:pObj.nodeFactory,
//							event:event||window.event,
//							node:this
//						});
//						return;
//					}
//				}
//				//如果是直线，虚线，箭头，可以在画图区画图
//				if(		this.type == "line" || 
//						this.type == "layer" || 
//						this.type == "arrow" ){
//					
//					//直线
//					if(this.type == "line"){
//						pObj.getNodeEntry().LineType = "line";
//					}
//					//虚线
//					else if(this.type == "layer"){
//						pObj.getNodeEntry().LineType = "layer";
//					}
//					//箭头
//					else if(this.type == "arrow"){
//						pObj.getNodeEntry().LineType = "arrow";
//					}
//					pObj.getNodeEntry().drawLineFlag = true;
//					return;
//				}
//				//如果是复制品
//				else if(this.cannClone == true)
//				{
//					var div = document.getElementById(pObj.getNodeEntry().canDrawShowAttr);
//					$(div).show();
//					var input = $(div).find("#pname");
//					$(input).val(""+this.name);
//					$(div).find("#ptype").text(this.type);
//					$(input).attr("domainid",this.domainId);
//					$(input).attr("nodeid",this.id);
//					$(input).unbind("change");
//					$(input).change(function(){
//						var no = pObj.findNodeByScene(pObj.getNodeEntry().scene,$(this).attr("nodeid"));
//						no.text = $(this).val();
//						no.name = $(this).val();
//						
//					});
//					$(div).find("#pid").text(this.id);
//					//读取挂载点
//					pObj.setDependency();
//					//读取可挂载的监控器点
//					if(this.monitor== undefined || this.monitor.entry == undefined || this.monitor.entry == null)
//						pObj.getMonitorsByType(this.type);
//					else
//					{
//						pObj.fillMonitorData(this.monitor.entry);
//					}
//					//关闭编辑线条框
//					pObj.closeCanvasDrawShowAttrLineDiv();
////						$(this).click();
//					
//					
//				}
//				pObj.getNodeEntry().drawLineFlag = false;//是否是点击直线后
//				pObj.getNodeEntry().isMouseDown = false;
//		    	return false;
//		    });  
//			
//			//双击事件
//			node.dbclick(function(event){
//					//如果是编辑模式下
//					if(pObj.getNodeEntry().isEditer==true){
//						//编辑模式下子定义的双击处理事件
//						if(customToolEvent != null)
//						{
//							
//							if(customToolEvent.node != null && customToolEvent.node.dbclick != null)
//							{
//								customToolEvent.node.dbclick({
//									nodeFactory:pObj.nodeFactory,
//									event:event||window.event,
//									node:this
//								});
//								return;
//							}
//						}
//						var ids = [];
//						var tipname = [];
//						var pnode = this;
//						var nodes = pObj.getScene().selectedElements;
//						for(var i=0;nodes!=null&&i<nodes.length;i++){
//							//屏蔽自己,以及各种线条和文字
//							if(nodes[i].id != this.id && 
//									nodes[i].type != "dependence" && 
//									nodes[i].type.indexOf("arrow") == -1 && 
//									nodes[i].type.indexOf("layer") == -1 && 
//									nodes[i].type.indexOf("line") == -1 && 
//									nodes[i].type.indexOf("text") == -1 &&
//									nodes[i].type.indexOf("node") == -1 ){
//								ids[ids.length] = nodes[i].id;
//								tipname[tipname.length] = nodes[i].text;
//							}
//						}
//						if(ids.length>0)
//						{
//							var tip = "";
//							var delmodel = "";
//							//establishRelationshipModel_isDelete 在页面中定义
//							if(establishRelationshipModel_isDelete()){
//								delmodel = "delete";
//								tip = "请再次确认是否将 ["+tipname.join("，")+"] 从 [ "+this.text+"] 上解除关联关系";
//							}
//							else{
//								tip = "请再次确认是否将 ["+tipname.join("，")+"] 关联到 ["+this.text+"] 上？";
//							}
//							g_dialog.operateConfirm(tip,{saveclick : function (){
//								pObj.mountPoint(delmodel,ids,pnode);
//								//如果有提示框开启的必须关闭,防止数据不同步的误操作
//								pObj.closeCanvasDrawShowAttrDiv();
//							}});
//						}
//						else{
//							g_dialog.operateAlert(null,"此模式下需选择其他节点才能进行关联！");
//						}
//						return;
//					}
//					//如果自定义了节点处理事件
//					if(customToolEvent != null)
//					{
//						if(customToolEvent.node != null && customToolEvent.node.dbclick != null)
//						{
//							customToolEvent.node.dbclick({
//								nodeFactory:pObj.nodeFactory,
//								event:event||window.event,
//								node:this
//							});
//							return;
//						}
//					}
//					//正常处理
//					pObj.nodeDBClickEventFunction(this);
//				});
//		},
		/**
		 * 
		 */
		modifyFunction:function(type){
			/**
			 * 对齐算法selectedElements 
			 */
			
				var nodes = nodeEntry.scene.selectedElements;
				//找出最值
				var left = 0;
				var right = 0;
				var up = 0;
				var down = 0;
				
				for(var i=0;i<nodes.length;i++){
					if(left == 0 || left > nodes[i].x){
						left = nodes[i].x;
					}
					if(right == 0 || right < nodes[i].x){
						right = nodes[i].x;
					}
					if(up == 0 || up > nodes[i].y){
						up = nodes[i].y;
					}
					if(down == 0 || down < nodes[i].y){
						down = nodes[i].y;
					}
				}
				//更新坐标
				for(var i=0;i<nodes.length;i++){
					
					if(type == "left"){
						nodes[i].x = left;
					}
					else if(type == "right"){
						nodes[i].x = right;
					}
					else if(type == "up"){
						nodes[i].y = up;
					}
					else if(type == "down"){
						nodes[i].y = down;
					}
				}

		},
		
		isCustomNode:function(node){
			for(var i=0;i<nodeEntry.customComTypes.length;i++){
				if(nodeEntry.customComTypes[i].type == node.type && (node.customnode == true || node.customnode == 'true'))
					return true;
			}
			return false;
		},
		/**
		 * 对象转XML findNodeBySceneByType
		 */
		formatObjectToXml:function(_scene)
		{
			var nodes = _scene.getAllNodes();
			//以下全是节点
			var allItems = new Array();
			var allLinesPoint = new Array();
			var allDependence = new Array();
			var allText = new Array();
			var hasIsSelf = false;
			//扫描一遍是否有应用节点关联自身
			for(var i=0;i<nodes.length;i++){
				if(checkIsNULL(nodes[i].monitor)==false && 
						checkIsNULL(nodes[i].monitor.entry)==false && 
						checkIsNULL(nodes[i].monitor.entry.id)==false && 
						nodes[i].monitor.entry.id == nodeEntry.rootObj.id){
					hasIsSelf = true;
					break;
				}
			}
			
			for(var i=0;i<nodes.length;i++)
			{
				//野节点,这是垃圾数据
				if(nodes[i].type == "node"){
					continue;
				}
				//特殊字符编码，自定义编码
				if(nodeEntry.enCode.length>0){
					for(var l=0;l<nodeEntry.enCode.length;l++){
						var code = nodeEntry.enCode[l];
						if(checkIsNULL(nodes[i].text) ==false ){
							nodes[i].text = nodes[i].text.replace(code.rep, code.code);
							nodes[i].name = nodes[i].text;
						}
					}
				}

				//文字节点
				if(nodes[i].type == "text"){
					var xmlText = '<textnode id="'+nodes[i].id+'" '+
					'name="'+nodes[i].name+'" '+
					'fontSize="'+(nodes[i].fontSize==undefined?60:nodes[i].fontSize)+'" '+
					'fontColor="'+(nodes[i].fontColor==undefined?"":nodes[i].fontColor)+'" '+
					'x="'+nodes[i].x+'" '+
					'y="'+nodes[i].y+'" '+
					'compType="'+nodes[i].type+'" '+//监控器类型,大类
					'type="'+nodes[i].type+'"/>';
					allText.insert(allText.length, xmlText);
					continue;
				}
				if(nodes[i].type.indexOf("arrowStart") != -1 || nodes[i].type.indexOf("arrowEnd") != -1 ||
						nodes[i].type.indexOf("layerStart") != -1 || nodes[i].type.indexOf("layerEnd") != -1 ||
						nodes[i].type.indexOf("lineStart") != -1 || nodes[i].type.indexOf("lineEnd") != -1){
					var lineAlpha = "";
					if(checkIsNULL(nodes[i].lineAlpha) == false){
						lineAlpha = 'lineAlpha="'+nodes[i].lineAlpha+'" ';
					}
					var xmlLinePoint = '<line id="'+nodes[i].id+'" '+
										lineAlpha+
										'lineSize="'+(nodes[i].lineSize==undefined?3:nodes[i].lineSize)+'" '+
										'lineColor="'+(nodes[i].lineColor==undefined?"":nodes[i].lineColor)+'" '+
										'lineText="'+(nodes[i].lineText==undefined?"":nodes[i].lineText)+'" '+
										'x="'+nodes[i].x+'" '+
										'y="'+nodes[i].y+'" '+
										'width="'+nodes[i].width+'" '+
										'height="'+nodes[i].height+'" '+
										'type="'+nodes[i].type+'"/>';
					allLinesPoint.insert(allLinesPoint.length, xmlLinePoint);
					continue;
					
				}
				var monitor = {id:"",entry:{id:"",name:"",type:""}};
				if(nodes[i].monitor != undefined && nodes[i].monitor.entry != undefined)
				{
					monitor = nodes[i].monitor;
					if(monitor.entry.type == undefined)
						monitor.entry.type = "";
					if(monitor.entry.id == undefined)
						monitor.entry.id = "";
					if(monitor.entry.name == undefined)
						monitor.entry.name = "";
					
				}
				if(monitor.entry.type == ""){
					monitor.entry.type = nodes[i].type;
				}
				if(nodeEntry.tmpXmlObj == null || nodeEntry.tmpXmlObj ==undefined){
					nodeEntry.tmpXmlObj = new Object();
				}
				if(nodeEntry.tmpXmlObj.item == null || nodeEntry.tmpXmlObj.item == undefined){
					nodeEntry.tmpXmlObj.item = {
							type:"",
							name:"",
					};
				}
				monitor = $.extend(false,monitor, nodes[i].monitor);
				//特殊字符编码，自定义编码
				if(nodeEntry.enCode.length>0)
				{
					for(var l=0;l<nodeEntry.enCode.length;l++)
					{
						var code = nodeEntry.enCode[l];
						//特殊字符编码，自定义编码
						if(checkIsNULL(monitor.entry)==false){
							monitor.entry.name = monitor.entry.name.replace(code.rep, code.code);
						}
					}
				}
				var bossDisplayType = "";
				
				if(checkIsNULL(nodes[i].bossDisplayType) == true){
					//如果是应用系统,并且关联也有应用系统的
					var flag = this.checkIsChildType(nodeEntry.scene,nodes[i],nodeEntry.appSystem);
					if(flag && hasIsSelf==false)
						nodes[i].bossDisplayType = 1;
				}
				if(checkIsNULL(nodes[i].bossDisplayType) == false){
					bossDisplayType = ' bossDisplayType="'+nodes[i].bossDisplayType+'" ';
					//
					nodes[i].attributes.isSelf = true;
					if(monitor.entry == undefined)
						monitor.entry = new Object();
					nodes[i].name = nodeEntry.rootObj.name;
					monitor.entry.id = nodeEntry.rootObj.id;
					monitor.entry.type = nodeEntry.appSystem;
					monitor.entry.name = nodeEntry.rootObj.name;
				}
				var compId = (monitor.entry!=undefined&&monitor.entry.id!=undefined?monitor.entry.id:'');
				var custom = "";
				//如果是自定义节点
				if(this.isCustomNode(nodes[i]) == true){
					
					custom = 	'customnode="true" '+
								'fillColor="'+(nodes[i].fillColor==undefined?3:nodes[i].fillColor)+'" '+
								'fontSize="'+(nodes[i].fontSize==undefined?"":nodes[i].fontSize)+'" '+
								'fontColor="'+(nodes[i].fontColor==undefined?"":nodes[i].fontColor)+'" '+
								'alpha="'+(nodes[i].alpha==undefined?"":nodes[i].alpha)+'" ';
					
					
				}
				if(compId == nodeEntry.rootObj.id){
					nodes[i].name = nodeEntry.rootObj.name;
				}
				
				var xmlItem = '<item id="'+nodes[i].id+'" '+
						custom+
						'type="'+nodes[i].type+'" '+
						'name="'+nodes[i].name+'" '+bossDisplayType+
						'compId="'+compId+'" '+//监控器ID
						'compName="'+(monitor.entry!=undefined&&monitor.entry.name!=undefined?monitor.entry.name:'')+'" '+//监控器名称
						'compType="'+nodes[i].type+'" '+//监控器类型,大类
						'compTypeC="'+(monitor.entry!=undefined&&monitor.entry.type!=undefined?monitor.entry.type:'')+'" '+//监控器类型,子类
						'zIndex="'+(nodes[i].attributes.zIndex==undefined?'':nodes[i].attributes.zIndex)+'" '+
						'x="'+nodes[i].x+'" '+
						'y="'+nodes[i].y+'" '+
						'oldX="'+(nodes[i].attributes.oldX==undefined?'':nodes[i].attributes.oldX)+'" '+
						'oldY="'+(nodes[i].attributes.oldY==undefined?'':nodes[i].attributes.oldY)+'" '+
						'width="'+nodes[i].width+'" '+
						'height="'+nodes[i].height+'" '+
						'isSelf="'+(nodes[i].attributes.isSelf==undefined?'false':nodes[i].attributes.isSelf)+'" '+
						'status="'+(monitor.entry!=undefined&&monitor.entry.id!=undefined?'CONFIG':'NO')+'" '+//挂载了监控器就行需要设置成CONFIG
						'systemPerformImpactFactor="'+(nodes[i].attributes.systemPerformImpactFactor==undefined?'50':nodes[i].attributes.systemPerformImpactFactor)+'" '+
						'dbId="'+(nodes[i].attributes.dbId==undefined?'':nodes[i].attributes.dbId)+'" '+
						'visible="'+(nodes[i].attributes.visible==undefined?'true':nodes[i].attributes.visible)+'" '+
						'cloudId="'+(nodes[i].attributes.cloudId==undefined?'':nodes[i].attributes.cloudId)+'"/>';
				
				allItems.insert(allItems.length, xmlItem);
				var mounts = nodes[i].mounts;
				for(var j=0;mounts!=undefined&&j<mounts.length;j++)
				{
					var hidden = "";
					if(mounts[j].hidden == true)
						hidden = "true";
					//lineModel
					var lineModel = "";
					var lineAlpha = "";
					var direction = "";
					
					var lin =  this.findNodeByScene(nodeEntry.scene,mounts[j].id+"::"+nodes[i].id);
					if(lin == null || lin == undefined)
						continue;
					var startNode = this.findNodeByScene(nodeEntry.scene,mounts[j].id);
					if(checkIsNULL(startNode.lineModel) == false){
						lineModel = '" lineModel="'+startNode.lineModel;
					}
					if(checkIsNULL(startNode.lineAlpha) == false){
						lineAlpha = '" lineAlpha="'+startNode.lineAlpha;
					}
					if(checkIsNULL(startNode.direction) == false)
						direction = '" direction="'+startNode.direction;
					var modify = this.findModifyStyle(startNode,nodes[i].id);
					var xmlDep = '<dependence startId="'+mounts[j].id+
					
					'" endId="'+nodes[i].id+
					'" offsetGap="'+(lin.offsetGap==undefined?"":lin.offsetGap)+
					'" hidden="'+hidden+lineModel+lineAlpha+direction+
					'" ismodify="'+(modify.ismodify==undefined?"":modify.ismodify)+
					'" lineColor="'+(modify.lineColor==undefined?"":modify.lineColor)+
					'" lineSize="'+(modify.lineSize==undefined?"":modify.lineSize)+
					'" lineText="'+(modify.lineText==undefined?"":modify.lineText)+
					'" visible="'+(mounts[j].visible==undefined?"true":mounts[j].visible)+
					'" dependenceRatio="'+(startNode.dependenceRatio==undefined?"80":startNode.dependenceRatio)+
					'" dependenceType="'+(startNode.dependenceType==undefined?"KEY":startNode.dependenceType)+'"/>';
					allDependence.insert(allDependence.length, xmlDep);
				}
				
			}
			var xmlRoot = '<root id="'+nodeEntry.rootObj.id+'" '+
								'name="'+nodeEntry.rootObj.name+'" '+
								'contact="'+nodeEntry.rootObj.contact+'" '+
								'tel="'+nodeEntry.rootObj.tel+'" '+
								'email="'+nodeEntry.rootObj.email+'" '+
								'desc="'+nodeEntry.rootObj.desc+'" '+
								'dataStatus="'+nodeEntry.rootObj.dataStatus+'" '+
								'topoId="'+nodeEntry.rootObj.topoId+'" '+
								'bgImg="'+nodeEntry.rootObj.bgImg+'" '+
								'zoom="'+_scene.scaleX+'" '+
								'thumbmailId="'+nodeEntry.rootObj.thumbmailId+'" '+
								'x="'+_scene.translateX+'" '+
								'y="'+_scene.translateY+'" '+
								'autoRefreshTime="'+nodeEntry.rootObj.autoRefreshTime+'">';
			
			for(var i=0;i<allItems.length;i++)
			{
				xmlRoot = xmlRoot+allItems[i];
			}
			for(var i=0;i<allDependence.length;i++)
			{
				xmlRoot = xmlRoot+allDependence[i];
			}
			for(var i=0;i<allLinesPoint.length;i++)
			{
				xmlRoot = xmlRoot+allLinesPoint[i];
			}
			for(var i=0;i<allText.length;i++)
			{
				xmlRoot = xmlRoot+allText[i];
			}
			var groupXml = this.nodeFactory._group.toXml(this.getScene());
			xmlRoot = xmlRoot+groupXml;
			xmlRoot = xmlRoot+"</root>";
			xmlRoot = '<?xml version="1.0" encoding="UTF-8"?>'+xmlRoot;
//			console.log(xmlRoot);
			return xmlRoot;
		}

	}
});