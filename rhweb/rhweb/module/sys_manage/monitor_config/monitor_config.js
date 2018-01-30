$(document).ready(function (){
require(['/js/plugin/tree/tree.js',
		'/js/plugin/tab/tab.js',
		'/js/plugin/wizard/wizard.js',
		'/js/plugin/monitor/monitor.js',
		'/js/plugin/monitor/monitor_config_tool.js'],
		function (tree ,tab ,wizard ,monitor ,monitorTool){


var url = {
	tree : "deviceMonitor/queryTreeByDeviceType/",
	index_list : "monitorConfig/preQueryMonitor",
	monitor_type_data : "deviceMonitor/queryMonitorClassAndTypeList",
	monitored_asset : "tpl/monitor/monitored_asset_tpl.html",
	asset_list : "monitorConfig/queryNoMonitoreDeviceList",
	edit_tpl : "module/sys_manage/monitor_config/monitor_config_tpl.html",
	start : "monitorConfig/startMonitor",
	stop : "monitorConfig/stopMonitor",
	batch_stop : "monitorConfig/batchStopMonitor",
	reset : "monitorConfig/resetMonitor",
	del : "monitorConfig/deleteMonitor",
	monitor_detail : "module/sys_manage/monitor_config/monitor_config_tpl.html"
};

var current_data_url;

var _pU_ = {1:"分钟",2:"小时",3:"天"};
var _mMS_={0:"启用",1:"停用"};
var _mDS_={0:"待部署",1:"正常",2:"异常",3:"部署中"};
var _mMD_ = [
							[
								{text:"已停用",icon:"rh-icon rh-has-stop",tipMsg:null,theUrl:null},// 启用 待部署
								{text:"停用",icon:"rh-icon rh-stop-use",tipMsg:"确认停用监控器？",theUrl:url.stop},// 启用 正常
								{text:"重置",icon:"rh-icon rh-reset",tipMsg:"确认重置监控器？",theUrl:url.reset},// 启用 异常
								{text:"停用",icon:"rh-icon rh-stop-use",tipMsg:"确认停用监控器？",theUrl:url.stop},// 启用 部署中
						 	],
							[
								{text:"启用",icon:"rh-icon rh-start-use",tipMsg:"确认启用监控器？",theUrl:url.start},// 停用 待部署
								{text:"已停用",icon:"rh-icon rh-has-stop",tipMsg:null,theUrl:null},// 停用 正常
								{text:"重置",icon:"rh-icon rh-reset",tipMsg:"确认重置监控器？",theUrl:url.reset},// 停用 异常
								{text:"停用",icon:"rh-icon rh-stop-use",tipMsg:"确认停用监控器？",theUrl:url.stop},// 停用 部署中
						 	]
						];

var header = {
	index_list : [
							{text:'',name:"t",width:5,hideSearch:"hide"},
							{text:'监控器名称',name:"monitorName",searchRender:function (el){
								el.append('<input type="hidden" search-data="monitorType" value="" searchCache/>');
								el.append('<input type="hidden" search-data="deviceSource" value="1" searchCache/>');
								el.append('<input class="form-control input-sm" search-data="monitorName" type="text">');
							},width:"24",align:"left"},
							{text:'被监控资产IP',name:"ipvAddress",render:function(text){
											var ipList = text.split(",");
											return 0===ipList.length ? iplist[0] : ipList.join(",<br>");
							},searchRender:function (el){
								  		index_render_div(el ,{type:"ip"});
								  },width:"24",align:"left"},
							{text:'监控器类型',name:"monitorTypeName",hideSearch:true,width:"16",align:"left"},
							{text:'轮询周期',name:"pollDate",hideSearch:true,render:function(text,trObj){
											return text+_pU_[trObj.pollUnit];
							},width:"13"},
							{text:'管理状态',name:"monitorManageStatus",render:function(text,trObj) {
								return "<span class='mM mM"+text+"'>"+_mMS_[text]+" | "+_mDS_[trObj.monitorDeployStatus]+"</span>";
							} ,width:"14",hideSearch:true}
						],
	asset_list : [
							{text:'资产名称',name:"entityName"},
							{text:'IP地址',name:"ipvAddress"},
							{text:'资产类型',name:"entityType"},
							{text:'安全域简称',name:"securityName"},
							{text:'业务域简称',name:"businessName"},
							{text:'添加时间',name:"assetCreateDate"}
						]
};
var oper = {
	index_list : [
			  			{icon:"rh-icon rh-edit",text:"修改",aclick:edit_template_init},
							{icon:"icon-pencil",text:"stop",aclick:index_list_status
								,customRender:function(rowData)
								{
									var m = Number(rowData.monitorManageStatus),d = Number(rowData.monitorDeployStatus);
									return {icon:_mMD_[m][d].icon,text:_mMD_[m][d].text};
								}
							},
			  			{icon:"rh-icon rh-delete",text:"删除" ,aclick:index_list_delet
			  				,customRender:function(rowData){
			  					if (("1"===rowData.monitorDeployStatus && "1"===rowData.monitorManageStatus) || (rowData.monitorDeployStatus == 0 && rowData.monitorManageStatus == 1)) 
			  					{
			  						return {icon:"rh-icon rh-delete",text:"删除"};
			  					} 
			  					else 
			  					{
			  						return {icon:"rh-icon rh-no-delete",text:"禁删"};
			  					}
			  				}
				  		}
		   			  ]
};

var form_url_list_header = [
							{text:'url地址',name:"enftpName"}
						   ];
var monitor_type = "";

var currTreeNode;
var table_div = $("#table_div");

view_init();

event_init();

initLayout();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");

	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div"),
		hideOption : true,
		cbf:function(){
			monitor_type_tree(currTreeNode==undefined ? false: true);
			//g_grid.refresh(table_div);
		}
	});
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});

	$("#accordion_icon").find("div").click(function (){
		$("#accordion_icon").find("div").removeClass("active");
		$(this).addClass("active");
		current_data_url = "deviceMonitor/" + $(this).attr("data-url");
		var self = this;
		monitor_type_tree(false,current_data_url ,true);
	});

	$("#add_btn").click(function (){
		monitor.monitorDialog({
			url : url.edit_tpl,
			ele : "[id=edit_template]",
			title : "监控器添加 <span class='dn' data-name='monitorTitle'>( <span class='dn' data-key='monitorType'>监控器类型：<span data-value='monitorType'></span></span><span class='dn' data-key='monitorName'>, 监控器名称：<span data-value='monitorName'></span></span><span class='dn' data-key='assetName'>, 资产名称：<span data-value='assetName'></span></span><span class='dn' data-key='assetIp'>, 资产IP：<span data-value='assetIp'></span></span> )</span>",
			monitorType : url.monitor_type_data,
			submitCbf : function(){
				monitor_type_tree(currTreeNode==undefined ? false: true);
				g_grid.refresh(table_div);
			}
		});
	});

	$("#custom_col_btn").click(function (){
		index_list_batch_delete();
	});

	$("#start_btn").click(function (){
		index_list_batch_start();
	});

	$("#stop_btn").click(function (){
		index_list_batch_stop();
	});

	//收起边栏按钮
	$("#table_slide_btn").click(function(){
		table_slid();
	});
}

