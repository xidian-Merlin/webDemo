$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
	'/js/plugin/timeinput/timeinput.js'] ,function (inputdrop ,timeinput){

var discover_list_url = "topo/task/queryTaskList";

var discover_status_click_url = "topo/task/updTaskStatus";

var discover_create_url = "topo/task/addTask";

var discover_beforupdate_url = "topo/task/beforeUpdTask";

var discover_update_url = "topo/task/updTask";

var discover_delete_url = "topo/task/delTask";

var discover_detail_url = "topo/task/viewTask";

var discover_detail_tesk_url = "topo/task/getTaskStatus";

var discover_list_col = [
						{text:'任务名称',name:"taskName"},
						{text:'任务类型',name:"taskType",render:function(text){
							if (text ==1) {
								return '定时任务';
							}
							else{
								return '立即扫描';
							}
						} ,searchRender:function (el){
							var data = [
											{text:"----" ,id:"-1"},
					  						{text:"立即扫描" ,id:"0"},
					  						{text:"定时任务" ,id:"1"}
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "taskType"
							});
						}},
						{text:'运行状态',name:"runStatusDisplay",searchRender:function (el){
							var data = [
											{text:"----" ,id:"-1"},
					  						{text:"发现状态" ,id:"1"},
					  						{text:"完成状态" ,id:"2"},
					  						{text:"异常终止" ,id:"3"},
					  						{text:"待发现" ,id:"4"},
					  						{text:"手动停止" ,id:"5"}
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "runStatus"
							});
						},render:function (txt){
							if (txt == "异常终止")
							{
								return '<span style="color:rgb(255,0,0);opacity:0.6">'+txt+'</span>';
							}
							return txt;
						}},
						{text:'是否启用',name:"taskStatus",render:function(text){
							if (text == 1)
					  		 {
					  			return '<i class="icon-circle f14" style="color:green;"></i>';
					  		 }
					  		 else if (text == 0) {
					  		 	return '<i class="icon-circle f14" style="color:red;"></i>';
					  		 }
					  		 else
					  		 {
					  		 	return '';
					  		 }
						},click:function(data){
							statusClick(data);
						},searchRender:function (el){
							var data = [
											{text:"----" ,id:"-1"},
					  						{text:"启用" ,id:"1"},
					  						{text:"停用" ,id:"0"}
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "status"
							});
						}},
						{text:'完成度',name:"finishedPercent",hideSearch:true},
						{text:'修改时间',name:"updDate" ,searchRender:function (el){
							index_render_div(el ,{type:"date",startKey:"startUpdDate",endKey:"endUpdDate"})
						}},
						{text:'修改人',name:"updater",hideSearch:true},
				];
var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				 ];

var table_div = $("#table_div");

view_init();

event_init();

discover_list({paramObj:null,isLoad:true,maskObj:"body"});

function view_init()
{
	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div")
	});
}

function event_init()
{
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#refurbish_btn").click(function (){
		refurbish_template_init();
	});

	$("#help_btn").click(function (){
	});

}

function discover_list(option)
{
	g_grid.render($("#table_div"),{
		 header:discover_list_col,
		 oper: index_oper,
		 operWidth:"100px",
		 url:discover_list_url,
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 allowCheckBox : false,
		 dbClick : detail_template_init,
		 tdClick : true
	});
}

