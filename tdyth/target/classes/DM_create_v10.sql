--新建表空间
CREATE TABLESPACE MNGT_SYS DATAFILE 'MNGT_SYS.DBF' size 150;

--新建模式
CREATE SCHEMA "MNGT_SYS" AUTHORIZATION "SYSDBA";

--切换到MNGT_SYS模式
SET SCHEMA MNGT_SYS;

--【1.配置管理类】
--1-1系统参数
create table SysargTbl(
	"argName"		VARCHAR(32)	NOT NULL,
	"argvalue"		VARCHAR(64),
	"description"	VARCHAR(128),
NOT CLUSTER PRIMARY KEY("argName")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--1-2角色表
create table roleList(
	"roleId"		INTEGER IDENTITY(1,1) NOT NULL,
	"roleName"		VARCHAR(32),
	"description"	VARCHAR(32),
	"priority"		INTEGER,
	"updateTime"	TIMESTAMP(4),	
NOT CLUSTER PRIMARY KEY("roleId")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-3用户表
create table userList(
	"userId"		INTEGER IDENTITY(1,1) NOT NULL,
	"userName"		VARCHAR(32) NOT NULL,
	"description"	VARCHAR(32),
	"userLevels"	INTEGER,
	"userPassword"	VARCHAR(32) NOT NULL,
	"updateTime"	TIMESTAMP(4),
	"dueTime"		TIMESTAMP(4) NOT NULL,
	"signCert"		VARCHAR(32),
	"encCert"		VARCHAR(32),
NOT CLUSTER PRIMARY KEY("userId")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-4分域表
create table SecDomainTbl(    
	"id"			INTEGER IDENTITY(1,1) NOT NULL,
	"name"			VARCHAR(24) NOT NULL,
	"description"	VARCHAR(32),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-5权限类别表
create table PermissionCtgList(
	"permissionCtgcode"		INTEGER IDENTITY(1,1) NOT NULL,
	"name"					VARCHAR(32),
	"description"			VARCHAR(32),
	"updateTime"			TIMESTAMP(4),
NOT CLUSTER PRIMARY KEY("permissionCtgcode")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-6动作表
create table actionList(
	"actionCode"		INTEGER IDENTITY(1,1) NOT NULL,
	"actionName"		VARCHAR(32),
	"description"		VARCHAR(32),
--	"permissionCtgcode"	INTEGER NOT NULL, 
	"updateTime"		TIMESTAMP(4),
NOT CLUSTER PRIMARY KEY("actionCode")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-7用户角色表
create table userRoleSecdomain(
	"userId"		INTEGER NOT NULL,
	"roleId"		INTEGER NOT NULL,
	"secDomainId"		INTEGER NOT NULL,
	"rolePriority"	INTEGER,
	"updateTime"	TIMESTAMP(4),
NOT CLUSTER PRIMARY KEY("userId", "roleId", "secDomainId"),
CONSTRAINT "userRole_userId" FOREIGN KEY("userId") REFERENCES "MNGT_SYS"."USERLIST"("userId") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "userRole_roleId" FOREIGN KEY("roleId") REFERENCES "MNGT_SYS"."ROLELIST"("roleId") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "userRole_secDomainId" FOREIGN KEY("secDomainId") REFERENCES "MNGT_SYS"."SECDOMAINTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--1-8角色策略动作表
create table roleStrategyAction(
	"roleId"			INTEGER NOT NULL,
	"permissionCtgcode"	INTEGER NOT NULL,
	"actionCode"		INTEGER NOT NULL,
	"updateTime"		TIMESTAMP(4),
NOT CLUSTER PRIMARY KEY("roleId", "permissionCtgcode", "actionCode"),
CONSTRAINT "roleStrategyAction_roleId" FOREIGN KEY("roleId") REFERENCES "MNGT_SYS"."ROLELIST"("roleId") ON DELETE CASCADE  ON UPDATE CASCADE ,
CONSTRAINT "roleStrategyAction_permissionCtgcode" FOREIGN KEY("permissionCtgcode") REFERENCES "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode") ON DELETE CASCADE  ON UPDATE CASCADE ,
CONSTRAINT "roleStrategyAction_actionCode" FOREIGN KEY("actionCode") REFERENCES "MNGT_SYS"."ACTIONLIST"("actionCode") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--1-9管理员登录表			
create table AdmLogin(    
	"loginID"		INTEGER IDENTITY(1,1) NOT NULL,
	"userId"		INTEGER NOT NULL,
	"loginTime"		TIMESTAMP(4) NOT NULL,
	"totalLoginNum"	INTEGER NOT NULL,
	"maxRetry"		INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("loginID"),
CONSTRAINT "AdmLogin_userId" FOREIGN KEY("userId") REFERENCES "MNGT_SYS"."USERLIST"("userId") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--1-10管理员操作日志表
create table AdmLog(    
	"logID"				INTEGER IDENTITY(1,1) NOT NULL,
	"userId"			INTEGER NOT NULL,
	"operationObject"	INTEGER,
	"operationType"		INTEGER NOT NULL,
	"operationResult"	INTEGER NOT NULL,
	"operatorTime"		INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("logID"),
CONSTRAINT "AdmLog_userId" FOREIGN KEY("userId") REFERENCES "MNGT_SYS"."USERLIST"("userId") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--【2.设备管理类】
--2-1软件平台枚举表
create table CPE(    
	"id"		VARCHAR(50) NOT NULL,
	"name"		VARCHAR(20),
	"vendor"	VARCHAR(20),
	"product"	VARCHAR(20),
	"version"	VARCHAR(10),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-3安全设备类型登记表
create table EqpClass(    
	"id"		INTEGER IDENTITY(1,1) NOT NULL,
	"name"		VARCHAR(32),
	"pic"		VARCHAR(32),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


create table EqpType(    
	"id"		INTEGER IDENTITY(1,1) NOT NULL,
	"cfg"		INTEGER NOT NULL,
	"name"		VARCHAR(32),
	"pic"		VARCHAR(32),
NOT CLUSTER PRIMARY KEY("id"),
CONSTRAINT "EqpType_cfg" FOREIGN KEY("cfg") REFERENCES "MNGT_SYS"."EQPCLASS"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--2-3设备注册表
create table EqpRegTbl(
	"eqpNo"			CHAR(10),
	"name"			VARCHAR(64)	NOT NULL,	
	"assetType"		INTEGER NOT NULL,		--设备类型：设备类型，在EqpCtgRegTbl表中查找
	"assetValue"	NUMBER(2, 1),
	"securityDomain" INTEGER	NOT NULL,
	"workMode"		NUMBER(1)	NOT NULL,	--运行模式：全天候、不定时
	"manageMode"	NUMBER(1)	NOT NULL,	--管理模式：直接管理、间接数据
	"os"			VARCHAR(32),			--操作系统
	"account"		VARCHAR(32),			--账号
	"pass"			VARCHAR(32),		
	"ip"			VARCHAR(16),
	"location"		VARCHAR(256),			--安装地
	"serial"		VARCHAR(128),
	"contaction"	VARCHAR(256),
NOT CLUSTER PRIMARY KEY("eqpNo"),
CONSTRAINT "EqpRegTbl_assetType" FOREIGN KEY("assetType") REFERENCES "MNGT_SYS"."EQPTYPE"("id") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EqpRegTbl_securityDomain" FOREIGN KEY("securityDomain") REFERENCES "MNGT_SYS"."SECDOMAINTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-4设备接口表
create table EqpInterface(
	"eqpNo"			CHAR(10) NOT NULL,	
	"interfaceName"	VARCHAR(32)	NOT NULL,
	"ip"			VARCHAR(16)	default '0.0.0.0'	NOT NULL,
	"netmask"		VARCHAR(16)	default '0.0.0.0'	NOT NULL,
	"ifType"		NUMBER(2)	default 1 NOT NULL,
	"phyAddr"		VARCHAR(64),	--MAC地址
NOT CLUSTER PRIMARY KEY("eqpNo"),
CONSTRAINT "EqpInterface_eqpNo" FOREIGN KEY("eqpNo") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-5应用程序注册表
create table programRegTbl(
	"programName"	VARCHAR(32)	NOT NULL,	
	"defaultPath"	VARCHAR(128),
	"description"	VARCHAR(128),
NOT CLUSTER PRIMARY KEY("programName")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-6设备上的应用程序
create table EqpProgram(
	"eqpNo"	CHAR(10) NOT NULL,	
	"programName"	VARCHAR(32) NOT NULL,
	"path"			VARCHAR(128),
NOT CLUSTER PRIMARY KEY("eqpNo", "programName"),
CONSTRAINT "EqpProgram_eqpNo" FOREIGN KEY("eqpNo") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-7注册通信链路表
create table linkTbl(
	"eqpNoS"	CHAR(10) NOT NULL,		--源设备编号
	"eqpNoE"	CHAR(10) NOT NULL,		--目的设备编号
	"IPS"		VARCHAR(16)	NOT NULL,	--源IP地址
	"IPE"		VARCHAR(16)	NOT NULL,	--目的IP地址
	"capacity"	NUMBER(10)	default -1	NOT NULL,--带宽/K
NOT CLUSTER PRIMARY KEY("eqpNoS", "eqpNoE"),
CONSTRAINT "linkTbl_eqpNoS" FOREIGN KEY("eqpNoS") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE, 
CONSTRAINT "linkTbl_eqpNoE" FOREIGN KEY("eqpNoE") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)  
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--2-8拓扑表结构
create table topoloNode(
	"nodeID"		INTEGER IDENTITY(1,1)NOT NULL,		
	"eqpNo"			CHAR(10) NOT NULL,	
	"zoomLevelID"	INTEGER	NOT NULL,
	"zoomLevelMax"	INTEGER	NOT NULL,
	"zoomLevelMin"	INTEGER	NOT NULL,
	"upperLevelAreaID"	INTEGER	NOT NULL,
	"areaID"		INTEGER NOT NULL,	
	"eqpType"		INTEGER	NOT NULL,
	"zoomWeight"	NUMBER(2,1) NOT NULL,
	"cascadeZoomWeight"	NUMBER(2,1) NOT NULL,
	"NodePicName"  	CHAR(32),	
	"ZoomedNodePicName"	CHAR(32),
	"nodeName"		CHAR(32)	NOT NULL,
	"zoomedNodeName"	CHAR(32)	NOT NULL,
	"locationX"		INTEGER ,
	"locationY"		INTEGER ,
	"recordNum"		INTEGER	NOT NULL,
	"recordSeq"		INTEGER	NOT NULL,
	"nodeNum"		INTEGER NOT NULL,
	"ZoomedNodeNum"	INTEGER NOT NULL,	
	"node1_ID"		INTEGER,		
	"node1_Attr"	CHAR(8),
	"node2_ID"		INTEGER,		
	"node2_Attr"	CHAR(8),
	"node3_ID"		INTEGER,		
	"node3_Attr"	CHAR(8),
	"node4_ID"		INTEGER,		
	"node4_Attr"	CHAR(8),
	"node5_ID"		INTEGER,		
	"node5_Attr"	CHAR(8),
	"node6_ID"		INTEGER,		
	"node6_Attr"	CHAR(8),
	"node7_ID"		INTEGER,		
	"node7_Attr"	CHAR(8),
	"node8_ID"		INTEGER,		
	"node8_Attr"	CHAR(8),
	"node9_ID"		INTEGER,		
	"node9_Attr"	CHAR(8),
	"node10_ID"		INTEGER,		
	"node10_Attr"	CHAR(8),
	"node11_ID"		INTEGER,		
	"node11_Attr"	CHAR(8),
	"node12_ID"		INTEGER,		
	"node12_Attr"	CHAR(8),
	"node13_ID"		INTEGER,		
	"node13_Attr"	CHAR(8),
	"node14_ID"		INTEGER,		
	"node14_Attr"	CHAR(8),
	"node15_ID"		INTEGER,		
	"node15_Attr"	CHAR(8),
	"node16_ID"		INTEGER,		
	"node16_Attr"	CHAR(8),
	"node17_ID"		INTEGER,		
	"node17_Attr"	CHAR(8),
	"node18_ID"		INTEGER,		
	"node18_Attr"	CHAR(8),
	"node19_ID"		INTEGER,		
	"node19_Attr"	CHAR(8),
	"node20_ID"		INTEGER,		
	"node20_Attr"	CHAR(8)) STORAGE(ON "MNGT_SYS", CLUSTERBTR);
	
--创建组合聚簇索引
CREATE CLUSTER INDEX topoloNode on MNGT_SYS.topoloNode("zoomLevelID", "upperLevelAreaID");


--2-10拓扑文件上传下载
create table topolofileUpDown(
	"fileID"		INTEGER IDENTITY(1,1) NOT NULL,		
	"upDownType"	NUMBER(4) NOT NULL,		
	"fileName"		VARCHAR(128) NOT NULL,	
	"filePath"		VARCHAR(8) NOT NULL,	
	"operatorID"	INTEGER NOT NULL,
	"operateTime"	TIMESTAMP(6) NOT NULL,
	"fileSize"		INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("fileID")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--2-11逻辑网络登记表
create table NetworkRegTbl(
	"netNo"		CHAR(10) NOT NULL,		
	"netName"	VARCHAR(64) NOT NULL,		
	"netType"	NUMBER(1) NOT NULL,	
	"netIP"		VARCHAR(16) NOT NULL,	
	"netMask"	VARCHAR(16) NOT NULL,
	"manageMode"	NUMBER(1) NOT NULL,
	"description"	VARCHAR(128),
NOT CLUSTER PRIMARY KEY("netNo")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--【3.采集项配置类】
--3-1Agent注册表
create table AgentRegTbl(
	"agentName"			VARCHAR(32) NOT NULL,		
	"defaultPort"		NUMBER(6) NOT NULL,		
	"defaultAccount"	VARCHAR(32),	
	"defaultPass"		VARCHAR(16),	
	"description"		VARCHAR(128),
NOT CLUSTER PRIMARY KEY("agentName")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--3-2注册Agent实现的状态信息分组
create table Agent_InfoGroup(
	"agentName"		VARCHAR(32) NOT NULL,		
	"infoGroupName"	VARCHAR(32) NOT NULL,		
	"byName"		VARCHAR(64),	
	"infoGroupID"	NUMBER(6) NOT NULL,	
	"description"	VARCHAR(128),
NOT CLUSTER PRIMARY KEY("infoGroupName"))
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--3-3.信息分组中的信息点表
create table InfoGroup_InfoItem(
	"infoGroupName"	VARCHAR(32) NOT NULL,		
	"infoItemName"	VARCHAR(32) NOT NULL,		
	"itemByName"	VARCHAR(32),	
	"valueType"		VARCHAR(32) NOT NULL,	
	"typeORA"		VARCHAR(32),			
	"infoItemID"	NUMBER(6) NOT NULL,
	"description"	VARCHAR(128),
NOT CLUSTER PRIMARY KEY("infoGroupName", "infoItemName"),
CONSTRAINT "InfoGroup_InfoItem_infoGroupName" FOREIGN KEY("infoGroupName") REFERENCES "MNGT_SYS"."AGENT_INFOGROUP"("infoGroupName") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--3-4设备上安装的代理
create table EqpAgent(
	"eqpNo"		CHAR(10) NOT NULL,
	"agentName"	VARCHAR(32) NOT NULL,
	"queryPort"	NUMBER(6),
--	"snmpAccount"	VARCHAR(32),	
--	"snmpPass"	VARCHAR(16),
NOT CLUSTER PRIMARY KEY("eqpNo","agentName"),
CONSTRAINT "EqpAgent_eqpNo" FOREIGN KEY("eqpNo") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EqpAgent_agentName" FOREIGN KEY("agentName") REFERENCES "MNGT_SYS"."AGENTREGTBL"("agentName") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--3-5设备上要查询的状态信息点
create table EqpInfoItem(
	"eqpNo"			CHAR(10)	NOT NULL,
	"agentName"		VARCHAR(32)	NOT NULL,
	"infoGroupName"	VARCHAR(32)	NOT NULL,
	"infoItemName"	VARCHAR(32)	NOT NULL,
NOT CLUSTER PRIMARY KEY("eqpNo", "agentName", "infoGroupName", "infoItemName"),
CONSTRAINT "EqpInfoItem_eqpNo" FOREIGN KEY("eqpNo") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EqpInfoItem_agentName" FOREIGN KEY("agentName") REFERENCES "MNGT_SYS"."AGENTREGTBL"("agentName") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EqpInfoItem_item" FOREIGN KEY("infoGroupName", "infoItemName") REFERENCES "MNGT_SYS"."INFOGROUP_INFOITEM"("infoGroupName", "infoItemName") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--【4.采集信息类】
--4-1系统状态
create table TblValuesSystemStats(
	"objectID"			CHAR(10) NOT NULL,
	"valueIndex"		NUMBER(6),
	"collectTime"		TIMESTAMP(6)	NOT NULL,
	"hrSystemDate"		TIMESTAMP(6),
	"hrSystemMaxProcesses"	NUMBER(38),
	"hrSystemNumUsers"	NUMBER(38),
	"hrSystemProcesses"	NUMBER(38),
	"hrSystemUptime"	TIMESTAMP(6),
	"ssCpuSystem"		NUMBER(38),
	"ssCpuUser"			NUMBER(38),
	"ssCpuIdle"			NUMBER(38),
NOT CLUSTER PRIMARY KEY("objectID", "collectTime"),
CONSTRAINT "TblValuesSystemStats_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);
   
--4-2进程信息
create table TblValuesProcesses(
	"objectID"		CHAR(10) NOT NULL,
	"valueIndex"	NUMBER(6),
	"collectTime"	TIMESTAMP(6)	NOT NULL,
	"pitName"		VARCHAR(128),
	"pitPid"		NUMBER(38),
	"pitStart"		VARCHAR(100),
	"pitTime"		VARCHAR(100),
	"pitStat"		VARCHAR(38),
	"pitCpu"		NUMBER(38),
	"pitMem"		NUMBER(38),
	"pitUser"		VARCHAR(128),
NOT CLUSTER PRIMARY KEY("objectID", "collectTime"),
CONSTRAINT "TblValuesProcesses_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--4-3硬盘信息
create table TblValuesDisks(
	"objectID"		CHAR(10) NOT NULL,
	"valueIndex"	NUMBER(6),
	"collectTime"	TIMESTAMP(6)	NOT NULL,
	"dskDevice"		VARCHAR(128),
	"dskPath"		VARCHAR(128),
	"dskTotal"		NUMBER(38),
	"dskUsed"		NUMBER(38),
	"dskAvail"		NUMBER(38),
	"dskPercent"	NUMBER(38),
NOT CLUSTER PRIMARY KEY("objectID", "collectTime"),
CONSTRAINT "TblValuesDisks_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--4-4内存信息
create table TblValuesMemory(
	"objectID"		CHAR(10) NOT NULL,
	"valueIndex"	NUMBER(6),
	"collectTime"	TIMESTAMP(6)	NOT NULL,
	"memTotalReal"	NUMBER(38),
	"memTotalSwap"	NUMBER(38),
	"memShared"		NUMBER(38),
	"memAvailReal"	NUMBER(38),
	"memBuffer"		NUMBER(38),
NOT CLUSTER PRIMARY KEY("objectID", "collectTime"),
CONSTRAINT "TblValuesMemory_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--4-5网络接口表
create table TblValuesIfsStat(
	"objectID"		CHAR(10) NOT NULL,
	"valueIndex"	NUMBER(6),
	"collectTime"	TIMESTAMP(6)	NOT NULL,
	"ifDescr"		VARCHAR(100),
	"ifType"		VARCHAR(100),
	"ifSpeed"		NUMBER(38),
	"ifOperStatus"	NUMBER(38),
	"ifInOctets"	NUMBER(38),
	"ifInErrors"	NUMBER(38),
	"ifOutOctets"	NUMBER(38),
	"ifOutErrors"	NUMBER(38),
NOT CLUSTER PRIMARY KEY("objectID", "collectTime"),
CONSTRAINT "TblValuesIfsStat_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--4-6设备固件信息
create table EqpHardInfo(
	"objectID"		CHAR(10) NOT NULL,
	"OSType"		VARCHAR(32),
	"SysVersion"	VARCHAR(32),
	"cpuType"		VARCHAR(32),
	"diskSize"		NUMBER(38),
	"memorySize"	NUMBER(38),
NOT CLUSTER PRIMARY KEY("objectID"),
CONSTRAINT "EqpHardInfo_objectID" FOREIGN KEY("objectID") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--【5.告警配置类】
--5-1漏洞表
create table Vulnerability(
	"id"			VARCHAR(10) NOT NULL,
	"name"			VARCHAR(10),
	"published"		VARCHAR(32),
	"severity"		VARCHAR(10),
	"CVSS_score"	VARCHAR(10),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--5-2漏洞分类表
create table CWE(
	"id"			VARCHAR(10) NOT NULL,
	"name"			VARCHAR(50),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--5-3事件类型表
create table EventTypeTbl(    
	"id"			INTEGER NOT NULL,
	"format"		VARCHAR(128) NOT NULL,
	"assetType"	NUMBER(2) NOT NULL,
	"description"	VARCHAR(320),
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--5-4报警类型表
create table AlertTypeTbl(    
	"id"			INTEGER NOT NULL,
	"typeName"		VARCHAR(128) NOT NULL,
	"description"	VARCHAR(128),
	"mixType"		INTEGER, --0表示基本报警类型，1表示混合报警类型
	"mixTypeValue"  VARCHAR, --混合的多个基本报警类型id组成的字符串，以","隔开
NOT CLUSTER PRIMARY KEY("id")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--5-5威胁信息登记表
create table AlertInfoRegTbl(
	"id"		INTEGER IDENTITY(1,1) NOT NULL,
	"alertTypeID"	INTEGER NOT NULL,
	"CVE"			VARCHAR(10), 
	"name"			VARCHAR(64) NOT NULL,
	"procID"		INTEGER NOT NULL,
	"description"	VARCHAR(128), 
NOT CLUSTER PRIMARY KEY("id"),
CONSTRAINT "AlertInfoRegTbl_alertTypeID" FOREIGN KEY("alertTypeID") REFERENCES "MNGT_SYS"."ALERTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--5-6攻击场景类型登记表
create table AlarmRegTbl(
	"alarmCtgID"	INTEGER IDENTITY(1,1) NOT NULL,
	"name"			NUMBER(10) NOT NULL,
NOT CLUSTER PRIMARY KEY("alarmCtgID")) STORAGE(ON "MNGT_SYS", CLUSTERBTR);


--5-7应用程序告警登记表
create table ProgramAlertRegTbl(
	"programName"	VARCHAR(32) NOT NULL,
	"eventTypeID"		INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("programName", "eventTypeID"),
CONSTRAINT "ProgramAlertRegTbl_programName" FOREIGN KEY("programName") REFERENCES "MNGT_SYS"."PROGRAMREGTBL"("programName") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "ProgramAlertRegTbl_eventTypeID" FOREIGN KEY("eventTypeID") REFERENCES "MNGT_SYS"."EVENTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--【6.告警-分析类】
--6-1原始事件表
--事件表
create table EventTbl(
	"id"			INTEGER IDENTITY(1,1) NOT NULL,
	"time"			TIMESTAMP(4) NOT NULL,
	"priority"		INTEGER NOT NULL,
	"eventTypeID"		INTEGER NOT NULL,
	"eqpNo"	CHAR(10) NOT NULL,
	"pluginID"		INTEGER,
	"rank"			NUMBER(2) NOT NULL,
	"category"		INTEGER	NOT NULL,
NOT CLUSTER PRIMARY KEY("id"),
CONSTRAINT "EventTbl_eventTypeID" FOREIGN KEY("eventTypeID") REFERENCES "MNGT_SYS"."EVENTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EventTbl_eqpNo" FOREIGN KEY("eqpNo") REFERENCES "MNGT_SYS"."EQPREGTBL"("eqpNo") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--6-2警报表
create table AlertTbl(
	"id"			INTEGER IDENTITY(1,1) NOT NULL,
	"reportTime"	TIMESTAMP(4) NOT NULL,
	"startTime"		TIMESTAMP(4),
	"lastTime"		TIMESTAMP(4),
	"reportLevel"	INTEGER NOT NULL,
	"confidence"	NUMBER(2, 2) NOT NULL, 
	"seriousLevel"	INTEGER	NOT NULL, 
	"ugentLevel"	INTEGER	NOT NULL, 
	"assetType"	INTEGER,
	"targetAssets"	VARCHAR(50), 
	"alertTypeID"	INTEGER NOT NULL,
	"alertProc"	INTEGER,
	"attackSource"	VARCHAR(50),
	"alertRegion"	VARCHAR(256), 
	"strategy"		VARCHAR(256),
	"isSolve"		NUMBER(1),
NOT CLUSTER PRIMARY KEY("id"),
CONSTRAINT "AlertTypeTbl_alertTypeID" FOREIGN KEY("alertTypeID") REFERENCES "MNGT_SYS"."ALERTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE) 
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--6-3攻击场景表
create table AlarmTbl(
	"id"				INTEGER IDENTITY(1,1) NOT NULL,
	"alarmCtgID"		INTEGER NOT NULL,
	"rank"				NUMBER(2), 
	"securityDomain"	VARCHAR(24),
	"startTime"			TIMESTAMP(6),
	"endTime"			TIMESTAMP(6), 
NOT CLUSTER PRIMARY KEY("id"),
CONSTRAINT "AlarmTbl_alarmCtgID" FOREIGN KEY("alarmCtgID") REFERENCES "MNGT_SYS"."ALARMREGTBL"("alarmCtgID") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--6-4事件-警报表
create table Event_AlertTbl(
	"Event_id"		INTEGER NOT NULL,
	"Alert_id"		INTEGER NOT NULL,
	"relevancyStrength"		DOUBLE,
NOT CLUSTER PRIMARY KEY("Event_id", "Alert_id"),
CONSTRAINT "Event_AlertTbl_Alert_id" FOREIGN KEY("Alert_id") REFERENCES "MNGT_SYS"."ALERTTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "Event_AlertTbl_Event_id" FOREIGN KEY("Event_id") REFERENCES "MNGT_SYS"."EVENTTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--6-5事件类型-报警类型表
create table EventType_AlertTypeTbl(
	"EventType_id"		INTEGER NOT NULL,
	"AlertType_id"		INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("EventType_id","AlertType_id"),
CONSTRAINT "EventType_AlertTypeTbl_AlertType_id" FOREIGN KEY("AlertType_id") REFERENCES "MNGT_SYS"."ALERTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "EventType_AlertTypeTbl_EventType_id" FOREIGN KEY("EventType_id") REFERENCES "MNGT_SYS"."EVENTTYPETBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);

--6-6警报-场景表
create table Alert_Alarm(
	"Alert_id"			INTEGER NOT NULL,
	"Alarm_id"			INTEGER NOT NULL,
NOT CLUSTER PRIMARY KEY("Alert_id", "Alarm_id"),
CONSTRAINT "Alert_Alarm_Alarm_id" FOREIGN KEY("Alarm_id") REFERENCES "MNGT_SYS"."ALARMTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE,
CONSTRAINT "Alert_Alarm_Alert_id" FOREIGN KEY("Alert_id") REFERENCES "MNGT_SYS"."ALERTTBL"("id") ON DELETE CASCADE  ON UPDATE CASCADE)
STORAGE(ON "MNGT_SYS", CLUSTERBTR);
