$(document).ready(function(){

	var list_url ="versionUpdate/queryVersionList";
	var list_col = [
						{text:'版本',name:"installVer" ,width:10},
						{text:'更新时间',name:"installDate" ,width:20},
						{text:'安装描述',name:"installDesc" ,width:30},
						{text:'版本信息',name:"verDesc" ,width:40 ,render:function (txt){
							if (txt && txt.length > 40)
							{
								return txt.substr(0,40) + "...";
							}
							else
							{
								return txt;
							}
							
						}}
				   ];

	version_info_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(version_info_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function version_info_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 allowCheckBox:false,
			 hideSearch : true,
			 maskObj : option.maskObj,
			 dbClick : version_info_detail
		});
	}

	function version_info_detail(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/version_info_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=version_info_detail_template]"),{
					width:"650px",
					init:init,
					isDetail:true,
					title:"版本信息",
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);			
		}

		function save_click(el)
		{
			g_dialog.hide(el);
		}
	}

	
});