function initLayout()
{
	index_initLayout();
	$("#table_div").oneTime(500 ,function (){
		$("#table_div").height(
						$("#content_div").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							- 20
					  );
	});
}

function monitor_type_tree(flag,a_url,queryFlag)
{
	if (!a_url)
	{
		a_url = current_data_url;
	}
	um_ajax_get({
		url : a_url,
		paramObj : {type : "monitorConfigLeftTree"},
		isLoad : false,
		successCallBack : function (data){
			for (var i = 0; i < data.length; i++) {
				if (data[i].className)
				{
					data[i].iconSkin = "a" + data[i].className;
				}
				else
				{
					//data[i].iconSkin = "aAll";
				}
			}
			var mTree = $("#monitor_tree");
			tree.render(mTree ,{
				zNodes : data,
				zTreeOnClick : function (event, treeId, treeNode){
					currTreeNode = treeNode;
					var mnType = treeNode.id;
					if (!isNaN(Number(treeNode.id))) 
					{
						mnType = treeNode.id + "&isNotLeaf";
					}
					var param = {queryType:"noQueryComponent",monitorType:mnType,deviceSource:"1"};
					
					monitor_list({
						url : url.index_list,
						header : header.index_list,
						oper : oper.index_list,
						paramObj : param
					});
				},
				expandNode : "-1"
			});
			if (flag) 
			{
				tree.expandSpecifyNode(mTree ,"roota");
				tree.selectNode(mTree ,{key:"id",value:currTreeNode.id});
			}
			if (queryFlag)
			{
				monitor_list({url:url.index_list,header:header.index_list});
			}
		}
	});
}

