$(document).ready(function (){
require(['plot','/js/plugin/topo/topo.js',
		'/js/lib/fullcalendar/js/moment.min.js',
		'/js/lib/processbar/progressbar.js'] ,function (plot,topo,moment,progressbar){

var el_myCarousel = $("#myCarousel");
var el_page_data = $("[data-page=page-data]");
var el_page_net = $("[data-page=page-net]");
var el_page_event = $("[data-page=page-event]");
var el_page_topo = $("[data-page=page-topo]");
var el_page_biz = $("[data-page=page-biz]");
var el_page_biz2 = $("[data-page=page-biz2]");
var el_page_biz3 = $("[data-page=page-biz3]");
var el_page_overall = $("[data-page=page-overall]");
var el_biz_monitor_div = $("#biz_monitor_div");
var localLocale = moment;
var echartArray = [];
var processBarArray = [];
localLocale.locale('zh-cn');
// var datetime = localLocale().format('llll');
var datetime = g_moment().format('YYYY年MM月DD日');
var week = g_moment().format('e');
if(week==0){
	week = " 星期日";
}else if(week==1){
	week = " 星期一";
}else if(week==2){
	week = " 星期二";
}else if(week==3){
	week = " 星期三";
}else if(week==4){
	week = " 星期四";
}else if(week==5){
	week = " 星期五";
}else if(week==6){
	week = " 星期六";
}
datetime += week;

var Local_inList = [19,28,29,31];

var urlParamObj = index_query_param_get();
var resizeFlag = true;
$(window).resize(function (){
	if (resizeFlag)
	{
		$("#data_fault_asset_div").oneTime(1000 ,function (){
			active_carousel_init();
			resizeFlag = true;
		});
	}
	resizeFlag = false;
});

view_init();

event_init();

initLayout();

function view_init()
{	 
	carousel_init();
	$("#full_screen_div").everyTime(1000 ,function (){
		$("[data-id=date]").html(datetime + "</br>" + g_moment().format('HH:mm:ss'));
	});
}

function event_init()
{
	// 绑定ESC退出事件
	$(document).keydown(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if (keycode == 27)
	    {
	    	//exit_full_screen();
	    }
	});

	$("#full_screen_div").click(function (){
		full_screen();
	});

	var myElement = document.getElementById('myCarousel');

	var mc = new Hammer(myElement);

	var flag = true;
	mc.on("panleft panright tap press", function(ev) {
		if (flag)
		{
			el_myCarousel.oneTime(500 ,function (){
				if (ev.type == "panleft")
			    {
			    	el_myCarousel.carousel('next')
			    }
			    if (ev.type == "panright")
			    {
			    	el_myCarousel.carousel('prev')
			    }
			    flag = true;
			});
			flag = false;
		}
	});
}

function initLayout()
{
	full_screen();
}

function carousel_init()
{
	var el_carousel_ol = $("#carousel_ol");
	var el_carousel_inner = $("#carousel_inner");
	var isFirst = true;
	var count = 0;
	var classStr = "";
	var firstId = "";

	um_ajax_get({
		url : "bigscreen/getBigScreen",
		paramObj : {id : urlParamObj.id},
		isLoad : false,
		successCallBack : function (data){
			var playInterval = data[0].playInterval * 1000;
			var urlData = JsonTools.decode(data[0].customPanel);
			var data = JsonTools.decode(data[0].bigScreenArray);
			for (var i = 0; i < data.length; i++) {
				classStr = "";
				if (data[i].isChecked)
				{
					if (isFirst)
					{
						classStr = "active";
						isFirst = false;
						firstId = data[i].id;
						$("[data-page=page-"+data[i].id+"]").addClass("active");
					}
					el_carousel_ol.append('<li data-target="#myCarousel" data-slide-to="'
												+count+'" class="'+classStr+'" data-index="'+data[i].id+'"></li>');
					count ++;
					el_carousel_inner.append($("[data-page=page-"+data[i].id+"]"));
				}
			}
			for (var i = 0; i < urlData.length; i++) {
				classStr = "";
				if (isFirst)
				{
					classStr = "active";
					isFirst = false;
					el_carousel_inner.append('<div class="item w-all h-all active"><iframe src="'+urlData[i]+'" class="w-all h-all" border="0" marginwidth="0" marginheight="0" frameborder="no"></div>');
				}
				else
				{
					el_carousel_inner.append('<div class="item w-all h-all"><iframe src="'+urlData[i]+'" class="w-all h-all" border="0" marginwidth="0" marginheight="0" frameborder="no"></div>');
				}
				el_carousel_ol.append('<li data-target="#myCarousel" class="'+classStr+'" data-slide-to="'+count+'"></li>');
				count++;
			}

			el_myCarousel.carousel({interval : playInterval ,pause:"click"});

			el_myCarousel.on('slid.bs.carousel', function () {
		 		active_carousel_init();
			});

			el_myCarousel.on('slide.bs.carousel', function () {
		 		$("#today_trend_info_chart").html("");
		 		$("#sla_response_chart").html("");
		 		$("#avg_handle_time_chart").html("");
		 		$("#request_trend_div").html("");
		 		$("#normal_div").html("");
		 		$("#unusual_div").html("");
		 		$("#warn_div").html("");
		 		$("#error_div").html("");
		 		$("#monitorClassDstatus").find("[data-id=inner_div]").html("");
		 		$("body").find("[data-type=col]").remove();
		 		el_biz_monitor_div.html("");
		 		topo.bigScreenClear();
		 		for (var i = 0; i < echartArray.length; i++) {
		 			plot.destroy(echartArray[i]);
		 			echartArray[i] = null;
		 		}
		 		echartArray = [];
		 		for (var i = 0; i < processBarArray.length; i++) {
		 			//processBarArray[i].destroy();
		 			processBarArray[i] = null;
		 		}
		 		processBarArray = [];
			});
			try{
				eval("el_page_"+firstId+"_init()");
			}catch(e){

			}
		}
	});
}

function active_carousel_init()
{
	biz_flag = false;
	$("body").oneTime(500,function (){
		try{
	 			eval("el_page_" + $("[class*=carousel-indicators] li.active").attr("data-index")+"_init()");
	 	   }
	 	   catch(e)
	 	   {

	 	   }
	});
}

// 全屏
function full_screen()
{
	$("#pg-header").hide();
	$("#pg-left-menu-outer").hide();
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
	$("#full_screen_div").hide();
	index_initLayout();
	//g_dialog.operateAlert($("#content_div"),"按ESC退出全屏");
	topo.bigScreenResize();
}

// 退出全屏
function exit_full_screen()
{
	if ($("[class*=big-screen]").size() > 0)
	{
		$("#pg-header").show();
		$("#pg-left-menu-outer").show();
		$("#pg-content").css("padding" ,"0 0 15px");
		$("#content_div").css("padding" ,"10px");
		$("#full_screen_div").show();
		index_initLayout();
		topo.bigScreenResize();
	}
}

// 文字上下居中
function setLineHeightMiddle(el)
{
	var el_height;
	if (el instanceof Array)
	{
		for (var i = 0; i < el.length; i++) {
			el_height = parseInt(el[i].css("height"));
			el.css("line-height" ,el_height+"px");
		}
	}
	else
	{
		el_height = parseInt(el.css("height"));
		el.css("line-height" ,el_height+"px");
	}
}

function title_layout(el)
{
	var windowHeight = $(window).height();
	var el_title_div = el.find("[data-id=data_analy_monitor_div]").find("div").eq(0);
	var el_title_div_height = parseInt(el_title_div.css("height"));
	el_title_div.css("line-height" ,el_title_div_height+"px");

	el.find("[verticalMiddle]").each(function (){
		setLineHeightMiddle($(this));
	});
	if (el_title_div.find("[data-id=date]").css("padding-top") == "0px")
	{
		var paddingValue = (el_title_div_height - el_title_div.find("[data-id=date]").height())/2;
		el_title_div.find("[data-id=date]").css("padding-top",
						(el_title_div_height - el_title_div.find("[data-id=date]").height())/2+"px");
		el_title_div.find("[data-id=calendar]").css("background-position","0px "+paddingValue+"px");
	}
	
}

// ---------------------------------------------- //
function el_page_data_init()
{
	title_layout(el_page_data);

	data_fault_asset_render();

	data_biz_sys_render();

	data_asset_first_render();

	data_asset_two_render();

	data_asset_three_render();
}

function data_fault_asset_render()
{
	dataMain_asset_get($("#data_fault_asset_div"));
}

function data_biz_sys_render()
{
	um_ajax_get({
		url : "appMonitor/queryAppSystemPFNum",
		// paramObj : {orderBy:'ttt.appmon_name'},
		isLoad : false,
		successCallBack : function (data){
			in_render(data);
		}
	});
	function in_render(data)
	{
		if (!data || data.length == 0)
		{
			return false;
		}
		var el_biz_sys_div = $("#biz_sys_div");
		el_biz_sys_div.find("[data-type=col]").remove();
		var length = (data.length > 7 ? 7 : data.length);
		for (var i = 0; i < length; i++) {
			var buffer = [];
			buffer.push('<ul class="table-ul animated fadeInUp" style="height:12%" data-type="col">');
			buffer.push('<li style="width:65%;text-align: left;padding-left: 1em" verticalMiddle>'+data[i].appName+'</li>');
			buffer.push('<li style="width:35%" verticalMiddle>'+(data[i].faultEventNum + data[i].performEventNum)+'</li>');
			buffer.push('</ul>');
			el_biz_sys_div.append(buffer.join(""));
		}

		el_biz_sys_div.find("[verticalMiddle]").each(function (){
			setLineHeightMiddle($(this));
		});
	}
	
}

function data_asset_first_render()
{
	getPcInfoOrderbyCPU();
}
function getPcInfoOrderbyCPU(){
	um_ajax_get({
		url : "bigscreen/getPcInfoOrderbyCPU",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#data_asset_first_div");
			var fields = ['cpuUsage','memoryUsage'];
			var suffix = ['%','%'];
			data_asset_render(el,data,fields,suffix);
		}
	});
}

function data_asset_two_render()
{
	getPcInfoOrderbyMemory()
}
function getPcInfoOrderbyMemory(){
	um_ajax_get({
		url : "bigscreen/getPcInfoOrderbyMemory",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#data_asset_two_div");
			var fields = ['memoryUsage','cpuUsage'];
			var suffix = ['%','%'];
			data_asset_render(el,data,fields,suffix);
		}
	});
}

function data_asset_three_render()
{
	getPcInfoOrderbyDisk();
}
function getPcInfoOrderbyDisk(){
	um_ajax_get({
		url : "bigscreen/getPcInfoOrderbyDisk",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#data_asset_three_div");
			var fields = ['diskUsage','mountName'];
			var suffix = ['%',''];
			data_asset_render(el,data,fields,suffix);
		}
	});
}

