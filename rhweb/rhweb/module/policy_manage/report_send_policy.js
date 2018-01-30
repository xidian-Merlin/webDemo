$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 '/module/sys_manage/sys_base_config/system_health_public.js'] ,function (inputdrop ,tab,publicObj){

var rpCycleMap = new HashMap();
	rpCycleMap.put("1", "每天");
	rpCycleMap.put("2", "每周");
	rpCycleMap.put("3", "每月");
	rpCycleMap.put("4", "每年");

var rpCodeMap = new HashMap();
var rpCode;
um_ajax_get({
	url:"rpc/getCodeList",
    paramObj:{key:"template_store"},
    isLoad: false,
    successCallBack:function (data){
    	for (var i = 0; i < data.template_store.length; i++) {
    		rpCodeMap.put(data.template_store[i].codeValue,data.template_store[i].codeName);
    	}
    	rpCode =  data.template_store;
    	report_send_policy_list();
	}
});

var rpFormatMap = new HashMap();
	rpFormatMap.put("1","xls");
	rpFormatMap.put("2","rtf");
	rpFormatMap.put("8","pdf");
	rpFormatMap.put("16","csv");
	
var index_list_url = "strategy/reportsend/queryReportSendList";

var index_list_col_header = [
							  {text:'策略名称',name:"rpName"},
							  {text:'执行周期',name:"rpCycle",render:function (text){
							        return text = rpCycleMap.get(text);				  	
							  }
							  ,searchRender:function (el){
							  		var data = [
											  {text:"----" ,id:"-1"},
						  					  {text:"每天" ,id:"1"},
						  					  {text:"每周" ,id:"2"},
						  					  {text:"每月" ,id:"3"},
						  					  {text:"每年" ,id:"4"}
									  	   ];
									g_formel.select_render(el ,{
										data : data,
										name : "rpCycle"
									});
							  }},
							  {text:'报表模板',name:"rpCode",render:function (text){
							  		return text = rpCodeMap.get(text);
							  },searchRender:function (el){
							  		var data = [{text:"----" ,id:"-1"}];
							  		for (var i = 0; i < rpCode.length; i++) {
							  			data.push({text:rpCode[i].codeName,id:rpCode[i].codeValue});
							  		}
									g_formel.select_render(el ,{
										data : data,
										name : "rpCode"
									});
							  }},
							  {text:'报表文件格式',name:"rpFormat",render:function (text){
							  	return	text = rpFormatMap.get(text);
							  },searchRender:function (el){
							  		var data = [
											  {text:"----" ,id:"-1"},
						  					  {text:"xls" ,id:"1"},
						  					  {text:"rtf" ,id:"2"},
						  					  {text:"pdf" ,id:"8"},
						  					  {text:"csv" ,id:"16"}
									  	   ];
									g_formel.select_render(el ,{
										data : data,
										name : "rpFormat"
									});
							  }},
							  {text:'策略状态',name:"rpStatus",render:function (text){
							  	return (text == "1" ? "启用" : "停用");
							  },searchRender:function (el){
							  		var data = [
											  {text:"----" ,id:"-1"},
						  					  {text:"启用" ,id:"1"},
						  					  {text:"停用" ,id:"0"}
									  	   ];
									g_formel.select_render(el ,{
										data : data,
										name : "rpStatus"
									});
							  }},
							  {text:'创建人',name:"taskCreator"},
							  {text:'创建时间',name:"enterDate"}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];
var detail_url = "strategy/reportsend/queryDetailInfo";
var create_url = "strategy/reportsend/addReportSend";
var edit_detail_url = "strategy/reportsend/queryReportSendForUpdate";
var update_url = "strategy/reportsend/updReportSend";
var delete_url = 'strategy/reportsend/delReportSend';

event_init();

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#delete_btn").click(function (){
		index_list_batch_delete();
	});
}

