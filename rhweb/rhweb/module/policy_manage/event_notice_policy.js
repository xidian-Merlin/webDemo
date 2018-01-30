$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 'js/plugin/workorder/workorder.js'] ,function (inputdrop ,tab,workorder){


var index_list_url = "eventNoticeStrategy/queryStrategyList";

var index_list_col_header = [
							  {text:'策略名称',name:"enftpName"},
							  {text:'策略状态',name:"enftpStatus",render:function(text){
									if (text ==1) {
										return '启用';
									}
									else{
										return '停用';
									}
								} ,searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						{text:"启用" ,id:"1"},
							  						{text:"停用" ,id:"0"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "enftpStatus"
									});
								}},
							  {text:'事件类型',name:"eventType",render:function(text){
									if (text ==1) {
										return '安全事件';
									}
									else if(text == 2){
										return '故障事件';
									}
									else if(text == 3){
										return '性能事件';
									}
									else{
										return '链路故障事件';
									}
								},
								searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						//{text:"安全事件" ,id:"1"},
							  						{text:"故障事件" ,id:"2"},
							  						{text:"性能事件" ,id:"3"}
							  						//{text:"链路故障事件" ,id:"4"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "eventType"
									});
								}},
							  {text:'创建时间',name:"enterDate",searchRender:function (el){
								index_render_div(el ,{type:"date", startKey:"enterStartDate" ,endKey:"enterEndDate"});
							  }},
							  {text:'创建人',name:"createUser",hideSearch:true}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

var module_obj_create_url = "eventNoticeStrategy/addStrategy";

var module_obj_update_url = "eventNoticeStrategy/updStrategy";

var module_obj_delete_url = "eventNoticeStrategy/delStrategy";

var module_obj_detail_for_update_url = "eventNoticeStrategy/queryEventNoticeStr";

var module_obj_detail_url = "eventNoticeStrategy/queryStrategyDetail";

var form_iplist_url = "assetInterfaceManage/queryAssetList";

var form_iplist_col_header = [
							  {text:'IP类型',name:"ipTypeName",width:35},
							  {text:'IP范围',name:"ipRange",width:65}
							 ];
var form_userlist_url =  "eventNoticeStrategy/queryCreateUser";

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


var sec_event_type_val = 1;
var fault_event_type_val = 2;
var perf_event_type_val = 3;

event_init();

event_notice_policy_list({paramObj:null,isLoad:true,maskObj:"body"});

function index_list_batch_delete()
{
	var target_attributed_id = [];

	target_attributed_id = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"enftpId"})

	if(target_attributed_id.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	target_attributed_id = target_attributed_id.join(",");

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {enftpId : target_attributed_id},
				successCallBack : function(data){
					event_notice_policy_list({paramObj:null,isLoad:true,maskObj:"body"});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});
	
	$("#delete_btn").click(function (){
		index_list_batch_delete();
	});

	index_search_div_remove_click(event_notice_policy_list,
									{paramObj:null,isLoad:true});
}

