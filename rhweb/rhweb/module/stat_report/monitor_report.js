$(document).ready(function (){
require(['js/plugin/asset/asset.js'] ,function (asset){


	var form_wait_monitor_list_url = "deviceMonitor/getMonitorNoGird";
	var form_wait_monitor_list_col = [{text:'待选监控器',name:"codename"}];

	var form_done_monitor_list_url = "";
	var form_done_monitor_list_col = [{text:'已选监控器',name:"codename"}];

	var current_flag;
	var current_para;

	var report_url = "Report/getReport";

	view_init();
	event_init();

	function view_init()
	{
		index_form_init($("#report_query_template"));
	}

	function event_init()
	{
		$("[data-type=report_query]").click(function(){
			report_query_init($(this));
		});

		$("[data-type=monitor_query]").click(function(){
			monitor_query_init($(this));
		});
		$("#close_btn").click(function (){
			$("#report_detail_div").hide();
			$("#report_div").show();
			current_flag = undefined;
			current_para = undefined;
		});

		$("#export_ul").find("li[data-id]").click(function (){
			window.location.href = index_web_app + "Report/exportReport?flag="+current_flag+"&exportType="+$(this).attr("data-id")+"&para='"+JSON.stringify(current_para)+"'";
		});
	}

	function reportSuccessCallBack(data){
		g_dialog.operateAlert();
		g_dialog.hide($(".umDialog"));
		$("#report_div").hide();
		$("#report_detail_show_div").html(data);
		$("#report_detail_div").show();
		$("#content_div").scrollTop(0);
	}

	function report_query_init(aEl)
	{

		$.ajax({
			type: "GET",
			url: "module/stat_report/monitor_report_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=report_query_template]"),{
					width:"700px",
					init:init,
					initAfter:initAfter,
					title:"报表查询",
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			// el.find("[id=query_btn]").click(function(){
		 // 		asset.queryDialog({
		 // 			saveclick : function (saveObj){
			// 	 		if(saveObj.securityDomain) saveObj.securityDomainId = saveObj.securityDomain;
			// 	 		if(saveObj.bussinessDomain) saveObj.bussinessSystemId = saveObj.bussinessDomain;
			// 	 		if(saveObj.assetType) saveObj.assetTypeId = saveObj.assetType;
			// 	 		if(saveObj.ipRadioStatus) saveObj.mainIpType = saveObj.ipRadioStatus;
			// 	 		if(saveObj.ipRadioStatusStartIp) saveObj.startIp = saveObj.ipRadioStatusStartIp;
			// 	 		if(saveObj.ipRadioStatusEndIp) saveObj.endIp = saveObj.ipRadioStatusEndIp;
			// 	 		if(saveObj.ipRadioStatusIpv6) saveObj.mainIp = saveObj.ipRadioStatusIpv6;
			// 	 		um_ajax_get({
			// 	 			url:"asset/queryAsset",
			// 	 			paramObj : saveObj,
			// 	 			successCallBack : function(data){
			// 	 				el.find("[data-id=assetId]").html("");
			// 	 				for(var i=0;i<data.length;i++){
			// 	 					el.find("[data-id=assetId]").append("<option value='"+data[i].edId+"'>"+data[i].assetName+"</option>");
			// 	 				}
			// 	 			}
			// 	 		});
			// 	 	}
		 // 		});
			// });
			var today = g_moment().format('YYYY-MM-DD HH:mm:ss');
			el.find("[data-id=endDate]").val(today);
		}

		function initAfter(el)
		{
			// 获取资产下拉列表
			um_ajax_get({
				url:"monitorReport/getAssetOptions",
				paramObj : {monitorType:aEl.attr("data-monitorType")},
				maskObj : el,
				successCallBack : function(data){
					el.find("[data-id=assetId]").html("");
					for(var i=0;i<data.length;i++){
						el.find("[data-id=assetId]").append("<option value='"+data[i].codevalue+"'>"+data[i].codename+"</option>");
					}
					el.find("[data-id=assetId]").change(function (){
						um_ajax_get({
							url:"monitorReport/getMonitorOptions",
							paramObj : {assetId : el.find("[data-id=assetId]").val(),monitorType : aEl.attr("data-monitorType")},
							maskObj : el,
							successCallBack : function(data){
								el.find("[data-id=monitorId]").html("");
								for(var i=0;i<data.length;i++){
									el.find("[data-id=monitorId]").append("<option value='"+data[i].codevalue+"'>"+data[i].codename+"</option>");
								}
								el.find("[data-id=monitorId]").trigger("change");
							}
						});
					});
					el.find("[data-id=assetId]").trigger("change");
				}
			});
			
		}

		function save_click(el,saveObj)
		{
			var save_url = "Report/getReport";

			if (!g_validate.validate(el))
			{
				return false;
			}
			saveObj.startDate = g_moment(saveObj.endDate,"YYYY-MM-DD HH:mm:ss").subtract(1,"day").format("YYYY-MM-DD HH:mm:ss");
			saveObj.flag = $(aEl).closest("a").prop("id");
			current_flag = saveObj.flag;
			current_para = saveObj.para;
			um_ajax_post({
				url : save_url,
				paramObj : { "para" : saveObj , flag : saveObj.flag },
				maskObj : el,
				successCallBack : reportSuccessCallBack
			});
		}
	}

	function monitor_query_init(aEl)
	{
		$.ajax({
			type: "GET",
			url: "module/stat_report/monitor_report_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=monitor_query_template]"),{
					width:"700px",
					init:init,
					initAfter:initAfter,
					title:"监控器查询",
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			var left_table = el.find("[id=left_table]");
			var right_table = el.find("[id=right_table]");

			g_grid.render(left_table,{
				 url:form_wait_monitor_list_url,
				 header:form_wait_monitor_list_col,
				 paramObj : {monitorTypeId : -1},
				 gridCss : "um-grid-style",
				 hideSearch : true,
				 paginator : false
			});

			g_grid.render(right_table,{
				 data:[],
				 header:form_done_monitor_list_col,
				 gridCss : "um-grid-style",
				 hideSearch : true,
				 paginator : false
			});

			el.find("[id=chevron-right]").click(function (){
				var data = g_grid.getData(left_table ,{chk:true});
				g_grid.removeData(left_table);
				g_grid.addData(right_table ,data);
			});

			el.find("[id=chevron-left]").click(function (){
				var data = g_grid.getData(right_table ,{chk:true});
				g_grid.removeData(right_table);
				g_grid.addData(left_table ,data);
			});
		}

		function initAfter(el)
		{
			um_ajax_get({
				url : "deviceMonitor/getMonitorTypeList",
				maskObj : el,
				successCallBack : function (data){
					console.log(data)
					$("[data-id=monitorClass]").html("");
					$("[data-id=monitorClass]").append('<option value="-1">-----</option>');
					for(var i=0;i<data.length;i++){
						$("[data-id=monitorClass]").append('<option value="'+data[i].codevalue+'">'+data[i].codename+'</option>');
					}
					$("[data-id=monitorClass]").trigger("change");
					var left_table = el.find("[id=left_table]");
					var right_table = el.find("[id=right_table]");
					$("[data-id=monitorClass]").change(function (){
						g_grid.render(left_table,{
							url:form_wait_monitor_list_url,
							header:form_wait_monitor_list_col,
							paramObj : {monitorTypeId : $("[data-id=monitorClass]").val()},
							gridCss : "um-grid-style",
							hideSearch : true,
							paginator : false
						});
					});
				}
			})
		}

		function save_click(el,saveObj)
		{
			var save_url = "Report/getReport";

			if (!g_validate.validate(el))
			{
				return false;
			}
			if(g_grid.getData(el.find("[id=right_table]")).length==0){
				g_dialog.operateAlert(el,"请至少选择一条记录","error");
				return false;
			}

			var right_table = el.find("[id=right_table]");
			var userIdArray = [];
			var data = g_grid.getData(right_table);
			for (var i = 0; i < data.length; i++) {
				userIdArray.push(data[i].codevalue);
			}
			userIdArray = userIdArray.join(",");
			var monitorTypeList = "";
			monitorTypeList += "1' and  ( ";
			monitorTypeList += " e.monitor_type IN ";
			monitorTypeList += userIdArray[0];
			monitorTypeList += " ) and '1";
			saveObj.mointorTypeList = monitorTypeList;
			saveObj.flag = $(aEl).closest("a").prop("id");
			current_flag = saveObj.flag;
			current_para = saveObj.para;
			um_ajax_post({
				url : save_url,
				paramObj : { "para" : saveObj , flag : saveObj.flag },
				maskObj : el,
				successCallBack : reportSuccessCallBack
			});
		}	
	}

});
});