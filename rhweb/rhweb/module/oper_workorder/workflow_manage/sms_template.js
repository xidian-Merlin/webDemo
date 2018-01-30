$(document).ready(function (){

event_init();

sms_template_list();

function event_init()
{
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#delete_btn").click(function (){
		sms_template_delete();
	});
}

function sms_template_list()
{
	g_grid.render($("#table_div") ,{
		url : "smstemplate/queryData",
		header : [
					{text:'模板名称',name:"templateName"},
					{text:'修改时间',name:"createTime",searchRender: function (el){
						index_render_div(el ,{type:"date",startKey:"startCreateTime" ,endKey:"endCreateTime"});
					}},
					{text:'对所有人生效',name:"toAll",hideSearch:true,render:function (txt){
						return (txt == "1")?"是":"否";
					}},
					{text:'提前发送时间(小时)',name:"advanceTime",hideSearch:true}
				 ],
		oper : [
				    {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				    {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:sms_template_delete},
			   ],
		operWidth:"100px"
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "短信正文模板修改" : "短信正文模板添加";
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/workflow_manage/sms_template_tpl.html",
		success : function (data){
			g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"700px",
					init:init,
					title:title,
					saveclick:save_click
			});
			function init(el)
			{
				if (rowData)
				{
					el.umDataBind("render" ,rowData);
					(rowData.toAll == 1) ? (el.find("[id=toAll]")[0].checked=true)
										 : (el.find("[id=toAll]")[0].checked=false)
				}
			}

			function save_click(el ,saveObj)
			{
				if (!g_validate.validate(el))
				{
					return false;
				}
				var url = "smstemplate/addData";
				if (rowData)
				{
					url = "smstemplate/updData";
				}
				if (!saveObj.templateInfo)
				{
					g_dialog.dialogTip(el ,{msg : "模板内容不能为空"});
					return false;
				}
				el.find("[id=toAll]").is(":checked")?(saveObj.toAll=1):(saveObj.toAll=0);
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

function sms_template_delete(rowData)
{
	var templateId;
	if (rowData)
	{
		templateId = rowData.templateId;
	}
	else
	{
		templateId = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"templateId"});
		if (templateId.length == 0)
		{
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}
		templateId = templateId.join(",");
	}
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : "smstemplate/delData",
				paramObj : {templateId : templateId},
				successCallBack : function(data){
					g_grid.refresh($("#table_div"));
					g_dialog.operateAlert();
				}
			});
		}
	});	
}

});
