$(document).ready(function (){
require(['/js/plugin/accordion/accordion.js',
		 '/js/plugin/tree/tree.js',
		 '/js/plugin/wizard/wizard.js',
		 '/js/plugin/monitor/monitor.js',
		 '/js/plugin/monitor/monitor_config_tool.js',
		 '/js/plugin/timepicker/timepicker.js',
		 '/js/plugin/inputdrop/inputdrop.js'] ,function (accordion ,tree ,wizard ,monitor ,monitorTool ,timepicker ,inputdrop){

var monitor_list_url = "deviceMonitor/queryDeviceMonitor";
var _pU_ = {1:"分钟",2:"小时",3:"天"};

var monitor_list_header = [
							  {text:'',name:"t",width:5,hideSearch:"hide"},
							  {text:'健康度',name:"monitorDstatus",width:7,align:"left",render:function(text){
						  		 if (text == 0)
						  		 {
						  			 return '<i class="icon-png icon-png-jk1" style="opacity:1" title="正常"></i>';
						  		 }
						  		 else if (text == 1)
						  		 {
									return '<i class="icon-png icon-png-jk2" style="opacity:1" title="未知"></i>';
						  		 }
						  		 else if (text == 2)
						  		 {
									return '<i class="icon-png icon-png-jk3" style="opacity:1" title="凭证"></i>';
						  		 }
						  		 else if (text == 3)
						  		 {
									return '<i class="icon-png icon-png-jk4" style="opacity:1" title="性能"></i>';
						  		 }
						  		 else
						  		 {
						  		 	return '<i class="icon-png icon-png-jk" style="opacity:1" title="故障"></i>';
						  		 }
							  },searchRender:function (el){
									el.append('<input type="hidden" search-data="treeType" searchCache/>');
									el.append('<input type="hidden" search-data="id" searchCache/>');
									el.append('<input type="hidden" search-data="queryType" value="noQueryComponent" searchCache/>');
									el.append('<input type="hidden" search-data="language" value="1" searchCache/>');
							  }},
							  {text:'',name:"t",width:5,hideSearch:"hide"},
							  {text:'监控器名称',name:"monitorName",width:28,align:"left"},
							  {text:'主IP',name:"asertIP",width:20,align:"left",searchRender:function (el){
							  		index_render_div(el ,{type:"ip",id:"asertIP"});
							  }},
							  {text:'监控器类型',name:"monitorTypeName",width:15,hideSearch:true,align:"left"},
							  {text:'轮询周期',name:"pollDate",hideSearch:true,render:function(text,trObj){
												return text+_pU_[trObj.pollUnit]||"";
							  },width:13},
							  {text:'连通',name:"pingStatus",width:7,render:function (text){
							  	 text = text.split(",");
							  	 text = Math.max.apply( Math, text);
						  		 if (text == 1)
						  		 {
						  			 return '<i class="icon-png icon-png-ping" style="opacity:1" title="正常"></i>';
						  		 }
						  		 else if (text == 0)
						  		 {
						  		 	 return '<i class="icon-png icon-png-ping1" style="opacity:1" title="异常"></i>';
						  		 }
						  		 else
						  		 {
						  		 	return '<i class="icon-png icon-png-ping2" style="opacity:1" title="未知"></i>';
						  		 }
							  },hideSearch:true}
						   ];

var monitor_list_oper = [
						    {icon:"rh-icon rh-carry-monitor" ,text:"立即执行监控器" ,aclick:monitor_excute},
						    {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:monitor_edit}
					    ];
var current_treeType = "MONITOR_TYPE_TREE";
var current_treeNode_id = "-1";
var current_data_url= "";

view_init();

event_init();

initLayout();

alarm_index();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div"),
		cbf:function(){
			accordion_init();
			alarm_index();
		}
	});

	$("#monitor_obj_moniotr_tree_div").slimscroll();
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});

	$("#accordion_icon").find("div").click(function (){
		$("#accordion_icon").find("div").removeClass("active");
		$(this).addClass("active");
		current_data_url = $(this).attr("data-url");
		var self = this;
		var labelInfoArray = [];
		um_ajax_post({
			url : "deviceMonitor/" + $(this).attr("data-url"),
			isLoad : false,
			successCallBack:function (data){
				for (var i = 0; i < data.length; i++) {
					data[i].useHtml = true;
					labelInfoArray = data[i].label.replace(")" ,"").split("(");
					if (data[i].className)
					{
						data[i].iconSkin = "a" + data[i].className;
						data[i].label = '<span class="montor-name-span monitor-status-'+data[i].monitorDstatus+'">' + labelInfoArray[0] + '<span>'+labelInfoArray[1]+'</span></span>';
					}
					else
					{
						//data[i].iconSkin = "aAll";
						data[i].label = '<span class="montor-name-span" style="padding-left:1px !important">'+labelInfoArray[0]+'<span>'+labelInfoArray[1]+'</span></span>';
					}
				}
 				tree.render($("#accordion") ,{
 					zNodes : data,
 					hideTitle : true,
 					zTreeOnClick : function (event, treeId, treeNode){
 						monitor_status_change(treeNode);
 						current_treeNode_id = treeNode.id;
 						monitor_list({
	 						treeType : $(self).attr("data-type"),
	 						id : treeNode.id,
	 						queryType:"noQueryComponent",
	 						language:"1"
 						});
 					},
 					expandNode : "-1"
 				});
 				current_treeType = $(self).attr("data-type");
 				monitor_list({
					treeType : $(self).attr("data-type"),
					id : -1,
					queryType:"noQueryComponent",
					language:"1"
 				});
			}
		});
	});

	// 查询按钮
	$("#query_btn").click(function (){
		$.ajax({
			type: "GET",
			url: "module/monitor_info/monitor_obj/monitor_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=query_template]"),{
					width:"600px",
					height:"430px",
					init:query_dialog_init,
					saveclick:query_dialog_save
				});
			}
		});

		function query_dialog_init(el)
		{
			$("[name=switch]").click(function (){
				if ($(this).val() == "IPV4")
				{
					$("#startIp").attr("disabled" ,false);
					$("#endIp").attr("disabled" ,false);
					$("#mainIp").attr("disabled" ,"disabled");
					$("#mainIp").val("");
					g_validate.clear([$("#mainIp")]);
				}
				else
				{
					$("#startIp").attr("disabled" ,"disabled");
					$("#endIp").attr("disabled" ,"disabled");
					$("#startIp").val("");
					$("#endIp").val("");
					$("#mainIp").attr("disabled" ,false);
					g_validate.clear([$("#startIp"),$("#endIp")]);
				}
			});
		}

		function query_dialog_save(el)
		{

		}
	});

	$("#process_test_btn").click(function (){
		$.ajax({
			type: "GET",
			url: "module/monitor_info/monitor_obj/monitor_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=process_test_template]"),{
					width:"500px",
					initAfter:initAfter,
					isDetail : true,
					title : "进程探测"
				});
				function initAfter(el)
				{
					um_ajax_get({
						url : "monitorConfig/doProTest",
						paramObj : {teststore:{connectType:"SSH2"}},
						maskObj : el,
						successCallBack : function (data){
							var data = data.teststore;
							var el_form = el.find("form");
							var serverName;
							for (var i = 0;i < data.length; i++)
							{
								if (data[i].targetType == "server")
								{
									serverName = "应用";
								}
								else if (data[i].targetType == "agent")
								{
									serverName = "代理";
								}
								else if (data[i].targetType == "center")
								{
									serverName = "中心";
								}
								el_form.append('<label class="col-lg-12 control-label tl">探测'+serverName+'服务器进程</label>');
								el_form.append('<label class="col-lg-12 control-label tl">'+serverName+'服务器IP地址：'+data[i].targetIp+'</label>');
								el_form.append('<label class="col-lg-12 control-label tl">'+serverName+'服务器进程状态：'+data[i].serverJarExist+'</label>');
							}
						}
					});
				}
			}
		});
	});
}

