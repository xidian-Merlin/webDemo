$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

var vulner_list_url = "vul/task/queryTaskList";
var vulner_list_col = [
					{text:'任务名称',name:"taskName"},
					{text:'任务类型',name:"taskType",render:function(text){
						if (text ==1) {
							return '定时任务';
						}
						else{
							return '立即扫描';
						}
					},searchRender:function (el){
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
					{text:'修改时间',name:"updDate",searchRender:function (el){
							index_render_div(el ,{type:"date",startKey:"startUpdDate",endKey:"endUpdDate"});
					}},
					{text:'修改人',name:"updater",hideSearch:true},
			   ];
var index_oper = [
					{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init },
				  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:vulner_scan_delete  ,isShow:function (rowData){
				  		return !rowData.system;
				  	}}
				];
var vulner_scan_status_click_url = "vul/task/updTaskStatus";

var vulner_scan_create_url = "vul/task/addTask";

var vulner_scan_delete_url = "vul/task/delTask";

var vulner_scan_beforupdate_url = "vul/task/beforeUpdTask";

var vulner_scan_update_url = "vul/task/updTask";

var vulner_scan_detail_url = "vul/task/viewTask";

var vulner_scan_detail_tesk_url = "vul/task/getTaskStatus";

var table_div = $("#table_div");

view_init();

event_init();

vulner_list({paramObj:null,isLoad:true,maskObj:"body"});

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
}

function vulner_list(option)
{
	g_grid.render($("#table_div"),{
		 header:vulner_list_col,
		 oper: index_oper,
		 operWidth:"100px",
		 url:vulner_list_url,
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
	vulner_list({paramObj:null,isLoad:true,maskObj:table_div});
}
// 编辑
function edit_template_init(rowData)
{
	var title = rowData ? "扫描任务修改" : "扫描任务添加";
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/vulner_scan_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=vulner_edit_template]"),{
				width:"900px",
				init:init,
				title : title,
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
			el.find('input[data-id=mainIp]').removeAttr('disabled', 'disabled');
			el.find('input[data-id=startIp]').attr('disabled', 'disabled').val("");
			el.find('input[data-id=endIp]').attr('disabled', 'disabled').val("");
		});
		el.find('input[data-id=IPV4]').click(function(event)
		{
			el.find('input[data-id=startIp]').removeAttr('disabled','disabled');
			el.find('input[data-id=endIp]').removeAttr('disabled','disabled');
			el.find('input[data-id=mainIp]').attr('disabled','disabled').val("");
		});
		//周期类型
		el.find("input[name=typeOpen]").click(function(event)
		{
			if (el.find('input[name=typeOpen]').is(':checked')) {
				el.find('select[value=typeWeek]').removeAttr('disabled');
				el.find('input[data-value=typeWeek]').removeAttr('disabled');
			}
			else {
				el.find('select[value=typeWeek]').attr('disabled', 'disabled');
				el.find('select[value=typeWeek]').val('');
				el.find('[data-id=taskMonth]').attr('disabled', 'disabled');
				el.find('[data-id=taskMonth]').val('');
				el.find('[data-id=taskPeriod]').attr('disabled', 'disabled');
				el.find('[data-id=taskPeriod]').val('');
				el.find('input[data-value=typeWeek]').attr('disabled', 'disabled');
				el.find('input[data-value=typeWeek]').val('');
				g_validate.clear([el.find('select[value=typeWeek]') ,el.find("[data-id=taskTime]")]);
				el.find("select").trigger("change");
			}
		});
		el.find('[data-value=typeWeek]').click(function(event)
		{
			$(this).val("00:00:00")
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

		//加载选择代理
		g_formel.code_list_render({
			key : "agentConfigList",
			agentSelEl : el.find("[data-id=nodeID]")
		});

		//漏洞扫描器配置
		g_formel.code_list_render({
			key : "scanTaskPolicyList",
			scanTaskPolicyEl : el.find("[id=scanPolicy]")
		});

		var startIpEl = el.find("[data-id=startIp]");
		var endIpEl = el.find("[data-id=endIp]");
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

			if (!g_validate.validate(el.find('#network_div'))){
				return false;
			}
			var processArray = g_grid.getIdArray(el.find("[id=ipList_table]") ,{attr:"startIp"});
			if (processArray.indexOf(el.find("[data-id=startIp]").val()) != -1)
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
				startIpEl.val("");
				endIpEl.val("");
			}
			else
			{
				g_grid.addData(el.find("[id=ipList_table]") ,[{
					ipRangeDisplay : el.find("[data-id=mainIp]").val(),
					startIp : el.find("[data-id=mainIp]").val(),
					endIp : el.find("[data-id=mainIp]").val()
				}]);
				el.find("[data-id=mainIp]").val("");
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


				el.find("[name=ipType][value="+startType+"]").attr("checked","checked");
				el.find("[name=ipType][value="+startType+"]").click();
				if(startType == 1)
				{	
					var array = data[0].ipRangeDisplay.split("-");
					el.find("[data-id=startIp]").val(array[0]);
					el.find("[data-id=endIp]").val(array[1]);
				}
				else if(startType == 2)
				{
					el.find("[data-id=mainIp]").val(data[0].ipRangeDisplay);
				}

				g_grid.removeData(el.find("[id=ipList_table]"));
			}
		});
	}

	function initAfter(el)
	{
		g_grid.render(el.find('[id=ipList_table]'),{
					data : [],
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
			}
			else
			{
				el.find('[data-id=taskStatus]')[0].checked = false;
			}

				el.find("select").trigger("change");
			//加载脆弱性扫描表单
			um_ajax_post({
					url : vulner_scan_beforupdate_url,
					isLoad: true,
			    	paramObj : {taskID:rowData.taskID},
					successCallBack : function (data){
						g_grid.addData(el.find('[id=ipList_table]') ,data.netSectionStore);

						if (rowData.taskType == "1")
						{
							el.find("input[name=typeOpen]").click();
						}
						el.find("[data-id=nodeID]").val(data.discoverStoreBack[0].nodeID);
						el.find("[data-id=nodeID]").trigger("change");
						inputdrop.setDataSelect(el.find('[id=scanPolicy]') ,data.discoverStoreBack[0].scanPolicy);
					}
			});
		}
	}

	function save_click(el ,saveObj)
	{
		if (!g_validate.validate(el.find('#name_div'))||!g_validate.validate(el.find('#policyConfig_div'))
			||!g_validate.validate(el.find('#setTime_div'))){
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
			saveObj.taskPeriodType = -1;
		}

		if ($("[data-id=taskStatus]").is(':checked')) {
			saveObj.taskStatus = 1;
		}else{
			saveObj.taskStatus = 0;
		}
		var flag_url = vulner_scan_create_url;
		if(rowData){
			flag_url = vulner_scan_update_url;
		}

		um_ajax_post({
			url : flag_url,
			paramObj: {discoverStore:
							{
							  taskName:saveObj.taskName,
							  taskType:saveObj.taskType,
							  auto:saveObj.auto,
							  findWay:saveObj.findWay,
							  agentId:saveObj.agentId,
							  taskStatus:saveObj.taskStatus
							},
						netSectionStore:g_grid.getData($("#ipList_table")),
						formal:0,
						scanPolicy:saveObj.scanPolicy,
						emailNotice:0,
						smsNotice:0,
						noticePeople:"",
						taskPeriodType:saveObj.taskPeriodType,
						taskMonth:saveObj.taskMonth,
						taskPeriod:saveObj.taskPeriod,
						taskTime:saveObj.taskTime,
						nodeID:saveObj.nodeID,
						taskID:(rowData?rowData.taskID:""),
						creatorID:(rowData?rowData.creatorID:""),
						enterDate:(rowData?rowData.enterDate:"")
						},
			maskObj:"body",
			successCallBack : function(data){
				g_dialog.hide(el);
				g_dialog.operateAlert(null ,"操作成功！");
				vulner_list({paramObj:null,isLoad:true,maskObj:table_div});
			}
		});
	}
}

