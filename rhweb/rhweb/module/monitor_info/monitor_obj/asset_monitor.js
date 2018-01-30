$(document).ready(function (){
require(['/js/plugin/accordion/accordion.js',
		 '/js/plugin/tree/tree.js',
		 '/js/plugin/event/event.js',
		 '/js/plugin/asset/asset.js'] ,function (accordion ,tree ,event ,asset){

var list_current_node;

var list_current_type;

var list_current_tree_type;

var list_current_data_name;

var current_expand_tr;

var table_expand_init = false;

var el_accordion = $("#accordion");

view_init();

event_init();

initLayout();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
	
	left_tree_init();

	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div")
	});
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
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

/** 左侧树初始化*/
function left_tree_init()
{
	$("#accordion_icon").find("div").click(function (){
		list_current_type = $(this).attr("data-type");
		list_current_data_name = $(this).attr("data-name");
		$("#accordion_icon").find("div").removeClass("active");
		$(this).addClass("active");
		var self = this;
		um_ajax_post({
			url : "assetMonitor/queryCntTreeList",
			paramObj : {cntTree : 1 ,treeType : $(self).attr("data-tree")},
			isLoad : false,
			successCallBack : function (data){
				tree.render($("#accordion") ,{
							zNodes : data[$(self).attr("data-name")],
							zTreeOnClick : accordion_click
						});
				tree.expandSpecifyNode($("#accordion") ,"-1");
				accordion_click(null ,null ,tree.selectNode($("#accordion") ,{key:"id",value:"-1"}));
			}
		});
	});
}

function accordion_click(event, treeId, treeNode)
{
	list_current_node = treeNode;

	var type = list_current_type;

	var paramObj = new Object();

	paramObj.type = type;
	paramObj.nodeId = treeNode.id;

	if (type == "3")
	{
		paramObj.treeType = "SECURITY_DOMAIN_TREE";
	}

	if (type == "1")
	{
		paramObj.treeType = "BUSSINESS_DOMAIN_TREE";
	}

	if (type == "4")
	{
		paramObj.treeType = "ASSET_TYPE_TREE";
	}

	list_current_tree_type = paramObj.treeType;

	asset_list({paramObj:paramObj});
}

var current_i;
var current_j;

var current_li;
var current_rowData;

function asset_list(opt)
{
	var url = "assetMonitor/queryMonitorAsset";
	var header = [
					{text:'',name:"riskTend",width:4,render:function (){
						return '<i class="icon-plus" data-flag="col-expand" style="color:rgba(0,0,0,0.6)"></i>';
					},hideSearch : "hide"},
					{text:'',name:"",width:10,render:function (txt ,rowData){
						var count =  parseInt(rowData.faultEventCount) + parseInt(rowData.performanceEventCount);
						var countColor = "#ec7063";
						var iconClass = "icon-circle-arrow-down";
						var _color = null === rowData.riskTend ? "" : risk_tend_id_obj[rowData.riskTend].color;
						var _icon = null === rowData.riskTend ? "icon-circle-arrow-right" : risk_tend_id_obj[rowData.riskTend].icon;
						var _name = null === rowData.riskTend ? "不变" : risk_tend_id_obj[rowData.riskTend].name;
						if (count == 0)
						{
							countColor = "#62cb31";
						}
						if (count != 0 && parseInt(rowData.performanceEventCount) != 0)
						{
							var countColor = "#ffb933";
						}
						if (count != 0 && parseInt(rowData.faultEventCount) != 0)
						{
							var countColor = "#ec7063";
						}
						return '<div class="prel" style="height:22px"><i class="'+_icon+'" title="风险趋势：'+_name+'" style="font-size:21px;line-height:20px;color:'+_color+';vertical-align:middle"></i>'
									+'<span class="dib prel circle" title="事件总数" data_code="count" style="width:20px;height:20px;line-height:20px;background-color:'+countColor+';color:#fff;border:none;margin:0 6px;vertical-align:middle">'
									+count+'</span><img src="/img/'
									+rowData.osTypeMap+'" title="'+rowData.osTypeName+'" style="width:20px; height:20px;vertical-align:middle"></img></div>';
					},searchRender : function (el){
						el.append('<input type="hidden" search-data="type" searchCache/>');
						el.append('<input type="hidden" search-data="nodeId" searchCache/>');
						el.append('<input type="hidden" search-data="treeType" searchCache/>');
					}},
					{text:'资产名称',name:"assetName",width:12},
					{text:'主IP',name:"mainIp",width:17,searchRender:function (el){
							 index_render_div(el ,{type:"ip"});
					}},
					{text:'资产类型',name:"assetTypeName",width:13,hideSearch:true},
					{text:'安全域',name:"securityDomainName",width:14,hideSearch:true},
					{text:'业务域',name:"bussinessDomainName",width:14,hideSearch:true},
					{text:'故障事件',name:"faultEventCount",width:8,hideSearch:true,render:function (txt ,rowData){
						var count =  parseInt(rowData.faultEventCount);
						var countColor = "#ec7063";
						if (count == 0)
						{
							countColor = "#62cb31";
						}
						return '<i style="font-size:20px"></i><span class="dib circle prel" style="width:18px;height:18px;line-height:18px;background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
									+count+'</span>';
					}},
					{text:'性能事件',name:"performanceEventCount",width:8,hideSearch:true,render:function (txt ,rowData){
						var count =  parseInt(rowData.performanceEventCount);
						var countColor = "#ffb933";
						if (count == 0)
						{
							countColor = "#62cb31";
						}
						return '<i style="font-size:20px"></i><span class="dib circle prel" style="width:18px;height:18px;line-height:18px;background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
									+count+'</span>';
					}}
				 ];
	var oper = [
					{icon:"rh-icon rh-ping" ,text:"ping" ,aclick:asset_monitor_list_update_dialog}
			   ]
	g_grid.render($("#table_div"),{
		header:header,
		paramObj:opt.paramObj,
		url:url,
		oper: oper,
		operWidth:"40px",
		//isLoad:opt.isLoad,
		allowCheckBox:false,
		hasExpand:true,
		cbf:function(){
			$("[search-data=type]").val(list_current_type);
			$("[search-data=nodeId]").val(list_current_node.id);
			$("[search-data=treeType]").val(list_current_tree_type);
		}
	});

	function asset_monitor_list_update_dialog(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/monitor_info/monitor_obj/asset_monitor_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=template_update]"),{
					width:"500px",
					title:"ping操作",
					initAfter:initAfter,
					isDetail : true
				});
				function initAfter(el)
				{
					um_ajax_get({
						url : "monitorConfig/doTest",
						paramObj : {teststore:{assetIds:rowData.assetId,monitorType:"PING"}},
						maskObj : "body",
						successCallBack : function (data){
							el.find("[data-id=assetName]").text(rowData.assetName);
							el.find("[data-id=msg]").text(data.teststore[0].result);
						}
					});
				}
			}
		});
	}

	if (!table_expand_init)
	{
		table_expand_init = true;
		$("#table_div").on("click" ,"[data-flag=col-expand]" ,function (){
			$(this).toggleClass("icon-minus");
			var trEl = $(this).closest("tr");
			var rowData = trEl.data("data");
			// 展开
			if ($(this).hasClass("icon-minus"))
			{
				$("#table_div").find("[class*=expand-tr]").hide();
				$("#table_div").find("[data-flag=col-expand]").not(this).attr("class" ,"icon-plus");
				if (trEl.next().hasClass("expand-tr"))
				{
					trEl.next().show();
				}
				else
				{
					var buffer = [];
					buffer.push('<tr class="expand-tr asset_monitor" style="display:none"><td colSpan="10"><div style="padding:10px" data-flag="col-div">');
					buffer.push("</div><td></tr>");
					trEl.after(buffer.join(""));
					var el_next_tr_div = trEl.next().find("[data-flag=col-div]");
					um_ajax_get({
						url : "assetMonitor/queryMonitor",
						paramObj : {assetId:rowData.assetId ,assetName:rowData.assetName},
						successCallBack : function (data){
							var data = data.data;
							var items;
							for (var i = 0; i < data.length; i++) {
								el_next_tr_div.append('<div style="padding-left:100px"><ul></ul><div class="monitor_title">'+data[i].label+'</div></div>');
								items = data[i].items;
								for (var j = 0; j < items.length; j++) {
									// 安全事件隐藏 文件隐藏 系统漏洞隐藏 基线检查隐藏 snmpStatus不等于1时 流量隐藏
									if (items[j].code != "OS_SECURITY_EVENT_TYPE" && items[j].code != "BUSS_FILE_TYPE"
											&& items[j].code != "OS_SYSTEM_LEAK_TYPE" && items[j].code != "OS_BASE_LINE_TYPE" && items[j].code != "OS_SYSTEM_CONFIG_TYPE"
											&& !(items[j].code == "OS_FLOW_TYPE" && rowData.snmpStatus != 1))
									{
										el_next_tr_div.find("ul").eq(i).append('<li class="prel" data_code="'+items[j].code+'" data_id="'+items[j].id+'" data_title="'+items[j].title+'" data_count="'+items[j].count+'"><div class="monitor-icon '+items[j].code+'"></div><div class="tc" title="'+items[j].label+'">'+items[j].label+'</div></li>');
										// 业务层-URL时，调用后台得到monitorId
										if (items[j].code == "BUSS_URL_TYPE")
										{
											current_i = i;
											current_j = j;
											um_ajax_get({
												url : "monitorview/commonmonitor/commonurl/queryMonitorId",
												paramObj : {edId : rowData.assetId},
												isLoad : true,
												successCallBack : function (data){
													if (data && data[0])
													{
														el_next_tr_div.find("ul").eq(current_i).find("li").eq(current_j).attr("data_id" ,data[0].monitorId);
														el_next_tr_div.find("ul").eq(current_i).find("li").eq(current_j).attr("data_title" ,data[0].monitorName);
													}
												}
											});
										}
									}
								}
							}
							el_next_tr_div.find("li").each(function (){
								var count = $(this).attr("data_count");
								if (count && count > 0)
								{
									$(this).append('<span class="dib circle pabs" style="line-height: 18px; background-color: rgb(236, 112, 99); color: rgb(255, 255, 255); border: medium none; width: 18px; height: 18px; text-align: center; right: 15px; top: 2px;">'+count+'</span>')
								}
							});
							el_next_tr_div.find("li").click(function (){
								current_li = $(this);
								current_rowData = rowData;
								item_init($(this) ,rowData);
							});
							trEl.next().show();
						}
					});
				}
				current_expand_tr = trEl.next();
			}
			// 收起
			else
			{
				trEl.next().hide();
			}
		});
	}

	
}

