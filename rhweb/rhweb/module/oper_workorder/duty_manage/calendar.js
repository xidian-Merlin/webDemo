$(document).ready(function (){

$("#mask").hide();

var user_list_url = "attendancedetail/queryAllUser";

// 值班表展示
var duty_event_list_url = "attendancedetail/queryAttendanceDetail";

// 添加值班
var duty_event_add_url = "attendancedetail/addAttendanceDetailUser";

// 删除值班
var duty_event_del_url = "attendancedetail/delAttendanceDetailUser";

var current_event_list = [];

var current_msg_template_map = new HashMap();

var current_date;

view_init();

event_init();

user_list();

duty_event_list(moment().subtract(1, "M").toDate(),
				moment().add(1, 'M').toDate());


function view_init()
{
	calendar_init([]);
	$("#external-events").data("array" ,[]);
}

function event_init()
{
	$("#smsTempId").change(function (){
		var obj =  current_msg_template_map.get($(this).val());
		if (obj)
		{
			$("#adTime").val(obj.advanceTime);
			$("#adContent").val(obj.templateInfo);
		}
	});

	$("#msg_btn").click(function (){
		var current_date = $('#calendar').data("tdEl").attr("data-date");
		var time = $("#adTime").val();
		var compareTime = moment().add(time,"hours").format("YYYY-MM-DD HH:mm:ss"); 
		if(isNaN(time) || time.indexOf("0") == 0 || time.indexOf(".") > -1 || time < 0)
		{
			$("#alarm1").show();
			$("#alarm").hide();
		}
		else
		{
			$("#alarm1").hide();	
			if(moment(current_date).isBefore (compareTime))
			{
				$("#alarm").show();
			}
			else
			{
				$("#alarm").hide();
				msg_template_edit(function (obj){
					var tdEl = $('#calendar').data("tdEl");
					tdEl.data("msgTemplate" ,obj);
					tdEl.addClass("prel");
					tdEl.find("div[tip]").remove();
					tdEl.append('<div class="pabs" tip style="right:6px;bottom:6px"><i class="icon-calendar-empty"></i></div>');
					$.fancybox.close();
				});
			}
		}
	});
}

function user_list()
{
	$.ajax({
		async: true,
		type: "get",
		url: index_web_app + user_list_url,
		dataType: "json",
		data: {},
		timeout : 60000,
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
			var userList = data.resultObj;
			for (var i = 0; i < userList.length; i++) {
				$("#external-events").append('<div class="fc-event animated fadeInRight" data-id="'+userList[i].userId+'">'+userList[i].userName+'</div>');
				$('#external-events .fc-event').each(function(i) {

					// store data so the calendar knows to render an event upon drop
					$(this).data('event', {
						title: $.trim($(this).text()), // use the element's text as the event title
						stick: true,
						userId:$(this).attr("data-id")
					});

					// make the event draggable using jQuery UI
					$(this).draggable({
						zIndex: 999,
						revert: true,
						revertDuration: 0,
						stop: function (event ,ui){
							current_event_list = $("#calendar").fullCalendar("clientEvents");
						}
					});

				});
			}
		}
	});
}

function duty_event_list(startDate ,endDate)
{
	$("#mask").show();
	var startDateStr = getDateStr(startDate ,"YYYY-MM-DD");
	var endDateStr = getDateStr(endDate ,"YYYY-MM-DD");
	$.ajax({
		async: true,
		type: "get",
		url: index_web_app + duty_event_list_url,
		dataType: "json",
		data: {param:JsonTools.encode({start:startDateStr ,end:endDateStr})},
		timeout : 60000,
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
			var userList = data.resultObj;
			var events = [];
			var list = [];
			$("#calendar").fullCalendar("removeEvents");
			for (var i = 0; i < userList.length; i++) {
				list = userList[i].users.split(",");
				for (var j = 0; j < list.length; j++)
				{
					events.push({
						title : list[j].split("|")[1],
						start: userList[i].date,
						userId:list[j].split("|")[0]
					});
				}
				if(userList[i].desc)
				{
					var tdEl = $("[class=fc-bg]").find("[data-date="+userList[i].date+"]");
					tdEl.data("msgTemplate" ,userList[i].desc);
					tdEl.addClass("prel");
					tdEl.find("div[tip]").remove();
					tdEl.append('<div class="pabs" tip style="right:6px;bottom:6px"><i class="icon-calendar-empty"></i></div>');
				}
			}
			$("#calendar").fullCalendar("addEventSource", events);
			$("#mask").hide();
		}
	});
}

function duty_event_add(obj ,el ,calEvent)
{
	$.ajax({
		async: true,
		type: "get",
		url: index_web_app + duty_event_add_url,
		dataType: "json",
		data: {param:JsonTools.encode(obj)},
		timeout : 60000,
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
			if(data.resultCode == 1)
			{
				$('#calendar').fullCalendar('removeEvents' ,[calEvent._id]);
				el.remove();
			}
		}
	});
}

function duty_event_delete(obj)
{
	$.ajax({
		async: true,
		type: "get",
		url: index_web_app + duty_event_del_url,
		dataType: "json",
		data: {param:JsonTools.encode(obj)},
		timeout : 60000,
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
			// 如果该天没有值班人员了，则删除右下角图标
		}
	});
}

