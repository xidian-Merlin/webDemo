
/**
                     {
                    	 id:"ping_traceroute",
                    	 name:"traceroute信息",
                    	 tempid:"eventtable_template",
                    	 colTemp:[],
                    	 url:"";
                    	 col:[
								{text:'连接次数 ',name:""},
								{text:'目标机IP',name:""},
								{text:'通过的IP ',name:""},
								{text:'连接平均时间(毫秒) ',name:""},
								{text:'结束时间 ',name:""},
                    	      ]
                    	 requestUrl:function(){
                    	 
                     }
 */
						var _default_opt =   {
								header : null,
								data : null,
								paginator : true,
								oper : [],
								url : "",
								paramObj : new Object(),
								currentPage : 1,
								pageSize : 15,
								isLoad : true,
								allowCheckBox:true,
								maskObj : '',
								isAsync : true,
								dbClick : null,
								hasBorder : true,
								hideSearch : false,
								hasExpand : false
							};

function getTemplateObject(idName,tag,paramObj)
{
	var obj = {
			id:null,
			name:null,
			tempid:null,
			colTemp:null,
			url:null,
			timerStatus:null,
			col:null,
			requestUrl:null
	};
	try
	{
		var flag = false;
	for(var i=0;i<event_tablecol.length;i++)
	{
		if(flag == true)
			break;
		var ids = event_tablecol[i].id;
		if(event_tablecol[i].colTemp != undefined)
		{
			event_tablecol[i].col = event_tablecol[i].colTemp;
		}
		

		if(ids instanceof Array)
		{
			
			for(var j=0;j<ids.length;j++)
			{
				
				if(ids[j] == idName)
				{
					var _name = "";
					if(event_tablecol[i].name instanceof Array)
					{
						_name = (event_tablecol[i].name[j]==undefined?event_tablecol[i].name[0]:event_tablecol[i].name[j]);
						
					}
					else
					{
						_name = event_tablecol[i].name;
						
					}
					
					var _col = {};
					if(event_tablecol[i].col instanceof Array)
					{
						_col = (event_tablecol[i].col[j]==undefined?event_tablecol[i].col[0]:event_tablecol[i].col[j]);
						
					}
					else
					{
						_col = event_tablecol[i].col;
						
					}
					
					obj.id = idName;
					obj.name = _name;
					obj.tempid = event_tablecol[i].tempid;
					obj.colTemp = event_tablecol[i].colTemp;
					if(event_tablecol[i].url instanceof Object)
						obj.url = event_tablecol[i].url[obj.id];
					else
						obj.url = event_tablecol[i].url;
					obj.timerStatus = event_tablecol[i].timerStatus;
					obj.col = _col;
					obj.requestUrl = function(tag,paramObj)
					{
						if(this.col == undefined || this.col == "" || this.col == null)
							return;
						_default_opt.header = this.col;
						_default_opt.url = this.url;
						var opt = $.extend(_default_opt ,paramObj);
						g_grid.render($(tag),opt);
					};
					flag = true;
					break;
				}
			}
		}
		else if(ids == idName)
		{
			obj.id = ids;
			obj.name = event_tablecol[i].name;
			obj.tempid = event_tablecol[i].tempid;
			obj.colTemp = event_tablecol[i].colTemp;
			obj.url = event_tablecol[i].url;
			obj.timerStatus = event_tablecol[i].timerStatus;
			obj.col = event_tablecol[i].col;
			obj.requestUrl = function(tag,paramObj)
			{
				if(this.col == undefined || this.col == "" || this.col == null)
					return;
				_default_opt.header = this.col;
				_default_opt.url = this.url;
				var opt = $.extend(_default_opt ,paramObj);
				g_grid.render($(tag),opt);
			};
			break;
		}
		
	}
	
	}catch(e){alert(e);}
	if(		obj.url != undefined && 
			obj.url != "" && 
			obj.url != null &&
			tag != null && tag != undefined && tag != "" && tag != "undefined")
	{
		if(obj.url instanceof Object)
		{
			$.each(obj.url,function(index,obj){
				if(index == idName)
				{
					obj.url = null;
					obj.url = obj;
					obj.requestUrl(tag,paramObj);
				}
			});
		}
		else
			obj.requestUrl(tag,paramObj);
	}
	return obj;
}
//function _render(tag,url,col,paramObj)
//{
//	alert(this.col+" "+this.id);
//	if(this.col == undefined || this.col == "" || this.col == null)
//		return;
//	var default_opt =   {
//			header : col,
//			data : null,
//			paginator : true,
//			oper : [],
//			url : url,
//			paramObj : new Object(),
//			currentPage : 1,
//			pageSize : 15,
//			isLoad : true,
//			allowCheckBox:true,
//			maskObj : '',
//			isAsync : true,
//			dbClick : null,
//			hasBorder : true,
//			hideSearch : false,
//			hasExpand : false
//		};
//
//	var opt = $.extend(default_opt ,paramObj);
//	alert(JSON.stringify(opt.header.list_col));
//	g_grid.render($(tag),opt);
//}