function monitor_list(opt)
{
	g_grid.render(table_div,{
		 url:opt.url,
		 header:opt.header,
		 oper: oper.index_list,
		 operLayout:true,
		 operWidth:"100px",
		 pageSize : 50,
		 paramObj : opt.paramObj || {deviceSource:"1"},
		 dbClick : detail_template_init,
		 isLoad : true,
		 maskObj : table_div,
		 dbIndex : 1,
		 cbf : function(){
			$("#table_slide_btn").hide();
			if (opt.paramObj)
			{
				$("[search-data=monitorType]").val(opt.paramObj.monitorType);
			}
		 }
	});
}

function index_list_status(rowData ,rowEl ,iconEl)
{
	var row_data = rowData || g_grid.getData(table_div,{chk:true});
	var param = rowData ? [rowData] : [];
	for (var i = 0; i < row_data.length; i++) {
		param.push(row_data[i]);
	}
	var mDS=Number(rowData.monitorDeployStatus),mMS=Number(rowData.monitorManageStatus);

	if (null === _mMD_[mMS][mDS].tipMsg) 
	{
		return false;
	}

	g_dialog.operateConfirm(_mMD_[mMS][mDS].tipMsg ,{
		saveclick : function ()
		{
			um_ajax_post({
				url : _mMD_[mMS][mDS].theUrl,
				paramObj : {monitorstore:param},
				successCallBack : function (data) 
				{
					g_dialog.operateAlert(null ,monitorTool.msg.operate);
					rowEl.oneTime(1000, function(){
						g_grid.refresh(table_div);
					});
				}
			});
		}
	});
}

function index_list_delet(rowData ,rowEl) 
{
	var row_data = rowData || g_grid.getData(table_div,{chk:true});
	var param = rowData ? [rowData] : [];
	for (var i = 0; i < row_data.length; i++) {
		param.push(row_data[i]);
	}
	//删除
	var mDS=rowData.monitorDeployStatus,mMS=rowData.monitorManageStatus;
	if ((1 == mDS && 1 == mMS) || (0 == mDS && 1 == mMS)) 
	{
		g_dialog.operateConfirm("确认删除么？" ,{
			saveclick : function() 
			{
				um_ajax_post({
					url : url.del,
					paramObj : {monitorstore:param},
					successCallBack : function (data) 
					{
						g_dialog.operateAlert(null ,"删除成功！");
						g_grid.refresh(table_div);
						monitor_type_tree(currTreeNode==undefined ? false: true);
					}
				});	
			}
		});
	} 
	else
	{
		g_dialog.dialog("请先停用监控器再删除。",{
			width: "240px",
			isConfirmAlarm : true,
			saveclick : function(){}
		});
	}
}

