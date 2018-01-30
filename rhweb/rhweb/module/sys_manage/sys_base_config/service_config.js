$(document).ready(function (){

	var service_config_detail_url = "service/getconfig";

	var dns_service_save_url = "service/updDnsServiceInfo";

	var email_service_test_url = "service/checkMailService";

	var email_service_save_url = "service/updMailServiceInfo";

	var email_service_reset_url = "";

	var message_sent_save_url = "service/saveSMSConfig";

	var hand_time_apply_url = "service/manualSetSystemTime";

	var npt_auto_test_url = "service/checkNtpService";

	var npt_auto_synchronization_url = "service/synchroServiceConfig";

	var npt_auto_save_url = "service/updNtpServiceInfo";

	view_init();

	event_init();

	config_detail();

	function create_time()
	{
		var today=new Date();
		var year=today.getFullYear();
		var month=today.getMonth()+1;
		var date=today.getDate();
		var weekday=today.getDay();
		var hour=today.getHours();
		var minute=today.getMinutes();
		var second=today.getSeconds();                           
		var new_date = new Date(year,month,1);                //取当年当月中的第一天           
		var date_count = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月的天数              
		var perigonType=$("[data-id=perigonType]").val();
		var perigonContent=$("[data-id=perigonContent]").val();
		var time_array=($("[data-id=timingTime]").val()).split(":");
		// 选择每月
		if (perigonType == 1){
			// 选择日期大于当前日期
			if(perigonContent>date){
				date=perigonContent; 
			}
			// 选择日期小于当前日期，月份加1
			else if(perigonContent<date){
				month++;
				date=perigonContent; 
			}
			// 选择日期等于当前日期，比较时间
			else if(perigonContent == date){
				// 选择时间小于当前时间，月份加1
				if(time_array[0]<hour || (time_array[0] == hour && time_array[1]<minute)){
					month++;
				}
			}
		}
		// 选择每周
		else if(perigonType == 2){
			if(perigonContent>weekday){
				date += perigonContent-weekday;
			}
			else if(perigonContent<weekday){
				date = date-(weekday-perigonContent)+7;
			}
			else if(perigonContent=weekday){
				if(time_array[0]<hour || (time_array[0] == hour && time_array[1]<minute)){
					date += 7;
				}

			}
		}
		// 选择每天
		else if(perigonType == 3){
			// 比较时间
			if(time_array[0]<hour || (time_array[0] == hour && time_array[1]<minute)){
				date++;
				}
		}
		// 计算出的日期大于当月天数，转到下一月
		if(date>date_count){
			date -= date_count
			month++;
		}
		if(month>12){            //如果当前大于12月，则年份转到下一年                     
			month -=12;        //月份减           
			year++;            //年份增           
		}
		$("[data-id=nextTimingTime]").text(year + "-" + month + "-" + date + " " + $("[data-id=timingTime]").val());
	}

	function view_init()
	{
		// 渲染select和日期
		index_form_init($("#service_config_div"));

		g_validate.init($("#service_config_div"));


	}

	function event_init()
	{

		$("#dns_service_save_btn").click(function (){
			dns_service_save();
		});

		$("#dns_service_reset_btn").click(function (){
			dns_service_reset();
		});

		$("#email_service_test_btn").click(function (){
			email_service_test();
		});

		$("#email_service_save_btn").click(function (){
			email_service_save();
		});

		$("#email_service_reset_btn").click(function (){
			email_service_reset();
		});

		$("#message_sent_save_btn").click(function (){
			message_sent_save();
		});

		$("#hand_time_apply_btn").click(function (){
			hand_time_apply();
		});

		$("#npt_auto_test_btn").click(function (){
			npt_auto_test();
		});

		$("#npt_auto_synchronization_btn").click(function (){
			npt_auto_synchronization();
		});

		$("#npt_auto_save_btn").click(function (){
			npt_auto_save();
		});

		// 短信发送配置点击切换事件
		$("#message_sent_deploy").find("[name=configType]").click(function (){
			var tmp = $(this).val();
			if (tmp == "Local"){
				$("#message_cat").hide();
				$("#message_web").hide();
			}
			if (tmp == "Basic"){
				$("#message_cat").show();
				$("#message_web").hide();
			}
			if (tmp == "GateWay"){
		        $("#message_cat").hide();
				$("#message_web").show();
			}
		});

		//判断email中的checkbox是选中还是取消
		$("[data-id=needAuth]").click(function(){

			if ($(this).is(":checked")){
				$("[data-id=username]").removeAttr("disabled");
				$("[data-id=password]").removeAttr("disabled");
			}

			else {
				$("[data-id=username]").attr("disabled", "disabled");
				$("[data-id=password]").attr("disabled", "disabled");

				//勾选取消后清除label为空的样式
				g_validate.clear([$("[data-id=username]") ,$("[data-id=password]")]);

				//勾选取消后清除label中写的内容
				$("[data-id=username]").val("");
				$("[data-id=password]").val("");
			}
		});

		//ntp  --- 判断自动校验功能是否被勾选
		$("[data-id=ntpMachineChecking]").click(function(){

			if ($(this).is(":checked")){
				$("[data-id=perigonType]").removeAttr("disabled");
				$("[data-id=perigonContent]").removeAttr("disabled");
				if ($("[data-id=perigonType]").val() == 3)
				{
					$("[data-id=perigonContent]").attr("disabled" ,"disabled");
				}
				$("[data-id=timingTime]").removeAttr("disabled");
				$("[data-id=timingTime]").val("00:00");
			}

			else {
				$("[data-id=perigonType]").attr("disabled", "disabled");
				$("[data-id=perigonContent]").attr("disabled", "disabled");
				$("[data-id=timingTime]").attr("disabled", "disabled");
				$("[data-id=timingTime]").val("");
				g_validate.clear([$("[data-id=timingTime]")]);
			}

		});
		//ntp --- 判断ntp中的checkbox是选中还是取消
		$("[data-id=needKeyAttestation]").click(function(){

			if ($(this).is(":checked")){
				$("[data-id=key]").removeAttr("disabled");
				$("[data-id=keyId]").removeAttr("disabled");
				$("[data-id=cipherMode]").removeAttr("disabled");
			}

			else {
				$("[data-id=key]").attr("disabled", "disabled");
				$("[data-id=keyId]").attr("disabled", "disabled");
				$("[data-id=cipherMode]").attr("disabled", "disabled");

				//勾选取消后清除label为空的样式
				g_validate.clear([$("[data-id=key]") ,$("[data-id=keyId]") ,$("[data-id=cipherMode]")]);

				//勾选取消后清除label中写的东西
				$("[data-id=key]").val("");
				$("[data-id=keyId]").val("");
				$("[data-id=cipherMode]").val("");
			}
		});

		//设定周期的变换事件
		$("[data-id=perigonType]").change(function (){
			var tmp = $(this).val();
			$("[data-id=perigonContent]").removeAttr("disabled");
			// 先把option全部清除

			$("[data-id=perigonContent]").find("option").remove();
			$("[data-id=perigonContent]").trigger("change");


			if (tmp == "1")
			{
				// 添加1-28天
				for (var i = 1; i < 29; i++)
				{
					$("[data-id=perigonContent]").append('<option value="'+i+'">'+i+'</option>');
				}
			}
			if (tmp == "2")
			{
				// 添加周一至周日
				$("[data-id=perigonContent]").append('<option value="0">星期日</option>');
				$("[data-id=perigonContent]").append('<option value="1">星期一</option>');
				$("[data-id=perigonContent]").append('<option value="2">星期二</option>');
				$("[data-id=perigonContent]").append('<option value="3">星期三</option>');
				$("[data-id=perigonContent]").append('<option value="4">星期四</option>');
				$("[data-id=perigonContent]").append('<option value="5">星期五</option>');
				$("[data-id=perigonContent]").append('<option value="6">星期六</option>');
			}

			if (tmp == "3")
			{
				$("[data-id=perigonContent]").attr("disabled","disabled");
			}
			$("[data-id=perigonContent]").trigger("change");			
		});

		$("[data-id=perigonContent]").change(function(){
			create_time();
		});

		//npt中将设定时间和下次校对时间同步
		$("[data-id=timingTime]").blur(function(){
			
			var nextTimingTime_val = $("[data-id=nextTimingTime]").text();

			//在下次校对时间中，有空格的地方分开，形成数组
			var nextTimingTime_array = nextTimingTime_val.split(" ");

			var tmp = nextTimingTime_array[0] + " " + $(this).val();

			$("[data-id=nextTimingTime]").text(tmp);
			create_time();
		});
	}

	function config_detail(){
		// 调用后台查询详情
		um_ajax_get({
			url : service_config_detail_url,
			successCallBack : function (data){
				//渲染dns部分
				$("#dns_service_panel").umDataBind("render" ,data.dnsstore[0]);
				
				//渲染邮件部分
				$("#email_service_panel").umDataBind("render" ,data.mailservicestore[0]);
				if(data.mailservicestore[0].needAuth==1){
					$("[data-id=needAuth]").click();
				}
				if(data.mailservicestore[0].ssl==1){
					$("[data-id=ssl]").click();
				}
				
				//渲染短信部分
				$("#message_sent_panel").umDataBind("render" ,data.smsstore);
				$("[name=configType][value="+data.smsstore.configType+"]").click();

				//渲染手动部分
				$("#hand_time_panel").umDataBind("render" ,data.ntpstore[0]);
				
				//渲染ntp部分
				$("#npt_auto_panel").umDataBind("render" ,data.ntpstore[0]);

				if (data.ntpstore[0].ntpMachineChecking == 1)
				{
					$("[data-id=ntpMachineChecking]").click();
				}

				
				//$("[data-id=needKeyAttestation]").trigger("change");

				//在对应的下拉框中的value找到对应perigonContent中的值

				$("[data-id=perigonContent]").val(data.ntpstore[0].perigonContent);
				//$("[data-id=perigonContent]").trigger("change");

				$("#service_config_div").find("[data-type=select]").trigger("change");

				if (data.ntpstore[0].needKeyAttestation == 1)
				{
					$("[data-id=needKeyAttestation]").click();
				}
				else
				{
					$("[data-id=perigonContent]").attr("disabled" ,"disabled");
				}
			}
		});
	}

	 // DNS服务保存
	function dns_service_save()
	{
		// 校验

 		if (!g_validate.validate($("#dns_service_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#dns_service_panel").umDataBind("serialize");
			um_ajax_post({
				url : dns_service_save_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}
 	}

	// DNS服务重置
	function dns_service_reset()
	{
		um_ajax_get({
			url : service_config_detail_url,
			successCallBack : function (data){
				//渲染dns部分
				$("#dns_service_panel").umDataBind("render" ,data.dnsstore[0]);
			}
		});

		g_validate.clear([$("[data-id=firstDnsIp]") ,$("[data-id=secondDnsIp]")]);
	}

	// 邮件服务测试
	function email_service_test()
	{
		// 校验

 		if (!g_validate.validate($("#email_service_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#email_service_panel").umDataBind("serialize");

			//封装 是否需要身份验证
			saveObj.needAuth = getCheckboxValue("needAuth");
			saveObj.ssl = getCheckboxValue("ssl");
			um_ajax_post({
				url : email_service_test_url,
				paramObj : saveObj,
				successCallBack : function (data){
					g_dialog.operateAlert($("#email_service_panel") ,data);
				}
			});
		}
	}

	// 邮件服务保存
	function email_service_save()
	{
		// 校验

 		if ( !g_validate.validate($("#email_service_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#email_service_panel").umDataBind("serialize");

			//封装 是否需要身份验证
			saveObj.needAuth = getCheckboxValue("needAuth");
			saveObj.ssl = getCheckboxValue("ssl");
			um_ajax_post({
				url : email_service_save_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}
	}

	// 邮件服务重置
	function email_service_reset()
	{
		um_ajax_get({
			url : service_config_detail_url,
			successCallBack : function (data){
				//渲染dns部分
				$("#email_service_panel").umDataBind("render" ,data.mailservicestore[0]);
				if(data.mailservicestore[0].needAuth==1){
					$("[data-id=needAuth]").click();
				}
			}
		});	

		g_validate.clear([$("[data-id=sendHost]") ,$("[data-id=sendPort]") ,$("[data-id=fetchHost]"),
						$("[data-id=fetchPort]") ,$("[data-id=from]")]);		
	}

	// 短信发送保存
	function message_sent_save()
	{
		var checked_value = $("[name=configType]:checked").val();
		var el_form;
		if (checked_value == "Local")
		{

		}
		else if(checked_value == "Basic")
		{
			el_form = $("#message_cat");
		}
		else if (checked_value == "GateWay")
		{
			el_form = $("#message_web");
		}

		// 校验

 		if (!g_validate.validate(el_form))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#message_sent_panel").umDataBind("serialize");
			um_ajax_post({
				url : message_sent_save_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}		
	}


	//手动校时应用
	function hand_time_apply()
	{
		// 校验

 		if (!g_validate.validate($("#hand_time_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#hand_time_panel").umDataBind("serialize");
			saveObj.manualSettingTime = saveObj.manualSettingTime + ":00";
			um_ajax_post({
				url : hand_time_apply_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}				
	}

	//NPT自动测试
	function npt_auto_test()
	{
		// 校验
 		if (!g_validate.validate($("#npt_auto_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#npt_auto_panel").umDataBind("serialize");
			saveObj.ntpMachineChecking = getCheckboxValue("ntpMachineChecking");
			saveObj.needKeyAttestation = getCheckboxValue("needKeyAttestation");
			um_ajax_post({
				url : npt_auto_test_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}					
	}

	//NPT自动同步
	function npt_auto_synchronization()
	{	
		// 校验

 		if (!g_validate.validate($("#npt_auto_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#npt_auto_panel").umDataBind("serialize");
			saveObj.ntpMachineChecking = getCheckboxValue("ntpMachineChecking");
			saveObj.needKeyAttestation = getCheckboxValue("needKeyAttestation");
			um_ajax_post({
				url : npt_auto_synchronization_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}			
	}

	//NPT自动保存
	function npt_auto_save()
	{
		// 校验
 		if (!g_validate.validate($("#npt_auto_panel")))
 		{
 			return false;
 		}
 		else
 		{
			// 封装saveObj
			var saveObj = $("#npt_auto_panel").umDataBind("serialize");
			saveObj.ntpMachineChecking = getCheckboxValue("ntpMachineChecking");
			saveObj.needKeyAttestation = getCheckboxValue("needKeyAttestation");
			um_ajax_post({
				url : npt_auto_save_url,
				paramObj : saveObj,
				successCallBack : function (){
					g_dialog.operateAlert();
				}
			});
		}					
	}

	//checkbox的1/0
	function getCheckboxValue(checkDataId)
	{
		if ($("[data-id="+checkDataId+"]").is(":checked"))
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}



});