var event_tablecol= [
                     {
                    	 id:"baseinfo",
                    	 name:"基本信息",
                    	 tempid:"baseinfo_template",
                    	 url:{
                    		 WEBSERVICE:"monitorSystem/queryMonitorTimerStatus",
                    		 LINUX:"monitorSystem/queryMonitorTimerStatus",
                    		 COMMON_SNMP:"monitorSystem/queryMonitorTimerStatus",
                    		 PING:"monitorSystem/queryMonitorTimerStatus",
                    		 APACHE:"monitorSystem/queryMonitorTimerStatus",
                    		 COMMON_URL:"monitorSystem/queryMonitorTimerStatus",
                    		 ORACLE:"monitorSystem/queryMonitorTimerStatus",
                    		 TOMCAT:"monitorSystem/queryMonitorTimerStatus",
                    		 COMMONDB:"monitorSystem/queryMonitorTimerStatus",
                    		 PORT_MONITOR:"monitorSystem/queryMonitorTimerStatus",
                    	 },
                    	 timerStatus:function(tag,type)
                    	 {
                    			um_ajax_get({
                    		        url : this.url[type],
                    		        isLoad : true,
                    		        maskObj : $(tag).find("#scale_list"),
                    		        successCallBack : function (data){
                    		            $(tag).find("#scale_list").height(data.length * 60);
                    		            $(tag).find("#scale_list").html("");
                    		            {
                    		                var el = $('<div class="scale" style="padding-top:10px;width: 580px;"></div>');
                    		                $(tag).find("#scale_list").append(el);
                    		                g_monitor.monitorStatusChart(el ,{
                    		                    time : $("#query_time_label").text(),
                    		                    data : data.status,
                    		                    name : "概况"
                    		                });
                    		            }
                    		            
                    		            g_dialog.waitingAlertHide();
                    		        }
                    		    });
                    	 }
                     },
                     {
                    	 id:"linux_accountaccess",
                    	 name:"用户访问信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'登录用户名',name:""},
								{text:'登录IP',name:""},
								{text:'登录时间',name:""},
								{text:'登出时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_ipmac",
                    	 name:"IP/MAC信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'网卡名称',name:""},
								{text:'MAC地址',name:""},
								{text:'IP地址',name:""},
								{text:'子网掩码',name:""},
								{text:'网关地址',name:""},
								{text:'发送速度',name:""},
								{text:'接受速度',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_cpurate",
                    	 name:"CPU使用率",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_memoryrate",
                    	 name:"内存使用率",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_memoryinfo",
                    	 name:"内存动态信息",
                    	 tempid:"event_columnarmap_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_processinfo",
                    	 name:"系统进程动态信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'进程ID',name:""},
								{text:'使用用户',name:""},
								{text:'映像名称',name:""},
								{text:'CPU使用率(%)',name:""},
								{text:'内存使用率(%)',name:""},
								{text:'占用CPU时间',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_diskinfo",
                    	 name:"磁盘动态信息",
                    	 tempid:"event_diskmap_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_diskio",
                    	 name:"磁盘IO信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'磁盘名称',name:""},
								{text:'总速度(MB/s)',name:""},
								{text:'读速度(MB/s)',name:""},
								{text:'写速度(MB/s)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_inode",
                    	 name:"I-NODE信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'文件系统',name:""},
								{text:'INODE总大小(KB)',name:""},
								{text:'INODE空闲大小(KB)',name:""},
								{text:'INODE使用大小(KB)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_inode",
                    	 name:"I-NODE信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'文件系统',name:""},
								{text:'INODE总大小(KB)',name:""},
								{text:'INODE空闲大小(KB)',name:""},
								{text:'INODE使用大小(KB)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_swaprate",
                    	 name:"分页空间使用率",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_processwatch",
                    	 name:"进程监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'进程名称 ',name:""},
								{text:'进程数量 ',name:""},
								{text:'进程路径',name:""},
								{text:'关注状态 ',name:""},
								{text:'运行状态',name:""},
								{text:'数据获取时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_filewatch",
                    	 name:"文件监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'文件全路径 ',name:""},
								{text:'文件类型 ',name:""},
								{text:'关注状态',name:""},
								{text:'改变状态 ',name:""},
								{text:'数据获取时间',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_portwatch",
                    	 name:"端口监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'端口名称 ',name:""},
								{text:'关注状态 ',name:""},
								{text:'运行状态',name:""},
								{text:'更新时间 ',name:""},
								{text:'进程信息(名称或所属)',name:""},
								{text:'进程用户',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_scriptwatch",
                    	 name:"脚本监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'脚本全路径 ',name:""},
								{text:'参数 ',name:""},
								{text:'执行结果',name:""},
								{text:'更新时间 ',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_sshConfig",
                    	 name:"SSH命令配置",
                    	 tempid:"event_ssh_template",
                    	 col:[]
                     },
                     {
                    	 id:"linux_performevent",
                    	 name:"性能事件",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'事件名称 ',name:""},
								{text:'当前状态 ',name:""},
								{text:'状态',name:""},
								{text:'事件类型 ',name:""},
								{text:'资产名称 ',name:""},
								{text:'业务域  ',name:""},
								{text:'安全域 ',name:""},
								{text:'事件描述 ',name:""},
								{text:'性能值 ',name:""},
								{text:'发生时间 ',name:""},
								{text:'恢复时间 ',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_faultevent",
                    	 name:"故障事件",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'事件名称 ',name:""},
								{text:'当前状态 ',name:""},
								{text:'状态',name:""},
								{text:'事件类型 ',name:""},
								{text:'资产名称 ',name:""},
								{text:'业务域  ',name:""},
								{text:'安全域 ',name:""},
								{text:'事件描述 ',name:""},
								{text:'发生时间 ',name:""},
								{text:'恢复时间 ',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_deployevent",
                    	 name:"配置事件",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'事件名称 ',name:""},
								{text:'资产名称 ',name:""},
								{text:'监控器名称',name:""},
								{text:'发生时间 ',name:""},
								{text:'数量 ',name:""},
								{text:'状态 ',name:""},
								{text:'事件内容  ',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_startUpwatch",
                    	 name:"启动项监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'启动项名称 ',name:""},
								{text:'关注状态 ',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_policywatch",
                    	 name:"主机账号口令策略监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'策略名称 ',name:""},
								{text:'策略值 ',name:""},
								{text:'关注状态',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"linux_filelogwatch",
                    	 name:"日志文件关键字监控",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'文件路径 ',name:""},
								{text:'录入时间 ',name:""},
								{text:'关键字',name:""},
								{text:'匹配结果',name:""},
								{text:'操作',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_conn",
                    	 name:"TOMCAT连接信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'协议 ',name:""},
								{text:'端口 ',name:""},
								{text:'最大线程数',name:""},
								{text:'最大PORT请求大小(B)',name:""},
								{text:'最大HTTP队头大小(B)',name:""},
								{text:'最大活动请求',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_web",
                    	 name:"TOMCAT加载WEB模块",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'模块名称 ',name:""},
								{text:'开始时间 ',name:""},
								{text:'状态',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_thread",
                    	 name:"TOMCAT线程信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'线程名称 ',name:""},
								{text:'线程状态 ',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_request",
                    	 name:"TOMCAT全局请求",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'协议 ',name:""},
								{text:'总发送字节(B)',name:""},
								{text:'总接收字节(B)',name:""},
								{text:'事件数',name:""},
								{text:'总请求数',name:""},
								{text:'最大时间(ms)',name:""},
								{text:'模式类型',name:""},
								{text:'进程时间(ms)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_threadpool",
                    	 name:"TOMCAT线程池信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'端口名 ',name:""},
								{text:'最大线程数 ',name:""},
								{text:'当前线程数',name:""},
								{text:'当前忙线程数',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"tomcat_memoryinfo",
                    	 name:"JVM动态信息",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_processingtime",
                    	 name:"进程时间",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_received",
                    	 name:"接收字节数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_sentt",
                    	 name:"发送字节数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_errorcount",
                    	 name:"错误总数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_requestcount",
                    	 name:"请求总数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_requestcount",
                    	 name:"请求总数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_currentthread",
                    	 name:"当前线程数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_currentthreadBusy",
                    	 name:"当前线程忙碌数",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"tomcat_faultevent",
                    	 name:"故障事件",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'事件名称 ',name:""},
								{text:'当前状态 ',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_accountaccess",
                    	 name:"用户访问信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'登录用户名 ',name:""},
								{text:'用户主机名 ',name:""},
								{text:'用户当前执行SQL',name:""},
								{text:'登录时间',name:""},
								{text:'主机系统用户',name:""},
								{text:'客户端连接程序名称',name:""},
								{text:'会话当前状态',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_currentsession",
                    	 name:"会话信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'会话标识 ',name:""},
								{text:'用户名 ',name:""},
								{text:'当前执行命令',name:""},
								{text:'等待锁地址',name:""},
								{text:'模式用户名',name:""},
								{text:'会话状态 ',name:""},
								{text:'操作系统客户机名',name:""},
								{text:'操作系统程序名',name:""},
								{text:'会话块争取',name:""},
								{text:'会话一致性读取',name:""},
								{text:'会话物理读取',name:""},
								{text:'会话块更改',name:""},
								{text:'用户进程内存使用率(%)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_instance",
                    	 name:"实例信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'实例名称 ',name:""},
								{text:'实例启动时间 ',name:""},
								{text:'实例状态',name:""},
								{text:'是否并行服务器模式',name:""},
								{text:'实例打开重做线程数',name:""},
								{text:'是否归档 ',name:""},
								{text:'登录方式',name:""},
								{text:'数据库状态',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_datafile",
                    	 name:"数据文件",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'数据库文件 ',name:""},
								{text:'文件状态 ',name:""},
								{text:'SQL访问文件权限',name:""},
								{text:'当前尺寸(Mb)',name:""},
								{text:'最后更改时间',name:""},
								{text:'所属文件空间 ',name:""},
								{text:'写入所用时间(ms)',name:""},
								{text:'i/o所用时间(ms)',name:""},
								{text:'数据文件读取次数',name:""},
								{text:'数据文件写入次数',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_logfile",
                    	 name:"联机日志",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'重做日志组标识 ',name:""},
								{text:'日志成员状态 ',name:""},
								{text:'日志大小(MB)',name:""},
								{text:'最后更改时间',name:""},
								{text:'重做日志组成员数 ',name:""},
								{text:'归档状态',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_SGA",
                    	 name:"SGA信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'SGA缓冲区名称 ',name:""},
								{text:'缓冲区大小(bytes) ',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_cpuperf",
                    	 name:"数据库性能信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'空闲cpu资源百分比 ',name:""},
								{text:'平均等待时间',name:""},
								{text:'IO操作占用cpu资源百分比',name:""},
								{text:'运算占用cpu资源百分比',name:""},
								{text:'CPU运算时间占用响应时间百分比',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_waitsession",
                    	 name:"等待会话",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'会话标识 ',name:""},
								{text:'会话等待资源(K)',name:""},
								{text:'等待时间(ms)',name:""},
								{text:'等待秒数(s)',name:""},
								{text:'等待状态',name:""},
								{text:'等待客户机名称',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_bufferpool",
                    	 name:"缓冲区信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'缓冲区标识 ',name:""},
								{text:'缓冲池名称',name:""},
								{text:'缓冲池最大设置尺寸(B)',name:""},
								{text:'替换列表中缓冲区数(B)',name:""},
								{text:'写入列表中缓冲区数(B)',name:""},
								{text:'设置获得缓冲区数(B)',name:""},
								{text:'设置写入缓冲区数(B)',name:""},
								{text:'设置扫描缓冲区数(B)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_bufferpoolhit",
                    	 name:"缓冲区命中率",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"oracle_tablespace",
                    	 name:"表空间",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"event_linemap_template,eventtable_template",
                    	 col:[
								{text:'表空间名称 ',name:""},
								{text:'表空间分配大小(M)',name:""},
								{text:'表空间分配块数',name:""},
								{text:'表空间可用大小(M)',name:""},
								{text:'表空间可用块数',name:""},
								{text:'表空间可用大小比列(%)',name:""},
								{text:'内容类型',name:""},
								{text:'当前表空间状态',name:""},
								{text:'自由空间碎片索引(%)',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_lock",
                    	 name:"全局阻塞锁信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'持有锁的客户机名称 ',name:""},
								{text:'持有锁的程序名称',name:""},
								{text:'锁的类型',name:""},
								{text:'锁的持有模式',name:""},
								{text:'锁的请求模式',name:""},
								{text:'锁的持续时间',name:""},
								{text:'被锁表ID',name:""},
								{text:'被锁表',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_pga",
                    	 name:"PGA配置",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'PGA参数 ',name:""},
								{text:'PGA可自动分配大小',name:""},
								{text:'自动模式下最大内存',name:""},
								{text:'当前使用的PGA大小',name:""},
								{text:'当前分配的PGA大小',name:""},
								{text:'可释放的PGA大小',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_roll",
                    	 name:"回滚使用情况",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'段名 ',name:""},
								{text:'表空间名',name:""},
								{text:'状态',name:""},
								{text:'当前大小',name:""},
								{text:'初始长度',name:""},
								{text:'下一个长度',name:""},
								{text:'最小长度',name:""},
								{text:'最大长度',name:""},
								{text:'命中率%',name:""},
								{text:'HWM大小',name:""},
								{text:'收缩',name:""},
								{text:'WRAPS',name:""},
								{text:'扩展',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_invalid",
                    	 name:"无效对象",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'宿主 ',name:""},
								{text:'对象名称',name:""},
								{text:'对象名称',name:""},
								{text:'创建时间',name:""},
								{text:'更新时间',name:""},
                    	 ]
                     },
                     {
                    	 id:"oracle_staticinfo",
                    	 name:"数据库状态信息",
                    	 tempid:"eventtextmap_template",
                    	 col:[]
                     },
                     {
                    	 id:[
                    	     "oracle_performevent",
                    	     "apache_performevent",
                    	     "common_snmp_performevent",
                    	     "webservice_performevent",
                    	     "common_url_performevent",
                    	     "commondb_performevent"],
                    	 name:["性能事件","性能事件","性能事件","性能事件","性能事件","性能事件"],
                    	 tempid:"eventtable_template",
                    	 url:{
                    		 oracle_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    		 apache_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    		 common_snmp_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    		 webservice_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    		 common_url_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    		 commondb_performevent:"monitorSystem/queryPerfAndFaultEvent",
                    	 },
                    	 col:[
                    	      //oracle_performevent
                    	      [
  								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'性能值',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""}, 
                    	      ],
                    	      //apache_performevent
                    	      [
  								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'性能值',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""}, 
                    	      ],
                    	      [
 								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'性能值',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""}, 
                   	      ],
                	      [
							{text:'事件名称 ',name:""},
							{text:'当前状态',name:""},
							{text:'状态',name:""},
							{text:'事件类型',name:""},
							{text:'资产名称',name:""},
							{text:'业务域',name:""},
							{text:'安全域',name:""},
							{text:'事件描述',name:""},
							{text:'性能值',name:""},
							{text:'发生时间',name:""},
							{text:'恢复时间',name:""}, 
						  ],
                	      [
							{text:'事件名称 ',name:""},
							{text:'当前状态',name:""},
							{text:'状态',name:""},
							{text:'事件类型',name:""},
							{text:'资产名称',name:""},
							{text:'业务域',name:""},
							{text:'安全域',name:""},
							{text:'事件描述',name:""},
							{text:'性能值',name:""},
							{text:'发生时间',name:""},
							{text:'恢复时间',name:""}, 
						  ],
                	      [
							{text:'事件名称 ',name:""},
							{text:'当前状态',name:""},
							{text:'状态',name:""},
							{text:'事件类型',name:""},
							{text:'资产名称',name:""},
							{text:'业务域',name:""},
							{text:'安全域',name:""},
							{text:'事件描述',name:""},
							{text:'性能值',name:""},
							{text:'发生时间',name:""},
							{text:'恢复时间',name:""}, 
						  ],

                    	 ]
                     },
                     {
                    	 id:[
                    	     "oracle_faultevent",
                    	     "apache_faultevent",
                    	     "common_snmp_faultevent",
                    	     "webservice_faultevent",
                    	     "common_url_faultevent",
                    	     "portmonitor_faultevent",
                    	     "commondb_faultevent",
                    	     "ping_faultevent"],
                    	 name:["故障事件",
                    	       "故障事件",
                    	       "故障事件",
                    	       "故障事件",
                    	       "故障事件",
                    	       "故障事件",
                    	       "故障事件",
                    	       "故障事件"],
                          url:{
                        	  oracle_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  apache_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  common_snmp_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  webservice_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  common_url_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  portmonitor_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  commondb_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	  ping_faultevent:"monitorSystem/queryPerfAndFaultEvent",
                        	 },
                    	 tempid:"eventtable_template",
                    	 col:[
                    	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
                    	       ],
                    	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
                    	       ],
                     	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
							  ],
	                  	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
	              	          ],
	                  	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
	              	          ],
	                  	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
	              	          ],
	                  	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
	              	          ],
	                  	      [
								{text:'事件名称 ',name:""},
								{text:'当前状态',name:""},
								{text:'状态',name:""},
								{text:'事件类型',name:""},
								{text:'资产名称',name:""},
								{text:'业务域',name:""},
								{text:'安全域',name:""},
								{text:'事件描述',name:""},
								{text:'发生时间',name:""},
								{text:'恢复时间',name:""},
	              	          ],

                    	 ]
                     },
                     {
                    	 id:[
                    	     "apache_cpudynamic",
                    	     "webservice_response",
                    	     "common_url_responsetime",
                    	     "common_url_pagesize"],
                    	 name:[
                    	       "CPU动态信息",
                    	       "响应时间",
                    	       "响应时间",
                    	       "页面大小"],
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"apache_reqcount",
                    	 name:"请求数信息",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"apache_transmission",
                    	 name:"传输量信息",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"apache_reqtransmission",
                    	 name:"请求传输量信息",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"apache_concurrentstate",
                    	 name:"并发状态",
                    	 tempid:"event_linemap_template",
                    	 col:[]
                     },
                     {
                    	 id:"apache_static",
                    	 name:"静态信息",
                    	 tempid:"event_static_template",
                    	 col:[]
                     },
                     {
                    	 id:"common_snmp_datastorage",
                    	 name:"监控数据存储信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'oid字段 ',name:""},
								{text:'oid行标',name:""},
								{text:'oid值',name:""},
								{text:'事件类型',name:""},
								{text:'更新时间',name:""},
                    	      ]
                     },
                     {
                    	 id:"commondb_time",
                    	 name:"执行时间",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'SQL语句 ',name:""},
								{text:'执行时间(ms)',name:""},
								{text:'执行状态',name:""},
                    	      ]
                     },
                     {
                    	 id:"commondb_result",
                    	 name:"查询结果",
                    	 tempid:"event_dbtable_template",
                    	 colTemp:new Object(),
                    	 col:[]
                     },
                     {
                    	 id:"ping_ping",
                    	 name:"ping信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'目标机IP ',name:""},
								{text:'跳出时间(毫秒)',name:""},
								{text:'连接跳数 ',name:""},
								{text:'是否连通 ',name:""},
								{text:'连接时间(毫秒) ',name:""},
								{text:'结束时间 ',name:""},
                    	      ]
                     },
                     {
                    	 id:"ping_traceroute",
                    	 name:"traceroute信息",
                    	 url:"monitorSystem/queryPerfAndFaultEvent",
                    	 tempid:"eventtable_template",
                    	 col:[
								{text:'连接次数 ',name:""},
								{text:'目标机IP',name:""},
								{text:'通过的IP ',name:""},
								{text:'连接平均时间(毫秒) ',name:""},
								{text:'结束时间 ',name:""},
                    	      ]
                     },
                     ];