function refurbish_template_init(rowData)
{
	discover_list({paramObj:null,isLoad:true,maskObj:table_div});
}
//增加
function edit_template_init(rowData)
{
		var title = rowData ? "拓扑发现任务修改" : "拓扑发现任务添加";
		$.ajax({
			type: "GET",
			url: "module/sys_manage/monitor_config/topology_discover_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=discover_edit_template]"),{
					width:"900px",
					init:init,
					title:title,
					initAfter,initAfter,
					saveclick:save_click,
					top:"2%"
				});
			}
		});

		function init(el)
		{
			//IPV4、IPV6切换
			el.find('input[data-id=IPV6]').click(function(event)
			{
				el.find('input[data-flag=mainIp]').removeAttr('disabled', 'disabled');
				el.find('input[data-flag=startIp]').attr('disabled', 'disabled').val("");
				el.find('input[data-flag=endIp]').attr('disabled', 'disabled').val("");
			});
			el.find('input[data-id=IPV4]').click(function(event)
			{
				el.find('input[data-flag=startIp]').removeAttr('disabled','disabled');
				el.find('input[data-flag=endIp]').removeAttr('disabled','disabled');
				el.find('input[data-flag=mainIp]').attr('disabled','disabled').val("");
			});
			//周期类型
			el.find("input[name=typeOpen]").click(function(event)
			{
				if (el.find('input[name=typeOpen]').is(':checked')) {
					el.find('select[value=typeWeek]').removeAttr('disabled');
					el.find('input[data-value=typeWeek]').removeAttr('disabled');
					timeinput.cancelDisabled(el.find("[id=taskTime]"));
				}
				else {
					el.find('select[value=typeWeek]').attr('disabled', 'disabled');
					el.find('select[value=typeWeek]').val('');
					el.find('input[data-value=typeWeek]').attr('disabled', 'disabled');
					el.find('[data-id=taskMonth]').attr('disabled', 'disabled');
					el.find('[data-id=taskMonth]').val('');
					el.find('[data-id=taskPeriod]').attr('disabled', 'disabled');
					el.find('[data-id=taskPeriod]').val('');
					timeinput.setDisabled(el.find("[id=taskTime]"));
					g_validate.clear([el.find('select[value=typeWeek]')]);
					el.find("select").trigger("change");
				}
			});
			el.find('[data-value=typeWeek]').click(function(event)
			{
				if((el.find("[data-value=typeWeek]")).val() == "")
				{
					$(this).val("00:00:00");
				}
				else
				{
					return;
				}				
			});
			//设定周期的变换事件
			el.find("select[data-id=taskPeriodType]").change(function ()
			{
				var tmp = $(this).val();
				// 先把option全部清除
				el.find("select[data-id=taskPeriod]").find("option").remove();
				el.find("select[data-id=taskMonth]").find("option").remove();
				el.find("select[data-id=taskPeriod]").trigger("change");
				el.find("select[data-id=taskMonth]").trigger("change");
				//每天
				if (tmp == "2")
				{
					el.find("select[data-id=taskPeriod]").attr("disabled","disabled");
					el.find("select[data-id=taskMonth]").attr("disabled","disabled");
				}
				//每周
				if (tmp == "1")
				{
					el.find("select[data-id=taskMonth]").attr("disabled","disabled");
					el.find("select[data-id=taskPeriod]").removeAttr("disabled","disabled");	
					// 添加周一至周日
					el.find("select[data-id=taskPeriod]").append('<option value="1">星期一</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="2">星期二</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="3">星期三</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="4">星期四</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="5">星期五</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="6">星期六</option>');
					el.find("select[data-id=taskPeriod]").append('<option value="7">星期日</option>');
				}
				//每月
				if (tmp == "6")
				{
					el.find("select[data-id=taskMonth]").attr("disabled","disabled");
					el.find("select[data-id=taskPeriod]").removeAttr("disabled","disabled");
					// 添加1-28天
					for (var i = 1; i < 29; i++)
					{
						el.find("select[data-id=taskPeriod]").append('<option value="'+i+'">'+i+'日'+'</option>');
					}
				}
				//每季度
				if (tmp == "5")
				{
					el.find("select[data-id=taskPeriod]").removeAttr("disabled","disabled");
					el.find("select[data-id=taskMonth]").removeAttr("disabled","disabled");
					// 添加一季度
					el.find("select[data-id=taskMonth]").append('<option value="1">第一个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="2">第二个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="3">第三个月</option>');
					for (var i = 1; i < 29; i++)
					{
						el.find("select[data-id=taskPeriod]").append('<option value="'+i+'">'+i+'日'+'</option>');
					}

				}
				//每半年
				if (tmp == "4")
				{
					el.find("select[data-id=taskPeriod]").removeAttr("disabled","disabled");
					el.find("select[data-id=taskMonth]").removeAttr("disabled","disabled");
					// 添加半年
					el.find("select[data-id=taskMonth]").append('<option value="1">第一个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="2">第二个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="3">第三个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="4">第四个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="5">第五个月</option>');
					el.find("select[data-id=taskMonth]").append('<option value="6">第六个月</option>');
					for (var i = 1; i < 29; i++)
					{
						el.find("select[data-id=taskPeriod]").append('<option value="'+i+'">'+i+'日'+'</option>');
					}
				}
				//每年
				if (tmp == "3")
				{
					el.find("select[data-id=taskMonth]").removeAttr("disabled","disabled");
					el.find("select[data-id=taskPeriod]").removeAttr("disabled","disabled");
					// 添加1-28天
					for (var j = 1; j < 13; j++)
					{
						el.find("select[data-id=taskMonth]").append('<option value="'+j+'">'+j+'月'+'</option>');
					}
					for (var i = 1; i < 29; i++)
					{
						el.find("select[data-id=taskPeriod]").append('<option value="'+i+'">'+i+'日'+'</option>');
					}

				}
				el.find("select[data-id=taskPeriod]").trigger("change");
				el.find("select[data-id=taskMonth]").trigger("change");
			});

			var startIpEl = el.find("[data-flag=startIp]");
			var endIpEl = el.find("[data-flag=endIp]");
			//右移事件
			el.find("[id=chevron-right]").click(function (){
				if(startIpEl.val()!=""&&endIpEl.val()==="")
				{
					endIpEl.val(startIpEl.val());
				}
				else if(startIpEl.val()===""&&endIpEl.val()!="")
				{
					startIpEl.val(endIpEl.val());
				}

				if (!g_validate.validate(el.find('#file_baseline_template'))){
					return false;
				}
				var processArray = g_grid.getIdArray(el.find("[id=ipList_table]") ,{attr:"startIp"});
				if (processArray.indexOf(el.find("[data-flag=startIp]").val()) != -1)
				{
					g_dialog.operateAlert(el ,"记录重复！" ,"error");
					return false;
				}
				if (el.find('input[data-id=IPV4]').is(":checked")) {
					if (!g_validate.ipValidate(startIpEl ,endIpEl ,g_grid.getData($("#ipList_table"))))
					{
						return false;
					}
					g_grid.addData(el.find("[id=ipList_table]") ,[{
						ipRangeDisplay : startIpEl.val()+"-"+endIpEl.val(),
						startIp : startIpEl.val(),
						endIp : endIpEl.val()
					}]);
					el.find("[data-flag=startIp]").val("");
					el.find("[data-flag=endIp]").val("");
				}
				else
				{
					g_grid.addData(el.find("[id=ipList_table]") ,[{
						ipRangeDisplay : el.find("[data-flag=mainIp]").val(),
						startIp : el.find("[data-flag=mainIp]").val(),
						endIp : el.find("[data-flag=mainIp]").val()
					}]);
					el.find("[data-flag=mainIp]").val("");
				}

			});
			// 左移事件
			el.find("[id=chevron-left]").click(function (){
				var data = g_grid.getData(el.find("[id=ipList_table]") ,{chk:true});
				if (data.length == 0)
				{
					g_dialog.operateAlert(el ,"请选择一条记录。" ,"error");
				}
				else if (data.length > 1)
				{
					g_dialog.operateAlert(el ,"只允许选择一条记录。" ,"error");
				}
				else
				{
					var startType;
					if(data[0].ipRangeDisplay.indexOf("-")>0)
					{
						startType = 1;
					}
					else
					{
						startType = 2;
					}

					el.find("[name=ipVersion][value="+startType+"]").attr("checked","checked");
					el.find("[name=ipVersion][value="+startType+"]").click();
					if(startType == 1)
					{	
						var array = data[0].ipRangeDisplay.split("-");
						el.find("[data-flag=startIp]").val(array[0]);
						el.find("[data-flag=endIp]").val(array[1]);
					}
					else if(startType == 2)
					{
						el.find("[data-flag=mainIp]").val(data[0].ipRangeDisplay);
					}

					g_grid.removeData(el.find("[id=ipList_table]"));
				}
			});

		}

		function initAfter(el)
		{
			timeinput.render(el.find("[id=taskTime]") ,{validate:true,initVal:"00:00:00"});
			timeinput.setDisabled(el.find("[id=taskTime]"));
			g_grid.render(el.find('[id=ipList_table]'),{
				data:[],
				header : [{text:'IP范围',name:'ipRangeDisplay'}],
				paginator:false,
				isLoad:false,
				allowCheckBox : true,
				hideSearch : true

			});

			if (rowData)
			{
				$(el).umDataBind("render" ,rowData);

				if (rowData.taskStatus=="1") {
					el.find('[data-id=taskStatus]')[0].checked = true;
					
					el.find("[data-id=taskPeriodType]").val(rowData.taskPeriodType);
					el.find("[data-id=taskPeriodType]").trigger("change");
					el.find("[data-id=taskMonth]").val(rowData.taskMonth);
					el.find("[data-id=taskMonth]").trigger("change");
					el.find("[data-id=taskPeriod]").val(rowData.taskPeriod);
					el.find("[data-id=taskPeriod]").trigger("change");
				}
				else
				{
					el.find('[data-id=taskStatus]')[0].checked = false;
				}

					
				//加载拓扑发现表单
				um_ajax_post({
						url : discover_beforupdate_url,
						isLoad: true,
				    	paramObj : {taskID:rowData.taskID},
						successCallBack : function (data){
							g_grid.addData(el.find('[id=ipList_table]') ,data.netSectionStore);

							if (rowData.taskType == "1")
							{
								el.find("input[name=typeOpen]").click();
								timeinput.setData(el.find("[id=taskTime]") ,rowData.taskTime);
							}
							//inputdrop.setDataSelect(el.find('[id=agentId]') ,data.discoverStore[0].agentId);
						}
				});
			}
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el.find('#task_name_div'))||!g_validate.validate(el.find('#timer_task_div'))){
				return false;
			}

			var data = g_grid.getData(el.find("[id=ipList_table]") ,{});
			if (data.length == 0)
			{
				g_dialog.operateAlert(el ,"请输入IP地址段信息" ,"error");
				return false;
			}

			if ($("[data-id=taskType]").is(':checked')) {
				saveObj.taskType = 1;
			}else{
				saveObj.taskType = 0;
			}

			if ($("[data-id=taskStatus]").is(':checked')) {
				saveObj.taskStatus = 1;
			}else{
				saveObj.taskStatus = 0;
			}
			var flag_url = discover_create_url;
			if(rowData){
				flag_url = discover_update_url;
			}

			um_ajax_post({
				url : flag_url,
				paramObj: {discoverStore:
								{
								  taskName:saveObj.taskName,
								  taskType:saveObj.taskType,
								  auto:saveObj.auto,
								  findWay:saveObj.findWay,
								  agentId:saveObj.agentId,//100022,
								  taskStatus:saveObj.taskStatus
								},
							netSectionStore:g_grid.getData($("#ipList_table")),
							formal:0,
							scanPolicy:"",
							emailNotice:0,
							smsNotice:0,
							noticePeople:"",
							taskPeriodType:saveObj.taskPeriodType,
							taskMonth:saveObj.taskMonth,
							taskPeriod:saveObj.taskPeriod,
							taskTime:saveObj.taskTime,
							taskID:(rowData?rowData.taskID:"")
							},
				maskObj:el,
				successCallBack : function(data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"操作成功!");
					discover_list({paramObj:null,isLoad:true,maskObj:table_div});
				}
			});
		}

}

