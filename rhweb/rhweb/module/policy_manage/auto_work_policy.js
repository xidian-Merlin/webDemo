$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 '/module/sys_manage/sys_base_config/system_health_public.js',
		 'js/plugin/workorder/workorder.js'] ,function (inputdrop ,tab,publicObj,workorder){

var index_list_url = "workorderstrategy/queryWorkOrderList";

var index_list_col_header = [
							  {text:'策略名称',name:"policyName",width:20},
							  {text:'策略状态',name:"polStatus",width:20,render:function (text){
							  	return (text == "1" ? "启用" : "停用");
							  },searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						{text:"启用" ,id:"1"},
							  						{text:"停用" ,id:"0"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "polStatus"
									});
							  }},
							  {text:'事件类型',width:20,name:"eventType",render:function (text){
							  	var msg;
							  	// (text == 1) && (msg = "安全事件");
							  	(text == 2) && (msg = "故障事件");
							  	(text == 3) && (msg = "性能事件");
							  	(text == 13) && (msg = "配置事件");
							  	// (text == 14) && (msg = "脆弱事件");
							  	return msg;
							  },searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						// {text:"安全事件" ,id:"1"},
							  						{text:"故障事件" ,id:"2"},
							  						{text:"性能事件" ,id:"3"},
							  						{text:"配置事件" ,id:"13"},
							  						// {text:"脆弱性事件" ,id:"14"},
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "eventType"
									});
							  }},
							  {text:'创建人',width:20,name:"createUserFullname"},
							  {text:'创建时间',width:20,name:"createDate"}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

var create_url = "workorderstrategy/addWorkOrderInfo";

var module_obj_update_url = "workorderstrategy/updWorkOrderInfo";

var module_obj_delete_url = "workorderstrategy/delWorkOrderInfo";

var module_obj_detail_url = "workorderstrategy/queryWorkOrderInfo";

var form_iplist_col_header = [
							  {text:'IP类型',name:"ipTypeName",width:35},
							  {text:'IP范围',name:"ipValue",width:65}
							 ];

event_init();

auto_work_policy_list();

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});
	$("#delete_btn").click(function (){
		index_list_delete();
	});
}

function auto_work_policy_list()
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"100px",
		 url:index_list_url,
		 isLoad : true,
		 maskObj : "body",
		 dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{
	var paramObj;
	if(rowData)
	{
		paramObj = rowData.policyId;
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick : function (){
				list_delete(paramObj);
			}
		});
	}
	else 
	{
		var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"policyId"})

		if(idArray.length == 0){
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}
		paramObj = idArray.join(",");
		list_delete(paramObj);
	}
	function list_delete(paramObj){
		um_ajax_post({
			url:module_obj_delete_url,
			paramObj:{policyId:paramObj},
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				g_dialog.operateAlert(null ,"操作成功！");
				auto_work_policy_list();
			}
		});
	}
}

