$(document).ready(function (){
require(['/js/plugin/timepicker/timepicker.js'] ,function (){

	var health_status_url = "monitorSystem/queryMonitorTimerStatus";
	var health_monitorinfo_url = "monitorSystem/queryMonitorInfo";
	var health_eventinfo_url = "monitorSystem/queryEventInfo";
	view_init();
	healthstatus();
	healthmonitorinfo();
	healtheventinfo();
	/**
	 * 设备运行状态-红绿灰条
	 */
	function healthstatus()
	{
		um_ajax_get({
	        url : health_status_url,
	        maskObj : $("#table_div_X"),
	        successCallBack : function (data){
	            $("#scale_list").height(data.length * 60);
	            $("#scale_list").html("");
	            {
	                var el = $('<div class="scale" style="padding-top:10px;"></div>');
	                $("#scale_list").append(el);
	                g_monitor.monitorStatusChart(el ,{
	                    time : $("#query_time_label").text(),
	                    data : data.status,
	                    name : "系统运行状况"
	                });
	            }
	            
	            g_dialog.waitingAlertHide();
	        }
	    });
	}
	function healthmonitorinfo()
	{
		um_ajax_get({
	        url : health_monitorinfo_url,
	        isLoad : false,
	        successCallBack : function (data)
	        {
	        	//健康度：1台应用服务器，2台数据采集服务器，系统运行良好。
//	        	var appTextTip = "";
//	        	var appTextTip_n = "";
//	        	if(data.appServerAvailableNum > 0)
//	        	{
//	        		appTextTip = data.appServerAvailableNum+"台应用服务器";
//	        	}
//	        	if(data.appServerNotAvailableNum > 0)
//	        	{
//	        		appTextTip_n = data.appServerNotAvailableNum+"台应用服务器";
//	        	}
//	        	var agentTextTip = "";
//	        	var agentTextTip_n = "";
//	        	if(data.agentServerAvailableNum > 0)
//	        	{
//	        		agentTextTip = data.agentServerAvailableNum+"台数据采集服务器";
//	        	}
//	        	if(data.agentServerNotAvailableNum > 0)
//	        	{
//	        		agentTextTip_n = data.agentServerNotAvailableNum+"台数据采集服务器";
//	        	}
//	        	
//
//	        	var appText = "系统运行良好";
//	        	var appText_n = "系统运行出错";
	        	
	        	
//	        	var text1 = appTextTip+"，"+agentTextTip+"，"+appText;
//	        	var text2 = appTextTip_n+"，"+agentTextTip_n+"，"+appText_n;
//	        	var title = "健康度：";
//	        	
//	        	if(text2=="，，"+appText_n && text1 != "，，"+appText)
//	        	{
//	        		$("div[id='healthDivTxt']").html(title+text1+"。");
//	        	}
//	        	else if(text2!="，，"+appText_n && text1 != "，，"+appText)
//	        	{
//	        		$("div[id='healthDivTxt']").html(title+text1+"，"+text2+"。");
//	        	}
//	        	else if(text2!="，，"+appText_n && text1 == "，，"+appText)
//	        	{
//	        		$("div[id='healthDivTxt']").html(title+text2+"。");
//	        	}
	        	//共计?台应用服务器，?台出现异常；共计?台数据采集服务器，?台出现异常。
	        	var text = "共计"+(data.appServerAvailableNum+data.appServerNotAvailableNum)+"台应用服务器，" +
	        					data.appServerNotAvailableNum+"台出现异常；" +
	        						"共计"+(data.agentServerAvailableNum+data.agentServerNotAvailableNum)+"台数据采集服务器，" +
	        								data.agentServerNotAvailableNum+"台出现异常。";
	        	$("div[id='healthDivTxt']").html("健康度："+text);
	        }
	    });
	}
	function healtheventinfo()
	{
		um_ajax_get({
	        url : health_eventinfo_url,
	        isLoad : false,
	        successCallBack : function (data)
	        {
	        	$("#hyh_eventinfo").find("#logTCnt").text(data.logTCnt);
	        	$("#hyh_eventinfo").find("#logCnt").text(data.logCnt);
	        	$("#hyh_eventinfo").find("#alarmEventCnt").text(data.alarmEventCnt);
	        	$("#hyh_eventinfo").find("#securityEventCnt").text(data.securityEventCnt);
	        }
	    });
	}
	function view_init()
	{
		$(".form_datetime").datetimepicker({
				language: 'fr',
			    autoclose: true,
			    todayBtn: true,
			    startView : 2,
				minView : 1,
				format : "yyyy-mm-dd hh:00:00",
			    pickerPosition: "bottom-left"
		}).on("changeDate" ,function (ev){
			monitor_total_info();
			$("#query_time_label").text(g_moment(ev.date).subtract(8 ,"hour").format("YYYY-MM-DD HH:00:00"));
			index_monitor_init();
		})
		$("#query_time_label").text(g_moment().format("YYYY-MM-DD HH:mm:ss"));
	}

});
});