// ---------------------------------------------- //


// ---------------------------------------------- //
function el_page_net_init()
{
	title_layout(el_page_net);

	net_fault_asset_render();

	getNetInfoOrderbyCPU();
	getNetInfoOrderbyMemory();
	interface_flow_render();

	environment_info_render();

}
function getNetInfoOrderbyCPU(){
	um_ajax_get({
		url : "bigscreen/getNetInfoOrderbyCPU",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#net_asset_first_div");
			var fields = ['cpuUsage','memoryUsage'];
			var suffix = ['%','%'];
			data_asset_render(el,data,fields,suffix);
		}
	});
}
function getNetInfoOrderbyMemory(){
	um_ajax_get({
		url : "bigscreen/getNetInfoOrderbyMemory",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#net_asset_two_div");
			var fields = ['memoryUsage','cpuUsage'];
			var suffix = ['%','%'];
			data_asset_render(el,data,fields,suffix);
		}
	});
}

function net_fault_asset_render()
{
	netMain_asset_get($("#net_fault_asset_div"));
}

function interface_flow_render()
{
	var el = $("#net_asset_three_div")
	um_ajax_get({
		url : "bigscreen/getNetInfoOrderbyFlow",
		paramObj : {"flag": 1 ,"topFlag":true},
		isLoad : false,
		successCallBack : function (data){
			if (!data || data.length == 0)
			{
				return false;
			}
			el.find("[data-type=col]").remove();
			var length = (data.length > 5 ? 5 : data.length);
			var buffer = [];
			var cpuUsage;
			var memoryUsage;
			var monitorName;
			for (var i = 0; i < length; i++)
			{
				cpuUsage = (data[i].cpuUsage?data[i].cpuUsage:0);
				memoryUsage = (data[i].memoryUsage?data[i].memoryUsage:0);
				monitorName = (data[i].monitorName?data[i].monitorName:"");
				var bgi = getMonitorBGI(data[i]);
				var color;
				var status = data[i].monitorDstatus;
				if(status=='0'){
					color = '#62cb31';
				}else if(status=='1'){
					color = '#fff';
				}else if(status=='3'){
					color = '#ffb606';
				}else if(status=='4'){
					color = '#e74c3c';
				}else {
					color = '#fff';
				}
				buffer = [];
				buffer.push('<ul class="table-ul animated fadeInRight" style="height:17.5%" data-type="col">');
				buffer.push('<li style="width:70%;padding:0 0 0 1em" verticalMiddle verticalInner>');
				//buffer.push('<div class="w-all tl prel asset-and-icon"><i class="'+data[i].monitorType+'"></i>'+data[i].monitorName+'<div class="percent-div" style="width:'+data[i].faultEventCount+'%"></div></div>');
				buffer.push('<div class="w-all tl prel asset-and-icon" style="color:'+color+'"><i class="" style="background-image:url('+bgi+');"></i>'+data[i].monitorName+'</div>');
				buffer.push('</li>');
				buffer.push('<li style="width:10%" verticalMiddle>&nbsp;</li>');
				buffer.push('<li style="width:20%" verticalMiddle>'+data[i].fault+'M</li>');
				buffer.push('</ul>');
				el.append(buffer.join(""));
			}
			setVerticalMiddle(el);
		}
	});
}

