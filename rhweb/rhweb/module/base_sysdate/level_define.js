$(document).ready(function (){

require(['/js/plugin/tab/tab.js'] ,function (tab){

// 故障等级定义列表URL
var fault_list_url = "FaultLevel/queryFaultLevel";
var fault_list_col = [
					{text:'事件名称',name:"name"},
					{text:'事件类型',name:"className",searchRender:function(el){
						var searchEl = $('<select class="form-control input-sm" search-data="className" data-id="className"></select>');
						el.append(searchEl);
						g_formel.code_list_render({
							key : "faultclass",
							faultEventTypeEl : searchEl
						});
					}},
					{text:'事件等级',name:"level",render:function(text ,data){
						var countColor = "#ec7063";
						if(text == "")
						{
							return "---";
						}
						else if (data.level == "1")
						{
							text = "高";
						}
						else if (data.level == "2")
						{
							text = "中";
							countColor = "#FADA8D";
						}
						else if (data.level == "3")
						{
							text = "低";
							countColor = "#BAE0BA";
						}
						return '<i style="font-size:20px"></i><span class="dib prel" style="padding:0 3px;width:3em; background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
									+text+'</span>';
					},searchRender:function (el){
						var data = [
										{text:"----" ,id:"-1"},
				  						{text:"高" ,id:"1"},
				  						{text:"中" ,id:"2"},
				  						{text:"低" ,id:"3"}
							  		];
						g_formel.select_render(el ,{
							data : data,
							name : "level"
						});
					}}						
			   	];

// 性能等级定义列表URL
var perform_list_url = "PerfLevel/queryPerfLevel";
var perfomr_list_col = [
					{text:'事件名称',name:"name"},
					{text:'事件类型',name:"className",searchRender:function(el){
						var searchEl = $('<select class="form-control input-sm" search-data="className" data-id="className"></select>');
						el.append(searchEl);
						g_formel.code_list_render({
							key : "perfclass",
							performEventTypeEl : searchEl
						});
					}},	
					{text:'事件等级',name:"level",render:function (text ,data){
						var countColor = "#ec7063";
						if(text == "")
						{
							return "---";
						}
						else if(data.level == "1")
						{
							text = "高";
						}
						else if(data.level == "2")
						{
							text = "中";
							countColor = "#FADA8D";
						}
						else if(data.level == "3")
						{
							text = "低";
							countColor = "#BAE0BA";
						}
						return '<i style="font-size:20px"></i><span class="dib prel" style="padding:0 3px;width:3em; background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
									+text+'</span>';
					},searchRender:function (el){
						var data = [
										{text:"---" ,id:"-1"},
				  						{text:"高" ,id:"1"},
				  						{text:"中" ,id:"2"},
				  						{text:"低" ,id:"3"}
							  		];
						g_formel.select_render(el ,{
							data : data,
							name : "level"
						});
					}}
			  	];

view_init();

event_init();

function view_init()
{
	tab.tab($("#tab"),{oper : [fault_level_list,perform_level_list]});

	layout_init();
	$(window).on("resize.module" ,function (){
		$(this).stopTime();
		$(this).oneTime(100 ,function (){
			layout_init();
		});
	})
}

function event_init()
{
	$("#fault_update_btn").click(function (){
		fault_update_template_init();
	});

	$("#perform_update_btn").click(function (){
		perform_update_template_init();
	});
}

function layout_init()
{
	index_initLayout();
	$("[class=table-div]").height(
									$("#content_div").height() - 100
								 );
}

function fault_level_list()
{
	g_grid.render($("#fault_table_div"),{
		 header:fault_list_col,
		 url:fault_list_url,
		 maskObj : "body",
		 paginator : false
	});
}

function perform_level_list()
{
	g_grid.render($("#perform_table_div"),{
		 header:perfomr_list_col,
		 url:perform_list_url,
		 maskObj : "body",
		 paginator : false
	});
}

// 故障等级批量修改url
var fault_update_url = "FaultLevel/updFaultLevel";
function fault_update_template_init()
{
	var el_table = $("#fault_table_div");
	// 如果数据没有被勾选，则弹出错误提示
	var data = g_grid.getData(el_table ,{chk:true});
	if (data.length == 0)
	{
		// 弹出提示
		g_dialog.operateAlert(el_table ,"请至少选择一条记录！" ,"error");
		// 直接返回
		return false;
	}

	// 弹出修改框
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/fault_level_define_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=fault_level_update_template]"),{
				width:"450px",
				init:init,
				title:"故障事件等级定义",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
	}		

	function save_click(el ,saveObj)
	{
		
		// 校验等级定义是否已填
		var test = g_validate.validate(el);

		if (test == false){
			return false;
		}

		var data = g_grid.getData(el_table ,{chk:true});

		// 组装id
		var buffer = [];

		for (var i = 0; i < data.length; i++) {
			buffer.push(data[i].id);
		}
		
		// saveObj.level 以，连接id   
		saveObj.id = buffer.join(",");
		//发送
		um_ajax_post({
			url : fault_update_url,
			paramObj : saveObj,
			maskObj :el,
			successCallBack : function (){
				// 关闭对话框
				g_dialog.hide(el);
				// 弹出成功提示
				g_dialog.operateAlert();
				// 重新刷新列表
				g_grid.refresh(el_table);
			}
		});
	}
}

// 性能等级批量修改url
var perform_update_url = "PerfLevel/updPerfLevel";
function perform_update_template_init()
{
	var el_table = $("#perform_table_div");
	// 如果数据没有被勾选，则弹出错误提示
	var data = g_grid.getData(el_table ,{chk:true});
	if (data.length == 0)
	{
		// 弹出提示
		g_dialog.operateAlert(el_table ,"请至少选择一条记录！" ,"error");
		// 直接返回
		return false;
	}

	// 弹出修改框
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/perform_level_define_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=perform_level_update_template]"),{
				width:"450px",
				init:init,
				title:"性能事件等级定义",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
	}

	function save_click(el ,saveObj)
	{
		// 校验等级定义是否已填
		var test = g_validate.validate(el);

		if (test == false){
			return false;
		}

		var data = g_grid.getData(el_table ,{chk:true});

		// 组装id
		var buffer = [];

		for (var i = 0; i < data.length; i++) {
			buffer.push(data[i].id);
		}
		
		// saveObj.level    
		saveObj.id = buffer.join(",");
		
		um_ajax_post({
			url : perform_update_url,
			paramObj : saveObj,
			maskObj : el,
			successCallBack : function (){
				// 关闭对话框
				g_dialog.hide(el);
				// 弹出成功提示
				g_dialog.operateAlert();
				// 重新刷新列表
				g_grid.refresh(el_table);
			}
		});

	}
}


});

});