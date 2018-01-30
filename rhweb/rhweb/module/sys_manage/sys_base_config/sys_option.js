$(document).ready(function(){

	$("#content_div").css("overflow-x" ,"auto");

	var sys_option_detail_url="sysoption/querySysValue";

	var save_url="sysoption/updateSysValue";

	view_init();

	event_init();

	option_detail();

	function view_init()
	{
		//渲染上传文件
		index_create_upload_el($("#ptMap"));
		// 渲染select和日期
		index_form_init($("#sys_option_div"));
		g_validate.init($("#sys_option_div"));
	}

	function event_init()
	{
		$("#submit_btn").click(function (){
			submit();
		});

		$("#reset_btn").click(function (){
			reset();
		});

		$("[data-id=workorder_send]").change(function(){
			var tmp = $(this).val();
			if (tmp == "1")
			{
				$("#way_div").show();
			}
			else if (tmp == "0")
			{
				$("#way_div").hide();
			}	
		});

	}

	function option_detail(){
		 //调用后台查询详情
		um_ajax_get({
			url : sys_option_detail_url,
			successCallBack : function(data){
				// 渲染
				$("#sys_option_div").umDataBind("render" ,data[0]);
				// 回显中英文按钮
				$("[name=monitorNameLanguage][value="+data[0].monitorNameLanguage+"]").attr("checked" ,"checked"); 				
                
                $("[data-id=notice").val(data[0].notice.split(","));

				$("#sys_option_div").find("[data-type=select]").trigger("change");
			}

		})
	}

	function myvalidate(val_array){
		for(var i = 0; i<val_array.length-1; i++){
			if(val_array[i]>=val_array[i+1])
				return false;
		}
		return true;
	}

	function submit()
	{
		var validate_result = g_validate.fileSuffixLimit($('#ptMap').val(),"gif,jpg,png",true,true);
		if(!validate_result.flag){
			g_dialog.operateAlert(null,validate_result.msg,"error");
			return false;
		}
		// 校验
		if (!g_validate.validate($("#sys_option_div")))
		{
			return false;
		}

		var error_message="事件等级权值后一个值必须大于前一个值";
		var inputs = $("#event_div1 :text");
		var event_arr = [parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value)];
		if(!myvalidate(event_arr)){
			g_dialog.operateAlert(null,error_message,"error");
			return false;
		}

		error_message="全网风险等级权值后一个值必须大于前一个值";
		inputs = $("#event_div2 :text");
		event_arr = [parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value)];
		if(!myvalidate(event_arr)){
			g_dialog.operateAlert(null,error_message,"error");
			return false;
		}

		error_message="域风险等级权值后一个值必须大于前一个值";
		inputs = $("#event_div3 :text");
		event_arr = [parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value)];
		if(!myvalidate(event_arr)){
			g_dialog.operateAlert(null,error_message,"error");
			return false;
		}

		error_message="风险值等级定义后一个值必须大于前一个值";
		inputs = $("#event_div4 :text");
		event_arr = [parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value)];
		if(!myvalidate(event_arr)){
			g_dialog.operateAlert(null,error_message,"error");
			return false;
		}

		// serialize,将表单内容序列化为字符串
		var saveObj = $("#sys_option_div").umDataBind("serialize");
		$("[name=formJson]").val(JsonTools.encode(saveObj ));

		saveObj.notice = $("[data-id=notice]").val().join(",");

		um_ajax_file($("#sysoption_form"),{
			url : save_url,
			paramObj : saveObj,
			successCallBack : function(){
				g_dialog.operateAlert();
			}
		})
	}

	function reset()
	{   
		// $("[name=monitorNameLanguage]").removeAttr("checked");
		option_detail();
		
	}

});