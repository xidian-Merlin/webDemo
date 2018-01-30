define(function() {
	var tools = {
					appsystem:[
	             	["文本","text","/img/draw/text.svg",120000],
	             	["直线","line","/img/draw/line.svg",100000],
	             	["虚线","layer","/img/draw/layer.svg",200000],
	             	["箭头","arrow","/img/draw/arrow.svg",300000],
//	             	["URL","url","/img/draw/url.svg",400000],
	             	["应用系统","appSystem","/img/draw/appSystem.svg",410000],
					["操作系统","os","/img/draw/os.svg",500000],
					["中间件","middleware","/img/draw/middleware.svg",600000],
					["数据库","database","/img/draw/database.svg",700000],
					["网络设备","netDevice","/img/draw/netDevice.svg",800000],
				 	["安全设备","securityDevice","/img/draw/securityDevice.svg",900000],
				 	["存储设备","storeDevice","/img/draw/storeDevice.svg",110000],
				 	["应用软件","appsoftware","/img/draw/appsoftware.svg",120000],
				 	["通用协议","generalAgreement","/img/draw/generalAgreement.svg",130000],
				 	["负载均衡","loadBalancing","/img/draw/loadBalancing.svg",123456]
				 	/*,
				 	["安全事件","securityEvent","/img/draw/securityEvent.svg",140000],
				 	["链路事件","linkEvent","/img/draw/linkEvent.svg",150000],
				 	["拓扑模块","topoM","/img/draw/topoM.svg",160000]*/
				 	/*,["自定义节点","customNode","",260000]*/],
				 	nettopo:[
				 		["二层交换机",'commonswitch'],
				 		['核心交换机','hubswitch'],
				 		['三层交换机','threelevelswitch'],
				 		['集线器','hubs'],
				 		['防火墙','firewall'],
				 		['VPN','vpn'],
				 		['路由器','router'],
				 		['UTM','utm'],
				 		['流量控制','fluxcontrol'],
				 		['身份认证网关','authentication'],
				 		['入侵检测系统IDS','ids'],
				 		['病毒监测系统','hivsystem'],
				 		['网络审计系统','networkauditsystem'],
				 		['邮件监控系统','mailwatchsystem'],
				 		['监控设备控制台','monitorconsole'],
				 		['监控设备管理中心','monitormanagecenter'],
				 		['应用服务器','appserver'],
				 		['数据库服务器','dbserver'],
				 		['数据采集服务器','dataserver'],
				 		['存储设备','storedevice'],
				 		['KVM控制台','kvm'],
				 		['显示操作终端','showterminal'],
				 		['工作站','workstation'],
				 		['未知设备','unknow']
				 	],
				 	
	};
	return tools;
});