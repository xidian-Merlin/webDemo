$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js'] ,function (inputdrop ,tab){

	var index_list_url = "AssetType/queryAssetTypeData";

	var index_list_col_header = [
								  {text:'资产型号',name:"edmtName"},
								  {text:'描述',name:"edmtDesc",hideSearch:true},
								  {text:'是否上传图片',name:"edmtMapText",hideSearch:true}
								];
	var index_list_col_oper = [
					  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				   			  ];

	var module_obj_create_url = "AssetType/addAssetType";

	var module_obj_update_url = "AssetType/updAssetTypeSave";

	var module_obj_delete_url = "AssetType/delAssetType";

	var module_obj_detail_url = "AssetType/queryAssetTypeData";

	event_init();

	event_notice_policy_list({paramObj:null,isLoad:true,maskObj:"body"});

	function event_init()
	{
		// 新增按钮点击事件
		$("#add_btn").click(function (){
			edit_template_init();
		});
		$("#batch_delete_btn").click(function(){
			index_list_delete();
		});

		index_search_div_remove_click(event_notice_policy_list,
										{paramObj:null,isLoad:true});
	}

	function event_notice_policy_list(option)
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
		var row_data = g_grid.getData($("#table_div"),{chk:true});
		var dataList = [];
		for (var i = 0; i < row_data.length; i++) {
			dataList.push(row_data[i].edmtId);
		}
		var paramData = rowData ? rowData.edmtId : dataList.join(",");
		if (paramData.length == 0) 
		{
			g_dialog.operateAlert(null,index_select_one_at_least_msg,"error");
			return false;
		}
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick : function (){
				um_ajax_post({
					url : module_obj_delete_url,
					paramObj : {edmtId : paramData},
					successCallBack : function(data){
						event_notice_policy_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function edit_template_init(rowData)
	{
		var title = rowData ? "资产型号修改" : "资产型号添加";
		$.ajax({
			type: "GET",
			url: "/module/base_sysdate/asset_prop/asset_model_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"650px",
					init:init,
					title:title,
					saveclick:save_click,
					top:"6%"
				});
			}
		});

		function init(el)
		{
			index_create_upload_el(el.find("[id=edmtMap]"));
			if (rowData)
			{
				el.umDataBind("render" ,rowData);
				el.find("[id=edmtImgDiv]").show();
				el.find("[data-id=edmtImg]").attr("src" ,rowData.edmtMap);
			}
		}

		function save_click(el ,saveObj)
		{
			var v = g_validate.fileSuffixLimit(el.find("#edmtMap").val() ,"png,jpg,bmp" ,true ,true);
			if (!v.flag) 
			{
				g_validate.setError(el.find("#edmtMap") ,v.msg);
				return false;
			}
			var flag_url = module_obj_create_url;
			if (rowData)
			{
				flag_url = module_obj_update_url;
			}
			if (!g_validate.validate(el))
			{
				return false;
			}
			um_ajax_file(el.find("form") ,{
				url : flag_url,
				maskObj : el,
				successCallBack : function (data){
					g_dialog.hide(el);
					g_dialog.operateAlert();
					event_notice_policy_list({maskObj : $("#table_div")});
				}
			});
		}
	}


	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_prop/asset_model_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"560px",
					title:"资产型号详细信息",
					init:init,
					isDetail : true
				});
			}
		});
		function init(el)
		{
			el.umDataBind("render" ,rowData);
			el.find("[data-id=edmtUnit]").text(rowData.edmtUnit + "(U)");
			el.find("[data-id=img]").attr("src" ,rowData.edmtMap);
		}
	}

});
});