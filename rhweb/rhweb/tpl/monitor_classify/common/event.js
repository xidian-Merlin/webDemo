$(document).ready(function (){
	require(['/js/plugin/event/event.js'
	], function(pevent) {


var perform_event_list_url = "performanceEvent/queryPerformanceEventList";
var perform_event_list_header = [
						      {text:"事件名称" ,name:"perfName" ,tip:true ,tipInfo:"perfModule"},
						      {text:"当前状态",
									name:"currentStatus",
									render: function(text) {
										return (text == "1" ? "正常" : "异常");
									},
									searchRender:function (el){
										var data = [
														{text:"----" ,id:"-1"},
								  						{text:"正常" ,id:"1"},
								  						{text:"异常" ,id:"0"}
											  		];
										g_formel.select_render(el ,{
											data : data,
											name : "currentStatus"
										});
									}
							  },
						      {text:"状态" ,name:"perfStatus",render: function(text) {
									var status;
									switch (parseInt(text)) {
										case 1:
											status = "未处理";
											break;
										case 2:
											status = "忽略";
											break;
										case 3:
											status = "处理中";
											break;
										case 4:
											status = "已处理";
											break;
										default:
											break;
									}
									return status;
							  }},
						      {text:"事件类型" ,name:"className"},
						      {text:"最新发生时间" ,name:"enterDate"},
						      {text:"恢复时间" ,name:"updateDate"}
						   ];

var fault_event_list_url = "faultAlarmEvent/queryFaultEventList";
var fault_event_list_header = [
						      {text:"事件名称" ,name:"faultName" ,tip:true ,tipInfo:"faultModule"},
						      {text:"当前状态",
									name:"currentStatus",
									render: function(text) {
										return (text == "1" ? "正常" : "异常");
									},
									searchRender:function (el){
										var data = [
														{text:"----" ,id:"-1"},
								  						{text:"正常" ,id:"1"},
								  						{text:"异常" ,id:"0"}
											  		];
										g_formel.select_render(el ,{
											data : data,
											name : "currentStatus"
										});
									}
							  },
						      {text:"状态" ,name:"faultStatus",render: function(text) {
									var status;
									switch (parseInt(text)) {
										case 1:
											status = "未处理";
											break;
										case 2:
											status = "忽略";
											break;
										case 3:
											status = "处理中";
											break;
										case 4:
											status = "已处理";
											break;
										default:
											break;
									}
									return status;
							  }},
						      {text:"事件类型" ,name:"className"},
						      {text:"最新发生时间" ,name:"enterDate"},
						      {text:"恢复时间" ,name:"updateDate"}
						   ];

var deploy_event_list_url = "deployEvent/queryDeployEventList";
var deploy_event_list_header = [
						      {text:"事件名称" ,name:"depl_NAME"},
						      {text:"状态" ,name:"event_STATUS"},
						      {text:"事件类型" ,name:"className"},
						      {text:"发生时间" ,name:"enter_DATE"},
						      {text:"恢复时间" ,name:"update_date"}
						   ];
var ed_monitor_url = "monitorView/queryEdMonitor";

var urlParamObj = index_query_param_get();

var list_detail_header = [{text: '首次发生时间',name: "enterDate"}, 
						  {text: '最近发生时间',name: "lastDate"}, 
						  {text: '更新时间',name: "updateDate"}, 
						  {text: '恢复时间',name: "recoveryDate"}];

var list_detail_header2 = [
						   {text:'性能值',name:"value"},
						   {text:'发生时间',name:"enterDate"},
						   {text: '更新时间',name: "updateDate"}, 
						   {text:'恢复时间',name:"recoveryDate"}
						 ];

view_init();

event_init();

function view_init()
{
	ed_monitor_get();
}

function ed_monitor_get()
{
	urlParamObj.instStatus = 1;
    urlParamObj.monitorTypeNameLanguage = 1;
    urlParamObj.edId = urlParamObj.assetId;
    um_ajax_get({
        url : ed_monitor_url,
        paramObj : urlParamObj,
        isLoad : false,
        successCallBack : function (data){
           perform_event_list({
				param : {monitorId : data.edmonitorstore[1].monitorId,
						 flag : 1 ,
						 assetId : urlParamObj.assetId,
						 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
			});
           $("#perform_ignore_btn").attr("data-id",data.edmonitorstore[1].monitorId);
           fault_event_list({
				param : {monitorId : data.edmonitorstore[1].monitorId,
						 flag : 1 ,
						 assetId : urlParamObj.assetId,
						 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
			});
           $("#fault_ignore_btn").attr("data-id",data.edmonitorstore[1].monitorId);
    //        deploy_event_list({
				// param : {monitorId : data.edmonitorstore[1].monitorId,
				// 		 flag : 1 ,
				// 		 assetId : urlParamObj.assetId,
				// 		 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
		  //  });
		   $("#deploy_ignore_btn").attr("data-id",data.edmonitorstore[1].monitorId);

		   $("#fault_create_btn").attr("data-id",data.edmonitorstore[1].monitorId);
		   $("#perform_create_btn").attr("data-id",data.edmonitorstore[1].monitorId);
		   $("#deploy_create_btn").attr("data-id",data.edmonitorstore[1].monitorId);
        }
    });
}

window.index_monitor_init = function ()
{
	ed_monitor_get();
}

function fault_event_list(opt)
{		
	// opt.param.currentStatus = 0;
	opt.param.faultStatus = '1,3';
	g_grid.render($("#fault_event_list_div") ,{
		url : fault_event_list_url,
		header : fault_event_list_header,
		paramObj : opt.param,
		gridCss : "um-grid-style",
		hasBorder : false,
		hideSearch : true,
		paginator : false,
		showCount : true,
		showTip : {
			render : function (rowData){
				g_dialog.rightDialog({
					width : "800px",
					render : function (el_form ,el_mask){
						$.ajax({
							type: "GET",
							url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
							success: function(data) {
								el_form.append($(data).find("[id=detail_template]").html());
								// el_form.find("[id=detailmore_btn]").remove();
								
								el_form.find("[id=detailmore_btn]").click(function() {
									$.ajax({
										type: "GET",
										url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
										success: function(data) {
											g_dialog.dialog($(data).find("[id=detailmore_template]"), {
												width: "600px",
												init: init,
												title : "故障事件历史发生时间",
												isDetail: true,
												top:"8%"
											});
										}
									});

									function init(el) {
										g_grid.render(el.find('[id=table_in_query_detailmore]'), {
											header: list_detail_header,
											url: "faultAlarmEvent/queryFaultHisEventDetail",
											paramObj : {faultAlarmStore:{faultNO:rowData.faultNO}},
											isLoad : true,
											maskObj : "body",
											allowCheckBox: false,
											hideSearch : true
										});
									}
								});
								um_ajax_get({
									url : "faultAlarmEvent/queryFaultEventDetail",
									paramObj : {faultNO:rowData.faultNO},
									isLoad : false,
									maskObj : "body",
									successCallBack : function(data){
										el_form.umDataBind("render", data.faultAlarmStore[0]);
										el_mask.hide();
									}
								});
							}
						});
					}
				});
			}
		}
	});
}

function perform_event_list(opt)
{		
	// opt.param.currentStatus = 0;
	opt.param.perfStatus = "1,3";
	g_grid.render($("#perform_event_list_div") ,{
		url : perform_event_list_url,
		header : perform_event_list_header,
		paramObj : opt.param,
		gridCss : "um-grid-style",
		hasBorder : false,
		hideSearch : true,
		paginator : false,
		showCount : true,
		showTip : {
			render : function (rowData){
				g_dialog.rightDialog({
					width : "800px",
					render : function (el_form ,el_mask){
						$.ajax({
							type: "GET",
							url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
							success: function(data) {
								el_form.append($(data).find("[id=perform_detail_template]").html());
								// el_form.find("[id=detailmore_btn]").remove();
								$("#detailmore_btn").click(function (){
									$.ajax({
										type: "GET",
										url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
										success :function(data)
										{
											g_dialog.dialog($(data).find("[id=detailmore_template]"),{
												width:"600px",
												init:init,
												title : "性能事件历史发生时间",
												isDetail:true,
												top:"8%"
											});
										}
									});
									function init (el){
										g_grid.render(el.find('[id=table_in_query_detailmore]'),{
											header : list_detail_header,
											url : "performanceEvent/queryPerformanceHisEventDetail",
											paramObj : {performanceStore:{performanceNo:rowData.performanceNo}},
											isLoad : true,
											maskObj : "body",
											allowCheckBox : false,
											hideSearch : true
										});

									}
								});

								um_ajax_get({
									url : "performanceEvent/queryPerformanceEventDetail",
									paramObj : {performanceStore : {performanceNo:rowData.performanceNo}},
									isLoad : false,
									maskObj : "body",
									successCallBack : function(data){
										el_form.umDataBind("render", data[0]);
										el_mask.hide();
									}
								});
							}
						});
					}
				});
				//pevent.faultEventDetail({faultNO:rowData.faultNO});
			}
		}
	});
}

function deploy_event_list()
{
	if ($("#deploy_event_list_div").size() == 0)
	{
		return false;
	}
	urlParamObj.event_status = "1,3";
	g_grid.render($("#deploy_event_list_div") ,{
		url : deploy_event_list_url,
		header : deploy_event_list_header,
		paramObj : urlParamObj,
		gridCss : "um-grid-style",
		hasBorder : false,
		hideSearch : true,
		paginator : false,
		showCount : true,
		showTip : {
			render : function (rowData){
				g_dialog.rightDialog({
					width : "800px",
					render : function (el_form ,el_mask){
						$.ajax({
							type: "GET",
							url: "module/sec_manage/event_analy/deploy_event_analy_tpl.html",
							success: function(data) {
								el_form.append($(data).find("[id=deploy_detail_template]").html());
								el_form.find("[id=detailmore_btn]").remove();
								
								um_ajax_get({
									url : "deployEvent/queryDeployEventDetail",
									paramObj : {DEPLOY_NO:rowData.deploy_NO},
									isLoad : false,
									maskObj : "body",
									successCallBack : function(data){
										el_form.umDataBind("render", data[0]);
										el_form.find("[data-id=event_STATUS]").html(dict_event_status[data[0].event_STATUS].name);
										el_mask.hide();
									}
								});
							}
						});
					}
				});
				//pevent.faultEventDetail({faultNO:rowData.faultNO});
			}
		}
	});
}

function event_init()
{
	$("#fault_ignore_btn").click(function(){
		var monitorId = $(this).attr("data-id");
		pevent.ignore({
			gridEl : $("#fault_event_list_div"),
			attr : "faultNO",
			ignore_url : "faultAlarmEvent/doIgnore",
			cb: function() {
				fault_event_list({
					param : {monitorId : monitorId,
							 flag : 1 ,
							 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
				});
			}
		});
	});

	$("#perform_ignore_btn").click(function(){
		var monitorId = $(this).attr("data-id");
		pevent.ignore({
			gridEl : $("#perform_event_list_div"),
			attr : "performanceNo",
			ignore_url : "performanceEvent/doPerformanceEventIgnore",
			cb: function() {
				perform_event_list({
					param : {monitorId : monitorId,
							 flag : 1 ,
							 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
				});
			}
		});
	});

	$("#deploy_ignore_btn").click(function(){
		pevent.ignore({
			gridEl : $("#deploy_event_list_div"),
			attr : "deploy_NO",
			ignore_url : "deployEvent/doIgnore",
			cb: function() {
				deploy_event_list();
			}
		});
	});

	$("#fault_create_btn").click(function(){
		var monitorId = $(this).attr("data-id");
		pevent.createWorkOrder({
			gridEl : $("#fault_event_list_div"),
			descKey : "faultModule",
			eventIdKey : "faultNO",
			eventTypeVal : "2",
			cb: function() {
				fault_event_list({
					param : {monitorId : monitorId,
							 flag : 1 ,
							 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
				});
			}
		});
	});

	$("#perform_create_btn").click(function(){
		var monitorId = $(this).attr("data-id");
		pevent.createWorkOrder({
			gridEl : $("#perform_event_list_div"),
			descKey : "perfModule",
			eventIdKey : "performanceNo",
			eventTypeVal : "3",
			cb: function() {
				perform_event_list({
					param : {monitorId : monitorId,
							 flag : 1 ,
							 inpuDate:g_moment().format("YYYY-MM-DD HH:mm:ss")}
				});
			}
		});
	});

	$("#deploy_create_btn").click(function(){
		pevent.createWorkOrder({
			gridEl : $("#deploy_event_list_div"),
			descKey : "depl_MODULE",
			eventIdKey : "deploy_NO",
			eventTypeVal : "13",
			cb: function() {
				deploy_event_list();
			}
		});
	});
}

});
});

