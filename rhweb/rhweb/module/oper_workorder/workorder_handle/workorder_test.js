$(document).ready(function (){
	require(['/js/plugin/timepicker/timepicker.js'] ,function (timepicker){
		timepicker.time($("#apply_date"));
		timepicker.time($("#deal_date"));
		timepicker.time($("#exe_date"));


		$("[data-type=select]").each(function (){
        	$(this).select2({
        		width : "100%",
        		placeholder: "Select a state"
        	});
        });

        $("#form1").find("button").click(function (){
        	var obj = $("#form1").umDataBind("serialize");
        	obj.step = 1;
	        um_ajax_post({
				url: index_web_app + "workorder/deal",
				isLoad: true,
				paramObj:obj,
				successCallBack:function (data){
					alert("成功");
				}
			});
        });

        $("#form2").find("button").click(function (){
        	var obj = $("#form2").umDataBind("serialize");
        	obj.deal_result = $('input:radio[name="deal_result"]:checked').val();
        	obj.step = 2;
        	um_ajax_post({
				url: index_web_app + "workorder/deal",
				isLoad: true,
				paramObj:obj,
				successCallBack:function (data){
					alert("成功");
				}
			});
        });

        $("#form3").find("button").click(function (){
        	var obj = $("#form3").umDataBind("serialize");
        	obj.step = 3;
        	um_ajax_post({
				url: index_web_app + "workorder/deal",
				isLoad: true,
				paramObj:obj,
				successCallBack:function (data){
					alert("成功");
				}
			});
        });
	});
});