function detail_template_init(rowData)
{
	//添加一个启用停用按钮
	var btn_btn = [];
	if(rowData.taskStatus == "1")
	{
		btn_btn = [
					{id:"stop_btn",text:"停止按钮",aClick:statusClick}
	     		  ]
	}
	if(rowData.taskStatus == "0")
	{
		btn_btn = [
					{id:"open_btn",text:"启用按钮",aClick:statusClick}
	     		  ]
	}
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/topology_discover_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=discover_detail_template]"),{
				width:"800px",
				init:init,
				title:"拓扑发现任务详细信息",
				//btn_array:btn_btn,
				isDetail:true,
				initAfter,initAfter,
				top : "6%"
			});
		}
	});

	function init(el)
	{
		$(el).umDataBind("render" ,rowData);
		if (rowData.resultInfo)
		{
			$("[data-id=resultInfo]").html(rowData.resultInfo);
		}

		if (el.find('[data-id=taskType]').html() == "1") {
			el.find('[data-id=taskType]').html("定时任务");
		}
		else
		{
			el.find('[data-id=taskType]').html("立即扫描");
		}
		//运行状态
		if (el.find('[data-id=taskStatus]').html() == "1") {
			el.find('[data-id=taskStatus]').html("启用");
		}
		else if (el.find('[data-id=taskStatus]').html() == "0")
		{
			el.find('[data-id=taskStatus]').html("停用");
		}
		else
		{
			el.find('[data-id=taskStatus]').html("");
		}
		if ("异常终止" == rowData.runStatusDisplay)
		{
			el.find("[data-id=runStatusDisplay]").css("color" ,"red");
		}

	}

	function initAfter(el)
	{
		var isFirstLoad = true;
		process();
		if (rowData.taskStatus == "1")
		{
			$("#index_timer_inp").everyTime(1000 ,function (){
				if (el.is(":hidden"))
				{
					$("#index_timer_inp").stopTime();
					return false;
				}
				process();
			});
		}

		function process()
		{
			um_ajax_post({
				url : discover_detail_url,
				isLoad: isFirstLoad,
				paramObj : {taskID:rowData.taskID},
				maskObj : el,
				successCallBack : function (data){
					el.find('[data-id=ips]').html(data[0].ips);
					el.find("#finishedPercent_div").css("width" ,data[0].finishedPercent);
					if (data[0].resultInfo)
					{
						el.find("[data-id=resultInfo]").html(data[0].resultInfo);
					}
					
					if (data[0].runStatus == "1")
					{
						el.find("[id=discover_gif_div]").show();
						el.find("[id=run_status_info]").text("扫描中");
					}
					if (data[0].runStatus == "2")
					{
						el.find("[id=run_status_info]").text("已完成");
						$("#index_timer_inp").stopTime();
						el.find("[id=discover_gif_div]").hide();
					}
					if (data[0].runStatus == "3")
					{
						el.find("[id=run_status_info]").text("异常终止");
						$("#index_timer_inp").stopTime();
						el.find("[id=discover_gif_div]").hide();
					}
					if (data[0].runStatus == "4")
					{
						el.find("[id=run_status_info]").text("待发现");
						$("#index_timer_inp").stopTime();
						el.find("[id=discover_gif_div]").hide();
					}
					if (data[0].runStatus == "5")
					{
						el.find("[id=run_status_info]").text("手动停止");
						$("#index_timer_inp").stopTime();
						el.find("[id=discover_gif_div]").hide();
						el.find("[id=detail_info]").hide();
					}
					if ("异常终止" == data[0].runStatusDisplay)
					{
						el.find("[data-id=runStatusDisplay]").css("color" ,"red");
					}
					isFirstLoad = false;
				}
			});
		}

	}

	function statusClick(el)
	{
		var stopStart;
		if (rowData.taskStatus == "0")
		{
			stopStart = "确认启用任务吗？";
		}
		else if(rowData.taskStatus == "1")
		{
			stopStart = "确认停用任务吗？";
		}
		else
		{
			stopStart = "";
		}
		g_dialog.operateConfirm(stopStart ,{
			saveclick:function(){
				um_ajax_post({
					url:discover_status_click_url,
					paramObj:{taskID:rowData.taskID,
								taskStatus:rowData.taskStatus,
								taskType:rowData.taskType},
					successCallBack:function(data){
						discover_list({paramObj:null,isLoad:true,maskObj:table_div});
						g_dialog.operateAlert(null ,"操作成功！");
						initAfter(el);
						return true;
					}
				});

			}
		});
	}
}
//删除
function index_list_delete(rowData)
	{
		g_dialog.operateConfirm("确认删除此记录么？" ,{
			saveclick:function(){
				um_ajax_post({
					url:discover_delete_url,
					paramObj:{taskID:rowData.taskID},
					successCallBack:function(data){
						discover_list({paramObj:null,isLoad:true,maskObj:table_div});
						g_dialog.operateAlert(null ,"删除成功！");
						return true;
					}
				});

			}
		});
	}

//单元格单击事件
function statusClick(rowData)
{
	var stopStart;
	if (rowData.taskStatus == "0")
	{
		stopStart = "确认启用任务吗？";
	}
	else if(rowData.taskStatus == "1")
	{
		stopStart = "确认停用任务吗？";
	}
	else
	{
		stopStart = "";
	}
	g_dialog.operateConfirm(stopStart ,{
		saveclick:function(){
			um_ajax_post({
				url:discover_status_click_url,
				paramObj:{taskID:rowData.taskID,
							taskStatus:rowData.taskStatus,
							taskType:rowData.taskType},
				successCallBack:function(data){
					discover_list({paramObj:null,isLoad:true,maskObj:table_div});
					g_dialog.operateAlert(null ,"操作成功！");
					return true;
				}
			});

		}
	});
}



});
});