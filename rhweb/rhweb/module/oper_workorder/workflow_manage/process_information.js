$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 '/module/sys_manage/sys_base_config/system_health_public.js'] ,function (inputdrop ,tab,publicObj){


var index_list_url = "eventNoticeStrategy/queryStrategyList";

var index_list_col_header = [
							  {text:'工单模板名称',name:"enftpName"},
							  {text:'修改人',name:"enftpStatus",render:function (text){
							  	return (text == "1" ? "启用" : "停用");
							  }},
							  {text:'修改时间',name:"eventType",render:function (text){
							  	var msg;
							  	(text == 1) && (msg = "安全事件");
							  	(text == 2) && (msg = "故障事件");
							  	(text == 3) && (msg = "性能事件");
							  	return msg;
							  }},
							  {text:'流程描述',name:"createUser"},
							];
var index_list_col_oper = [
			   			  ];

var module_obj_create_url = "eventNoticeStrategy/addStrategy";

var module_obj_update_url = "assetInterfaceManage/queryAssetList";

var module_obj_delete_url = "assetInterfaceManage/queryAssetList";

var module_obj_detail_for_update_url = "eventNoticeStrategy/queryEventNoticeStr";

var module_obj_detail_url = "eventNoticeStrategy/queryStrategyDetail";

var form_iplist_url = "assetInterfaceManage/queryAssetList";

var form_iplist_col_header = [
							  {text:'IP类型',name:"ipTypeName",width:35},
							  {text:'IP范围',name:"ipRange",width:65}
							 ];
var form_userlist_url =  "eventNoticeStrategy/queryCreateUser";

var form_report_send_sysuser_col_header = [
							  {text:'用户名',name:"user_FULLNAME"},
							  {text:'用户账号',name:"user_ACCOUNT"}
							 ];
var form_report_send_sysuser_url =  "workorderstrategy/queryUserList";

var form_report_send_secuser_col_header = [
							  {text:'用户名',name:"ipTypeName"},
							  {text:'所属安全域',name:"ipRange"}
							 ];
var form_report_send_secuser_url =  "workorderstrategy/queryDomaUserList";

// 用户组调用接口
var form_user_group_url = "/workorderstrategy/queryUserGroup";


var sec_event_type_val = 1;
var fault_event_type_val = 2;
var perf_event_type_val = 3;

event_init();

event_process_information_list({paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
{
	// 查询按钮点击事件
	$("#query_btn").click(function (){
		query_form_init();
	});

	index_search_div_remove_click(event_process_information_list,
									{paramObj:null,isLoad:true});
}

function event_process_information_list(option)
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 hideSearch:true,
		 allowCheckBox:false,
		 url:index_list_url,
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init
	});
}


function query_form_init()
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/process_information_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=query_template]"),{
				width:"600px",
				init:init,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		el.closest("[data-id=modal-body]").css("overflow" ,"visible");
	}

	function save_click(el ,saveObj)
	{
		var queryStr = $("#query_form").umDataBind("queryStr");
		index_search_div_show(queryStr);
		event_process_information_list({paramObj : saveObj});
		return true;
	}
}