function initLayout()
{
	index_initLayout();
	$("#table_div").oneTime(500 ,function (){
		$("#table_div").height(
						$("#content_div").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							- 20
					  );
	});
}

function alarm_index()
{	
	um_ajax_get({
		url:"monitordisply/TechnicalSupervision/getFaultDistributionByType",
		isLoad:false,
		successCallBack:function(data){
			$("#monitor_obj_monitor_alarm_div").find("div").html("0");
			for (var i = 0; i < data.length; i++) {
				$("[id="+data[i].distributionId+"]").html(data[i].distributionCount);
			}
			
		}
	});
}

function accordion_init()
{
	um_ajax_post({
		url : "deviceMonitor/" + current_data_url,
		isLoad : false,
		successCallBack:function (data){
			for (var i = 0; i < data.length; i++) {
				data[i].useHtml = true;
				labelInfoArray = data[i].label.replace(")" ,"").split("(");
				if (data[i].className)
				{
					data[i].iconSkin = "a" + data[i].className;
					data[i].label = '<span class="montor-name-span monitor-status-'+data[i].monitorDstatus+'">' + labelInfoArray[0] + '<span>'+labelInfoArray[1]+'</span></span>';
				}
				else
				{
					//data[i].iconSkin = "aAll";
					data[i].label = '<span class="montor-name-span" style="padding-left:1px !important">'+labelInfoArray[0]+'<span>'+labelInfoArray[1]+'</span></span>';
				}
			}
			tree.render($("#accordion") ,{
				zNodes : data,
				zTreeOnClick : function (event, treeId, treeNode){
					current_treeNode_id = treeNode.id;
					monitor_list({
 						treeType : current_treeType,
 						id : treeNode.id,
 						queryType:"noQueryComponent",
 						language:"1"
					});
				},
				expandNode : "-1"
			});
			tree.selectNode($("#accordion") ,{key:"id",value:current_treeNode_id});
		}
	});
}

