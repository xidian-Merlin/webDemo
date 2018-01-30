define(['/js/plugin/monitor/monitor.js',
	'/js/plugin/dialog/dialog.js',
	'sweetAlert',
	'/js/plugin/colorChange/colorChange.js',
	'/js/plugin/topo/jtopo-0.4.8-dev.js',
	'/js/lib/JsonTools.js',
	'/js/lib/Json2xml.js',
	'/js/plugin/topo/sonic.js',
	'/js/plugin/topo/editor.js',
    '/js/plugin/topo/network.js',
    '/js/plugin/topo/topologyProperties.js'],function (monitor,dialog,sweetAlert,colorChange,jtopo,JsonTools,Json2xml,sonic,editorJs,network,topologyProperties){
		/** ------------------------------------------------- 以下为flex部分鼠标右击插件 ----------------------------------------*/
/**
 * 
 * Copyright 2007
 * 
 * Paulius Uza
 * http://www.uza.lt
 * 
 * Dan Florio
 * http://www.polygeek.com
 * 
 * Project website:
 * http://code.google.com/p/custom-context-menu/
 * 
 * --
 * RightClick for Flash Player. 
 * Version 0.6.2
 * 
 */

 var FlexRightClick = {
	/**
	 *  Constructor
	 */ 
	 init: function () {
	 	this.FlashObjectID = "topo";
	 	this.FlashContainerID = "flashContent";
	 	this.Cache = this.FlashObjectID;
	 	if(window.addEventListener){
	 		window.addEventListener("mousedown", this.onGeckoMouse(), true);
	 	} else {
	 		document.getElementById(this.FlashContainerID).onmouseup = function() { document.getElementById(FlexRightClick.FlashContainerID).releaseCapture(); }
	 		document.oncontextmenu = function(){ if(window.event.srcElement.id == FlexRightClick.FlashObjectID) { return false; } else { FlexRightClick.Cache = "nan"; }}
	 		document.getElementById(this.FlashContainerID).onmousedown = FlexRightClick.onIEMouse;
	 	}
	 },
	/**
	 * GECKO / WEBKIT event overkill
	 * @param {Object} eventObject
	 */
	 killEvents: function(eventObject) {
	 	if(eventObject) {
	 		if (eventObject.stopPropagation) eventObject.stopPropagation();
	 		if (eventObject.preventDefault) eventObject.preventDefault();
	 		if (eventObject.preventCapture) eventObject.preventCapture();
	 		if (eventObject.preventBubble) eventObject.preventBubble();
	 	}
	 },
	/**
	 * GECKO / WEBKIT call right click
	 * @param {Object} ev
	 */
	 onGeckoMouse: function(ev) {
	 	return function(ev) {
	 		if (ev.button != 0) {
	 			FlexRightClick.killEvents(ev);
	 			if(ev.target.id == FlexRightClick.FlashObjectID && FlexRightClick.Cache == FlexRightClick.FlashObjectID) {
	 				FlexRightClick.call();
	 			}
	 			FlexRightClick.Cache = ev.target.id;
	 		}
	 	}
	 },
	/**
	 * IE call right click
	 * @param {Object} ev
	 */
	 onIEMouse: function() {
	 	if (event.button > 1) {
	 		if(window.event.srcElement.id == FlexRightClick.FlashObjectID && FlexRightClick.Cache == FlexRightClick.FlashObjectID) {
	 			FlexRightClick.call(); 
	 		}
	 		document.getElementById(FlexRightClick.FlashContainerID).setCapture();
	 		if(window.event.srcElement.id)
	 			FlexRightClick.Cache = window.event.srcElement.id;
	 	}
	 },
	/**
	 * Main call to Flash External Interface
	 */
	 call: function() {
	 	document.getElementById(this.FlashObjectID).openRightClick();
	 }
	}

	var canvas,stage;
	var animateCache = [];
	/** ------------------------------------------------- 以下为flex部分调用方法 ----------------------------------------*/
	return {
		/*getServerIp : function (swfId){
			document.getElementById(swfId).getServerIp(index_web_app);
		},*/
		doCancel : function (){
			// alert("doCancel");
		},
		goBack : function (type,fromType){
			// if(type=="edit"){
			// 	if(fromType=='grid'){
			// 		window.location.href = "#/sys_manage/monitor_config/app_monitor_config";
		    //       }else{
			// 		window.location.href = "#/sys_manage/monitor_config/app_monitor_config";
			// 	}
			// }else if(type=="view"){
				if(fromType=='grid'){
					window.location.href = "#/monitor_info/app_monitor?fromType=grid";
				}else{
					window.location.href = "#/monitor_info/app_monitor";
				}
			// }
		},
		showMonitor : function (compId,compType,id){
			//应用系统
			if("appSystem"==compType){
				window.location.href = "#/monitor_info/app_monitor_topo?appId="+compId+"&fromType=thumb";
			}else if("os"==compType||"middleware"==compType||"database"==compType||
	   		"netDevice"==compType||"securityDevice"==compType||"storeDevice"==compType||
	   		"appsoftware"==compType||"generalAgreement"==compType){

				window.open('#/monitor_info/monitor_obj/monitor_info?monitorTypeId='+""+'&monitorId='+compId+'&regionId=&assetId='+""+'&hideMenu=1&queryByMonitor=1');
			}else {
				$.ajax({
					type : "GET",
					url : "module/sys_manage/monitor_config/app_monitor_config_tpl.html",
					server : "/",
					success : function(data){
						dialog.dialog($(data).find("[id=eventList]") ,{
							title : "事件详细信息",
							isDetail : true,
							width:"700px",
							init : init,
							initAfter : initAfter,
							saveclick : save 
						});
						function init(el) 
						{
						}
						function initAfter(el){
							g_grid.render(el.find("#event_table_div"),{
								header:[
								{text:'组件名称',name:"compName"},
								{text:'事件名称',name:"eventName"},
								{text:'事件类型',name:"eventType"},
								{text:'发生时间',name:"enterDate"}
								],
								url:"appMonitor/queryEventsList",
								paramObj : {compId : compId ,id : id ,compType : compType},
								hideSearch : true,
								maskObj : el
							});
						}
						function save(el){
						}
					}
				});
			}
		},
		addMonitor : function (type){
			var url = {
				edit_tpl : "module/sys_manage/monitor_config/monitor_config_tpl.html",
				monitor_type_data : "deviceMonitor/queryMonitorClassAndTypeList"
			};
			var swfId = "Main";
			monitor.monitorDialog({
				url : url.edit_tpl,
				ele : "[id=edit_template]",
				title : "监控器添加",
				showList : true,
				monitorType : url.monitor_type_data,
				step : 5,
				navTit : ["监控器类型" ,"被监控资产" ,"基本信息" ,"凭证信息" ,"指标信息"],
				submitCbf : function(){
					refreshMonitor(swfId,type)
				}
			});
		},
		doHelp : function (index){
			// g_dialog.operateAlert(null,"doHelp");
			// var flag = 0; //0是不存在，显示默认
			// if(typeof(index) == 'undefined'){
			// 	index ='default';
			// }else{
			// 	um_ajax_get({
			// 		url : "HelpExplain/queryNameExist?name="+index.toString()+"",
			// 		isAsync : false,
			// 		successCallBack : function (data){
			// 			flag = data.flag;
			// 		}
			// 	});
			// }
			// if(flag==0){
			// 	index = 'default';
			// }
			// window.open ('/module/helpExplain/helpExplain.html?name='+index+'', '帮助', 'height=650, width=320, top=20, left=0, toolbar=no, menubar=no, scrollbars=yes,overflow:auto,resizable=yes,location=no, status=no') 
		},
		goTopo : function (topoId,appId,appName){
			var flag = 3;//权限过滤，1：拓扑编辑;0：拓扑监控、网络拓扑
			var appMonitorFlag = 1;
			window.location.href = "#/monitor_info/topo_manage_topo?topoId="+topoId+"&topoType=2&flag="+flag+"&appMonitorFlag=" + appMonitorFlag + "&appId=" + appId + "&appName=" + encodeURI(encodeURIComponent(appName));
		},
		goToAppMonitorViewThumbnail : function (){
			alert("goToAppMonitorViewThumbnail");
		},
		refreshMonitor : function (swfId,type){
			alert("refreshMonitor");
			document.getElementById(swfId).refreshMonitor(type);
		},
		doUpload : function (swfId,title,serverPath,fileTitle){

			var url = {
				bgUpload : "module/sys_manage/monitor_config/app_monitor_config_tpl.html"
			};

			$.ajax({
				type : "GET",
				url : url.bgUpload,
				server : "/",
				success : function(data){
					dialog.dialog($(data).find("[id=bgUpload]") ,{
						title : title,
						init : init,
						saveclick : save 
					});
					function init(el) 
					{
						$(el).find("#fileInputLabel").text(fileTitle);
						index_create_upload_el($(el).find("[id=fileInput]"));
					}
					function save(el){
						um_ajax_file(el.find("#fileUpload_form") ,{
							url : "deviceRoom/uploadFile",
							maskObj : el,
							paramObj : {url : "/flash/appmonitor/assets/background/"},
							successCallBack : function (data){
								dialog.hide(el);
								g_topo.refreshFlash(swfId,data);
							}
						});
					}
				}
			});

		},
		refreshFlash : function (swfId,path){
			document.getElementById(swfId).refreshFlash();
		},
		/*以下为拓扑管理功能对应js方法 */
		topoSaveFile : function (imgView){
			var form = document.getElementById("exportForm");
			var form = $("#exportForm");
			form.find("#asset").val(imgView);
			form.prop("action",index_web_app+"topoManage/saveFile");
			form.submit();
		},
		topoGoBack : function (where){
			if(where == "edit"||where == "view"){
				window.location.href =  "#/monitor_info/topo_manage";
				// window.parent.parent.subLocus("tuppumanagement");//设置菜单
			}

			else if(where == "show"){
				window.location.href =  "#/monitor_info/topo_manage";
			}
			else if(where == "HBshow")
			{
				if(globalTopoFlag == "1")
				{//全国拓扑点击进入默认拓扑图后退出
					window.location =  "#/pages/asset/topo/globalTopoShow.jsp";
				}
				else if(globalTopoFlag == "2")
				{//进入运维首页后点击星星进入默认拓扑图
					window.location =  "#/shared/media/flash/envProtectShow/envProtectShow.jsp?globalTopoFlag=2";
				}
				else
				{//拓扑管理点击拓扑地图进入默认拓扑图后退出
					window.location =  "#/shared/media/flash/envProtectShow/envProtectShow.jsp";
				}
			}
			else if(where == "linkShow")
			{
				window.location =  "#/shared/media/flash/LinkTopoShow/linkTopoShow.jsp";
			}
			
			if(where == "appMonitor"){	//应用监控进入拓扑监控页面
				// var appId = '<%= request.getParameter("appId") %>';
				// <%
				// 	String appName = request.getParameter("appName");
				// 	if(appName!=null){
				// 		appName = URLDecoder.decode(request.getParameter("appName"), "UTF-8");
				// 	}
				// %>	
				// var appName = '<%= appName %>';
				// var baseJson = '{"id":"'+ appId + '","opType":"view","theme":"'+ unieap.themeName + '","fromType":"thumb"}';
				// window.location = "/shared/media/flash/appmonitor/Main.jsp?baseJson=" + baseJson;
			}
		},
		topoBackAlert : function (info){
			g_dialog.operateAlert(null,info,"error");
			window.location.href = "#/monitor_info/topo_manage";
		},
		topoJsAlert : function (info){
			g_dialog.operateAlert(null,info,"error");
		},
		consoleLog : function (info){
			console.log(info);
		},
		topo_goTopoName : function (){
			// alert("topo_goTopoName");跳转父topo
		},
		topo_doPing : function (){
			var wsh = null;
			try{
				wsh = new ActiveXObject('WScript.Shell');
			}catch(e){
				doAlert();
			}
			if(wsh)
			{
				if(ipAddr.indexOf('^')==-1)
				{
					wsh.Run('cmd  /k ping ' + ipAddr);
				}else
				{
					wsh.Run('cmd /k');
				}
			}
		},
		topo_doTelnet : function (){
			var wsh = null;
			try{
				wsh = new ActiveXObject('WScript.Shell');
			}catch(e){
				doAlert();
			}
			if(wsh)
			{
				if(ipAddr.indexOf('^')==-1)
				{
					wsh.Run('cmd  /k telnet ' + ipAddr);
				}else
				{
					wsh.Run('cmd /k');
				}
			}
		},
		topo_doTraceroute : function (){
			var wsh = null;
			try{
				wsh = new ActiveXObject('WScript.Shell');
			}catch(e){
				doAlert();
			}
			if(wsh)
			{
				if(ipAddr.indexOf('^')==-1)
				{
					wsh.Run('cmd  /k tracert ' + ipAddr);
				}else
				{
					wsh.Run('cmd /k');
				}
			}
		},
		topo_doMstsc : function (){
			var wsh = null;
			try{
				wsh = new ActiveXObject('WScript.Shell');
			}catch(e){
				doAlert();
			}
			if(wsh)
			{
				if(ipAddr.indexOf('^')==-1)
				{
					wsh.Run('cmd  /k mstsc /v:' + ipAddr);
				}else
				{
					wsh.Run('cmd /k');
				}
			}
		},
		topo_webCtl : function (param){
			window.open(param);
		},
		topo_doSsh : function (){
			var wsh = null;
			try{
				wsh = new ActiveXObject('WScript.Shell');
			}catch(e){
				doAlert();
			}
			if(wsh)
			{
				if(ipAddr.indexOf('^')==-1)
				{
					wsh.Run('putty ' + ipAddr);
				}else
				{
					wsh.Run('cmd /k');
				}
			}
		},
		topo_gotoFaultEventList : function (){
			alert("topo_gotoFaultEventList")
		},
		topo_gotoDeviceMonitor : function (edId,regionId){
			var tmpId = -1;
			um_ajax_get({
				url : "monitorView/queryEdMonitor",
				paramObj : {edId : edId},
				successCallBack : function (data){
					var  resultObj = data.edmonitorstore;
					if(Object.keys(resultObj).length<1){
						g_dialog.operateAlert(null,"该设备上没有配置监控器","error");
						tmpId = 0;
					}else {
						//window.open('#/monitor_info/monitor_obj/monitor_info?monitorTypeId=&monitorId=&regionId='+regionId+'&assetId='+edId+'&hideMenu=1&queryByAsset=1');
						tmpId =1;
					}
				}
			});
			$("[class=pg-header]").everyTime(100 ,function (){
				if (tmpId == 1)
				{
					console.log(1)
					window.open('#/monitor_info/monitor_obj/monitor_info?monitorTypeId=&monitorId=&regionId='+regionId+'&assetId='+edId+'&hideMenu=1&queryByAsset=1');
					$("[class=pg-header]").stopTime();
				}
				else if(tmpId == 0){
					console.log(0)
					$("[class=pg-header]").stopTime();
				}
				console.log(-1);
			})
		},
		topo_doWebLogin : function (){
			alert("topo_doWebLogin")
		},
		topo_goTopoBackName : function (param){
			//跳转到父拓扑图
			var topoId = param;
			um_ajax_get({
				url : "topoManage/getTopoName",
				paramObj : {topoId : topoId},
				successCallBack : function (data){
					//设置菜单路径
					swal(data.topoName);
				}
			});
		},
		topo_goClassificationBack : function (){
			alert("topo_goClassificationBack")
		},
		topo_doUpload : function (){
			var url = {
				bgUpload : "module/sys_manage/monitor_config/app_monitor_config_tpl.html"
			};

			$.ajax({
				type : "GET",
				url : url.bgUpload,
				server : "/",
				success : function(data){
					dialog.dialog($(data).find("[id=bgUpload]") ,{
						title : "上传背景图",
						init : init,
						saveclick : save 
					});
					function init(el) 
					{
						$(el).find("#fileInputLabel").text("选择图片");
						index_create_upload_el($(el).find("[id=fileInput]"));
					}
					function save(el){
						um_ajax_file(el.find("#fileUpload_form") ,{
							url : "deviceRoom/uploadFile",
							maskObj : el,
							paramObj : {url : "/flash/topo/assets/themes/backGroundImage/"},
							successCallBack : function (data){
								dialog.hide(el);
								document.getElementById("topo").getImagePath();
							}
						});
					}
				}
			});
		},
		topo_upload : function (){
			alert("topo_upload")
		},
		topo_monitorView : function (){
			window.open('#/monitor_info/monitor_obj/monitor?hideMenu=1');
		},
		topo_ManualRefresh : function (){
			window.location.reload()
		},
		topo_gotoImportantPort : function (){
			window.open("#/sys_manage/monitor_config/imp_interface");
		},
		topo_rightClickInit : function (){
			FlexRightClick.init()
		},
		topo_assetQuery : function (deviceStr){
			asset.queryDialog({
				subtract : deviceStr,
				saveclick : function (dataList){
					console.log(dataList)
					// document.getElementById("topo").getImagePath();
				}
			});
		},
		bigScreenResize : function (){
			'undefined' != typeof canvas &&canvas && (canvas.width = $(".item:visible").width());
			'undefined' != typeof canvas &&canvas && (canvas.height = $(".item:visible").height());
			'undefined' != typeof stage && stage && stage.childs.length>0 && (stage.childs[0].centerAndZoom());
		},
		bigScreenClear : function (){
			canvas = document.getElementById('canvas');
			if(!stage){
				stage = new JTopo.Stage(canvas);
			}
			stage.clear();
			for(var i=0;i<animateCache.length;i++){
				animateCache[i].stop();
			}
			animateCache = [];
			JTopo.Animate.stopAll();
		},
		initBigScreenShow : function (){

			var url = {
				importUrl : 'topoManage/getDefaultTopoMonitor'
			};

			var json2xml = new Json2xml({
				attributePrefix : ""
			});
			// this.bigScreenClear();
			canvas = document.getElementById('canvas');
			if(!stage){
				stage = new JTopo.Stage(canvas);
			}
			stage.clear();
			for(var i=0;i<animateCache.length;i++){
				animateCache[i].stop();
			}
			animateCache = [];
			JTopo.Animate.stopAll();
			canvas.width = $(".item:visible").width();
			canvas.height = $(".item:visible").height();
			stage.width = 5000;
			stage.height = 5000;

			var loadingObj = {
				width: 100,
				height: 100,

				stepsPerFrame: 1,
				trailLength: 1,
				pointDistance: .05,

				strokeColor: '#b9b9b9',

				fps: 20,

				setup: function() {
					this._.lineWidth = 4;
				},
				step: function(point, index) {

					var cx = this.padding + 50,
					cy = this.padding + 50,
					_ = this._,
					angle = (Math.PI/180) * (point.progress * 360),
					innerRadius = index === 1 ? 10 : 25;

					_.beginPath();
					_.moveTo(point.x, point.y);
					_.lineTo(
						(Math.cos(angle) * innerRadius) + cx,
						(Math.sin(angle) * innerRadius) + cy
						);
					_.closePath();
					_.stroke();

				},
				path: [
				['arc', 50, 50, 40, 0, 360]
				]
			}
			$("#loading").css("top",canvas.height/2-50);
			$("#loading").css("left",canvas.width/2-50);
			var sonic = new Sonic(loadingObj);
			$("#loading").html("");
			$("#loading").append(sonic.canvas);
			init();
			function init(){
				$("#loading").show();
				sonic.play();
				um_ajax_get({
					url : url.importUrl,
					isLoad : false,
					successCallBack : function (data){
						sonic.stop();
						$("#loading").hide();
						$("#loading").html("");
						if(data){
							var jsonobj = json2xml.xml_str2json(data);
							formatJson(jsonobj);
						}else {
							g_dialog.operateAlert(null,"暂无默认拓扑图","error");
						}
					},
					failCallBack : function (e){
						sonic.stop();
						$("#loading").hide();
						$("#loading").html("");
					}
				})
			}
			function formatJson(jsonobj){
				if(jsonobj.root){
					canvas.width = $(".item:visible").width();
					canvas.height = $(".item:visible").height();
					stage.clear();
					for(var i=0;i<animateCache.length;i++){
						animateCache[i].stop();
					}
					animateCache = [];
					JTopo.Animate.stopAll();
					stage.id=jsonobj.root.id;
					// stage.wheelZoom = 0.85;
					var _root = jsonobj.root;

					scene = new JTopo.Scene();
					scene.mode = "select";
					stage.add(scene);
					scene.translateX = Number(_root.x);
					scene.translateY = Number(_root.y);

					var containers = [];
					if(_root.squareBoxes.squareBox){
						if(_root.squareBoxes.squareBox instanceof Array){
							for(var i=0;i<_root.squareBoxes.squareBox.length;i++){
								var squareBox = _root.squareBoxes.squareBox[i];
								var container = new JTopo.Container();
								container.id = squareBox.id;
								var color = tenTo16(squareBox.backgroundColor);
								container.fillColor = colorChange.colorRgb("#"+color);
								container.borderRadius = 15;
								console.log(container.fillColor);
								container.setLocation(Number(squareBox.x),Number(squareBox.y));
								container.setSize(Number(squareBox.width),Number(squareBox.height));
								container.layout = null;
								container.dragable = false;
								scene.add(container);
								containers.push(container);
							}
						}else {
							var squareBox = _root.squareBoxes.squareBox;
							var container = new JTopo.Container();
							container.id = squareBox.id;
							var color = tenTo16(squareBox.backgroundColor);
							container.fillColor = colorChange.colorRgb("#"+color);
							container.borderRadius = 15;
							console.log(container.fillColor);
							container.setLocation(Number(squareBox.x),Number(squareBox.y));
							container.setSize(Number(squareBox.width),Number(squareBox.height));
							container.layout = null;
							container.dragable = false;
							scene.add(container);
							containers.push(container);
						}
					}

					if(_root.dynTexts.dynText){
						if(_root.dynTexts.dynText instanceof Array){
							for(var i=0;i<_root.dynTexts.dynText;i++){
								var dynText = _root.dynTexts.dynText[i];
								var textNode = new JTopo.TextNode(dynText.text);
								textNode.id = dynText.id;
								textNode.font = '16px Consolas';
								textNode.dragable = false;
								textNode.showSelected = false;
								textNode.setLocation(Number(dynText.x),Number(dynText.y) );
								scene.add(textNode);
								for(var j=0;j<containers.length;j++){
									var tempContainer = containers[j];
									if(tempContainer.isInBound(Number(textNode.x),Number(textNode.y) )){
										tempContainer.add(textNode);
									}
								}
							}
						}else {
							var dynText = _root.dynTexts.dynText;
							var textNode = new JTopo.TextNode(dynText.text);
							textNode.id = dynText.id;
							textNode.font = '16px Consolas';
							textNode.dragable = false;
							textNode.showSelected = false;
							textNode.setLocation(Number(dynText.x),Number(dynText.y) );
							scene.add(textNode);
							for(var j=0;j<containers.length;j++){
								var tempContainer = containers[j];
								if(tempContainer.isInBound(Number(textNode.x),Number(textNode.y) )){
									tempContainer.add(textNode);
								}
							}
						}
					}

					if(_root.nodes.node){
						for(var i=0;i<_root.nodes.node.length;i++){
							var item = _root.nodes.node[i];
							var node = itemToNode(item);
							scene.add(node);
							for(var j=0;j<containers.length;j++){
								var tempContainer = containers[j];
								if(tempContainer.isInBound(node.x,node.y)){
									tempContainer.add(node);
								}
							}
						}
					}
					if(_root.lines.line){
						for(var i=0;i<_root.lines.line.length;i++){
							var dependence = _root.lines.line[i];
							var link = dependenceToLink(dependence,scene);
							scene.add(link);
						}
					}
					scene.centerAndZoomPadding = 25;
					scene.centerAndZoom();
					// window.clearInterval(index_interval_4);
					// index_interval_4 = setInterval (function (){
					// 	init();
					// },1000*60*5);
				}else {
					g_dialog.operateAlert(null,"数据加载出错","error");
				}

			}


			function tenTo16(num){
				num = Number(num);
				var str = num.toString(16);
				while(str.length<6){
					str = '0'+str;
				}
				return str;
			}


			function newNode(x, y, w, h, text ,imgurl){
				var node = new JTopo.Node(text);
				node.setLocation(x, y);
				node.setSize(w, h);
				imgurl && node.setImage(imgurl);
				node.font = '14px Consolas';
				return node;
			}
			function itemToNode(item){
				var x = Number(item.x);
				var y = Number(item.y);
				var width = Number(item.width || 40);
				var height = Number(item.height || 40);
				var w = Number(width);
				var h = Number(height);
				var id = item.id;
				var name = item.name;
				var imgurl = imgMapping(item);
				if(imgurl.indexOf("hubswitch")!= -1){
					w= 2*w;
					h= 2*h;
				}
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
						node.alarmColor = "255,0,0";
					}
				}
				node.dragable = false;
				node.showSelected = false;
				// node.id=getUuid();//给节点赋予不同id可以解决仅方向不同两条线重合问题
				node.id=item.asset.id;
				node.myTopoStyle = true;
				node.eventlevel = item.eventlevel;
				node.alarmAlpha = 0.5;
				node.alarmBackground = '/img/topo/new/stpclient.svg';
				node.alarmBackground_scale = 1.3;
				if(node.eventlevel=='2'||node.eventlevel=='3'||node.eventlevel=='1'){
					if(node.eventlevel=='1'){
						node.alarmBackground_color = 'rgb(240,173,78)';
					}else {
						node.alarmBackground_color = 'rgb(217,83,79)';
					}
					var tempAnimate = JTopo.Animate.stepByStep(node,
							{
								alarmAlpha:0.2
							}, 1000, true , true).start();
					animateCache.push(tempAnimate);
				}
				return node;
			}
			function imgMapping(item){
				var img = item.img;
				var imgName = img.substring(img.lastIndexOf('/')+1,img.lastIndexOf('.'));
				var imgurl = "/img/topo/new/"+ imgName + ".svg";
				if(imgName.indexOf('cloud')!=-1){
					imgurl = "/img/topo/new/cloud/"+ imgName + ".svg";
				}
				if(validateImage(imgurl)){
					return "/img/topo/new/"+ imgName + ".svg";
				}else {
					return  index_web_app + "img/" + item.img;
				}
			}
			function validateImage(url)
			{    
				var xmlHttp ;
				if (window.ActiveXObject)
				{
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				else if (window.XMLHttpRequest)
				{
					xmlHttp = new XMLHttpRequest();
				}
				xmlHttp.open("Get",url,false);
				xmlHttp.send();
				if(xmlHttp.status==404)
					return false;
				else
					return true;
			}
			function getUuid() {
			    var len = 32; //32长度
			    var radix = 16; //16进制
			    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			    var uuid = [],
			    i;
			    radix = radix || chars.length;
			    if (len) {
			    	for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			    } else {
			    	var r;
			    	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			    	uuid[14] = '4';
			    	for (i = 0; i < 36; i++) {
			    		if (!uuid[i]) {
			    			r = 0 | Math.random() * 16;
			    			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8: r];
			    		}
			    	}
			    }
			    return uuid.join('');
			}

			function newLink(nodeA, nodeZ, text, direction){
				var link = new JTopo.Link(nodeA, nodeZ, text);
			    // link.direction = direction || 'horizontal';
			    // link.arrowsRadius = 15; //箭头大小
			    // link.lineWidth = 3; // 线宽
			    // link.bundleOffset = 60; // 折线拐角处的长度
			    link.bundleGap = 20; // 线条之间的间隔
			    // link.textOffsetY = 3; // 文本偏移量（向下3个像素）
			    // link.strokeColor = '0,200,255';//JTopo.util.randomColor(); // 线条颜色随机
			    link.font = '14px Consolas';
			    link.deltS = 20;
			    link.deltE = 20;
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
				link.textRotate = true;
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
				//以两边节点的最大宽高决定转弯处的偏移量
				var maxwidth = Math.max(startNode.width,endNode.width);
				var maxheight = Math.max(startNode.height,endNode.height);
				var max = Math.max(maxwidth,maxheight);
				if(max/2>link.bundleOffset){
					link.bundleOffset = max/2;
				}
				if(dependence.color=="red"){
					link.strokeColor = "217,83,79";
				}else if(dependence.color=="green"){
					link.strokeColor = "98,203,49";
				}else {

				}
				if(startPort&&dependence.attention=='start'){
				}else if(endPort&&dependence.attention=='end'){
				}else {
					if(startPort&&endPort){
						var max = Math.max(startPort.exFlux,startPort.imFlux,endPort.exFlux,endPort.imFlux);
						link.text = formatFlux(max);
					}else {
						link.text = '0B/s';
					}
				}
				function formatFlux(flux){
					if(Number(flux)/1000<1){
						return Number(flux) + 'B/s';
					}else if(Number(flux)/1000/1000<1){
						return (Number(flux)/1000).toFixed(2) + 'K/s';
					}else if(Number(flux)/1000/1000/1000<1){
						return (Number(flux)/1000/1000).toFixed(2) + 'M/s';
					}else {
						return (Number(flux)/1000/1000/1000).toFixed(2) + 'G/s';
					}
				}
				link.showSelected = false;
				link.addEventListener('mouseover',function (){
					this.oldZIndex = this.zIndex;
					this.zIndex = 998;
					startNode.oldZIndex = startNode.zIndex;
					startNode.zIndex = 999;
					endNode.oldZIndex = endNode.zIndex;
					endNode.zIndex = 999;
					scene.reZIndex();
				});
				link.addEventListener('mouseout',function (){
					this.zIndex = this.oldZIndex;
					startNode.zIndex = startNode.oldZIndex;
					endNode.zIndex = endNode.oldZIndex;
					scene.reZIndex();
				});
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

		}

	}

});