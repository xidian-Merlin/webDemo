/*
查询
生成工单
统计
导出excel

待完善
 */
/*路径完善后需用组装表头，固定表头需注释掉或删除*/
$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
	     '/js/plugin/tree/tree.js',
	     '/js/plugin/tab/tab.js',
	     '/js/plugin/plot/plot.js',
	     '/js/plugin/workorder/workorder.js',
	     '/js/plugin/event/event.js'] ,function (inputdrop ,tree ,tab ,plot ,workorder ,pevent){
	//组装表头
	var list_header_map = new HashMap();
		list_header_map.put("perfNameCol" ,{text:'事件名称',name:"perfName"});
		list_header_map.put("currentStatusCol" ,{text:'当前状态',name:"currentStatus" ,render:function(text){
						  		return (text=="1"?"<span style='color:#1abc9c'>正常</span>":"<span style='color:#ec7063'>异常</span>");
							},searchRender:function (el){
										var data = [
														{text:"----" ,id:"-1"},
														{text:"异常" ,id:"0"},
								  						{text:"正常" ,id:"1"}
											  		];
										g_formel.select_render(el ,{
											data : data,
											name : "currentStatus",
											initVal : "0"
										});
							}});
		list_header_map.put("perfModuleCol" ,{text:'事件描述',name:"perfModule"});
		list_header_map.put("valueCol" ,{text:'性能值',name:"value",hideSearch:true});
		list_header_map.put("edNameCol" ,{text:'资产名称',name:"edName"});
		list_header_map.put("classNameCol" ,{text:'事件类型',name:"className",searchRender: function (el){
							var searchEl = $('<select class="form-control input-sm" search-data="className"></select>');
					  		el.append(searchEl);
					   	    g_formel.code_list_render({
					   	   		key : "perfclass",
					   	   		performEventTypeEl : searchEl
					   	    });
		}});
		list_header_map.put("perfLevelCol" ,{text:'事件等级',name:"perfLevel" ,render:function(text){
							var level;
						  	switch(parseInt(text)){
						  		case 1 : level="高"; break;
						  		case 2 : level="中"; break;
						  		case 3 : level="低"; break;
						  		default:break;
						  	}
						  	return level;
						  },
						  searchRender: function (el){
							var data = [
											{text:"----" ,id:"-1"},
					  						{text:"很高" ,id:"0"},
					  						{text:"高" ,id:"1"},
					  						{text:"中" ,id:"2"},
					  						{text:"低" ,id:"3"},
					  						{text:"很低" ,id:"4"},
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "perfLevel"
							});
						}});
		list_header_map.put("bdomainNameCol" ,{text:'业务域',name:"bdomainName",searchRender: function (el){
												var searchEl = $('<div class="inputdrop" id="bdomainId"></div>');
										  		el.append(searchEl);
										   	    g_formel.sec_biz_render({
										   	   		bizEl : searchEl
										   	    });
											}});
		list_header_map.put("sdomainNameCol" ,{text:'安全域',name:"sdomainName",searchRender: function (el){
													var searchEl = $('<div class="inputdrop" id="sdomainId"></div>');
											  		el.append(searchEl);
											   	    g_formel.sec_biz_render({
											   	   		secEl : searchEl
											   	    });
												}});
		list_header_map.put("firstEnterDateCol" ,{text:'首次发生时间',name:"firstEnterDate",searchRender: function (el){
														index_render_div(el ,{type:"date",startKey:"startDate" ,endKey:"endDate"});
													}});
		list_header_map.put("enterDateCol" ,{text:'最新发生时间',name:"enterDate",hideSearch:"true"});
		list_header_map.put("updateDateCol" ,{text:'恢复时间',name:"updateDate",hideSearch:"true"});
		list_header_map.put("perfStatusCol" ,{text:'状态',name:"perfStatus" ,render:function(text){
						  	var status;
						  	switch(parseInt(text)){
						  		case 1: status="未处理"; break;
						  		case 2: status="忽略"; break;
						  		case 3: status="处理中"; break;
						  		case 4: status="已处理"; break;
						  		default :break;
						  	}
						  	return status;
						  },
						  searchRender:function(el){
						  var data = [
						  				//{text:"----" ,id:"-1"},
						  				{text:"未处理" ,id:"1"},
				  						{text:"忽略" ,id:"2"},
				  						{text:"处理中" ,id:"3"},
				  						{text:"已处理" ,id:"4"}
							  		];
						  // g_formel.select_render(el ,{
							 //  data : data,
							 //  name : "perfStatus",
							 //  initVal : "1,3"
						  // });
						  g_formel.multipleSelect_render(el ,{
							data : data,
							name : "perfStatus",
							allowAll : true,
							initVal : "1,3"
						});
					    }});
		list_header_map.put("ipvAddressCol" ,{text:'资产IP',name:"ipvAddress"});

	//主页url
	var list_url = "performanceEvent/queryPerformanceEventList";
	
	//忽略全部url
	var lgnore_all_url = "performanceEvent/doPerformanceEventIgnoreAll";
	//忽略url
	var lgnore_url = "performanceEvent/doPerformanceEventIgnore";
	//自定义列url
	var custom_columns_url = "performanceEvent/savePerformanceEventCustomColumn";
	//查询列url
	var list_query_url="performanceEvent/queryProformanColumeIds";
	//统计url
	var stat_url = "performanceEvent/statPerformanceEventQuery";

	var el_event_list = $("#table_div");

	var current_header = [];

	event_init();

	event_analy_list({paramObj : {currentStatus : 0 ,perfStatus : "1,3"} ,isLoad : true ,maskObj : "body"});

	function event_analy_list (option)
	{
		var isFirst = true;
		//先去调用getcol
		um_ajax_get({
			url : list_query_url,
			isLoad : false,
			successCallBack : function(data){
				var dataArray = data.split(",");
				// 组装header
				var header = [];
				for (var i = 0; i < dataArray.length; i++) {
					if (list_header_map.get(dataArray[i])){
						header.push(list_header_map.get(dataArray[i]));
						current_header.push(dataArray[i]);
					}
				}
				g_grid.render($("#table_div"),{
					header:header,
					url:list_url,
					paramObj : option.paramObj,
					queryBefore : function (paramObj){
						if(!paramObj.currentStatus && ($("#table_div").find("[data-id=currentStatus]").size() == 0))
						{
							paramObj.currentStatus = 0;
						}
						if (!paramObj.perfStatus && ($("#table_div").find("[data-id=perfStatus]").size() == 0))
						{
							paramObj.perfStatus = "1,3";
						}
					},
					isLoad : option.isLoad,
					maskObj : option.maskObj,
					allowCheckBox : true,
					dbClick : event_record_dbclick,
					cbf:function (){
						var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
						$("#table_div").children().data("queryObj" ,queryObj);
						if (isFirst)
						{
							$("[class=um-grid-search-tr]").find("[data-id=currentStatus]").val("0");
							$("[class=um-grid-search-tr]").find("[data-id=currentStatus]").trigger("change");
							// $("[class=um-grid-search-tr]").find("[data-id=perfStatus]").val("1,3");
							// $("[class=um-grid-search-tr]").find("[data-id=perfStatus]").trigger("change");
							inputdrop.setDataSelect($("[class=um-grid-search-tr]").find("[id=perfStatus]") ,"1,3");
							isFirst = false;
						}
					}
				});
			}
		});

	}

	function event_init()
	{
		// 生成工单
		$("#order_btn").click(function (){
			pevent.createWorkOrder({
				gridEl : $("#table_div"),
				descKey : "perfModule",
				eventIdKey : "performanceNo",
				eventTypeVal : "3"
			});
		});

		//忽略全部
		$("#lgnore_all_btn").click(function(rowData) {
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
				lgnore_all_url: "performanceEvent/doPerformanceEventIgnoreAll",
				cb: function() {
					event_analy_list({
						paramObj: {currentStatus : 0},
						isLoad: true,
						maskObj: el_event_list
					});
				}
			});
		});

		//忽略
		$("#lgnore_btn").click(function (rowData){
			var array = g_grid.getIdArray(el_event_list ,{chk:true ,attr:"perfStatus"});
			if (array.join("").indexOf("2") >= 0)
			{
				g_dialog.operateAlert(el_event_list ,"选中记录中包含已忽略的记录，请重新选择","error");
				return false;
			}
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
				success :function(data)
				{
					var rowData = g_grid.getData(el_event_list,{
						chk:true
					});
					if(rowData.length == 0){
						g_dialog.operateAlert(null ,"请选择要忽略的性能事件!" ,"error");
						return false;
					}
					for (var i = 0; i < rowData.length; i++) {
						if(rowData[i].perfStatus == "3")
						{
							g_dialog.operateAlert(el_event_list ,"处理中的事件不可被忽略。" ,"error");
							return false;
						}
					}
					
					g_dialog.dialog($(data).find("[id=lgnore_template]"),{
						width:"530px",
						init:init,
						title:"忽略",
						saveclick:save
					});
				}
			});

			function init (el){
			}

			function save(el ,saveObj){
				saveObj.eventId =
						g_grid.getIdArray(el_event_list ,{chk:true ,attr:"performanceNo"}).join(",");
				um_ajax_post({
					url : lgnore_url,
					paramObj: saveObj,
					maskObj:el,
					successCallBack : function(data){
						g_dialog.hide(el);
						g_dialog.operateAlert(null ,"操作成功");
						event_analy_list({paramObj : {currentStatus : 0} ,isLoad : true ,maskObj : el_event_list});
					}
				});
				
			}
		});
		//统计
		$("#count_btn").click(function (rowData){
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=count_template]"),{
						width:"1100px",
						init:init,
						initAfter:initAfter,
						title:"统计",
						saveclick:save,
						isDetail:true,
						top:"6%"
					});
				}
			});
			function init (el){
		
			}

			function initAfter(el)
			{
				chart_render(el.find("[id=eventname_analy_chars]") ,1);
				chart_render(el.find("[id=type_analy_chars]") ,2);
				chart_render(el.find("[id=level_analy_chars]") ,6);
				chart_render(el.find("[id=time_analy_chars]") ,7);
			}

			function save(el ,saveObj){

			}
		});
		//导出EXCEL
		$("#export_btn").click(function (rowData){
			var obj = new Object();
				for (var i = 0; i < current_header.length; i++) {
					obj[current_header[i].substr(0 ,current_header[i].length-3)] = 1;
				}
				var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"performanceNo"});
				var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
				if(!queryObj.currentStatus && ($("#table_div").find("[data-id=currentStatus]").size() == 0))
				{
					queryObj.currentStatus = 0;
				}
				if (!queryObj.perfStatus && ($("#table_div").find("[data-id=perfStatus]").size() == 0))
				{
					queryObj.perfStatus = "1,3";
				}
				window.location.href = index_web_app + "performanceEvent/exportPerformance?eventIds=" + idArray.join(",") + "&title=" + JsonTools.encode(obj) + "&queryStr=" + JsonTools.encode(queryObj);
		});
		//自定义列
		$("#custom_btn").click(function (rowData){
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=custom_template]"),{
						width:"630px",
						init:init,
						title:"自定义列",
						initAfter:initAfter,
						saveclick:save
					});
				}
			});
			function init (el){
			}

			function initAfter(el){
				um_ajax_get({
					url : list_query_url,
					maskObj : el,
					successCallBack : function(data){
						el.umDataBind("renderCheckBox",el,{
							name : "ids",
							value : data.split(",")
						});
					}
				})
			}

			function save(el ,saveObj){
				var idArray =  saveObj.ids.split(",");
				if (idArray.length == 0 || idArray[0] == "")
				{
					g_dialog.operateAlert(el ,"请至少选择一项。" ,"error");
					return false;
				}
				if (idArray.length > 6)
				{
					g_dialog.operateAlert(el ,"最多只能选择六项" ,"error");
					return false;
				}
				saveObj.type="3";
				um_ajax_post({
					url : custom_columns_url,
					paramObj: saveObj,
					maskObj:el,
					successCallBack : function(data){
						g_dialog.hide(el);
						g_dialog.operateAlert(null ,"操作成功");
						event_analy_list({paramObj : {currentStatus : 0 ,perfStatus : "1,3"} ,isLoad : true ,maskObj : el_event_list});
					}
				})
			}
		});

	}

	function chart_render(el ,typeid)
	{
		var paramObj = $("[class*=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
		paramObj.typeid = typeid;
		// if (!paramObj.currentStatus || paramObj.currentStatus == "-1")
		// {
		// 	paramObj.currentStatus = 0;
		// }
		if (typeid == "7")
		{
			um_ajax_get({
				url : stat_url,
				paramObj : paramObj,
				successCallBack : function (data){
					var seriesArray = [];
					var categoryArray = [];
					seriesObj = new Object();
					seriesObj.name = "性能事件统计";
					seriesObj.type = "line";
					//seriesObj.areaStyle = {normal: {}};
					seriesObj.data = [];
					var data = data.datas[0].items;
					for (var i = 0; i < data.length; i++) {
						categoryArray.push(data[i].lable);
						seriesObj.data.push(data[i].value);
					}
					seriesArray.push(seriesObj);
					plot.lineRender(el ,{
						category : categoryArray,
						series : seriesArray,
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
			var color_array = ['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
			um_ajax_get({
					url : stat_url,
					paramObj : paramObj,
					successCallBack : function (data){
						var seriesArray = [];
						var seriesObj = new Object();
						seriesObj.name="值";
						seriesObj.type="bar";
						seriesObj.data=[];
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
						plot.barRender(el ,{
							category : categoryArray,
							series : seriesArray,
							isVercital : true
						});
					}
				});
		}
		
	}

	function event_record_dbclick(rowData){
		pevent.performEventDetail(rowData);
	}

});
});