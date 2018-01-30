$(document).ready(function(){
var form_url_list_url = "data/tablegrid.json";
var monitored_partition_list_header = [
							{text : "被监控分区",name:"portUnderMonitored"},
							{text : "阈值(%)",name : "threshold"},
							{text : "剩余空间(M)" ,name : "freeSpace"}
							];

var unmonitored_partition_list_header = [
							{text : "不被监控分区",name:"portNotMonitored"},
							{text : "阈值(%)",name : "threshold"},
							{text : "剩余空间(M)" ,name : "freeSpace"}
							];

var script_path_list_header = [
							{text : "脚本全路径",name:"scriptFullPath"},
							{text : "脚本参数",name : "scriptArgument"}
							];

var config_process_list_header = [
							{text : "已配置进程",name:"configProcess"}
							];
$.ajax({
	type : "GET",
	url : "tpl/monitor/monitor_index_tpl.html",
	success : function (data) 
	{
		$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
		grid_in_tpl_render("mornitored_partition" ,form_url_list_url ,monitored_partition_list_header);
		grid_in_tpl_render("unmornitored_partition" ,form_url_list_url ,unmonitored_partition_list_header);
		grid_in_tpl_render("script_full_path_list" ,form_url_list_url ,script_path_list_header);
		grid_in_tpl_render("process_path_list" ,form_url_list_url ,config_process_list_header);
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
});