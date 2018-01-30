$(document).ready(function(){
var url = {
	asset_list : "monitorConfig/queryNoMonitoreDeviceList",
	form_url_list : "data/tablegrid.json",
}

var header = {
	asset_list : [
							{text:'资产名称'     ,name:"entityName"},
							{text:'IP地址'     ,name:"ipvAddress"},
							{text:'资产类型'     ,name:"entityType"},
							{text:'安全域简称' ,name:"securityName"},
							{text:'业务域简称'   ,name:"businessName"},
							{text:'添加时间'       ,name:"assetCreateDate"},
						],
	monitored_partition_list : [
							{text : "被监控分区",name:"portUnderMonitored"},
							{text : "阈值(%)",name : "threshold"},
							{text : "剩余空间(M)" ,name : "freeSpace"}
						],
	unmonitored_partition_list : [
							{text : "不被监控分区",name:"portNotMonitored"},
							{text : "阈值(%)",name : "threshold"},
							{text : "剩余空间(M)" ,name : "freeSpace"}
							],
	script_path_list : [
							{text : "脚本全路径",name:"scriptFullPath"},
							{text : "脚本参数",name : "scriptArgument"}
							],
	config_process_list : [
							{text : "已配置进程",name:"configProcess"}
							]
};

function step_show (name) 
{
	switch (name) 
	{
		case "monitored_asset":
			g_grid.render($("[data-id="+$("[data-id=temp_name]").val()+"]") ,{
						url : url.asset_list,
						header : header.asset_list,
						paramObj : {monitorType : $("[data-id=temp_type]").val()},
						isLoad : false
			});
			break;
		case "base_info":
			$.ajax({
				type : "GET",
				url : "tpl/monitor/base_info_tpl.html",
				success : function (data) 
				{
					$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
				}
			});
			break;
		case "monitor_certificate":
			require(["js/plugin/tab/tab.js"] ,function(tab) {
				$.ajax({
					type : "GET",
					url : "tpl/monitor/monitor_certificate_tpl.html",
					success : function(data) 
					{
						$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
						tab.tab($("[data-id="+$("[data-id=temp_name]").val()+"]") ,{
							oper : [],
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
			break;
		case "monitor_index":
			$.ajax({
				type : "GET",
				url : "tpl/monitor/monitor_index_tpl.html",
				success : function (data) 
				{
					$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
					grid_in_tpl_render("mornitored_partition" ,url.form_url_list ,header.monitored_partition_list);
					grid_in_tpl_render("unmornitored_partition" ,url.form_url_list ,header.unmonitored_partition_list);
					grid_in_tpl_render("script_full_path_list" ,url.form_url_list ,header.script_path_list);
					grid_in_tpl_render("process_path_list" ,url.form_url_list ,header.config_process_list);
				}
			});
			($("[data-id=temp_show_index_for_ssh]").val() == "show")
			? $("#index_for_ssh_telent").show()
			: $("#index_for_ssh_telent").hide();


			function grid_in_tpl_render(target ,url ,header) 
			{
			 	g_grid.render($("[data-id="+target+"]") ,{
			 		url : url,
			 		header : header,
			 		server : "/",
			 		isLoad : false,
			 		paginator : false
			 	});
			}
			break;
	}
}
});