/** 
	插件名称 : event
	功能描述 : 封装事件信息的相关操作
	参数     : 
				
	示例     :  
*/

define(['/js/plugin/inputdrop/inputdrop.js'] ,function(inputdrop){

	var currentStatusMap = new HashMap();
	currentStatusMap.put("1", "正常");
	currentStatusMap.put("0", "异常");
	currentStatusMap.put("正常", "正常");
	currentStatusMap.put("异常", "异常");
	var faultLevelMap = new HashMap();
	faultLevelMap.put("1", "高");
	faultLevelMap.put("2", "中");
	faultLevelMap.put("3", "低");
	faultLevelMap.put("高", "高");
	faultLevelMap.put("中", "中");
	faultLevelMap.put("低", "低");
	var faultStatusMap = new HashMap();
	faultStatusMap.put("1", "未处理");
	faultStatusMap.put("2", "忽略");
	faultStatusMap.put("3", "处理中");
	faultStatusMap.put("4", "已处理");
	faultStatusMap.put("未处理", "未处理");
	faultStatusMap.put("忽略", "忽略");
	faultStatusMap.put("已处理", "已处理");
	faultStatusMap.put("处理中", "处理中");

	var current_header = [];

	return {
		/** 
			函数名 : ignore
			参数   : opt{
							gridEl
							attr
							ignore_url
							cb
						}
		*/
		ignore: function(opt) {
			var gridEl = opt.gridEl;

			var rowData = g_grid.getData(gridEl, {
				chk: true
			});
			if (rowData.length == 0) {
				g_dialog.operateAlert(gridEl, "请选择要忽略的事件。", "error");
				return false;
			}

			if(opt.attr == "faultNO" || opt.attr == "performanceNo")
			{
				for (var i = 0; i < rowData.length; i++) {
					var status;
					if(opt.attr == "faultNO")
					{
						status = rowData[i].faultStatus;
					}
					else if(opt.attr == "performanceNo")
					{
						status = rowData[i].perfStatus;
					}
					if(status == "3")
					{
						g_dialog.operateAlert(gridEl ,"处理中的事件不可被忽略。" ,"error");
						return false;
					}
				}
			}


			$.ajax({
				type: "GET",
				url: "js/plugin/event/event.html",
				success: function(data) {
					g_dialog.dialog($(data).find("[id=ignore_template]"), {
						width: "450px",
						saveclick: save_click,
						title:"忽略"
					});
				}
			});

			function save_click(el, saveObj) {
				saveObj.eventId =
					g_grid.getIdArray(gridEl, {
						chk: true,
						attr: opt.attr
					}).join(",");
				if(opt.key)
				{
					key = opt.key;
					saveObj[key] = saveObj.eventId;
				}

				um_ajax_post({
					url: opt.ignore_url,
					paramObj: saveObj,
					maskObj: "body",
					successCallBack: function(data) {
						g_dialog.hide(el);
						g_dialog.operateAlert(gridEl, "操作成功");
						opt.cb && opt.cb();
					}
				});
			}
		},
		/** 
			函数名 : faultEventIgnore
			参数   : opt{
							gridEl
							attr
							ignore_url
							cb
						}
		*/
		faultEventIgnore : function (opt){
			!opt.attr && (opt.attr = "faultNO");
			opt.ignore_url = "faultAlarmEvent/doIgnore";
			this.ignore(opt);
		},
		/** 
			函数名 : performEventIgnore
			参数   : opt{
							gridEl
							attr
							ignore_url
							cb
						}
		*/
		performEventIgnore : function (opt){
			!opt.attr && (opt.attr = "performanceNo");
			opt.ignore_url = "performanceEvent/doPerformanceEventIgnore";
			this.ignore(opt);
		},
		/** 
			函数名 : deployEventIgnore
			参数   : opt{
							gridEl
							attr
							ignore_url
							cb
						}
		*/
		deployEventIgnore : function (opt){
			!opt.attr && (opt.attr = "deploy_NO");
			opt.ignore_url = "deployEvent/doIgnore";
			this.ignore(opt);
		},
		/** 
			函数名 : ignoreAll
			参数   : opt{
							gridEl
							lgnore_all_url
							cb
						}
		*/
		ignoreAll: function(opt) {
			var gridEl = opt.gridEl;
			$.ajax({
				type: "GET",
				url: "js/plugin/event/event.html",
				success: function(data) {
					g_dialog.dialog($(data).find("[id=ignore_all_template]"), {
						width: "450px",
						title: "忽略全部",
						saveclick: save_click
					});
				}
			});

			function save_click(el ,saveObj) {
				saveObj.alarmStore = gridEl.children().data("queryObj");
				um_ajax_post({
					url: opt.lgnore_all_url,
					paramObj: saveObj,
					maskObj: el,
					successCallBack: function(data) {
						opt.cb && opt.cb();
						g_dialog.hide(el);
						g_dialog.operateAlert(null, "操作成功");
					}
				});
			}
		},
		/** 
			函数名 : createWorkOrder
			参数   : opt{
							gridEl
							descKey    faultModule  perfModule   depl_MODULE  faultModule
							eventIdKey
							eventTypeKey
						}
		*/
		createWorkOrder : function (opt){
			var gridEl = opt.gridEl;
			var dataArray = g_grid.getData(gridEl ,{chk:true});
			if (dataArray.length == 0)
			{
				g_dialog.operateAlert(gridEl ,index_select_one_at_least_msg ,"error");
				return false;
			}
			if(opt.eventTypeVal == "2" || opt.eventTypeVal == "3")
			{
				for (var i = 0; i < dataArray.length; i++) {
					var status;
					if(opt.eventTypeVal == "2")
					{
						status = dataArray[i].faultStatus;
					}
					else if(opt.eventTypeVal == "3")
					{
						status = dataArray[i].perfStatus;
					}

					if(status != "1")
					{
						g_dialog.operateAlert(gridEl ,"只有未处理事件可生成工单。" ,"error");
						return false;
					}
				}
			}
			
			var tmp = [];
			for (var i = 0; i < dataArray.length; i++) {
				tmp.push({
							desc:dataArray[i][opt.descKey],
							eventId:dataArray[i][opt.eventIdKey],
							eventType:opt.eventTypeVal
						});
			}
			//window.location.href = "#/oper_workorder/workorder_handle/workorder_detail?id=socsjczlc&eventStr="+tmp.join(",")+"&eventType=2";
			um_ajax_post({
				url : "workflow/syncWorkOrder",
				paramObj : {syncAlarmEvent : tmp},
				successCallBack : function (){
					g_dialog.operateAlert();
					if(opt.cb)
					{
						opt.cb && opt.cb();
						return false;
					}
					g_grid.refresh(gridEl);
				}
			});
		},
		/** 
			函数名 : faultEventDetail
			参数   : opt{
						}
		*/
		faultEventDetail : function (opt){

			var list_detail_header = [{text: '首次发生时间',name: "enterDate"},
									  {text: '最近发生时间',name: "lastDate"},
									  {text: '更新时间',name: "updateDate"},
									  {text: '恢复时间',name: "recoveryDate"}];

			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
				success: function(data) {
					g_dialog.dialog($(data).find("[id=detail_template]"), {
						width: "800px",
						init: init,
						isDetail : true,
						title:"故障事件详细信息",
						top:"8%"
					});
				}
			});

			function init(el) {
				um_ajax_get({
					url : "faultAlarmEvent/queryFaultEventDetail",
					paramObj : {faultNO:opt.faultNO},
					isLoad : true,
					maskObj : "body",
					successCallBack : function(data){
						$(el).umDataBind("render", data.faultAlarmStore[0]);
						if(data.faultAlarmStore[0].currentStatus == "故障")
						{
							el.find("[data-id=currentStatus]").text("异常");
						}
						else
						{
							return;
						}
					}
				});

				el.find("[id=detailmore_btn]").click(function() {
					$.ajax({
						type: "GET",
						url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
						success: function(data) {
							g_dialog.dialog($(data).find("[id=detailmore_template]"), {
								width: "800px",
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
							paramObj : {faultAlarmStore:{faultNO:opt.faultNO}},
							isLoad : true,
							maskObj : "body",
							allowCheckBox: false,
							hideSearch : true
						});

					}
				});
			}	
		},
		/** 
			函数名 : performEventDetail
			参数   : opt{
						}
		*/
		performEventDetail : function (opt){
			var list_detail_header = [
									   {text:'性能值',name:"value"},
									   {text:'首次发生时间',name:"enterDate"}, 
									  {text: '最近发生时间',name: "lastDate"}, 
									  {text: '更新时间',name: "updateDate"}, 
									   {text:'恢复时间',name:"recoveryDate"}
									 ];
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=perform_detail_template]"),{
						width:"800px",
						init:init,
						title:"性能事件详细信息",
						isDetail:true,
						top:"8%"
					});
				}
			});

			function init(el){
				um_ajax_get({
					url : "performanceEvent/queryPerformanceEventDetail",
					paramObj : {performanceStore : {performanceNo:opt.performanceNo}},
					isLoad : true,
					maskObj : "body",
					successCallBack : function(data){
						$(el).umDataBind("render" ,data[0]);
						if(data[0].monitorName == "" || data[0].monitorName == null)
						{
							el.find("[data-id=monitorName]").text("接口监控器");
						}
						else
						{
							return;
						}
					}
				});

				$("#detailmore_btn").click(function (){
					$.ajax({
						type: "GET",
						url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
						success :function(data)
						{
							g_dialog.dialog($(data).find("[id=detailmore_template]"),{
								width:"800px",
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
							paramObj : {performanceStore:{performanceNo:opt.performanceNo}},
							isLoad : true,
							maskObj : "body",
							allowCheckBox : false,
							hideSearch : true
						});

					}
				});
			}		
		},
		/** 
			函数名 : deployEventDetail
			参数   : opt{
						}
		*/
		deployEventDetail : function (opt){
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/deploy_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=deploy_detail_template]"),{
						width:"800px",
						init:init,
						title:"配置事件详细信息",
						isDetail:true,
						top:"14%"
					});
				}
			});

			function init(el){
				um_ajax_get({
					url : "deployEvent/queryDeployEventDetail",
					paramObj : {DEPLOY_NO:opt.deploy_NO},
					isLoad : true,
					maskObj : "body",
					successCallBack : function(data){
						$(el).umDataBind("render" ,data[0]);
						el.find("[data-id=event_STATUS]").html(faultStatusMap.get(data[0].event_STATUS));
					}
				});
			}		
		},
		/** 
			函数名 : vulnerEventDetail
			参数   : opt{
						}
		*/
		vulnerEventDetail : function (opt,type){
			var self = this;
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/vulner_event_analy_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=detail_template]"),{
						width:"1000px",
						init:init,
						title:"脆弱性事件查看",
						isDetail:true,
						top:"5%"
					});
				}
			});

			function init(el)
			{
				if(type)
				{
					el.find("[id=table_oper]").remove();
				}
				var dialog_table_url = "vul/finish/queryEdDetails";
				var dialog_table_header = [
					{text:'漏洞IP',name:"vul_ipv"},
					{text:'漏洞名称',name:"vul_NAME"},
					{text:'受影响操作系统',name:"os_affected_name"},
					{text:'发生时间',name:"enter_DATE"},
					{text:'CVE编号',name:"cve"},
					{text:'BUGTRAQ编号',name:"bugtraq"},
					{text:'漏洞状态',name:"status"}
			   	];

				event_init();

				list_init();

				function list_init()
				{
					g_grid.render(el.find("[id=detail_list]"),{
						url:dialog_table_url,
						header:dialog_table_header, 
				 		paramObj : {ed_id:opt.ed_id ,statusFlag:"undefined"},
				 		isLoad : true,
						maskObj:"body",
				 		dbClick : vulner_event_detailmore
					});

					function vulner_event_detailmore(rowData)
					{
						$.ajax({
							type: "GET",
							url: "module/sec_manage/event_analy/vulner_event_analy_tpl.html",
							success :function(data)
							{
								g_dialog.dialog($(data).find("[id=detailmore_template]"),{
									width:"800px",
									init:init,
									title:"漏洞详细信息",
									isDetail:true,
									top:"0"
								});
							}
						});

						function init(aEl)
						{
							um_ajax_get({
								url : "vul/finish/queryVulAssetInfo",
								paramObj : {foundID:rowData.base_id},
								isLoad : true,
								maskObj : "body",
								successCallBack : function(data){
									aEl.umDataBind("render",data[0]);
								}
							});
						}
					}
				}

				function event_init()
				{
					el.find("[id=export_excel_btn]").click(function(){
						var idArray = g_grid.getIdArray($("#detail_list") ,{chk:true,attr:"base_id"});
						window.location.href = index_web_app + "vul/finish/exportExcel?eventIds=" + idArray.join(",");
					});

					el.find("[id=ignore_btn]").click(function(){
						self.ignore({
							gridEl : el.find("[id=detail_list]"),
							attr : "base_id",
							key : "ignoreIDs",
							ignore_url : "vul/finish/doIgnore",
							cb: function() {
								list_init();
							}
						});
					});
				}
			}	
		},
		/** 
			函数名 : faultEventList
		*/
		faultEventList : function (opt)
		{
			var self = this;
			var isFirst = true;
			var list_header_map = new HashMap();
			list_header_map.put("faultNameCol", {
				text: '事件名称',
				name: "faultName"
			});
			list_header_map.put("currentStatusCol", {
				text: '当前状态',
				name: "currentStatus",
				render: function(text) {
					return (text == "1" ? "<span style='color:#1abc9c'>正常</span>" : "<span style='color:#ec7063'>异常</span>");
				},
				searchRender:function (el){
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
				}
			});
			list_header_map.put("edNameCol", {
				text: '资产名称',
				name: "edName"
			});
			list_header_map.put("classNameCol", {
				text: '事件类型',
				name: "className",
				searchRender: function (el){
					var searchEl = $('<select class="form-control input-sm" search-data="className"></select>');
			  		el.append(searchEl);
			   	    g_formel.code_list_render({
			   	   		key : "faultclass",
			   	   		faultEventTypeEl : searchEl
			   	    });
				}
			});
			list_header_map.put("faultLevelCol", {
				text: '事件等级',
				name: "faultLevel",
				render: function(text) {
					var level;
					switch (parseInt(text)) {
						case 1:
							level = "高";
							break;
						case 2:
							level = "中";
							break;
						case 3:
							level = "低";
							break;
						case 4:
							level = "很低";
							break;
						default:
							break;
					}
					return '<i style="font-size:20px"></i><span class="dib prel level" style="background-color:'+dict_level_name_bgcolor[level]+';">'
									+level+'</span>';
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
						name : "faultLevel"
					});
				}
			});
			list_header_map.put("bdomainNameCol", {
				text: '业务域',
				name: "bdomainName",
				searchRender: function (el){
					var searchEl = $('<div class="inputdrop" id="bdomainId"></div>');
			  		el.append(searchEl);
			   	    g_formel.sec_biz_render({
			   	   		bizEl : searchEl
			   	    });
				}
			});
			list_header_map.put("sdomainNameCol", {
				text: '安全域',
				name: "sdomainName",
				searchRender: function (el){
					var searchEl = $('<div class="inputdrop" id="sdomainId"></div>');
			  		el.append(searchEl);
			   	    g_formel.sec_biz_render({
			   	   		secEl : searchEl
			   	    });
				}
			});
			list_header_map.put("firstEnterDateCol", {
				text: '首次发生时间',
				name: "firstEnterDate",
				searchRender: function (el){
					index_render_div(el ,{type:"date",startKey:"startDate" ,endKey:"endDate"});
				}
			});
			list_header_map.put("enterDateCol", {
				text: '最新发生时间',
				name: "enterDate",
				hideSearch: true
			});
			list_header_map.put("updateDateCol", {
				text: '恢复时间',
				name: "updateDate",
				hideSearch: true
			});
			list_header_map.put("faultModuleCol", {
				text: '事件描述',
				name: "faultModule",
				render: function (txt){
					return '<span style="opacity:0.6">'+txt+'</span>'
				}
			});
			list_header_map.put("ipvAddressCol", {
				text: '资产IP',
				name: "ipvAddress"
			});
			list_header_map.put("faultStatusCol", {
				text: '状态',
				name: "faultStatus",
				render: function(text) {
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
					// 	data : data,
					// 	name : "faultStatus",
					// 	initVal : "1"
					// });
					g_formel.multipleSelect_render(el ,{
						data : data,
						name : "faultStatus",
						allowAll : true,
						initVal : "1,3"
					});
				}
			});

			// 先去调用getcol
			um_ajax_get({
				url: "faultAlarmEvent/queryFaultColumeIds",
				isLoad: false,
				successCallBack: function(data) {
					var dataArray = data.split(",");
					// 组装header
					var header = [];
					for (var i = 0; i < dataArray.length; i++) {
						if (list_header_map.get(dataArray[i])) {
							header.push(list_header_map.get(dataArray[i]));
							current_header.push(dataArray[i]);
						}
					}
					g_grid.render($("#table_div"), {
						header: header,
						paramObj : {currentStatus : 0 ,faultStatus : "1,3"},//默认查询异常状态
						queryBefore : function (paramObj){
							if(!paramObj.currentStatus && ($("#table_div").find("[data-id=currentStatus]").size() == 0))
							{
								paramObj.currentStatus = 0;
							}
							if (!paramObj.faultStatus && ($("#table_div").find("[data-id=faultStatus]").size() == 0))
							{
								paramObj.faultStatus = "1,3";
							}
						},
						url: "faultAlarmEvent/queryFaultEventList",
						maskObj: "body",
						allowCheckBox: true,
						dbClick: event_record_dbclick,
						cbf:function (){
							var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
							$("#table_div").children().data("queryObj" ,queryObj);
							if (isFirst)
							{
								$("[class=um-grid-search-tr]").find("[data-id=currentStatus]").val("0");
								$("[class=um-grid-search-tr]").find("[data-id=currentStatus]").trigger("change");
								$("[class=um-grid-search-tr]").find("[data-id=faultStatus]").val("1,3");
								$("[class=um-grid-search-tr]").find("[data-id=faultStatus]").trigger("change");
								inputdrop.setDataSelect($("[class=um-grid-search-tr]").find("[id=faultStatus]") ,"1,3");
								isFirst = false;
							}
						}
					});
				}
			});

			function event_record_dbclick(rowData){
				self.faultEventDetail(rowData);
			}
		},
		/** 
			函数名 : performEventList
		*/
		performEventList : function (opt){
			var self = this;
			//组装表头
			var list_header_map = new HashMap();
			list_header_map.put("perfNameCol" ,{text:'事件名称',name:"perfName"});
			list_header_map.put("currentStatusCol" ,{text:'当前状态',name:"currentStatus" ,render:function(text){
							  		return (text=="1"?"<span style='color:#1abc9c'>正常</span>":"<span style='color:#ec7063'>异常</span>");
								},searchRender:function (el){
											var data = [
															{text:"----" ,id:"-1"},
									  						{text:"正常" ,id:"1"},
									  						{text:"异常" ,id:"0"}
												  		];
											g_formel.select_render(el ,{
												data : data,
												name : "currentStatus"
											});
								}});
			list_header_map.put("perfModuleCol" ,{text:'事件描述',name:"perfModule",render: function (txt){
													 return '<span style="opacity:0.6">'+txt+'</span>'
												 }});
			list_header_map.put("valueCol" ,{text:'性能值',name:"value",hideSearch:true});
			list_header_map.put("edNameCol" ,{text:'资产名称',name:"edName"});
			list_header_map.put("classNameCol" ,{text:'事件类型',name:"className"});
			list_header_map.put("perfLevelCol" ,{text:'事件等级',name:"perfLevel" ,render:function(text){
								var level;
							  	switch(parseInt(text)){
							  		case 1 : level="高"; break;
							  		case 2 : level="中"; break;
							  		case 3 : level="低"; break;
							  		default:break;
							  	}
							  	return '<i style="font-size:20px"></i><span class="dib prel level" style="background-color:'+dict_level_name_bgcolor[level]+';">'
									+level+'</span>';
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
							  		case 3: status="已处理"; break;
							  		case 4: status="处理中"; break;
							  		default :break;
							  	}
							  	return status;
							  },
							  searchRender:function(el){
							  var data = [
					  						{text:"未处理" ,id:"-1"},
					  						{text:"忽略" ,id:"2"},
					  						{text:"已处理" ,id:"3"},
					  						{text:"处理中" ,id:"4"}
								  		];
							  g_formel.select_render(el ,{
								  data : data,
								  name : "perfStatus"
							  });
						    }});
			//先去调用getcol
			um_ajax_get({
				url : "performanceEvent/queryProformanColumeIds",
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
						url:"performanceEvent/queryPerformanceEventList",
						maskObj : "body",
						allowCheckBox : true,
						dbClick : event_record_dbclick,
						cbf:function (){
							var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
							$("#table_div").children().data("queryObj" ,queryObj);
						}
					});
				}
			});

			function event_record_dbclick(rowData){
				self.performEventDetail(rowData);
			}
		},
		/** 
			函数名 : deployEventList
		*/
		deployEventList : function (opt){
			var self = this;
			var list_header_map = new HashMap();
			list_header_map.put("depl_NAMECol", {
				text: '事件名称',
				name: "depl_NAME"
			});
			list_header_map.put("ed_IDCol", {
				text: '资产名称',
				name: "ed_ID"
			});
			list_header_map.put("monitorNameCol", {
				text: '监控器名称',
				name: "monitorName"
			});
			list_header_map.put("enter_DATECol", {
				text: '最新发生时间',
				name: "enter_DATE",
				hideSearch:"true"
			});
			list_header_map.put("update_dateCol", {
				text: '恢复时间',
				name: "update_date",
				hideSearch:"true"
			});
			list_header_map.put("depl_COUNTCol", {
				text: '数量',
				name: "depl_COUNT",
				sortBy:"int",
				hideSearch:true
			});
			list_header_map.put("depl_MODULECol", {
				text: '事件描述',
				name: "depl_MODULE",
				render:function (txt){
					if (txt && txt.length > 40)
					{
						txt = txt.substr(0,40) + "...";
					}
					return '<span style="opacity:0.6">'+txt+'</span>'
				},
				tip: true
			});
			list_header_map.put("ipvAddressCol", {
				text: '资产IP',
				name: "ipvAddress"
			});
			// 先去调用getcol
			um_ajax_get({
				url: "deployEvent/queryDeployColumeIds",
				isLoad: false,
				successCallBack: function(data) {
					if (!data)
					{
						data = "depl_NAMECol,ed_IDCol,monitorNameCol,enter_DATECol,depl_COUNTCol";
					}
					var dataArray = data.split(",");
					// 组装header
					var header = [];
					for (var i = 0; i < dataArray.length; i++) {
						if (list_header_map.get(dataArray[i])) {
							header.push(list_header_map.get(dataArray[i]));
							current_header.push(dataArray[i]);
						}
					}
					g_grid.render($("#table_div"), {
			 			header:header,
			 			url:"deployEvent/queryDeployEventList",
			 			maskObj : "body",
			 			allowCheckBox : true,
			 			dbClick : sec_event_record_dbclick,
						cbf:function (){
							var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
							$("#table_div").children().data("queryObj" ,queryObj);
						}
					});
				}
			});

		 	function sec_event_record_dbclick(rowData){
				self.deployEventDetail(rowData);
			}
		},
		/** 
			函数名 : vulnerEventList
		*/
		vulnerEventList : function (opt){
			var list_header = [
			 					{text:'资产名称',name:"ed_name"},
			 					{text:'未处理漏洞数量',name:"unhandledVulNum"},
			 					{text:'全部漏洞数量',name:"totalVulNum"},
			 					{text:'变化趋势',name:"newFoundText"}
							  ];
			g_grid.render($("#table_div"),{
		 			header:list_header,
		 			url:"vul/finish/queryFinishEdList",
		 			maskObj : "body",
		 			allowCheckBox : true,
					hideSearch : true,
		 			dbClick : vulner_event_record_dbclick,
		 			cbf:function (){
						$("#table_div").children().data("queryObj" ,current_query_obj);
					}
			});
			function vulner_event_record_dbclick(rowData)
			{
				pevent.vulnerEventDetail(rowData);
			}
		},
		/** 
			函数名 : dialogList
			参数   : opt{url,  --- 不传为默认
						header, --- 不传为默认
						paramObj
						},
					flag:"2" 故障事件    "3" 性能事件 ，"13" 配置事件,
					oper:true   ---显示操作栏
 		*/
		dialogList :function(opt,flag,oper){
			var self = this;
			var title;
			var url;
			var header;
			if(flag == "2")
			{
			    header = [
							{text:"事件名称" ,name:"faultName"},
							{text:"当前状态" ,name:"currentStatus" ,render:function (txt){
								if (txt == "0")
								{
									return "异常";
								}
								else
								{
									return "正常";
								}
							}},
							{text:"事件模块" ,name:"faultModule"},
							{text:"发生时间" ,name:"firstEnterDate"},
							{text:"恢复时间" ,name:"updateDate"}
						 ];
				url = "faultAlarmEvent/queryFaultEventList";
			}
			else if(flag == "3")
			{
				header = [
						{text:"事件名称" ,name:"perfName"},
						{text:"当前状态" ,name:"currentStatus" ,render:function (txt){
							if (txt == "0")
							{
								return "异常";
							}
							else
							{
								return "正常";
							}
						}},
						{text:"事件模块" ,name:"perfModule"},
						{text:"性能值" ,name:"value"},
						{text:"发生时间" ,name:"firstEnterDate"},
						{text:"恢复时间" ,name:"updateDate"}
					 ];
				url = "performanceEvent/queryPerformanceEventList";
			}
			else if(flag == "13")
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
				 url = "deployEvent/queryDeployEventList";
			}
			if(flag == "2")
			{
				title = "故障事件";
			}
			else if(flag == "3")
			{
				title = "性能事件";
			}
			else if(flag == "13")
			{
				title = "配置事件";
			}
			$.ajax({
				type: "GET",
				url: "module/monitor_info/monitor_obj/asset_monitor_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=table_template]"),{
						width:"900px",
						init:init,
						initAfter:initAfter,
						isDetail:true,
						title:title
					});
				}
			});
			function init(el)
			{
				if(oper)
				{
					el.find("[id=table_oper]").show();
				}
				
				el.find("[id=ignore_btn]").click(function (){
					var attr;
					var ignore_url;
					if(flag == "2")
					{
						attr = "faultNO";
						ignore_url = "faultAlarmEvent/doIgnore";
					}
					else if(flag == "3")
					{
						attr = "performanceNo";
						ignore_url = "performanceEvent/doPerformanceEventIgnore";
					}
					else if(flag == "13")
					{
						attr = "deploy_NO";
						ignore_url = "deployEvent/doIgnore";
					}
					self.ignore({
						gridEl: el.find("[id=table_div]"),
						attr: attr,
						ignore_url: ignore_url,
						cb: function() {
							g_dialog.operateAlert(el);
							g_grid.render(el.find("[id=table_div]") ,{
								url : url,
								header : header,
								paramObj : opt.paramObj,
								hideSearch:true,
								dbClick:event_record_dbclick
							});
						}
					});
				});
				el.find("[id=create_btn]").click(function (){
					var descKey;
					var eventIdKey;
					var eventTypeVal;
					if(flag == "3"){
						descKey = "perfModule";
						eventIdKey = "performanceNo";
						eventTypeVal = "3";
					}
					else if(flag == "2"){
						descKey = "faultModule";
						eventIdKey = "faultNO";
						eventTypeVal = "2";
					}
					else if(flag == "13"){
						descKey = "depl_MODULE";
						eventIdKey = "deploy_NO";
						eventTypeVal = "13";
					}
					self.createWorkOrder({
						gridEl : el.find("[id=table_div]"),
						descKey : descKey,
						eventIdKey : eventIdKey,
						eventTypeVal : eventTypeVal,
						cb: function() {
							g_dialog.operateAlert(el);
							g_grid.render(el.find("[id=table_div]") ,{
								url : url,
								header : header,
								paramObj : opt.paramObj,
								hideSearch:true,
								dbClick:event_record_dbclick
							});
						}
					});
					
				});
			}

			function initAfter(el)
			{
				if(opt.url)
				{
					url = opt.url;
				}
				if(opt.header)
				{
					header = opt.header;
				}
				g_grid.render(el.find("[id=table_div]") ,{
					url : url,
					header : header,
					paramObj : opt.paramObj,
					hideSearch:true,
					dbClick:event_record_dbclick,
					paginator : false,
					showCount : true
				});
			}
			function event_record_dbclick(rowData) {
				if(flag == "3"){
					self.performEventDetail(rowData);
				}
				else if(flag == "2"){
					self.faultEventDetail(rowData);
				}
				else if(flag == "13"){
					self.deployEventDetail(rowData);
				}
			}
		},
		/** 
			函数名 : eventCustomCol
			参数   : tplUrl
					 colQueryUrl
					 customColumnsUrl
					 cbf
					 type

		*/
		eventCustomCol : function (opt){
			$.ajax({
					type: "GET",
					//url: "module/sec_manage/event_analy/fault_event_analy_tpl.html",
					url: opt.tplUrl,
					success: function(data) {
						g_dialog.dialog($(data).find("[id=custom_template]"), {
							width: "630px",
							initAfter: initAfter,
							title: "自定义列",
							saveclick: save
						});
					}
			});

			function initAfter(el) {
				um_ajax_get({
					//url: list_query_url,
					url: opt.colQueryUrl,
					maskObj: el,
					successCallBack: function(data) {
						if (!data)
						{
							data = "depl_NAMECol,ed_IDCol,monitorNameCol,enter_DATECol,depl_COUNTCol";
						}
						el.umDataBind("renderCheckBox", el, {
							value: data.split(","),
							name: "ids"
						})
					}
				})
			}

			function save(el, saveObj) {
				var idArray = saveObj.ids.split(",");
				if (idArray.length == 0 || idArray[0] == "") {
					g_dialog.operateAlert(el, "请至少选择一项。", "error");
					return false;
				}
				if (idArray.length > 6) {
					g_dialog.operateAlert(el, "最多只能选择六项", "error");
					return false;
				}
				//saveObj.type = "2";
				saveObj.type = opt.type;
				um_ajax_post({
					//url: custom_columns_url,
					url: opt.customColumnsUrl,
					paramObj: saveObj,
					maskObj: el,
					successCallBack: function(data) {
						g_dialog.hide(el);
						g_dialog.operateAlert(null, "操作成功");
						opt.cbf && opt.cbf();
					}
				})
			}
		},
		eventExport : function (opt){
			var obj = new Object();
			for (var i = 0; i < current_header.length; i++) {
				obj[current_header[i].substr(0 ,current_header[i].length-3)] = 1;
			}
			var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:opt.attr});
			window.location.href = index_web_app + opt.url + "?eventIds=" + idArray.join(",") + "&title=" + JsonTools.encode(obj) + "&queryStr=" + opt.queryObjStr;
		}

	}

});