function environment_info_render()
{
	var el_environment_div = $("#environment_div");	
	el_environment_div.find("[icon]").each(function (){
		$(this).height($(this).parent().width());
	});
	setVerticalMiddle(el_environment_div);
}
// --------------------------------------------- //

// ---------------------------------------------- //
function el_page_event_init()
{
	title_layout(el_page_event);
	sla_complete();
	sla_response();
	avg_handle_time();
	first_handle_rate();
	user_busy_render();
}
// sla完成率
function sla_complete()
{
	um_ajax_get({
		url : "bigscreen/getSLAFinishRatio",
		isLoad : false,
		successCallBack : function (data){

			var data = [
			            {name:"按时完成率",value:data.finishCount},
						{name:"超时完成率",value:data.timeoutFinishCount},
						{name:"超时未完成率",value:data.noFinishCount},
						{name:"未超时未完成率",value:data.normalNoFinishCount}
					   ];
			var el_today_trend_info_div = $("#today_trend_info_div");
			var el_today_trend_info_chart = $("#today_trend_info_chart");
			var chart = plot.pieRender(el_today_trend_info_chart ,{
				name : "完成率",
				data : data,
				centerPosition : ["35%" ,"50%"],
				grid : {
					left : "10%"
				},
				radius : '55%',
				legendArray:{
					        orient: 'vertical',
					        top:"1%",
					        left: 'right',
					        data: ["按时完成率" ,"超时完成率" ,"超时未完成率","未超时未完成率"],
					        textStyle: {color:"#b5b5b5"},
					        selectedMode:false
					    },
				color_array: ['#619505','#f79a00','#d05126','#1c789f','#f05050'],
				itemStyle:{
						        normal : {
						            label : {
							            position : 'inner',
							            formatter : function (params){
							            				if (params.percent == 0)
							            				{
							            					return "";
							            				}
							            				else
							            				{
							            					return (params.percent - 0) + '%';
							            				}
							            			},
						                textStyle: {
						                    color: '#fff'
						            	}
						            },
						            labelLine : {
						                show : false
						            }
						        }
						    },
				hideAnimation : false,
				resizeFlag : true
			});

			echartArray.push(chart);

			el_today_trend_info_div.find("[verticalMiddle]").each(function (){
				setLineHeightMiddle($(this));
			});
		}
	});
}

// sla响应率
function sla_response()
{
	um_ajax_get({
		url : "bigscreen/getSLAResponseRatio",
		isLoad : false,
		successCallBack : function (data){
			var data = [
			            {name:"按时响应率",value:data.normalReponseCnt},
						{name:"超时响应率",value:data.unNormalReponseCnt},
						{name:"超时未响应率",value:data.noReponseCnt},
						{name:"未超时未响应率",value:data.normalNoReponseCnt}
					   ];
			var el_sla_response_chart = $("#sla_response_chart");

			var chart = plot.pieRender(el_sla_response_chart ,{
				name : "响应率",
				data : data,
				centerPosition : ["35%" ,"50%"],
				legendArray:{
					        orient: 'vertical',
					        top:"1%",
					        left: 'right',
					        data: ["按时响应率" ,"超时响应率" ,"超时未响应率","未超时未响应率"],
					        textStyle: {color:"#b5b5b5"},
					        selectedMode:false
					    },
				radius: ['32%', '60%'],
				color_array: ['#619505','#f79a00','#d05126','#1c789f','#f05050'],
				itemStyle:{
						        normal : {
						            label : {
							            position : 'inner',
							            formatter : function (params){
							            				if (params.percent == 0)
							            				{
							            					return "";
							            				}
							            				else
							            				{
							            					return (params.percent - 0) + '%';
							            				}
							            			},
						                textStyle: {
						                    color: '#fff'
							            }
						            },
						            labelLine : {
						                show : false
						            }
						        }
						    },
				hideAnimation : false,
				resizeFlag : true
			});

			echartArray.push(chart);

			el_sla_response_chart.find("[verticalMiddle]").each(function (){
				setLineHeightMiddle($(this));
			});
		}
	});
}

// 技术组平均解决时间
function avg_handle_time()
{
	um_ajax_get({
		url : "bigscreen/getTecGroupArgSoluTime",
		isLoad : false,
		successCallBack : function (data){
			var groupArray = [];
			var dataArray = [];
			if(data){
				if(data instanceof Array){
					for(var i=0;i<data.length;i++){
						groupArray.push(data[i].orgName);
						var tempNum = Number(data[i].suncoun)/Number(data[i].coun)
						tempNum = Number(tempNum.toFixed(2));
						dataArray.push(tempNum);
					}
				}else {
					groupArray.push(data.orgName);
					var tempNum = Number(data.suncoun)/Number(data.coun);
					tempNum = Number(tempNum.toFixed(2));
					dataArray.push(tempNum);
				}
			}
			var el_avg_handle_time_chart = $("#avg_handle_time_chart");
			var chart = plot.barRender(el_avg_handle_time_chart ,{
				category : groupArray,
				series : [
					        {
					            name:'值',
					            type:'bar',
					            data:dataArray
					        }
					     ],
				xAxisLineColor : "#b6b2b3",
				yAxisLineColor : "#b6b2b3",
				splitLineColor : "#3c3c3c",
				color : ['#62cb31'],
				hideAnimation : false,
				resizeFlag : true
			});
			echartArray.push(chart);
		}
	});
}

// 一线解决率
function first_handle_rate()
{
	um_ajax_get({
		url : "bigscreen/getFrontSolveRatio",
		isLoad : false,
		successCallBack : function (data){
			var el_first_handle_rate_div = $("#first_handle_rate_div");

			el_first_handle_rate_div.find("[verticalMiddle]").each(function (){
				setLineHeightMiddle($(this));
			});
			$("#requestAllCount").html(data.total);
			$("#requestSolveCount").html(data.fcr);
			$("#requestSolveRatio").html((Math.round(data.fcr/data.total*100.0)?Math.round(data.fcr/data.total*100.0):0));
		}
	});
}

