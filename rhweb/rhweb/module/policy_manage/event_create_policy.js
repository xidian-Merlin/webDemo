$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	var list_url = "user/queryUserList";
	var list_col = [
						{text:'安全策略名称',name:"userName",searchRender:function (el){
				  			el.append('<input type="text" class="form-control input-sm" search-data="userName">');
				  		}},
						{text:'匹配规则',name:"userAccount"},
						{text:'最大限定时间(秒)',name:"userPhone"},
						{text:'最大聚合次数',name:"userMobilePhone"},
						{text:'事件频率(条/秒)',name:"userEmail"}
				   ];
	var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					 ];

	var update_url = "";

	var export_url = "";

	var import_url = "";

	event_init();

	policy_list();

	function event_init()
	{
		$("#export_btn").click(function (){
			export_init();
		});

		$("#import_btn").click(function (){
			import_init();
		});
	}

	function policy_list()
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: index_oper,
			 operWidth:"80px",
			 url:list_url,
			 isLoad : true,
			 maskObj : "body",
			 dbClick : detail_template_init
		});
	}

	function edit_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/policy_manage/event_create_policy_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"560px",
					init:init,
					title : "事件生成策略修改",
					saveclick:save_click,
					top:"6%"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render",rowData);
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}

			if(el.find("[name=match_rule]:checked").size() == 0) 
			{
				g_dialog.operateAlert(el, "请至少选择一种规则匹配。" ,"error");
				return false;
			}
			um_ajax_post({
				url : update_url,
				paramObj : saveObj,
				maskObj : el,
				successCallBack : function (data){
					g_dialog.operateAlert();
					g_dialog.hide(el);
					g_grid.refresh($("#table_div"));
				}
			});
		}
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/policy_manage/event_create_policy_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"500px",
					init:init,
					title:"时间生成策略详细信息",
					isDetail : true
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
		}
	}

	function export_init()
	{
		var idArray = g_grid.getIdArray($("#table_div") ,{attr:"policyId" ,chk:"true"});
		window.location.href = index_web_app + "AssetOperation/exportAssetXml" + "?exportPolicyId="+idArray.join(",");
	}
	function import_init()
	{
		$.ajax({
			type: "GET",
			url: "module/policy_manage/event_create_policy_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=import_template]"),{
					width:"500px",
					top:"25%",
					init:init,
					title:"时间生成策略导入",
					saveclick: save_click
				});
			}
		});
		function init(el)
		{
			index_create_upload_el(el.find("[id=ptMap]"));
			el.find("[class=icon-trash]").click(function (){
				el.find("[data-id=up_name]").val("");
			});
		}
		function save_click(el,saveObj)
		{
			var validate_result = g_validate.fileSuffixLimit(el.find('[id=ptMap]').val(),"xml",true,true);
			if(!validate_result.flag){
				g_dialog.operateAlert(null,validate_result.msg,"error");
				return false;
			}

			$("[name=formJson]").val(JsonTools.encode(saveObj ));

			um_ajax_file(el.find("[id=import_template]"),{
				url : import_url,
				paramObj : {},
				successCallBack : function(){
					g_dialog.operateAlert();
					g_dialog.hide(el);
				}
			});
				
		}

	}
});
});