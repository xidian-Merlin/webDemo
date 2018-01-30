$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 'js/plugin/workorder/workorder.js'] ,function (inputdrop ,tab,workorder){

var index_list_url = "monitorEventIgnore/queryStrategyList";

var index_list_col_header = [
							  {text:'策略名称',name:"eipName"},
							  {text:'策略状态',name:"eipStatusName" ,searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						{text:"启用" ,id:"1"},
							  						{text:"停用" ,id:"0"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "eipStatus"
									});
								}},
							  {text:'事件类型',name:"eventTypeName",
								searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						//{text:"安全事件" ,id:"1"},
							  						{text:"故障事件" ,id:"1"},
							  						{text:"性能事件" ,id:"2"}
							  						//{text:"链路故障事件" ,id:"4"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "eventType"
									});
								}},
							  {text:'创建人',name:"createUser",hideSearch:true},
							  {text:'创建时间',name:"enterDate",searchRender:function (el){
								index_render_div(el ,{type:"date", startKey:"enterStartDate" ,endKey:"enterEndDate"});
							  }}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

event_init();

event_notice_policy_list();

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});

	//批量删除
	$("#delete_btn").click(function (){
		index_list_batch_delete();
	});
}

function event_notice_policy_list()
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"100px",
		 url:index_list_url,
		 isLoad : true,
		 maskObj : "body",
		 dbClick:list_detail
	});
}

