$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/timeinput/timeinput.js',
		 '/js/plugin/plot/plot.js'] ,function (inputdrop ,timeinput ,plot){

var discover_list_url = "autoDiscover/queryAssetDiscoverList";

var discover_status_click_url = "autoDiscover/updTaskStatus";

var discover_create_url = "autoDiscover/addAssetDiscover";

var discover_beforupdate_url = "autoDiscover/assetDiscoverUpd";

var discover_update_url = "autoDiscover/updAssetDiscover";

var discover_delete_url = "autoDiscover/delTask";

var discover_detail_url = "autoDiscover/queryviewTask";

var discover_detail_tesk_url = "autoDiscover/getTaskStatus";

var asset_dialog_dialog_url = "AssetOperation/queryAssetForDiscory";

var discover_list_col = [
						{text:'任务名称',name:"name"},
						{text:'任务类型',name:"taskStatus",render:function(text){
							if (text == "")
							{
								return '---';
							}
							else if (text == "1")
							{
								return '定时发现任务';
							}
							else if (text == "0")
							{
								return '立即发现任务';
							}
						} ,searchRender:function (el){
							var data = [
											{text:"---" ,id:"-1"},
					  						{text:"定时发现任务" ,id:"1"},
					  						{text:"立即发现任务" ,id:"0"}
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "taskStatus"
							});
						}},
						{text:'运行状态',name:"runStatus",render:function(text){
							var runStatus;
							switch(text){
								case "" : runStatus="---";break;
								case "1" : runStatus="发现状态";break;
								case "2" : runStatus="完成状态";break;
								case "3" : runStatus='<span style="color:rgb(255,0,0);opacity:0.6">异常终止</span>';break;
								case "4" : runStatus="待发现";break;
								case "5" : runStatus="手动停止";break;
								default:break;
							}
							return runStatus;
						},searchRender:function (el){
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
						{text:'是否启用',name:"status",render:function(text){
							if (text == 1)
					  		 {
					  			return '<i class="icon-circle f14" style="color:green;"></i>';
					  		 }
					  		 else if (text == 0) {
					  		 	return '<i class="icon-circle f14" style="color:red;"></i>';
					  		 }
					  		 else
					  		 {
					  		 	return '删除';
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
						{text:'修改时间',name:"updateDate",searchRender:function (el){
							index_render_div(el ,{type:"date",startKey:"startUpdDate",endKey:"endUpdDate"});
						}},
						{text:'修改人',name:"updatePerson" ,hideSearch:true}
				];
var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				 ];
var asset_dialog_col = [
						{text:'资产名称',name:"assetName"},
						{text:'安全域',name:"securityDomainName"},
						{text:'主IP',name:"mainIp"}
						];
var asset_dialog_oper = [
					  	{icon:"icon-trash" ,text:"删除" ,aclick:asset_delete}
				 ];
var asset_dialog_dialog_col = [
						{text:'资产名称',name:"assetName"},
						{text:'IP',name:"mainIp",searchRender:function (el){
						  	 index_render_div(el ,{type:"ip"});
						}},
						{text:'资产类型',name:"assetTypeName",
							searchRender: function (el){
								var searchEl = $('<div class="inputdrop" id="assetTypeId"></div>');
						  		el.append(searchEl);
						   	    g_formel.sec_biz_render({
						   	   		assetTypeEl : searchEl
						   	    });
							}
						},
						{text:'安全域',name:"securityDomainName",
							searchRender: function (el){
								var searchEl = $('<div class="inputdrop" id="securityDomainId"></div>');
						  		el.append(searchEl);
						   	    g_formel.sec_biz_render({
						   	   		secEl : searchEl
						   	    });
							}
						},
						{text:'业务域',name:"bussinessDomainName",
							searchRender: function (el){
								var searchEl = $('<div class="inputdrop" id="bussinessDomainId"></div>');
						  		el.append(searchEl);
						   	    g_formel.sec_biz_render({
						   	   		bizEl : searchEl
						   	    });
							}}
						];
var periodTypeMap = new HashMap();
periodTypeMap.put("1" ,"每月");
periodTypeMap.put("2" ,"每周");
periodTypeMap.put("3" ,"每天");
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

	$("#delete_btn").click(function (){
		batch_template_init();
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
		 dbClick : detail_template_init,
		 tdClick : true
	});
}

function refurbish_template_init(rowData)
{
	discover_list({paramObj:null,isLoad:true,maskObj:table_div});
}

//批量删除
function batch_template_init(rowData)
{
	var dataArray = g_grid.getData($("#table_div") ,{chk : true});

	if(dataArray.length === 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var data = g_grid.getData($("#table_div") ,{chk:true});

	var tmp=[];
	for (var i = 0; i < data.length; i++) {
		tmp.push(data[i].taskmgrID);
	}

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : discover_delete_url,
				paramObj : {taskmgrID : tmp.join(",")},
				successCallBack : function(data){
					discover_list({maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}
//增加
var edId = [];
function edit_template_init(rowData)
{
	var title = rowData ? "资产修改" : "资产发现";
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_manage/asset_discover_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=discover_edit_template]"),{
				width:"900px",
				init:init,
				initAfter,initAfter,
				title:title,
				saveclick:save_click,
				top:"6%"
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		el.find('#asset_baseline_template').css('display', 'none');
		el.find('select[data-id=findWay]').change(function(event)
		{
			var mp = $(this).val();
			if (mp == "2") {
				el.find('#file_baseline_template').css('display', 'block');
				el.find('#asset_baseline_template').css('display', 'none');
				el.find('[data-type=choose]').css('display', 'block');
			}
			if (mp == "1") {
				el.find('#file_baseline_template').css('display', 'none');
				el.find('#asset_baseline_template').css('display', 'block');
				el.find('[data-type=choose]').css('display', 'none');
				if (el.find('[id=asset_table_div]').html() == "")
				{
					g_grid.render(el.find('[id=asset_table_div]'),{
						header : asset_dialog_col,
						oper: asset_dialog_oper,
		 				operWidth:"100px",
						data : [],
						paginator:false,
						isLoad:true,
						allowCheckBox : false,
						hideSearch : true
					});
				}
			}
		});

		//IPV4、IPV6切换
		el.find('input[data-id=IPV6]').click(function(event)
		{
			el.find('input[id=mainIp]').removeAttr('disabled', 'disabled');
			el.find('input[id=startIp]').attr('disabled', 'disabled').val("");
			el.find('input[id=endIp]').attr('disabled', 'disabled').val("");
			g_validate.clear(el);
		});
		el.find('input[data-id=IPV4]').click(function(event)
		{
			el.find('input[id=startIp]').removeAttr('disabled','disabled');
			el.find('input[id=endIp]').removeAttr('disabled','disabled');
			el.find('input[id=mainIp]').attr('disabled','disabled').val("");
			g_validate.clear(el);
		});
		//周期类型
		el.find("input[name=typeOpen]").click(function(event)
		{
			if (el.find('input[name=typeOpen]').is(':checked')) {
				g_validate.init(el);
				el.find('select[value=typeWeek]').removeAttr('disabled');
				el.find('input[data-value=typeWeek]').removeAttr('disabled');
				timeinput.cancelDisabled(el.find("[id=time]"));
			}
			else {
				el.find('select[value=typeWeek]').attr('disabled', 'disabled');
				el.find('select[value=typeWeek]').val('');
				el.find('input[data-value=typeWeek]').attr('disabled', 'disabled');
				el.find('input[data-value=typeWeek]').val('');
				timeinput.setDisabled(el.find("[id=time]"));
				g_validate.clear([el.find('select[value=typeWeek]') ,el.find("[id=time]")]);
				el.find("select").trigger("change");
			}
		});
		//设定周期的变换事件
		el.find("select[data-id=periodType]").change(function ()
		{
			var tmp = $(this).val();
			// 先把option全部清除
			el.find("select[data-id=period]").find("option").remove();
			el.find("select[data-id=period]").trigger("change");

			if (tmp == "")
			{
				timeinput.setData(el.find("[id=time]") ,null);
			}
			if (tmp == "1")
			{
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					el.find("select[data-id=period]").append('<option value="'+i+'">'+i+'</option>');
				}
				el.find("select[data-id=period]").removeAttr("disabled");
			}
			if (tmp == "2")
			{
				// 添加周一至周日
				el.find("select[data-id=period]").append('<option value="1">星期一</option>');
				el.find("select[data-id=period]").append('<option value="2">星期二</option>');
				el.find("select[data-id=period]").append('<option value="3">星期三</option>');
				el.find("select[data-id=period]").append('<option value="4">星期四</option>');
				el.find("select[data-id=period]").append('<option value="5">星期五</option>');
				el.find("select[data-id=period]").append('<option value="6">星期六</option>');
				el.find("select[data-id=period]").append('<option value="7">星期日</option>');
				el.find("select[data-id=period]").removeAttr("disabled");
			}

			if (tmp == "3")
			{
				el.find("select[data-id=period]").attr("disabled","disabled");
			}
			el.find("select[data-id=period]").trigger("change");
		});

		//加载选择代理
		g_formel.code_list_render({
			key : "agentConfigList",
			agentSelEl : el.find("[data-id=agentId]")
		});

		var startIpEl = el.find("[data-flag=startIp]");
		var endIpEl = el.find("[data-flag=endIp]");
		//右移事件
		el.find("[id=chevron-right]").click(function (){
			if (g_validate.validate(el.find("[data-flag=startIp]")) && el.find("[data-flag=endIp]").val() == "") 
			{
				el.find("[data-flag=endIp]").val(el.find("[data-flag=startIp]").val());
			}
			g_validate.ipValidate(startIpEl,endIpEl);
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
					ipRange : startIpEl.val()+"-"+endIpEl.val(),
					startIp : startIpEl.val(),
					endIp : endIpEl.val()
				}]);
				startIpEl.val("");
				endIpEl.val("");
			}
			else
			{
				g_grid.addData(el.find("[id=ipList_table]") ,[{
					ipRange : el.find("[data-flag=mainIp]").val(),
					startIp : el.find("[data-flag=mainIp]").val(),
					endIp : el.find("[data-flag=mainIp]").val()
				}]);
				el.find("[data-flag=mainIp]").val("");
			}

		});
		// 左移事件
		el.find("[id=chevron-left]").click(function (){
			g_validate.clear(el);
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
				// 判断ip类型,切换单选按钮
				if (/^([\da-fA-F]{1,4}\:){7}[\da-fA-F]{1,4}$/.test(data[0].ipRange)) 
				{
					el.find('input[data-id=IPV6]').click();
				} 
				else 
				{
					el.find('input[data-id=IPV4]').click();
				}
				if (el.find('input[data-id=IPV4]').is(":checked")) {
					el.find("[data-flag=startIp]").val(data[0].startIp);
					el.find("[data-flag=endIp]").val(data[0].endIp);
				}
				else
				{
					el.find("[data-flag=mainIp]").val(data[0].ipRange);
				}
				g_grid.removeData(el.find("[id=ipList_table]"));
			}
		});
		
	}

	function initAfter(el)
	{
		timeinput.render(el.find("[id=time]") ,{validate:true,initVal:"00:00:00"});
		timeinput.setDisabled(el.find("[id=time]"));
		g_grid.render(el.find('[id=ipList_table]'),{
			data:[],
			header : [{text:'IP范围',name:'ipRange'}],
			paginator:false,
			isLoad:false,
			allowCheckBox : true,
			hideSearch : true
		});

		$("#asset_add_btn").click(function (){
			 choose_template_init();
		});

		if (rowData)
		{
			$(el).umDataBind("render" ,rowData);

			if (rowData.status=="1") {
				el.find('[data-id=status]')[0].checked = true;
			}
			else
			{
				el.find('[data-id=status]')[0].checked = false;
			}
			if (rowData.auto=="1") {
				el.find('[data-id=auto]')[0].checked = true;
			}
			else
			{
				el.find('[data-id=auto]')[0].checked = false;
			}
			if (rowData.taskStatus == "1")
			{
				el.find("input[name=typeOpen]").click();
				el.find("[data-id=periodType]").val(rowData.periodType);
				el.find("[data-id=periodType]").trigger("change");
				el.find("[data-id=period]").val(rowData.period);
				el.find("[data-id=period]").trigger("change");
				timeinput.setData(el.find("[id=time]") ,rowData.time);
			}
			
			//加载资产发现表单
			um_ajax_post({
				url : discover_beforupdate_url,
				isLoad: true,
		    	paramObj : {
		    				taskmgrID:rowData.taskmgrID,
		    				findWay:rowData.findWay
		    				},
				successCallBack : function (data){
					if (rowData.findWay == 1)
					{
						g_grid.addData(el.find('[id=asset_table_div]') ,data.netSectionStore);
					}
					else
					{
						g_grid.addData(el.find('[id=ipList_table]') ,data.netSectionStore);
					}

					el.find('[id=agentId]').select2({
						data:data.discoverStore[0].agentId,
						width:"100%"
					});
				}
			});
		}
	}

	function save_click(el ,saveObj)
	{
		el.find("[data-flag=startIp]").attr("validate" ,"ipv4");
		if (!g_validate.validate(el)){
			el.find("[data-flag=startIp]").attr("validate" ,"required,ipv4");
			return false;
		} 
		el.find("[data-flag=startIp]").attr("validate" ,"required,ipv4");
		if ($("[data-id=status]").is(':checked'))
		{
			saveObj.status = 1;
		}
		else
		{
			saveObj.status = 0;
		}

		if ($("[data-id=auto]").is(':checked'))
		{
			saveObj.auto = 1;
		}
		else
		{
			saveObj.auto = 0;
		}

		if ($("[data-id=taskStatus]").is(':checked'))
		{
			saveObj.taskStatus = 1;
		}
		else
		{
			saveObj.taskStatus = 0;
		}

		if (saveObj.findWay == "2")
		{
			var dataArray = g_grid.getData(el.find("[id=ipList_table]") ,{chk:false});
			if (dataArray.length == 0)
			{
				g_dialog.operateAlert(el ,"请输入IP地址段信息" ,"error");
				return false;
			}
		}
		else
		{
			if (el.find('[data-id=findWay]').val() == "1")
			{
				var assetArry=g_grid.getData(el.find("#asset_table_div"),{});
				if (assetArry.length == 0)
				{
					return false;
				}
				for (var i = 0; i < assetArry.length; i++) {
					edId.push(assetArry[i].edId);
				}
			}
		}
		

		var flag_url = discover_create_url;
		if(rowData){
			flag_url = discover_update_url;
		}

		um_ajax_post({
			url : flag_url,
			paramObj: {discoverStore:
							{
							  name:saveObj.name,
							  status:saveObj.status,
							  auto:saveObj.auto,
							  findWay:saveObj.findWay,
							  agentId:saveObj.agentId,//100022,
							  taskStatus:saveObj.taskStatus
							},
						netSectionStore:g_grid.getData($("#ipList_table")),
						formal:0,
						assetName:edId.join(","),
						periodType:saveObj.periodType,
						period:saveObj.period,
						time:saveObj.time,
						taskmgrID:(rowData?rowData.taskmgrID:"")
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
//详情（双击）
var runStatusMap = new HashMap();
runStatusMap.put("1","发现状态");
runStatusMap.put("2","完成状态");
runStatusMap.put("3","异常终止");
runStatusMap.put("4","待发现");
runStatusMap.put("5","手动停止");
runStatusMap.put("6","----");
function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_manage/asset_discover_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=discover_detail_template]"),{
				width:"800px",
				title:"资产发现任务详细信息",
				isDetail:true,
				init:init,
				initAfter:initAfter,
				top:"6%"
			});
		}
	});

	function init(el)
	{
			el.find("[id=query_form]").hide();
			$(el).umDataBind("render" ,rowData);
			el.find('[data-id=runStatus]').html(runStatusMap.get(rowData.runStatus));
			if (el.find('[data-id=findWay]').html() == "1") {
				el.find('[data-id=findWay]').html("资产发现");
			}
			else
			{
				el.find('[data-id=findWay]').html("IP段发现");
			}
			//运行状态
			if (el.find('[data-id=status]').html() == "1") {
				el.find('[data-id=status]').html("启用");
			}
			else if (el.find('[data-id=status]').html() == "2")
			{
				el.find('[data-id=status]').html("停用");
			}
			else
			{
				el.find('[data-id=status]').html("删除");
			}
	}

	function initAfter(el)
	{
		um_ajax_post({
			url : discover_detail_url,
			isLoad: false,
			paramObj : {
						taskmgrID:rowData.taskmgrID,
						findWay:rowData.findWay
						},
			successCallBack : function (data){
				//定制模板
				if (data[0].taskStatus == 1) 
				{
					el.find("#show_for_timed_task").show();
					el.find("[data-id=taskStatue]").text("定时任务");
				} 
				else 
				{
					el.find("#show_for_timed_task").hide();
					el.find("[data-id=taskStatue]").text("立即扫描");
				}
				if (data[0].findWay == 1) 
				{
					el.find("#show_for_asset").show();
					el.find("#show_for_ip").hide();
				} 
				else 
				{
					el.find("#show_for_asset").hide();
					el.find("#show_for_ip").show();
				}

				if (data[0].resultInfo == null || data[0].resultInfo == "") 
				{
					el.find("#show_when_has_result_info").hide();
				}

				//渲染数据
				if (el.find("[data-id=assetName]").text(data[0].assetName)==null)
				{
					el.find("[data-id=assetName]").text("");
				}
				else
				{
					el.find("[data-id=assetName]").text(data[0].assetName);
				}
				$(el).umDataBind("render" ,data[0]);
				$("[data-id=resultInfo]").html(data[0].resultInfo);
				el.find("[data-id=periodType]").text(periodTypeMap.get(data[0].periodType));
				//运行状态
				if (el.find('[data-id=status]').html() == "1") {
					el.find('[data-id=status]').html("启用");
				}
				else if (el.find('[data-id=status]').html() == "2")
				{
					el.find('[data-id=status]').html("停用");
				}
				else
				{
					el.find('[data-id=status]').html("删除");
				}
				el.find('[data-id=runStatus]').html(runStatusMap.get(rowData.runStatus));
				if ("3" == rowData.runStatus)
				{
					el.find("[data-id=runStatus]").css("color" ,"red");
				}
				el.find("[id=query_form]").show();
				
			}
		});

		um_ajax_post({
			url : discover_detail_tesk_url,
			isLoad: false,
			paramObj : {taskmgrID:rowData.taskmgrID},
			successCallBack : function (data){
				var tar = el.find("#run_status_info");
				switch (data.runStatus)
				{
					case "1":
						var timeout = false; 

						el.find("[id=discover_gif_div]").show();

						function progress(){
							um_ajax_post({
								url : discover_detail_tesk_url,
								isLoad : false,
								paramObj : {taskmgrID:rowData.taskmgrID},
								successCallBack : function (data) {
									if (el.is(":hidden"))
									{
										timeout = true;
										return false;
									}
									var percent = data.finishedPercent == null ? 0 : data.finishedPercent+"%";
									var lefttime = data.leftTime == null ? "0时0分0秒" : data.leftTime;
									tar.text("完成"+percent+",估计剩余时间"+lefttime);
									$("#finishedPercent_div").css("width" ,data.finishedPercent + "%");
									$("[data-id=resultInfo]").html(data.resultInfo);
								    if (data.finishedPercent == 100)
								    {
								    	timeout = true;
								    	el.find("[id=discover_gif_div]").hide();
								    }
								}
							});
						}

						function time()  
						{  
						  if(timeout) return;
						  progress();  
						  setTimeout(time,2000);
						}  
						time();
					break;
					case "2":
						$("#finishedPercent_div").css("width" ,"100%");
						tar.text("扫描完成");
						// plot.circleCheckRender(document.getElementById("canvasDiv") ,{
						//   scale : 0.8,
						//   color : "#1abc9c",
						//   lineWidth : 3
						// });
					break;
					case "3":
						tar.text("扫描失败");
						// plot.circleErrorRender(document.getElementById("canvasDiv") ,{
						//   scale : 0.8,
						//   color : "#ec7063",
						//   lineWidth : 3
						// });
					break;
					case "4":
						tar.text("待扫描......");
					break;
					case "5":
						tar.text("手动停止");
					break;
					case "6":
					break;
				}
			}
		});
		el.find("#jumpToBackupAsset").click(function(){
			el.find("#jumpToBackupAsset").attr("href","index.html#/base_sysdate/asset_manage/backup_asset");
			g_dialog.hide(el);
		});
	}

}
//删除
function index_list_delete(rowData)
	{
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick:function(){
				um_ajax_post({
					url:discover_delete_url,
					paramObj:{taskmgrID:rowData.taskmgrID},
					successCallBack:function(data){
						discover_list({paramObj:null,isLoad:true,maskObj:table_div});
						g_dialog.operateAlert(null ,"删除成功");
						return true;
					}
				});

			}
		});
	}

