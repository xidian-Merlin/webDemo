$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/timepicker/timepicker.js',
		 '/js/plugin/tab/tab.js',
		 '/js/plugin/plot/plot.js'] ,function (inputdrop ,timepicker ,tab ,plot){

	var sec_event_list = "data/tablegrid.json"

	event_init();

	sec_event_analy_list(null ,true);

	function event_init()
	{
		$("#query_btn").click(function (){
			$.ajax({
				type: "GET",
				url: "module/event_analy/sec_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=query_template]"),{
						width:"830px",
						height:"600px",
						init:init,
						saveclick:save
					});
				}
			});
			function init (el){
				el.find("[data-type=sel]").select2({
		            		width : "100%",
		            		placeholder: "Select a state"
		            	});
			}

			function save(){
				
			}
		});
	}

	function sec_event_analy_list ()
	{
			g_grid.render($("#table_div"),{
			header:[
					  {text:'事件名称',name:"eventName" ,width:10},
					  {text:'事件类型',name:"kindName"},
					  {text:'事件等级',name:"levelId"},
					  {text:'源IP',name:"srcIp" ,width:12},
					  {text:'源端口',name:"srcPort"},
					  {text:'源IP资产名称',name:"srcEdName"},
					  {text:'目的IP',name:"dstIp" ,width:12},
					  {text:'目的端口',name:"dstPort"},
					  {text:'目的IP资产名称',name:"destEdName"},
					  {text:'聚合数量',name:"eventCount"},
					  {text:'发生源设备类型',name:"fromDeviceType"}
					 ],
			url:sec_event_list,//"securityWatchEvent/querySecurityEventList"
			server:"/",
			allowCheckBox : true,
			dbClick : function (rowData){
				sec_event_record_dbclick(rowData);
			}
		});
	}

	function sec_event_record_dbclick(rowData){
		$.ajax({
			type: "GET",
			url: "module/event_analy/sec_event_analy_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=sec_event_detail_template]"),{
					width:"800px",
					height:"600px",
					init:init,
					saveclick:save
				});

				function init(el){
					tab.tab($("#tab") ,{
						oper : [tab1_click ,tab2_click ,tab3_click]
					});

					function tab1_click(){
						um_ajax_post({
							url : index_web_app + "securityWatchEvent/querySecurityEventDetail",
							paramObj : {eventId : rowData.eventId},
							successCallBack : function (data){
								el.find("[id=form1]").umDataBind("render" ,data);
							}
						});
					}

					function tab2_click(){
						g_grid.render(el.find("[id=ori_alarm_log_table_div]"),{
							header:[
									  {text:'日志描述',name:"logDesc" ,width:80},
									  {text:'发生时间',name:"startDate" ,width:20}
									 ],
							paginator : false,
							url : index_web_app + "securityWatchEvent/queryLogger",
							paramObj : {eventId:rowData.eventId ,fromIp:rowData.fromIp},
							allowCheckBox:false
						});
					}

					function tab3_click(){
						um_ajax_post({
							url : index_web_app + "securityWatchEvent/queryDataMap",
							paramObj : {eventId : rowData.eventId},
							successCallBack : function (data){
								var jsonObj = JsonTools.decode(data.jsonStr);
								var chart_data = jsonObj.datas;
								for (var i=0;i<chart_data.length;i++)
								{
									chart_data[i].data = chart_data[i].value;
									chart_data[i].label = chart_data[i].lable;
								}
								plot.render($("#alarm_sample_analy_chart_div") ,{
									data : chart_data
								});

								g_grid.render(el.find("[id=alarm_sample_analy_table_div]"),{
									header:[
											  {text:'样本名称',name:"pattenName" ,width:30},
											  {text:'原始日志',name:"message" ,width:30},
											  {text:'设备事件描述',name:"alarmDevDesc" ,width:40}
											 ],
									data:data.resultList,
									paginator : false,
									allowCheckBox:false
								});

							}
						});

						
					}
				}

				function save(){

				}
			}
		});
	}

});
});