// 技术员忙碌程度
function user_busy_render()
{
	um_ajax_get({
		url : "bigscreen/getTecBusyDegree",
		paramObj : {inList : Local_inList},
		isLoad : false,
		successCallBack : function (data){
			var el = $("#user_busy_div");
			if ('undefined' == typeof data || !data || data.length == 0)
			{
				return false;
			}
			el.find("[data-type=col]").remove();
			var length = (data.length > 5 ? 5 : data.length);
			for (var i = 0; i < length; i++) {
				var buffer = [];
				buffer.push('<ul class="table-ul animated fadeInDown" style="height:17.5%" data-type="col">');
				buffer.push('<li style="width:20%;color:#b5b5b5;;text-align:center;" verticalinner verticalMiddle><div class="w-all tl prel asset-and-icon"><i style="background-image:url(/img/monitor/ren.png);background-repeat: no-repeat;background-size: 80% 80%;background-position: 50% 50%; height: 2em;left: 0;position: absolute;top: 0;width: 2em;"></i>'+data[i].loginName+'</div></li>');
				buffer.push('<li style="width:20%;color:#b5b5b5;text-align:center;" verticalMiddle>');
				buffer.push(data[i].fullName);
				buffer.push('</li>');
				buffer.push('<li style="width:20%;text-align:center;" verticalMiddle>');
				buffer.push('<div class="h-all" style="color:#b5b5b5">');
				buffer.push(data[i].hold);
				buffer.push('</div>');
				buffer.push('</li>');
				buffer.push('<li style="width:20%;text-align:center;" verticalMiddle>');
				buffer.push('<div class="h-all" style="color:#b5b5b5">');
				buffer.push(data[i].awaiting);
				buffer.push('</div>');
				buffer.push('</li>');
				buffer.push('<li style="width:20%;color:#b5b5b5;text-align:center;" verticalMiddle>'+data[i].inporgress+'</li>');
				buffer.push('</ul>');
				el.append(buffer.join(""));
			}
			setVerticalMiddle(el);

			// el.find("[verticalMiddle]").each(function (){
			// 	setLineHeightMiddle($(this));
			// });
		}
	});
}
// ---------------------------------------------- //
function el_page_topo_init()
{
	title_layout(el_page_topo);
	topo.initBigScreenShow();
}
//------------------------------------------------//
function el_page_biz_init(){
	var biz_flag = true;
	el_biz_monitor_div.stopTime();
	title_layout(el_page_biz);

	el_biz_monitor_div.html("");

	el_biz_monitor_div.append('<div class="pabs" style="top:0;left:0;right:0;bottom:0" id="biz_monitor_div_inner1">');
	el_biz_monitor_div.append('<div class="pabs" style="top:0;left:0;right:0;bottom:0" id="biz_monitor_div_inner2">');
	el_biz_monitor_div.append('<div class="pabs" style="top:0;left:0;right:0;bottom:0" id="biz_monitor_div_inner3">');

	el_biz_monitor_div.find("[id=biz_monitor_div_inner1]").html($("#beehive_tmp").html());

	biz_layout(el_biz_monitor_div);
	$("#biz_monitor_div_inner2").html("");
	$("#biz_monitor_div_inner3").html("");
	$("#biz_monitor_div_inner2").html($("#biz_monitor_div_inner1").html());
	$("#biz_monitor_div_inner3").html($("#biz_monitor_div_inner1").html());

	$("#biz_monitor_div_inner1").children().each(function (i){
		$(this).css({
			"transitionDelay": i * 0.2 + "s",
			"transform": "rotateX(0)"
		});
	});
	$("#biz_monitor_div_inner2").children().each(function (i){
		$(this).css({
			"transitionDelay": i * 0.2 + "s",
			"transform": "rotateX(90deg)",
			"opacity":"0"
		});
	});
	$("#biz_monitor_div_inner3").children().each(function (i){
		$(this).css({
			"transitionDelay": i * 0.2 + "s",
			"transform": "rotateX(90deg)",
			"opacity":"0"
		});
	});
	biz_monitor_render($("#biz_monitor_div_inner1"),1);
	biz_monitor_render($("#biz_monitor_div_inner2"),2);
	biz_monitor_render($("#biz_monitor_div_inner3"),3);

	var i = 2;

	el_biz_monitor_div.everyTime(5000 ,function (){
		if (!biz_flag)
		{
			return false;
		}
		if (i%3 == 1)
		{
			$("#biz_monitor_div_inner3").children().css({
				"transform": "rotateX(90deg)",
				"opacity":"0"
			});
			$("#biz_monitor_div_inner1").oneTime(1000 ,function (){
				$("#biz_monitor_div_inner1").children().css({
					"transform": "rotateX(0deg)",
					"opacity":"1"
				});
			});	
		}
		if (i%3 == 2)
		{
			$("#biz_monitor_div_inner1").children().css({
				"transform": "rotateX(90deg)",
				"opacity":"0"
			});
			$("#biz_monitor_div_inner2").oneTime(1000 ,function (){
				$("#biz_monitor_div_inner2").children().css({
					"transform": "rotateX(0deg)",
					"opacity":"1"
				});
			});

		}
		if (i%3 == 0)
		{
			$("#biz_monitor_div_inner2").children().css({
				"transform": "rotateX(90deg)",
				"opacity":"0"
			});
			$("#biz_monitor_div_inner3").oneTime(1000 ,function (){
				$("#biz_monitor_div_inner3").children().css({
					"transform": "rotateX(0deg)",
					"opacity":"1"
				});
			});
		}
		i++;	
	});
}

function el_page_biz2_init(){
	title_layout(el_page_biz2);
	biz_layout($("#biz_monitor_div2"));
	biz_monitor_render($("#biz_monitor_div2"),2);
}

function el_page_biz3_init(){
	title_layout(el_page_biz3);
	biz_layout($("#biz_monitor_div3"));
	biz_monitor_render($("#biz_monitor_div3"),3);
}