function edit_template_init(rowData)
{
	var title = rowData ? "工单策略修改" : "工单策略添加";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/auto_work_policy_tpl.html",
		success :function(data)
		{
			var tag = $(data).find("[id=edit_template]");
			publicObj.initSelectAssociationData(tag,1);
			g_dialog.dialog(tag,{
				width:"900px",
				init:init,
				title:title,
				initAfter:initAfter,
				saveclick:save_click,
				top: "0"
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		
		// 事件类型change事件
		var select_eventType = el.find("[data-id=eventType]");
		// var el_sec_div = el.find("[id=sec_div]");
		var el_fault_div = el.find("[id=fault_div]");
		var el_perform_div = el.find("[id=perform_div]");
		var el_config_div = el.find("[id=config_div]");
		// var el_vulnerability_div = el.find("[id=vulnerability_div]");
		var event_type_div = el.find("[data-id=event_type_div]");
		select_eventType.change(function (){
			event_type_div.hide();
			event_type_div.eq(select_eventType.get(0).selectedIndex).show();
		});

		// 生效周期点击事件
		var PERIOD = el.find("[data-id=period]");
		el.find("[data-id=validityType]").change(function(){
			PERIOD.removeAttr("disabled");
			PERIOD.find("option").remove();
			PERIOD.trigger("change");
			var tmp = $(this).val();
			if (tmp == "3")
			{
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					PERIOD.append('<option value="'+i+'">'+i+'</option>');
				}
			}
			else if (tmp == "2")
			{
				// 添加周一至周日
				PERIOD.removeAttr("disabled");
				PERIOD.append('<option value="0">星期日</option>');
				PERIOD.append('<option value="1">星期一</option>');
				PERIOD.append('<option value="2">星期二</option>');
				PERIOD.append('<option value="3">星期三</option>');
				PERIOD.append('<option value="4">星期四</option>');
				PERIOD.append('<option value="5">星期五</option>');
				PERIOD.append('<option value="6">星期六</option>');
			}
			else if (tmp == "1")
			{
				PERIOD.attr("disabled","disabled");
			}
			PERIOD.trigger("change");
		});
		var VALIDITY_START = el.find("[data-id=validityStart]");
		var VALIDITY_END = el.find("[data-id=validityEnd]");
		VALIDITY_START.click(function(){
			if($(this).val() == "")
			{
				$(this).val("00:00:00");
			}				
		});
		VALIDITY_END.click(function(){
			if($(this).val() == "")
			{
				$(this).val("00:00:00");
			}				
		});

		// 通知方法点击事件--选中其他人
		el.find("[name=nobjType][value=3]").click(function(){
			if ($(this).is(":checked"))
			{
				inputdrop.setEnable(el.find("[id=userId]"));
			}
			else
			{
				inputdrop.setDisable(el.find("[id=userId]"));
			}
		});
		inputdrop.renderSelect(el.find("[id=userId]") ,{
									data : [],
									allowCheckBox : false,
									hideRemove : false,
									isSingle : true
								});
		// 通知对象点击事件
		el.find("[id=notice_obj_span]").click(function (){
			el.find("[name=nobjType][value=3]").is(":checked") && notice_obj_template_init(el.find("[id=userId]"));
		});

		// 资产名称初始化
		el.find("[date-type=asset]").each(function(){
			workorder.assetInput($(this),{idKey:"edId"});
		});
		
		// 安全事件
		// var el_startIp = el_sec_div.find("[data-id=startIpv4]");
		// var el_endIp = el_sec_div.find("[data-id=endIpv4]");
		// var el_ipV6 = el_sec_div.find("[data-id=ipV6]");
		// var ipList_table = el_sec_div.find("[id=ipList_table]");

		// // IP类型点击事件
		// g_grid.render(ipList_table,{
		// 	header:form_iplist_col_header,
		// 	data:[],
		// 	paginator:false,
		// 	isLoad:false,
		// 	hideSearch:true
		// });
		// var ip_radio = el_sec_div.find("[name=ip]")
		// ip_radio.click(function (){
		// 	if ($(this).val() == "ipV4")
		// 	{
		// 		el_startIp.removeAttr("disabled");
		// 		el_endIp.removeAttr("disabled");
		// 		el_ipV6.attr("disabled" ,"disabled");
		// 		el_ipV6.val("");
		// 		g_validate.clear([el_ipV6]);
		// 	}
		// 	else
		// 	{
		// 		el_startIp.attr("disabled" ,"disabled");
		// 		el_endIp.attr("disabled" ,"disabled");
		// 		el_ipV6.removeAttr("disabled");
		// 		el_startIp.val("");
		// 		el_endIp.val("");
		// 		g_validate.clear([el_startIp,el_endIp]);
		// 	}
		// });

		// // 右移事件
		// var ipList = [];
		// el_sec_div.find("[id=chevron-right]").click(function (){
		// 	if (!g_validate.validate(el_sec_div.find("[id=left_div]")))
		// 	{
		// 		return false;
		// 	}
		// 	if (!g_validate.ipValidate(el_startIp,el_endIp)){
		// 		return false;
		// 	}
		// 	if(el_sec_div.find("[name=ipType]:checked").size() == 0)
		// 	{
		// 		g_dialog.operateAlert("body" ,"请选择IP类型。" ,"error");
		// 		return false;
		// 	}
		// 	var ipType = [];
		// 	var ipTypeName = [];
		// 	el_sec_div.find("[name=ipType]").each(function (){
		// 		if ($(this).is(":checked"))
		// 		{
		// 			ipType.push($(this).val());
		// 			ipTypeName.push($(this).closest("label").find("span").text());
		// 		}
		// 	});
		// 	var obj = new Object();
		// 	obj.ip = el_sec_div.find("[name=ip]:checked").val();
		// 	obj.startIpv4 = el_startIp.val();
		// 	obj.endIpv4 = el_endIp.val();
		// 	obj.ipV6 = el_ipV6.val();
		// 	obj.startIpv4 && (obj.ipValue = obj.startIpv4 + "-" + obj.endIpv4);
		// 	obj.ipV6 && (obj.ipValue = obj.ipV6);
		// 	obj.ipType = ipType.join(",");
		// 	obj.ipTypeName = ipTypeName.join(",");
		// 	ipList.push(obj);
		// 	g_grid.addData(ipList_table ,ipList);
		// 	el_sec_div.find("[id=left_div]").find("[type=text]").val("");
		// 	el_sec_div.find("[name=ipType]").removeAttr("checked");
		// 	ipList = [];
		// });

		// // 左移事件
		// el_sec_div.find("[id=chevron-left]").click(function (){
		// 	var data = g_grid.getData(el_sec_div.find("[id=ipList_table]") ,{chk:true});
		// 	if (data.length == 0)
		// 	{
		// 		g_dialog.operateAlert("body" ,"请选择一条记录。" ,"error");
		// 		return false;
		// 	}
		// 	else if (data.length > 1)
		// 	{
		// 		g_dialog.operateAlert("body" ,"只允许选择一条记录。" ,"error");
		// 		return false;
		// 	}
		// 	else 
		// 	{
		// 		el_sec_div.find("[name=ipType]").removeAttr("checked","checked");
		// 		var ipType = data[0].ipType.split(",");
		// 		for (var i = 0; i < ipType.length; i++) {
		// 			el_sec_div.find("[name=ipType][value="+ipType[i]+"]").prop("checked","checked");
		// 		}
		// 		el_sec_div.find("[name=ip][value="+data[0].ip+"]").click();
		// 		if(data[0].ip == "ipV4")
		// 		{
		// 			el_startIp.val(data[0].startIpv4);
		// 			el_endIp.val(data[0].endIpv4);
		// 		}
		// 		else 
		// 		{
		// 			el_ipV6.val(data[0].ipV6);
		// 		}
		// 	}
		// 	g_grid.removeData(el_sec_div.find("[id=ipList_table]"));	
		// });
		if(rowData)
	  	{
		  	el.find("[data-id=eventType]").val(rowData.eventType);
		  	el.find("[data-id=eventType]").trigger("change");
		  	el.find("[type=checkbox]").removeAttr("checked","checked");
	  	}
	}

	function initAfter(el){
		// var el_sec_div = el.find("[id=sec_div]");
		var el_fault_div = el.find("[id=fault_div]");
		var el_perform_div = el.find("[id=perform_div]");
		var el_config_div = el.find("[id=config_div]");
		// var el_vulnerability_div = el.find("[id=vulnerability_div]");

		// var ipList_table = el_sec_div.find("[id=ipList_table]");

		g_dialog.waitingAlert(el.closest("[data-id=modal-body]"));

		 // 工单等级渲染
		um_ajax_get({
			url:"EventController/getInitStoreForPolicy",
			paramObj:{},
			isLoad:false,
			successCallBack:function(data){
				g_formel.selectEl_render(el.find("[data-id=workflowLevel]"),{
					data:data.slCodeList,
					text:"codename",
					id:"codevalue"
				});
				// 安全事件渲染
				// um_ajax_get({
			 //  	    url: "eventNoticeStrategy/querySecurityTree",
				//     isLoad: false,
				// 	  successCallBack:function (data){
				// 		  inputdrop.renderTree(el_sec_div.find('[id=policyAlarmId]') ,data.securityTreeStore);
				// 		  // 发生源设备类型渲染
				// 			um_ajax_get({
				// 				url:"securityWatchEvent/queryDeviceTree",
				// 				isLoad:false,
				// 				successCallBack:function(data){
				// 					inputdrop.renderTree(el_sec_div.find('[id=typeId]') ,data);
									// 故障事件名称
									eventName_render(el_fault_div.find("[id=faultId]"),{
										eventType:"2",
										cbf:function(){
										    codeList_render(el_fault_div.find('[id=faultTypeId]'),{
										    	key:"faultclass",
												cbf:function(){
													// 性能事件名称
													eventName_render(el_perform_div.find('[id=perfId]'),{
														eventType:"3",
														cbf:function(){
														    //性能事件类型
														    codeList_render(el_perform_div.find('[id=perfTypeId]'),{
														    	key:"perfclass",
														    	cbf:function(){
																	 // 配置事件名称
																	 eventName_render(el_config_div.find('[id=deviceId]'),{
																		eventType:"13",
																		cbf:function(){
																		    // 监控器名称
																			um_ajax_get({
																		  	    url: "workorderstrategy/queryMonitorList",
																			    isLoad: false,
																				  successCallBack:function (data){
																					   for(var i=0;i<data.length;i++)
																					    {
																					  		data[i].text = data[i].codename;
																					  		data[i].id = data[i].codevalue;
																					    }
																					    inputdrop.renderSelect(el_config_div.find('[id=monitorId]'),{
																					    	data:data
																					    });
																					  // 操作系统类型
																					  // codeList_render(el_vulnerability_div.find('[id=OSTypeId]'),{key:"osCodeList"});
																					  if(rowData)
																					  {
																					  	edit_template_render(el,rowData);
																					  }
																				}
																			});

																		 }
																	  });  
																  }
									        		 		});
									  					}					
									 				 });
												}
						            		});
										}
									});
					 // 			}
						// 	});
						// }
		    //     });	
	        }
	    });

	}
	function save_click(el ,saveObj)
	{
		// var ipList_table = el.find("[id=ipList_table]");
		// var el_sec_div = el.find("[id=sec_div]");
		var el_fault_div = el.find("[id=fault_div]");
		var el_perform_div = el.find("[id=perform_div]");
		var el_config_div = el.find("[id=config_div]");
		// var el_vulnerability_div = el.find("[id=vulnerability_div]");
		// var startTime = el.find("[data-id=validityStart]").val();
		// var endTime = el.find("[data-id=validityEnd]").val();  
		
	 //    if((startTime > endTime) || ((startTime == endTime) && ((startTime || endTime) != "")))
	 //    {  
	 //        g_dialog.operateAlert("body" ,"生效时间的起始时间必须小于终止时间。" ,"error");
	 //        return false;  
	 //    }
	 //    el.find("[data-id=startIpv4]").removeAttr("validate");
		// el.find("[data-id=endIpv4]").removeAttr("validate");
		// el.find("[data-id=ipV6]").removeAttr("validate");
	 //    var flag = true;

		var validate_div;
		var eventType = el.find("[data-id=eventType]").val();
		var obj = new Object();
		// obj.userDataStore = g_grid.getData(ipList_table);
		obj.userDataStore = [];
		obj.workOrderStore = saveObj;
		obj.workOrderStore.itsmStatus = "0";
		// if(eventType == "1")
		// {
		// 	obj.workOrderStore.continueThvalue = "";
		// 	obj.workOrderStore.polLevel = saveObj.polLevel.join(",");
		// 	obj.workOrderStore.ip = "";
		// }
		if(eventType == "2")
		{
			obj.workOrderStore.workflowName = el_fault_div.find("[data-id=workflowName]").val();
			obj.workOrderStore.workflowLevel = el_fault_div.find("[data-id=workflowLevel]").val();
			obj.workOrderStore.edId = saveObj.faultAssetName;
			obj.workOrderStore.polLevel = saveObj.faultTypeId;
			obj.workOrderStore.policyAlarmId = saveObj.faultId;
			obj.workOrderStore.continueThvalue = el_fault_div.find("[data-id=continueThvalue]").val();
			validete_div = el_fault_div;
		}
		else if(eventType == "3")
		{
			obj.workOrderStore.workflowName = el_perform_div.find("[data-id=workflowName]").val();
			obj.workOrderStore.workflowLevel = el_perform_div.find("[data-id=workflowLevel]").val();
			obj.workOrderStore.edId = saveObj.perfAssetName;
			obj.workOrderStore.polLevel = saveObj.perfTypeId;
			obj.workOrderStore.policyAlarmId = saveObj.perfId;
			obj.workOrderStore.continueThvalue = el_perform_div.find("[data-id=continueThvalue]").val();
			validete_div = el_perform_div;
		}
		else if(eventType == "13")
		{
			obj.workOrderStore.workflowName = el_config_div.find("[data-id=workflowName]").val();
			obj.workOrderStore.workflowLevel = el_config_div.find("[data-id=workflowLevel]").val();
			obj.workOrderStore.edId = saveObj.deviceAssetName;
			obj.workOrderStore.policyAlarmId = saveObj.deviceId;
			obj.workOrderStore.continueThvalue = "";
			validete_div = el_config_div;
		}
		// else if(eventType == "14")
		// {
		// 	obj.workOrderStore.workflowName = el_vulnerability_div.find("[data-id=workflowName]").val();
		// 	obj.workOrderStore.workflowLevel = el_vulnerability_div.find("[data-id=workflowLevel]").val();
		// 	obj.workOrderStore.appAname = saveObj.vulnerAssetName;
		// 	obj.workOrderStore.continueThvalue = "";
		// 	obj.workOrderStore.polLevel = saveObj.OSTypeId;
		// }

		if(!(g_validate.validate(el.find("[id=main_div]")) || g_validate.validate(validete_div)))
		{
		 	return false;
		}
		var url = create_url;
		if(rowData)
		{
			url = module_obj_update_url;
			obj.workOrderStore.oldPolStatus = rowData.polStatus;
			obj.workOrderStore = $.extend(true, rowData,obj.workOrderStore);
			
		}
		um_ajax_post({
			url : url,
			paramObj : obj,
			isLoad:true,
			maskObj:"body",
			successCallBack : function (data){
				g_dialog.hide(el);
				g_dialog.operateAlert(null ,"操作成功！");
				auto_work_policy_list();
			}
		});
	}
}

function edit_template_render(el ,rowData){
	var eventType = rowData.eventType;
	um_ajax_get({
		url:"workorderstrategy/queryWorkOrderDetail",
		paramObj:{policyId:rowData.policyId},
		isLoad:false,
		successCallBack:function(data){
			el.umDataBind("render",data);
			var noticeType = data.noticeType.split(",");
			for (var i = 0; i < noticeType.length; i++) {
				el.find("[name=noticeType][value="+noticeType[i]+"]").prop("checked","checked");
			}
			var nobjType = data.nobjType.split(",");
			for (var i = 0; i < nobjType.length; i++) {
				if(nobjType[i] == "3")
				{
					el.find("[name=nobjType][value=3]").prop("checked","checked");
					inputdrop.setEnable(el.find("[id=userId]"));
				    var userArray = [];
		  			var userIdArray = data.userId ? data.userId.split(",") : [];
		  			var userStrArray = data.userIdStr ? data.userIdStr.split(",") : [];
		  			for (var i = 0; i < userIdArray.length; i++) {
		  				userArray.push({id:userIdArray[i] ,text:userStrArray[i]});
		  			}
		  			inputdrop.addDataSelect(el.find("[id=userId]"),{data:userArray});
				}
				el.find("[name=nobjType][value="+nobjType[i]+"]").prop("checked","checked");
			}

			if(eventType == "2")
			{
				inputdrop.setDataSelect(el.find("[id=faultId]"),data.policyAlarmId);
				inputdrop.setDataSelect(el.find("[id=faultTypeId]"),data.polLevel);
				var edIdArray =  data.edId.split(",");
		  		var edNameArray =  data.edName.split(",");
		  		var dataArray = [];
		  		for (var i = 0; i < edNameArray.length; i++)
		  		{
		  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
		  		}
		  		inputdrop.addDataSelect(el.find("[id=faultAssetName]"),{data:dataArray});
		  		el.find("[id=fault_div]").find("[data-id=continueThvalue]").val(data.continueThvalue);
			}
			else if(eventType == "3")
			{
				inputdrop.setDataSelect(el.find("[id=perfId]"),data.policyAlarmId);
				inputdrop.setDataSelect(el.find("[id=perfTypeId]"),data.polLevel);
				var edIdArray =  data.edId.split(",");
		  		var edNameArray =  data.edName.split(",");
		  		var dataArray = [];
		  		for (var i = 0; i < edNameArray.length; i++)
		  		{
		  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
		  		}
		  		inputdrop.addDataSelect(el.find("[id=perfAssetName]"),{data:dataArray});
		  		el.find("[id=perform_div]").find("[data-id=continueThvalue]").val(data.continueThvalue);
		  		el.find("[id=perform_div]").find("[data-id=outThvalue]").val(data.outThvalue);
			}
			else if(eventType == "13")
			{
				inputdrop.setDataSelect(el.find("[id=deviceId]"),data.policyAlarmId);
		  		inputdrop.setDataSelect(el.find("[id=monitorId]"),data.monitorId);
				var edIdArray =  data.edId.split(",");
		  		var edNameArray =  data.edName.split(",");
		  		var dataArray = [];
		  		for (var i = 0; i < edNameArray.length; i++)
		  		{
		  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
		  		}
		  		inputdrop.addDataSelect(el.find("[id=deviceAssetName]"),{data:dataArray});
		  		el.find("[id=config_div]").find("[data-id=keywords]").val(data.keywords);

			}
			el.find("[data-type=select]").trigger('change');
			el.find("[data-id=period]").val(data.period);
			el.find("[data-id=period]").trigger('change');
		}
	});
}

function detail_template_init(rowData)
{
	var eventType = rowData.eventType;
	$.ajax({
		type: "GET",
		url: "module/policy_manage/auto_work_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"700px",
				title:"自动工单策略查看",
				init:init,
				isDetail:true
			});
		}
	});

	function init(el)
	{
		var el_event_type_div = el.find("[data-flag=event_type_div]");
		if(eventType == 2)
		{
			el_event_type_div.not("[id=fault_div]").remove();
		}
		else if(eventType == 3)
		{
			el_event_type_div.not("[id=perform_div]").remove();
		}
		else if(eventType == 13)
		{
			el_event_type_div.not("[id=config_div]").remove();
		}
		um_ajax_get({
			url:module_obj_detail_url,
			paramObj:{policyId:rowData.policyId},
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				el.umDataBind("render",data);
				data.polStatus == "1" && el.find("[data-id=polStatus]").text("启用");
				data.polStatus == "0" && el.find("[data-id=polStatus]").text("停用");

				data.eventType == "2" && el.find("[data-id=eventType]").text("故障事件");
				data.eventType == "3" && el.find("[data-id=eventType]").text("性能事件");
				data.eventType == "13" && el.find("[data-id=eventType]").text("配置事件");

				data.mergerStatus == "1" && el.find("[data-id=mergerStatus]").text("是");
				data.mergerStatus == "0" && el.find("[data-id=mergerStatus]").text("否");

				data.workflowLevel == "0" && el.find("[data-id=workflowLevel]").text("很高");
				data.workflowLevel == "1" && el.find("[data-id=workflowLevel]").text("高");
				data.workflowLevel == "2" && el.find("[data-id=workflowLevel]").text("中");
				data.workflowLevel == "3" && el.find("[data-id=workflowLevel]").text("低");
				data.workflowLevel == "4" && el.find("[data-id=workflowLevel]").text("很低");
			}
		});
	}
}

