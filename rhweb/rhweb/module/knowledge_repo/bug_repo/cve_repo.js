$(document).ready(function(){

	var list_url ="Knowledge/vul/queryCVEList";
	var list_col = [
						{text:'漏洞编号',name:"name" ,width:15},
						{text:'漏洞状态',name:"status" ,width:10 ,searchRender:function(el){
							g_formel.select_render(el ,{
								data : [
										 {text:"----" ,id:"-1"},
										 {text:"Candidate" ,id:"Candidate"},
										 {text:"Entry" ,id:"Entry"}
									   ],
								name : "status"
							});
						}},
						{text:'漏洞阶段',name:"phase" ,width:15},
						{text:'漏洞描述',name:"description" ,width:60}
				   ];

	cve_repo_list({paramObj:null,isLoad:true,maskObj:"body"});

	function cve_repo_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 allowCheckBox:false,
			 maskObj : option.maskObj,
			 dbClick : cve_repo_detail_template_init
		});
	}

	function cve_repo_detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/knowledge_repo/bug_repo/cve_repo_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=cve_repo_detail_template]"),{
					width:"650px",
					init:init,
			 		top:"7%",
					title:"查看漏洞信息",
					isDetail : true,
					autoHeight : "true"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);		
		}
	}

	
});
