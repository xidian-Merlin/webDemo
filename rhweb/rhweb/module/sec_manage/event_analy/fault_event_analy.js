$(document).ready(function (){

require(['/js/plugin/inputdrop/inputdrop.js',
		'/js/plugin/tree/tree.js',
		'/js/plugin/tab/tab.js',
		'/js/plugin/plot/plot.js',
		'/js/plugin/workorder/workorder.js',
		'/js/plugin/event/event.js'
	], function(inputdrop, tree, tab, plot, workorder, pevent) {

$("#content_div").addClass("appbgf");

event_init();

var el_event_list = $("#table_div");

pevent.faultEventList();

function event_init()
{
	$("[data-val=fault_event_li]").find("[id=custom_btn]").click(function (){
		pevent.eventCustomCol({
			tplUrl : "module/sec_manage/event_analy/fault_event_analy_tpl.html",
			colQueryUrl : "faultAlarmEvent/queryFaultColumeIds",
			customColumnsUrl : "faultAlarmEvent/saveFaultCustomColumn",
			type:"2",
			cbf : function (){
				pevent.faultEventList();
			}
		});
	});

	// 导出按钮
	$("[data-val=fault_event_li]").find("[id=export_btn]").click(function(rowData) {
		var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
		if(!queryObj.currentStatus && ($("#table_div").find("[data-id=currentStatus]").size() == 0))
		{
			queryObj.currentStatus = 0;
		}
		if (!queryObj.faultStatus && ($("#table_div").find("[data-id=faultStatus]").size() == 0))
		{
			queryObj.faultStatus = "1,3";
		}
		pevent.eventExport({
			attr : "faultNO",
			url : "faultAlarmEvent/exportFault",
			queryObjStr : JsonTools.encode(queryObj)
		});
	});

	// 统计
	var fault_event_stat_url = "faultAlarmEvent/statQuery";
	$("[data-val=fault_event_li]").find("[id=count_btn]").click(function (){
		$.ajax({
			type: "GET",
			url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
			success: function(data) {
				g_dialog.dialog($(data).find("[id=count_template]"), {
					width: "1100px",
					initAfter: initAfter,
					isDetail: true,
					top:"6%",
					title:"统计"
				});
			}
		});

		function initAfter(el) {
			chart_render(el.find("[id=eventname_analy_chars]"), 1 ,"故障事件统计" ,fault_event_stat_url);
			chart_render(el.find("[id=type_analy_chars]"), 2 ,"故障事件统计" ,fault_event_stat_url);
			chart_render(el.find("[id=level_analy_chars]"), 6 ,"故障事件统计" ,fault_event_stat_url);
			chart_render(el.find("[id=time_analy_chars]"), 7 ,"故障事件统计" ,fault_event_stat_url);
		}
	});

	var perform_event_stat_url = "performanceEvent/statPerformanceEventQuery";

	// 忽略
	$("[data-val=fault_event_li]").find("[id=lgnore_btn]").click(function() {
		var array = g_grid.getIdArray(el_event_list ,{chk:true ,attr:"faultStatus"});
		if (array.join("").indexOf("2") >= 0)
		{
			g_dialog.operateAlert(el_event_list ,"选中记录中包含已忽略的记录，请重新选择","error");
			return false;
		}
		pevent.ignore({
			gridEl: el_event_list,
			attr: "faultNO",
			ignore_url: "faultAlarmEvent/doIgnore",
			cb: function() {
				g_grid.refresh(el_event_list);
			}
		});
	});

	// 忽略全部
	$("[data-val=fault_event_li]").find("[id=lgnore_all_btn]").click(function(rowData) {
		var data = g_grid.getData($("#table_div") ,{chk:false});
		if (data.length == 0)
		{
			// 弹出提示
			g_dialog.operateAlert($("#table_div") ,"列表无数据。" ,"error");
			// 直接返回
			return false;
		}
		pevent.ignoreAll({
			gridEl: el_event_list,
			lgnore_all_url: "faultAlarmEvent/doFaultEventIgnoreAll",
			cb: function() {
				pevent.faultEventList();
			}
		});
	});

	// 生成工单
	$("[data-val=fault_event_li]").find("[id=order_btn]").click(function() {
		//work_order_create("faultModule");
		pevent.createWorkOrder({
			gridEl : $("#table_div"),
			descKey : "faultModule",
			eventIdKey : "faultNO",
			eventTypeVal : "2"
		});
	});
}

function chart_render(el, typeid ,seriesName ,url) {
	var paramObj = $("[class*=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
	paramObj.queryFlag = true;
	paramObj.typeid = typeid;
	// if (!paramObj.currentStatus || paramObj.currentStatus == "-1")
	// {
	// 	paramObj.currentStatus = 0;
	// }
	if (typeid == "7")
	{
		um_ajax_get({
			url: url,
			paramObj: paramObj,
			successCallBack: function(data) {
				var seriesArray = [];
				var categoryArray = [];
				seriesObj = new Object();
				seriesObj.name = seriesName;
				seriesObj.type = "line";
				//seriesObj.areaStyle = {normal: {}};
				seriesObj.data = [];
				var data = data.datas[0].items;
				for (var i = 0; i < data.length; i++) {
					categoryArray.push(data[i].lable);
					seriesObj.data.push(data[i].value);
				}
				seriesArray.push(seriesObj);
				plot.lineRender(el, {
					category: categoryArray,
					series: seriesArray,
					grid: {
				        left: '6%',
				        right: '9%',
				        bottom: '3%',
				        containLabel: true
				    }
				});
			}
		});
	}
	else
	{
		var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url: url,
			paramObj: paramObj,
			successCallBack: function(data) {
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "值";
				seriesObj.type = "bar";
				seriesObj.data = [];
				seriesObj.itemStyle = new Object();
				seriesObj.itemStyle.normal = new Object();
				seriesObj.itemStyle.normal.color = color_array[typeid];
				var categoryArray = [];
				var data = data.datas;
				for (var i = 0; i < data.length; i++) {
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el, {
					category: categoryArray,
					series: seriesArray,
					isVercital: true
				});
			}
		});
	}
}

function work_order_create(key){
	var dataArray = g_grid.getData($("#table_div") ,{chk:true});
	if (dataArray.length == 0)
	{
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}
	var tmp = [];
	for (var i = 0; i < dataArray.length; i++) {
		tmp.push({desc:dataArray[i][key]});
	}
	//window.location.href = "#/oper_workorder/workorder_handle/workorder_detail?id=socsjczlc&eventStr="+tmp.join(",")+"&eventType=2";
	um_ajax_post({
		url : "workflow/syncWorkOrder",
		paramObj : {syncAlarmEvent : tmp},
		successCallBack : function (){
			g_dialog.operateAlert();
			g_grid.refresh($("#table_div"));
		}
	});
}



});
});