function monitor_list(paramObj ,isLoad)
{
	g_grid.render($("#table_div"),{
		 header:monitor_list_header,
		 oper:monitor_list_oper,
		 operWidth:"100px",
		 paramObj:paramObj,
		 url:monitor_list_url,
		 isLoad:isLoad,
		 allowCheckBox:false,
		 pageSize:50,
		 dbClick:function (rowData){
		 	monitor_info(rowData);
		},
		cbf:function (){
			$("[search-data=id]").val(current_treeNode_id);
			$("[search-data=treeType]").val(current_treeType);
		},
		dbIndex:3
	});
}

function monitor_info(rowData)
{
	var monitorTypeId = rowData.monitorTypeId;
	if (rowData.version == "LINUX_SNMP")
	{
		monitorTypeId = "LINUX_SNMP";
	}
	var url = "#/monitor_info/monitor_obj/monitor_info?monitorTypeId="
								+monitorTypeId+"&monitorId="+rowData.monitorId+"&monitorName="+rowData.monitorName+"&regionId="+(rowData.regionId==null?"":rowData.regionId)
								+"&assetId="+rowData.asertId+"&hideMenu=1";
	url = encodeURI(url);
    url = encodeURI(url);
	window.open(url);
}

// 单条记录的修改按钮点击事件
function monitor_list_update_dialog(rowData)
{
	var detail;
	var header = {
					index_list : [
									{text:'监控器名称',name:"monitorName",width:"20"},
									{text:'监控器类型',name:"monitorTypeName",width:"15"},
									{text:'代理服务器',name:"monitorAgentName",width:"14"},
									{text:'被监控资产名称',name:"edName",width:"15"},
									{text:'轮询时间',name:"pollDate",width:"12",render:function(pollDate ,trObj) {
										return pollDate + (trObj.pollUnit == 1 ? "(分钟)" : trObj.pollUnit == 2 ? "(小时)" : trObj.pollUnit == 3 && "(天)");
									}},
									{text:'部署状态',name:"monitorDeployStatus",width:"12",render:function(text) {
										return text == "0" ? "待部署" : text == "1" ? "正常" : text == "2" ? "异常" : "部署中";
									}},
									{text:'管理状态',name:"monitorManageStatus",width:"12",render:function(text) {
										if (text == 0) 
										{
											return '<i class="icon-circle f14" style="color:green;" title="启用"></i>';
										} else 
										{
											return '<i class="icon-circle f14" style="color:red;" title="停用"></i>';
										}
									}},
								]
					};
	um_ajax_post({
		url : "monitorConfig/queryMonitorDetail",
		paramObj : {"monitorId":rowData.monitorId,"deviceSource":"1","monitorType":rowData.monitorType,"edId":rowData.edId,"intsStatus":rowData.intsStatus,"regionId":rowData.regionId},
		maskObj : "body",
		successCallBack : function (data) 
		{
			detail = data;
		}
	});
	monitor.monitorDialog({
		url : "module/sys_manage/monitor_config/monitor_config_tpl.html",
		ele : "[id=edit_template]",
		title : "监控器修改",
		showList : true,
		monitorType : "deviceMonitor/queryMonitorClassAndTypeList",
		step : 5,
		navTit : ["监控器类型" ,"被监控资产" ,"基本信息" ,"凭证信息" ,"指标信息"],
		submitCbf : function () 
		{ 
			monitor_list({
				treeType : current_treeType,
				id : treeNode.id,
				queryType:"noQueryComponent",
				language:"1"
			});
		},
		step_1_edit : function () 
		{
			$(".umDialog").find("#"+rowData.monitorType).click();
			var sTop = $("#"+rowData.monitorType).offset().top - 300;
			$(".stepContainer").animate({scrollTop : sTop} ,400);
		},
		step_2_edit : function () 
		{
			return detail;
		},
		step_3_edit : function () 
		{
			return detail;
		},
		step_4_edit : function () 
		{
			return detail;
		},
		step_5_edit : function () 
		{
			return detail;
		}
	});

}