// 详情
function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/vulner_scan_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=vulner_detail_template]"),{
				width:"800px",
				init:init,
				title:"扫描任务详细信息",
				initAfter,initAfter,
				isDetail:true,
				top:"6%"
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);
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
		interval_view_task(el ,rowData);
	}
}
//删除
function vulner_scan_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么？" ,{
		saveclick:function(){
			um_ajax_post({
				url:vulner_scan_delete_url,
				paramObj:{taskID:rowData.taskID},
				successCallBack:function(data){
					vulner_list({paramObj:null,isLoad:true,maskObj:table_div});
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
				url:vulner_scan_status_click_url,
				paramObj:{taskID:rowData.taskID,
							taskStatus:rowData.taskStatus,
							taskType:rowData.taskType},
				successCallBack:function(data){
					vulner_list({paramObj:null,isLoad:true,maskObj:table_div});
					g_dialog.operateAlert(null ,"操作成功！");
					return true;
				}
			});

		}
	});
}

// 定时轮询
function interval_view_task(el ,rowData)
{
	if (rowData.taskStatus == 1 && rowData.runStatus == 4)
	{
		el.find("[id=discover_gif_div]").show();
		$("#index_timer_inp").everyTime(2000 ,function (){
			if (el.is(":hidden"))
			{
				$("#index_timer_inp").stopTime();
				return false;
			}
			view_task_get();
		});
	}
	else
	{
		view_task_get();
	}
	function view_task_get()
	{
		um_ajax_post({
			url : vulner_scan_detail_url,
			isLoad: true,
			paramObj : {taskID:rowData.taskID},
			maskObj : el,
			isLoad : false,
			successCallBack : function (data){
				el.umDataBind("render",data[0]);
				
				el.find("[data-id=ips]").html(data[0].ips);

				if (data[0].taskType == "1") {
					el.find('[data-id=taskType]').text("定时任务");
				}
				else
				{
					el.find('[data-id=taskType]').text("立即扫描");
				}
				//运行状态
				if (data[0].taskStatus == "1") {
					el.find('[data-id=taskStatus]').text("启用");
				}
				else
				{
					el.find('[data-id=taskStatus]').text("停用");
				}
				if ("异常终止" == data[0].runStatusDisplay)
				{
					el.find("[data-id=runStatusDisplay]").css("color" ,"red");
				}
				el.find("#finishedPercent_div").css("width" ,data[0].finishedPercent);
				if (data[0].runStatus != 4)
				{
					$("#index_timer_inp").stopTime();
					el.find("[id=discover_gif_div]").hide();
					g_grid.refresh($("#table_div"));
				}
			}
		});
	}
	
}



});
});