function list_detail(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/policy_manage/monitor_event_ignore_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"620px",
				init:init,
				title:"监控事件忽略策略查看",
				top:"20%",
				isDetail:true
			});
		}
	});

	function init(el)
	{
		um_ajax_get({
			url:"monitorEventIgnore/queryStrategyDetail",
			paramObj:{id:rowData.eipId},
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				el.umDataBind("render",data.strategyStore);
				if(data.strategyStore.eventType == "1")
				{
					el.find("[data-id=eventName]").text(data.strategyStore.faultName);
				}
				else if(data.strategyStore.eventType == "2")
				{
					el.find("[data-id=eventName]").text(data.strategyStore.perfName);
				}
				var eipCycle;
				var eipCyclePeriod;
				if(data.strategyStore.eipCycle == "1")
				{
					eipCycle = "天";
					eipCyclePeriod = "";
				}
				else if(data.strategyStore.eipCycle == "2")
				{
					eipCycle = "周";
					switch(data.strategyStore.eipCyclePeriod)
					{
						case "0":
						eipCyclePeriod =  "日";
						break;
						case "1":
						eipCyclePeriod =  "一";
						break;
						case "2":
						eipCyclePeriod =  "二";
						break;
						case "3":
						eipCyclePeriod =  "三";
						break;
						case "4":
						eipCyclePeriod =  "四";
						break;
						case "5":
						eipCyclePeriod =  "五";
						break;
						case "6":
						eipCyclePeriod =  "六";
						break;
					}
				}
				else if(data.strategyStore.eipCycle == "3")
				{
					eipCycle = "月";
					eipCyclePeriod = data.strategyStore.eipCyclePeriod+"日";
				}
				
				if(data.strategyStore.eipCycle != null && data.strategyStore.eipCycle != "-1")
				{
					el.find("[data-id=circle]").text("每"+eipCycle+eipCyclePeriod+" "+data.strategyStore.validityStart+"-"+data.strategyStore.validityEnd);
				}
				else
				{
					el.find("[data-id=circle]").text("无");
				}
			}
		});
	}
}
function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url : "monitorEventIgnore/delStrategy",
				paramObj : {eipId: rowData.eipId},
				successCallBack : function(data){
					event_notice_policy_list();
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}
//批量删除
function index_list_batch_delete()
{
	var target_attributed_id = [];

	target_attributed_id = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"eipId"})

	if(target_attributed_id.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	target_attributed_id = target_attributed_id.join(",");

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : "monitorEventIgnore/delStrategy",
				paramObj : {eipId : target_attributed_id},
				successCallBack : function(data){
					event_notice_policy_list({paramObj:null,isLoad:true,maskObj:"body"});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "监控事件忽略策略修改" : "监控事件忽略策略添加";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/monitor_event_ignore_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"900px",
				init:init,
				saveclick:save_click,
				title:title,
				top:"0"
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		workorder.assetInput(el.find("[date-type=asset]").eq(0) ,{idKey:"edId",required:true});
		var el_eipCyclePeriod = el.find("[data-id=eipCyclePeriod]");
		var el_validityStart = el.find("[data-id=validityStart]");
		var el_validityEnd = el.find("[data-id=validityEnd]");
		var el_table_left = el.find("[id=eventList_left_table]");
		var el_table_right = el.find("[id=eventList_right_table]");
		el.find("[data-id=eipCycle]").change(function(){
			el_eipCyclePeriod.removeAttr("disabled");
			el_eipCyclePeriod.find("option").remove();
			el_eipCyclePeriod.trigger("change");
			var tmp = $(this).val();
			if (tmp == "3")
			{
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					el_eipCyclePeriod.append('<option value="'+i+'">'+i+'</option>');
				}
				el_validityStart.removeAttr("disabled");
				el_validityEnd.removeAttr("disabled");
			}
			else if (tmp == "2")
			{
				// 添加周一至周日
				el_eipCyclePeriod.removeAttr("disabled");
				el_eipCyclePeriod.append('<option value="0">星期日</option>');
				el_eipCyclePeriod.append('<option value="1">星期一</option>');
				el_eipCyclePeriod.append('<option value="2">星期二</option>');
				el_eipCyclePeriod.append('<option value="3">星期三</option>');
				el_eipCyclePeriod.append('<option value="4">星期四</option>');
				el_eipCyclePeriod.append('<option value="5">星期五</option>');
				el_eipCyclePeriod.append('<option value="6">星期六</option>');

				el_validityStart.removeAttr("disabled");
				el_validityEnd.removeAttr("disabled");
			}
			else if (tmp == "1")
			{
				el_eipCyclePeriod.attr("disabled","disabled");
				el_validityStart.removeAttr("disabled");
				el_validityEnd.removeAttr("disabled");
			}
			else
			{
				el_eipCyclePeriod.attr("disabled","disabled");
				el_validityStart.attr("disabled","disabled");
				el_validityEnd.attr("disabled","disabled");
				el_validityStart.val("");
				el_validityEnd.val("");
				g_validate.clear([el_validityStart,el_validityEnd]);
			}
			$("[data-id=eipCyclePeriod]").trigger("change");
		});
		el_validityStart.click(function(){
			if($(this).val() == "")
			{
				$(this).val("00:00:00");
			}				
		});
		el_validityEnd.click(function(){
			if($(this).val() == "")
			{
				$(this).val("00:00:00");
			}				
		});
		g_formel.code_list_render({key:"faultclass",faultEventTypeEl:el.find("[data-id=eventTypeComboBox]"),screen:screen});
		el.find("[data-id=eventType]").change(function(){
			el.find("[data-id=eventTypeComboBox]").find("option").remove();
			if($(this).attr("data-flag") == "false")
			{
				g_grid.removeData(el_table_right ,{});
			}
			var tmp = $(this).val();
			if(tmp == "1")
			{
				g_formel.code_list_render({key:"faultclass",faultEventTypeEl:el.find("[data-id=eventTypeComboBox]"),screen:screen});
			}
			else if(tmp == "2")
			{
				g_formel.code_list_render({key:"perfclass",performEventTypeEl:el.find("[data-id=eventTypeComboBox]"),screen:screen});
			}
			event_list_get("-1");
			$(this).attr("data-flag","false");
		});
		el.find("[data-id=eventTypeComboBox]").change(function(){
			var eventType = el.find("[data-id=eventTypeComboBox]").val();
			event_list_get(eventType);
		});
		
		g_grid.render(el_table_right,{
			 header:[{text:"事件名称",name:"eventName"}],
			 data:[],
			 hideSearch:true,
			 paginator:false
		});
		// 左右按钮点击事件
		el.find("[id=chevron-left]").click(function (){
			var rightDataArray = g_grid.getData(el_table_right ,{chk:true});
			if (rightDataArray.length == 0)
			{
				g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
				return false;
			}
			g_grid.removeData(el_table_right);
			var eventType = el.find("[data-id=eventTypeComboBox]").val();
			event_list_get(eventType);
		});

		el.find("[id=chevron-right]").click(function (){
			var leftDataArray = g_grid.getData(el_table_left ,{chk:true});
			if (leftDataArray.length == 0)
			{
				g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
				return false;
			}
			g_grid.removeData(el_table_left);
			g_grid.addData(el_table_right ,leftDataArray);
		});

		if(rowData)
		{
			um_ajax_get({
				url:"monitorEventIgnore/queryStrategyDetail",
				paramObj:{id:rowData.eipId},
				isLoad:true,
				maskObj:"body",
				successCallBack:function(data){
					el.umDataBind("render",data.strategyStore);
					g_grid.addData(el_table_right ,data.eventStore);
					var edIdArray = data.strategyStore.entityDevice ? data.strategyStore.entityDevice.split(",") : [];
			  		var edNameArray = data.strategyStore.edName ? data.strategyStore.edName.split(",") : [];
			  		var dataArray = [];
			  		for (var i = 0; i < edNameArray.length; i++)
			  		{
			  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
			  		}
			  		inputdrop.addDataSelect(el.find("[id=entityDevice]"),{data:dataArray});
			  		el.find("[data-id=eipStatus]").trigger("change");
			  		el.find("[data-id=eventType]").attr("data-flag","true");
			  		el.find("[data-id=eventType]").trigger("change");
			  		el.find("[data-id=eipCycle]").trigger("change");
			  		el.find("[data-id=eipCyclePeriod]").val(data.strategyStore.eipCyclePeriod);
			  		el.find("[data-id=eipCyclePeriod]").trigger("change");
				}
			});
			return false;
		}
		event_list_get("-1");
	}

	function save_click(el,saveObj)
	{
		var startTime = el.find("[data-id=validityStart]").val();
		var endTime = el.find("[data-id=validityEnd]").val();  
	    if((startTime > endTime) || ((startTime == endTime) && ((startTime || endTime) != "")))
	    {  
	        g_dialog.dialogTip(el ,{msg:"执行时间的起始时间必须小于终止时间。"});
	        return false;  
	    }
		if(!g_validate.validate(el))
		{
			return false;
		}
		var eventIdArray = g_grid.getIdArray(el.find("[id=eventList_right_table]"),{attr:"eventId"});
		if(eventIdArray.length == 0)
		{
			g_dialog.operateAlert(el ,"请选择事件。" ,"error");
			return false;
		}
		if(el.find("[data-id=eventType]").val() == "1")
		{
			saveObj.faultEventTypeComboBox = el.find("[data-id=eventTypeComboBox]").val();
			saveObj.perfEventTypeComboBox = "-1";
		}
		else
		{
			saveObj.faultEventTypeComboBox = "-1";
			saveObj.perfEventTypeComboBox = el.find("[data-id=eventTypeComboBox]").val();
		}
		saveObj.eventId = eventIdArray.join(",");
		var url = "monitorEventIgnore/addStrategy";
		if(rowData)
		{
			url = "monitorEventIgnore/updStrategy";
			saveObj.eipId = rowData.eipId;
		}
		else
		{
			saveObj.sign = "1";
		}
		um_ajax_post({
			url:url,
			paramObj:saveObj,
			isLoad :true,
			maskObj:"body",
			successCallBack:function(data){
				g_dialog.hide(el);
				event_notice_policy_list();
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
	}

	function event_list_get(eventType)
	{
		var el = $("#edit_template");
		var typeValue = el.find("[data-id=eventType]").val();
		var eventType = eventType;
		var eventStore = g_grid.getData(el.find("[id=eventList_right_table]"));
		g_grid.render(el.find("[id=eventList_left_table]"),{
			 header:[{text:"事件名称",name:"eventName"}],
			 url:"monitorEventIgnore/queryEventNoSelected",
			 paramObj:{eventType:eventType,typeValue:typeValue,eventStore:eventStore},
			 isLoad:true,
			 maskObj:"body",
			 hideSearch:true,
			 paginator:false
		});
	}	
}
});
});