function event_notice_policy_list(option)
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"100px",
		 url:index_list_url,
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {enftpId: rowData.enftpId},
				successCallBack : function(data){
					event_notice_policy_list({maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}


function edit_template_init(rowData)
{
	var title = rowData ? "事件通知策略修改" : "事件通知策略添加";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/event_notice_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"850px",
				init:init,
				initAfter:initAfter,
				saveclick:save_click,
				title:title,
				top:"10%",
				autoHeight:"autoHeight"
			});
		}
	});

	function init(el)
	{
		var ipList_table = el.find("[id=ipList_table]");
		// 事件类型change事件
		var select_eventType = el.find("[data-id=eventType]");
		var event_type_div = el.find("[data-id=event_type_div]");
		select_eventType.change(function (){
			event_type_div.hide();
			event_type_div.eq(select_eventType.get(0).selectedIndex).show();
		});

		var el_startIp = el.find("[data-id=startIp]");
		var el_endIp = el.find("[data-id=endIp]");
		var el_ipV6 = el.find("[data-id=ipV6]");

		// IP类型点击事件
		var ipVersion_radio = el.find("[name=ipVersion]")
		ipVersion_radio.click(function (){
			if ($(this).val() == "1")
			{
				el_startIp.removeAttr("disabled");
				el_endIp.removeAttr("disabled");
				el_ipV6.attr("disabled" ,"disabled");
				g_validate.clear(el_ipV6);
				el_ipV6.val("");
			}
			else
			{
				el_startIp.attr("disabled" ,"disabled");
				el_endIp.attr("disabled" ,"disabled");
				el_ipV6.removeAttr("disabled");
				g_validate.clear([el_startIp ,el_endIp]);
				el_startIp.val("");
				el_endIp.val("");
			}
		});

		// 右移事件
		var ipList = [];
		el.find("[id=chevron-right]").click(function (){
			if (!g_validate.validate($("#left")))
			{
				return false;
			}
			if (!g_validate.ipValidate(el.find("[data-id=startIp]") ,el.find("[data-id=endIp]"))){
				return false;
			}	
			el.find("[name=ipType]").each(function (){
				if ($(this).is(":checked"))
				{
					var obj = new Object();
					obj.ipType = $(this).val();
					obj.ipTypeName = $(this).closest("label").find("span").text();
					obj.ipAddrType = el.find("[name=ipVersion]:checked").val();
					obj.startIp = el_startIp.val();
					obj.endIp = el_endIp.val();
					obj.ipV6 = el_ipV6.val();
					obj.startIp && (obj.ipRange = obj.startIp + "-" + obj.endIp);
					obj.ipV6 && (obj.ipRange = obj.ipV6);
					ipList.push(obj);
				}
			});
			if (ipList.length == 0)
			{
				g_dialog.operateAlert(el ,"请选择IP类型" ,"error");
				return false;
			}
			g_grid.addData(el.find("[id=ipList_table]") ,ipList);

			el.find("[id=left]").find("[type=text]").val("");
			el.find("[name=ipType]").removeAttr("checked");
			ipList = [];
		});

		// 左移事件
		el.find("[id=chevron-left]").click(function (){
			var data = g_grid.getData(el.find("#ipList_table") ,{chk:true});
			if (data.length == 0)
			{
				g_dialog.operateAlert(el ,"请选择一条记录。" ,"error");
			}
			else if (data.length > 1)
			{
				g_dialog.operateAlert(el ,"只允许选择一条记录。" ,"error");
			}
			else 
			{
				el.find("[name=ipType][value="+data[0].ipType+"]")[0].checked =true;
				el.find("[name=ipVersion][value="+data[0].ipAddrType+"]").click();
				if(data[0].ipRange.indexOf("-")>0)
				{	
					var array = data[0].ipRange.split("-");
					el_startIp.val(array[0]);
					el_endIp.val(array[1]);
				}
				else 
				{
					el_ipV6.val(data[0].ipRange);
				}
			}
			g_grid.removeData(el.find("[id=ipList_table]"));	
		});

		var el_sec_div = el.find("[id=sec_div]");
		var el_fault_div = el.find("[id=fault_div]");
		var el_perform_div = el.find("[id=perform_div]");

		// 安全事件 - 通知方法点击事件
		var el_notice_type = el_sec_div.find("[name=notice_type]");
		el_notice_type.click(function (){
			if (el_sec_div.find("[name=notice_type]:checked").size() == 0)
			{
				el.find("[id=noticeUserList1]").removeClass("no-write");
				el.find("[id=noticeUserList1]").attr("disabled" ,"disabled");
				el.find("[id=noticeUserList1]").val("");
			}
			else
			{
				el.find("[id=noticeUserList1]").addClass("no-write");
				el.find("[id=noticeUserList1]").attr("readonly" ,"readonly");
				el.find("[id=noticeUserList1]").removeAttr("disabled");
			}
		});

		// 安全事件 - 通知对象点击事件
		el_sec_div.find("[id=notice_obj_span]").click(function (){
			el_sec_div.find("[name=notice_type]:checked").size() != 0 &&
			notice_obj_template_init($("#noticeUserList1"));
		});

		// 故障事件 - 通知方法点击事件
		var el_notice_type = el_fault_div.find("[name=notice_type1]");
		el_notice_type.click(function (){
			if (el_fault_div.find("[name=notice_type1]:checked").size() == 0)
			{
				inputdrop.setDisable(el_fault_div.find("[id=noticeUserList1]"));
			}
			else
			{
				inputdrop.setEnable(el_fault_div.find("[id=noticeUserList1]"));
			}
		});

		inputdrop.renderSelect(el_fault_div.find("[id=noticeUserList1]") ,{
												data : [],
												allowCheckBox : false,
												hideRemove : false,
												isSingle : true
											});

		// 故障事件 - 通知对象点击事件
		el_fault_div.find("[id=notice_obj_span]").click(function (){
			el_fault_div.find("[name=notice_type1]:checked").size() != 0 &&
			notice_obj_template_init(el_fault_div.find("[id=noticeUserList1]"));
		});

		// 故障事件 - 资产点击事件
		workorder.assetInput(el.find("[date-type=asset]").eq(0) ,{idKey:"edId",required:true});
		

		// 性能事件 - 通知方法点击事件
		var el_notice_type = el_perform_div.find("[name=notice_type2]");
		el_notice_type.click(function (){
			if (el_perform_div.find("[name=notice_type2]:checked").size() == 0)
			{
				inputdrop.setDisable(el_perform_div.find("[id=noticeUserList2]"));
			}
			else
			{
				inputdrop.setEnable(el_perform_div.find("[id=noticeUserList2]"));
			}
		});

		inputdrop.renderSelect(el_perform_div.find("[id=noticeUserList2]") ,{
												data : [],
												allowCheckBox : false,
												hideRemove : false,
												isSingle : true
											});

		// 性能事件 - 通知对象点击事件
		el_perform_div.find("[id=notice_obj_span]").click(function (){
			el_perform_div.find("[name=notice_type2]:checked").size() != 0 &&
			notice_obj_template_init(el_perform_div.find("[id=noticeUserList2]"));
		});

		// 性能事件 - 资产点击事件
		workorder.assetInput(el.find("[date-type=asset]").eq(1) ,{idKey:"edId" ,required:true});

		g_validate.init(el);
	}

	function initAfter(el){
		var el_sec_div = el.find("[id=sec_div]");
		var fault_div = el.find("[id=fault_div]");
		var perform_div = el.find("[id=perform_div]");

		var ipList_table = el.find("[id=ipList_table]");

		g_dialog.waitingAlert(el);

		g_grid.render(ipList_table,{
			data:[],
			header:form_iplist_col_header,
			paginator:false,
			isLoad:false,
			hideSearch:true
		});
		
		el.find("select").trigger("change");

		um_ajax_get({
	  	    url: "eventNoticeStrategy/querySecurityTree",
		    isLoad: false, 
			  successCallBack:function (data){
				  inputdrop.renderTree(el_sec_div.find('[id=securityId]') ,data.securityTreeStore ,{chkboxType:{ "Y": "ps", "N": "ps" }});

				  um_ajax_get({
				  	    url: "eventNoticeStrategy/queryFaultTree",
					    isLoad: false,
						  successCallBack:function (data){
							  inputdrop.renderTree(fault_div.find('[id=faultId]') ,data.faultTreeStore ,{chkboxType:{ "Y": "ps", "N": "ps" }});

							  um_ajax_get({
						  	    url: "eventNoticeStrategy/queryPerfTree",
							    isLoad: false,
								  successCallBack:function (data){
									  inputdrop.renderTree(perform_div.find('[id=perfId]') ,data.perfTreeStore ,{chkboxType:{ "Y": "ps", "N": "ps" }});
									  if (!rowData)
									  {
										g_dialog.waitingAlertHide(el.closest("[data-id=modal-body]"));
									  }
									  // 数据回显
								      if (rowData)
									  {
										  um_ajax_get({
											  url : module_obj_detail_for_update_url,
											  paramObj : {id:rowData.enftpId},
											  isLoad: false,
											  successCallBack : function (data){
												  edit_template_render(el ,data ,rowData);
												  //回显通知人调详情url
												  um_ajax_get({
												  	url : module_obj_detail_url,
												  	paramObj : {id:rowData.enftpId ,eventType:rowData.eventType},
												  	isLoad : false,
												  	successCallBack : function(data){
												  		if(rowData.eventType ==1){
													  		el.find("[id=noticeUserList1]").val(data.strategyStore.secNoticeUserStr);
													  		el.find("[data-id=noticeUserList1]").val(data.strategyStore.secNoticeUserIds);
													  		el.find("[id=noticeUserList1]").addClass("no-write");
												  		}
												  		if(rowData.eventType ==2){
												  			var noticeUserArray = [];
												  			var noticeUserIdArray = data.strategyStore.otherNoticeUserIds ? data.strategyStore.otherNoticeUserIds.split(",") : [];
												  			var noticeUserStrArray = data.strategyStore.otherNoticeUserStr ? data.strategyStore.otherNoticeUserStr.split(",") : [];
												  			for (var i = 0; i < noticeUserIdArray.length; i++) {
												  				noticeUserArray.push({id:noticeUserIdArray[i] ,text:noticeUserStrArray[i]});
												  			}
												  			inputdrop.addDataSelect(el.find("[id=noticeUserList1]"),{data:noticeUserArray});

													  		var edIdArray = data.strategyStore.edIdStr ? data.strategyStore.edIdStr.split(",") : [];
													  		var edNameArray = data.strategyStore.edNameStr ? data.strategyStore.edNameStr.split(",") : [];
													  		var dataArray = [];
													  		for (var i = 0; i < edIdArray.length; i++)
													  		{
													  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
													  		}
													  		inputdrop.addDataSelect(el.find("[id=assetId1]"),{data:dataArray});
												  		}
												  		if(rowData.eventType ==3){
												  			var noticeUserArray = [];
												  			var noticeUserIdArray = data.strategyStore.otherNoticeUserIds.split(",");
												  			var noticeUserStrArray = data.strategyStore.otherNoticeUserStr.split(",");
												  			for (var i = 0; i < noticeUserIdArray.length; i++) {
												  				noticeUserArray.push({id:noticeUserIdArray[i] ,text:noticeUserStrArray[i]});
												  			}
												  			inputdrop.addDataSelect(el.find("[id=noticeUserList2]"),{data:noticeUserArray});

													  		var edIdArray = data.strategyStore.edIdStr ? data.strategyStore.edIdStr.split(",") : [];
													  		var edNameArray = data.strategyStore.edNameStr ? data.strategyStore.edNameStr.split(",") : [];
													  		var dataArray = [];
													  		for (var i = 0; i < edIdArray.length; i++)
													  		{
													  			dataArray.push({id:edIdArray[i] ,text:edNameArray[i]})
													  		}
													  		inputdrop.addDataSelect(el.find("[id=assetId2]"),{data:dataArray});
												  		}
												  		el.find("[id=edit_template]").css("opacity" ,1);
												  		g_dialog.waitingAlertHide(el);
												  	}
												  });										  
											  }
										  });
									   }
									   else
									   {
									   		el.find("[id=edit_template]").css("opacity" ,1);
									   		g_dialog.waitingAlertHide(el);
									   }
								  }
							  });
						}
				  });
			  }
		});
	}

	function save_click(el ,saveObj)
	{
		//确定之前不校验左边的ip
		el.find("[data-id=ipV6]").removeAttr("validate");
		el.find("[data-id=startIp]").removeAttr("validate");
		el.find("[data-id=endIp]").removeAttr("validate");

		var flag = true;

		var formel;
		if (saveObj.eventType == 1){
			formel = el.find("#sec_div");
		}
		if (saveObj.eventType == 2){
			formel = el.find("#fault_div");
		}
		if (saveObj.eventType == 3){
			formel = el.find("#perform_div");
		}
		if (!g_validate.validate(formel))
		{
			flag = false;
		}
		if (!g_validate.validate($("#main_div")))
		{
			flag = false;
		}

		var ipList_table = el.find("[id=ipList_table]");

		saveObj.ipLists = g_grid.getData(ipList_table);

		var el_sec_div = el.find("[id=sec_div]");
		var fault_div = el.find("[id=fault_div]");
		var perform_div = el.find("[id=perform_div]");

		// 通知方法
		var el_notice_type = el_sec_div.find("[name=notice_type]");
		el_notice_type.each(function (i){
			if (i == 0)
			{
				saveObj.emailNotice1 = ($(this).is(":checked")?1:0);
			}
			else
			{
				saveObj.smsNotice1 = ($(this).is(":checked")?1:0);
			}
		});
		var obj = new Object();
		obj.enftpId = saveObj.enftpId;
		obj.eventType = saveObj.eventType;
		obj.enftpName = saveObj.enftpName;
		obj.enftpStatus = saveObj.enftpStatus;

		if (saveObj.eventType == 1)
		{
			if (saveObj.ipLists.length == 0)
			{
				g_dialog.operateAlert(el ,"请将IP地址添加到列表中。" ,"error");
				flag = false;
			}
			var el_notice_type = el_sec_div.find("[name=notice_type]");
			el_notice_type.each(function (i){
				if (i == 0)
				{
					obj.emailStatus = ($(this).is(":checked")?1:0);
				}
				else
				{
					obj.smsStatus = ($(this).is(":checked")?1:0);
				}
			});

			obj.eventIdStr = saveObj.securityId;
			obj.eventLevel = saveObj.eventLevel.join(",");
			obj.userIdStr = saveObj.noticeUserList1;
			obj.ipLists = saveObj.ipLists;
		}
		if (saveObj.eventType == 2)
		{
			if (fault_div.find("[name=notice_type1]:checked").size() == 0)
			{
				g_dialog.dialogTip(el ,{
					msg : "通知对象不能为空"
				});
				return false;
			}
			var el_notice_type = fault_div.find("[name=notice_type1]");
			el_notice_type.each(function (i){
				if (i == 0)
				{
					obj.emailStatus = ($(this).is(":checked")?1:0);
				}
				else
				{
					obj.smsStatus = ($(this).is(":checked")?1:0);
				}
			});

			obj.assetIdStr = saveObj.assetId1;
			obj.eventIdStr = saveObj.faultId;
			if (saveObj.event_level1)
			{
				obj.eventLevel = saveObj.event_level1.join(",");
			}
			obj.userIdStr = saveObj.noticeUserList1;
		}
		if (saveObj.eventType == 3)
		{
			if (perform_div.find("[name=notice_type2]:checked").size() == 0)
			{
				g_dialog.dialogTip(el ,{
					msg : "通知对象不能为空"
				});
				return false;
			}
			var el_notice_type = perform_div.find("[name=notice_type2]");
			el_notice_type.each(function (i){
				if (i == 0)
				{
					obj.emailStatus = ($(this).is(":checked")?1:0);
				}
				else
				{
					obj.smsStatus = ($(this).is(":checked")?1:0);
				}
			});
			obj.assetIdStr = saveObj.assetId2;
			if (saveObj.event_level2)
			{
				obj.eventLevel = saveObj.event_level2.join(",");
			}
			obj.eventIdStr = saveObj.perfId;
			obj.userIdStr = saveObj.noticeUserList2;
		}

		if (!flag)
		{
			el.find("[data-id=ipV6]").attr("validate","required,ipv6");
			el.find("[data-id=startIp]").attr("validate","required,ipv4");
			el.find("[data-id=endIp]").attr("validate","required,ipv4");
			return false;
		}

		var flag_url = module_obj_create_url;

		if (rowData)
		{
			flag_url = module_obj_update_url;
		}

		um_ajax_post({
			url : flag_url,
			paramObj : obj,
			maskObj : el,
			successCallBack : function (data){
				g_dialog.operateAlert(null ,"操作成功！");
				g_dialog.hide(el);
				event_notice_policy_list({paramObj:null,isLoad:true,maskObj:"body"});
			}
		});
	}
}

