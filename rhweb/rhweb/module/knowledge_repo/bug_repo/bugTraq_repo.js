$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	var list_url = "Knowledge/vul/queryBugtraqList";
	var list_col = [
						{text:'漏洞编号',name:"id",width:30,hideSearch:true},
						{text:'漏洞名称',name:"name",width:70}
						
				   ];
	
	traq_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(traq_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function traq_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 dbClick : detail_template_init,
			 allowCheckBox:false
		});
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "/module/knowledge_repo/bug_repo/bugTraq_repo_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=bugTraq_detail_template]"),{
					width:"650px",
					init:init,
					title:"查看漏洞信息",
					isDetail : true,
					saveclick:save_click,
					top:"6%",
					autoHeight:"true"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
			el.find("[data-id=discussion]").html(rowData.discussion);
		}

		function save_click(el)
		{
			g_dialog.hide(el);
		}
	}

});
});