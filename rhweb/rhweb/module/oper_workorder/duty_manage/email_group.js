$(document).ready(function (){
require(['tree'] ,function (tree){


var index_list_url = "AssetUserGroup/queryGroup";

var index_list_col_header = [
							  {text:'邮件通知组名称',name:"groupName"},
							  {text:'邮件通知组备注',name:"remark"}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

var email_create_url = "AssetUserGroup/addGroup";

var email_update_url = "AssetUserGroup/updGroup";

var email_delete_url = "AssetUserGroup/doBatchDel";

event_init();

email_list({paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
{
	// 批量删除按钮点击事件
	$("#delete_btn").click(function (){
		batch_delete_init();
	});

	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});
}

function email_list(option)
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
				url:email_delete_url,
				paramObj:{ids : rowData.groupId},
				successCallBack:function(data){
					g_dialog.operateAlert(null ,"删除成功！");
					email_list({paramObj:null,isLoad:true,maskObj:$("#table_div")});
				}
			});
		}
	});
}

function batch_delete_init(rowData)
{
	var dataArray = g_grid.getData($("#table_div") ,{chk : true});

	if(dataArray.length === 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var data = g_grid.getData($("#table_div") ,{chk:true});

	var tmp=[];
	for (var i = 0; i < data.length; i++) {
		tmp.push(data[i].groupId);
	}

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : email_delete_url,
				paramObj : {ids:tmp.join(",")},
				successCallBack : function(data){
					email_list({paramObj:null,isLoad:true,maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}


function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/email_group_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width : "560px",
				init : init,
				initAfter : initAfter,
				title : "邮件通知组查看",
				isDetail : true,
				top : "16%"
			});
		}
	});

	function init(el)
	{
		var email_detail_header = [
						{text:'姓名',name:"name"},
						{text:'邮箱',name:"email"},
						{text:'所属域',name:"domaName"}
				   ];
		g_grid.render(el.find("[id=email_detail_div]"),{
			data:[],
			header:email_detail_header,
	 		paginator:false,
			isLoad:false,
			allowCheckBox:false,
			hideSearch:true
		});
	}

	function initAfter(el)
	{
		el.umDataBind("render" ,rowData);
		var obj = {};
		obj.groupId = rowData.groupId;
		um_ajax_get({
			url : "AssetUserGroup/queryGroupDetail",
			paramObj : obj,
			maskObj : el,
			successCallBack : function (data){
				g_grid.addData(el.find("[id=email_detail_div]") ,data.userGroupGridStore);
			}
		});	
	}
}

function edit_template_init(rowData)
{
	var title = rowData ? "邮件通知组修改" : "邮件通知组添加";
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/email_group_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"960px",
				init:init,
				initAfter:initAfter,
				title:title,
				saveclick:save_click,
				top:"8%"
			});
		}
	});

	function init(el)
	{
		el_table_left = el.find("[id=ipList_left_table]");
		el_table_right = el.find("[id=ipList_right_table]");

		g_grid.render(el_table_left,{
			data:[],
			header : [{text:'姓名',name:'name',width:40},
					  {text:'邮箱',name:'email',width:60}],
			paginator : false,
			isLoad : false,
			allowCheckBox : true,
			hideSearch : true
		});
		g_grid.render(el_table_right,{
			data:[],
			header : [{text:'姓名',name:'name',width:27},
					  {text:'邮箱',name:'email',width:40},
					  {text:'所属域',name:'domaName',width:33}],
			paginator : false,
			isLoad : false,
			allowCheckBox : true,
			hideSearch : true
		});
		// 左侧树的点击事件
		el.find("[id=accordion_icon]").find("i").click(function (){
			el.find("[id=accordion_icon]").find("i").removeClass("icon-active");
			$(this).addClass("icon-active");
			var self = this;
			um_ajax_post({
				url : $(this).attr("data-url"),
				isLoad : true,
				maskObj : el,
				successCallBack:function (data){
					if ($(self).attr("data-key"))
					{
						data = data[$(self).attr("data-key")];
					}
	 				tree.render($("#left_tree") ,{
	 					zNodes : data,
	 					zTreeOnClick : function (event, treeId, treeNode){
	 						g_grid.removeData(el_table_left ,{});

	 						var domainId = treeNode.id;
	 						um_ajax_post({
								url : "AssetUserGroup/queryStaffNotInGroup",
								paramObj : {domaId:domainId},
								isLoad : true,
								maskObj : el,
								successCallBack:function (data){
									g_grid.addData(el_table_left ,data);
								}
							});
	 					},
	 					expandNode : "-1"
	 				});
	 				current_treeType = $(self).attr("data-type");
				}
			});
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
			g_grid.addData(el_table_left ,rightDataArray);
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
	}

	function initAfter(el)
	{
		el.find("[id=accordion_icon]").find("i").eq(0).click();
		if(rowData)
		{
			el.umDataBind("render" ,rowData);
			var obj = {};
			obj.groupId = rowData.groupId;
			um_ajax_get({
				url : "AssetUserGroup/queryGroupDetail",
				paramObj : obj,
				maskObj : el,
				successCallBack : function (data){
					g_grid.addData(el.find("[id=ipList_right_table]") ,data.userGroupGridStore);
				}
			});			
		}
	}

	function save_click(el ,saveObj)
	{
    	if (!g_validate.validate(el.find("#edit_template")))
		{
			return false;
		}
		
		else
		{	
		    var flag_url = email_create_url;
			if(rowData)
			{
				flag_url = email_update_url;
			}
				
			var buffer = [];
			var dataArray = g_grid.getData(el_table_right);

			for(var i = 0; i < dataArray.length; i++)
			{
				buffer.push(dataArray[i]);
			}
			var obj = {};
			obj.userGroupGridStore = buffer;
			obj.groupstore = saveObj;

			if (obj.userGroupGridStore.length == 0)
			{
				g_dialog.dialogTip(el ,{msg:"至少添加一个用户。"});
		        return false;
		    }

			if(rowData)
			{		
				var buffer = [];
				var dataArray = g_grid.getData(el_table_right);

				for(var i = 0; i < dataArray.length; i++)
				{
					buffer.push(dataArray[i]);
				}
				var obj = {};
				obj.userGroupGridStore = buffer;
				obj.groupstore = saveObj;
				obj.groupstore.groupId = rowData.groupId;
			}

		    um_ajax_get({
				url : flag_url,
				paramObj : obj,
				maskObj:el,
				successCallBack : function (data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"操作成功!");
					email_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}
	}
}


});
});