function index_list_batch_delete()
{
	var row_data = g_grid.getData(table_div,{chk:true});
	var param = [];
	if (0 === row_data.length) 
	{
		g_dialog.operateAlert(null ,monitorTool.msg.noSelect ,"error");
		return false;
	}
	for (var i = 0; i < row_data.length; i++) 
	{
		var mDS=row_data[i].monitorDeployStatus,mMS=row_data[i].monitorManageStatus;
		if (!((1 == mDS && 1 == mMS) || (0 == mDS && 1 == mMS))) 
		{
			g_dialog.operateAlert(null, "监控器处于启用状态或部署状态不正常。" ,"error");
			return false;
		}
		param.push(row_data[i]);
	}

	g_dialog.operateConfirm("确认删除么？" ,{
		saveclick : function() 
		{
			um_ajax_post({
				url : url.del,
				paramObj : {"monitorstore":param},
				successCallBack : function (data) 
				{
					g_dialog.operateAlert(null ,monitorTool.msg.delSuccess);
					g_grid.refresh(table_div);
					monitor_type_tree(currTreeNode==undefined ? false: true);
				}
			});	
		}
	});
}

function index_list_batch_stop() 
{
	var row_data = g_grid.getData(table_div,{chk:true});
	var param = [];
	if (row_data.length == 0) 
	{
		g_dialog.operateAlert(null ,monitorTool.msg.noSelect ,"error");
		return false;
	}
	for (var i = 0; i < row_data.length; i++) {
		if (row_data[i].monitorManageStatus != 0 && row_data[i].monitorDeployStatus == 0) 
		{
			g_dialog.operateAlert(null, "请不要选择已经停用的监控器" ,"error");
			return false;
		}
		param.push(row_data[i]);
	}
	g_dialog.operateConfirm("确认停用么？" ,{
		saveclick : function(){
			um_ajax_post({
				url : url.batch_stop,
				paramObj : {"monitorstore":param},
				successCallBack : function (data) 
				{
					g_dialog.operateAlert(null ,monitorTool.msg.operate);
					g_grid.refresh(table_div);
				}
			});
		}
	});
}

function index_list_batch_start() 
{
	var row_data = g_grid.getData(table_div,{chk:true});
	var param = [];
	if (row_data.length == 0) 
	{
		g_dialog.operateAlert(null ,monitorTool.msg.noSelect ,"error");
		return false;
	}
	for (var i = 0; i < row_data.length; i++) {
		if (row_data[i].monitorManageStatus != 1) 
		{
			g_dialog.operateAlert(null, "请不要选择已经启用的监控器" ,"error");
			return false;
		}
		param.push(row_data[i]);
	}
	g_dialog.operateConfirm("确认启用么？" ,{
		saveclick : function(){
			um_ajax_post({
				url : url.start,
				paramObj : {"monitorstore":param},
				successCallBack : function (data) 
				{
					g_dialog.operateAlert(null ,monitorTool.msg.operate);
					g_grid.refresh(table_div);
				}
			});
		}
	});
}

function edit_template_init(rowData) 
{
	var detail;
	$("[data-id=temp_monitored_asset]").val(rowData.edId);
	um_ajax_post({
		url : "monitorConfig/queryMonitorDetail",
		paramObj : {"monitorId":rowData.monitorId,"deviceSource":"1","monitorType":rowData.monitorType,"edId":rowData.edId,"intsStatus":rowData.intsStatus,"regionId":rowData.regionId},
		maskObj : "body",
		successCallBack : function (data) 
		{
			detail = data;
			monitor.monitorDialog({
				url : url.edit_tpl,
				ele : "[id=edit_template]",
				title : "监控器修改 <span class='dn' data-name='monitorTitle'>( <span class='dn' data-key='monitorType'>监控器类型：<span data-value='monitorType'></span></span><span class='dn' data-key='monitorName'>, 监控器名称：<span data-value='monitorName'></span></span><span class='dn' data-key='assetName'>, 资产名称：<span data-value='assetName'></span></span><span class='dn' data-key='assetIp'>, 资产IP：<span data-value='assetIp'></span></span> )</span>",
				monitorType : url.monitor_type_data,
				isEdit : true,
				detailData : data,
				submitCbf : function () 
				{
					monitor_type_tree(currTreeNode==undefined ? false: true);
					g_grid.refresh(table_div);
				},
				step_1_edit : function () 
				{
					$(".umDialog").find("#"+rowData.monitorType).click();
					var sTop = $("#"+rowData.monitorType).offset().top - 300;
					$(".stepContainer").animate({scrollTop : sTop} ,400);
					return detail;
				},
				step_2_edit : function () 
				{
					return detail;
				},
				step_3_edit : function () 
				{
					return detail;
				},
				step_4_edit : function () 
				{
					return detail;
				},
				step_5_edit : function () 
				{
					return detail;
				}
			});
		}
	});

}