function calendar_init(events)
{
	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		},
		selectable: true,
		selectHelper: true,
		select: function(start, end) {
		},
		dayRender:function (a ,tdEl ,c){
			tdEl.addClass("prel");
			var iEl = $('<div class="pabs" style="left:6px;bottom:6px;opacity:0"><i class="icon-edit-sign"></i></div>');
			tdEl.append(iEl);
			// tdEl.mouseover(function (){
			// 	iEl.css("opacity" ,1);
			// }).mouseout(function (){
			// 	iEl.css("opacity" ,0);
			// });
			iEl.click(function (e){
				if (tdEl.attr("color"))
				{
					tdEl.removeAttr("color");
					tdEl.css("background-color" ,"rgba(255, 255, 255 ,0)");
					return false;
				}
				var data = $("#spectrum").val();
				tdEl.attr("color" ,"color");
				if (String(data) == "rgb(255, 255, 255)")
		   		{
		   			data = "rgba(255, 255, 255 ,0)";
		   		}

		   		data = data.substr(0 ,3) + "a" + data.substr(3 ,data.length);

		   		data = data.replace(")" ,",0.2)");

				tdEl.css("background-color" ,data);
				return false;
			});
			
		},
		dayClick: function (dayDate, allDay, jsEvent, view){
			$('#calendar').data("tdEl" ,this);
			current_date = moment(dayDate._d).format('YYYY-MM-DD');
			var flag = false;
			var array;
			var buffer = [];
			$('#calendar').fullCalendar('clientEvents',function (e){
				buffer = [];
				array = e._start._i.split("-");
				for (var i = 0; i < array.length; i++) {
					buffer.push((array[i].length == 1 ? ("0" + array[i]) : array[i]));
				}
				if (buffer.join("-") == current_date)
				{
					flag  = true;
				}
			});

			if (!flag)
			{
				return false;
			}
			$("#adTime").val("");
			$("#smsTempId").val("-1");
			$("#adContent").val("");
			$("#adDesc").val("");
			$("#alarm").hide();
			$("#alarm1").hide();
			if (this.find("[class=icon-calendar-empty]").size() > 0)
			{
				var data = this.data("msgTemplate").split("|");
				$("#smsTempId").val(data[4]);
				$("#adTime").val(data[3]);
				$("#adContent").val(data[2]);
				$("#adDesc").val(data[0]);
			}
			$.fancybox( $("#msg_template"), {
			    title : '发送短信通知',
			    afterShow : function (){
			    	getMsgTemplate();
			    }
			});
		},
		eventClick: function (calEvent, jsEvent, view){
			$('#calendar').fullCalendar('removeEvents' ,[calEvent._id]);
			var obj = new Object();
			obj.adUser = calEvent.userId;
			obj.adDate = calEvent._start._i;
			duty_event_delete(obj);
		},
		eventRender: function(calEvent, element, view){
			$(view).remove();
			if(!calEvent._start._i)
			{
				var obj = new Object();
				obj.adUser = calEvent.userId;
				var date = getDateStr(calEvent._start._d ,"YYYY-MM-DD");
				obj.adDate = date;
				calEvent._start._i = date;
				duty_event_add(obj ,element ,calEvent);
			}
		},
		viewRender : function (view){
			duty_event_list(view.start._d ,view.end._d);
		},
		editable: false,
		droppable: true,
		eventLimit: true, // allow "more" link when too many events
		events: events
	});

	$("[class*=fc-toolbar]").addClass("prel");

	//$("[class*=fc-toolbar]").append('<div class="p-panel" id="right-panel" style="top: 5px;right: 130px;"><input type="text" id="spectrum" /></div>');

	// $("#spectrum").spectrum({
	//     showPaletteOnly: true,
	//     togglePaletteOnly: true,
	//     togglePaletteMoreText: '',
	//     togglePaletteLessText: 'less',
	//     color: 'blanchedalmond',
	//     palette: [
	//         ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
	//         ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
	//         ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
	//         ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
	//         ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
	//         ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
	//         ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
	//         ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
	//     ],
	//    	onColorPick : function (data){
	//    		// if (String(data) == "rgb(255, 255, 255)")
	//    		// {
	//    		// 	data = "rgba(255, 255, 255 ,0)";
	//    		// }
	//    		// $('#calendar').data("tdEl") && $('#calendar').data("tdEl").css("background-color" ,data);
	//    	}
	// });
}

function getDateStr(date ,type)
{
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (type == "YYYY-MM")
	{
		return year + "-" + month;
	}
	if (type == "YYYY-MM-DD")
	{
		return year + "-" + month + "-" + day;
	}
}

function getMsgTemplate()
{
	$.ajax({
		async: true,
		type: "get",
		url: index_web_app + "smstemplate/queryData",
		dataType: "json",
		data: {param:JsonTools.encode({})},
		timeout : 60000,
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
			$("#smsTempId").html("");
			$("#smsTempId").append('<option value="-1">---</option>');
			data = data.resultObj;
			for (var i = 0; i < data.length; i++) {
				current_msg_template_map.put(data[i].templateId ,data[i]);
				$("#smsTempId").append('<option value="'+data[i].templateId+'">'+data[i].templateName+'</option>');
			}
		}
	});
}

function msg_template_edit(cbf)
{
	var obj = new Object();
	obj.adTime = $("#adTime").val();
	obj.adDate = current_date;
	obj.smsTempId = $("#smsTempId").val();
	obj.adContent = $("#adContent").val();
	obj.adDesc = $("#adDesc").val();
	var objStr = obj.adDesc + "|" + "null" + "|" + obj.adContent + "|" + obj.adTime + "|" + obj.smsTempId;

	$.ajax({
		async: true,
		type: "post",
		url: index_web_app + "attendancedetail/addAttendanceDetailDesc",
		dataType: "json",
		data: {param:JsonTools.encode(obj)},
		timeout : 60000,
		xhrFields: {
			withCredentials: true
		},
		success: function (data){
				"123|null|请回短信1|2|23"
			cbf && cbf(objStr);
		}
	});
}

});