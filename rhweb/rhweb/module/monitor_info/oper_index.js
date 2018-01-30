$(document).ready(function (){
require(['/js/plugin/ABPanel/abPanel.js',
		'/js/plugin/plot/plot.js',
		'/js/plugin/drag/drag.js'] ,function (abPanel ,plot ,drag){

	$("#setting_div").html($("#view_setting_div"));

	$("#content_div").addClass("appbgf");

	event_init();

	var oper_index_map =  new HashMap();
	oper_index_map.put("101" ,"全网当前风险|security_graph");
	oper_index_map.put("111" ,"风险最高的安全域排名|sec_risk_top");
	oper_index_map.put("105" ,"脆弱性最多的资产排名|fragility_asset_top");
	oper_index_map.put("103" ,"最新故障事件|recent_fault_event");
	oper_index_map.put("21004" ,"最新性能事件|recent_perform_event");
	oper_index_map.put("106" ,"最新配置事件|recent_config_event_top");
	oper_index_map.put("107" ,"事件数量趋势|event_quantity_trend");
	oper_index_map.put("110" ,"风险最高的资产排名|risk_asset_top");
	oper_index_map.put("109" ,"全网风险趋势|security_trend");


	oper_index_map.put("21001" ,"监控器状态对比|monitor_fault_distribution");
	oper_index_map.put("21002" ,"监控器类型对比|monitor_fault_class_distribution");
	oper_index_map.put("21003" ,"事件分布|event_type_distribution");

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
				title:"运维首页展示",
				initAfter:initAfter,
				saveclick:save_click
			});

			function initAfter(el)
			{
				um_ajax_get({
					url : "FlexConfig/queryFlexPod",
					maskObj : el,
					successCallBack : function(data){
						var dataArray = data;
						var current_oper_index_data = data;
						var left_data = [];
						var right_data = [];

						for (var i = 0; i < current_oper_index_data.length; i++) {
							if (oper_index_map.get(current_oper_index_data[i].podId))
							{
								var tmp = oper_index_map.get(current_oper_index_data[i].podId);
								if (current_oper_index_data[i].flagStatus == 1){
									left_data.push({text:tmp.split("|")[0] ,value:current_oper_index_data[i].podId + "|" + tmp.split("|")[1]});
								}
								else{
									right_data.push({text:tmp.split("|")[0] ,value:current_oper_index_data[i].podId + "|" + tmp.split("|")[1]});
								}
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
				var idArray = [];
				var fnArray = [];
				for (var i = 0; i < dataArray.length; i++) {
					idArray.push(dataArray[i].split("|")[0]);
					fnArray.push(dataArray[i].split("|")[1]);
				}
				if (dataArray.length < 2)
				{
					g_dialog.dialogTip(el ,{
						msg : "请至少选择两个展示项"
					});
					return false;
				}
				um_ajax_get({
					url : "FlexConfig/updFlexConfig",
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
				url : "FlexConfig/updFlexConfig",
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
				    +'<div class="panel panel-default panel-sel panel-style grid-drable-div" style="height:330px">'
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
			title = panelIdArray[i];
			el = $(tmp).clone();
			el.attr("class" ,"col-md-"+col+" pr5 pl5");
			id = "" + (i+1) + new Date().getTime();
			el.attr("id" ,id);
			el.children().attr("data-podId" ,podIdArray[i]);
			$("#panel-list").append(el);
			if (panelIdArray.length == 1 || panelIdArray.length == 2)
			{
				el.height($("#content_div").height());
				el.children().eq(0).height($("#content_div").height()-12);
				el.find("[data-id=panel-body]").height($("#content_div").height()-85)
			}
			eval(title + "("+id+")");
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
			url : "FlexConfig/queryFlexPod",
			successCallBack : function (data){
				var dataArray = data;
				current_oper_index_data = data;
				var fnArray = [];
				var podIdArray = [];
				for (var i = 0; i < dataArray.length; i++) {
					if (oper_index_map.get(dataArray[i].podId)
						&& dataArray[i].flagStatus == "0"){
						fnArray.push(oper_index_map.get(dataArray[i].podId).split("|")[1]);
						podIdArray.push(dataArray[i].podId);
					}
				}
				panel_render(fnArray ,podIdArray);
			}
		})
	}


// -------------------------------------------------------------------------------

	/** 
		全网风险统计
	*/
	function security_graph(elId)
	{
		var weatherMap = new HashMap();
		weatherMap.put("1" ,"fine");
		weatherMap.put("2" ,"cloudy");
		weatherMap.put("3" ,"overcase");
		weatherMap.put("4" ,"rain");
		weatherMap.put("5" ,"big_rain");
		var el = $("#" + elId);
		el.find("[data-id=panel-body]").css("padding" ,"15px");
		el.find("[data-id=panel_title]").text("全网当前风险");
		g_dialog.waitingAlert(el.find("[class*=panel-style]"));
		$.ajax({
			type: "GET",
			url: "tpl/barometer.html",
			async: false,
			success :function(data)
			{
				el.find('[data-id=panel-content]').append(data);

				um_ajax_get({
					url : "StatisticsData/getAllSecurityGraph",
					paramObj : {},
					isLoad:false,
					//maskObj : el.find("[class*=panel-style]"),
					successCallBack : function (data){
						var para = data.para;
						var paraArray = para.split(",");
						var singleParaArray;
						var weatherId;
						for (var i = 0; i < paraArray.length; i++) {
							singleParaArray = paraArray[i].split("_");
							weatherId = el.find("[data-type=weather]").eq(i).attr("id");
							el.find("[data-type=weather]").eq(i).addClass(weatherMap.get(singleParaArray[0]));
							//plot.skyRender(weatherId ,{color:"#a4cee8" ,skyIcon:weatherMap.get(singleParaArray[0])});
							weatherId = el.find("[data-type=weather]").eq(i).parent().attr("title" ,data["risk"+singleParaArray[0]]);
							weatherId = el.find("[data-type=weather]").eq(i).next().text(singleParaArray[1].substr(5));
							if (i == 0)
							{
								$("#cloudy_des").text(data["risk"+singleParaArray[0]]);
								$("#cloudy_level").text(singleParaArray[0] + "级");
							}
						}

						el.find("[id=cloudy_div]").tooltip();
						el.find("[id=weeks_div]").children().tooltip();
						el.find("[id=weather_div]").show();
						g_dialog.waitingAlertHide(el.find("[class*=panel-style]"));
					}
				});
			}
		});
	}

	/** 
		风险最高的安全域排名
	*/
	function sec_risk_top(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("风险最高的安全域排名");
		
		//var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "StatisticsDataDispaly/getRiskBars",
			paramObj : {type:"sd"},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name="值";
				seriesObj.type="bar";
				seriesObj.data=[];
				//seriesObj.itemStyle = new Object();
				//seriesObj.itemStyle.normal = new Object();
				//seriesObj.itemStyle.normal.color = color_array[0];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					category : categoryArray,
					series : seriesArray,
					isVercital : true,
					color : ['#e74c3c'],
					grid: {
				        left: "3%",
				        right: "4%",
				        top: "6%",
				        bottom: "6%",
				        containLabel: true
				    }
				});
			}
		});	
	}

	/** 
		最新安全事件
	*/
	function recent_sec_event(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("最新安全事件");

		var header = [		
			{text:"事件名称",name:"test"},
			{text:"资产名称",name:"test1"},
			{text:"等级",name:"test1"}
		];

		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
		g_grid.render(el_table ,{
			url:"monitordisply/TechnicalSupervision/getEventList",
			maskObj : el.find("[class*=panel-style]"),
			header:header,
			paginator:false,
			allowCheckBox:false,
			hideSearch:true,
			hasBorder : false,
			gridCss:"um-grid-style"
		});
	}

	/** 
		脆弱性最多的资产排名
	*/
	function fragility_asset_top(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("脆弱性最多的资产排名");

		var header = [
			{text:"资产名称",name:"edName",render:function(txt,data){
				return '<a href="javascript:void(0);" style="color:#3498db;" data-id="'+data.ed_id+'" data-flag="detail" title="点击查看详情"> '+txt+'</a>';
			}},
			{text:"数量",name:"totalNum"}
		];

		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
		g_grid.render(el_table ,{
			url:"StatisticsDataDispaly/getAssetVulList",
			maskObj : el.find("[class*=panel-style]"),
			header:header,
			paginator:false,
			allowCheckBox:false,
			hideSearch:true,
			hasBorder : false,
			gridCss:"um-grid-style",
			cbf:function(){
				event_init();
			}
		});

		function event_init()
 		{
			require(['/js/plugin/event/event.js'] ,function (pevent){
				el.find("[data-flag=detail]").click(function(){
					var ed_id = $(this).attr("data-id");
					obj.ed_id = ed_id;
					pevent.vulnerEventDetail(obj);
				});
			});
 		}
	}

	/** 
		最新故障事件
	*/
	function recent_fault_event(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("最新故障事件");

		var header = [
			{text:'',name:"",width:10,render:function (txt ,data){
					if(data.eventType == "故障")
					{
						return '<div class="prel" style="height:23px"><img src="/img/osIcon/fault.png" title="故障事件" style="width:20px; height:20px;vertical-align:middle"></div>';
					}
					if(data.eventType == "性能")
					{
						return '<div class="prel" style="height:23px"><img src="/img/osIcon/perform.png" title="性能事件" style="width:20px; height:20px;vertical-align:middle"></div>';
					}
			}},
			{text:"事件名称",name:"eventName",width:25,align:"left",render:function(txt,data){
				var txtArray = txt.split("-");
				var t = txtArray[0];
				if (txtArray.length > 1)
				{
					t = txtArray[1];
				}
				return '<a href="javascript:void(0);" style="color:#3498db;" data-id="'+data.eventId+'" data-type="'+data.eventType+'" data-flag="detail" title="点击查看详情"> '+t+'</a>';
			}},
			{text:"资产名称",name:"deviceName",width:35,align:"left"},
			{text:"最新发生时间",name:"enterDateStr",width:30}
		];

		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
			g_grid.render(el_table ,{
				url:"monitordisply/TechnicalSupervision/getFaultPerfList",
				paramObj:{isfault:1},
				maskObj : el.find("[class*=panel-style]"),
				header:header,
				paginator:false,
				allowCheckBox:false,
				hideSearch:true,
				hasBorder : false,
				gridCss:"um-grid-style",
				cbf:function(){
					event_init();
				}
			});

 		function event_init()
 		{
			require(['/js/plugin/event/event.js'] ,function (pevent){
				el.find("[data-flag=detail]").click(function(){				 					
					var eventType = $(this).attr("data-type");
					var eventId = $(this).attr("data-id");
					var obj = new Object();
					if(eventType == "故障") 
					{
						obj.faultNO = eventId;
						pevent.faultEventDetail(obj);
					}
					else if(eventType == "性能") 
					{
						obj.performanceNo = eventId;
						pevent.performEventDetail(obj);
					}
				});
			});
 		}
	}

	/** 
		最新性能事件
	*/
	function recent_perform_event(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("最新性能事件");

		var header = [
			{text:'',name:"",width:10,render:function (txt ,data){
					if(data.eventType == "故障")
					{
						return '<div class="prel" style="height:23px"><img src="/img/osIcon/fault.png" title="故障事件" style="width:20px; height:20px;vertical-align:middle"></div>';
					}
					if(data.eventType == "性能")
					{
						return '<div class="prel" style="height:23px"><img src="/img/osIcon/perform.png" title="性能事件" style="width:20px; height:20px;vertical-align:middle"></div>';
					}
			}},
			{text:"事件名称",name:"eventName",width:25,align:"left",render:function(txt,data){
				var txtArray = txt.split("-");
				var t = txtArray[0];
				if (txtArray.length > 1)
				{
					t = txtArray[1];
				}
				return '<a href="javascript:void(0);" style="color:#3498db;" data-id="'+data.eventId+'" data-type="'+data.eventType+'" data-flag="detail" title="点击查看详情"> '+t+'</a>';
			}},
			{text:"资产名称",name:"deviceName",width:35,align:"left"},
			{text:"最新发生时间",name:"enterDateStr",width:30}
		];

		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
			g_grid.render(el_table ,{
				url:"monitordisply/TechnicalSupervision/getFaultPerfList",
				paramObj:{isfault:2},
				maskObj : el.find("[class*=panel-style]"),
				header:header,
				paginator:false,
				allowCheckBox:false,
				hideSearch:true,
				hasBorder : false,
				gridCss:"um-grid-style",
				cbf:function(){
					event_init();
				}
			});

 		function event_init()
 		{
			require(['/js/plugin/event/event.js'] ,function (pevent){
				el.find("[data-flag=detail]").click(function(){				 					
					var eventType = $(this).attr("data-type");
					var eventId = $(this).attr("data-id");
					var obj = new Object();
					if(eventType == "故障") 
					{
						obj.faultNO = eventId;
						pevent.faultEventDetail(obj);
					}
					else if(eventType == "性能") 
					{
						obj.performanceNo = eventId;
						pevent.performEventDetail(obj);
					}
				});
			});
 		}
	}

	/** 
		最新的配置事件排名
	*/
	function recent_config_event_top(elId){
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("最新配置事件");

		var header = [
			{text:'',name:"",width:10,render:function (txt ,data){
				return '<div class="prel" style="height:23px"><img src="/img/osIcon/config.png" title="配置事件" style="width:20px; height:20px;vertical-align:middle"></div>';	
			}},
			{text:"事件名称",name:"eventName",align:"left",width:25,render:function(txt,data){
				return '<a href="javascript:void(0);" style="color:#3498db;" data-id="'+data.id+'" data-flag="detail" title="点击查看详情"> '+txt+'</a>';
			}},
			{text:"资产名称",width:35,align:"left",name:"edName"},
			{text:"发生时间",width:30,name:"startDate"}
		];

		el.find("[data-id=panel-content]").append('<div class="table_div h-all abPanel-table"></div>');
		var el_table = el.find("[class*=table_div]");
		g_grid.render(el_table ,{
			url:"StatisticsDataDispaly/getDeplEventList",
			maskObj : el.find("[class*=panel-style]"),
			header:header,
			paginator:false,
			allowCheckBox:false,
			hideSearch:true,
			hasBorder : false,
			gridCss:"um-grid-style",
			cbf:function(){
				event_init();
			}
		});

		function event_init()
 		{
			require(['/js/plugin/event/event.js'] ,function (pevent){
				el.find("[data-flag=detail]").click(function(){
					var eventId = $(this).attr("data-id");
					var obj = new Object();
					obj.deploy_NO = eventId;
					pevent.deployEventDetail(obj);
				});
			});
 		}
	}

	/** 
		流量最高的用户排名
	*/
	function data_user_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("流量最高的用户排名");
			minToMonthRender(el ,data_user_top);
		}
		//var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "StatisticsDataDispaly/getRiskBars",
			paramObj : {type:"ed"},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "值";
				seriesObj.type = "bar";
				seriesObj.data = [];
				//seriesObj.itemStyle = new Object();
				//seriesObj.itemStyle.normal = new Object();
				//seriesObj.itemStyle.normal.color = color_array[0];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					category : categoryArray,
					series : seriesArray,
					isVercital : true
				});
			}
		});
	}

	/** 
		事件最多的攻击源排名
	*/
	function event_attack_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("事件最多的攻击源排名");
			dayToYearRender(el ,event_attack_top);
		}
	}

	/** 
		流速最高的用户排名
	*/
	function rate_user_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("流速最高的用户排名");
			minToMonthRender(el ,rate_user_top);
		}
		//var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "StatisticsDataDispaly/getRiskBars",
			paramObj : {type:"ed"},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var legendArray = [];
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = data[i].name;;
				seriesObj.type = "bar";
				seriesObj.data = [];
				//seriesObj.itemStyle = new Object();
				//seriesObj.itemStyle.normal = new Object();
				//seriesObj.itemStyle.normal.color = color_array[i];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					legendArray.push(data[i].name);
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					legend : legendArray,
					category : categoryArray,
					series : seriesArray,
					isVercital : true
				});
			}
		});
	}

	/** 
		流速最高的应用排名
	*/
	function rate_apply_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("流速最高的应用排名");
			minToMonthRender(el ,rate_apply_top);
		}
		//var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "StatisticsDataDispaly/getRiskBars",
			paramObj : {type:"ed"},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var legendArray = [];
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = data[i].name;
				seriesObj.type = "bar";
				seriesObj.data = [];
				//seriesObj.itemStyle = new Object();
				//seriesObj.itemStyle.normal = new Object();
				//seriesObj.itemStyle.normal.color = color_array[0];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					legendArray.push(data[i].name);
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					legend : legendArray,
					category : categoryArray,
					series : seriesArray,
					isVercital : true
				});
			}
		});		
	}

	/** 
		事件数量趋势
	*/
	function event_quantity_trend(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("事件数量趋势");
			dayToYearRender(el ,event_quantity_trend);
		}
		var color_array = ['#2ec0fe','#e84c3d','#ffb607'];
		um_ajax_get({
			url :"StatisticsDataDispaly/getAlarmNumGraph",
			paramObj:{flag:el.find("select").val()},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack:function (data){
				var legendArray = [];
				var categoryArray = [];
				var seriesArray = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].lineName != "安全事件" && data[i].lineName != "总量" && data[i].lineName != "配置事件")
					{
						legendArray.push(data[i].lineName);
						var seriesObj = new Object();
						seriesObj.name = data[i].lineName;
						seriesObj.type = "line";
						seriesObj.data = [];
						seriesObj.itemStyle = new Object();
						seriesObj.itemStyle.normal = new Object();
						seriesObj.itemStyle.normal.color = color_array[i];
						for (var j = 0; j < data[i].items.length; j++) {
							seriesObj.data.push(data[i].items[j].value);						
							categoryArray.push(data[i].items[j].lable);
						}
						seriesArray.push(seriesObj);
					}
				}
				plot.lineRender(el.find("[data-id=panel-content]") ,{
					legend : legendArray,
					category :categoryArray,
					series : seriesArray,
					delay : true
				});
			}
		});
	}

	/** 
		风险最高的资产排名
	*/
	function risk_asset_top(elId)
	{
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("风险最高的资产排名");

		var color_array = ['#2ec0fe','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "StatisticsDataDispaly/getRiskBars",
			paramObj : {type:"ed"},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "值";
				seriesObj.type = "bar";
				seriesObj.data = [];
				seriesObj.itemStyle = new Object();
				seriesObj.itemStyle.normal = new Object();
				seriesObj.itemStyle.normal.color = '#e74c3c';
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					category : categoryArray,
					series : seriesArray,
					isVercital : true,
					grid: {
						top : "6%",
				        bottom: "6%",
				        left: '3%',
			        	right: '4%',
				        containLabel: true
				    }
				});
			}
		});
	}

	/** 
		事件最多的攻击目标排名
	*/
	function event_attack_target_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("事件最多的攻击目标排名");
			dayToYearRender(el ,event_attack_target_top);
		}
	}

	/** 
		流量最高的应用排名
	*/
	function data_apply_top(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("流量最高的应用排名");
			minToMonthRender(el ,data_apply_top);
		}
		//var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
		um_ajax_get({
			url : "NetFlowMonitorDisplay/getFlowAppTop",
			paramObj : {flag:el.find("select").val()},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var legendArray = [];
				var seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = data[i].name;
				seriesObj.type = "bar";
				seriesObj.data = [];
				//seriesObj.itemStyle = new Object();
				//seriesObj.itemStyle.normal = new Object();
				//seriesObj.itemStyle.normal.color = color_array[0];
				var categoryArray = [];
				for (var i = 0; i < data.length; i++) {
					legendArray.push(data[i].name);
					seriesObj.data.push(data[i].value);
					categoryArray.push(data[i].lable);
				}
				seriesArray.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					legend : legendArray,
					category : categoryArray,
					series : seriesArray,
					isVercital : true
				});
			}
		});
	}

	/** 
		全网风险趋势
	*/
	function security_trend(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("全网风险趋势");
			dayToYearRender(el ,security_trend);
		}
		
		um_ajax_get({
			url :"StatisticsDataDispaly/getRiskTrend",
			paramObj:{flag:el.find("select").val()},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack:function (data){
				var	categoryArray = [];
				var seriesArray = [];

				var seriesObj = new Object();
				seriesObj.name = "风险值";
				seriesObj.type = "line";
				seriesObj.data = [];

				for (var i = 0; i < data.length; i++) {
					categoryArray.push(data[i].lable);					
					seriesObj.data.push(data[i].value);
				}
				seriesArray.push(seriesObj);
				plot.lineRender(el.find("[data-id=panel-content]") ,{
					category :categoryArray,
					series : seriesArray,
					delay : true,
					grid: {
				        left: "3%",
				        right: "4%",
				        top: "6%",
				        bottom: "6%",
				        containLabel: true
				    }
				});
			}
		});
	}

	/** 
		事件等级统计
	*/
	function event_level_statistics(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("事件等级统计");
			dayToYearRender(el ,event_level_statistics);
		}
	}

	/** 
		事件类型统计
	*/
	function event_type_statistics(elId ,selFlag)
	{
		var el = $("#" + elId);
		if (!selFlag)
		{
			el.find("[data-id=panel_title]").text("事件类型统计");
			dayToYearRender(el ,event_type_statistics);
		}
	}

	/** 
		监控器故障对比
	*/
	function monitor_fault_distribution(elId ,selFlag)
	{
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("监控器状态对比");
		um_ajax_get({
			url : "monitordisply/TechnicalSupervision/getFaultDistributionByType",
			paramObj : {},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var legend = [];
				for (var i = 0; i < data.length; i++) {
					data[i].value = data[i].distributionCount;
					data[i].name = data[i].distributionName;
					legend.push(data[i].distributionName);
				}
				plot.pieRender(el.find("[data-id=panel-content]") ,{
					name : "监控器状态",
					legend :legend,
					data : data,
					grid : {top : "1%" ,bottom:"6%"},
					labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"inside",
							                formatter:'{c}',
							                textStyle:{fontSize:20}
							              },
						           },
					color_array : ['#62cb31' ,'#ffb606' ,'#e74c3c' ,'#91c7ae' ,'#749f83']
				});
			}
		});
	}

	/** 
		监控器故障分类对比
	*/
	function monitor_fault_class_distribution(elId ,selFlag)
	{
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("监控器类型对比");
		um_ajax_get({
			url : "monitordisply/TechnicalSupervision/getFaultDistributionByMonitorClass",
			paramObj : {},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				for (var i = 0; i < data.length; i++) {
					data[i].value = data[i].distributionCount;
					data[i].name = data[i].distributionName;
				}
				plot.pieRender(el.find("[data-id=panel-content]") ,{
					name : "监控器类型",
					hideLegend :true,
					data : data,
					grid : {top : "1%" ,bottom:"6%"},
					labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"",
							                formatter:'{b} | {c}',
							                textStyle:{fontSize:14}
							              },
						           },
					labelLineSetting : {normal:{
													show:true
											   }},
					color_array : ['#62cb31' ,'#ffb606' ,'#e74c3c' ,'#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a'],
					roseType : "radius"
				});
			}
		});
	}

	/** 
		事件分布
	*/
	function event_type_distribution(elId ,selFlag)
	{
		var el = $("#" + elId);
		el.find("[data-id=panel_title]").text("事件分布");
		um_ajax_get({
			url : "monitordisply/TechnicalSupervision/getEventCountByType",
			paramObj : {},
			maskObj : el.find("[class*=panel-style]"),
			successCallBack : function (data){
				var series = [];
				var seriesObj = new Object();
				seriesObj.name = "数量";
				seriesObj.type = "bar";
				// seriesObj.data = [data.faultAlarmEventCount ,data.performanceEventCount ,data.deployEventListCount];
				seriesObj.data = [data.faultAlarmEventCount ,data.performanceEventCount];
				series.push(seriesObj);
				plot.barRender(el.find("[data-id=panel-content]") ,{
					// category : ['故障事件' ,'性能事件' ,'配置事件'],
					category : ['故障事件' ,'性能事件'],
					series : series,
					grid : {top : "10%" ,bottom:"10%"} 
				});
			}
		});
	}


	//-------------- util -----------------
	function dayToYearRender(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:50px;top:10px;font-weight:normal;"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="day">最近一天</option>');
		sel.append('<option value="week">最近一周</option>');
		sel.append('<option value="month">最近一月</option>');
		sel.append('<option value="season">最近一季度</option>');
		sel.append('<option value="year">最近一年</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	function minToMonthRender(el ,fn)
	{
		var divel = $('<div class="pabs" style="width:100px;right:50px;top:10px;font-weight:normal;"></div>');
		var sel = $('<select data-type="select"></select>');
		divel.append(sel);
		el.find("[data-id=panel_title]").append(divel);

		sel.append('<option value="min5">最近5分钟</option>');
		sel.append('<option value="min15">最近15分钟</option>');
		sel.append('<option value="min30">最近30分钟</option>');
		sel.append('<option value="hour1">最近1小时</option>');
		sel.append('<option value="hour6">最近6小时</option>');
		sel.append('<option value="hour24">最近24小时</option>');
		sel.append('<option value="week">最近一周</option>');
		sel.append('<option value="month">最近一月</option>');


		sel.change(function (){
			fn(sel.closest("[data-id=panel]").attr("id") ,true);
		});

		index_form_init(el.find("[data-id=panel_title]"));
	}

	
});
});