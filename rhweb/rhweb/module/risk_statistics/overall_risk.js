$(document).ready(function (){
require(['/js/plugin/plot/plot.js'] ,function (plot){


var current_legendArray;
var current_dataArray;
var current_legendArray1;
var current_dataArray1;

var current_rowData;

// 事件map
var eventMap = new HashMap();
eventMap.put("性能事件" ,1);
eventMap.put("故障事件" ,2);
eventMap.put("安全事件" ,3);
eventMap.put("脆弱性事件" ,4);

view_init();

event_init();

function event_init()
{
	$("#time_sel").change(function (){
		line_graph_get();
	});
}

function view_init()
{
	index_form_init($("#time_sel_div"));

	security_graph_get();

	line_graph_get();
}

function security_graph_get()
{
	var weatherMap = new HashMap();
	weatherMap.put("1" ,"fine");
	weatherMap.put("2" ,"cloudy");
	weatherMap.put("3" ,"overcase");
	weatherMap.put("4" ,"rain");
	weatherMap.put("5" ,"big_rain");
	um_ajax_get({
		url : "domainRisk/getAllSecurityGraph",
		paramObj : {type:"1" ,domaId:"0" ,objType:"0",firstNum:"0"},
		successCallBack : function (data){
			var para = data.para;
			var paraArray = para.split(",");
			var singleParaArray;
			for (var i = 0; i < paraArray.length; i++) {
				singleParaArray = paraArray[i].split("_");
				$("[data-type=weather]").eq(i).addClass(weatherMap.get(singleParaArray[0]));
				if (i != 0)
				{
					$("[data-type=weather]").eq(i).next().text(singleParaArray[1].substr(5));
				}
			}
		}
	});
}

function line_graph_get()
{
	var dateType = $("#time_sel").val();
	um_ajax_get({
		url : "domainRisk/setQueryTime",
		paramObj : {type:$("#time_sel").val() ,domaId :0 ,objType:0},
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
				delay : true,
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
					daomin_alerm_get({timeLable:param.name});
				}
			});

			daomin_alerm_get({});
		}
	});
}

function daomin_alerm_get(rowData)
{
	um_ajax_get({
				url : "domainRisk/queryDaominAlerm",
				paramObj : {queryTime:$("#time_sel").val() ,domaId :0 ,objType:0 ,firstNum:0 ,timeLable:rowData.timeLable},
				successCallBack : function (data){
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

function chart_show_render()
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
						labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"inside",
							                formatter:'{c}',
							                textStyle:{fontSize:20}
							              },
						           },
						// click:function (param){
						// 	plot.pieRender($("#sec_area2") ,{
						// 		legend:current_legendArray1,
						// 		data:current_dataArray1,
						// 		name:"等级",
						// 		labelSetting : {normal:
						// 				  {
						// 				  	show:true ,
						// 				  	position:"inside",
						// 	                formatter:'{c}',
						// 	                textStyle:{fontSize:20}
						// 	              },
						//            }
						// 	});
						// },
						color_array : ['#e74c3c' ,'#ffb606']
					});

	plot.pieRender($("#sec_area2") ,{
						legend:current_legendArray1,
						data:current_dataArray1,
						name:"等级",
						labelSetting : {normal:
										  {
										  	show:true ,
										  	position:"inside",
							                formatter:'{c}',
							                textStyle:{fontSize:20}
							              },
						           },
						color_array : ['#e74c3c' ,'#ffb606' ,'#62cb31']
					});
}



// plot.skyRender("partly-cloudy-day" ,{color:"#a3e1d4" ,skyIcon:"CLEAR_DAY"});

// plot.skyRender("cloudy" ,{color:"#a3e1d4" ,skyIcon:"CLEAR_DAY"});

// plot.skyRender("cloudy1" ,{color:"#a3e1d4" ,skyIcon:"CLEAR_DAY"});

// plot.skyRender("cloudy2" ,{color:"#a3e1d4" ,skyIcon:"CLEAR_DAY"});

// plot.lineRender($("#sec_area") ,{
// 	legend : ['邮件营销'],
// 	category : ['周一','周二','周三','周四','周五','周六','周日'],
// 	series : [
// 			        {
// 			            name:'邮件营销',
// 			            type:'line',
// 			            data:[120, 132, 101, 134, 90, 230, 210]
// 			        }
// 			    ]
// });

// plot.pieRender($("#sec_area1") ,{

// });

// plot.pieRender($("#sec_area2") ,{
	
// });



});
});