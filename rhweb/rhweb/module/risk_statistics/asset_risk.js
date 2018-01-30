$(document).ready(function (){
	require(['/js/plugin/accordion/accordion.js',
			 '/js/plugin/tree/tree.js',
			 '/js/plugin/plot/plot.js'] ,function (accordion ,tree ,plot){
// 左侧导航树url
var left_nav_tree_url = "assetrisk/queryCntTreeList";

var el_accordion = $("#accordion");

//导出按钮url
var sec_risk_export_excute_url = "";

var current_event_list;

var current_event_head;

var list_current_type;

var current_legendArray;
var current_dataArray;
var current_legendArray1;
var current_dataArray1;

var list_current_node;

var current_rowData;

// 事件map
var eventMap = new HashMap();
eventMap.put("性能事件" ,1);
eventMap.put("故障事件" ,2);
eventMap.put("安全事件" ,3);
eventMap.put("脆弱性事件" ,4);

view_init();

event_init();

initLayout();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");

	index_form_init($("#time_sel_div"));

	$("#accordion_icon").find("div").click(function (){
		list_current_type = $(this).attr("data-type");
		list_current_data_name = $(this).attr("data-name");;
		$("#accordion_icon").find("div").removeClass("active");
		$(this).addClass("active");
		var self = this;
		um_ajax_post({
			url : left_nav_tree_url,
			paramObj : {cntTree : 1},
			isLoad : false,
			successCallBack : function (data){
				tree.render($("#accordion") ,{
							zNodes : data[$(self).attr("data-name")],
							zTreeOnClick : accordion_click
						});
				tree.expandSpecifyNode($("#accordion") ,"roota");
				accordion_click(null ,null ,tree.selectNode($("#accordion") ,{key:"id",value:"roota"}));
			}
		});
	});
}
function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});

	$("[name=show_type]").click(function (){
		var chkVal = $("[name=show_type]:checked").val();
		if (chkVal == "1")
		{
			$("#table_show_div").hide();
			$("#chart_show_div").show();
			chart_show_render();
		}
		else
		{
			$("#chart_show_div").hide();
			$("#table_show_div").show();
			table_show_render();
		}
	});

	$("#chevron-right").click(function (){
		$("#chart_div").oneTime(100 ,function (){
			$("#chart_div").addClass("ovh");
		})
		$("#chart_div").css("width" , "0");
	});

	$("#time_sel").change(function (){
		line_chart_render(current_rowData);
	});

	$("#export_btn").click(function (){
		window.location.href = index_web_app + "assetrisk/exportRiskInfo";
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

function accordion_click(event, treeId, treeNode)
{
	$("#chevron-right").click();

	list_current_node = treeNode;

	var tree = el_accordion.data("tree");

	var nodes = tree.getNodesByFilter(function (node){
		return true;
	} ,false ,treeNode);

	var queryId = [];

	if(treeNode.id != "roota")
	{
		for (var i = 0; i < nodes.length; i++) {
			queryId.push(nodes[i].id);
		}

		queryId.push(treeNode.id);
	}

	type = list_current_type;
	var paramObj;

	if (type == 3)
	{
		paramObj = {type:type,securityDomainId:queryId.join(",")};
	}
	else if (type == 1)
	{
		paramObj = {type:type,bussinessDomainId:queryId.join(",")};
	}
	else if (type == 4)
	{
		paramObj = {type:type,assetTypeId:queryId.join(",")};
	}

	get_risk(paramObj);
	
}

function get_risk(paramObj){
	um_ajax_get({
		url:"sysoption/querySysValue",
		isLoad :true,
		maskObj: "body",
		successCallBack:function(data){
			var opt = new Object();
			opt.vlow = data[0].vllimilt;
			opt.low = data[0].llimilt;
			opt.normal = data[0].mlimilt;
			opt.high = data[0].hlimilt;
			list_list(paramObj,opt);
		}
	});
}

function list_list(paramObj ,opt)
{
	g_grid.render($("#table_div"),{
		"header":[
				  {text:'资产名称',name:"assetName",searchRender : function (el){
				  		el.append('<input type="hidden" search-data="type" value="3" searchCache/>');
				  		el.append('<input type="hidden" search-data="securityDomainId" searchCache/>');
				  		el.append('<input type="hidden" search-data="bussinessDomainId" searchCache/>');
				  		el.append('<input type="hidden" search-data="assetTypeId" searchCache/>');
				  		el.append('<input type="text" search-data="assetName" class="form-control input-sm" />');
				  }},
				  {text:'IP地址',name:"ip",searchRender:function (el){
						index_render_div(el ,{type:"ip"});
				  }},
				  {text:'变化趋势',name:"riskStatus",searchRender:function (el){
				  	var data = [
								  {text:"----" ,id:"-1"},
			  					  {text:"下降" ,id:"1"},
			  					  {text:"不变" ,id:"2"},
			  					  {text:"上升" ,id:"3"}
						  	   ];
					g_formel.select_render(el ,{
						data : data,
						name : "riskStatus"
					});
				  },render:function (txt){
				  		if (txt == "1")
				  		{
				  			return "下降";
				  		}
				  		if (txt == "2")
				  		{
				  			return "不变";
				  		}
				  		if (txt == "3")
				  		{
				  			return "上升";
				  		}
				  }},
				  {text:'风险值',name:"riskValue",searchRender:function (el){
				  	index_render_div(el ,{type:"range",startKey:"riskValueMin",endKey:"riskValueMax"});
				  },render:function (txt ,rowData){
				  		if (txt == "未计算")
				  		{
				  			return txt;
				  		}
						var count =  parseInt(rowData.riskValue);
						var countColor;
						if (count <= opt.vlow)
						{
							countColor = "#96e174";
						}
						else if( count > opt.vlow && count <= opt.low)
						{
							countColor = "#62cb31";
						}
						else if(count > opt.low && count <= opt.normal)
						{
							countColor = "#ffb933";
						}
						else if(count > opt.normal && count <= opt.high)
						{
							countColor = "#fe8174";
						}
						else if(count > opt.high)
						{
							countColor = "#e74c3c";
						}
						return '<i style="font-size:20px"></i><span class="dib prel circle circle-num" style="background-color:'+countColor+';">'
									+count+'</span>';
					}},
				  {text:'风险等级',name:"riskRank",hideSearch:true,searchRender:function (el){
				  	var data = [
								  {text:"----" ,id:"-1"},
			  					  {text:"很低" ,id:"1"},
			  					  {text:"低" ,id:"2"},
			  					  {text:"中" ,id:"3"},
			  					  {text:"高" ,id:"4"},
			  					  {text:"很高" ,id:"5"},
						  	   ];
					g_formel.select_render(el ,{
						data : data,
						name : "riskRank"
					});
				  },render:function (txt ,rowData){
						return '<i style="font-size:20px"></i><span class="dib prel level" style="background-color:'+dict_level_name_bgcolor[txt]+';">'
									+txt+'</span>';
					}}
				 ],
		 paramObj:paramObj,
		 url:"assetrisk/queryAssetRisk",
		 isLoad:false,
		 allowCheckBox:false,
		 cbf:function (){
			$("#table_div").find("[search-data=type]").val(paramObj.type);
			$("#table_div").find("[search-data=securityDomainId]").val(paramObj.securityDomainId);
			$("#table_div").find("[search-data=bussinessDomainId]").val(paramObj.bussinessDomainId);
			$("#table_div").find("[search-data=assetTypeId]").val(paramObj.assetTypeId);
		},
		 dbClick:function (rowData){
		 	line_chart_render(rowData);
		 }
	});
}

function line_chart_render(rowData)
{
	current_rowData = rowData;
	$("#chart_div").removeClass("ovh");
	$("#chevron-title").text(rowData.assetName);
	$("#chart_div").css("width" , "100%");
 	$("#sec_area").empty();
 	$("#sec_area").stopTime();
 	var dateType = $("#time_sel").val();
	$("#sec_area").oneTime(600 ,function (){
		$("#info_div").umDataBind("render" ,rowData);
		um_ajax_post({
			url : "assetrisk/setQueryTime",
			paramObj : {type:$("#time_sel").val() ,assetId :rowData.assetId ,objType:1 ,firstNum:0},
			successCallBack : function (data){
				var	categoryArray = [];
				var	seriesArray = [];
				var seriesObj = new Object();
				seriesObj.name = "风险值";
				seriesObj.type = "line";
				seriesObj.data = [];

				var data = data.datas[0].items;

				for (var i = 0; i < data.length; i++)
				{
					if (dateType == "0")
					{
						categoryArray.push(data[i].tip);
					}
					else
					{
						categoryArray.push(data[i].tip.substr(0,11));
					}
					seriesObj.data.push(data[i].value);
				}

				seriesArray.push(seriesObj);

				plot.lineRender($("#sec_area") ,{
					category : categoryArray,
					series : seriesArray,
					grid:{
						top:"6%",
						bottom:"12%"
					},
					tooltipFormatter : function (param){
						if (dateType == "0")
						{
							return param[0].name.substr(11) + "</br>" + param[0].seriesName + " : " + param[0].value;
						}
						else
						{
							return param[0].name.substr(0 ,11) + "</br>" + param[0].seriesName + " : " + param[0].value;
						}
					},
					axisLabelFormatter : function (value, index){
						if (value)
						{
							if (dateType == "0")
							{
								return value.substr(11);
							}
							else
							{
								return value.substr(5);
							}
						}
						else
						{
							return "";
						}
					},
					click : function (param){
						rowData.timeLable = param.name;
						daomin_alerm_get(rowData);
					}
				});

				daomin_alerm_get(rowData);
			}
		});

	});

}

function table_show_render()
{
	if (!$("#table_show_div").is(":hidden"))
	{
		var header = [];
		for (var i = 0; i < current_event_head.length; i++) {
			header.push({text:current_event_head[i].columnname ,name:("col"+i)})
		}
		g_grid.render($("#event_list_div") ,{
			data : current_event_list,
			header : header,
			paginator : false,
			allowCheckBox : false,
			hasBorder : false,
			hideSearch : true,
			gridCss : "um-grid-style"
		});
	}
	
}

function chart_show_render()
{
	if ($("#table_show_div").is(":hidden"))
	{
		if (!current_legendArray || current_legendArray.length == 0)
		{
			$("#sec_area1").html('<div class="tc pabs w-all" style="top:45%">暂无数据</div>');
			$("#sec_area2").html('<div class="tc pabs w-all" style="top:45%">暂无数据</div>');
			return false;
		}
		plot.pieRender($("#sec_area1") ,{
							legend:current_legendArray,
							data:current_dataArray,
							name:"事件",
							click:function (param){
								plot.pieRender($("#sec_area2") ,{
									legend:current_legendArray1,
									data:current_dataArray1,
									name:"等级"
								});
							}
						});

		plot.pieRender($("#sec_area2") ,{
							legend:current_legendArray1,
							data:current_dataArray1,
							name:"等级"
						});
	}
	
}

function daomin_alerm_get(rowData)
{
	um_ajax_get({
				url : "domainRisk/queryDaominAlerm",
				paramObj : {queryTime:1 ,domaId :rowData.domaId ,objType:1 ,firstNum:0 ,timeLable:rowData.timeLable},
				successCallBack : function (data){
					current_event_list = data.datas3;
					current_event_head = data.head;
					table_show_render();
					var legendArray = [];
					var dataArray = [];
					var data1 = data.datas;
					for (var i = 0; i < data1.length; i++) {
						legendArray.push(data1[i].lable);
						dataArray.push({value:data1[i].value, name:data1[i].lable});
					}

					var legendArray1 = [];
					var dataArray1 = [];
					var data2 = data.datas2;
					for (var i = 0; i < data2.length; i++) {
						legendArray1.push(data2[i].lable);
						dataArray1.push({value:data2[i].value, name:data2[i].lable});
					}
					current_legendArray = legendArray;
					current_dataArray = dataArray;
					current_legendArray1 = legendArray1;
					current_dataArray1 = dataArray1;
					chart_show_render();

				}
			});
}

function sec_risk_export_excute_init()
{
	window.location.href = index_web_app + el.attr("data-id") + "?exportEdId="+idArray.join(",");
}

function riskValue_query_render(searchEl){
	searchEl.append('<input type="text" class="form-control input-sm" />');
	searchEl.append('<input type="hidden" class="form-control input-sm"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm"/>');

	searchEl.find("input").eq(0).click(function (){

		g_dialog.dialog($("#riskValue_query_template").html(),{
			width:"450px",
			init:init,
			saveclick:save_click
		});

		function init(el)
		{
			el.find("input").eq(0).val(searchEl.find("input").eq(1).val());
			el.find("input").eq(1).val(searchEl.find("input").eq(2).val());
		}
		function save_click(el)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}
			// 上限不能小于下限
			var up = el.find("input").eq(0).val();
			var down = el.find("input").eq(1).val();
			if (up < down)
			{
				g_dialog.dialogTip(el ,{
					msg : "上限不能小于下限"
				});
				return false;
			}
			g_dialog.hide(el);
			searchEl.find("input").eq(0).val(down + " - " + up);
			searchEl.find("input").eq(1).val(up);
			searchEl.find("input").eq(2).val(down);
		}
	});
}

});
});