function edit_template_render(el ,data ,rowData)
{
	//回显input和下拉框
	el.umDataBind("render" ,rowData);
	//回显安全事件
	if(rowData.eventType ==1){
		el.find("[data-id=eventLevel]").val(rowData.eventLevel.split(","));
		// 回显邮件
		if (rowData.emailStatus == "1")
		{
			el.find("[name=notice_type]").eq(0)[0].checked = true;
		}
		// 回显短信
		if (rowData.smsStatus == "1"){
			el.find("[name=notice_type]").eq(1)[0].checked = true;
		}
		// 回显IPLIST
		g_grid.addData(el.find("[id=ipList_table]") ,data.ipLists);
		inputdrop.setDataTree(el.find("[id=securityId]") ,data.eventIdStr);
	}
	//回显故障事件
	if(rowData.eventType ==2){
		inputdrop.setEnable(el.find("[id=noticeUserList1]"));
		el.find("[data-id=event_level1]").val(data.eventLevel.split(","));
		if (rowData.emailStatus == "1")
		{
			el.find("[name=notice_type1]").eq(0)[0].checked = true;
		}
		if (rowData.smsStatus == "1"){
			el.find("[name=notice_type1]").eq(1)[0].checked = true;
		}
		inputdrop.setDataTree(el.find("[id=faultId]") ,data.eventIdStr);
	}
	//回显性能事件
	if(rowData.eventType ==3){
		inputdrop.setEnable(el.find("[id=noticeUserList2]"));
		el.find("[data-id=event_level2]").val(data.eventLevel.split(","));
		if (rowData.emailStatus == "1")
		{
			el.find("[name=notice_type2]").eq(0)[0].checked = true;
		}
		if (rowData.smsStatus == "1"){
			el.find("[name=notice_type2]").eq(1)[0].checked = true;
		}
		inputdrop.setDataTree(el.find("[id=perfId]") ,data.eventIdStr);
	}

	el.find("[data-type=select]").trigger('change');

}

