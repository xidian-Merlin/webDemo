$(document).ready(function (){

	//样式设置
	{
		$("#content_div").addClass("appbgf");
	}

	var list_url = "logaudit/queryHistoryLogBackup";
	var list_col = [
						{text:'日志文件名',name:"logName"},
						{text:'备份时间',name:"logTime"}
				   ];
	var log_backup_save_url = "logaudit/addConfigLogAudit";

	view_init();

	event_init();

	total_query();

	layout_init();

	function view_init()
	{		
		index_form_init($("#log_backup_div"));
		index_list_get({paramObj:null,isLoad:true,maskObj:"body"});
		g_validate.init($("#time_form"));
	}

	function event_init()
	{
		$(window).on("resize.module" ,function (){
			layout_init();
		});
		$("#save_submit").click(function (){
			save_submit_init();
		});
		$('[data-id=taskmgrTime]').click(function()
		{
			if(($("[data-id=taskmgrTime]")).val() == "")
			{
				$(this).val("00:00:00");
			}
			else
			{
				return;
			}				
		});
		$("[data-id=taskmgrPeriodType]").change(function (){
			var tmp = $(this).val();
			// 先把option全部清除
			$("[data-id=taskmgrMonth]").find("option").remove();
			$("[data-id=taskmgrPeriod]").find("option").remove();

			//每月
			if (tmp == "0")
			{
				// 隐藏几个月的下拉框
				$("[id=month_change]").hide();
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					$("[data-id=taskmgrPeriod]").append('<option value="'+i+'">'+i+'</option>');
				}
			}
			// 每季度
			if (tmp == "5")
			{
				$("[id=month_change]").show();
				$("[data-id=taskmgrMonth]").append('<option value="1">第1月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="2">第2月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="3">第3月</option>');

				for (var i = 1; i < 29; i++)
				{
					$("[data-id=taskmgrPeriod]").append('<option value="'+i+'">'+i+'</option>');
				}
			}
			//每半年
			if (tmp == "4")
			{
				$("[id=month_change]").show();
				$("[data-id=taskmgrMonth]").append('<option value="1">第1月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="2">第2月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="3">第3月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="4">第4月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="5">第5月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="6">第6月</option>');

				for (var i = 1; i < 29; i++)
				{
					$("[data-id=taskmgrPeriod]").append('<option value="'+i+'">'+i+'</option>');
				}
			}
			// 每年
			if (tmp == "3")
			{
				$("[data-id=taskmgrMonth]").show();
				$("[data-id=taskmgrMonth]").append('<option value="1">1月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="2">2月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="3">3月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="4">4月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="5">5月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="6">6月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="7">7月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="8">8月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="9">9月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="10">10月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="11">11月</option>');
				$("[data-id=taskmgrMonth]").append('<option value="12">12月</option>');
				for (var i = 1; i < 29; i++)
				{
					$("[data-id=taskmgrPeriod]").append('<option value="'+i+'">'+i+'</option>');
				}
			}
			$("[data-id=taskmgrMonth]").trigger("change");
			$("[data-id=taskmgrPeriod]").trigger("change");		
		});
	}

	function total_query()
	{
		um_ajax_get({
			url : list_url,
			successCallBack : function(data){
				$("#log_time_div").umDataBind("render" ,data.logAuditConfigStore);
				$("[data-id=taskmgrPeriodType]").val(data.logAuditConfigStore.taskmgrPeriodType);
				$("[data-id=taskmgrPeriodType]").trigger("change");
				$("[data-id=taskmgrMonth]").val(data.logAuditConfigStore.taskmgrMonth);
				$("[data-id=taskmgrMonth]").trigger("change");
				$("[data-id=taskmgrPeriod]").val(data.logAuditConfigStore.taskmgrPeriod);
				$("[data-id=taskmgrPeriod]").trigger("change");
			}
		});
	}

	//保存按钮
	function save_submit_init()
	{
 		if (!g_validate.validate($("#log_time_div")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#log_time_div").umDataBind("serialize");
			saveObj.id = 1;
			um_ajax_post({
				url : log_backup_save_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}
 	}

 	function layout_init()
 	{
 		index_initLayout();
 		$("#table_div1").oneTime(400 ,function (){
 			$("#table_div1").height(
				$("#content_div").height() - 90
			);
 		});
 	}
	
	function index_list_get(option)
	{
		g_grid.render($("#table_div1"),{
			header:list_col,
			url:list_url,
			paramObj : option.paramObj,
			dataKey : "historyLogStore",
			isLoad : option.isLoad,
			maskObj : option.maskObj,
			hideSearch:true,
			allowCheckBox:false
		});
	}

});