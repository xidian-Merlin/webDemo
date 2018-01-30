$(document).ready(function (){
require(['/js/plugin/ABPanel/abPanel.js',
		'/js/plugin/plot/plot.js',
		'/js/plugin/drag/drag.js'] ,function (abPanel ,plot ,drag){

	$("#setting_div").html($("#view_setting_div"));

	$("#content_div").addClass("appbgf");

	event_init();

	var oper_index_map =  new HashMap();
	oper_index_map.put("H3C" ,"华三网络设备|huasan_network_device|H3C");
	oper_index_map.put("NET_DEVICE_PERFORM_EVENT" ,"网络设备性能事件统计|network_device_perform_event|NET_DEVICE_PERFORM_EVENT");
	oper_index_map.put("WINDOWS" ,"Windows|Windows|WINDOWS");
	oper_index_map.put("LINUX" ,"Linux|Linux|LINUX");
	oper_index_map.put("NE_CISCO" ,"思科网络设备|sike_network_device|NE_CISCO");
	oper_index_map.put("NE_HUAWEI" ,"华为网络设备|huawei_network_device|NE_HUAWEI");
	oper_index_map.put("NETEYE_FIREWALL" ,"东软防火墙|dongruan_firewall|NETEYE_FIREWALL");
	oper_index_map.put("AIX" ,"AIX|AIX|AIX");
	oper_index_map.put("NET_DEVICE_INTERFACE_FLOW" ,"网络设备接口流量统计|NDIS_flow_statistics|NET_DEVICE_INTERFACE_FLOW");
	oper_index_map.put("AIX_HA" ,"AIX双机热备|AIX_double_hot_standby|AIX_HA");
	oper_index_map.put("NET_DEVICE_FAULT_EVENT" ,"网络设备故障事件统计|network_device_fault_event|NET_DEVICE_FAULT_EVENT");
	oper_index_map.put("devicePerFaulNum" ,"设备性能故障告警统计|device_perform_fault_alarm_statistics|devicePerFaulNum");
	oper_index_map.put("FAULT_MONITOR" ,"故障监控器|fault_monitor|FAULT_MONITOR");
	oper_index_map.put("ZTE" ,"中兴网络设备|zhongxing_network_device|ZTE");
	oper_index_map.put("TOMCAT_HA" ,"Tomcat双机热备|Tomcat_double_hot_standby|TOMCAT_HA");
	oper_index_map.put("DB2_HA" ,"DB2双机热备|DB2_double_hot_standby|DB2_HA");
	oper_index_map.put("WEBSPHERE_HA" ,"Websphere双机热备|Websphere_double_hot_standby|WEBSPHERE_HA");
	oper_index_map.put("WINDOWS_HA" ,"Windows双机热备|Windows_double_hot_standby|WINDOWS_HA");
	oper_index_map.put("DPTECH_FW" ,"迪普防火墙|dipu_firewall|DPTECH_FW");
	oper_index_map.put("SECWORLD" ,"网御神州安全设备|wangyushenzhou_sec_device|SECWORLD");
	oper_index_map.put("COMMON_URL" ,"HTTP|HTTP|COMMON_URL");	
	oper_index_map.put("URLEXEC" ,"Enhance URL|Enhance_URL|URLEXEC");

	var current_oper_index_data;

	// 查询用户自定义模板
	custom_template_get();

	function event_init(){
		// 视图radio 点击事件
		$("[name=a]").click(function (){
			//g_dialog.waitingAlert($("#pg-container"));
		});

		$("#view_setting_i").click(function (){
			g_dialog.dialog($("#abPanel_tem").html(),{
				width:"800px",
				initAfter:initAfter,
				title:"KPI指标展示",
				saveclick:save_click
			});

			function initAfter(el)
			{
				um_ajax_get({
					url : "Kpi/getKpiPodConfig",
					maskObj : el,
					successCallBack : function (data){
						var dataArray = data;
						current_oper_index_data = data;
						var left_data = [];
						var right_data = [];

						for (var i = 0; i < current_oper_index_data.length; i++) {
							if (oper_index_map.get(current_oper_index_data[i].monitorType))
							{
								var tmp = oper_index_map.get(current_oper_index_data[i].monitorType);
								if (current_oper_index_data[i].showStatus == 0){
									left_data.push({text:tmp.split("|")[0] ,value:tmp});
								}
								else{
									right_data.push({text:tmp.split("|")[0] ,value:tmp});
								}
							}
						}

						abPanel.render(el.find("[id=abPanel]") ,{
							left_data:left_data,
							right_data:right_data
						});
					}
				})				
			}

			function save_click(el){
				var dataArray = abPanel.getValue(el.find("[id=abPanel]"));
				var idArray = [];
				var fnArray = [];
				for (var i = 0; i < dataArray.length; i++) {
					idArray.push(dataArray[i].split("|")[2]);
					fnArray.push(dataArray[i].split("|")[1] + "|" + dataArray[i].split("|")[2]);
				}
				if (dataArray.length < 2)
				{
					g_dialog.dialogTip(el ,{
						msg : "请至少选择两个展示项"
					});
					return false;
				}
				um_ajax_get({
					url : "Kpi/updKpiPodConfig",
					paramObj : {podId:idArray.join(",")},
					maskObj : el,
					successCallBack : function(data){
						g_dialog.hide(el);
						panel_render(fnArray ,idArray);
					}
				});
			}
		});

		$("#panel-list").delegate('[class*=icon-remove]', 'click', function() {
			$(this).closest("[data-id=panel]").animate({opacity: 0},
					300, function() {
					$(this).remove();
					resize();
			});

			function resize()
			{
				var col = panel_col_get($("[data-id=panel]").size());
				$("[data-id=panel]").each(function (){
					$(this).attr("class" ,"col-md-"+col+" pr5 pl5");
				});
			}			
		});

		$("#view_save_i").click(function (){
			var podIdArray = [];
			$("[data-podid]").each(function (){
				podIdArray.push($(this).attr("data-podid"));
			});
			um_ajax_get({
				url : "Kpi/updKpiPodConfig",
				paramObj : {podId:podIdArray.join(",")},
				successCallBack : function(data){
					g_dialog.operateAlert();
				}
			});
		});

	}

	function panel_render(panelIdArray ,podIdArray)
	{
		$("#panel-list").empty();
	    var tmp = '<div class="col-md-4 pr5 pl5" data-id="panel">'
				    +'<div class="panel panel-default panel-sel panel-style grid-drable-div prel" style="height:330px">'
				    + '<div class="panel-heading font-bold prel grid-drable-head">'
				    +   '<span data-id="panel_title" class="abpanel-head"></span>'
				    +  '<div class="pabs" style="right:10px;top:10px">'
				    +     '<i class="icon-remove icon-animate f14"></i>'
				    +  '</div>'
				    + '</div>'
				    +  '<div data-id="panel-body" class="panel-body p1" style="height: 292px;padding: 10px">'
				    +   '<div class="prel" style="height: 100%;" data-id="panel-content"></div>'
				    + '</div>'
				    + '</div>'
				    + '</div>';
		var buffer = [];
		var title;
		var el;
		var col = panel_col_get(panelIdArray.length);
		var id;
		for (var i=0;i<panelIdArray.length;i++)
		{
			fn = panelIdArray[i].split("|")[0];
			el = $(tmp).clone();
			el.attr("class" ,"col-md-"+col+" pr5 pl5");
			id = panelIdArray[i].split("|")[1];
			el.attr("id" ,id);
			el.children().attr("data-podId" ,podIdArray[i]);
			$("#panel-list").append(el);
			if (panelIdArray.length == 1 || panelIdArray.length == 2)
			{
				el.height($("#content_div").height());
				el.children().eq(0).height($("#content_div").height()-12);
				el.find("[data-id=panel-body]").height($("#content_div").height()-85)
			}
			eval(fn + '("'+id+'")');
		}
		drag.drag();		
	}

	function panel_col_get(panelNum){
		var col = 0;
		switch (panelNum)
		{
			case 1 :
				col = 12;
				break;
			default :
				col = 6;
		}
		return col;
	}

	function custom_template_get(){
		um_ajax_get({
			url : "Kpi/getKpiPodConfig",
			successCallBack : function (data){
				var dataArray = data;
				current_oper_index_data = data;
				var fnArray = [];
				var podIdArray = [];
				for (var i = 0; i < dataArray.length; i++) {
					if (oper_index_map.get(dataArray[i].monitorType)
						&& dataArray[i].showStatus == "1")
					{
						fnArray.push(oper_index_map.get(dataArray[i].monitorType).split("|")[1]
										+"|"+ oper_index_map.get(dataArray[i].monitorType).split("|")[2]);
						podIdArray.push(dataArray[i].monitorType);
					}
				}
				panel_render(fnArray ,podIdArray);
			}
		})
	}

// -------------------------------------------------------------------------------

	/** 
		华三网络设备
	*/
	function huasan_network_device(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("华三网络设备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,huasan_network_device);
			monitor_abPanel_render(el ,huasan_network_device);
		}
		
		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		Linux
	*/
	function Linux(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Linux"); 
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Linux);
			monitor_abPanel_render(el ,Linux);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		Windows
	*/
	function Windows(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Windows");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Windows);
			monitor_abPanel_render(el ,Windows);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		AIX
	*/
	function AIX(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("AIX");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,AIX);
			monitor_abPanel_render(el ,AIX);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		思科网络设备
	*/
	function sike_network_device(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("思科网络设备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,sike_network_device);
			monitor_abPanel_render(el ,sike_network_device);
		}
		
		var el_table = el.find("[class*=table_div]");

		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		华为网络设备
	*/
	function huawei_network_device(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("华为网络设备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,huawei_network_device);
			monitor_abPanel_render(el ,huawei_network_device);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		中兴网络设备
	*/
	function zhongxing_network_device(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("中兴网络设备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,zhongxing_network_device);
			monitor_abPanel_render(el ,zhongxing_network_device);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		网御神州安全设备
	*/
	function wangyushenzhou_sec_device(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("网御神州安全设备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,wangyushenzhou_sec_device);
			monitor_abPanel_render(el ,wangyushenzhou_sec_device);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		东软防火墙
	*/
	function dongruan_firewall(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("东软防火墙");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,dongruan_firewall);
			monitor_abPanel_render(el ,dongruan_firewall);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		迪普防火墙
	*/
	function dipu_firewall(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("迪普防火墙");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,dipu_firewall);
			monitor_abPanel_render(el ,dipu_firewall);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		AIX双机热备
	*/
	function AIX_double_hot_standby(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("AIX双机热备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,AIX_double_hot_standby);
			monitor_abPanel_render(el ,AIX_double_hot_standby);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		Tomcat双机热备
	*/
	function Tomcat_double_hot_standby(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Tomcat双机热备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Tomcat_double_hot_standby);
			monitor_abPanel_render(el ,Tomcat_double_hot_standby);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		DB2双机热备
	*/
	function DB2_double_hot_standby(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("DB2双机热备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,DB2_double_hot_standby);
			monitor_abPanel_render(el ,DB2_double_hot_standby);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		Websphere双机热备
	*/
	function Websphere_double_hot_standby(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Websphere双机热备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Websphere_double_hot_standby);
			monitor_abPanel_render(el ,Websphere_double_hot_standby);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		Windows双机热备
	*/
	function Windows_double_hot_standby(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Windows双机热备");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Windows_double_hot_standby);
			monitor_abPanel_render(el ,Windows_double_hot_standby);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		故障监控器
	*/
	function fault_monitor(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("故障监控器");

		var header = [
						{text:"状态",name:"monitorDstatus",render:function(text){
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
						},width:15},
						{text:"监控器名称",name:"monitorName",width:25},
						{text:"监控器类型",name:"monitorTypeName",width:20},
						{text:"事件描述",name:"faultEventModule",tip:true,render:function (txt){
							if (!txt)
							{
								return "------";
							}
							else if (txt && txt.length > 10)
							{
								txt = txt.substr(0,12) + "...";
							}
							return '<span style="opacity:0.6">'+txt+'</span>';
						},width:40}
					 ];
		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
		g_grid.render(el_table ,{
			url:"Kpi/getKpiPodData",
			paramObj:{monitorType:elId ,flag:el.find("select").val()},
			header:header,
			paginator:false,
			allowCheckBox:false,
			hideSearch:true,
			hasBorder : false,
			gridCss:"um-grid-style",
			dbIndex:1,
			dbClick:function (rowData){
					var monitorTypeId = rowData.monitorTypeId;
					if (rowData.version == "LINUX_SNMP")
					{
						monitorTypeId = "LINUX_SNMP";
					}
					var url = "#/monitor_info/monitor_obj/monitor_info?monitorTypeId="
												+monitorTypeId+"&monitorId="+rowData.monitorId+"&monitorName="+rowData.monitorName+"&regionId="+(rowData.regionId==null?"":rowData.regionId)
												+"&assetId="+rowData.asertId+"&hideMenu=1&queryByMonitor=1";
					url = encodeURI(url);
				    url = encodeURI(url);
					window.open(url);
				}
		});
	}

	/** 
		HTTP
	*/
	function HTTP(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("HTTP");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,HTTP);
			monitor_abPanel_render(el ,HTTP);
		}

		var el_table = el.find("[class*=table_div]");

		var header = [
						{text:"状态",name:"monitorDstatus",render:function(text){
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
						}},
						{text:"监控器名称",name:"monitorName"},
						{text:"页面大小",name:"urlPageSize", render : function(text){
							if(text != null){
								return text+"Byte";
							}						
						}},
						{text:"响应时间",name:"responseTime", render : function(text){
							if(text != null){
								return text+"ms";
							}						
						}}
					 ];

		kpi_pod_data(el ,elId ,el_table ,header);
	}

	/** 
		Enhance URL
	*/
	function Enhance_URL(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("Enhance URL");
			el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
			nowToMonthRender(el ,Enhance_URL);
			monitor_abPanel_render(el ,Enhance_URL);
		}

		var el_table = el.find("[class*=table_div]");
		kpi_pod_data(el ,elId ,el_table);
	}

	/** 
		网络设备性能事件统计
	*/
	function network_device_perform_event(elId ,selFlag){
		var el = $("#" + elId);

		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("网络设备性能事件统计");
			dayToMonthRender_data(el ,network_device_perform_event);
			monitor_abPanel_render(el ,network_device_perform_event);
		}

		var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

		um_ajax_get({
			url : "Kpi/queryKpiMonitorPodConfig",
			paramObj : {monitorType : elId},
			successCallBack : function (data){
				var right_data = [];
				for (var i = 0; i < data.length; i++)
				{
					if (data[i].isDisplay == "1")
					{
						right_data.push(data[i].monitorId);
					}
				}
				um_ajax_get({
					url : "Kpi/queryPerfColumn",
					paramObj : {flag:el.find("select").val() ,monitorId:right_data.join(",")},
					maskObj : el.find("[class*=panel-style]"),
					successCallBack : function (data){
						var seriesArray = [];
						var seriesObj = new Object();
						seriesObj.name = "值";
						seriesObj.type = "bar";
						seriesObj.data = [];
						seriesObj.itemStyle = new Object();
						seriesObj.itemStyle.normal = new Object();
						seriesObj.itemStyle.normal.color = color_array[0];
						var categoryArray = [];
						for (var i = 0; i < data.length; i++) {
							seriesObj.data.push(data[i].faultEventCount);
							categoryArray.push(data[i].monitorId + "|" + data[i].monitorName);
						}
						seriesArray.push(seriesObj);
						plot.barRender(el.find("[data-id=panel-content]") ,{
							category : categoryArray,
							series : seriesArray,
							isVercital : true,
							xFormater : function (value){
								if (!value)
								{
									return "";
								}
								var val = value.split("|")[1].length > 5 
															   ? value.split("|")[1].substr(0,5) + "..."
															   : value.split("|")[1];
								return val;
							},
							tipFormater : function (params, ticket, callback) {
							     return params[0].name.split("|")[1];
							},
							click : function(param)
							{
								g_dialog.dialog('<div id="chart_div" style="height:360px"></div>',{
									width:"650px",
									title:"网络设备趋势图信息",
									initAfter:initAfter,
									idDetail:true
								});
								function initAfter(aEl){
									var monitorId = param.name.split("|")[0];
									var timeFlag = el.find("select").val();
									lineType = "fault";
									children_line_get(aEl.find("[id=chart_div]") ,monitorId ,timeFlag ,lineType);
								}
							}		
						});
					}
				});

			}
		});
	}

	/** 
		网络设备故障事件统计
	*/
	function network_device_fault_event(elId ,selFlag){
		var el = $("#" + elId);

		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("网络设备故障事件统计");
			dayToMonthRender_data(el ,network_device_fault_event);
			monitor_abPanel_render(el ,network_device_fault_event);
		}

		var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

		um_ajax_get({
			url : "Kpi/queryKpiMonitorPodConfig",
			paramObj : {monitorType : elId},
			successCallBack : function (data){
				var right_data = [];
				for (var i = 0; i < data.length; i++)
				{
					if (data[i].isDisplay == "1")
					{
						right_data.push(data[i].monitorId);
					}
				}
				um_ajax_get({
					url : "Kpi/queryFaultColumn",
					paramObj : {flag:el.find("select").val() ,monitorId:right_data.join(",")},
					maskObj : el.find("[class*=panel-style]"),
					successCallBack : function (data){
						var seriesArray = [];
						var seriesObj = new Object();
						seriesObj.name = "值";
						seriesObj.type = "bar";
						seriesObj.data = [];
						seriesObj.itemStyle = new Object();
						seriesObj.itemStyle.normal = new Object();
						seriesObj.itemStyle.normal.color = color_array[0];
						var categoryArray = [];
						for (var i = 0; i < data.length; i++) {
							seriesObj.data.push(data[i].faultEventCount);
							categoryArray.push(data[i].monitorId + "|" + data[i].monitorName);
						}
						seriesArray.push(seriesObj);
						plot.barRender(el.find("[data-id=panel-content]") ,{
							category : categoryArray,
							series : seriesArray,
							isVercital : true,
							xFormater : function (value){
								if (!value)
								{
									return "";
								}
								var val = value.split("|")[1].length > 5 
															   ? value.split("|")[1].substr(0,5) + "..."
															   : value.split("|")[1];
								return val;
							},
							tipFormater : function (params, ticket, callback) {
							     return params[0].name.split("|")[1];
							},
							click : function(param)
							{
								g_dialog.dialog('<div id="chart_div" style="height:360px"></div>',
								{
									width:"650px",
									title:"网络设备趋势图信息",
									initAfter:initAfter,
									idDetail:true
								});
								function initAfter(aEl){
									var monitorId = param.name.split("|")[0];
									var timeFlag = el.find("select").val();
									lineType = "fault";
									children_line_get(aEl.find("[id=chart_div]") ,monitorId ,timeFlag ,lineType);
								}
							}		
						});
					}
				});

			}
		});
	}

	/** 
		网络设备接口流量统计
	*/	
	function NDIS_flow_statistics(elId ,selFlag)
	{
		var el = $("#" + elId);

		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("网络设备接口流量统计");
			dayToMonthRender_data(el ,NDIS_flow_statistics);
			monitor_abPanel_render(el ,NDIS_flow_statistics);
		}

		var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

		um_ajax_get({
			url : "Kpi/queryKpiMonitorPodConfig",
			paramObj : {monitorType : elId},
			successCallBack : function (data){
				var right_data = [];
				for (var i = 0; i < data.length; i++)
				{
					if (data[i].isDisplay == "1")
					{
						right_data.push(data[i].monitorId);
					}
				}
				um_ajax_get({
					url : "Kpi/queryInterfaceColumn",
					paramObj : {flag:el.find("select").val() ,monitorId:right_data.join(",")},
					maskObj : el.find("[class*=panel-style]"),
					successCallBack : function (data){
						var seriesArray = [];
						var seriesObj = new Object();
						seriesObj.name = "值";
						seriesObj.type = "bar";
						seriesObj.data = [];
						seriesObj.itemStyle = new Object();
						seriesObj.itemStyle.normal = new Object();
						seriesObj.itemStyle.normal.color = color_array[0];
						var categoryArray = [];
						for (var i = 0; i < data.length; i++) {
							seriesObj.data.push(Number(data[i].faultEventCount));
							categoryArray.push(data[i].monitorId + "|" + data[i].monitorName);
						}
						seriesArray.push(seriesObj);
						plot.barRender(el.find("[data-id=panel-content]") ,{
							category : categoryArray,
							series : seriesArray,
							isVercital : true,
							xFormater : function (value){
								if (!value)
								{
									return "";
								}
								var val = value.split("|")[1].length > 5 
															   ? value.split("|")[1].substr(0,5) + "..."
															   : value.split("|")[1];
								return val;
							},
							tipFormater : function (params, ticket, callback) {
							     //return params[0].name.split("|")[1];
							     if (!params[0].name)
							     {
							     	return "";
							     }
							     else if (!params[0].value)
							     {
							     	return params[0].name.split("|")[1];
							     }
							     else
							     {
							     	return params[0].name.split("|")[1] + " : " +params[0].value + "MB";
							     }
							},
							click : function(param)
							{
								g_dialog.dialog('<div id="chart_div" style="height:360px"></div>',
								{
									width:"650px",
									title:"网络设备趋势图信息",
									initAfter:initAfter,
									idDetail:true
								});
								function initAfter(aEl){
									var monitorId = param.name.split("|")[0];
									var timeFlag = el.find("select").val();
									lineType = "interface";
									children_line_get(aEl.find("[id=chart_div]") ,monitorId ,timeFlag ,lineType);
								}
							}		
						});

					}
				});

			}
		});
	}

	/** 
		设备性能故障告警统计
	*/	
	function device_perform_fault_alarm_statistics(elId ,selFlag){
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("设备性能故障告警统计");
			dayToMonthRender(el ,device_perform_fault_alarm_statistics);
		}
		var color_array = ['#e84c3d', '#ffb607', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "AssetOverview/getFaultPerfCount",
			paramObj : {flag:el.find("select").val()},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var data = data.datas;
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "故障";
				seriesObj.type = "bar";
				seriesObj.data = [];
				seriesObj.itemStyle = new Object();
				seriesObj.itemStyle.normal = new Object();
				seriesObj.itemStyle.normal.color = color_array[0];
				var seriesObj1 = new Object();
				seriesObj1.name = "性能";
				seriesObj1.type = "bar";
				seriesObj1.data = [];
				seriesObj1.itemStyle = new Object();
				seriesObj1.itemStyle.normal = new Object();
				seriesObj1.itemStyle.normal.color = color_array[1];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					seriesObj.data.push(data[i].value1);
					seriesObj1.data.push(data[i].value2);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				seriesArray.push(seriesObj1);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					category : categoryArray,
					series : seriesArray,
					isVercital : true,
					legend:["故障" ,"性能"],
					barFreeWidth : true
				});
			}
		});
	}

	//-------------- util -----------------
	function nowToMonthRender(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:70px;top:8px;font-weight:normal;"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="0">当前状态</option>');
		sel.append('<option value="1">最近一天</option>');
		sel.append('<option value="2">最近一周</option>');
		sel.append('<option value="3">最近一月</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	function dayToMonthRender(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:70px;top:10px"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="4">最近一天</option>');
		sel.append('<option value="5">最近一周</option>');
		sel.append('<option value="6">最近一月</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	function dayToMonthRender_data(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:70px;top:10px"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="1">最近一天</option>');
		sel.append('<option value="2">最近一周</option>');
		sel.append('<option value="3">最近一月</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	function dayToMonthRender_detail(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:70px;top:10px"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="1">最近一天</option>');
		sel.append('<option value="7">最近一周</option>');
		sel.append('<option value="30">最近一月</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	function monitor_abPanel_render (aEl ,fn)
	{
		aEl.children().append('<div class="pabs" style="right:40px;top:14px"><i data-type="icon" class="icon-gear icon-animate r f14"></i></div>')
		aEl.find("[data-type=icon]").click(function (){

			g_dialog.dialog($("#abPanel_tem").html(),{
				width:"800px",
				height:"430px",
				title:"监控器配置展示",
				initAfter:initAfter,
				saveclick:save_click
			});

			function initAfter(el)
			{

				um_ajax_get({
					url : "Kpi/queryKpiMonitorPodConfig",
					paramObj : {monitorType : aEl.attr("id")},
					successCallBack : function (data){
						var left_data = [];
						var right_data = [];
						for (var i = 0; i < data.length; i++) {
							if (data[i].isDisplay == "0")
							{
								left_data.push({text:data[i].monitorName ,value:data[i].monitorId});
							}
							else
							{
								right_data.push({text:data[i].monitorName ,value:data[i].monitorId});
							}
						}
						abPanel.render(el.find("[id=abPanel]") ,{
							left_data:left_data,
							right_data:right_data
						});
					}
				});
			
			}

			function save_click(el){
				var dataArray = abPanel.getValue(el.find("[id=abPanel]"));
				if (dataArray.length == 0)
				{
					g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
					return false;
				}
				um_ajax_post({
					url : "Kpi/updKpiMonitorPodConfig",
					paramObj : {monitorType : aEl.attr("id") ,monitorId : dataArray.join(",")},
					maskObj : el,
					successCallBack : function (data){
						g_dialog.hide(el);
						fn(aEl.attr("id") ,true);
					}
				});
			}
			
		});
	}

	function kpi_monitor_pod_config_get(elId ,cbf)
	{
		um_ajax_get({
			url : "Kpi/queryKpiMonitorPodConfig",
			paramObj : {monitorType : elId},
			successCallBack : function (data){
				var right_data = [];
				for (var i = 0; i < data.length; i++)
				{
					if (data[i].isDisplay == "1")
					{
						right_data.push(data[i].monitorId);
					}
				}
				cbf(right_data.join(","));
			}
		});
	}

	function kpi_pod_data(el ,elId ,el_table ,custom_head)
	{

		var header = [
						{text:"状态",name:"monitorDstatus",render:function(text){
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
						}},
						{text:"监控器名称",name:"monitorName"},
						{text:"CPU",name:"cpuUsage", render : function(text){
							if(text != null){
								return text+"%";
							}						
						}},
						{text:"内存",name:"memoryUsage", render : function(text){
							if(text != null){
								return text+"%";
							}						
						}}
					 ];
		custom_head && (header = custom_head);

		kpi_monitor_pod_config_get(elId ,function (idStr){
			g_grid.render(el_table ,{
				url:"Kpi/getKpiPodData",
				paramObj:{monitorType:elId ,flag:el.find("select").val() ,monitorId:idStr},
				header:header,
				paginator:false,
				allowCheckBox:false,
				hideSearch:true,
				hasBorder : false,
				gridCss:"um-grid-style",
				dbIndex : 1,
				dbClick:function (rowData){
					var monitorTypeId = rowData.monitorTypeId;
					if (rowData.version == "LINUX_SNMP")
					{
						monitorTypeId = "LINUX_SNMP";
					}
					var url = "#/monitor_info/monitor_obj/monitor_info?monitorTypeId="
												+monitorTypeId+"&monitorId="+rowData.monitorId+"&monitorName="+rowData.monitorName+"&regionId="+(rowData.regionId==null?"":rowData.regionId)
												+"&assetId="+rowData.asertId+"&hideMenu=1&queryByMonitor=1";
					url = encodeURI(url);
				    url = encodeURI(url);
					window.open(url);
				}
			});
		});
	}

	function children_line_get(elChart ,monitorId ,timeFlag ,lineType)
	{
		um_ajax_get({
			url : "Kpi/queryLine",
			paramObj : {monitorId:monitorId ,timeFlag:timeFlag ,lineType:lineType},
			successCallBack : function (data){
				var categoryArray = [];
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "值";
				seriesObj.type = "line";
				seriesObj.data = [];
				for (var i = 0; i < data.length; i++) {
					categoryArray.push(data[i].enterDate);
					seriesObj.data.push(data[i].value);
				}
				seriesArray.push(seriesObj);
				plot.lineRender(elChart ,{
					category : categoryArray,
					series : seriesArray
				});
			}
		});
	}
		

	
});
});