function edit_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/process_information_tpl.html",
		success :function(data)
		{
			var tag = $(data).find("[id=edit_template]");
			publicObj.initSelectAssociationData(tag,1);
			g_dialog.dialog(tag,{
				width:"850px",
				init:init,
				initAfter:initAfter,
				saveclick:save_click
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
				el_ipV6.val("");
			}
			else
			{
				el_startIp.attr("disabled" ,"disabled");
				el_endIp.attr("disabled" ,"disabled");
				el_ipV6.removeAttr("disabled");
				el_startIp.val("");
				el_endIp.val("");
			}
		});

		// 右移事件
		var ipList = [];
		el.find("[id=chevron-right]").click(function (){
			g_validate.ipValidate(el.find("[data-id=startIp]") ,el.find("[data-id=endIp]"));
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
					obj.startIp && (obj.ipRange = obj.startIp + " - " + obj.endIp);
					obj.ipV6 && (obj.ipRange = obj.ipV6);
					ipList.push(obj);
				}
			});
			g_grid.addData(ipList_table ,ipList);
			ipList = [];
		});

		// 左移事件
		el.find("[id=chevron-left]").click(function (){
			g_grid.removeData(ipList_table);
		});



		// 通知对象点击事件
		el.find("[id=report_send_obj_span]").click(function (){
			notice_obj_template_init($("#noticeUserList1"));
		});


		g_validate.init(el);
	}

	function initAfter(el){
		var el_sec_div = el.find("[id=sec_div]");
		var fault_div = el.find("[id=fault_div]");
		var perform_div = el.find("[id=perform_div]");

		var ipList_table = el.find("[id=ipList_table]");

		g_dialog.waitingAlert(el.closest("[data-id=modal-body]"));

		g_grid.render(ipList_table,{
			header:form_iplist_col_header,
			url:"data/empty.json",
			server:"http://127.0.0.1:8080/",
			paginator:false,
			isLoad:false
		});

		um_ajax_get({
	  	    url: "eventNoticeStrategy/querySecurityTree",
		    isLoad: false,
			  successCallBack:function (data){
				  inputdrop.renderTree(el_sec_div.find('[id=securityId]') ,data.securityTreeStore);

				  um_ajax_get({
				  	    url: "eventNoticeStrategy/queryFaultTree",
					    isLoad: false,
						  successCallBack:function (data){
							  inputdrop.renderTree(fault_div.find('[id=faultId]') ,data.faultTreeStore);

							  um_ajax_get({
						  	    url: "eventNoticeStrategy/queryPerfTree",
							    isLoad: false,
								  successCallBack:function (data){
									  inputdrop.renderTree(perform_div.find('[id=perfId]') ,data.perfTreeStore);
									  if (!rowData)
									  {
										g_dialog.waitingAlertHide(el.closest("[data-id=modal-body]"));
									  }

									  // 数据回显
								      if (rowData)
									  {
										  um_ajax_post({
											  url : module_obj_detail_for_update_url,
											  paramObj : {id:rowData.enftpId},
											  isAsync: false,
											  isLoad: false,
											  successCallBack : function (data){
												  edit_template_render(el ,data);
												  g_dialog.waitingAlertHide(el.closest("[data-id=modal-body]"));
											  }
										  });
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
		
		g_validate.validate(el);

		// 通知方法
		var obj = new Object();
		obj.enftpId = saveObj.enftpId;
		obj.eventType = saveObj.eventType;
		obj.enftpName = saveObj.enftpName;
		obj.enftpStatus = saveObj.enftpStatus;

		um_ajax_post({
			url : module_obj_create_url,
			paramObj : obj,
			successCallBack : function (data){
				console.log(data);
			}
		});
	}
}

function edit_template_render(el ,data){
	$(el).umDataBind("render" ,data);
	
	if (data.eventType == fault_event_type_val)
	{
		el.find("[data-id=event_level1]").val(data.eventLevel.split(","));
		el.find("[data-id=faultId]").val(data.eventIdStr);
		if (data.emailStatus == 1)
					el.find("[name=notice_type1]").eq(0)[0].checked = true
		if (data.smsStatus == 1)
					el.find("[name=notice_type1]").eq(1)[0].checked = true
		inputdrop.setDataTree(el.find("[id=faultId]") ,data.eventIdStr);
	}
	el.find("[data-type=select]").trigger('change');

}

function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/process_information_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"560px",
				height:"600px",
				title:"流程信息维护查看",
				init:init,
				saveclick:save_click
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

	function save_click()
	{
		
	}
}

function notice_obj_template_init(parentEl)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/process_information_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=notice_obj_template]"),{
				width:"400px",
				init:init,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		tab.tab(el.find("[id=tab]") ,{});

		var userIds = parentEl.next().val();

		// 渲染系统用户列表
		g_grid.render(el.find("[id=noticeList_table1]"),{
			header:form_report_send_sysuser_col_header,
			url:form_report_send_sysuser_url,
			paramObj:{unuserIds:userIds},
			paginator:false
		});

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
						header:form_report_send_sysuser_col_header,
						url:form_report_send_sysuser_url,
						paramObj:{unuserIds:userIds ,groupId:el_user_group_sel.val()},
						paginator:false
					});
				});
			}
		});

		// 渲染安全域用户列表
		g_grid.render(el.find("[id=noticeList_table2]"),{
			header:form_report_send_secuser_col_header,
			url:form_report_send_secuser_url,
			paginator:false
		});
	}

	function save_click (el)
	{
		var dataList = g_grid.getData(el.find("[id=noticeList_table1]") ,{chk:true});
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

function asset_obj_template_init(parentEl)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/process_information_tpl.html",
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
		g_grid.render(el.find("[id=asset_table]"),{
			header:form_report_send_secuser_col_header,
			url:form_report_send_secuser_url,
			paginator:false
		});
	}

	function save_click()
	{

	}
}


});
});