function detail_template_init(rowData)
{
	$.ajax({
		type : "GET",
		url : url.monitor_detail,
		server : "/",
		success : function(data){
			g_dialog.dialog($(data).find("[id=monitor_detail_template]") ,{
				title : "监控器配置详细信息",
				width : "900px",
				isDetail : true,
				top : "6%",
				initAfter : initAfter
			});
			function initAfter (el) 
			{
				um_ajax_get({
					url : "/monitorConfig/queryMonitorDetail",
					maskObj : el,
					paramObj : {
						"monitorId":rowData.monitorId,
						"monitorType":rowData.monitorType,
						"edId":rowData.edId,
						"deviceSource":rowData.deviceSource,
						"intsStatus":rowData.intsStatus,
						"regionId":""
					},
					successCallBack : function (data) 
					{
						var Dt=data.monitorStore,mS=Dt[0],mMS=mS.monitorManageStatus,mDS=mS.monitorDeployStatus,pU=mS.pollUnit,pD=mS.pollDate;
						mS.monitorManageStatus = _mMS_[mMS];
						mS.pollUnit = pU = _pU_[pU];
						mS.monitorDeployStatus = _mDS_[mDS];
						mS.pollDate = pD + pU;
						mS.createPid = rowData.createPid;
						$("#query_form").umDataBind("render" ,mS);

						var mMS_text = ""
						var mDS_text = "";
						mMS_text = mMS == "0" ? "启用":"停用";
						mDS_text = mDS == "0" ? "待部署" : mDS == "1" ? "正常" : mDS == "2" ? "异常" : "部署中";
						$("[data-id=monitorDeployStatus]").text(mMS_text+" | "+mDS_text);

						if (Dt.length>1) 
						{
							for (var i=1; i<Dt.length; i++) {
								var tpl = $("[data-group=assetInfo]").eq(0).clone();
								$("[data-group=assetInfo_div]").after(tpl);
								tpl.before('<hr>');
								tpl.umDataBind("render", Dt[i]);
							}
						}
					}
				});
			}
		}
	});

	return false;
}

function table_slid() 
{
	var flag = $("[data-status=active]").data("id");
	var grid_width = $("#right-panel").width()-300;
	if (flag == "slide_left") 
	{
		$("#right-panel").animate({"width":"100%","left":"1"},400,function (){
			g_grid.resize(table_div);
			$("#left-panel").css({"opacity":"0"});
		});
		$("#table_slide_btn").removeClass("slide_to_left_btn").addClass("slide_to_right_btn").animate({"left":"-30px"},400);
		$("[data-id=slide_left]").addClass("dn").removeAttr("data-status");
		$("[data-id=slide_right]").removeClass("dn").attr("data-status","active");
	} 
	else if(flag == "slide_right") 
	{
		$("#right-panel").animate({"width":""+grid_width+"","left":"300px"},400,function (){
			g_grid.resize(table_div);
		});
		$("#table_slide_btn").removeClass("slide_to_right_btn").addClass("slide_to_left_btn").animate({"left":"-30px"},400);
		$("[data-id=slide_left]").removeClass("dn").attr("data-status","active");
		$("[data-id=slide_right]").addClass("dn").removeAttr("data-status");
		$("#left-panel").css({"opacity":"1"});
	}
}



});
});