function item_init(el_li ,rowData)
{
	var code = el_li.attr("data_code");
	var id = el_li.attr("data_id");

	var monitorName = el_li.attr("data_title");
	var monitor_url = '#/monitor_info/monitor_obj/monitor_info?';
	// 端口
	if(code == "BUSS_PORT_TYPE")
	{
		var header = [
						{text:"端口名称" ,name:"portName"},
						{text:"关注状态" ,name:"atteStatusName"},
						{text:"运行状态" ,name:"runStatusName"},
						{text:"更新时间" ,name:"enterDate"}
					 ];
		show_table("assetMonitor/queryPortList" ,header ,{edId:rowData.assetId});
	}
	// 进程
	else if (code == "BUSS_PROCESS_TYPE")
	{
		var header = [
						{text:"进程名称" ,name:"procName"},
						{text:"进程数量" ,name:"procNum"},
						{text:"关注状态" ,name:"atteStatus"},
						{text:"运行状态" ,name:"runStatus"},
						{text:"数据获取时间" ,name:"enterDate"}
					 ];
		show_table("assetMonitor/queryProcessList" ,header ,{edId:rowData.assetId});
	}
	// 流量
	else if (code == "OS_FLOW_TYPE")
	{
		asset.assetFlowDialog(rowData);
	}
	// 文件
	else if (code == "BUSS_FILE_TYPE")
	{
		var header = [
						{text:"文件全路径" ,name:"fileName"},
						{text:"文件类型" ,name:"fileType"},
						{text:"关注状态" ,name:"atteStatusName"},
						{text:"改变状态" ,name:"modifyName"},
						{text:"数据获取时间" ,name:"enterDate"},
						{text:"更新时间" ,name:"getDate"}
					 ];
		show_table("assetMonitor/queryFileList" ,header ,{edId:rowData.assetId});
	}
	// 性能事件
	else if (code == "APP_PERFORM_EVENT_TYPE")
	{
		var header = dict_perform_event_header;
		show_event_table("performanceEvent/queryPerformanceEventList" ,header ,{edId:rowData.assetId,classId:"3, 4",perfStatus:"1,3"},3);
	}
	else if (code == "OS_PERFORM_EVENT_TYPE"){
		var header = dict_perform_event_header;
		show_event_table("performanceEvent/queryPerformanceEventList" ,header ,{edId:rowData.assetId,classId:"1, 5, 2, 0",perfStatus:"1,3"},3);
	}
	// 故障事件
	else if (code == "APP_FAULT_EVENT_TYPE")
	{
		var header = dict_fault_event_header;
		show_event_table("faultAlarmEvent/queryFaultEventList" ,header ,{edId:rowData.assetId,classId:"3,4",faultStatus:"1,3"},2);
	}
	else if (code == "OS_FAULT_EVENT_TYPE")
	{
		var header = dict_fault_event_header;
		show_event_table("faultAlarmEvent/queryFaultEventList" ,header ,{edId:rowData.assetId,classId:"6,1,2,5,0",faultStatus:"1,3"},2);
	}
	else if(code == "BUSS_URL_TYPE")
	{
		if (id != "null")
		{
			url = monitor_url + 'monitorTypeId=COMMON_URL&monitorId='+id+'&monitorName='+monitorName+'&regionId=&assetId='+rowData.assetId+'&hideMenu=1';
			url = encodeURI(url);
		    url = encodeURI(url);
			window.open(url);
		}
		else
		{
			g_dialog.operateAlert($("#table_div") ,"该设备上没有配置URL监控器" ,"error");
		}
		
	}
	// 系统配置
	else if(code == "OS_SYSTEM_CONFIG_TYPE")
	{
		var header = [
						{text:"事件名称" ,name:"depl_NAME"},
						{text:"资产名称" ,name:"ed_ID"},
						{text:"监控器名称" ,name:"monitor_ID"},
						{text:"发生时间" ,name:"enter_DATE"},
						{text:"数量" ,name:"depl_COUNT"},
						{text:"状态" ,name:"event_STATUS"},
						{text:"事件内容" ,name:"depl_MODULE" ,render:function (txt){
							if (txt && txt.length > 10)
							{
								return txt.substr(0,10) + "...";
							}
							else
							{
								return txt;
							}
						},tip:true}
					 ];
		show_event_table("deployEvent/queryDeployEventList" ,header ,{edId:rowData.assetId},13);
	}
	// 系统漏洞
	else if (code == "OS_SYSTEM_LEAK_TYPE")
	{
		var header = [
						{text:"扫描事件名称" ,name:"taskName"},
						{text:"漏洞数量" ,name:"taskeCnt"},
						{text:"事件状态" ,name:"taskeStatus"},
						{text:"事件等级" ,name:"taskeLevel"},
						{text:"创建人" ,name:"creator"}
					 ];
		show_table("assetMonitor/queryLeakList" ,header ,{edId:rowData.assetId});
	}
	// 基线检查
	else if (code == "OS_BASE_LINE_TYPE")
	{
		var header = [
						{text:"基线检查事件名称" ,name:"depl_NAME"},
						{text:"事件状态" ,name:"ed_ID"},
						{text:"事件等级" ,name:"monitor_ID"},
						{text:"检查开始时间" ,name:"enter_DATE"},
						{text:"检查完成时间" ,name:"depl_COUNT"}
					 ];
		show_table("assetMonitor/queryBaseLineEvent" ,header ,{edId:rowData.assetId});
	}
	// CPU
	else if (code == "HARDWARE_CPU_TYPE" || code == "HARDWARE_MEMORY_TYPE"
				|| code == "HARDWARE_DISK_TYPE" || code == "HARDWARE_NET_CARD_TYPE")
	{
		show_detail({edId:rowData.assetId} ,code);
	}
	else
	{
		var url = monitor_url + 'monitorTypeId='+code+'&monitorId='+id+'&regionId=&assetId='+rowData.assetId+'&hideMenu=1&monitorName='+monitorName;
		url = encodeURI(url);
	    url = encodeURI(url);
		window.open(url);
	}
}