//表格内删除
function asset_delete(rowData,trObj)
{
	trObj.remove();		
}

//单元格单击事件
function statusClick(rowData)
{
		var stopStart;
		if (rowData.status == "0")
		{
			stopStart = "确认启用任务吗？";
		}
		else if(rowData.status == "1")
		{
			stopStart = "确认停用任务吗？";
		}
		else
		{
			stopStart = "确认删除任务吗？";
		}
		g_dialog.operateConfirm(stopStart ,{
			saveclick:function(){
				um_ajax_post({
					url:discover_status_click_url,
					paramObj:{taskmgrID:rowData.taskmgrID,
								status:rowData.status},
					successCallBack:function(data){
						discover_list({paramObj:null,isLoad:true,maskObj:table_div});
						g_dialog.operateAlert(null ,"操作成功！");
						return true;
					}
				});

			}
		});
}

			//资产信息
			function choose_template_init(rowData){
				$.ajax({
					type: "GET",
					url: "module/base_sysdate/asset_manage/asset_discover_tpl.html",
					success :function(data)
					{
						g_dialog.dialog($(data).find("[id=asset_dialog_div]"),{
							width:"800px",
							init:init,
							title:"资产信息",
							initAfter:initAfter,
							saveclick:save_click
						});
					}
				});

				function init(chEl){
				}

				function initAfter(chEl){
					g_grid.render(chEl.find('[id=asset_dialog_dialog_div]'),{
						header : asset_dialog_dialog_col,
						url : asset_dialog_dialog_url,
						paginator:true,
						isLoad:true,
						allowCheckBox : true,
						hideSearch : false

					});
				}

				function save_click(chEl ,saveObj){
					var data = g_grid.getData(chEl.find("[id=asset_dialog_dialog_div]") ,{chk:true});
					g_dialog.hide(chEl);
					g_grid.addData($('[id=asset_table_div]') ,data);
				}
			}

});
});