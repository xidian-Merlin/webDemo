$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js'] ,function (inputdrop ,tab){

	var index_list_url = "OsType/queryOsTypeData";

	var index_list_col_header = [
								  {text:'操作系统名称',name:"ptName" ,dbclick:true},
								  {text:'操作系统图标',name:"ptMap",render:function(text){
									  return '<img src="'+text+"?"+new Date().getTime()+'" />';
								  },hideSearch:true}
								];
	var index_list_col_oper = [
					  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete,isShow:function(data){
					  					  return true;
					  			  }}
				   			  ];

	var module_obj_create_url = "OsType/addOsType";

	var module_obj_update_url = "OsType/updOsTypeSave";

	var module_obj_delete_url = "OsType/delOsType";


	event_init();

	os_type_list({paramObj:null,isLoad:true,maskObj:"body"});

	function event_init()
	{
		// 新增按钮点击事件
		$("#add_btn").click(function (){
			edit_template_init();
		});
		
		$("#batch_delete_btn").click(function (){
			index_list_batch_delete();
		});
	}

	function os_type_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:index_list_col_header,
			 oper: index_list_col_oper,
			 operWidth:"100px",
			 url:index_list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 //tdDbClick : true
			 dbClick : detail_template_init
		});
	}

	function index_list_delete(rowData)
	{
		console.log(rowData);
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick:function(){
				um_ajax_post({
					url:module_obj_delete_url,
					paramObj:{ptId:rowData.ptId},
					successCallBack:function(data){
						os_type_list({paramObj:null,isLoad:true,maskObj:"body"});
						g_dialog.operateAlert(null ,"删除成功");
						return true;
					}
				})

			}
		});
	}


	function edit_template_init(rowData)
	{
		var title = rowData ? "操作系统修改" :"操作系统添加";
		$.ajax({
			type: "GET",
			url: "/module/base_sysdate/asset_prop/os_type_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"650px",
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
				el.find("[name=ptId]").val(rowData.ptId);
				el.find("[id=osimagediv]").show();
				el.find("[data-id=osimage]").attr("src",rowData.ptMap);
				el.umDataBind("render" ,rowData);
				el.find("select").trigger("change");
			}

			g_validate.init(el);
			
			index_create_upload_el(el.find("#ptMap"));
		}

		function save_click(el ,saveObj)
		{
			console.log(saveObj);
			if (rowData) 
			{
				var v = g_validate.fileSuffixLimit(el.find("#ptMap").val() ,"png,jpg,bmp" ,true ,true);
				if (el.find("ptMap").val() == "") 
				{
					el.find("ptMap").val(rowData.ptMap);
					// saveObj.ptMap = rowData.ptMap;
				}
			} 
			else 
			{
				var v = g_validate.fileSuffixLimit(el.find("#ptMap").val() ,"png,jpg,bmp" ,true ,false);
			}
			
			if (!v.flag) 
			{
				g_validate.setError(el.find("#ptMap") ,v.msg);
				return false;
			}
			if (!g_validate.validate(el)){
				return false;
			}
			var flag_url = module_obj_create_url;
			if(rowData){
				flag_url = module_obj_update_url;
			}
			var form = el.find("[id=edit_form]");
			um_ajax_file(form ,{
				url : flag_url,
				paramObj: saveObj,
				maskObj : el.closest("[data-id*=umDialog]"),
				successCallBack : function (data){
					g_dialog.hide(el);
					g_dialog.operateAlert();
					os_type_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}
	}



	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_prop/os_type_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"560px",
					init:init,
					title:"操作系统详细信息",
					isDetail:true,
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
			el.find("[id=os_icon]").attr("src" ,rowData.ptMap);
		}

		function save_click()
		{
			
		}
	}

	function index_list_batch_delete()
	{
		var os_type_attributed_id = [];

		var rowData = g_grid.getData($("#table_div") ,{
			chk : true
		});

		if (rowData.length == 0)
		{
			g_dialog.operateAlert(null ,index_select_one_at_least_msg ,"error");
			return false;
		}

		for(var i=0, len=rowData.length; i<len;i++){
			os_type_attributed_id.push(rowData[i].ptId);
		}

		os_type_attributed_id = os_type_attributed_id.join(",");
		g_dialog.operateConfirm("确认删除选中的记录么",{
			saveclick : function(){
				um_ajax_post({
					url : module_obj_delete_url,
					paramObj : {ptId:os_type_attributed_id},
					successCallBack : function(data){
						os_type_list({paramObj:null,isLoad:true,maskObj:"body"});
						g_dialog.operateAlert(null,"操作成功！");
					}
				});
				return true;
			}
		});
	}

});
});