// 单条记录的删除按钮点击事件
function monitor_list_delete_btn_click(row_data){
	// monitorManageStatus 1停用状态并且待部署和正常状况下允许删除monitorDeployStatus 0 1
	if ((row_data.monitorManageStatus == 1 
			&& (row_data.monitorDeployStatus == 0 || row_data.monitorDeployStatus == 1)))
	{
		g_dialog.operateAlert(null ,"该监控器不允许删除" ,"error");
		return false;
	}
	g_dialog.operateConfirm("确认删除么?" ,{
		saveclick : function (){
		var temp = {
					"monitorId":row_data.monitorId,
					"monitorName":row_data.monitorName,
					"monitorAgentIp":row_data.monitorAgentIp,
					"monitorTrayStatus":row_data.monitorTrayStatus,
					"monitoruserName":row_data.monitoruserName,
					"monitorPort":row_data.monitorPort,
					"monitorAgentName":row_data.monitorAgentName,
					"monitorDatabaseName":row_data.monitorDatabaseName,
					'opFlag':row_data.opFlag,
					"version":row_data.version,
					"edName":row_data.edName,
					"monitorManageStatus":row_data.monitorManageStatus,
					"monitorTypeName":row_data.monitorTypeName,
					'monitorDeployStatus':row_data.monitorDeployStatus,
					"edNameCell":row_data.edNameCell,
					"edId":row_data.edId,
					"monitorType":row_data.monitorType,
					"monitorAgent":row_data.monitorAgent,
					'ipvAddress':row_data.ipvAddress,
					"intsStatus":row_data.intsStatus
				};

			um_ajax_post({
				url : "monitorConfig/deleteMonitor",
				paramObj : {monitorstore:[temp]},
				successCallBack : function (data) 
				{
					g_grid.refresh($("#table_div"));
					accordion_init();
					g_dialog.operateAlert(null ,"删除成功！");
				}
			});	
		}
	});
}

function is_in_switch(monitorType)
{
	var flag = false;
	switch(monitorType)
	{
	                   case "KILL" :
	                   case "LENOVOIDS" :
	                   case "LENOVOVPN" :
	                   case "NSFOCUS" :
	                   case "VENUS" :
	                   case "SURFILTER" :
	                   case "RISING" :
	                   case "TOPSECAV" :
	                   case "DBAPP_USM" :
	                   case "NETENTSEC" :
	                   case "RISING_CONS":
	                   case "KILL_CONS":
	                   case "VENUS_CONS":
	                   case "NSFOCUS_CONS":
	                   case "LENOVOIDS_CONS":
	                   case "SURFILTER_CONS":
	                   case "NETENTSEC_CONS":              
	                   case "TOPSEC_IDS":
	                   case "NOKIA_CHECK_POINT":
	                   case "NSFOCUS_SAS":
	                   case "VENUS_NSAS":               
	                   case "ANCHIVA_SWG":
	                   case "DPTECH_IPS":
	                   case "DPTECH_FW":
	                   case "ANCHIVA_WAF":
	                   case "SECWORLD":
	                   case "VENUST_IDS":
	                   case "LEADSEC":
	                   case "OPTICALSWITCHER":
	                   case "ARRAY":
	                   case "DBAPPWEB_FW":
	                   flag = true;
	}
	return flag;
}