function report_send_policy_list()
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
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url : delete_url,
				paramObj : {rpIds : rowData.rpId},
				successCallBack : function(data){
					report_send_policy_list();
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function index_list_batch_delete()
{
	var idArray  = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"rpId"})

	if(idArray.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var ids = idArray.join(",");

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : delete_url,
				paramObj : {rpIds : ids},
				successCallBack : function(data){
					report_send_policy_list();
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}
function edit_template_init(rowData)
{
	var title = rowData ? "报表发送策略修改" : "报表发送策略添加";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/report_send_policy_tpl.html",
		success :function(data)
		{
			var tag = $(data).find("[id=edit_template]");
			publicObj.initSelectAssociationData(tag,1);
			g_dialog.dialog(tag,{
				width:"850px",
				top:"0",
				init:init,
				title:title,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		var el_day = el.find("[id=day]");
		var el_month = el.find("[id=month]");
		var el_week = el.find("[id=week]");
		var el_cycleType = el.find("[data-flag=cycleType]");
		el.find("[data-id=rpCycle]").change(function(){
			el_cycleType.show()
			var tmp = $(this).val();
			if(tmp == "2")
			{
				el_cycleType.not(el_week).hide();
			}
			else if(tmp == "3")
			{
				el_cycleType.not(el_day).hide();
			}
			else if(tmp == "4")
			{
				el_cycleType.not(el_day).not(el_month).hide();
			}
			else
			{
				el_cycleType.hide();
			}
		});
		el.find("[data-id=time]").click(function(){
			if($(this).val() == "")
			{
				$(this).val("00:00:00");
			}
		});
		
		// 收件人点击事件
		inputdrop.renderSelect(el.find("[id=noticeUserList]") ,{
								data : [],
								allowCheckBox : false,
								hideRemove : false,
								isSingle : true
							});
		el.find("[id=report_send_obj_span]").click(function (){
			notice_obj_template_init($("#noticeUserList"));
		});

	    if(rowData)
	    {
	    	um_ajax_get({
	    		url:edit_detail_url,
	    		paramObj:{rpId:rowData.rpId},
	    		isLoad:false,
	    		successCallBack:function(data){
	    			el.umDataBind("render",data);
	    			var emailPersonArray = [];
		  			var emailPersonIdArray = data.emailPerson ? data.emailPerson.split(",") : [];
		  			var emailPersonStrArray = data.emailPersonStr ? data.emailPersonStr.split(",") : [];
		  			for (var i = 0; i < emailPersonIdArray.length; i++) {
		  				emailPersonArray.push({id:emailPersonIdArray[i] ,text:emailPersonStrArray[i]});
		  			}
		  			inputdrop.addDataSelect(el.find("[id=noticeUserList]"),{data:emailPersonArray});
	    			el.find("select").trigger("change");
	    		}
	    	});
	    }
			 
	}

	function save_click(el ,saveObj)
	{
		if(!g_validate.validate(el))
		{
			return false;
		}
		var url = create_url;
		var obj = saveObj;
		if(rowData)
		{
			url = update_url;
			obj.enterDate = rowData.enterDate;
			obj.keyProperty = rowData.keyProperty;
			obj.oldRpName = rowData.rpName;
			obj.rpCodeCell = "rp_code";
			obj.rpCycleCell = "rp_cycle";
			obj.rpFormatNameCell = "rpFormatName";
			obj.rpId = rowData.rpId;
			obj.rpNameCell = "rp_name";
			obj.rpStatusCell = "report_status";
			obj.taskCreator = rowData.taskCreator;
		}
		um_ajax_post({
			url : url,
			paramObj : obj,
			isLoad:true,
			maskObj:"body",
			successCallBack : function (data){
				g_dialog.hide(el);
				report_send_policy_list();
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
	}
}

function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/policy_manage/report_send_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"500px",
				title:"报表发送策略详细信息",
				init:init,
				isDetail:true
			});
		}
	});

	function init(el)
	{
		um_ajax_get({
			url:detail_url,
			paramObj:{rpId:rowData.rpId},
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				el.umDataBind("render",data[0]);
			  	el.find("[data-id=rpCycle]").text(rpCycleMap.get(data[0].rpCycle));
			  	el.find("[data-id=rpFormat]").text(rpFormatMap.get(data[0].rpFormat));
			  	el.find("[data-id=rpCode]").text(rpCodeMap.get(data[0].rpCode));
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

});
});