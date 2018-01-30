$(document).ready(function (){


	
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
	
/*	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div")
	});
	*/
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
						$("#right-panel").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
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
		var type = 1;
		if(list_current_data_name == "assetPreviewList"){
			type = 1;
		}else {
			type = 2;
		}
		
		$.ajax({
			type: "POST",
			url: " eqpMonitor/preMonitor",
			dataType: "json",
			timeout : 120000, //超时时间设置，单位毫秒
			data:{type:type},
			success :function(data){
				tree.render($("#accordion") ,{
							zNodes : data[$(self).attr("data-name")],
							zTreeOnClick : accordion_click
						});
				tree.expandSpecifyNode($("#accordion") ,"root");
				accordion_click(null ,null ,tree.selectNode($("#accordion") ,{key:"id",value:"root"}));
			}
		});
	});
	
}

function accordion_click(event, treeId, treeNode)
{
	
	list_current_node = treeNode;

	var type = list_current_type;

	var paramObj = new Object();

	//paramObj.type = type;
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
var statisticUrl = "";
function asset_list(opt)
{
	var url = "eqpMonitor/delMonitor";
	var header = [
					{text:'',name:"",width:4,render:function (){
						return '<i class="icon-plus" data-flag="col-expand" style="color:rgba(0,0,0,0.6)"></i>';
					},hideSearch : "hide"},
					{text:'资产编号',name:"eqpNo",width:12},
					{text:'资产名称',name:"name",width:12},
					{text:'主IP',name:"ip",width:17,searchRender:function (el){
							 index_render_div(el ,{type:"ip"});
					}},
					{text:'资产类型',name:"assetType",width:13,hideSearch:true},
					{text:'安全域',name:"securityDomain",width:14,hideSearch:true},
				
				 ];
	var oper = [
					{icon:"rh-icon rh-ping" ,text:"ping" ,aclick:asset_monitor_list_update_dialog}
			   ];
	
	var type = "";
	var id = 0;
	var tabType = 1;
	
	
	
	
	alert(opt.paramObj.nodeId);
	if(list_current_node.id == "root") {type = "root"; id = 0;}
	else if(opt.paramObj.nodeId == -1) {type = "class"; id = 1;}
	else if(opt.paramObj.nodeId > 0) {type = "type"; id = opt.paramObj.nodeId}
	if(opt.paramObj.treeType == "SECURITY_DOMAIN_TREE"){
		tabType = 2;
		if(opt.paramObj.nodeId != "root"){
			type = "class"; 
			id = opt.paramObj.nodeId;
		}
		
	}
	opt.paramObj.type = type;
	opt.paramObj.id = id;
	opt.paramObj.tabType = tabType;
	
	g_grid.render($("#table_div"),{
		header:header,
		nodeId:list_current_node.id,
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
					$.ajax({
						type: "POST",
						url: "eqpMonitor/plusPreInfo",
						dataType:"json",
						data: {eqpNo: rowData.eqpNo},
						success :function(data)
					/*um_ajax_get({
						url : "assetMonitor/queryMonitor",
						paramObj : {assetId:rowData.assetId ,assetName:rowData.assetName},
						successCallBack : function (data)*/{
							var data = data.typeList;
							var items;
							for (var i = 0; i < data.length; i++) {
								el_next_tr_div.append('<div style="padding-left:100px"><ul></ul><div class="monitor_title">'+data[i].infoType+'</div></div>');
								items = data[i].infoList;
								for (var j = 0; j < items.length; j++) {
									// 安全事件隐藏 文件隐藏 系统漏洞隐藏 基线检查隐藏 snmpStatus不等于1时 流量隐藏
									
										el_next_tr_div.find("ul").eq(i).append('<li class="prel" data_code="'+items[j].infoType+'" data_id="'+items[j].infoType+'" data_title="'+items[j].infoType+'" ><div class="monitor-icon '+items[j].picName+'"></div><div class="tc" title="'+items[j].infoType+'">'+items[j].infoName+'</div></li>');
										// 业务层-URL时，调用后台得到monitorId
										/*if (items[j].code == "BUSS_URL_TYPE")
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
										}*/
						
								}
							}
							/*el_next_tr_div.find("li").each(function (){
								var count = $(this).attr("data_count");
								if (count && count > 0)
								{
									$(this).append('<span class="dib circle pabs" style="line-height: 18px; background-color: rgb(236, 112, 99); color: rgb(255, 255, 255); border: medium none; width: 18px; height: 18px; text-align: center; right: 15px; top: 2px;">'+count+'</span>')
								}
							});*/
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
	var infoType = el_li.attr("data_code");
	var eqpNo = rowData.eqpNo;
	/*{
		"result": true,
		"infoList": [{
			"valueIndex": 4,
			"dskAvail": 13512156,
			"eqpNo": "0001-00001",
			"collectTime": "2017-05-17 18:01:00",
			"dskUsed": 4953568,
			"dskTotal": 19478204,
			"dskPercent": 27,
			"dskPath": "/",
			"dskDevice": "/dev/sda1"
		}]
	}*/
//
	var header;
	switch(infoType){
	case "PROC_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"进程名", name:"procName"},
			{text:"进程状态", name:"procState"},
			{text:"进程用户", name:"procUserName"},
			{text:"进程优先级", name:"procPriority"}
		];
		break;
	case "PROC_STATISTICS_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"进程总数", name:"procTotal"},
			{text:"休眠进程", name:"procSleeping"},
			{text:"运行进程", name:"procRunning"},
			{text:"僵尸进程", name:"procZombie"},
			{text:"暂停进程", name:"procStopped"}
		];
		break;
	case "NET_INTERFACE_CONFIG_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"名称", name:"ifName"},
			{text:"类型", name:"ifType"},
			{text:"硬件地址", name:"ifHwaddr"},
			{text:"ipv4", name:"ifAddress"},
			{text:"掩码", name:"ifNetmask"},
			{text:"目地", name:"ifDestination"},
			{text:"网关", name:"ifBroadcast"},
			{text:"描述", name:"ifDescription"}
		];
		break;
	case "NET_INTERFACE_STAT_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"接收包数", name:"rxPackets"},
			{text:"接收字节数", name:"rxBytes"},
			{text:"接收错误数", name:"rxErrors"},
			{text:"接收丢失数", name:"rxDropped"},
			{text:"接受帧数", name:"rxFrame"},
			{text:"发送包数", name:"txPackets"},
			{text:"发送字节数", name:"txBytes"},
			{text:"发送错误数", name:"txErrors"},
			{text:"发送丢失数", name:"txDropped"},
			{text:"发送帧数", name:"txFrame"}
		];
		statisticUrl = "eqpMonitor/ifStatStatistics1";
		break;
	case "NET_CONNECTION_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"本地端口", name:"localPort"},
			{text:"本地地址", name:"localAddress"},
			{text:"远程端口", name:"remotePort"},
			{text:"远程地址", name:"remoteAddress"},
			{text:"发送队列", name:"sendQueue"},
			{text:"接受队列", name:"receiveQueue"}
		];
		break;
	case "NET_ROUTE_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"目地地址", name:"routeDestination"},
			{text:"路由网关", name:"routeGateway"},
			{text:"路由掩码", name:"routeMask"},
			{text:"路由配置名", name:"routeIfname"},
			{text:"MTU", name:"routeMTU"}
		];
		break;

	case "TBLVALUESDISKS":
	 header = [
		{text:"设备编号" ,name:"eqpNo"},
		{text:"可用磁盘(B)" ,name:"dskAvail"},
		{text:"已使用(B)" ,name:"dskUsed"},
		{text:"磁盘总量(B)" ,name:"dskTotal"},
		{text:"采集时间" ,name:"collectTime"},
		{text:"磁盘设备" ,name:"dskDevice"},
		{text:"磁盘路径" ,name:"dskPath"},
		{text:"使用率(%)" ,name:"dskPercent"},
		
	 ];
	 break;
	case "TBLVALUESIFSSTAT":
		header = [
			{text:"设备编号" ,name:"eqpNo"},
			{text:"设备描述" ,name:"ifDescr"},
			{text:"设备类型" ,name:"ifType"},
			{text:"设备速度" ,name:"ifSpeed"},
			{text:"采集时间" ,name:"collectTime"},
			{text:"设备状态" ,name:"ifOperStatus"},
			{text:"错误" ,name:"ifOutErrors"}
		 ];
		 break;
	case "TBLVALUESMEMORY":
		header = [
			{text:"设备编号" ,name:"eqpNo"},
			{text:"可用内存(B)" ,name:"memAvailReal"},
			{text:"内存交换(B)" ,name:"memTotalSwap"},
			{text:"内存总量(B)" ,name:"memTotalReal"},
			{text:"采集时间" ,name:"collectTime"},
			{text:"内存共享" ,name:"memShared"},
			{text:"内存缓存" ,name:"memBuffer"}
		 ];
		 break;
	case "TBLVALUESPROCESSES":
		header = [
			{text:"设备编号" ,name:"eqpNo"},
			{text:"设备名称" ,name:"pitName"},
			{text:"开始" ,name:"pitStart"},
			{text:"时间" ,name:"pitTime"},
			{text:"cpu" ,name:"pitCpu"},
			{text:"内存" ,name:"pitMem"},
			{text:"使用人" ,name:"pitUser"}
		 ];
		 break;
	case "TBLVALUESSYSTEMSTATS":
		header = [
			{text:"设备编号" ,name:"eqpNo"},
			{text:"系统日期" ,name:"hrSystemDate"},
			{text:"系统最大进程数" ,name:"hrSystemMaxProcesses"},
			{text:"系统进程数" ,name:"hrSystemProcesses"},
			{text:"采集时间" ,name:"collectTime"},
			{text:"CPU使用" ,name:"ssCpuUser"}
		 ];
		 break;
	case "SYS_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"系统名称", name:"sysName"},
			{text:"系统描述", name:"sysDescription"},
			{text:"系统最大进程数", name:"sysProcsMax"},
			{text:"系统当前进程数", name:"sysProcsCur"},
			{text:"系统最大打开文件数", name:"sysOpenFilesMax"},
			{text:"系统当前打开文件数", name:"sysOpenFilesCur"}
		];
		statisticUrl = "eqpMonitor/sysStatInfoStatistics";
		break;
	case "MEM_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"内存总量", name:"memTotal"},
			{text:"内存使用量", name:"memUsed"},
			{text:"内存使用比", name:"memUsedPercent"},
			{text:"交换总量", name:"swapTotal"},
			{text:"交换使用", name:"swapUsed"}
		];
		statisticUrl = "eqpMonitor/memTimeStatistics";
		break;	
		
	case "CPU_INFO":
		header = [
			{text:"设备编号", name:"eqpNo"},
			{text:"采集时间", name:"collectTime"},
			{text:"CPU型号", name:"cpuModel"},
			{text:"CPU频率", name:"cpuMhz"},
			{text:"CPU缓存大小", name:"cpuCacheSize"},
			{text:"核心数", name:"cpuTotalCores"},
			{text:"套接字数", name:"cpuTotalSockets"}
		];
		break;	
	
	 default :
		 header = [
				{text:"设备编号" ,name:"eqpNo"},
				{text:"系统日期" ,name:"hrSystemDate"},
				{text:"系统最大进程数" ,name:"hrSystemMaxProcesses"},
				{text:"系统进程数" ,name:"hrSystemProcesses"},
				{text:"采集时间" ,name:"collectTime"},
				{text:"CPU使用" ,name:"ssCpuUser"}
			 ];
		 break;
	}
		
	show_table("eqpMonitor/plusDelInfo" ,header ,{eqpNo: eqpNo,infoType: infoType,statisticUrl: statisticUrl});

}