function monitor_excute(rowData)
{
	um_ajax_get({
		url : "monitorView/doExecute",
		maskObj : $("#table_div"),
		paramObj : {monitorId:rowData.monitorId ,agentId:rowData.nodeId ,monitorType:rowData.monitorTypeId},
		successCallBack :function (data){
			g_dialog.operateAlert();
			g_grid.refresh($("#table_div"));
		}
	});
}

function monitor_edit(rowData) 
{
	var detail;
	$("[data-id=temp_monitored_asset]").val(rowData.asertId);
	um_ajax_post({
		url : "monitorConfig/queryMonitorDetail",
		paramObj : {"monitorId":rowData.monitorId,"deviceSource":"1","monitorType":rowData.monitorTypeId,"edId":rowData.asertId,"intsStatus":rowData.instStatus,"regionId":rowData.regionId},
		maskObj : "body",
		successCallBack : function (data) 
		{
			detail = data;
			monitor.monitorDialog({
				url : "module/sys_manage/monitor_config/monitor_config_tpl.html",
				ele : "[id=edit_template]",
				title : "监控器修改 <span class='dn' data-name='monitorTitle'>( <span class='dn' data-key='monitorType'>监控器类型：<span data-value='monitorType'></span></span><span class='dn' data-key='monitorName'>, 监控器名称：<span data-value='monitorName'></span></span><span class='dn' data-key='assetName'>, 资产名称：<span data-value='assetName'></span></span><span class='dn' data-key='assetIp'>, 资产IP：<span data-value='assetIp'></span></span> )</span>",
				showList : true,
				monitorType : "deviceMonitor/queryMonitorClassAndTypeList",
				step : 5,
				isEdit : true,
				detailData : data,
				navTit : ["监控器类型" ,"被监控资产" ,"基本信息" ,"凭证信息" ,"指标信息"],
				submitCbf : function () 
				{
					// monitor_type_tree(currTreeNode==undefined ? false: true);
					accordion_init();
					g_grid.refresh($("#table_div"));
				},
				step_1_edit : function () 
				{
					$(".umDialog").find("#"+rowData.monitorTypeId).click();
					var sTop = $("#"+rowData.monitorTypeId).offset().top - 300;
					$(".stepContainer").animate({scrollTop : sTop} ,400);
					return detail;
				},
				step_2_edit : function () 
				{
					return detail;
				},
				step_3_edit : function () 
				{
					return detail;
				},
				step_4_edit : function () 
				{
					return detail;
				},
				step_5_edit : function () 
				{
					return detail;
				}
			});
		}
	});
}

function monitor_status_change(treeNode)
{
	var className = treeNode.className;
	if (treeNode.pId && treeNode.pId != "-1")
	{
		className = treeNode.getParentNode().className;
	}
	if (!className)
	{
		return false;
	}
	um_ajax_get({
		url : "deviceMonitor/queryTreeByDeviceType",
		paramObj : {className : className},
		isLoad : false,
		successCallBack : function (data){
			if (!data || data.length == 0)
			{
				return false;
			}
			var array = data.splice(0,data.length-1);
			var className;
			var status;
			var el_icon;
			var el_status;
			for (var i = 0; i < array.length; i++) {
				className = array[i].className;
				status = array[i].monitorDstatus;
				el_icon = $("#accordion").find('[class*=a'+className+'_ico]');
				el_status = el_icon.parent().find("[class*=montor-name-span]");
				el_status.attr("class" ,"montor-name-span monitor-status-"+status);
			}
		}
	});
}

});
});