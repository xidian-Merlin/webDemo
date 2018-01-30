$(document).ready(function (){
require([''] ,function (inputdrop){

var list_url = "FactoryManage/queryFactoryList";
var comp_create_url = "FactoryManage/addFactoryInfo";
var comp_update_url = "FactoryManage/editFactoryInfo";
var comp_delete_url = "FactoryManage/delFactoryInfo";
var list_col = [
						{text:'厂商名称',name:"supName"},
						{text:'联系人姓名',name:"supContacts"},
						{text:'联系电话',name:"phoneNumber"},
						{text:'E-MAIL地址',name:"email"},
						{text:'主页',name:"supUrl"},
						{text:'厂商编码',name:"supCode"}
				];
var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				 ];

var el_table_div = $("#table_div");

event_init();

comp_list({paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
	{
		$("#add_btn").click(function (){
			edit_template_init();
		});
	}

function comp_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: index_oper,
			 operWidth:"100px",
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 allowCheckBox:false,
			 dbClick : detail_template_init
		});
	}

function edit_template_init(rowData)
	{
		var title = rowData ? "厂商信息修改" : "厂商信息添加";
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_prop/comp_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=comp_edit_template]"),{
					width:"800px",
					init:init,
					title:title,
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			if (rowData)
			{
				$(el).umDataBind("render" ,rowData);
			}
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el)){
				return false;
			}
			var flag_url = comp_create_url;
			if(rowData){
				flag_url = comp_update_url;
				saveObj.newCode = saveObj.supCode;
				saveObj.newName = saveObj.supName;
				saveObj.supCode = rowData.supCode;
				saveObj.supName = rowData.supName;
			}
			um_ajax_post({
				url : flag_url,
				paramObj: saveObj,
				maskObj:el,
				successCallBack : function(data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"操作成功");
					comp_list({paramObj:null,isLoad:true,maskObj:el_table_div});
				}
			});
		}
	}

function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_prop/comp_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=comp_detail_template]"),{
					width:"600px",
					init:init,
					title:"厂商信息查看",
					isDetail:true
				});
			}
		});

function init(el)
		{
			$(el).umDataBind("render" ,rowData);
		}
	}

function index_list_delete(rowData)
	{
		console.log(rowData);
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick:function(){
				um_ajax_post({
					url:comp_delete_url,
					paramObj:{supCode:rowData.supCode},
					successCallBack:function(data){
						comp_list({paramObj:null,isLoad:true,maskObj:el_table_div});
						g_dialog.operateAlert(null ,"删除成功");
						return true;
					}
				})

			}
		});
	}
});
});