function show_table(url ,header ,paramObj)
{
	
	$.ajax({
			type: "GET",
			url: "/tdyth/resources/js/eqpMonitor/asset_monitor_tpl.html",
			success :function(data)
			{
				
				
				g_dialog.dialog($(data).find("[id=table_template]"),{
					width:"1000px",
					title:"详细信息",
					 btn_array:[
			 			   {id:"refresh_template" ,text:"切换显示" ,aClick:refreshDialog}
			 		   ],
					initAfter:initAfter,
					isDetail:true
				});
			}
	});

	var changeFlag = false;
	function refreshDialog(el,data){
	   var options = new Object();
	   options.eqpNo = paramObj.eqpNo;
		showStatistic(paramObj.statisticUrl,options);
		
		if (!changeFlag){
		//refresh the dialog
		el.find("[id=table_div]").hide();
		el.find("[id=chart_div]").show();
		changeFlag = true;
		}
		else {
			el.find("[id=table_div]").show();
			el.find("[id=chart_div]").hide();
			changeFlag = false;
		}
		
	 
		
	}
	
	function initAfter(el)
	{
		g_grid.render(el.find("[id=table_div]") ,{
			url : url,
			header : header,
			paramObj : paramObj,
			allowCheckBox:false,
			hideSearch:true,
			showCount : false
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