function show_table(url ,header ,paramObj)
{
	$.ajax({
			type: "GET",
			url: "module/monitor_info/monitor_obj/asset_monitor_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=table_template]"),{
					width:"650px",
					title:"详细信息",
					initAfter:initAfter,
					isDetail:true
				});
			}
	});

	function initAfter(el)
	{
		g_grid.render(el.find("[id=table_div]") ,{
			url : url,
			header : header,
			paramObj : paramObj,
			allowCheckBox:false,
			hideSearch:true,
			paginator : false,
			showCount : true
		});
	}

}

function show_event_table(url ,header ,paramObj,flag)
{
	pevent.dialogList({url:url,header:header,paramObj:paramObj},flag,true);
}

function show_detail(paramObj ,code)
{
	$.ajax({
			type: "GET",
			url: "module/monitor_info/monitor_obj/asset_monitor_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"500px",
					initAfter:initAfter,
					title:"详细信息",
					isDetail:true,
					hideSearch:true
				});
			}
	});

	function initAfter(el)
	{
		um_ajax_get({
			url : "assetMonitor/queryHardware",
			paramObj : paramObj,
			maskObj : el,
			successCallBack : function (data){
				if (code == "HARDWARE_CPU_TYPE")
				{
					el.find("[data-id=lable]").text("CPU信息");
					el.find("[data-id=value]").html(data[0].cpuInfo?data[0].cpuInfo:"N/A");
				}
				if (code == "HARDWARE_MEMORY_TYPE")
				{
					el.find("[data-id=lable]").text("内存信息");
					el.find("[data-id=value]").html(data[0].memoryInfo?data[0].memoryInfo:"N/A");
				}
				if (code == "HARDWARE_DISK_TYPE")
				{
					el.find("[data-id=lable]").text("硬盘信息");
					el.find("[data-id=value]").html(data[0].discInfo?data[0].discInfo:"N/A");
				}
				if (code == "HARDWARE_NET_CARD_TYPE")
				{
					el.find("[data-id=lable]").text("网卡信息");
					el.find("[data-id=value]").html(data[0].netCardInfo?data[0].netCardInfo:"N/A");
				}
				
			}
		});
	}
}

function refresh_event_count()
{
	current_expand_tr.prev().find("[data_code=count]").text(10);
	current_expand_tr.find("[data_code=APP_FAULT_EVENT_TYPE]").find("span").text(10);
	current_expand_tr.find("[data_code=OS_FAULT_EVENT_TYPE]").find("span").text(10);
	current_expand_tr.find("[data_code=APP_PERFORM_EVENT_TYPE]").find("span").text(10);
	current_expand_tr.find("[data_code=OS_PERFORM_EVENT_TYPE]").find("span").text(10);
}


});
});