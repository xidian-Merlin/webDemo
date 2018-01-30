$(document).ready(function (){
require(['/js/plugin/drag/drag.js'] ,function (drag){

var list_url = "bigscreen/getBigScreen";

var list_col = [
						{text:'视图名称',name:"viewName"},
						{text:'展示数量',name:"countnum"},
						{text:'轮播周期(秒)',name:"playInterval"},
						{text:'修改人',name:"userName"},
						{text:'修改时间',name:"enter_date"}
				   ];
var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
						{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:delete_list_init}
				 ];

var create_url = "bigscreen/setBigScreen";

var update_url = "bigscreen/setBigScreen";

var delete_url = "bigscreen/delBigScreen";

view_init();

event_init();

list_list();

function view_init()
{

}

function event_init()
{
	$("#add_btn").click(function (){
		edit_template_init();		
	});
}

function list_list()
{
	g_grid.render($("#table_div"),{
		 header:list_col,
		 oper: index_oper,
		 operWidth:"121px",
		 url:list_url,
		 dbClick : big_screen_show,
		 paginator : false,
		 allowCheckBox : false,
		 hideSearch : true
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "视图修改" : "视图添加";
	$.ajax({
		type: "GET",
		url: "module/monitor_info/big_screen_config_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=view_edit_template]"),{
				width:"600px",
				init:init,
				title : title,
				saveclick:save_click,
				top:"6%"
			});
		}
	});

	function init(el)
	{
		el.find("[id=panel_add_btn]").click(function (){
			url_panel_render(el);
		});
		el.on("click" ,"[class*=icon-remove]" ,function (){
			$(this).closest("ul").remove();
		});

		var panelData = [   {id   : "data",name : "数据分析中心",isChecked : true},
							{id   : "net",name : "网络监控中心",isChecked : true},
							{id : "event",name : "事件监控中心",isChecked : true},
							{id : "topo",name : "拓扑展示中心",isChecked : true},
							{id : "biz",name : "应用监控中心",isChecked : true},
							//{id : "biz2",name : "应用监控中心(二)",isChecked : true},
							//{id : "biz3",name : "应用监控中心(三)",isChecked : true},
							{id : "overall",name : "综合监控中心",isChecked : true}
						];

		if (rowData)
		{
			el.find("[data-id=id]").val(rowData.id);
			el.find("[data-id=viewName]").val(rowData.viewName);
			el.find("[data-id=playInterval]").val(rowData.playInterval);
			panelData = JsonTools.decode(rowData.bigScreenArray);
			var urlPanel = JsonTools.decode(rowData.customPanel);
			for (var i = 0; i < urlPanel.length; i++) {
				url_panel_render(el ,urlPanel[i]);
			}
		}
		panel_render(el.find("[id=ulDrag]") ,panelData);

		el.find("[data-type=check_all]").click(function (){
			if ($(this).is(":checked"))
			{
				el.find("input[type=checkbox]").prop("checked" ,"checked");
			}
			else
			{
				el.find("input[type=checkbox]").removeAttr("checked");
			}
		});

		drag.ulDrag(el.find("[id=ulDrag]") ,{});
	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		var el_ulDrag = el.find("[id=ulDrag]");
		var panelArray = [];
		var customPanel = [];
		var count = 0;
		el_ulDrag.find("ul").each(function (){
			var obj = new Object();
			obj.id = $(this).attr("data-id");
			obj.isChecked = $(this).find("input[type=checkbox]").is(":checked");
			obj.name = $(this).find("li").eq(0).html();
			if (obj.isChecked)
			{
				count ++;
			}
			panelArray.push(obj);
		});
		el.find("[id=panel_div]").find("input").each(function (){
			customPanel.push($(this).val());
			count++;
		});
		if (count == 0)
		{
			g_dialog.operateAlert(el ,"请至少选择一个面板" ,"error");
			return false;
		}
		var dataList = [];//g_grid.getData($("#table_div"));
		var newId =  el.find("[data-id=id]").val()?el.find("[data-id=id]").val():0;
		dataList.push({
				id : newId,
				viewName: el.find("[data-id=viewName]").val(),
				playInterval : el.find("[data-id=playInterval]").val(),
				bigScreenArray : JsonTools.encode(panelArray),
				customPanel : JsonTools.encode(customPanel),
				countnum : count,
				playInterval : saveObj.playInterval
			});
		um_ajax_post({
			url : create_url,
			paramObj : { bigscreen : dataList },
			maskObj : el,
			successCallBack : function (){
				g_dialog.operateAlert();
				g_dialog.hide(el);
				g_grid.refresh($("#table_div"));
			}
		});
	}
}

function panel_render(el ,panelIdArray)
{
	var buffer = [];
	var panelObj;
	var checkStr;
	var allcheck = true;
	for (var i = 0; i < panelIdArray.length; i++)
	{
		checkStr = "";
		panelObj = panelIdArray[i];
		buffer.push('<ul class="float-ul prel" data-id="'+panelObj.id+'">');
		buffer.push('<li style="width:185px">'+panelObj.name+'</li>');
		checkStr = (panelObj.isChecked?"checked=checked":"");
		buffer.push('<li class="tr" style="width:150px"><input type="checkbox" class="prel" style="top:1px" '+checkStr+'/></li>');
		buffer.push('</ul>');
		if(panelObj.isChecked){

		}else {
			allcheck = false;
		}
	}
	if(allcheck){
		$("[data-type=check_all]").prop('checked',true);
	}
	el.append(buffer.join(""));
}

function url_panel_render(el ,url)
{
	if(el.find("[id=panel_div] ul").length>=5){
		g_dialog.operateAlert(el,"最多添加5个自定义面板","error");
		return ;
	}
	url = (url?url:"");
	var buffer = [];
	buffer.push('<ul class="float-ul" style="height:30px;line-height:30px;margin-top:5px">');
	buffer.push('<li style="width:325px;position:relative;"><input class="form-control input-sm" validate="required url" type="text" style="width:300px" value="'+url+'"/></li>');
	buffer.push('<li style="width:20px"><i class="icon-animate icon-remove" style="font-size:16px"></i></li>');
	buffer.push('</ul>');
	el.find("[id=panel_div]").append(buffer.join(""));
	g_validate.init(el);
}

function delete_list_init(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : delete_url,
				paramObj : {bigscreen : [{
								id : rowData.id
							}]},
				maskObj : $("#table_div"),
				successCallBack : function(data){
					g_grid.refresh($("#table_div"));
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function big_screen_show(rowData)
{
	var url = "#/monitor_info/big_screen?hideMenu=1&id="+rowData.id;
	url = encodeURI(url);
    url = encodeURI(url);
	window.open(url);
}


});
});