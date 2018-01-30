$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
	     '/js/plugin/tree/tree.js',
	     '/js/plugin/tab/tab.js',
	     '/js/plugin/plot/plot.js',
	     '/js/plugin/workorder/workorder.js',
	     '/js/plugin/event/event.js'] ,function (inputdrop ,tree ,tab ,plot ,workorder ,pevent){
	//固定表头
	var list_header = [
	 					{text:'资产名称',name:"ed_name"},
	 					{text:'未处理漏洞数量',name:"unhandledVulNum"},
	 					{text:'全部漏洞数量',name:"totalVulNum"},
	 					{text:'变化趋势',name:"newFoundText"}
						];
	//列表url
	var list_url = "vul/finish/queryFinishEdList";
	//忽略全部url
	var lgnore_all_url = "deployEvent/doIgnoreAll";
	//忽略url
	var lgnore_url = "deployEvent/doIgnore";

	var el_event_list = $("#table_div");

	var current_query_obj = {};

	event_init();

	event_analy_list({paramObj : null ,isLoad : true ,maskObj : "body"});

	function event_analy_list (option)
	{
		g_grid.render($("#table_div"),{
		 			header:list_header,
		 			url:list_url,
		 			paramObj : option.paramObj,
		 			isLoad : option.isLoad,
		 			maskObj : option.maskObj,
		 			allowCheckBox : true,
					hideSearch : true,
		 			dbClick : vulner_event_record_dbclick,
		 			cbf:function (){
						$("#table_div").children().data("queryObj" ,current_query_obj);
					}
		});
	}

	function event_init()
	{
		//导出EXCEL
		$("#export_btn").click(function(rowData) {
			export_excel();
		});

		//导入
		$("#import_btn").click(function() {
			import_excel();
		});

		//忽略全部
		$("#lgnore_all_btn").click(function(rowData) {
			ignore_all();
		});

		//忽略
		$("#lgnore_btn").click(function() {
			ignore();
		});

		// 生成工单
		$("#order_btn").click(function() {
			create_workorder();
		});

		// 高级查询
		$("#query_btn").click(function () {
			the_best_query();
		});
	}

	function export_excel(rowData)
	{
		var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"faultNO"});
		window.location.href = index_web_app + "vul/finish/exportExcel?eventIds=" + idArray.join(",");
	}

	function import_excel()
	{

	}

	function ignore_all(rowData)
	{
		pevent.ignoreAll({
			gridEl : el_event_list,
			lgnore_all_url : "vul/finish/doIgnoreAll",
			cb: function() {
				event_analy_list({
					paramObj : null,
					isLoad : true,
					maskObj : el_event_list
				});
			}
		});
	}

	function ignore(rowData)
	{
		var data = g_grid.getData($("#table_div") ,{chk:false});
		if (data.length == 0)
		{
			// 弹出提示
			g_dialog.operateAlert($("#table_div") ,"请选择要忽略的脆弱性事件。" ,"error");
			// 直接返回
			return false;
		}
		pevent.ignore({
			gridEl : el_event_list,
			attr : "faultNO",
			ignore_url : lgnore_url,
			cb: function() {
				event_analy_list({
					paramObj : null,
					isLoad : true,
					maskObj : el_event_list
				});
			}
		});
	}

	function create_workorder()
	{
		var dataArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"ed_id"});
		if (dataArray.length == 0)
		{
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}
		var array = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"unhandledVulNum"});
		if(array.indexOf("0") > -1)
		{
			g_dialog.operateAlert($("#table_div") ,"有未处理漏洞数量为0的资产，不能生成工单。" ,"error");
			return false;
		}
		window.location.href = "#/oper_workorder/workorder_handle/workorder_detail?id=socsjczlc&eventStr="+dataArray.join(",")+"&eventType=14";
	}

	function the_best_query()
	{
		$.ajax({
			type: "GET",
			url: "module/sec_manage/event_analy/vulner_event_analy_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=query_template]"),{
					width : "1000px",
					init : init,
					initAfter : initAfter,
					saveclick : save_click,
					title : "最弱性事件查询"
				});
			}
		});

		function init(el)
		{
			el.find("[name=ipRadioStatus]").click(function (){
				if ($(this).val() == "0")
				{
					el.find("[id=ipRadioStatusStartIp]").removeAttr("disabled");
					el.find("#ipRadioStatusEndIp").removeAttr("disabled");
					el.find("#ipRadioStatusIpv6").attr("disabled" ,"disabled");
					el.find("#ipRadioStatusIpv6").val("");
				}
				else
				{
					el.find("#ipRadioStatusStartIp").attr("disabled" ,"disabled");
					el.find("#ipRadioStatusEndIp").attr("disabled" ,"disabled");
					el.find("#ipRadioStatusIpv6").removeAttr("disabled");
					el.find("#ipRadioStatusStartIp").val("");
					el.find("#ipRadioStatusEndIp").val("");
				}
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

		function save_click(el ,saveObj)
		{
			if (el.find("[name=ipRadioStatus]:checked").val() == "0")
			{
				saveObj.mainIp = el.find("[data-id=ipRadioStatusStartIp]").val()+"-"+
									el.find("[data-id=ipRadioStatusEndIp]").val();
			}
			else
			{
				saveObj.mainIp = el.find("[data-id=ipRadioStatusIpv6]");
			}
			current_query_obj = saveObj;
			// 关闭对话框
			g_dialog.hide(el);
			// 重新刷新列表
			event_analy_list({paramObj:saveObj,isLoad:true,maskObj:"body"});
	    }
	}

	function vulner_event_record_dbclick(rowData)
	{
		pevent.vulnerEventDetail(rowData);
	}

});
});