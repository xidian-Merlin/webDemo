$(document).ready(function(){
require(["js/plugin/tab/tab.js"] ,function(tab) {


$.ajax({
	type : "GET",
	url : "tpl/monitor/monitor_certificate_tpl.html",
	success : function(data) 
	{
		$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
		tab.tab($("[data-id="+$("[data-id=temp_name]").val()+"]") ,{
			oper : []
		});

		$("[data-id=snmpVersion]").change(function (){
			var id = $(this).val();
			if (id == "1" || id == "2")
			{
				$("#snmp_v1").show();
				$("#snmp_v3").hide();
			}
			else
			{
				$("#snmp_v1").hide();
				$("#snmp_v3").show();
			}
		});

		($("[data-id=tab-ul]>li.active").html() === "SNMP")
		? $("[data-id=temp_show_index_for_ssh]").val("hide")
		: $("[data-id=temp_show_index_for_ssh]").val("show");

		$("[data-id=tab-ul]>li").click(function(){
			($("[data-id=tab-ul]>li.active").html() === "SNMP")
			? $("[data-id=temp_show_index_for_ssh]").val("hide")
			: $("[data-id=temp_show_index_for_ssh]").val("show");
		});


	}
});


});
});