function notice_obj_template_init(parentEl)
{
	var form_notice_sysuser_col_header = [
							  {text:'用户名',name:"user_FULLNAME"},
							  {text:'用户账号',name:"user_ACCOUNT"}
							 ];
	var form_notice_sysuser_url =  "workorderstrategy/queryUserList";
	var form_notice_secuser_col_header = [
								  {text:'用户名',name:"user_FULLNAME"},
								  {text:'所属安全域',name:"user_ACCOUNT"}
								 ];
	var form_notice_secuser_url =  "workorderstrategy/queryDomaUserList";
	// 用户组调用接口
	var form_user_group_url = "workorderstrategy/queryUserGroup";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/event_notice_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=notice_obj_template]"),{
				width:"560px",
				init:init,
				title:"通知人",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		tab.tab(el.find("[id=tab]"),
					{
						oper:[function (){
							// 渲染系统用户列表
							g_grid.render(el.find("[id=noticeList_table1]"),{
								header:form_notice_sysuser_col_header,
								url:form_notice_sysuser_url,
								paramObj:{unuserIds:userIds ,aggregation:1},
								paginator:false,
								hideSearch:true
							});
						},function (){
							// 渲染安全域用户列表
							g_grid.render(el.find("[id=noticeList_table2]"),{
								header:form_notice_secuser_col_header,
								url:form_notice_secuser_url,
								paramObj:{queryFlag:"2"},
								paginator:false,
								hideSearch:true
							});
						}]
					}
				);

		var userIds = parentEl.find("[data-type=id_inp]").val();

		// 渲染用户组别
		var el_user_group_sel = el.find("[data-id=user_group_sel]");

		um_ajax_get({
			url : form_user_group_url,
			isLoad : false,
			successCallBack : function (data){
				for (var i=0;i<data.length;i++)
				{
					i!=0 &&
					(el_user_group_sel.append('<option  value="'+data[i].usergId+'">'+data[i].usergName+'</option>'));
				}
				el_user_group_sel.change(function (){
					g_grid.render(el.find("[id=noticeList_table1]"),{
						header:form_notice_sysuser_col_header,
						url:form_notice_sysuser_url,
						paramObj:{unuserIds:userIds ,groupId:el_user_group_sel.val()},
						paginator:false,
						hideSearch:true
					});
				});
			}
		});
	}

	function save_click (el)
	{
		if (el.find("[data-id=tab-ul]").find("li").eq(0).hasClass("active"))
		{
			var dataList = g_grid.getData(el.find("[id=noticeList_table1]") ,{chk:true});
		}
		else
		{
			var dataList = g_grid.getData(el.find("[id=noticeList_table2]") ,{chk:true});
		}
		
		var fullNamebuffer = [];
		var idBuffer = [];
		var dataArray = [];
		for (var i = 0; i < dataList.length; i++) {
			fullNamebuffer.push(dataList[i].user_FULLNAME);
			idBuffer.push(dataList[i].user_ID);
			dataArray.push({id:dataList[i].user_ID ,text:dataList[i].user_FULLNAME});
		}
		if (idBuffer.length > 0)
		{
			g_validate.clear(parentEl);
		}
		inputdrop.addDataSelect(parentEl ,{data : dataArray});
		return true;
	}
}

// 类型codelist获取
function codeList_render(el,opt)
{
	 um_ajax_get({
        url:"rpc/getCodeList",
        paramObj:{key:opt.key},
        isLoad: false,
	    successCallBack:function (data){
	    	var data = data[opt.key];
	    	var array = [];
		    for (var i = 0; i < data.length; i++) {
		    	data[i].id = data[i].codevalue;
		    	data[i].text = data[i].codename;
		    	if(data[i].codevalue != "-1")
		    	{
		    		array.push(data[i]);
		    	}
		    }
		    inputdrop.renderSelect(el,{
		    	data:array
		    });
		    opt.cbf && opt.cbf();
		 }
	});
}
// 事件名称渲染
function eventName_render(el,opt)
{
	um_ajax_get({
        url:"workorderstrategy/queryEventName",
        paramObj:{eventType:opt.eventType},
	    isLoad: false,
	    successCallBack:function (data){
		    for(var i=0;i<data.length;i++)
		    {
		    	data[i].id = data[i].codevalue;
		    	data[i].text = data[i].codename;
		    }
		    inputdrop.renderSelect(el,{
		    	data:data
		    });
		    opt.cbf && opt.cbf();
		}
	});
}
});
});