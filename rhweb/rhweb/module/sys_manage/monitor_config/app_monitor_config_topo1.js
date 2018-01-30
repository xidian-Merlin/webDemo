var json2xml = null;
$(document).ready(function (){
//require(['/js/plugin/topo/jtopo-0.4.8-dev.js',
//         '/js/plugin/topo/editor.js',
//         '/js/plugin/topo/network.js',
//         '/js/plugin/topo/topologyProperties.js',
//         '/js/lib/JsonTools.js',
//         '/js/lib/Json2xml.js',
//         '/js/drawToolLable.js',
//         '/js/draw/group.js',
//         '/js/draw/node.js',
//         '/js/draw/addApp.js'] ,function (jtopo,editorJs,network,topologyProperties,JsonTools,Json2xml,toolsLable,group){
	
	//,param,nodeFunction,group
	/**
	 * 	'/js/draw/node-ui-param.js',
	'/js/draw/node-ui-function.js',
	'/js/draw/group.js',
	'/js/lib/Json2xml.js',
	 */
	
	require(['/js/draw/node-ui.js',
//	         '/js/draw/node-ui-param.js',
//	         '/js/draw/node-ui-function.js',
//	         '/js/draw/group.js',
	         '/js/drawToolLable.js',
	         '/js/lib/JsonTools.js',
	         '/js/lib/Json2xml.js',
	         '/js/plugin/drag/drag.js'] ,function (
	        		 nodeFactory,
//	        		 nodeEntry,
//	        		 nodeFunction,
//	        		 group,
	        		 toolsLable,
	        		 JsonTools,
	        		 Json2xml,
	        		 drag){
		

		$("#content_div").css("padding" ,"0");
		$("#pg-content").css("padding" ,"0");
		
		json2xml = new Json2xml({
			attributePrefix : ""
		});
		nodeFactory.init();
//		nodeFactory.nodeFunction.setJson2xml(json2xml);
//		nodeFactory.nodeFunction.setNodeEntry(nodeEntry);
//		nodeFactory.nodeFunction.setNodeFactory(nodeFactory);
		
//		nodeFunction.setJson2xml(json2xml);
//		nodeFunction.setNodeEntry(nodeEntry);
//		nodeFunction.setNodeFactory(nodeFactory);
	
//		nodeFactory.nodeFunction.test();
	var nodeFunction = nodeFactory._nodeFunction;
//		nodeFunction.test();
		
	var initEvent=function(event)
	{
		// $('#tool_div').draggable();
		drag.customDrag($("#tool_heading"),$('#tool_div'));
		$("#closeCanvasDrawShowAttrLineDiv").click(function(){
			$("#canvasDrawShowAttr").hide();
		});
		$("#canvasDrawShowAttr").hide();
		
		$("#exportJSONData").click(function(){
			nodeFunction.exportJSONData();
		});
		$("#emptyScene").click(function(){
			nodeFunction.emptyScene("清空画板区？");
		});
		$("#stageSelectMode").click(function(){
			nodeFunction.changeSceneModel('select');
		});
		$("#backToFirstIn").click(function(){
			nodeFunction.backToFirstIn();
		});
		$("#headingOne").click(function (){
			$("#tool_div").toggleClass("topo-min-heading");
			// $("#tool_heading").parent().toggleClass("topo-min-heading");
		});
//		$("#closeCanvasDrawShowAttrLineDiv").click(function(){
//			nodeFunction.closeCanvasDrawShowAttrLineDiv();
//		});
//		$("#canvasDrawShowAttrLine_close").click(function(){
//			nodeFunction.closeCanvasDrawShowAttrLineDiv();
//		});
//		$("#canvasDrawShowAttrLine_reset").click(function(){
//			resetColor();
//			nodeFunction.updateLineAttr($(this));
//		});
//		$("#modifyGroupStlye_close").click(function(){
//			nodeFactory._group.closeModifyGroupStlyeDiv();
//		});
		//"modifyGroupStlye_reset"
//		$("#modifyGroupStlye_reset").click(function(){
//			resetColor("isGroup");
//			resetColor("isFont");
//			nodeFactory._group.modifyGroupStlye();
//		});
//		$("#modifyGroupStlye_remove").click(function(){
//			nodeFactory._group.removeGroup(nodeFunction.getScene());
//		});
//		//unmountMoniter
//		$("#unmountMoniter").click(function(){
//			nodeFunction.unmountMoniter();
//		});
		$("[name='modifyFunction']").each(function(){
		    $(this).click(function(){
		    	nodeFunction.modifyFunction($(this).attr("value"));
		    });
		  });
//		$("#canvasDrawShowAttrLine_line_KEY").click(function(){
//			nodeFunction.updateNodeRe(80,'KEY');
//		});
//		$("#canvasDrawShowAttrLine_line_REF").click(function(){
//			nodeFunction.updateNodeRe(10,'REF');
//		});
//		$("#canvasDrawShowAttrLine_LineType1").click(function(){
//			//一般连线
//			nodeFunction.updateNodeRe(null,null,"Link");
//		});
//		$("#canvasDrawShowAttrLine_LineType2").click(function(){
//			//折线
//			nodeFunction.updateNodeRe(null,null,"FoldLink");
//		});
//		$("#canvasDrawShowAttrLine_LineType3").click(function(){
//			//2次折线
//			nodeFunction.updateNodeRe(null,null,"FlexionalLink");
//		});
//		$("#canvasDrawShowAttrLine_LineType4").click(function(){
//			//一般连线
//			nodeFunction.updateNodeRe(null,null,"NoLink");
//		});
//		$("#canvasDrawShowAttrLine_LineType5").click(function(){
//			//一般连线
//			nodeFunction.updateNodeRe(null,null,"SquarelyFlexionalLink");
//		});
		//canvasDrawShowAttrLine_distance
//		$("#canvasDrawShowAttrLine_distance").blur(function(){
//			//
//			nodeFunction.updateLineDistance();
//		});
//		$("#canvasDrawShowAttrLine_doMod").mouseup(function(){
//			//
//			if($(this).attr("clicktimes") == undefined )
//				$(this).attr("clicktimes","checked");
//			else
//				$(this).removeAttr("clicktimes");
//		});
		$("#reSetMessage").click(function(){
			//修改基本信息
			nodeFunction.addAppFunction();
		});
	}
	
	index_menuHide();
	
	//初始化滚动条
//	$('#canvasTool_div').slimscroll({
//		allowPageScroll : true
//	});
//	//canvasTool
	$('#canvasTool').slimscroll({
		allowPageScroll : true
	});
//	//canvasTool_div_panel
//	$('#canvasTool_div_panel').slimscroll({
//		allowPageScroll : true
//	});
	//初始化节点大小
	// nodeFunction.setSize(32,32);
	//初始化工具栏
	nodeFunction.initSceneTools("canvasTool");
	//初始化画图区
	nodeFunction.initScene("canvasDraw");
	$("#canvasDraw").oneTime(1000,function() {
		this.width = $("#flashContent").width();
		this.height = $("#flashContent").height();
	});
	//初始化操作框
	nodeFunction.initOperatingBox("canvasDrawShowAttr");
	//初始化线段操作框
	nodeFunction.initOperatingBoxForLine("canvasDrawShowAttrLine");
	//初始化分组器设置框
	nodeFactory._group.initOperatingBoxForGroup("modifyGroupStlye");
	//设置节点连线的颜色
	nodeFunction.setLinkLineColor("255,0,0");
	//设置监控器列表请求地址
	nodeFunction.setQueryMonitorUrl("appMonitor/queryConfigXml?1=1");
	//设置监控器状态请求地址
	nodeFunction.setQueryOneMonitorStatusUrl("appMonitor/queryAppCompStatus");
	//设置通过监控器ID获取监控器属性的请求地址
	nodeFunction.setQueryOneMonitorStatusByIdUrl("/monitorView/queryMonitorInfoByMonitorId");
	//设置获取后台xml模板URL 
	nodeFunction.setXmlModuleUrl("appMonitor/queryAppSystemXml?1=1");
	//设置保存XML URL地址
	nodeFunction.setSaveDataUrl("appMonitor/saveAppSystem?1=1");
	//设置工具栏图片路径
	nodeFunction.setImgePath("/img/draw/");
	//设置挂载监控器图片路径
	nodeFunction.setCustomMonitorImgePath("/img/custommonitor/new/",'.svg');
	//设置是否是编辑状态
	nodeFunction.isEditerJob();
	//设置是否在编辑时显示设置的监控器图标,如果需要就调用此函数即可
	nodeFunction.isShowMonitorImgInEdit();
	//设置新增应用跳转函数
//	nodeFunction.setAddAppFunction(nodeFunction.addAppFunction);
	var this_params = index_query_param_get();
	var appId = this_params.appId?this_params.appId:undefined;
//	//初始化XML结构必须先初始化XML结构
//	nodeFunction.initXmlModuleData();
	var this_params = index_query_param_get();
	var fromType = this_params.fromType?this_params.fromType:'thumb';
	if(fromType == "addApp" || appId == undefined)
	{
		nodeFunction.isAddApp(window.location.href);
		//如果是新增界面需要隐藏修改按钮
		$("#reSetMessage").hide();
	}
	/**
	 * 自定义响应函数测试样例
	 * 功能说明：组件节点可实现定制化处理,如果组件具有复杂的业务逻辑建议使用此方式实现
	 * 			nodeFactory：
	 * 						_nodeFunction{
	 * 										getScene(),
	 * 										getStage(),
	 * 										getNodeEntry() 
	 * 										}
	 * 						
	 * 调用后传入参数对象如下：
	 * 					工具组件：{
									nodeFactory,
									node,
									el //组件DIV
								}
						画布内节点：{
									nodeFactory,
									event,
									node	//node节点
								}
						画布内各种线段：{
									nodeFactory,
									event,
									node //node节点
								}
	 */
	/**
	 * 

	function aaa(){
		alert("测试创建");
	}
	function aaa1(){
		alert("测试节点click");
	}
	function aaa2(){
		alert("测试直线click");
	}
	function aaa3(){
		alert("测试直线mousedown ");
	}
	//必须再初始化数据之前执行
	//工具栏目前只有处理click和dblclick事件
	//node节点处理事件分别为click（非编辑模式下）、mouseup（编辑模式下）:右键、dbclick（非编辑模式下）
	nodeFactory.customComEvent(
			{
				type:"appSystem",
				click:aaa,						//针对工具栏组件
				dblclick:null,					//针对工具栏组件
				node:{click:aaa1,mouseup:aaa1}	//定义node节点相关处理事件函数
			});
	//线段响应处理事件分别为mouseup（编辑模式下）:右键、click（编辑模式下）、dbclick（编辑模式下）
	nodeFactory.customComEvent(
			{
				type:"line",
				line:{click:aaa2,mousedown:aaa3}//定义线段事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"layer",
				line:{click:aaa2,mousedown:aaa3}//定义虚线事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"arrow",
				line:{click:aaa2,mousedown:aaa3}//定义箭头事件处理函数
			});
	*/
	/**
	 * 如下
	 */
	nodeFactory.customComEvent(
			{
				type:"text",
				dblclick:createTextNode,		//针对工具栏组件
				node:{mouseup:nodeRightClick,dbclick:nodeRightClick}//定义箭头事件处理函数
			});
	//自定义新组建
	nodeFactory.customComEvent(
			{
				type:"customNode",
				dblclick:createCustomNode,		//针对工具栏组件
				node:{mouseup:nodeRightClick,dbclick:createCustomNode}//定义箭头事件处理函数
			});
	/**
	 * 重新定义node节点事件
	 */
//	nodeFactory.customComEvent(
//			{
//				type:"customNode",
//				node:{mouseup:dealRightClick}//定义箭头事件处理函数
//			});
	nodeFactory.customComEvent(
			{
				type:"appSystem",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"os",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"middleware",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"database",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"netDevice",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"securityDevice",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"storeDevice",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"appsoftware",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"generalAgreement",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"loadBalancing",
				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
			});
//	nodeFactory.customComEvent(
//			{
//				type:"text",
//				node:{mouseup:nodeRightClick}//定义箭头事件处理函数
//			});
//	nodeFactory.customComEvent(
//			{
//				type:"securityEvent",
//				node:{click:null,dbclick:createCustomNode}//定义箭头事件处理函数
//			});
//	nodeFactory.customComEvent(
//			{
//				type:"linkEvent",
//				node:{click:null,dbclick:createCustomNode}//定义箭头事件处理函数
//			});
//	nodeFactory.customComEvent(
//			{
//				type:"topoM",
//				node:{click:null,dbclick:createCustomNode}//定义箭头事件处理函数
//			});
//	nodeFactory.customComEvent(
//			{
//				type:"loadBalancing",
//				node:{click:null,dbclick:createCustomNode}//定义箭头事件处理函数
//			});
	
	
	
	nodeFactory.customComEvent(
			{
				type:"line",
				line:{click:null,mouseup:linkRightClick}//定义线段事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"layer",
				line:{click:null,mouseup:linkRightClick}//定义虚线事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"arrow",
				line:{click:null,mouseup:linkRightClick}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"dependence",
				line:{click:null,mouseup:linkRightClick}//定义箭头事件处理函数
			});

	function tip(obj){
		g_dialog.operateConfirm("请实现类型 ' "+obj.node.type+"' 的操作界面，提供的参数中可拿到全部画布数据，如：画布ID '" +obj.nodeFactory._nodeFunction.getNodeEntry().canDrawId+"',scene,stage.\r\n 全局对象 ：obj.nodeFactory._nodeFunction.getNodeEntry();\r\n主要操作入口：obj.nodeFactory._nodeFunction;\r\n分组入口：obj.nodeFactory._group",{saveclick : function (){
			$(this).remove();
		}});
	}
	function closeRightEvent(){
		g_dialog.operateAlert(null,"请双击修改属性","error");
	}
	function createTextNode(obj){
		var isupdate = false;
		$.ajax({
			type : "GET",
			url : "module/sys_manage/monitor_config/app_monitor_config_topo1_tpl.html",
			success : function (data){
				g_dialog.dialog(
					$(data).find("[id=addTextNode]"),
					{
						width:"580px",
						title:"创建/修改文字节点",
						init:init,
						saveclick:save_click
					}
				);
				function init(el){
					var tempnode = nodeFunction.copyNode(obj.node.attributes);
					if(checkIsNULL(tempnode.name) == false){
						$(el).find("input[data-id='name']").val(tempnode.name);
					}
					if(checkIsNULL(tempnode.fontSize) == false){
						$(el).find("select[data-id='textsize']").val(tempnode.fontSize);
					}
					if(checkIsNULL(tempnode.fontColor) == false){
						isupdate = true;
						//setTextColor(tempnode.fontColor);
						$(el).find("input[data-id='textcolor']").val(tempnode.fontColor);
					}
					var hex = ("RGB("+obj.node.fontColor+")").colorHex();
					$(el).find("#textcoloriframe").attr("src","/color/colorStage.html?color="+hex);
//					hex = ("RGB("+obj.node.strokeColor+")").colorHex();
//					$(el).find("#coloriframe").attr("src","/color/colorStage.html?color="+hex);
				}
				function save_click(el,saveObj){
//					resetTextColor();
					var tempnode = nodeFunction.copyNode(obj.node.attributes);
					if(isupdate == false){
						tempnode.x = 200-nodeFunction.getNodeEntry().scene.translateX;
						tempnode.y = 200-nodeFunction.getNodeEntry().scene.translateY;
					}
					else{
						tempnode.x = obj.node.x;
						tempnode.y = obj.node.y;
					}
					if(checkIsNULL(saveObj.name) == true)
						saveObj.name = " ";
					tempnode.name = saveObj.name;
					tempnode.fontSize = saveObj.textsize;
					var input_color = $(window.frames["textcoloriframe"].document).find(".sp-input-container,.sp-cf").find(".sp-input");
					$(el).find("input[data-id='textcolor']").val(input_color.val().colorRgb());
					tempnode.fontColor = input_color.val().colorRgb();
					//
					var node = tempnode.newTextNode();

					if(isupdate == true){
						obj.node.fontSize = tempnode.fontSize;
						obj.node.fontColor = tempnode.fontColor;
						obj.node.name = tempnode.name;
						obj.node.text = tempnode.name;
					}
						//nodeFunction.getNodeEntry().scene.remove(obj.node);
					else
						nodeFunction.getNodeEntry().scene.add(node);
					$(el).find("input[data-id='textcolor']").val("");
					g_dialog.hide(el);
				}
			}
		});
	}

	function createCustomNode(obj){
		var isupdate = false;
		$.ajax({
			type : "GET",
			url : "module/sys_manage/monitor_config/app_monitor_config_topo1_tpl.html",
			success : function (data){
				g_dialog.dialog(
					$(data).find("[id=addcustomNode]"),
					{
						width:"580px",
						title:"创建/修改自定义节点",
						init:init,
						saveclick:save_click
					}
				);

				function init(el){
					var select = $(el).find("select[data-id='nodetype']");
					select.html("");
					var arr = nodeFunction.getNodeEntry().customComTypes;
					if(checkIsNULL(obj.node) == false && obj.node.attributes.old == true){
						isupdate = true;
					}
					for(var i=0;i<arr.length;i++){
						var selected = ' selected="selected"';
						if(checkIsNULL(obj.node)==false && obj.node.type != arr[i].type)
							selected = "";
						select.append($('<option value="'+arr[i].type+'" '+selected+'>'+arr[i].text+'</option>'));
					}
					if(checkIsNULL(obj.node) == false && checkIsNULL(obj.node.fillColor) == false ){
						el.find("input[data-id='backcolor']").val(("RGB("+obj.node.fillColor+")").colorHex());
						//setColorById(el,"backcoloriframe");
					}
					if(checkIsNULL(obj.node) == false && checkIsNULL(obj.node.fontColor) == false ){
						el.find("input[data-id='textcolor']").val(("RGB("+obj.node.fontColor+")").colorHex());
						//setColorById(el,"textcoloriframe");
					}
					if(checkIsNULL(obj.node) == false && checkIsNULL(obj.node.fontSize) == false ){
						el.find("select[data-id='textsize']").val(obj.node.fontSize);
					}
					if(checkIsNULL(obj.node) == false && checkIsNULL(obj.node.name) == false ){
						el.find("input[data-id='name']").val(obj.node.name);
					}
					//背景透明度
					if(checkIsNULL(obj.node) == false && checkIsNULL(obj.node.alpha) == false ){
						el.find("input[data-id='customslider']").val(obj.node.alpha);
						//setSlider(obj.node.alpha);
					}
					//背景色
					var hex = ("RGB("+obj.node.fillColor+")").colorHex();
					$(el).find("#backcoloriframe").attr("src","/color/colorStage.html?color="+hex);
					//文字颜色
					hex = ("RGB("+obj.node.fontColor+")").colorHex();
					$(el).find("#textcoloriframe").attr("src","/color/colorStage.html?color="+hex);
				}
				function save_click(el,saveObj){
					//alert(obj.node+"  "+obj.node.name);
					var tempnode = nodeFunction.copyNode(obj.node.attributes);
					if(isupdate == false){
						tempnode.x = 200-nodeFunction.getNodeEntry().scene.translateX;
						tempnode.y = 200-nodeFunction.getNodeEntry().scene.translateY;
					}
					else{
						tempnode.x = obj.node.x;
						tempnode.y = obj.node.y;
						//resetColor(el,"backcoloriframe");
						//resetColor(el,"textcoloriframe");
						//resetSlider(el);
					}
					tempnode.type = saveObj.nodetype;
					tempnode.name = saveObj.name;
					tempnode.alpha = $(window.frames["slideriframe3"].document).find("#showslider").text();
					tempnode.fontSize = $(el).find("select[data-id='textsize']").val();
					var input_color = $(window.frames["textcoloriframe"].document).find(".sp-input-container,.sp-cf").find(".sp-input");
					tempnode.fontColor = input_color.val().colorRgb();
					input_color = $(window.frames["backcoloriframe"].document).find(".sp-input-container,.sp-cf").find(".sp-input");
					tempnode.fillColor = input_color.val().colorRgb();
					tempnode.customnode = true;
					//
					if(isupdate == false){
						tempnode.id = "";
					}
					var node = tempnode.newCustomNode();
					if(isupdate == true){
						nodeFunction.getNodeEntry().scene.remove(obj.node);
					}
					else
					{
						node.attributes.old = true;
					}
					nodeFunction.getNodeEntry().scene.add(node);
					g_dialog.hide(el);
				}
			}
		});
	}
	
	
	
	nodeFactory.customComEvent(
			{
				type:"securityEvent",
				node:{click:tip,mouseup:tip}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"linkEvent",
				node:{click:tip,mouseup:tip}//定义箭头事件处理函数
			});
	nodeFactory.customComEvent(
			{
				type:"topoM",
				node:{click:tip,mouseup:tip}//定义箭头事件处理函数
			});
//	nodeFactory.customComEvent(
//			{
//				type:"line",
//				line:{click:tip,mouseup:tip}//定义箭头事件处理函数
//			});
	
	if(nodeFunction.addAppStatus() == false)
		nodeFunction.initPanelData(appId);

	
	
//	setGet("appMonitor/saveAppSystem?1=1");
		for(var i=0;i<toolsLable.appsystem.length;i++){
			var node = nodeFactory.node.createNode("canvasTool");
			node.id="node-"+i;
			node.name=toolsLable.appsystem[i][0];
			node.type=toolsLable.appsystem[i][1];
			node.compType=toolsLable.appsystem[i][1];
			node.bimg=toolsLable.appsystem[i][2];
			node.istool = true;
			node.beginId = toolsLable.appsystem[i][3];
			node.x = 2;
			node.y = 10+60*i;
			//sceneTool.add(node.newNode());
			$("#canvasTool").append(node.newToolNode());
		}

		$(document).ready(function(){
			initEvent();
//			$('#add').click(function(){
//				var $options = $('#select1 option:selected');//获取当前选中的项
//				var $remove = $options.remove();//删除下拉列表中选中的项
//				$remove.appendTo('#select2');//追加给对方
//				nodeFunction.mountPoint();
//			});
//			
//			$('#remove').click(function(){
//				g_dialog.operateConfirm("删除依赖？",{saveclick : function (){
//					var $removeOptions = $('#select2 option:selected');
//					$removeOptions.appendTo('#select1');//删除和追加可以用appendTo()直接完成
//					var ids = [];
//					
//					ids[0] = $($removeOptions).val();
////					alert(ids.length);
////					nodeFunction.deleteLinesByScene(ids);
//					//刷新节点依赖点
//					nodeFunction.mountPoint("delete",ids);
//				}});
////				if(!confirm("删除依赖？"))
////					return;
////				var $removeOptions = $('#select2 option:selected');
////				$removeOptions.appendTo('#select1');//删除和追加可以用appendTo()直接完成
////				var ids = [];
////				ids[0] = $($removeOptions).val();
////				deleteLinesByScene(ids);
////				//刷新节点依赖点
////				mountPoint("delete");
//			});
//			
//			$('#addAll').click(function(){
//				var $options = $('#select1 option');
//				$options.appendTo('#select2');
//				nodeFunction.mountPoint();
//			});
//			
//			$('#removeAll').click(function(){
//				var $options = $('#select2 option');
//				
//				var ids = [];
//				for(var i = 0;i<$options.length;i++){
//					ids[ids.length] = $($options[i]).val();
//				}
//				g_dialog.operateConfirm("删除所有依赖？",{saveclick : function (){
//					$options.appendTo('#select1');
////					nodeFunction.deleteLinesByScene(ids);
//					//刷新节点依赖点
//					nodeFunction.mountPoint("delete",ids);
//				}});
////				if(confirm("删除所有依赖？")){
////					$options.appendTo('#select1');
////					deleteLinesByScene(ids);
////					//刷新节点依赖点
////					mountPoint("delete");
////				}
//				
//
//
//			});
//			
//			//双击事件
//			$('#select1').dblclick(function(){
//				var $options = $('option:selected', this);//注意此处“option”与“:”之间的空格，有空格是不可以的
//				$options.appendTo('#select2');
//				//进行挂载
//				var flag = nodeFunction.mountPoint();
//				if( flag == true){
//					
//				}
//				else{
//					$options.appendTo('#select1');
//				}
//			});
//			
//			$('#select2').dblclick(function(){
//				var ids = [];
//				ids[0] = $('#select2 option:selected').val();
//				g_dialog.operateConfirm("删除依赖？",{saveclick : function (){
//					$('#select2 option:selected').appendTo('#select1');
//					//nodeFunction.deleteLinesByScene(ids);
//					//刷新节点依赖点
//					nodeFunction.mountPoint("delete",ids);
//				}});
////				if(confirm("删除依赖？")){
////					$('#select2 option:selected').appendTo('#select1');
////					deleteLinesByScene(ids);
////					//刷新节点依赖点
////					mountPoint("delete");
////				}
//
//				
//			});
			
		});

		/**
		 * 修改事件
		 */
		//修改组事件，分组只有右键事件
		nodeFactory._group.customGroupEvent=function(obj){
			var event = obj.event;
			$("#link_menu").hide();
			$("#node_menu").hide();
			$("#container_menu").css({
				top: event.pageY,
				left: event.pageX
			}).show().focus().blur(function (){
				$(this).hide();
				currentObj = undefined;
			});
			currentObj = obj;
			$("#container_menu a").click(function (){
				var text = $(this).text();
				if(text == "更改属性"){
					containerInfo(currentObj);
				}else if(text == "增删节点"){
					containerDealNode(currentObj);
				}else if(text == "删除容器"){
					nodeFactory._group.id = currentObj.node.id;
					nodeFactory._group.removeGroup(nodeFunction.getScene(),currentObj.node.id);
					nodeFactory._group.id = undefined;
					currentObj = undefined;
				}
				$('#container_menu').hide();
			});
		}
		function containerDealNode(obj){
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_topo1_group.html",
				success : function (data){
					g_dialog.dialog(
						$(data).find("[id=addnodeForGroup]"),
						{
							width:"580px",
							title:"分组操作",
							init:init,
							saveclick:save_click
						}
					);

					function init(el){
						nodeFactory._group.closeEl = el;

						//初始化相关元素
						{
							//双击事件
							$(el).find('#select1').dblclick(function(){
								var $options = $('option:selected', this);//注意此处“option”与“:”之间的空格，有空格是不可以的
								
								//进行挂载
								g_dialog.operateConfirm("添加节点到组？",{saveclick : function (){
									$options.appendTo('#select2');
									var nodes = new Array();
									nodes[0] = nodeFunction.findNodeByScene(nodeFunction.getScene(),$options.val());
									nodeFactory._group.addNodeForGroup(obj.node,nodes);//nodes
									g_dialog.hide(el);
								}});
							});
							$(el).find('#select2').dblclick(function(){
								var ids = [];
								ids[0] = $('#select2 option:selected').val();
								g_dialog.operateConfirm("从组中移除节点？",{saveclick : function (){
									$('#select2 option:selected').appendTo('#select1');
									var nodes = new Array();
									nodes[0] = nodeFunction.findNodeByScene(nodeFunction.getScene(),ids[0]);
									nodeFactory._group.removeNodeFromGroup(obj.node,nodes);//nodes
									g_dialog.hide(el);
								}});
							});
							
							//初始化数据
							//已在组内的
							var nodes = obj.node.childs;
							var select1 = $(el).find('#select2');
							select1.html("");
							for(var i=0;i<nodes.length;i++){
								
								var option = $("<option value='"+nodes[i].id+"'>"+(checkIsNULL(nodes[i].name) == true?"空文字节点":nodes[i].name)+"</option>");
								if(checkIsNULL(nodes[i].tipText) == false)
									option.text(nodes[i].tipText);
								select1.append(option);
							}
							var outnodes =nodeFactory._group.findOutContainerNode(nodeFunction.getScene());
							var select2 = $(el).find('#select1');
							select2.html("");
							for(var i=0;i<outnodes.length;i++){
								var option = $("<option value='"+outnodes[i].id+"'>"+outnodes[i].name+"</option>");
								select2.append(option);
							}

						}
						//nodeFactory._group.fillAttrs(obj.node);

					}
					function save_click(el,saveObj){
						resetColor("isGroup");
						resetColor("isFont");
						nodeFactory._group.modifyGroupStlye();
						g_dialog.hide(el);
					}
				}
			});
		}
		function containerInfo(obj){
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_topo1_group.html",
				success : function (data){
					g_dialog.dialog(
						$(data).find("[id=modifygroup]"),
						{
							width:"580px",
							title:"分组操作",
							init:init,
							saveclick:save_click
						}
					);

					function init(el){
						nodeFactory._group.closeEl = el;
						$(el).find("#modifyGroupStlye_remove").click(function(){
							nodeFactory._group.removeGroup(nodeFunction.getScene());
						});
						nodeFactory._group.fillAttrs(obj.node);
						var hex = ("RGB("+obj.node.fillColor+")").colorHex();
						$(el).find("#groupcoloriframe").attr("src","/color/colorStage.html?color="+hex);
					}
					function save_click(el,saveObj){
						resetColor("isGroup");
						resetColor("isFont");
						nodeFactory._group.modifyGroupStlye();
						g_dialog.hide(el);
					}
				}
			});
		}
		var currentObj;
		nodeFunction.getStage().click(function(event){
			if(event.button == 0)
				$("#node_menu").hide();
			$("#link_menu").hide();
			$("#container_menu").hide();
			currentObj = undefined;
		});
		function nodeRightClick(obj){
			var event = obj.event;
			$("#link_menu").hide();
			$("#container_menu").hide();
			$("#node_menu").css({
				top: event.pageY,
				left: event.pageX
			}).show().focus().blur(function (){
				$(this).hide();
				currentObj = undefined;
			});
			if(obj.node.type == "text")
				$("#node_menu").find("#monitor").hide();
			else
				$("#node_menu").find("#monitor").show();
			currentObj = obj;
		}
		function linkRightClick(obj){
			var event = obj.event;
			$("#node_menu").hide();
			$("#container_menu").hide();
			$("#link_menu").css({
				top: event.pageY,
				left: event.pageX
			}).show().focus().blur(function (){
				$(this).hide();
				currentObj = undefined;
			});
			currentObj = obj;
		}
		$("#node_menu a").click(function (event){
			var text = $(this).text();
			if(text == "更改属性"){
//				$("#diplay_monitorList").hide();
//				$("#diplay_attrs").show();
				currentObj.displayId = "diplay_attrs";
				currentObj.hiddenId = "diplay_monitorList";
				if(currentObj.node.type == "text"){
					createTextNode(currentObj);
				}
				else if(nodeFunction.isCustomNode(currentObj.node) == true)
				{
					createCustomNode(currentObj);
				}
				else
					dealRightClickForNode(currentObj,"属性修改");
			}else if(text == "绑定/解除监控器"){
//				$("#diplay_monitorList").show();
//				$("#diplay_attrs").hide();
				currentObj.displayId = "diplay_monitorList";
				currentObj.hiddenId = "diplay_attrs";
				dealRightClickForNode(currentObj,"绑定/解除监控器");
			}else if(text == "删除该节点"){
				var localCuttrntObj = $.extend({},currentObj);
				g_dialog.operateConfirm("确认删除该节点?",{
					title : "确认删除",
					saveclick : deleteNode
				});
				function deleteNode(){
					var nodeEntry = nodeFunction.getNodeEntry();
					nodeFunction.deleteNodeByScene(nodeEntry.scene,localCuttrntObj.node);
					currentObj = undefined;
				}
			}
			// else if(text == '顺时针旋转'){
			// 	currentObj.node.rotate += 0.5;
			// }
			// if(text == "撤销上一次操作"){
			// 	currentObj.node.restore();
			// 	g_dialog.operateAlert(null ,"撤销","error");
			// }else if(currentObj){
			// 	currentObj.node.save();
			// 	g_dialog.operateAlert(null ,"保存","error");
			// }

			$('#node_menu').hide();
		});
		$("#link_menu a").click(function (event){
			var text = $(this).text();
			if(text == "更改属性"){
				dealRightClickForLine(currentObj);
			}else if(text == "删除连线"){
				var localCuttrntObj = $.extend({},currentObj);
				g_dialog.operateConfirm("确认删除该连线?",{
					title : "确认删除",
					saveclick : deleteNode
				});
				function deleteNode(){
					var nodeEntry = nodeFunction.getNodeEntry();
					nodeFunction.deleteNodeByScene(nodeEntry.scene,localCuttrntObj.node);
					currentObj = undefined;
				}
			}

			$("#link_menu").hide();
		});
		function dealRightClickForNode(obj,text){
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_topo1_attr.html",
				success : function (data){
					g_dialog.dialog(
						$(data).find("[id=modifynode]"),
						{
							width:"580px",
							title:text,
							init:init,
							saveclick:save_click
						}
					);

					function init(el){
//						console.log($(el).html());
						
						if(	obj.node.type == nodeFunction.getNodeEntry().appSystem)
						{
							// $(el).css("width","420px");
							$($(el).find("div[id='diplay_monitorList']")[0]).remove();
						}
						else
							$($(el).find("div[id='diplay_monitorList']")[1]).remove();
						
						$(el).find("#unmountMoniter").click(function(){
							nodeFunction.unmountMoniter();
						});
						if(checkIsNULL(obj.displayId) == false){
							$(el).find("#"+obj.displayId).show();
							obj.displayId = undefined;
						}
							
						if(checkIsNULL(obj.hiddenId) == false){
							$(el).find("#"+obj.hiddenId).hide();
							obj.hiddenId = undefined;
						}

							
						//初始化相关元素
						{
							//双击事件
							$(el).find('#select1').dblclick(function(){
								var $options = $('option:selected', this);//注意此处“option”与“:”之间的空格，有空格是不可以的
								$options.appendTo('#select2');
								//进行挂载
								var flag = nodeFunction.mountPoint();
								if( flag == true){
									
								}
								else{
									$options.appendTo('#select1');
								}
							});
							$(el).find('#select2').dblclick(function(){
								var ids = [];
								ids[0] = $('#select2 option:selected').val();
								g_dialog.operateConfirm("删除依赖？",{saveclick : function (){
									$('#select2 option:selected').appendTo('#select1');
									//刷新节点依赖点
									nodeFunction.mountPoint("delete",ids);
								}});
							});
						}
						//
						nodeFunction.getNodeEntry().closeEl = el;
						nodeFunction.initDeleteNodeButton(nodeFunction.getNodeEntry().canDrawShowAttr,el);
						nodeFunction.getNodeEvent().dealNodeEvent(obj.node);
					}
					function save_click(el,saveObj){
						g_dialog.hide(el);
					}
				}
			});
		}
		function dealRightClickForLine(obj){
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_topo1_line.html",
				success : function (data){
					g_dialog.dialog(
						$(data).find("[id=modifyline]"),
						{
							width:"580px",
							title:"线段属性修改",
							init:init,
							saveclick:save_click
						}
					);

					function init(el){
						$(el).find("#canvasDrawShowAttrLine_line_KEY").click(function(){
							nodeFunction.updateNodeRe(80,'KEY');
						});
						$(el).find("#canvasDrawShowAttrLine_line_REF").click(function(){
							nodeFunction.updateNodeRe(10,'REF');
						});
						$(el).find("#canvasDrawShowAttrLine_LineType1").click(function(){
							//一般连线
							nodeFunction.updateNodeRe(null,null,"Link");
						});
						$(el).find("#canvasDrawShowAttrLine_LineType2").click(function(){
							//折线
							nodeFunction.updateNodeRe(null,null,"FoldLink");
						});
						$(el).find("#canvasDrawShowAttrLine_LineType3").click(function(){
							//2次折线
							nodeFunction.updateNodeRe(null,null,"FlexionalLink");
						});
						$(el).find("#canvasDrawShowAttrLine_LineType4").click(function(){
							//一般连线
							nodeFunction.updateNodeRe(null,null,"NoLink");
						});
						$(el).find("#canvasDrawShowAttrLine_LineType5").click(function(){
							//一般连线
							nodeFunction.updateNodeRe(null,null,"SquarelyFlexionalLink");
						});
						
						$(el).find("#canvasDrawShowAttrLine_vertical").click(function(){
							//一般连线
							nodeFunction.updateNodeRe(null,null,null,"vertical");
						});
						$(el).find("#canvasDrawShowAttrLine_horizontal").click(function(){
							//一般连线
							nodeFunction.updateNodeRe(null,null,null,"horizontal");
						});
						
						$(el).find("#canvasDrawShowAttrLine_distance").blur(function(){
							//
							nodeFunction.updateLineDistance();
						});
						$(el).find("#canvasDrawShowAttrLine_doMod").mouseup(function(){
							//
							if($(this).attr("clicktimes") == undefined )
								$(this).attr("clicktimes","checked");
							else
								$(this).removeAttr("clicktimes");
						});
						
						
						$(el).find(".lineBack").hover(function(){
							if($(this).attr("isClick") != undefined)
								return;
							$(this).css("background-color","rgba(180,180,180,0.5)");
						},function(){
							if($(this).attr("isClick") != undefined)
								return;
							$(this).css("background-color","");
						});
						var divs = $(el).find("div[id^=lineSize]");
						for(var i=0;i<divs.length;i++){
							$(divs[i]).click(function(){
								$(this).siblings().css("background-color","");
								$(this).siblings().css("border","");
								$(this).siblings().css("border-color","");
								$(this).siblings().removeAttr("isClick");
								$(this).css("background-color","rgba(221,126,107,0.6)");
								$(this).attr("isClick",true);
								//border: 1px;border-color: red;
								$(this).css("border","1px");
								$(this).css("border-color","red");
								//
								$("#canvasDrawShowAttrLine").find("input[name='size']").val($(this).attr("value"));
							});
						}
						///color/colorStage.html?color=obj.node.strokeColor
//						setColor(obj.node.strokeColor);
						var hex = ("RGB("+obj.node.strokeColor+")").colorHex();
						$(el).find("#coloriframe").attr("src","/color/colorStage.html?color="+hex);
						nodeFunction.getNodeEntry().closeEl = el;
						nodeFunction.initDeleteLineButton(nodeFunction.getNodeEntry().canDrawShowAttr,el);
						nodeFunction.getNodeEvent().dealClickAndDblclick(obj.event,obj.node);
					}
					function save_click(el,saveObj){
						resetColor();
						nodeFunction.updateLineAttr(el);
						g_dialog.hide(el);
					}
				}
			});
		}

	
});
});