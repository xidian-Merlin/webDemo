$(document).ready(function (){
require(['/js/plugin/ABPanel/abPanel.js',
         '/js/plugin/plot/plot.js',
         '/js/plugin/tree/tree.js',
         '/module/sys_manage/sys_base_config/system_health_public.js',
         '/js/plugin/timepicker/timepicker.js'] ,function (abPanel ,plot,tree,publicObj){
	
	//样式设置
	{
		$("#content_div").addClass("appbgf");
	}
	/**
	 * 定时器区
	 */
	{

	}
	/**
	 * 初始化事件
	 */
	{
		index_form_init($("#hyh_systemagent_refresh_time_div"));
		index_form_init($("#hyh_systemstate_refresh_time_div"));
		$("#sys_run_icon_sitemap").click(function (){
			window.location.href = "#/sys_manage/sys_base_config/system_health_logic_topo";
		});

		$("#sys_run_icon_desktop").click(function (){
			window.location.href = "#/monitor_info/monitor_obj/monitor";
		});
		index_interval_1 = null;
		var systemstaterefresh_time = 0;
		//中心设备运行指标
		function _systemstate_refresh()
		{
			if(systemstaterefresh_time<=0)
				return;
			systemstate_list({paramObj:null,isLoad:true,maskObj:"body"});
			index_interval_1 = setTimeout(_systemstate_refresh, systemstaterefresh_time);
		}
		function _restart_systemstaterefresh()
		{
			clearTimeout(index_interval_1);
			index_interval_1 = null;
			_systemstate_refresh();
		}
		index_interval_2 = null;
		var systemagentrefresh_time = 0;
		//代理服务器运行指标
		function _systemagent_refresh()
		{
			if(systemagentrefresh_time<=0)
				return;
			systemagent_list({paramObj:null,isLoad:true,maskObj:"body"});
			index_interval_2 = setTimeout(_systemagent_refresh, systemagentrefresh_time);
		}
		function _restart_systemagentrefresh()
		{
			clearTimeout(index_interval_2);
			index_interval_2 = null;
			_systemagent_refresh();
		}
		$("#hyh_systemstate_refresh").click(function(){
			_restart_systemstaterefresh();
			systemstate_list({paramObj:null,isLoad:true,maskObj:"body"});
		});
		$("#hyh_systemstate_refresh_time").change(function(){
			systemstaterefresh_time = $(this).val();
			_systemstate_refresh();
		});
		$("#hyh_systemagent_refresh").click(function(){
			_restart_systemagentrefresh();
			systemagent_list({paramObj:null,isLoad:true,maskObj:"body"});
		});
		$("#hyh_systemagent_refresh_time").change(function(){
			systemagentrefresh_time = $(this).val();
			_systemagent_refresh();
		});
	}
	/**
	 * 系统运行状况
	 */
	{
		var health_url = "tpl/sys_manage/sys_base_config/health.html";
		$.ajax({
			type: "GET",
			url: health_url,
			success :function(data)
			{
				$("#table_div_X").append($(data));
			}
		});
	}
	
	/**
	 * 系统事件列表
	 */
	{
		var list_url = "monitorSystem/queryPerfAndFaultEvent";
		var queryEdMonitor_url = "monitorView/queryEdMonitor";
		var list_col = [
							{text:'事件名称',name:"eventName",
								render:function (eventName){
								return "<a href='javascript:void(0)'>"+eventName+"<a>";
					  		},
					  		click:function(rowData){
								var healthmoniter_url = "module/sys_manage/sys_base_config/system_health_tpl.html";
								$.ajax({
									type: "GET",
									url: healthmoniter_url,
									success :function(data)
									{
										var pagedata = $(data).find("#systemeventfault_template");
										g_dialog.dialog($(pagedata),{
											width:"600px",
											init:initEventFault,
											title:"故障/性能事件详细信息"
										});
									}
								});
								function initEventFault(el)
								{
//									initDIV(el,rowData);
									publicObj.initDIV(el,rowData);
									el.find("button[data-id='save']").remove();
								}
							}
					  		},
							{text:'资产名称',name:"mdName",click:function(rowData){
								console.log(rowData);
								window.open('#/monitor_info/monitor_obj/monitor_info?regionId=&assetId='+rowData.edId+'&queryByAsset=1&hideMenu=1');
							},
							render : function(mdName) 
							{
								return "<a href='javascript:void(0)'>"+mdName+"<a>";
							}},
							{text:'开始时间',name:"enterDate"},
							{text:'结束时间',name:"updateDate"},
					   ];
		
		systemevent_list({paramObj:null,isLoad:true,maskObj:$("#table_div_envent")});
		
		
		
		function systemevent_list(option)
		{
			g_grid.render($("#table_div_envent"),{
				 header:list_col,
				 url:list_url,
				 pageSize:15,
				 paginator:false,
				 paramObj : option.paramObj,
				 isLoad : option.isLoad,
				 maskObj : option.maskObj,
				 gridCss : "um-grid-style",
				 hideSearch:true,
				 allowCheckBox:false,
				 tdClick:true,
				 hasBorder:false
			});
		}
	}
	


	/**
	 * 中心设备运行指标
	 */
	{
		var list_url_state = "monitorSystem/querySystemList";
		//查询cpu  内存 等状态
		var list_col_state = [
							{text:'设备名称',name:"nodeName",
								render : function(nodeName,data) 
								{
									return data.nodeName+"("+data.nodeIp+")";
								}
							},
							{text:'CPU使用率',name:"cpu",
								render : function(cpu) 
								{
									if (cpu == -1) 
									{
										cpu = "0";
									}
									return '<circle class="dib" circle data-val="'+cpu+'" style="width:70px;height:70px"></circle>';
								}},
							{text:'内存使用率',name:"memoryInfo",
								render : function(memoryInfo) 
								{
									if(memoryInfo == "-1") {
										memoryInfo = 0;
									}
									return '<circle class="dib" circle data-val="'+memoryInfo+'" style="width:70px;height:70px"></circle>';
								}},
							{text:'硬盘使用率',name:"diskInfoVoList",
								render : function(diskInfoVoList) 
								{
									if (diskInfoVoList.length > 0)
									{
										var height = diskInfoVoList[0].diskUsedRate;
										if(diskInfoVoList[0].diskUsedRate == "-1") {
											height = 0;
										}
										return '<circle class="dib" circle data-val="'+height+'" style="width:70px;height:70px"></circle>';
									}
								}
							}
							// {text:'进程探测',name:"",
							// 	click:function(el)
						 //  		{
						 //  			detail_probe_init(el);
						 //  		},
						 //  		render: function() {
						 //  			return "<i class='icon-desktop' ></i>";
						 //  		}
							// }
					   ];
		
		systemstate_list({paramObj:null,isLoad:true,maskObj:$("#table_div_state").parent()});
		
		function systemstate_list(option)
		{
			g_grid.render($("#table_div_state"),{
				 header:list_col_state,
				 operWidth:"100px",
				 pageSize:15,
				 url:list_url_state,
				 paginator:false,
				 paramObj : option.paramObj,
				 isLoad : option.isLoad,
				 maskObj : option.maskObj,
				 gridCss : "um-grid-style",
				 hideSearch:true,
				 allowCheckBox:false,
				 // dbClick : detail_systemstate_init,
				 tdClick:true,
				 hasBorder:false,
				 cbf : function (){
				 	$("#table_div_state").find("[circle]").each(function (){
				 		plot.circlifulRender($(this) ,{value:$(this).attr("data-val")});
				 	});
				 }
			});
		}
		
		// function detail_systemstate_init(rowData)
		// {
		// 	$.ajax({
		// 		type: "GET",
		// 		url: "module/sys_manage/sys_base_config/system_health_tpl.html",
		// 		success :function(data)
		// 		{
		// 			g_dialog.dialog($(data).find("[id=systemstate_query_template]"),{
						
		// 				width:"450px",
		// 				init:init,
		// 				title:"中心设备运行指标",
		// 				isDetail:true
		// 			});
		// 		}
		// 	});

		// 	function init(el)
		// 	{
		// 		el.find("button[data-id='save']").remove();
		// 		var param = {
		// 				nodeId:rowData.nodeId,
		// 				nodeIp:rowData.nodeIp,
		// 				serverType:rowData.serverType,
		// 		};
		// 		um_ajax_post({
		// 			url : "monitorSystem/querySystemStatus",
		// 			maskObj : el,
		// 			paramObj : param,
		// 			successCallBack : function (data){
		// 				try
		// 				{
		// 					el.find('[data-id="nodeName"]').text(rowData.nodeName);
		// 					el.find('[data-id="nodeIp"]').text(rowData.nodeIp);
		// 					if(data.cpu == "-1" || data.cpu == undefined || data.cpu == "undefined")
		// 						el.find('[data-id="cpu"]').text("状态未知");
		// 					else
		// 						el.find('[data-id="cpu"]').text(data.cpu+"%");
		// 					if(data[0].memoryInfo == "-1")
		// 						el.find('[data-id="memoryInfo"]').text("状态未知");
		// 					else
		// 						el.find('[data-id="memoryInfo"]').text(data[0].memoryInfo+"%");
		// 					if(data[0].diskInfoVoList[0].diskUsedRate == "-1")
		// 						el.find('[data-id="diskUsedRate"]').text("状态未知");
		// 					else
		// 						el.find('[data-id="diskUsedRate"]').text(data[0].diskInfoVoList[0].diskUsedRate+"%");
		// 				}catch(e)
		// 				{
		// 					alert(e);
		// 				}

		// 			}
		// 		});
		// 	}
		// }
	}
	
	
	/**
	 * 代理服务器运行指标
	 */
	{
		var list_url_agent = "/monitorSystem/queryNodeList";
		//查询cpu  内存 等状态
		var list_col_agent = [
							{text:'代理服务器名称',name:"nodeName"},
							{text:'设备状态',name:"nodeStatus",
								render : function(nodeStatus) 
								{
									var color = "red";
									var tit = "异常";
									if(nodeStatus == 1) {
										color = "green";
										tit =  "存活";
									}
									return '<i class="icon-laptop" style="color:'+color+';font-size:17px" title="'+tit+'"></>';
								}
							},
							{text:'CPU使用率',name:"cpu",
								render : function(cpu ,rowData) 
								{
									if (rowData.nodeStatus != 1)
									{
										return "---";
									}
									if(cpu == "-1" || cpu == "-100.00") {
										cpu = 0;
									}

									return '<circle class="dib" circle data-val="'+cpu+'" style="width:70px;height:70px"></circle>';
								}
							},
							{text:'内存使用率',name:"memoryInfo",
								render : function(memoryInfo ,rowData) 
								{
									if (rowData.nodeStatus != 1)
									{
										return "---";
									}
									if(memoryInfo == "-1" || memoryInfo == "-100.00") {
										memoryInfo = 0;
									}
									return '<circle class="dib" circle data-val="'+memoryInfo+'" style="width:70px;height:70px"></circle>';
								}
							},
							{text:'硬盘使用率',name:"diskInfoVoList",
								render : function(diskInfoVoList ,rowData)
								{
									if (rowData.nodeStatus != 1)
									{
										return "---";
									}
									if (diskInfoVoList.length > 0)
									{
										var height = diskInfoVoList[0].diskUsedRate;
										if(diskInfoVoList[0].diskUsedRate == "-1") {
											height = 0;
										}
										return '<circle class="dib" circle data-val="'+height+'" style="width:70px;height:70px"></circle>';
									}
								}
							}
					   ];
		
		systemagent_list({paramObj:null,isLoad:true,maskObj:$("#table_div_agent").parent()});
		
		
		
		function systemagent_list(option)
		{
			g_grid.render($("#table_div_agent"),{
				 header:list_col_agent,
				 operWidth:"100px",
				 url:list_url_agent,
				 pageSize:15,
				 paginator:false,
				 paramObj : option.paramObj,
				 isLoad : option.isLoad,
				 maskObj : option.maskObj,
				 gridCss : "um-grid-style",
				 hideSearch:true,
				 allowCheckBox:false,
				 // dbClick : detail_systemagent_init,
				 tdClick:true,
				 hasBorder:false,
				 cbf : function (){
				 	$("#table_div_agent").find("[circle]").each(function (){
				 		plot.circlifulRender($(this) ,{value:$(this).attr("data-val")});
				 	});
				 }
			});
		}
		// function detail_systemagent_init(rowData)
		// {
		// 	$.ajax({
		// 		type: "GET",
		// 		url: "module/sys_manage/sys_base_config/system_health_tpl.html",
		// 		success :function(data)
		// 		{
		// 			g_dialog.dialog($(data).find("[id=systemagent_query_template]"),{
		// 				width:"450px",
		// 				init:init,
		// 				title:"代理服务器运行指标",
		// 				isDetail:true
		// 			});
		// 		}
		// 	});

		// 	function init(el)
		// 	{
		// 		el.find("button[data-id='save']").remove();
		// 		var param = {
		// 				nodeId:rowData.nodeId,
		// 				nodeIp:rowData.nodeIp,
		// 				serverType:rowData.serverType,
		// 		};
		// 		um_ajax_post({
		// 			url : "monitorSystem/queryNodeStatus",
		// 			maskObj : el,
		// 			paramObj : param,
		// 			successCallBack : function (data){
		// 				el.find('[data-id="nodeName"]').text(rowData.nodeName);
		// 				el.find('[data-id="nodeStatus"]').text(data.nodeStatus==1?"存活":"异常");
		// 				if(data.cpu == "-1"|| data.cpu == undefined || data.cpu == "undefined")
		// 					el.find('[data-id="cpu"]').text("状态未知");
		// 				else
		// 					el.find('[data-id="cpu"]').text(data.cpu+"%");
		// 				if(data.memoryInfo == "-1")
		// 					el.find('[data-id="memoryInfo"]').text("状态未知");
		// 				else
		// 					el.find('[data-id="memoryInfo"]').text(data.memoryInfo+"%");
		// 				if(data.diskInfoVoList[0] && data.diskInfoVoList[0].diskUsedRate == "-1")
		// 					el.find('[data-id="diskUsedRate"]').text("状态未知");
		// 				else
		// 					el.find('[data-id="diskUsedRate"]').text(data.diskInfoVoList[0]?data.diskInfoVoList[0].diskUsedRate+"%":"未知");
		// 			}
		// 		});
		// 	}
		// }
	}
	
	/**
	 * 公共函数区
	 */
	{
		function queryStatus(el)
		{
			var health_url = "tpl/sys_manage/sys_base_config/health.html";
			$.ajax({
				type: "GET",
				url: health_url,
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=user_query_template]"),{
						width:"450px",
						init:init,
						initAfter:initAfter,
						saveclick:save_click
					});
					$("#table_div_X").append($(data));
				}
			});
		}
		function detail_probe_init(el)
		{
			alert("进行远程探测");
		}
		function initDIV(el,data)
		{
			$.each(data,function(index,obj){
				var t = el.find("[name='"+index+"']");
				try
				{
					if(t[0].tagName.toUpperCase() == "SPAN")
					{
						t.text(obj);
					}
					else
					{
						t.val(obj);
					}
				}catch(e){}

			});
		}
		
		function time_init(tag)
		{
			$(tag).find(".form_datetime").datetimepicker({
					language: 'fr',
				    autoclose: true,
				    todayBtn: true,
				    startView : 2,
					minView : 1,
					format : "yyyy-mm-dd hh:00:00",
				    pickerPosition: "bottom-left"
			}).on("changeDate" ,function (ev){
				$(tag).find("#query_time_label").text(g_moment(ev.date).subtract(8 ,"hour").format("YYYY-MM-DD HH:00:00"));
			})
			$(tag).find("#query_time_label").text(g_moment().format("YYYY-MM-DD HH:mm:ss"));
			
			timeEvent_init(tag);
		}

		function timeEvent_init(tag)
		{
			$(tag).find(".form_datetime").click(function (){
				$(tag).find(".form_datetime").datetimepicker("show");
			});
		}
	}
	
	

	{
		function tree_init(queryEdMonitor_url,param,sec_tree,mask) 
		{
			um_ajax_get({
				url : queryEdMonitor_url,
				maskObj : mask,
				paramObj : param,
				successCallBack : function (_data) 
				{
					
					var data = _data.edmonitorstore;
					var datatemp = [];
					var id = 0;
					$.each(data,function(index,obj){
						$.each(obj,function(_id,tobj){
							datatemp[id] = tobj;
							id = id+1;
						});
							
					});
					data = datatemp;
					tree.render(sec_tree ,{
						zNodes : data,
						edit : true,
						expand : true,
						id  : "id",
						pId : "parentID",
						label : "label",
						zTreeOnClick : function (event ,treeId ,treeNode) 
						{
							
							$.ajax({
								type: "GET",
								url: "/tpl/sys_manage/sys_base_config/systemevent_tpl.html",
								success :function(data)
								{
									var tag = $("#systemeventmonitor_template").find(".systemeventmonitor-table");
									tag.html("");
//									tag.html($(data).find(gettreeNodePageId(treeNode.id)).html());
									var obj = getTemplateObject(treeNode.id);
									tag.html($(data).find("#"+obj.tempid).html());
									time_init(tag);
									//table_div_event_fault
									//alert($(data).find("#"+obj.tempid).html());
									obj.requestUrl(
											tag.find("#table_div_event_fault"),
											{paramObj:null,isLoad:true,maskObj:tag.find("#table_div_event_fault")}
											);
									if(treeNode.id == "baseinfo")
									{
										obj.timerStatus(tag,treeNode.monitorType);
									}
								}
							});
							$("#mask").hide();
						},
						beforeDrop : function(treeId, treeNodes, targetNode, moveType, isCopy) {	
							orig_parent_id = treeNodes[0].pId;
							return true;
						},
						onDrop : function (event ,treeId ,treeNodes ,targetNode ,moveType ,isCopy) 
						{
							var paramObj = new Object();
							console.log(targetNode);
							paramObj.sourceId = treeNodes[0].id;
							paramObj.sourcePid = orig_parent_id;
							paramObj.targetId = targetNode.id;
							paramObj.targetPid = targetNode.pId;
							if (moveType == "prev")
							{
								paramObj.point = "top";
							}
							if (moveType == "next")
							{
								paramObj.point = "bottom";
							}
							if (moveType == "inner")
							{
								paramObj.point = "append";
							}
							
							um_ajax_post({
								url : url.drop_url,
								paramObj : paramObj,
								successCallBack : function (){
									g_dialog.operateAlert();
									tree_init();
									current_selected_node_id = "";
									base_form_init();
									grid_init("user");
									grid_init("web");
									$("#mask").show();
								}
							});
						},
						dropPrev : function (treeId, nodes, targetNode){
							if (nodes[0].pId == targetNode.pId && !targetNode.isAdd)
							{
								return true;
							}
							else
							{
								return false;
							}
						},
						dropNext : function (treeId, nodes, targetNode){
							if (nodes[0].pId == targetNode.pId && !targetNode.isAdd)
							{
								return true;
							}
							else
							{
								return false;
							}
						}
					});
				}
			});
		}
	}

});
});



/**
 * 
 */

//var treeNodePageList = [];
//
//treeNodePageList["baseinfo"] = "baseinfo";
//treeNodePageList["default"] = "eventtable";
//
//function gettreeNodePageId(idName)
//{
//	if(		treeNodePageList[idName] == undefined || 
//			treeNodePageList[idName] == null || 
//			treeNodePageList[idName] == "")
//		return "#"+treeNodePageList["default"]+"_template";
//	return "#"+treeNodePageList[idName]+"_template";
//}