function biz_layout(el)
{
	// 获取页面高度
	var windowHeight = $(window).height()*0.85;

	var unit_width = windowHeight*0.32*1.15;
	var unit_height = windowHeight*0.32;

	el.find("[class=beehive]").css("width" ,unit_width + "px");
	el.find("[class=beehive]").css("height" ,unit_height + "px");

	el.css("left" ,"0px");
	el.css("width" ,unit_width * 5);

	el.find("[class*=list]").each(function (i){
		$(this).css("top" , "-" + (i+1)*windowHeight*0.16 + "px");
	});
	el.find("[class*=distance]").addClass("dib");
	el.find("[class*=distance]").css("width" ,unit_width*0.5+"px");
	el.find("[class*=distance]").css("height" ,"1px");

	var start = parseInt($("#startBeehive").offset().left);
	var end = parseInt($("#endBeehive").offset().left);


	var beehiveWidth = (end - start) + unit_width;
	var leftWidth = (el.parent().width() - beehiveWidth)/2;
	el.css("left" ,(leftWidth - start) + "px");
}

function biz_monitor_render(el,pageNum)
{
	el.find("[class=beehive]").html("");
	um_ajax_get({
		url : "appMonitor/queryAppSystemPFNum",
		paramObj : {orderBy:'ttt.appmon_name'},
		isLoad : false,
		successCallBack : function (data){
			var tmp;
			var start = (pageNum-1)*9;
			var end = (pageNum)*9;
			for (var i = start; i < end; i++){
				if(!!data[i]){
					in_render(el.find("[class=beehive]").eq(i%9) ,data[i],i);
				}
			}
			el.find("[verticalMiddle]").each(function (){
				setLineHeightMiddle($(this));
			});
		}
	});
}
function getAppMonitorBGI(data){
	if(data.appName.indexOf("AD")!=-1){
		return "/img/appsys/ADyu.svg";
	}else if(data.appName.indexOf("OA")!=-1){
		return "/img/appsys/OA.svg";
	}else if(data.appName.indexOf("主机审计")!=-1){
		return "/img/appsys/zhujishenji.svg";
	}else if(data.appName.indexOf("公文交换箱")!=-1){
		return "/img/appsys/gongwenjiaohuanxiang.svg";
	}else if(data.appName.indexOf("内网门户")!=-1){
		return "/img/appsys/neiwangmenhu.svg";
	}else if(data.appName.indexOf("军贸管理信息平台")!=-1){
		return "/img/appsys/junmaoguanlixinxipingtai.svg";
	}else if(data.appName.indexOf("军贸门户")!=-1){
		return "/img/appsys/junmaomenhu.svg";
	}else if(data.appName.indexOf("出口自律系统")!=-1){
		return "/img/appsys/chukouzilv.svg";
	}else if(data.appName.indexOf("刻录")!=-1 && data.appName.indexOf("打印")!=-1){
		return "/img/appsys/keludayinji.svg";
	}else if(data.appName.indexOf("安全邮件")!=-1){
		return "/img/appsys/anquanyoujian.svg";
	}else if(data.appName.indexOf("总部BI")!=-1){
		return "/img/appsys/zongbuBI.svg";
	}else if(data.appName.indexOf("总部ERP")!=-1){
		return "/img/appsys/zongbuERP.svg";
	}else if(data.appName.indexOf("护照查询系统")!=-1){
		return "/img/appsys/huzhaochaxun.svg";
	}else if(data.appName.indexOf("政审系统")!=-1){
		return "/img/appsys/zhengshen.svg";
	}else if(data.appName.indexOf("数字档案系统")!=-1){
		return "/img/appsys/shuzidangan.svg";
	}else if(data.appName.indexOf("物流管理系统")!=-1){
		return "/img/appsys/wuliuguanli.svg";
	}else if(data.appName.indexOf("督办系统")!=-1){
		return "/img/appsys/duban.svg";
	}else if(data.appName.indexOf("科技专家系统")!=-1){
		return "/img/appsys/kejizhuanjiaxitong.svg";
	}else if(data.appName.indexOf("管理报告平台")!=-1){
		return "/img/appsys/guanlibaogaopingtai.svg";
	}else if(data.appName.indexOf("综合数据报送系统")!=-1){
		return "/img/appsys/zongheshujubaosong.svg";
	}else if(data.appName.indexOf("网上报销系统")!=-1){
		return "/img/appsys/wangshangbaoxiao.svg";
	}else if(data.appName.indexOf("营销资料系统")!=-1){
		return "/img/appsys/yingxiaoziliao.svg";
	}else if(data.appName.indexOf("证书发布")!=-1){
		return "/img/appsys/zhengshufabu.svg";
	}else if(data.appName.indexOf("身份认证系统")!=-1){
		return "/img/appsys/shenfenrenzheng.svg";
	}else if(data.appName.indexOf("预算管理系统")!=-1){
		return "/img/appsys/yusuanguanli.svg";
	}else if(data.appName.indexOf("防火墙日志服务")!=-1){
		return "/img/appsys/fanghuoqiangrizhifuwu.svg";
	}
}
function in_render(beehiveEl ,data ,index)
	{
		var el_title = $('<div class="pabs title" verticalMiddle></div>');
		var bgi = getAppMonitorBGI(data);
		var el_icon = $('<div class="pabs" style="left:0;top:23%;height:26%;width:100%;"><div class="w-all h-all appmonitor tt" style="background-image:url('+bgi+');margin:0 auto;"></div></div>');
		var currentStatus = "";
		var color = "green";
		if(data.appStatus=="2"){
			currentStatus = "正常";
			color = "green";
		}else if(data.appStatus=="1"){
			currentStatus = "性能";
			color = "yellow";
		}else if(data.appStatus=='0'){
			currentStatus = "故障";
			color = "red";
		}else {
			currentStatus = "未知";
			color = "gray";
		}
		var el_runtime = $('<div class="pabs runtime">当前是'+currentStatus+'状态</div>');
		var el_event = $('<div class="pabs event" verticalInner></div>');
		if (data.appName.length > 6)
		{
			// el_title.css("font-size" ,"0.7em");
			// el_title.css("-webkit-transform" ,"0.8");
		}
		el_title.html(data.appName);

		//el_event.html("故障："+data.faultEventNum+"<br />性能："+data.performEventNum);
		beehiveEl.html("");
		beehiveEl.append(el_title);
		beehiveEl.append(el_icon);
		beehiveEl.append(el_runtime);
		beehiveEl.append(el_event);

		el_event.append('<div></div>');
		el_event.find("div").append('<span class="faultIcon" style="line-height:normal;height:auto;background-position:0 0.3em;">'+data.faultEventNum+'</span></br>');
		el_event.find("div").append('<span class="sjx" style="line-height:normal;height:auto;background-position:0 0.3em;">'+data.performEventNum+'</span>');

		el_icon.find("div").width(el_icon.height());

		setVerticalMiddle(beehiveEl);
	}
