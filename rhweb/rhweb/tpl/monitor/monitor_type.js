$(document).ready(function(){
var url = {
	// monitor_type_data : "data/monitor_type.json",
	monitor_type : "tpl/monitor/monitor_type_tpl.html",
};
var monitor_type_data = [
							[ //name,value/data-id
								["网络设备","",""],
								["Array负载均衡","",""],
								["华三网络设备","",""],
								["华为网络设备","",""],
								["迈普交换机","",""],
								["锐捷网络设备","",""],
								["思科网络设备","",""],
								["中兴网络设备","",""]
							],
							[
								["安全设备","",""],
								["Juniper防火墙","",""],
								["NETKEEPER纵向加密认证网关","",""],
								["安恒USM堡垒机","",""],
								["安恒WEB防火墙","",""],
								["安信华WEB防火墙","",""],
								["安信华WEB网关","",""],
								["迪普IPS监控器","",""],
								["迪普防火墙","",""],
								["东软防火墙","",""],
								["联想VPN","",""],
								["联想网御入侵检测系统","",""],
								["联想网御星云","",""],
								["绿盟安全审计系统","",""],
								["绿盟入侵检测系统","",""],
								["绿盟远程安全评估系统","",""],
								["启明防火墙","",""],
								["启明星辰入侵检测系统","",""],
								["瑞星病毒监测预警系统","",""],
								["锐捷防火墙","",""],
								["思科ASA防火墙","",""],
								["天玥网络安全审计系统","",""],
								["天融信防病毒网关","",""],
								["天融信防火墙","",""],
								["天融信入侵检测系统","",""],
								["天阗网络入侵检测与管理系统","",""],
								["网御神州安全设备","",""]
							],
							[
								["操作系统","",""],
								["AIX","",""],
								["AIX双机热备","",""],
								["HP-UX","",""],
								["Linux","LINUX",""],
								["Linux双机设备","",""],
								["Solaris","",""],
								["Tru64 UNIX","",""],
								["Windows","",""],
								["Windows双机热备","",""]
							],
							[
								["数据库","",""],
								["DB2","",""],
								["DB2双机热备","",""],
								["Informix","",""],
								["MySQL","",""],
								["ORACLE ASM","",""],
								["Oracle","",""],
								["Oracle RAC","",""],
								["SQL Server","",""],
								["Sybase","",""]
							],
							[
								["中间件","",""],
								["Apache","",""],
								["Microsoft IIS","",""],
								["Tomcat","",""],
								["Tomcat双机热备","",""],
								["Tuxedo","",""],
								["WebLogic","",""],
								["WebSphere","",""],
								["WebSphere集群","",""],
								["Weblogic集群","",""],
								["Websphere双机热备","",""]
							],
							[
							 	["存储备份","",""],
							 	["EMC-VMAX10k","",""],
							 	["IBM V7000存储设备","",""],
							 	["NetApp存储设备","",""],
							 	["惠普磁盘阵列","",""],
							 	["日立HDS磁盘阵列","",""],
							 	["赛门铁克NBU存储设备","",""]
							],
							[
								["应用软件","",""],
								["APC UPS","",""],
								["微软补丁服务器","",""]
							],
							[
								["通用协议","",""],
								["HTTP","",""],
								["ICMP","",""],
								["JMX","",""],
								["SNMP","",""],
								["端口监控","",""]
							],
							[
								["通用监控器","",""],
								["SQL监控器","",""],
								["WEBSERVICE","",""],
								["通用脚本","",""],
								["通用协议","",""]
							]
						];

var list = monitor_type_data;
for (var i = 0; i < list.length; i++) {
	for (var j = 0; j < list[i].length; j++) {
		var tar = list[i][j];
		if(j===0) 
		{
			var tit = "<div class='col-lg-12'><h2 id='"+tar[1]+"'>"+tar[0]+"</h2></div>";
			$("[id=monitor_type_div]").append(tit);
		}
		else 
		{
			var con = "<div class='col-lg-3'><label id='"+tar[1]+"' data-type='monitor_type_list'>"+tar[0]+"</label></div>"
			$("[id=monitor_type_div]").append(con);
		}
	}
}

$("[data-type=monitor_type_list]").click(function(e){
	param.monitor_type = e.currentTarget.id;
});
});