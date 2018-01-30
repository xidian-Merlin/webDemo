$(document).ready(function (){

var list_url = "usergroup/queryUserManagerData";
var list_col = [
					{text:'用户组名称',name:"usergName"},
					{text:'用户组描述',name:"usergDesc"}
			   ];
var list_oper = [
					{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:user_group_delete}
				 ];

var form_sys_user_list_url = "usergroup/queryUser";
var form_sys_user_list_col = [{text:'系统人员',name:"codename"}];

var form_group_user_list_url = "usergroup/queryUser";
var form_group_user_list_col = [{text:'组内人员',name:"codename"}];

var user_group_create_url = "usergroup/addUserGroup";

var user_group_update_url = "usergroup/updUserGroup";

var user_group_delete_url = "usergroup/delUserGroup";

var user_group_detail_url = "usergroup/queryUserManagerDataForUpdate";

event_init();

user_group_list({});

index_search_div_remove_click(user_group_list ,{paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
{
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#query_btn").click(function (){
		query_template_init();
	});
}

function user_group_list(option)
{
	g_grid.render($("#table_div"),{
			url:list_url,
			 header:list_col,
			 oper: list_oper,
			 operWidth:"100px", 
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 dbClick : detail_template_init
	});
}

function query_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/sys_manage/sys_base_config/user_group_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=query_template]"),{
				width:"700px",
				init:init,
				saveclick:save_click
			});
		}
	});

	function init()
	{

	}

	function save_click(el ,saveObj)
	{
		index_search_div_show(el.umDataBind("queryStr"));
		user_group_list({paramObj:saveObj,maskObj:$("#table_div")});
		return true;
	}
}

function edit_template_init(rowData)
{
	var title = rowData ? "用户组修改" : "用户组添加";
	$.ajax({
		type: "GET",
		url: "module/sys_manage/sys_base_config/user_group_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"850px",
				top:"6%",
				init:init,
				title:title,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var left_table = el.find("[id=left_table]");
		var right_table = el.find("[id=right_table]");

		if (rowData)
		{
			el.umDataBind("render" ,rowData);
			g_grid.render(left_table,{
				 data:[],
				 header:form_sys_user_list_col,
				 gridCss : "um-grid-style",
				 paginator : false,
				 hideSearch : true
			});

			g_grid.render(right_table,{
				 data:[],
				 header:form_group_user_list_col,
				 gridCss : "um-grid-style",
				 paginator : false,
				 hideSearch : true
			});

			um_ajax_get({
				url : user_group_detail_url,
				paramObj : {usergId : rowData.usergId},
				successCallBack : function (data){
					g_grid.addData(left_table ,data.srcGridStore);
					g_grid.addData(right_table ,data.toGridStore);
				}
			});
		}
		else
		{
			g_grid.render(left_table,{
				 url:form_sys_user_list_url,
				 header:form_sys_user_list_col,
				 gridCss : "um-grid-style",
				 paginator : false,
				 hideSearch : true
			});

			g_grid.render(right_table,{
				 data:[],
				 header:form_group_user_list_col,
				 gridCss : "um-grid-style",
				 paginator : false,
				 hideSearch : true
			});
		}
		

		el.find("[id=chevron-right]").click(function (){
			var data = g_grid.getData(left_table ,{chk:true});
			g_grid.removeData(left_table);
			g_grid.addData(right_table ,data);
		});

		el.find("[id=chevron-left]").click(function (){
			var data = g_grid.getData(right_table ,{chk:true});
			g_grid.removeData(right_table);
			g_grid.addData(left_table ,data);
		});
	}

	function save_click(el ,saveObj)
	{
		var save_url = user_group_create_url;
		if (rowData)
		{
			save_url = user_group_update_url;
		}
		if (!g_validate.validate(el))
		{
			return false;
		}
		var right_table = el.find("[id=right_table]");
		var userIdArray = [];
		var data = g_grid.getData(right_table);
		for (var i = 0; i < data.length; i++) {
			userIdArray.push(data[i].codevalue);
		}
		saveObj.userId = userIdArray.join(",");
		um_ajax_post({
			url : save_url,
			paramObj : saveObj,
			successCallBack : function (){
				g_dialog.operateAlert();
				g_dialog.hide(el);
				user_group_list({});
			}
		});

	}
}

function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/sys_manage/sys_base_config/user_group_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"600px",
				init:init,
				title:"用户组详细信息",
				initAfter:initAfter,
				isDetail : true
			});
		}
	});

	function init(el)
	{
		
	}

	function initAfter(el)
	{
		um_ajax_get({
			url : user_group_detail_url,
			paramObj : {usergId : rowData.usergId},
			maskObj : el,
			successCallBack : function (data){
				el.umDataBind("render" ,data.userStore[0]);
				var userArray = data.toGridStore;
				var userNameArray = [];
				for (var i = 0; i < userArray.length; i++) {
					userNameArray.push(userArray[i].codename);
				}
				el.find("[data-id=userName]").html(userNameArray.join("<br>"));
			}
		});
	}
}

function user_group_delete(rowData)
{
	g_dialog.operateConfirm(index_delete_confirm_msg ,{
		saveclick : function (el){
			um_ajax_post({
				url : user_group_delete_url,
				paramObj : {usergId : rowData.usergId},
				successCallBack : function (){
					g_dialog.operateAlert();
					user_group_list({});
					return false;
				}
			});
		}
	})
}

});