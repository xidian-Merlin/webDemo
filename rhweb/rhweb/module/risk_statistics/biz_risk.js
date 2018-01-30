$(document).ready(function (){
	require(['/js/plugin/accordion/accordion.js',
			 '/js/plugin/tree/tree.js',
			 '/js/plugin/plot/plot.js'] ,function (accordion ,tree ,plot){
// 左侧导航树url
var left_nav_tree_url = "domainRisk/queryTreeList";

var el_accordion = $("#accordion");

//导出按钮url
var sec_risk_export_excute_url = "";

var current_event_list;

var current_event_head;

var list_current_node;

var current_legendArray;
var current_dataArray;
var current_legendArray1;
var current_dataArray1;

var current_rowData;

var color_array;
var color_array1;

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
			paramObj : {type:2},
			isLoad : false,
			successCallBack : function (data){
				data[$(self).attr("data-name")].push({id:"roota" ,parentID:"-1" ,label:"全部"});
				tree.render($("#accordion") ,{
							zNodes : data[$(self).attr("data-name")],
							zTreeOnClick : accordion_click
						});
				tree.expandSpecifyNode($("#accordion") ,"roota");
				accordion_click(null ,null ,tree.selectNode($("#accordion") ,{key:"id",value:"roota"}));
			}
		});
	});
	get_risk({paramObj:{type:1}});
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
		});
		$("#chart_div").css("width" , "0");
	});

	$("#time_sel").change(function (){
		line_chart_render(current_rowData);
	});

	$("#export_btn").click(function (){
		window.location.href = index_web_app + "domainRisk/exportRiskInfo";
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
	// 根据ID判断显示table还是图表
	if (treeNode.id == "roota")
	{
		$("#chevron-right").click();
	}
	else
	{
		line_chart_render({domaId:treeNode.id ,domaName:treeNode.extra});
	}
}

function list_list(paramObj ,opt)
{
	g_grid.render($("#table_div"),{
		"header":[
				  {text:'业务域全名',name:"domaName" ,width:62.5},
				  {text:'风险值',name:"riskValue" ,width:12.5 ,searchRender:function (el){
				  		index_render_div(el ,{type:"range",startKey:"riskValueDown",endKey:"riskValueUp"});
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
						return '<i style="font-size:20px"></i><span class="dib circle prel circle-num" style="background-color:'+countColor+';">'
									+txt+'</span>';
					}},
				  {text:'变化趋势',name:"riskStatus" ,width:12.5 ,searchRender:function (el){
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
				  },
				  render:function (txt){
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
				  {text:'风险等级',name:"riskLevel" ,width:12.5 ,hideSearch:true,searchRender:function (el){
				  		g_formel.select_render(el ,{
				  			data : [
				  					{id:"" ,text:"---"},
				  					{id:"5" ,text:"很高"},
				  					{id:"4" ,text:"高"},
				  					{id:"3" ,text:"中"},
				  					{id:"2" ,text:"低"},
				  					{id:"1" ,text:"很低"}
				  				   ],
				  			name : "riskLevel"
				  		});
				  },render:function (txt ,rowData){
						var countColor = "#e74c3c";
						// var countColor = "";
						if (txt == "很低")
						{
							countColor = "#96e174";
						}
						else if (txt == "低")
						{
							countColor = "#62cb31";
						}
						else if (txt == "中")
						{
							countColor = "#ffb933";
						}
						else if (txt == "高")
						{
							countColor = "#fe8174";
						}
						return '<i style="font-size:20px"></i><span class="dib prel" style="padding:0 3px;width:4em; background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
									+txt+'</span>';
					}}
				 ],
		 paramObj:paramObj,
		 url:"domainRisk/queryDomainRisk",
		 isLoad:false,
		 allowCheckBox:false,
		 dbClick:function (rowData){
		 	line_chart_render(rowData);
		 }
	});
}

function line_chart_render(rowData)
{
	$("#chart_div").removeClass("ovh");
	current_rowData = rowData;
	$("#chevron-title").text(rowData.domaName);
	$("#chart_div").css("width" , "100%");
 	$("#sec_area").empty();
 	$("#sec_area").stopTime();
 	var dateType = $("#time_sel").val();
	$("#sec_area").oneTime(600 ,function (){
		um_ajax_post({
			url : "domainRisk/setQueryTime",
			paramObj : {type:$("#time_sel").val() ,domaId :rowData.domaId ,objType:0},
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

function daomin_alerm_get(rowData)
{
	um_ajax_get({
				url : "domainRisk/queryDaominAlerm",
				paramObj : {queryTime:$("#time_sel").val(),domaId :rowData.domaId ,objType:0 ,firstNum:0 ,timeLable:rowData.timeLable},
				successCallBack : function (data){
					current_event_list = data.datas3;
					current_event_head = data.head;
					table_show_render();
					var legendArray = [];
					var dataArray = [];
					var colorArray = [];
					var data1 = data.datas;
					for (var i = 0; i < data1.length; i++) {
						legendArray.push(data1[i].lable);
						dataArray.push({value:data1[i].value, name:data1[i].lable});
						if(data1[i].lable == "故障事件")
						{
							colorArray.push('#e74c3c');
						}
						if(data1[i].lable == "性能事件")
						{
							colorArray.push('#ffb606');
						}
						if(data1[i].lable == "配置事件")
						{
							colorArray.push('#62cb31');
						}
					}

					var legendArray1 = [];
					var dataArray1 = [];
					var colorArray1 = [];
					var data2 = data.datas2;
					for (var i = 0; i < data2.length; i++) {
						legendArray1.push(data2[i].lable);
						dataArray1.push({value:data2[i].value, name:data2[i].lable});
						if(data2[i].lable == "很高")
						{
							colorArray1.push('#e74c3c');
						}
						if(data2[i].lable == "高")
						{
							colorArray1.push('#e74c3c');
						}
						if(data2[i].lable == "中")
						{
							colorArray1.push('#ffb606');
						}
						if(data2[i].lable == "低")
						{
							colorArray1.push('#62cb31');
						}
						if(data2[i].lable == "很低")
						{
							colorArray1.push('#96e174');
						}
					}
					current_legendArray = legendArray;
					current_dataArray = dataArray;
					color_array = colorArray;
					color_array1 = colorArray1;
					current_legendArray1 = legendArray1;
					current_dataArray1 = dataArray1;
					chart_show_render();

				}
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
		var data = [];
		for (var i = 0; i < current_event_list.length; i++) {

			if(current_event_list[i].col0 != "安全事件" && current_event_list[i].col0 != "脆弱性事件")
			{
				data.push(current_event_list[i]);
			}
		}
		g_grid.render($("#event_list_div") ,{
			data : data,
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
							color_array:color_array,
							labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"inside",
							                formatter:'{c}',
							                textStyle:{fontSize:20}
							              },
						           }
							// click:function (param){
							// 	for (var i = 0; i < current_event_list.length; i++) {
							// 		if (param.name == current_event_list[i].col0){
							// 			var tmp_legend = [];
							// 			var tmp_data = [];
							// 			var color_array2 = [];
							// 			if (current_event_list[i].col1 != 0)
							// 			{
							// 				tmp_legend.push("很高");
							// 				tmp_data.push({"value":current_event_list[i].col1 ,"name":"很高"});
							// 				color_array2.push("#e74c3c");
							// 			}
							// 			if (current_event_list[i].col2 != 0)
							// 			{
							// 				tmp_legend.push("高");
							// 				tmp_data.push({"value":current_event_list[i].col2 ,"name":"高"});
							// 				color_array2.push("#fe8174");
							// 			}
							// 			if (current_event_list[i].col3 != 0)
							// 			{
							// 				tmp_legend.push("中");
							// 				tmp_data.push({"value":current_event_list[i].col3 ,"name":"中"});
							// 				color_array2.push("#ffb933");
							// 			}
							// 			if (current_event_list[i].col4 != 0)
							// 			{
							// 				tmp_legend.push("低");
							// 				tmp_data.push({"value":current_event_list[i].col4 ,"name":"低"});
							// 				color_array2.push("#62cb31");
							// 			}
							// 			if (current_event_list[i].col5 != 0)
							// 			{
							// 				tmp_legend.push("很低");
							// 				tmp_data.push({"value":current_event_list[i].col5 ,"name":"很低"});
							// 				color_array2.push("#96e174");
							// 			}

							// 			console.log(tmp_legend);
							// 			console.log(tmp_data);

							// 			plot.pieRender($("#sec_area2") ,{
							// 				legend:tmp_legend,
							// 				data:tmp_data,
							// 				color_array:color_array2,
							// 				name:"等级"
							// 			});
							// 		}
							// 	}	
							// }
						});

		plot.pieRender($("#sec_area2") ,{
							legend:current_legendArray1,
							data:current_dataArray1,
							color_array:color_array1,
							name:"等级",
							labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"inside",
							                formatter:'{c}',
							                textStyle:{fontSize:20}
							              },
						           }
						});
	}
	
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