function detail_template_init(rowData)
{
	
	$.ajax({
		type: "GET",
		url: "module/policy_manage/event_notice_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"850px",
				height:"600px",
				init:init,
				title:"事件通知策略查看",
				top:"14%",
				isDetail:true,
				autoHeight:"autoHeight"
			});
		}
	});

	function init(el)
	{
		um_ajax_get({
			url : module_obj_detail_url,
			paramObj : {id:rowData.enftpId,eventType:rowData.eventType},
			maskObj : el,
			successCallBack : function (data){
				var obj = data.strategyStore;
				$(el).umDataBind("render" ,obj);

				var buffer = [];
				(obj.emailStatus == 1) && (buffer.push("邮件"));
				(obj.smsStatus == 1) && (buffer.push("短信"));

				if (obj.eventType == sec_event_type_val)
				{
					el.find("[data-id=ip_div]").show();
					el.find("[data-id=asset_div]").hide();
					el.find("[data-id=event_name_label]").text("安全事件名称：");
					el.find("[data-id=event_name]").text(obj.secEventStr);
				}
				if (obj.eventType == fault_event_type_val)
				{
					el.find("[data-id=ip_div]").hide();
					el.find("[data-id=asset_div]").show();
					el.find("[data-id=event_name_label]").text("故障事件名称：");
					el.find("[data-id=event_name]").text(obj.faultEventStr);
				}
				if (obj.eventType == perf_event_type_val)
				{
					el.find("[data-id=ip_div]").hide();
					el.find("[data-id=asset_div]").show();
					el.find("[data-id=event_name_label]").text("性能事件名称：");
					el.find("[data-id=event_name]").text(obj.perfEventStr);
				}
				el.find("[data-id=notice_type]").text(buffer.join(","));
			}

		});
	}
}

function notice_obj_template_init(parentEl)
{
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

function asset_obj_template_init(parentEl)
{
	$.ajax({
		type: "GET",
		url: "module/policy_manage/event_notice_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=asset_obj_template]"),{
				width:"400px",
				init:init,
				saveclick:save_click
			});
		}
	});
	function init(el)
	{
		var paramObj = {};
		paramObj.queryFlag = "2";
		g_grid.render(el.find("[id=asset_table]"),{
			header:form_notice_secuser_col_header,
			url:form_notice_secuser_url,
			paramObj:paramObj,
			paginator:false
		});
	}

	function save_click(el)
	{
		var dataList = g_grid.getData(el.find("[id=asset_table]") ,{chk:true});
		var fullNamebuffer = [];
		var idBuffer = [];
		for (var i = 0; i < dataList.length; i++) {
			fullNamebuffer.push(dataList[i].user_FULLNAME);
			idBuffer.push(dataList[i].user_ID);
		}
		parentEl.val(fullNamebuffer.join(","));
		parentEl.next().val(idBuffer.join(","));
		return true;
	}
}


});
});