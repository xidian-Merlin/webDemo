$(document).ready(function (){

var week_map = new HashMap();
week_map.put("2" ,"星期一");
week_map.put("3" ,"星期二");
week_map.put("4" ,"星期三");
week_map.put("5" ,"星期四");
week_map.put("6" ,"星期五");
week_map.put("7" ,"星期六");
week_map.put("1" ,"星期日");

var index_list_url = "AttendanceBulletin/queryAttendanceBulletin";

var index_list_col_header = [
							  {text:'公告标题',name:"title" ,searchRender:function (el){
							  	el.append('<input class="form-control input-sm" search-data="title" type="text">');
							  	el.append('<input type="hidden" search-data="abType" value="1" searchCache/>');
							  }},
							  {text:'发布时间',name:"date",searchRender:function (el){
								  index_render_div(el ,{type:"date",startKey:"dateStart" ,endKey:"dateEnd"});
							  }},
							  {text:'有效起始时间',name:"limtStartTime" ,hideSearch:true},
							  {text:'有效终止时间',name:"limtEndTime" ,hideSearch:true}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

var notice_create_url = "AttendanceBulletin/addAttendanceBulletin";

var notice_update_url = "AttendanceBulletin/updAttendanceBulletin";

var notice_delete_url = "AttendanceBulletin/delBatch";

event_init();

notice_list({paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
{
	// 批量删除按钮点击事件
	$("#delete_btn").click(function (){
		batch_delete_btn_init();
	});

	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});
}

function notice_list(option)
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"100px",
		 url:index_list_url,
		 paramObj : {abType:1},
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url:notice_delete_url,
				paramObj:{ids : rowData.id},
				successCallBack:function(data){
					g_dialog.operateAlert(null ,"删除成功！");
					notice_list({paramObj:null,isLoad:true,maskObj:$("#table_div")});
				}
			});
		}
	});
}

