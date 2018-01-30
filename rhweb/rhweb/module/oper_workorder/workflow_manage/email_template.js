$(document).ready(function (){

event_init();

email_template_list();

function event_init()
{
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#delete_btn").click(function (){
		email_template_delete();
	});
}

function email_template_list()
{
	g_grid.render($("#table_div") ,{
		url : "workflow/emailtemplate/queryEmailTemplateData",
		header : [
					{text:'模板名称',name:"emailTemplateName"},
					{text:'修改时间',name:"createTime",searchRender: function (el){
						index_render_div(el ,{type:"date",startKey:"startCreateTime" ,endKey:"endCreateTime"});
					}},
					{text:'备注',name:"remark",hideSearch:true}
				 ],
		oper : [
				    {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init },
				    {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:email_template_delete},
			   ],
		operWidth:"100px"
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "邮件正文模板修改" : "邮件正文模板添加";
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/email_template_tpl.html",
		success : function (data){
			g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"560px",
					init:init,
					title:title,
					saveclick:save_click,
					top:"6%"
			});
			function init(el)
			{
				if (rowData)
				{
					el.umDataBind("render" ,rowData);
				}
			}

			function save_click(el ,saveObj)
			{
				var url = "workflow/emailtemplate/addEmailTemplate";
				if (rowData)
				{
					url = "workflow/emailtemplate/updEmailTemplate";
				}
				if (!saveObj.emailTemplateContent)
				{
					g_dialog.dialogTip(el ,{msg : "模板内容不能为空"});
					return false;
				}
				um_ajax_post({
					url : url,
					paramObj : saveObj,
					maskObj : el,
					successCallBack : function (){
						g_dialog.hide(el);
						g_dialog.operateAlert();
						g_grid.refresh($("#table_div"));
					}
				});
			}
		}
	});
}

function email_template_delete(rowData)
{
	var emailTemplateID;
	if (rowData)
	{
		emailTemplateID = rowData.emailTemplateID;
	}
	else
	{
		emailTemplateID = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"emailTemplateID"});
		if (emailTemplateID.length == 0)
		{
			g_dialog.operateAlert(null ,index_select_one_at_least_msg ,"error");
			return false;
		}
		emailTemplateID = emailTemplateID.join(",");
	}
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : "workflow/emailtemplate/delEmailTemplate",
				paramObj : {emailTemplateID : emailTemplateID},
				successCallBack : function(data){
					g_grid.refresh($("#table_div"));
					g_dialog.operateAlert();
				}
			});
		}
	});	
}

});
