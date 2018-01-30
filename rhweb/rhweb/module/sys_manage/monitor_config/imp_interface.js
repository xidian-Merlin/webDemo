$(document).ready(function (){


	var list_url = "assetmanage/importinterface/queryInterfaceList";
	var list_col = [
						{text:'',name:"t",width:5,hideSearch:"hide"},
						{text:'资产名称',name:"devicename",width:14,align:"left"},
						{text:'主IP',name:"deviceIP",width:11,searchRender:function (el){
								  		index_render_div(el ,{type:"ip"});
								  }},
						{text:'接口类型',name:"interfaceType",width:14},
						{text:'接口号',name:"interfaceNum",width:14},
						{text:'接口流量阈值(%)',name:"threshold",width:14},
						{text:'连续达到阈值次数',name:"timeCnt",width:14},
						{text:'接口描述',name:"description",width:14}
				   ];

	var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:update_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
					 ];

	var imp_interface_add_url = "assetmanage/importinterface/updInterface";

	var imp_interface_update_url = "assetmanage/importinterface/batchUpdInterface";

	var imp_interface_delete_url = "assetmanage/importinterface/doBatchDel";

	var imp_interface_dialog_query_url = "AssetOperation/queryAsset";

	var imp_interface_dialog_query_interface_url = "assetmanage/importinterface/queryInterface";
	
	event_init();

	imp_interface_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(imp_interface_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function event_init()
	{
		$("#add_btn").click(function (){
			add_template_init();
		});

		$("#update_btn").click(function (){
			update_template_init();
		});

		$("#batch_update_btn").click(function (){
			batch_update_template_init();
		});

		$("#batch_delete_btn").click(function (){
			index_list_batch_delete();
		});
	}

	function imp_interface_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: index_oper,
			 operWidth:"100px",
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj
		});
	}

	function index_list_delete(rowData)
	{	
		var saveObj = {};					
		var buffer = [];				
		var tmp = {};
		tmp.interfaceNum = rowData.interfaceNum;
		tmp.deviceId = rowData.deviceId;
		buffer.push(tmp);

		saveObj.interfaceStore = buffer;

		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : imp_interface_delete_url,
					paramObj : saveObj,
					successCallBack : function(data){
						imp_interface_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function index_list_batch_delete()
	{
		var target_attributed_id = [];

		target_attributed_id = g_grid.getIdArray($("#table_div") ,{chk:true});

		if(target_attributed_id.length == 0){
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}

		var saveObj = {};
		var data = g_grid.getData($("#table_div") ,{chk:true});
 				
				var buffer = [];

				for (var i = 0; i < data.length; i++) {
					var tmp = {};
					tmp.interfaceNum = data[i].interfaceNum;
					tmp.deviceId = data[i].deviceId;
					buffer.push(tmp);
				}

				saveObj.interfaceStore = buffer;	

		g_dialog.operateConfirm("确认删除选中的记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : imp_interface_delete_url,
					paramObj : saveObj,
					successCallBack : function(data){
						imp_interface_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function add_template_init()
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/monitor_config/imp_interface_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=imp_interface_add_template]"),{
					width:"1000px",
					init:init,
					initAfter:initAfter,
					saveclick:save_click,
					title:"重点接口添加",
					top:"2%",
					autoHeight:"autoHeight"
				});
			}
		});

		function init(el)
		{
			dialog_up_list(el);
			dialog_down_list(el);
			
			el.find("[name=ipRadioStatus]").click(function (){
				if ($(this).val() == "0")
				{
					el.find("[id=ipRadioStatusStartIp]").removeAttr("disabled");
					el.find("[id=ipRadioStatusEndIp]").removeAttr("disabled");
					el.find("[id=ipRadioStatusIpv6]").attr("disabled" ,"disabled");
					el.find("[id=ipRadioStatusIpv6]").val("");
					g_validate.clear([el.find("[id=ipRadioStatusIpv6]")]);
				}
				else
				{
					el.find("[id=ipRadioStatusStartIp]").attr("disabled" ,"disabled");
					el.find("[id=ipRadioStatusEndIp]").attr("disabled" ,"disabled");
					el.find("[id=ipRadioStatusIpv6]").removeAttr("disabled");
					el.find("[id=ipRadioStatusStartIp]").val("");
					el.find("[id=ipRadioStatusEndIp]").val("");
					g_validate.clear([el.find("[id=ipRadioStatusStartIp]") ,el.find("[id=ipRadioStatusEndIp]")]);
				}
			});

			el.find("[id=form_query_btn]").click(function (){
				var saveObj = el.find("[id=add_form]").umDataBind("serialize");
				if (el.find("[name=ipRadioStatus]:checked").val() == "0")
				{
					saveObj.mainIp = el.find("[data-id=ipRadioStatusStartIp]").val()+"-"+
										el.find("[data-id=ipRadioStatusEndIp]").val()
				}
				else
				{
					saveObj.mainIp = el.find("[data-id=ipRadioStatusIpv6]");
				}
				//封装参数 调用后台   后台能传回来一个 数组
				um_ajax_get({
					url : imp_interface_dialog_query_url,
					paramObj : saveObj,
					maskObj : "body",
					successCallBack : function (data){
						g_grid.removeData(el.find("#dialog_up_table_div") ,{});
						g_grid.removeData(el.find("[id=dialog_down_table_div]") ,{});
						g_grid.addData(el.find("#dialog_up_table_div") ,data);
					}
				});
			});

			el.on("click","[type=radio]" ,function(){
				
			var rowData = $(this).closest("tr").data("data");
			var obj = {};
			obj.deviceId = rowData.edId;
				um_ajax_get({
				 	url : imp_interface_dialog_query_interface_url,
				 	paramObj : obj,
				 	maskObj : "body",
				 	successCallBack : function (data){
				 		g_grid.removeData(el.find("[id=dialog_down_table_div]") ,{});
				 		g_grid.addData(el.find("[id=dialog_down_table_div]") ,data);
				 	}
				});
			});
	    }

	    function initAfter(el)
	    {
	    	g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]")});
	    	g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]")});
	    	g_formel.sec_biz_render({assetTypeEl:el.find("[id=assetType]")});

	    	g_formel.code_list_render({
								   	   		key : "osCodeList",
								   	   		osCodeEl : el.find("[data-id=osType]")
								   	    });

	    }

	    function dialog_up_list(el)
	    {
			var dialog_up_header = [
							{text:'',name:"radio" ,render:function(txt ,rowData){
								return '<input type="radio" name="table_btn"/>';
							} ,width:3},
							{text:'资产名称',name:"assetName" ,width:33},
							{text:'资产编号',name:"assetCode" ,width:32},
							{text:'主IP',name:"mainIp" ,width:32}
			];
			g_grid.render(el.find("[id=dialog_up_table_div]"),{
				data:[],
				header:dialog_up_header,
				server : "/",
		 		paramObj : el.paramObj,
		 		paginator:false,
				allowCheckBox:false,
				hideSearch : true
			});
	    }

	    function dialog_down_list(el)
	    {
			var dialog_down_header = [
							{text:'接口类型',name:"interfaceType"},
							{text:'接口号',name:"interfaceNum"},
							{text:'接口描述',name:"description"}
			];
			g_grid.render(el.find("[id=dialog_down_table_div]"),{
				data:[],
				header:dialog_down_header, 
		 		paramObj : el.paramObj,
		 		paginator:false,
		 		hideSearch : true
			});
	    }

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el)){
				return false;
			}
			
			var data = g_grid.getData(el.find("#dialog_up_table_div"));
			if(data.length==0){
				g_dialog.operateAlert("body" ,"请选择资产" ,"error");
				return false;
			}

			var data = g_grid.getData(el.find("#dialog_down_table_div"));
			if(data.length==0){
				g_dialog.operateAlert("body" ,"请选择资产" ,"error");
				return false;
			}

			var data = g_grid.getData(el.find("#dialog_down_table_div") ,{chk:true});
			if(data.length==0){
				g_dialog.operateAlert("body" ,"请选择要添加的重点接口" ,"error");
				return false;
			}

			var buffer = [];

			for (var i = 0; i < data.length; i++) {
				data[i].timeCnt = saveObj.timeCnt;
				data[i].threshold = saveObj.threshold;
				buffer.push(data[i]);
			}
			
			var obj = {};
			obj.updstore = buffer;
						
			um_ajax_post({
				url : imp_interface_add_url,
				paramObj : obj,
				maskObj : el,
				successCallBack : function (){
					// 关闭对话框
					g_dialog.hide(el);
					// 弹出成功提示
					g_dialog.operateAlert();
					// 重新刷新列表
					imp_interface_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
	    }
	}

	function update_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/monitor_config/imp_interface_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=imp_interface_update_template]"),{
					width:"600px",
					init:init,
					saveclick:save_click,
					title:"重点接口修改"
				});
			}
		});

		function init(el)
		{
			el.find("[id=imp_interface_update_template]").umDataBind("render" ,rowData);			
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate($("#imp_interface_update_template")))
 			{
 				return false;
 			}

 			else
 			{	
 				var buffer = [];

					var tmp = {};
					tmp.interfaceNum = rowData.interfaceNum;
					tmp.deviceId = rowData.deviceId;
					tmp.timeCnt = saveObj.timeCnt;
					tmp.threshold = saveObj.threshold;
					buffer.push(tmp);

				saveObj.interfaceStore = buffer;
 				
				um_ajax_post({
					url : imp_interface_update_url,
					paramObj : saveObj,
					maskObj : el,
					successCallBack : function (data){
						g_dialog.operateAlert();
						g_dialog.hide(el);
						imp_interface_list({paramObj:null,isLoad:true,maskObj:"body"});
					}
				});
			}
		}
	}

	function batch_update_template_init()
	{
		var data = g_grid.getData($("#table_div") ,{chk:true});
		if (data.length == 0)
		{
			g_dialog.operateAlert($("#table_div") ,"请选择要修改的记录!" ,"error");
			return false;
		}

		$.ajax({
			type: "GET",
			url: "module/sys_manage/monitor_config/imp_interface_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=imp_interface_update_template]"),{
					width:"600px",
					saveclick:save_click,
					title:"重点接口批量修改"
				});
			}
		});

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate($("#imp_interface_update_template")))
 			{
 				return false;
 			}

 			else
 			{	
 				var data = g_grid.getData($("#table_div") ,{chk:true});
 				
				var buffer = [];

				for (var i = 0; i < data.length; i++) {
					var tmp = {};
					tmp.interfaceNum = data[i].interfaceNum;
					tmp.deviceId = data[i].deviceId;
					tmp.timeCnt = saveObj.timeCnt;
					tmp.threshold = saveObj.threshold;
					buffer.push(tmp);
				}

				saveObj.interfaceStore = buffer;	

				um_ajax_post({
					url : imp_interface_update_url,
					paramObj : saveObj,
					maskObj : el,
					successCallBack : function (data){
						g_dialog.operateAlert();
						g_dialog.hide(el);
						imp_interface_list({paramObj:null,isLoad:true,maskObj:"body"});
					}
				});
			}
		}
	}
});