//------------------------------------------------//
function el_page_overall_init(){
	title_layout(el_page_overall);
	setVerticalMiddle(el_page_overall);
	overall_environment_render();
	getRequestNumGroupByDate();
	getUserRequestStatus();
	getMonitorClassDstatus();
	getRequestStatus();
	getFaultDistributionByType();
	eventCenterDivInit();
}
function eventCenterDivInit(){
	um_ajax_get({
		url : "bigscreen/getBigScreenFaultMonitor",
		isLoad :false,
		successCallBack : function (data){
					var dataArray = data;
					console.log(data);
					// dataArray.sort(function (a,b){
					// 	return (new Date(b.updateDate).getTime())-(new Date(a.updateDate).getTime());
					// });
					var el = $('[data-id="center_div"]');
					el.empty();
					var parentIndex;
					var parentEl;
					var totalHeight=0;
					for(var i=0;i<dataArray.length;i++){
						if(dataArray.length<=i){
							break;
						}
						var rsName = dataArray[i].responsibleName?dataArray[i].responsibleName:"无人负责";
						var index = parseInt(i/2);
						if(parentIndex!==index){
							parentIndex = index;
							parentEl = $('<div data-id="centerContentParent" class="animated fadeInLeft" style="height:25%;width:100%;padding-bottom:0.5em;" data-type="col"></div>');
							el.append(parentEl);
							totalHeight += 25;
						}
						parentEl.append('<div class="l asset-duty '+dataArray[i].monitorType+'" style="">'+
	    							'<span class="db detail">'+dataArray[i].monitor_name+'</span>'+
	    							'<span class="db info" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">'+dataArray[i].updateDate.substring(0,10)+' '+rsName+'</span>'+
	    						'</div>');
					}
					el.stopTime();
					if(totalHeight>100){
						el.everyTime(5000 ,function (){
							el.animate({
								marginTop: "-" + el.find("div:first").css("height")
							},  
							500,
							function() {  
								$(this).css({  
									marginTop: "0px"  
								}).find("div:first").appendTo(this);  
							});
						})
					}
					
				}
	});
}
function getFaultDistributionByType(){
	$('#normal_div').html("");
	$('#warn_div').html("");
	$('#error_div').html("");
	$('#unusual_div').html("");

	$("#normal_div").width($("#normal_div").height());
	$("#warn_div").width($("#warn_div").height());
	$("#error_div").width($("#error_div").height());
	$("#unusual_div").width($("#unusual_div").height());

	um_ajax_get({
		url : "monitordisply/TechnicalSupervision/getFaultDistributionByType",
		isLoad : false,
		successCallBack : function (data){

			var normalBar = new progressbar.Circle('#normal_div', {
						strokeWidth: 5,
						color: '#62cb31',
						fill: 'rgba(255, 255, 255, 0.02)',
					});
			normalBar.setText('0%');
			var warnBar = new progressbar.Circle('#warn_div', {
						strokeWidth: 5,
						color: '#ffb606',
						fill: 'rgba(255, 255, 255, 0.02)',
					});
			warnBar.setText('0%');
			var errorBar = new progressbar.Circle('#error_div', {
						strokeWidth: 5,
						color: '#e74c3c',
						fill: 'rgba(255, 255, 255, 0.02)',
					});
			errorBar.setText('0%');
			var unusualBar = new progressbar.Circle('#unusual_div', {
						strokeWidth: 5,
						color: '#1c789f',
						fill: 'rgba(255, 255, 255, 0.02)',
					});
			unusualBar.setText('0%');
			var map = new HashMap();
			for(var i=0;i<data.length;i++)
			{
				map.put(data[i].distributionId , data[i]);
			}

			render(normalBar ,map.get("0") ,$("#normal_num"));
			render(errorBar ,map.get("4") ,$("#error_num"));
			render(warnBar ,map.get("3") ,$("#warn_num"));
			render(unusualBar ,map.get("2") ,$("#unusualBar_num"));

			processBarArray.push(normalBar);
			processBarArray.push(errorBar);
			processBarArray.push(warnBar);
			processBarArray.push(unusualBar);

			function render(elBar ,obj ,el_num)
			{
				if (!obj)
				{
					return false;
				}
				elBar.animate(obj.distributionPercent/100, {
					duration: 800
				}, function() {
					elBar.setText(obj.distributionPercent + "%");
					el_num.html(obj.distributionCount + "台");
				});
			}
		}
	});
}

// 环境
function overall_environment_render()
{
	$("[data-flag=overall_icon]").each(function (){
		$(this).height($(this).parent().width());
	});
	setVerticalMiddle($("#overall_environment_div"));
}