function batch_delete_btn_init(rowData)
{
	var dataArray = g_grid.getData($("#table_div") ,{chk : true});

	if(dataArray.length === 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var data = g_grid.getData($("#table_div") ,{chk:true});

	var tmp=[];
	for (var i = 0; i < data.length; i++) {
		tmp.push(data[i].id);
	}

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : notice_delete_url,
				paramObj : {ids:tmp.join(",")},
				successCallBack : function(data){
					notice_list({paramObj:null,isLoad:true,maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/notice_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"560px",
				height:"600px",
				init:init,
				title:"公告信息查看",
				isDetail:true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);

		var validityValue = rowData.validityValue;
		var validityType = rowData.validityType;

		if(validityType == "3")
		{
			el.find("[id=cycle]").text("每月"+validityValue+"日");
		}
		else if(validityType == "2")
		{
			el.find("[id=cycle]").text("每"+week_map.get(rowData.validityValue));
		}
		else if(validityType == "1")
		{
			el.find("[id=cycle]").text("每天");
		}
		else if(validityType == "-1")
		{
			return;
		}
		var validityStartTime = rowData.validityStartTime;
		var validityEndTime = rowData.validityEndTime;

		if(validityStartTime == null || validityEndTime == null)
		{
			el.find("[id=time_day]").text(" ");
		}
		else
		{
			el.find("[id=time_day]").text(validityStartTime+'-'+validityEndTime);			
		}		
	}
}

function edit_template_init(rowData)
{
	var title = rowData ? "公告信息修改" : "公告信息添加";
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/notice_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"550px",
				init:init,
				title:title,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss');
		el.find("[data-id=endDate]").val(today);
		el.find("[data-id=endDate]").val(today);

		//设定周期的变换事件
		el.find("[data-id=validityType]").change(function (){
			
			var tmp = $(this).val();
			el.find("[data-id=validityValue]").removeAttr("disabled");
			el.find("[data-id=validityStartTime]").removeAttr("disabled");
			el.find("[data-id=validityEndTime]").removeAttr("disabled");
			
			// 先把option全部清除
			el.find("[data-id=validityValue]").find("option").remove();
			el.find("[data-id=validityValue]").trigger("change");

			// 月
			if (tmp == "3")
			{
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					el.find("[data-id=validityValue]").append('<option value="'+i+'">'+i+'</option>');
				}
				el.find("[data-id=validityStartTime]").removeAttr("disabled");
				el.find("[data-id=validityEndTime]").removeAttr("disabled");
				
			}
			// 周
			if (tmp == "2")
			{
				// 添加周一至周日			
				el.find("[data-id=validityValue]").append('<option value="2">星期一</option>');
				el.find("[data-id=validityValue]").append('<option value="3">星期二</option>');
				el.find("[data-id=validityValue]").append('<option value="4">星期三</option>');
				el.find("[data-id=validityValue]").append('<option value="5">星期四</option>');
				el.find("[data-id=validityValue]").append('<option value="6">星期五</option>');
				el.find("[data-id=validityValue]").append('<option value="7">星期六</option>');
				el.find("[data-id=validityValue]").append('<option value="1">星期日</option>');
				el.find("[data-id=validityStartTime]").removeAttr("disabled");
				el.find("[data-id=validityEndTime]").removeAttr("disabled");
				
			}

			// 天
			if (tmp == "1")
			{
				el.find("[data-id=validityValue]").attr("disabled","disabled");
				el.find("[data-id=validityStartTime]").removeAttr("disabled");
				el.find("[data-id=validityEndTime]").removeAttr("disabled");
				
			}

			// ---
			if (tmp == "-1")
			{
				el.find("[data-id=validityValue]").attr("disabled","disabled");
				el.find("[data-id=validityStartTime]").attr("disabled","disabled");
				el.find("[data-id=validityEndTime]").attr("disabled","disabled");
				//清除label为空的样式
				g_validate.clear([el.find("[data-id=validityStartTime]") ,el.find("[data-id=validityEndTime]")]);

				//清除label中写的东西
				el.find("[data-id=validityStartTime]").val("");
				el.find("[data-id=validityEndTime]").val("");
			}
			el.find("[data-id=validityValue]").trigger("change");		
		});

		el.find('[data-id=validityStartTime]').click(function()
		{
			if((el.find("[data-id=validityStartTime]")).val() == "")
			{
				$(this).val("00:00:00");
			}
			else
			{
				return;
			}				
		});

		el.find("[data-id=validityEndTime]").click(function(){
			if((el.find("[data-id=validityEndTime]")).val() == "")
			{
				$(this).val("00:00:00");
			}
			else
			{
				return;
			}				
		});

		//为文本域设置校验
		el.find("[data-id=desc]").blur(function(){
			var ael = el.find("[data-id=desc]");
			if(ael.val() != "")
			{
				g_validate.setError(ael, "");
			}
			else
			{
				g_validate.setError(ael, "不能为空");
				return false;
			}
		});

		if (rowData)
		{
			el.umDataBind("render" ,rowData);
			el.find("[data-id=validityType]").trigger("change");
			el.find("[data-id=validityValue]").val(rowData.validityValue);
			el.find("[data-id=validityValue]").trigger("change");
		}
	}

	function save_click(el ,saveObj)
	{
		var startTime = el.find("[data-id=validityStartTime]").val();
		var endTime = el.find("[data-id=validityEndTime]").val();  
	    if((startTime > endTime) || ((startTime == endTime) && ((startTime || endTime) != "")))
	    {  
	        g_dialog.dialogTip(el ,{msg:"生效时间的起始时间必须小于终止时间。"});
	        return false;  
	    }
    	if (!g_validate.validate(el.find("#edit_template")))
		{
			return false;
		}
		else
		{
		    var flag_url = notice_create_url;
			if(rowData)
			{
				flag_url = notice_update_url;
			}

			saveObj.abType = 1;
			if(rowData)
			{
				saveObj.abType = 1;
				saveObj.id = rowData.id;
			}
		    um_ajax_get({
				url : flag_url,
				paramObj : saveObj,
				maskObj:el,
				successCallBack : function (data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"操作成功!");
					notice_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}
	}
}


});