// 请求趋势
function request_trend_render()
{
	var series = [
			        {
			            name:'邮件营销',
			            type:'line',
			            areaStyle: {normal: {}},
			            data:[120, 132, 101, 134, 90, 230, 210]
			        }
			    ]
	var chart = plot.lineRender($("#request_trend_div") ,{
		hideYaxis : true,
		category : ['11/23' ,'11/24' ,'11/25' ,'11/26' ,'11/27' ,'11/28' ,'11/29'],
		series : series,
		color_array : ['#ffd878'],
		grid: {
			        left: '0',
			        top: '5%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
		hideAnimation : false,
		resizeFlag : true,
		xAxisLabelColor : "#ffd878"
	});
	chartArray.push(chart);
}
//监控器健康情况
// function (){
// 	um_ajax_get({
// 		url : "bigscreen/***",
// 		isLoad : false,
// 		successCallBack : function (data){

// 		}
// 	});
// }
//异常迹象积压情况 
function getUserRequestStatus(){
	um_ajax_get({
		url : "bigscreen/getUserRequestStatus",
		paramObj : {inList : Local_inList},
		isLoad : false,
		successCallBack : function (data){
			var el = $("#userRequestStatusDiv");
			el.empty();
			for(var i=0;i<data.length;i++){
				var ul = $('<div class="w-all situ" style="padding-top:0.2em;" data-type="col">'
								+'<span>'+data[i].fullName+'</span>'
	            				+'<ul class="table-cell">'
	            					+'<li class="circle-green" style="text-align:center;color:black;">'+data[i].lowtimenum+'</li>'
	            					+'<li class="circle-yellow" style="text-align:center;color:black;">'+data[i].hightimenum+'</li>'
	            					+'<li class="circle-red" style="text-align:center;color:black;">'+data[i].longtimenum+'</li>'
	            					+'<li class="circle-autherror" style="text-align:center;color:black;">'+data[i].outtimenum+'</li>'
	            				+'</ul>'
	            			+'</div>');
	            el.append(ul);
			}
			setVerticalMiddle(el);
		}
	});
}
function getRequestStatus(){
	um_ajax_get({
		url : "bigscreen/getRequestStatus",
		isLoad : false,
		successCallBack : function (data){
			$("#waitting").html(data[0].waitprogress);
			$("#processing").html(data[0].inporgress);
			$("#done").html(data[0].requestclose);
		}
	});
}
function getRequestNumGroupByDate(){
	um_ajax_get({
		url : "bigscreen/getRequestNumGroupByDate",
		isLoad : false,
		successCallBack : function (data){
			var dataArray = [];
			var dateArray = [];
			for(var i=0;i<data.length;i++){
				dataArray.push(data[i].num);
				dateArray.push(data[i].dates1);
			}
			var series = [
			{
				name:'请求趋势',
				type:'line',
				areaStyle: {normal: {}},
				data:dataArray
			}
			]
			var chart = plot.lineRender($("#request_trend_div") ,{
				hideYaxis : true,
				category : dateArray,
				series : series,
				color_array : ['#ffd878'],
				grid: {
					left: '0',
					top: '5%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxisLabelColor : "#ffd878"
			});
			chartArray.push(chart);
		}
	});
}
function getMonitorClassDstatus(){
	um_ajax_get({
		url : "bigscreen/getMonitorClassDstatus",
		isLoad : false,
		successCallBack : function (data){
			var el = $("#monitorClassDstatus").find("[data-id=inner_div]");
			data.sort(function (a,b){
				return a.mcSort - b.mcSort;
			});
			el.empty();
			var monitorClassName;
			var tempEl;
			var tempElCountHeight = 0;
			for(var i=0;i<data.length;i++){
				if(monitorClassName!=data[i].monitorClassName)
				{
					monitorClassName=data[i].monitorClassName;
					var div = '<div class="circle-count clearfix">'+
	            				'<span>'+monitorClassName+'</span>'+
	            				'<ul>'+
	            				'</ul>'+
	            			'</div>';
	            	tempEl = $(div);
	            	el.append(tempEl);
	            	var monitorDstatus = data[i].monitorDstatus;
	            	if(monitorDstatus==0){
	            		tempEl.find('ul').append('<li class="circle-green"></li>');
	            	}else if(monitorDstatus==3){
	            		tempEl.find('ul').append('<li class="circle-yellow"></li>');
	            	}else if(monitorDstatus==4){
	            		tempEl.find('ul').append('<li class="circle-red"></li>');
	            	}else if(monitorDstatus==2){
	            		tempEl.find('ul').append('<li class="circle-autherror"></li>');
	            	}else if(monitorDstatus==1){
	            		tempEl.find('ul').append('<li class="circle-gray"></li>');
	            	}
				}else
				{
					var monitorDstatus = data[i].monitorDstatus;
	            	if(monitorDstatus==0){
	            		tempEl.find('ul').append('<li class="circle-green"></li>');
	            	}else if(monitorDstatus==3){
	            		tempEl.find('ul').append('<li class="circle-yellow"></li>');
	            	}else if(monitorDstatus==4){
	            		tempEl.find('ul').append('<li class="circle-red"></li>');
	            	}else if(monitorDstatus==2){
	            		tempEl.find('ul').append('<li class="circle-autherror"></li>');
	            	}else if(monitorDstatus==1){
	            		tempEl.find('ul').append('<li class="circle-gray"></li>');
	            	}
				}
			}

			el.find("div").each(function (){
				tempElCountHeight += $(this).height() + parseInt($(this).css("margin-bottom"));
			});
			el.stopTime();
			if (tempElCountHeight > el.height())
			{	
				console.log(1);
				el.everyTime(2000 ,function (){
					el.animate({
			        	marginTop: "-" + el.find("div:first").css("height")
				    },  
				    500,  
				    function() {  
				        $(this).css({  
				            marginTop: "0px"  
				        }).find("div:first").appendTo(this);  
				    });
				})
			}

			// el.parent().stopTime();
			// 		if(tempElCountHeight > el.height()){
			// 			el.parent().everyTime(5000 ,function (){
			// 				el.toggleClass("tran5");
			// 				el.css("marginTop" ,"-" + el.find("div:first").css("height"));
			// 				el.oneTime(550 ,function (){
			// 					el.toggleClass("tran5");
			// 					el.css({  
			// 						marginTop: "0px"  
			// 					}).find("div:first").appendTo(this); 
			// 				})
			// 			})
			// 		}
		}
	});
}

//------------------------------------------------//
// ---------------》》全局公用---------------------- //

// 故障的设备获取
function dataMain_asset_get(el)
{
	um_ajax_get({
		url : "bigscreen/getDataCenterMonitorFaultEvent",
		isLoad : false,
		successCallBack : function (data){
			fault_asset_render(el ,data)
		}
	});
}
function netMain_asset_get(el)
{
	um_ajax_get({
		url : "bigscreen/getNetMonitorFaultEvent",
		isLoad : false,
		successCallBack : function (data){
			fault_asset_render(el ,data);
		}
	});
}
// 故障的设备渲染
function fault_asset_render(el ,data)
{
	var el_inner_div = el.find("[data-id=inner_div]:visible");
	el_inner_div.html("");
	el.find("[data-type=col]").remove();
	if (!data || data.length == 0)
	{
		renderEmptyTip(el_inner_div);
		return false;
	}
	var length = (data.length > 10 ? 10 : data.length);
	var length = data.length;
	var osTypeName;
	var responsibleName = "";
	var responsiblePhone = "";
	var totalRowHeight = 0;
	var totalBuffer = [];
	for (var i = 0; i < length; i++) {
		responsibleName = "";
		responsiblePhone = "";
		var buffer = [];
		osTypeName = data[i].monitorType;
		if (osTypeName == "未定义")
		{
			osTypeName = "undefined";
		}
		if (data[i].responsibleName)
		{
			responsibleName = data[i].responsibleName.split(",")[0];
			if (data[i].responsibleMobilePhone)
			{
				responsiblePhone = data[i].responsibleMobilePhone.split(",")[0];
				responsibleName = responsibleName + " | " + responsiblePhone;
			}
		}
		else
		{
			responsibleName = "暂无责任人";
		}
		var nameArray = [];
		if(data[i].responsibleName)
			nameArray = data[i].responsibleName.split(",");
		var phoneArray = [];
		if(data[i].responsibleMobilePhone)
			phoneArray = data[i].responsibleMobilePhone.split(",");
		var rowHeight = 17.5;
		if(nameArray.length>1){
			rowHeight = 10 * nameArray.length;
		}
		totalRowHeight += rowHeight;
		var bgi = getMonitorBGI(data[i]);
		buffer.push('<ul class="table-ul animated fadeInLeft" style="height:'+rowHeight+'%" data-type="col">');
		buffer.push('<li style="width:7%;padding-left:1em">');
		buffer.push('<div class="bg-test" style="background-image:url('+bgi+');">&nbsp;</div>');
		buffer.push('</li>');
		buffer.push('<li class="tl long-text" style="width:23%;color:#ccc;" verticalMiddle>'+data[i].edName+'</li>');
		buffer.push('<li verticalInner style="width:20%;"><div class="w-all long-text" style="padding: 0.1em 0;background-color:#f86e01;color:#000">');
		buffer.push(data[i].faultName);
		buffer.push('</div></li>');
		buffer.push('<li style="width:7%">&nbsp;</li>');
		if(nameArray.length>0){
			buffer.push('<li style="width:27%;display:inline-block;display: -webkit-flex; display: flex; -webkit-align-items: center; align-items: center; -webkit-justify-content: center; justify-content: center;">');
			buffer.push('<div style="padding:0.1em;display:inline-table;width:100%;border-spacing:0px 1px;">');
			for(var j=0;j<nameArray.length;j++){
				// if(phoneArray[j]&&phoneArray[j]!=" "&&phoneArray[j]!="null"){
				// 	nameArray[j] = nameArray[j] + ' | ' +　phoneArray[j];
				// }
				buffer.push('<div class="w-all" style="padding: 0.1em 0;background-color:#1c789f;color:#99e3ff;margin-bottom:0.1em;display:table-row;">');
				buffer.push('<div style="display:table-cell;vertical-align:middle;">')
				buffer.push('<span class="col-lg-5 long-text" style="padding:0px;text-align:left;padding-left:1em;">');
				buffer.push(nameArray[j]);
				buffer.push('</span>')
				buffer.push('<span class="col-lg-1 long-text" style="padding:0px;text-align:left;">');
				buffer.push('|');
				buffer.push('</span>')
				buffer.push('<span class="col-lg-6 long-text" style="padding:0px;text-align:left;padding-right:1em;">');
				buffer.push(phoneArray[j]);
				buffer.push('</span>')
				buffer.push('</div>')
				buffer.push('</div>');
			}
			buffer.push('</div>');
			buffer.push('</li>');
		}else {
			buffer.push('<li verticalInner style="width:27%;display:inline-block;">');
			buffer.push('<div class="w-all" style="padding: 0.1em 0;background-color:#1c789f;color:#99e3ff">');
			buffer.push(responsibleName);
			buffer.push('</div>');
			buffer.push('</li>');
		}
		buffer.push('<li style="width:16%;color:#ccc" verticalMiddle>'+data[i].faultCount+'</li>');
		buffer.push('</ul>');
		el_inner_div.append(buffer.join(""));
	}
	el_inner_div.stopTime();
	if(totalRowHeight>90){
		el_inner_div.everyTime(2000 ,function (){
			el_inner_div.animate({
	        	marginTop: "-" + el_inner_div.find("ul:first").css("height")
		    },  
		    500,  
		    function() {  
		        $(this).css({  
		            marginTop: "0px"  
		        }).find("ul:first").appendTo(this);  
		    });
		})
	}

	setVerticalMiddle(el);
}

// 资产top显示
function data_asset_render(el,data,fields,suffix)
{
	if (!data || data.length == 0)
	{
		return false;
	}
	el.find("[data-type=col]").remove();
	var length = (data.length > 5 ? 5 : data.length);
	for (var i = 0; i < length; i++)
	{
		var tempDate = data[i];
		var barWidth = 0;
		if(fields[0]&&fields[0]!='null')
			barWidth = tempDate[fields[0]];
		var bgi = getMonitorBGI(data[i]);
		var color;
		var status = data[i].monitorDstatus;
		if(status=='0'){
			color = '#62cb31';
		}else if(status=='1'){
			color = '#fff';
		}else if(status=='3'){
			color = '#ffb606';
		}else if(status=='4'){
			color = '#e74c3c';
		}else {
			color = '#fff';
		}
		var buffer = [];
		buffer.push('<ul class="table-ul animated fadeInRight prel" style="height:17.5%" data-type="col">');
		buffer.push('<li style="width:70%;padding:0 0 0 1em" verticalMiddle verticalInner>');
		buffer.push('<div class="w-all tl prel asset-and-icon" style="color:'+color+';"><i style="background-image:url('+bgi+');"></i>'+data[i].monitorName+'</div>');
		buffer.push('</li>');

		for(var j=0;j<fields.length;j++){
			if(j>=2){
				continue;
			}
			if(j==0){
				buffer.push('<li style="width:10%" verticalMiddle>'+tempDate[fields[j]]+suffix[j]+'</li>');
			}else if(j==1){
				buffer.push('<li style="width:20%" verticalMiddle>'+tempDate[fields[j]]+suffix[j]+'</li>');
			}
		}
		buffer.push('<div class="pabs" style="left: 1em; top: 0.5em;bottom: 0.5em;right: 1em; z-index: -1;">');
		buffer.push('<div class="w-all h-all" style="width: '+barWidth+'%;background-color: rgba(255,255,255,0.08);border-radius: 5px;"></div>');
		buffer.push('</div>');
		buffer.push('</ul>');
		el.append(buffer.join(""));
	}
	setVerticalMiddle(el);
}

function setVerticalMiddle(el)
{
	el.find("[verticalMiddle]").each(function (){
		setLineHeightMiddle($(this));
	});
	el.find("[verticalInner]").each(function (){
		var el_li_height = parseInt($(this).css("height"));
		var el_inner_div = $(this).find("div").eq(0);
		var el_inner_div_height = parseInt(el_inner_div.css("height"));
		$(this).css("padding-top" ,(el_li_height-el_inner_div_height)/2 + "px");
	});
}

function getMonitorBGI(data){
	var status = data.monitorDstatus;
	var color;
	if(status=='0'){
		color = 'green';
	}else if(status=='1'){
		color = 'white';
	}else if(status=='3'){
		color = 'yellow';
	}else if(status=='4'){
		color = 'red';
	}else {
		color = 'white';
	}
	var bgi = '/img/assetmonitor/'+ color + '/' + data.monitorType + '.png';
	return bgi;
}

function renderEmptyTip(el)
{
	el.append('<div class="w-all h-all prel" style="top:-15%" verticalInner><div class="tc" style="color:#62cb31;font-size:2em">正常</div><div class="tc" style="color:#686868">当前系统没有故障</div></div>');
	setVerticalMiddle(el);
}
// ---------------全局公用《《---------------------- //


function requestFullScreen(element) {
    // 判断各种浏览器，找到正确的方法
    var requestMethod = element.requestFullScreen || //W3C
    element.webkitRequestFullScreen ||    //Chrome等
    element.mozRequestFullScreen || //FireFox
    element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}


});
});