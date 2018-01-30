--1-1系统参数
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SERVER_NO','0001-00001','管理服务器编号');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SERVER_IP','10.224.0.25','管理服务器IP');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SERVER_PORT','17911','服务器通信端口');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('MANAGE_SPACE_IP','10.224.0.0','管理空间IP');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('MANAGE_SPACE_MASK','255.255.0.0','管理空间掩码');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('TRAP_RECEIVE_PORT','17911','管理信息接收端口');
--insert into SysargTbl values('SNMP_QUERIER_NUM','5','snmp查询线程数');
--insert into SysargTbl values('SNMP_QUERY_INTERVAL','5','snmp查询时间间隔（分钟）');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('TOPEXPLORE_INTERVAL','30','拓扑发现时间间隔（分钟）');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SUPER_SERVER_IP','10.210.0.90','上级服务器IP');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SUPER_SERVER_PORT','17911','上级服务器端口');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('SERVER_TRANS_PROTOCOL','TCP','服务器通信协议');
insert into "MNGT_SYS"."SYSARGTBL"("argName","argvalue","description") values('TRAP_TRANS_PROTOCOL','TCP','策略传输协议');

SET IDENTITY_INSERT MNGT_SYS.ROLELIST ON;
--1-2角色表
insert into "MNGT_SYS"."ROLELIST"("roleId", "roleName", "description", "priority", "updateTime") values(1, 'sys_admain', '系统管理员', 1, NULL);
insert into "MNGT_SYS"."ROLELIST"("roleId", "roleName", "description", "priority", "updateTime") values(2, '设备管理员', NULL, 5, NULL);
insert into "MNGT_SYS"."ROLELIST"("roleId", "roleName", "description", "priority", "updateTime") values(3, '审计管理员', NULL, 10, NULL);

SET IDENTITY_INSERT MNGT_SYS.USERLIST ON;
--1-3用户表
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(1, 'admin', 'nsp测试用户1', 1, 'a66abb5684c45962d887564f08346e8d', '2017-08-08 8:00:00', '2027-08-08 8:00:00');
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(2, 'nspuser2', 'nsp测试用户2', 5, '123456', '2017-08-08 8:00:00', '2027-08-08 8:00:00');
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(3, 'nspuser3', 'nsp测试用户3', 8, '123456', '2017-08-08 8:00:00', '2027-08-08 8:00:00');
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(4, 'nspuser4', 'nsp测试用户4', 1, '123456', '2017-08-08 8:00:00', '2027-08-08 8:00:00');
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(5, 'nspuser5', 'nsp测试用户5', 5, '123456', '2017-08-08 8:00:00', '2027-08-08 8:00:00');
insert into "MNGT_SYS"."USERLIST"("userId", "userName", "description", "userLevels", "userPassword", "updateTime", "dueTime") 
VALUES(6, 'nspuser6', 'nsp测试用户6', 8, '123456', '2017-08-08 8:00:00', '2027-08-08 8:00:00');

SET IDENTITY_INSERT MNGT_SYS.SECDOMAINTBL ON;
--1-4分域表
insert into "MNGT_SYS"."SECDOMAINTBL"("id", "name", "description") 
VALUES(1, '安全域1', NULL);
insert into "MNGT_SYS"."SECDOMAINTBL"("id", "name", "description") 
VALUES(2, '安全域2', NULL);
insert into "MNGT_SYS"."SECDOMAINTBL"("id", "name", "description") 
VALUES(3, '安全域3', NULL);
insert into "MNGT_SYS"."SECDOMAINTBL"("id", "name", "description") 
VALUES(4, '安全域4', NULL);

SET IDENTITY_INSERT MNGT_SYS.PERMISSIONCTGLIST ON;
--1-5权限类别表
insert into "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode", "name", "description", "updateTime") 
VALUES(1, '设备管理', NULL, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode", "name", "description", "updateTime") 
VALUES(2, '拓扑管理', NULL, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode", "name", "description", "updateTime") 
VALUES(3, '报警管理', NULL, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode", "name", "description", "updateTime") 
VALUES(4, '本机系统管理', NULL, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."PERMISSIONCTGLIST"("permissionCtgcode", "name", "description", "updateTime") 
VALUES(5, '查看操作日志', NULL, '2017-08-08 8:00:00');

SET IDENTITY_INSERT MNGT_SYS.ACTIONLIST ON;
--1-6动作表
insert into "MNGT_SYS"."ACTIONLIST"("actionCode", "actionName", "description", "updateTime") 
VALUES(1, '查看', NULL, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ACTIONLIST"("actionCode", "actionName", "description", "updateTime") 
VALUES(2, '修改', NULL, '2017-08-08 8:00:00');

--1-7用户角色安全域表
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(1, 1, 1, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(1, 1, 2, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(1, 1, 3, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(1, 1, 4, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(2, 2, 1, 5, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(2, 2, 2, 5, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(2, 2, 3, 5, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(2, 2, 4, 5, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(3, 3, 1, 8, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(3, 3, 2, 8, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(3, 3, 3, 8, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(3, 3, 4, 8, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(4, 2, 4, 8, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."USERROLESECDOMAIN"("userId", "roleId", "secDomainId", "rolePriority", "updateTime") 
VALUES(5, 2, 3, 8, '2017-08-08 8:00:00');

--1-8角色策略动作表
--系统管理员
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(1, 4, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(1, 4, 2, '2017-08-08 8:00:00');
--设备管理员
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 1, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 1, 2, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 2, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 2, 2, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 3, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(2, 3, 2, '2017-08-08 8:00:00');
--审计管理员
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(3, 5, 1, '2017-08-08 8:00:00');
insert into "MNGT_SYS"."ROLESTRATEGYACTION"("roleId", "permissionCtgcode", "actionCode", "updateTime") 
VALUES(3, 5, 2, '2017-08-08 8:00:00');

--【2设备管理类】
--2-1软件平台枚举表
insert into "MNGT_SYS"."CPE"("id", "name", "vendor", "product", "version") 
VALUES(1, '14.04.1-Ubuntu', NULL, NULL, NULL);
insert into "MNGT_SYS"."CPE"("id", "name", "vendor", "product", "version") 
VALUES(2, 'windows7', NULL, NULL, NULL);
insert into "MNGT_SYS"."CPE"("id", "name", "vendor", "product", "version") 
VALUES(3, 'Oracle数据库', NULL, NULL, 'V11.2');
insert into "MNGT_SYS"."CPE"("id", "name", "vendor", "product", "version") 
VALUES(4, '达梦数据库', NULL, NULL, 'v7.1.3.15');

SET IDENTITY_INSERT MNGT_SYS.EQPCLASS ON;
--2-2-1 设备分类表
insert into "MNGT_SYS"."EQPCLASS"("id", "name", "pic") 
VALUES(1, '网络设备', '');
insert into "MNGT_SYS"."EQPCLASS"("id", "name", "pic") 
VALUES(2, '安全设备', '');
insert into "MNGT_SYS"."EQPCLASS"("id", "name", "pic") 
VALUES(3, '服务器', '');
insert into "MNGT_SYS"."EQPCLASS"("id", "name", "pic") 
VALUES(4, '终端', '');

SET IDENTITY_INSERT MNGT_SYS.EQPTYPE ON;
--2-2-2 设备类型分类表
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(1, 1, '天基骨干卫星安全接入网关', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(2, 1, '宽带卫星安全接入网关', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(3, 1, '卫星移动安全接入网关', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(4, 1, '异构网间安全互联网关', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(5, 1, '地面网间安全互联网关', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(6, 4, '高速航天器终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(7, 4, '天基骨干网地面终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(8, 4, 'Ka大容量宽带便携终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(9, 4, 'Ka大容量宽带固定终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(10, 4, '高轨卫星移动军用手持车载终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(11, 4, '高轨卫星移动军用民用车载终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(12, 4, '低轨星座手持终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(13, 4, '低轨星座车载终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(14, 4, 'Ku（FDMA）便携终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(15, 4, 'Ku（FDMA）固定终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(16, 4, 'Ku（TDMA）便携终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(17, 4, 'Ku（TDMA）固定终端', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(18, 1, '路由器', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(19, 1, '核心交换机', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(20, 1, '三层交换机', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(21, 1, '二层交换机', '');
insert into "MNGT_SYS"."EQPTYPE"("id", "cfg", "name", "pic") 
VALUES(25, 3, '管理服务器', '');

--2-3设备注册表
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00001', '管理服务器', 25, 1, 1, 1, 1, 'Linux', NULL, NULL, '10.224.0.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00002', '天基接入网关', 1, 1.0, 3, 1, 1, 'Linux', NULL, NULL, '10.224.1.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00004', '路由器1', 20, 1, 1, 1, 1, 'Linux', NULL, NULL, '10.224.11.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00010','路由器2', 20, 0.5, 4, 1, 1, 'Linux', NULL, NULL, '10.224.12.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00020', '路由器3', 20, 0.6, 3, 1, 1, 'Linux', NULL, NULL, '10.224.13.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00030', '路由器4', 20, 0.6, 4, 1, 1, 'Linux', NULL, NULL, '10.224.14.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00040', '路由器5', 20, 0.4, 4, 1, 1, 'Linux', NULL, NULL, '10.224.15.25', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00006', '交换机1', 21, 0.3, 4, 1, 1, 'Linux', NULL, NULL, '10.224.11.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00041', '交换机2', 21, 0.4, 4, 1, 1, 'Linux', NULL, NULL, '10.224.12.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00042', '交换机3', 21, 0.5, 3, 1, 1, 'Linux', NULL, NULL, '10.224.13.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00044', '交换机4', 21, 0.6, 2, 1, 1, 'Linux', NULL, NULL, '10.224.14.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00065', '交换机5', 21, 0.7, 2, 1, 1, 'Linux', NULL, NULL, '10.224.15.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00066', '交换机6', 21, 0.8, 1, 1, 1, 'Linux', NULL, NULL, '10.224.17.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00067', '交换机7', 21, 0.4, 4, 1, 1, 'Linux', NULL, NULL, '10.224.18.26', '管理平台', NULL, NULL);
insert into "MNGT_SYS"."EQPREGTBL"("eqpNo",  "name", "assetType", "assetValue", "securityDomain", "workMode", "manageMode", "os", "account", "pass", "ip", "location", "serial", "contaction") 
VALUES('0001-00068', '交换机8', 21, 0.6, 3, 1, 1, 'Linux', NULL, NULL, '10.224.19.26', '管理平台', NULL, NULL);

--2-5应用程序注册表
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('密码资源管理系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('身份认证管理系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('接入鉴权系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('网间互联安全控制系统',NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('威胁情报汇集系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('威胁融合分析与态势预警系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('全网安全设备统一管理系统', NULL, NULL);
insert into "MNGT_SYS"."PROGRAMREGTBL"("programName", "defaultPath", "description") 
VALUES('指挥系统', NULL, NULL);

--2-6设备上的应用程序
insert into "MNGT_SYS"."EQPPROGRAM"("eqpNo", "programName", "path") 
VALUES('0001-00001', '威胁情报汇集系统', NULL);
insert into "MNGT_SYS"."EQPPROGRAM"("eqpNo", "programName", "path") 
VALUES('0001-00001', '指挥系统', NULL);


SET IDENTITY_INSERT MNGT_SYS.TOPOLONODE ON;
--2-8拓扑表
--第一层级
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(0, '1234567890', 1, 0, 0, 4, 4, 8, 0, 0, 'Hardware-Mobile-Phone-icon', '', '低轨星座手持终端', '', 160,524, 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1, '1234567890', 1, 0, 0, 5, 5, 8, 0, 0, 'terminal_108', '', 'Ku(TDMA)便携终端', '', 160,126,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr") 
VALUES(2, '1234567890', 1, 0, 0, 2, 2, 8, 0, 0, 'terminal_102', '', 'Ka大容量宽带便携终端','', 160,249,1, 1, 0, 0,'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(3, '1234567890', 1, 0, 0, 2, 2, 8, 0, 0, 'terminal_102', '', 'Ka大容量宽带便携终端','', 160,301,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(4, '1234567890', 1, 0, 0, 2, 2, 8, 0, 0, 'terminal_102', '', 'Ka大容量宽带便携终端', '', 160,190, 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(5, '1234567890', 1, 0, 0, 3, 3, 8, 0, 0, 'terminal_103', '', '高轨卫星移动军用手持终端','', 160,359,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(6, '1234567890', 1, 0, 0, 3, 3, 8, 0, 0, 'terminal_103','',  '高轨卫星移动军用手持终端','', 160,414,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');


insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(7, '1234567890', 1, 0, 0, 1, 1, 8, 0, 0, 'satellite_506', '', '中低轨航天器','', 160,470,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(8, '1234567890', 1, 0, 0, 4, 4, 8, 0, 0, 'Hardware-Mobile-Phone-icon', '', '低轨星座手持终端', '', 160,36, 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');											

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")	
VALUES(9, '1234567890', 1, 0, 0, 4, 4, 8, 0, 0, 'terminal_106', '', '低轨星座车载终端', '', 160,581,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');					

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(10, '1234567890', 1, 0, 0, 5, 5, 8, 0, 0, 'terminal_107', '', 'Ku(FDMA)便携终端', '', 160,639,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")										
VALUES(11, '1234567890', 1, 0, 0, 5, 5, 8, 0, 0, 'terminal_107', '', 'Ku(FDMA)便携终端', '', 160,696,1 , 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(12, '1234567890',1, 0, 0, 5, 5, 8, 0, 0, 'terminal_107', '', 'Ku(FDMA)便携终端', '', 160,752,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(13, '1234567890', 1, 0, 0, 5, 5, 8, 0, 0, 'terminal_107', '', 'Ku(FDMA)便携终端', '', 160,752,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(14, '1234567890', 1, 0, 0, 3, 3, 8, 0, 0, 'terminal_104', '', '高轨卫星移动引用车载终端', '', 160,865,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(15, '1234567890',1, 0, 0, 12, 12, 10, 0, 0, 'access_201', '', '星上处理节点', '', 331,61,1, 1, 1, 0, 4, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(16, '1234567890',1, 1, 1, 12, 12, 10, 0, 0, 'access_202', '', '星上处理星簇', '', 339,162,1, 1, 1, 0, 2, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(17, '1234567890',1, 1, 1, 12, 12, 10, 0, 0, 'access_203', '', '透明转发星簇', '', 340,268,1, 1, 1, 0, 3, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(18, '1234567890',1, 1, 1, 13, 13, 10, 0, 0, 'access_206', '', '星上处理星簇', '', 336,396,1, 1, 1, 0, 5, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(19, '1234567890', 1, 1, 1, 14, 14, 10, 0, 0, 'access_207', '', '66颗低轨卫星组网', '', 330,497,1, 1, 3, 0, 0, '', 1, '', 9, '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(20, '1234567890',1, 1, 1, 15, 15,10, 0, 0, 'access_207', '', '透明转发星簇','', 331,590,1, 1, 1, 0, 10, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');									

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(21, '1234567890', 1, 0, 0, 13, 13, 10, 0, 0, 'access_204', '', '卫星', '', 343,690,1, 1, 3, 0, 11, '', 12, '', 13, '', '', '', '', '', '', '', '', '', '', '', '', '', 
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(22, '1234567890', 1, 0, 0, 15, 15, 10, 0, 0, 'access_204', '', '卫星', '', 339,788,1, 1, 2, 0, 6, '', 14, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(23, '1234567890', 1, 0, 0, 21, 21, 1, 0, 0, 'combinatation_710', '', '天基安全接入网关', '', 542,38,1, 1, 3, 1, 7, '', 8, '', 25, '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(24, '1234567890', 1, 0, 0, 21, 21, 2, 0, 0, 'satellite_502', '', '路由单元', '', 538,195,1, 1, 3, 3, 15, '', 18, '', 25, '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(25, '1234567890', 1, 0, 0, 21, 21, 2, 0, 0, 'satellite_502', '', '路由单元','', 538,128,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(26, '1234567890', 1, 0, 0, 22, 22, 8, 0, 0, 'terminal_110', '', 'Ka大容量固定终端', '', 538,257,1, 1, 1, 0, 16, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(27, '1234567890', 1, 3, 1, 23, 23, 11, 0, 0, 'djyg_mib', '', '关口站终端', '', 504,532,1, 1, 1, 1, 19, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(28, '1234567890', 1, 3, 1, 24, 24, 11, 0, 0, 'djyg_mib', '', '关口站终端', '', 503,637,1, 1, 1, 1, 20, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(29, '1234567890', 1, 0, 0, 28, 28, 8, 0, 0, 'djyg_mib', '', 'Ku(TDMA)固定终端', '', 503,832,1, 1, 1, 1, 21, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(30, '1234567890', 1, 3, 1, 26, 26, 11, 0, 0, 'djyg_mib', '', '关口站终端', '', 495,321,1, 1, 1, 1, 17, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');


insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(31, '1234567890', 1, 3, 1, 24, 24, 11, 0, 0, 'djyg_mib', '', 'S移动关口站', '', 499,426,1, 1, 1, 1, 22, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")	
VALUES(32, '1234567890', 1, 0, 0, 27, 27, 8, 0, 0, 'djyg_mib', '', 'Ku(FDMA)固定终端', '', 507,734,1, 1, 1, 1, 21, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(33, '1234567890', 1, 0, 0, 41, 41, 12, 0, 0, 'combinatation_709', '', '一体化网络互联节点','', 689,45,1, 1, 3, 3, 40, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(34, '1234567890',1, 0, 0, 41, 41, 11, 0, 0, 'combinatation_702', '', '地基网','', 695,190,1, 1, 11, 11, 26, '', 27, '', 28, '', 29, '', 30, '', 31, '', 32, '', 35, '', 33, '', 38, '', 39, '', 
		'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(35, '1234567890',1, 0, 0, 21, 21, 8, 0, 0, 'terminal_110', '', '天基骨干网地面终端', '', 705,312,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(36, '1234567890',1, 0, 0, 21, 21, 2, 0, 0, 'satellite_503', '', '骨干网节点', '', 707,400,1, 1, 1, 1, 35, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(37, '1234567890',1, 0, 0, 21, 21, 2, 0, 0, 'satellite_502', '', '路由单元','', 715,562,1, 1, 3, 3, 24, '', 25, '', 36, '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(38, '1234567890',1, 0, 0, 31, 31, 2, 0, 0, 'combinatation_708', '', '一体化网络互联节点','', 915,32,1, 1, 1, 1, 46, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(39, '1234567890',1, 0, 0, 32, 32, 2, 0, 0, 'combinatation_709', '', '一体化网络互联节点','', 919,117,1, 1, 1, 1, 47, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');				

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")	
VALUES(40, '1234567890', 1, 2, 0, 41, 41, 11, 1, 0, 'netServiceSupportPlat', '', '网络服务支撑平台', '', 922,202,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');


insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")	
VALUES(46, '1234567890', 1, 0, 0, 31, 31, 12, 0, 0, 'tdyth_801', '', '移动网', '', 1112,29,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(47, '1234567890',1, 0, 0, 32, 32, 12, 0, 0, 'tdyth_802', '', '互联网', '', 1105,131,1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');



insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(999, '1234567890', 2, 3, 1, 22, 0, 11, 0, 0, 'combinatation_702', '', '地基网','', 1100, 500, 1, 1, 1, 1, 1007, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 
		'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1000, '1234567890',2, 3, 1, 22, 0, 10, 0, 0, 'access_201', '', '星上处理节点', '', 100, 100, 1, 1, 1, 1, 1001, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")											
VALUES(1001, '1234567890', 2, 3, 2, 22, 9, 13, 0, 0, 'satelliteline', '', '卫星天线', '', 100, 500, 1, 1, 1, 1, 1002, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');	
	
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1002, '1234567890', 2, 3, 2, 22, 4, 2, 0, 0, 'router', '', '路由器', '', 400, 500, 1, 1, 2, 2, 1003, '', 1008, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
			
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1003, '1234567890', 2, 3, 2, 22, 8, 4, 0, 0, 'firewall', '', '防火墙', '', 550, 500, 1, 1, 5, 5, 1015, '', 1010, '', 1011, '', 1012, '', 1004, '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');			
						
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1004, '1234567890', 2, 3, 2, 22, 8, 1, 0, 0, 'dataGateway', '', '信关站数据网关', '', 660, 500, 1, 1, 1, 1, 1005, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');			
			
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1005, '1234567890', 2, 3, 2, 22, 8, 4, 0, 0, 'firewall', '', '防火墙', '', 750, 500, 1, 1, 4, 4, 1006, '', 1013, '', 1014, '', 1016, '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1006, '1234567890', 2, 3, 2, 22, 8, 2, 0, 0, 'router', '', '路由器', '', 850, 500, 1, 1, 2, 2, 1007, '', 1009, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1007, '1234567890', 2, 3, 2, 22, 8, 4, 0, 0, 'firewall', '', '防火墙', '', 950, 500, 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(1008, '1234567890', 2, 3, 2, 22, 3, 1, 0, 0, 'interconnectedcontrol_gateway', '', '异构网间安全互联网关', '', 400, 300, 1, 1, 1, 1, 1081, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")										
VALUES(1009, '1234567890', 2, 3, 2, 22, 8, 7, 0, 0, 'voip', '', '专用VoIP系统', '', 850, 700, 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")										
VALUES(1081, '1234567890', 2, 3, 2, 22, 0, 3, 0, 1, 'sw3', '', '交换机', '', 400, 200, 1, 1, 8, 2, 2504, '', 2507, '', 2501, '', 2502, '', 2503, '', 2505, '', 2506, '', 2508, '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');	

--ID：1081	交换机下面的服务器和终端手动添加，ID从2501-2508
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2501, '1234567890', 3, 3, 3, 22, 1, 7, 1, 0, 'interconnectedcontrol_sys', '', '网间互联安全控制系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');		
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2502, '1234567890', 3, 3, 3, 22, 1, 7, 1, 0, 'authentication_sys', '', '身份认证管理系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2503, '1234567890', 3, 3, 3, 22, 1, 7, 1, 0, 'accessAuth_sys', '', '接入鉴权系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2504, '1234567890', 2, 3, 2, 22, 1, 7, 0, 0, 'serverCluster', 'cryptoResource_sys', '服务器群', '密码资源管理系统', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2505, '1234567890', 3, 3, 3, 22, 1, 7, 1, 0, 'analyze_sys', '', '威胁融合分析与态势预警系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2506, '1234567890', 3, 3, 3, 22, 1, 7, 1, 0, 'MNGT_SYS', '', '安全设备统一管理系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2507, '1234567890', 2, 3, 3, 22, 2, 9, 0, 0, 'pc', 'pcCluster', '终端1', '终端群', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2508, '1234567890', 3, 3, 3, 22, 2, 9, 1, 0, 'pc', '', '终端2', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		 
--ID：1010	信关站控制器下面的服务器和终端手动添加，ID从2511-2513		 
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")	
VALUES(1010, '1234567890', 2, 3, 2, 22, 4, 2, 0, 1,'earthstationControl', '', '信关站控制器', '', 520, 700, 1, 1, 3, 2, 2511, '', 2512, '', 2513, '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2511, '1234567890', 2, 3, 3, 22, 6, 7, 0, 0, 'AAA_sys', '', 'AAA系统', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2512, '1234567890', 2, 3, 2, 22, 6, 7, 1, 0, 'dbServer_sys', 'cryptoResource_sys', '数据库服务器', '服务器群', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
											
insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
VALUES(2513, '1234567890', 3, 3, 2, 22, 7, 9, 0, 0,'pc', '', '终端3', '', '', '', 1, 1, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');		 
		 
		 		 
--第二、三层拓扑节点
--使用存储过程循环插入三层交换机（ID:1011-1016），二层交换机（ID：1021-1025,1031-1035,1041-1045,1051-1055,1061-1065,1071-1075）
--PC机（ID：3001-3050,3101-3150,3201-3250,3301-3350,3401-3450,3501-3550）
CREATE OR REPLACE PROCEDURE PROC_BLOCK AS
i int := 1011;
i2 int := 1;		--三层交换机下联2层交换机计数
i3 int := 1;		--二层交换机下联PC机计数
cascadedevSWID int := 1020;
cascadedevPCID int := 3000;
j int := 1;
--使用数组定义三层交换机的坐标
TYPE ARR IS ARRAY INT[6];
locationX ARR;
locationY ARR;
Begin
locationX[1] := 200;
locationX[2] := 400;
locationX[3] := 700;
locationX[4] := 900;
locationX[5] := 600;
locationX[6] := 900;
locationY[1] := 700;
locationY[2] := 700;
locationY[3] := 1000;
locationY[4] := 1000;
locationY[5] := 300;
locationY[6] := 300;
for i in 1011..1016 loop
	insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
	VALUES(i, '1234567890', 2, 3, 2, 22, 0, 3, 0, 0,'sw2', '', '交换机', '', locationX[j], locationY[j], 1, 1, 5, 0, cascadedevSWID + 1, '', cascadedevSWID + 2, '', 
			cascadedevSWID + 3, '', cascadedevSWID + 4, '', cascadedevSWID + 5, '', '', '', '', '', '', '', '', '',
		 '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
	j := j + 1;
	--三层交换机
	for i2 in 1..5 loop
		insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
		VALUES(cascadedevSWID + i2, '1234567890', 2, 3, 2, 22, 0, 3, 0, 1,'sw3', 'sw3', '交换机', '交换机', '', '', 1, 1, 5, 1, cascadedevPCID + 1, '', 
				cascadedevPCID + 2, '', cascadedevPCID + 3, '', cascadedevPCID + 4, '', cascadedevPCID + 5, '', '', '', '', '', 
				'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		
		--PC机
		cascadedevPCID := cascadedevPCID + 1;
		--第2层级显示为终端群的节点
		insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
		VALUES(cascadedevPCID, '1234567890', 2, 3, 2, 22, 0, 9, 0, 0, 'pc', 'pcCluster', '终端', '终端群', '', '', 1, 1, 0, 0, '', '', '', '', 
				'', '', '', '', '', '', '', '', '', '', '', '', '', '',
				'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		--第3层级的其他节点
		for i3 in 2..5 loop
			cascadedevPCID := cascadedevPCID + 1;
			insert into "MNGT_SYS"."TOPOLONODE"("nodeID", "eqpNo", "zoomLevelID", "zoomLevelMax", "zoomLevelMin", "upperLevelAreaID", "areaID", 
												"eqpType", "zoomWeight", "cascadeZoomWeight", "NodePicName", "ZoomedNodePicName", "nodeName", "zoomedNodeName", 
												"locationX", "locationY", "recordNum", "recordSeq", "nodeNum", "ZoomedNodeNum", "node1_ID", "node1_Attr", 
												"node2_ID", "node2_Attr", "node3_ID", "node3_Attr", "node4_ID", "node4_Attr", "node5_ID", "node5_Attr", 
												"node6_ID", "node6_Attr", "node7_ID", "node7_Attr", "node8_ID", "node8_Attr", "node9_ID", "node9_Attr", 
												"node10_ID", "node10_Attr", "node11_ID", "node11_Attr", "node12_ID", "node12_Attr", "node13_ID", "node13_Attr", 
												"node14_ID", "node14_Attr", "node15_ID", "node15_Attr", "node16_ID", "node16_Attr", "node17_ID", "node17_Attr", 
												"node18_ID", "node18_Attr", "node19_ID", "node19_Attr", "node20_ID", "node20_Attr")
			VALUES(cascadedevPCID, '1234567890', 3, 3, 3, 22, 0, 9, 0, 0, 'pc', '', '终端', '', '', '', 1, 1, 0, 0, '', '', '', '', 
				'', '', '', '', '', '', '', '', '', '', '', '', '', '',
				'', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
		end loop;
	end loop;
	cascadedevPCID := cascadedevPCID + 75;	--每个三层交换机下的终端是50个，现在只用到了50，所以要跳过50个
	cascadedevSWID := cascadedevSWID + 10;
end loop;
END;

call proc_block;
		 
		 
		 
		 


--【3.采集项配置类】
--3-1Agent注册表
insert into "MNGT_SYS"."AGENTREGTBL"("agentName", "defaultPort", "defaultAccount", "defaultPass", "description") 
VALUES('系统信息代理', 3245, NULL, NULL, '用于感知系统状态信息');

--3-2注册Agent实现的状态信息分组
insert into "MNGT_SYS"."AGENT_INFOGROUP"("agentName", "infoGroupName", "byName", "infoGroupID", "description") 
VALUES('系统信息代理','TBLVALUESSYSTEMSTATS','系统状态', 1, 'HARDWARE_MEMORY_TYPE');
insert into "MNGT_SYS"."AGENT_INFOGROUP"("agentName", "infoGroupName", "byName", "infoGroupID", "description") 
VALUES('系统信息代理','TBLVALUESPROCESSES','进程信息', 2, 'HARDWARE_MEMORY_TYPE');
insert into "MNGT_SYS"."AGENT_INFOGROUP"("agentName", "infoGroupName", "byName", "infoGroupID", "description") 
VALUES('系统信息代理','TBLVALUESMEMORY','内存信息', 3, 'HARDWARE_MEMORY_TYPE');
insert into "MNGT_SYS"."AGENT_INFOGROUP"("agentName", "infoGroupName", "byName", "infoGroupID", "description") 
VALUES('系统信息代理','TBLVALUESDISKS','磁盘信息', 4, 'HARDWARE_MEMORY_TYPE');
insert into "MNGT_SYS"."AGENT_INFOGROUP"("agentName", "infoGroupName", "byName", "infoGroupID", "description") 
VALUES('系统信息代理','TBLVALUESIFSSTAT','接口状态', 5, 'HARDWARE_MEMORY_TYPE');

--3-3信息分组中的信息点表
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','HRSYSTEMUPTIME','上电时间','DT_VARCHAR(4000)', 'VARCHAR2(4000)'	,1);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','HRSYSTEMDATE','系统当前时间','DT_VARCHAR(4000)', 'VARCHAR2(4000)'	,2);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','HRSYSTEMNUMUSERS','现用户数','DT_UINT32', 'NUMBER(38)'	,3);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','HRSYSTEMPROCESSES','现进程数','DT_UINT32', 'NUMBER(38)'	,4);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','HRSYSTEMMAXPROCESSES','允许最大进程数','DT_INT32', 'NUMBER(38)'	,5);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','SSCPUUSER','程序占用CPU百分比','DT_INT32', 'NUMBER(38)'	,6);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','SSCPUSYSTEM','系统占用CPU百分比','DT_INT32', 'NUMBER(38)'	,7);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESSYSTEMSTATS','SSCPUIDLE','CPU空闲百分比','DT_INT32', 'NUMBER(38)'	,8);

insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITPID','进程ID','DT_INT32', 'NUMBER(38)'	,1);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITNAME','进程名称','DT_VARCHAR(4000)', 'VARCHAR2(4000)'	,2);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITUSER','所属用户','DT_VARCHAR(1024)', 'VARCHAR2(1024)'	,3);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITCPU','CPU占用率','DT_INT32', 'NUMBER(38)'	,4);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITMEM','内存占用率','DT_INT32', 'NUMBER(38)'	,5);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITSTAT','进程状态','DT_VARCHAR(38)', 'VARCHAR2(38)'	,6);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITSTART','开始运行时间','DT_VARCHAR(100)', 'VARCHAR2(100)'	,7);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESPROCESSES','PITTIME','已运行时间','DT_VARCHAR(100)', 'VARCHAR2(100)'	,8);

insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMTOTALSWAP','总共交换空间','DT_INT32', 'NUMBER(38)'	,1);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMTOTALREAL','总共物理内存','DT_INT32', 'NUMBER(38)'	,2);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMAVAILREAL','剩余物理内存','DT_INT32', 'NUMBER(38)'	,3);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMSHARED','共享内存','DT_INT32', 'NUMBER(38)'	,4);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMBUFFER','buffer','DT_INT32', 'NUMBER(38)'	,5);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESMEMORY','MEMCACHED','cached','DT_INT32', 'NUMBER(38)'	,6);

insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKPATH','路径','DT_VARCHAR(4000)', 'VARCHAR2(4000)'	,1);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKDEVICE','设备名','DT_VARCHAR(4000)', 'VARCHAR2(4000)'	,2);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKTOTAL','总共空间','DT_INT32', 'NUMBER(38)'	,3);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKAVAIL','可用空间','DT_INT32', 'NUMBER(38)'	,4);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKUSED','使用空间','DT_INT32', 'NUMBER(38)'	,5);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESDISKS','DSKPERCENT','使用百分比','DT_INT32', 'NUMBER(38)'	,6);

insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFDESCR','接口名','DT_VARCHAR(100)', 'VARCHAR2(100)'	,1);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFTYPE','接口类型','DT_VARCHAR(100)', 'VARCHAR2(100)'	,2);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFSPEED','接口速度','DT_UINT32', 'NUMBER(38)'	,3);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFOPERSTATUS','运行状态','DT_UINT32', 'NUMBER(38)'	,4);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFINOCTETS','输入字节数','DT_UINT32', 'NUMBER(38)'	,5);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFINERRORS','输入错误数','DT_UINT32', 'NUMBER(38)'	,6);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFOUTOCTETS','输出字节数','DT_UINT32', 'NUMBER(38)'	,7);
insert into InfoGroup_InfoItem("infoGroupName","infoItemName","itemByName","valueType","typeORA","infoItemID") values('TBLVALUESIFSSTAT','IFOUTERRORS','输出错误数','DT_UINT32', 'NUMBER(38)'	,8);

--3-4设备上安装的代理
insert into "MNGT_SYS"."EQPAGENT"("eqpNo", "agentName", "queryPort") 
VALUES('0001-00001', '系统信息代理', NULL);

--3-5设备上要查询的状态信息点
insert into EqpInfoItem("eqpNo", "agentName", "infoGroupName", "infoItemName") 
select EQPAGENT."eqpNo", Agent_InfoGroup."agentName", Agent_InfoGroup."infoGroupName", InfoGroup_InfoItem."infoItemName"
from EQPAGENT, Agent_InfoGroup, InfoGroup_InfoItem 
where EQPAGENT."agentName" = Agent_InfoGroup."agentName" 
and Agent_InfoGroup."infoGroupName" = InfoGroup_InfoItem."infoGroupName";



--4-1 系统状态
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00001',1,'2017-05-12 18:00:00','2017-05-12 18:00:00',0,3,226,'2017-05-12 18:00:00',0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00002',1,to_date('2017-05-12 18:01:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-05-12','YYYY-MM-DD HH:MI:SS'),0,3,226,to_date('2017-05-12 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00004',1,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-05-12 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00004',1,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-05-12 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,224,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00020',1,to_date('2017-05-11 18:02:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-05-12 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00030',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00010',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,226,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00006',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,226,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00040',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,226,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00042',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00042',1,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00042',1,to_date('2017-06-07 18:02:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,224,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00044',1,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,225,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);
Insert into TBLVALUESSYSTEMSTATS ("objectID","valueIndex","collectTime","hrSystemDate","hrSystemMaxProcesses","hrSystemNumUsers","hrSystemProcesses","hrSystemUptime","ssCpuSystem","ssCpuUser","ssCpuIdle") values ('0001-00044',1,to_date('2017-06-07 18:00:01','YYYY-MM-DD HH:MI:SS'),to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),0,3,226,to_date('2017-05-10 18:00:00','YYYY-MM-DD HH:MI:SS'),0,0,99);

--4-2 进程信息
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00001',2,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 05 0B 0B 0A 2E 00 2B 07 00 ','0:12:49:09.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00002',2,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 05 0B 0B 0A 2E 00 2B 07 00 ','0:12:49:09.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00004',2,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 05 0B 0B 0A 2E 00 2B 07 00 ','0:12:54:09.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00004',2,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 05 0B 0B 0A 2E 00 2B 07 00 ','0:12:59:09.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00020',2,to_date('2017-05-11 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 05 0B 0B 0A 2E 00 2B 07 00 ','0:12:44:09.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00030',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:21:37.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00010',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:48:19.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00006',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:42:01.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00040',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 36 00 2B 07 00 ','0:19:51:37.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00041',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:47:01.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00042',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 36 00 2B 07 00 ','0:19:56:37.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00042',2,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:26:37.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00044',2,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 37 00 2B 07 00 ','0:19:31:37.00','R',0,3,'root');
Insert into TBLVALUESPROCESSES ("objectID","valueIndex","collectTime","pitName","pitPid","pitStart","pitTime","pitStat","pitCpu","pitMem","pitUser") values ('0001-00044',2,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/usr/sbin/snmpd',27408,'07 E1 06 06 06 2F 36 00 2B 07 00 ','0:19:36:38.00','R',0,3,'root');

--4-3 硬盘信息
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00001',4,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953568,13512156,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00002',4,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953568,13512156,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00004',4,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953568,13512156,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00004',4,to_date('2017-05-17 18:02:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953568,13512156,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00020',4,to_date('2017-05-11 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953568,13512156,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00030',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953412,13512312,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00010',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953404,13512320,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00006',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953404,13512320,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00040',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953408,13512316,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00041',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953404,13512320,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00042',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953408,13512316,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00042',4,to_date('2017-06-07 18:02:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953412,13512312,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00044',4,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953400,13512324,27);
Insert into TBLVALUESDISKS ("objectID","valueIndex","collectTime","dskDevice","dskPath","dskTotal","dskUsed","dskAvail","dskPercent") values ('0001-00044',4,to_date('2017-06-07 18:02:00','YYYY-MM-DD HH:MI:SS'),'/dev/sda1','/',19478204,4953400,13512324,27);

--4-4 内存信息
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00001',3,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00002',3,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00004',3,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00020',3,to_date('2017-05-11 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00030',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00010',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00006',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00040',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00041',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00042',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00042',3,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00044',3,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);
Insert into TBLVALUESMEMORY ("objectID","valueIndex","collectTime","memTotalReal","memTotalSwap","memShared","memAvailReal","memBuffer")values ('0001-00044',3,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),1000,125,0,0,0);


--4-5 网络接口状态
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00001',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,499213,0,499213,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00002',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,499213,0,499213,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00002',5,to_date('2017-05-17 18:01:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,18132804,0,77971,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00004',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,501901,0,501901,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00020',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,18212665,0,85261,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00030',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,503245,0,503245,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00010',5,to_date('2017-05-17 18:00:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,18295282,0,92551,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00006',5,to_date('2017-05-11 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,496525,0,496525,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00040',5,to_date('2017-05-11 18:00:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,18043353,0,70682,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00041',5,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,768400,0,768400,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00042',5,to_date('2017-06-07 18:00:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,22589742,0,136515,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00042',5,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,851568,0,851568,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00044',5,to_date('2017-06-07 18:01:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,23164003,0,181161,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00044',5,to_date('2017-06-07 18:02:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,843504,0,843504,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00044',5,to_date('2017-06-07 18:03:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,23007074,0,166249,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00041',5,to_date('2017-06-07 18:04:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,856816,0,856816,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00042',5,to_date('2017-06-07 18:05:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,23268801,0,188590,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00044',5,to_date('2017-06-07 18:06:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,848880,0,848880,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00065',5,to_date('2017-06-07 18:07:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,23090379,0,173538,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00066',5,to_date('2017-06-07 18:08:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,862192,0,862192,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00067',5,to_date('2017-06-07 18:09:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,23379059,0,195880,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00044',5,to_date('2017-06-07 18:10:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,824688,0,824688,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00030',5,to_date('2017-06-07 18:11:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,22689315,0,143805,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00065',5,to_date('2017-06-07 18:12:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,831408,0,831408,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00066',5,to_date('2017-06-07 18:13:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,22776968,0,151529,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00067',5,to_date('2017-06-07 18:14:00','YYYY-MM-DD HH:MI:SS'),'lo','24',10000000,1,838128,0,838128,0);
Insert into TBLVALUESIFSSTAT("objectID","valueIndex","collectTime","ifDescr","ifType","ifSpeed","ifOperStatus","ifInOctets","ifInErrors","ifOutOctets","ifOutErrors") values ('0001-00068',5,to_date('2017-06-07 18:15:00','YYYY-MM-DD HH:MI:SS'),'eth0','6',10000000,1,22871379,0,158819,0);

--5-4报警类型表
--报警类型表
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (1,'拒绝服务','通过向服务器发送大量垃圾信息或干扰信息的方式，导致服务器无法向正常用户提供服务的现象。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (2,'扫描探测','扫描探测是在攻击开始前必需的情报收集工作，攻击者在这个过程中尽可能的了解被攻击目标安全方面的信息。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (3,'认证/授权/访问','识别用户身份，允许特定的用户访问特定的区域或信息。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (4,'利用漏洞','利用系统安全方面的缺陷，控制或破坏受害系统。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (5,'逃避行为','在不被检测的情况下，绕过信息安全设备进行攻击的方式。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (6,'病毒/木马','病毒会破坏计算机功能或者破坏数据；木马可以让攻击者任意毁坏、窃取受害系统的信息，甚至远程操控受害的系统。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (7,'可疑活动','尚未归类，但据有潜在安全隐患的行为。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (8,'系统状况/配置','系统的运行状态和配置项。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (9,'违背策略','违反既定策略的行为',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (10,'关联事件','将相关事件关联起来，准确发现事件所体现的安全问题。',0,'');
insert into "MNGT_SYS"."ALERTTYPETBL"("id", "typeName", "description","mixType","mixTypeValue") values (11,'自定义类型','用户自定义类型',0,'');

--5-3事件类型表
--事件类型表
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (1,'硬件故障或诊断错误', 3,  '该报警会在监控设备上产生硬件故障或诊断错误时触发。一些安全设备例如防火墙执行大量的硬件问题自检。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (2,'系统配置改变', 1,   '该报警会在检测到系统、服务和网络配置改变时被触发。报警包括确认系统配置的成功状态信息，例如服务被打开或关闭。信息还包括关联到捆绑软件配置和Windows注册表编辑的信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (3,'系统中断', 1,  '该报警表示检测到系统被关闭或停止。该报警包括计划的和紧急的关闭信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (4,'服务/进程状态改变', 1,  '该报警表示检测到Windows服务、UNIX守护进程、进程或网络服务器等状态的改变。它包括网络接口开或关、命令和特权级别改变、服务开启等的相关信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (5,'系统故障', 1,  '该报警表示检测到了命令和系统功能失败的信息。该报警会在系统不能完成一个请求或出现关键系统错误的时候产生。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (6,'FTP访问', 2,  '该报警会在检测到有访问FTP或TFTP服务器的行为时被触发。该报警也汇总了FTP访问系统文件和访问一个已知的脆弱FTP服务器的信息，这些信息暗示着可能有危险的行为。同时，该报警还包括了一些不重要的FTP相关的错误信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (7,'邮件访问', 2,  '该报警会在检测到访问邮件（SMTP，POP，IMAP）或NNTP服务器或检测到邮件信息传输时被触发。该报警也汇总了在保护范围外的邮寄系统文件和“root”用户访问邮件的相关信息，这些可能是危害的先兆。该报警也包括一些不重要的邮件相关的错误信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (8,'安全协商', 2,  '该报警会在检测到一个服务器和客户端之间的安全协议时被触发。VPN设备一般会发送challenge消息到客户端，这种情况同样会触发该报警。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (9,'SNMP访问', 2,  '该报警会在检测到SNMP通讯时被触发。汇总的事件包括了一般的公共和私密团体字符串，信息请求和命令。一些SNMP命令（例如“write”）要比其他的命令更危险一些。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (10,'利用Mail漏洞攻击', 2,  '该报警表示检测到了针对邮件服务器、邮件发送和接受协议的攻击（不包括缓存溢出攻击）和其他邮件应用滥用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (11,'利用Windows漏洞攻击', 1,  '该报警表示检测到了针对MS windows服务区和工作站的本地或远程的攻击。Windows专用的危险证据也包括在其中（例如木马或替换系统执行文件）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (12,'不明病毒/木马',1,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (13,'检测到可疑特征',5,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (14,'可疑的文件扩展名',1,  '该报警会在检测到文件传输或保存了重复或可疑的文件扩展名时被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (15,'未知告警', 3,  '该报警捕捉所有不属于任何其他报警分类的事件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (16,'审计事件',2,  '此类事件包括对流量、用户操作(不含登录和注销)进行的记录，以及各种安全审计系统上报的日志，通常这类事件的安全等级都为中等以下。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (17,'未定义配置/状态事件', 1, '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (18,'数据库配置变更', 2,  '该报警会在数据库配置被执行或配置被修改时触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (19,'系统启动',1,  '该报警表示检测到系统被启动或重启。该报警包括计划的和紧急的重启信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (20,'邮件配置变更', 1, '该报警会在邮件服务配置被执行时触发。系统的改变可能需要管理权限才能执行。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (21,'软件安装', 2,  '该报警表示检测到一次软件的安装或升级（例如服务包）。安装文件可以是授权的或非授权的。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (22,'异常HTTP访问', 2,  '该报警表示检测到了被大多数组织的安全策略标记为“禁止”的Internet访问。其中经常包括访问色情网站，体育，博彩，赌博和求职网站。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (23,'异常程序访问', 2,  '该报警表示检测到了试图访问内部或网络的被禁止的应用。被安全策略禁止的应用通常是网络游戏，文件分享网络和远程访问工具。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (24,'不适当内部网络活动', 5,  '该报警会在内部系统的内部网络活动为不适当的、可疑的、或有潜在危害时被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (25,'异常FTP访问', 2,  '该报警表示检测到了试图访问被安全策略禁止的外网FTP服务器访问尝试。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (26,'异常文件访问',1,  '该报警会表示检测到了文件和注册表的访问行为。跟踪文件访问事件包括文件读取、修改、删除、文件属性改变和校验值改变。特别是跟踪访问和改变系统日志文件。同时还有一些文件系统的滥用，例如包括了一些向设备的链接。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (27,'权限提升',1,  '该报警包括了与通过使用攻击代码，或滥用系统软件和配置的缺陷来试图获得额外权限相关的基于主机的报警。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (28,'安全策略改变',1,  '该报警会在检测到安全策略改变时被触发。这些改变可以是认证服务中的用户组权限等级的改变，防火墙规则的改变，IDS签名的升级等。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (29,'异常Telnet访问', 1,  '该报警会在访问telnet服务器时，或检测到一个不同网络服务器上telnet客户端的时触发。这个报警同时汇总了一些在telnet会话中被NIDS截获的可疑的字符串，这可能是危害的前兆。该报警也包括了一些不重要的telnet相关的错误和认证相关的信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (30,'异常Unix/Linux访问', 1,  '该报警会在试图登陆或访问一些其他的Unix或Linux主机或应用程序时，或出现一些关于这些应用程序的错误或警告时被触发。UNIX特定应用包括，X Windows, SSH, identd, samba, rlogin, rexd, portmap等。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (31,'PING扫描', 1,  '该报警表示检测到了利用大量Ping数据包来确定主机是否联通的探测行为。Ping向目标主机(地址)发送一个回送请求数据包，要求目标主机收到请求后给予答复，从而判断网络的响应时间和本机是否与目标主机(地址)联通。攻击者可以利用来准备下一步攻击。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (32,'触发自动攻击的关联规则',3, '该报警表示检测到了一个用于检测自动攻击和脚本攻击的关联规则被触发了。像这样的关联规则通常使用短的定时器阈值，和查看连续发生的相似事件。事件可能包括认证失败，认证成功，溢出尝试等。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (33,'暴力破解', 5,  '该报警表示检测到了攻击者正在尝试使用不同的组合来猜测登陆的用户名和密码。这些“暴力破解”攻击可能使用了一个字典或随机顺序的所有字符和数字。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (34,'感染病毒', 1,  '该报警表示检测到了一个用于检测已知的攻击后行为的关联规则被触发了。像这样的行为可能包括木马行为，向外的网络连接，或下载黑客工具。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (35,'非法修改配置',2, '该报警表示检测到了安全设备成功的阻挡了一次进攻。这样的报警可能由不同的入侵防御设备产生。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (36,'漏洞利用失败',5,  '该报警表示检测到了漏洞利用失败。包括失败的缓冲区溢出攻击导致的服务崩溃，和攻击后导致的其他主机事件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (37,'蓄谋攻击', 5,  '该报警会在一个跟随着探测行为（包括端口扫描或版本检测）的攻击产生时被触发。这意味着攻击者在攻击前进行过目标探测。该报警也可以用来验证检测到的攻击签名,因为探测行为不会被误报，但是真正的攻击可能会被误报。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (38,'DOS攻击成功', 1,  '该报警会在系统服务因受到拒绝服务攻击而崩溃或停止工作时触发。这些漏洞攻击的目标是使运行中的网络服务或整个系统瘫痪。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (39,'恶意扫描', 1,  '该报警表示检测到了持续的扫描，多个端口或机器被扫描或受到不同的漏洞攻击。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (40,'用户配置变更', 2,  '该报警表示检测到了以下信息，包括用户账户、权利、许可的配置改变，和用户在其自有操作环境下所做的配置改变。该报警表明了试图扩大权限的迹象和用户的系统滥用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (41,'异常Telnet/SSH 访问', 3, '该报警表示检测到了经常被安全策略禁止的远程SSH和telnet服务器的登录尝试。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (42,'即时性消息软件出错',4, '该报警表示检测到了一些流行的实时通讯软件（IM）和聊天网络（例如IRC）。带来的风险包括客户软件出错，病毒散播和隐私泄露。同时，还有“软”风险，例如侵犯版权，捆绑“间谍软件”，身份盗窃和生产力损失常常是由于使用了IM软件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (43,'异常流媒体', 4,  '该报警会在局域网中检测到流媒体（音频、视频）内容时被触发。极有可能的原因是员工的Internet滥用。提供音乐和其他娱乐内容的音频和视频网站通常会被安全策略禁止。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (44,'异常数据库访问', 2,  '该报警会在发现可疑的内部数据库连接尝试时会被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (45,'Intenet访问量过大', 2,  '该报警会在累积的Internet下载数据超过允许级别时被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (46,'垃圾邮件', 2, '该报警会在检测到邮件内容或附件中包括可能会引起法律问题的淫秽文字、敏感数据或内容时被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (47,'软件安装异常', 2,  '该报警会在发现试图安装被禁止的软件时被触发。被禁止的软件可能是没有授权的、不可信任的或有害的软件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (48,'应用探测事件', 2,  '该报警表示检测到了试图侦测web应用、认证服务器等网络应用中信息的行为。通常这些侦测行为代表了一个攻击的准备阶段，攻击者正在决定最佳的攻击方式。这些泄露的信息通常包括重要的应用脆弱性信息和错误配置信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (49,'远程过程调用监控', 1,  '该报警表示检测到了针对UNIX RPC服务守护进程（端点映射器）的RPC信息请求。它们能被攻击者用来发起一个针对脆弱RPC服务的攻击（例如rpc.statd）和获得UNIX/Linux主机更多的信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (50,'DNS探测',2,  '该报警包括了针对组织名称服务器的DNS请求相关的所有报警。这些请求能被攻击者用来发动一个针对脆弱DNS服务器的攻击，同时收集大量关于公司网络拓扑和主机群的信息。DNS区转移（同样包括在这个警报中），允许通过一个查询下载所有DNS数据。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (51,'未定义访问/验证/认证事件',5,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (52,'验证/认证失败', 5,  '该报警会在某用户或某进程不能被系统认证或当一个授权试图去完成一个未授予的行为时被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (53,'加密访问/验证/数据认证',3, '该报警会在加密认证或有迹象表明一次有效的加密访问时被触发。另外，隐写术的迹象也会触发该报警。加密应用的使用通常都是被安全策略控制的。这个报警也包括设备报告的轻微加密错误。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (54,'数据库访问', 2,  '该报警会在检测到远程或本地数据库访问时被触发。它也汇总了多种数据库命令、与数据库访问和存储程序执行相关的状态信息。同时，该报警汇总了多种通过HTTP到后端web数据库的访问尝试。这些尝试是可靠的web攻击证据。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (55,'Windows访问',1,  '该报警会在试图登陆或访问一些Windows主机、windows专有应用和资源时，或出现一些关于这些应用的错误或警告时被触发。报警包括NetBIOS和SMB访问，注册表访问（本地和远程），SAM访问，PWL文件等。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (56,'利用未定义程序漏洞事件',2,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (57,'利用缓冲区溢出漏洞', 2,  '该报警表示检测到了针对网络和本地软件的缓存溢出攻击、缓存区溢出的通用标志（例如NOP sleds，应用程序输入中特别长的输入和可疑字符串），和指示了缓存区溢出攻击的应用程序信息。它也包括堆溢出和其他利用软件的漏洞。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (58,'利用DNS漏洞',2,  '该报警表示检测到了针对DNS服务器的攻击（不包括缓存溢出攻击）和包括DNS的特定漏洞攻击（例如DNS欺骗和DNS缓存中毒）。因为DNS服务器需要运行在防火墙的外面，他们比其他的网络服务更容易被攻击。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (59,'利用FTP漏洞', 2,  '该报警表示检测到了针对脆弱FTP服务器（不包括缓存溢出攻击）的漏洞攻击，FTP滥用（例如命令通过FTP执行），和一般的FTP协议攻击。该报警也会在收到可靠的证据证明有通过FTP协议的威胁时触发，例如通过FTP或TFPT成功接收保密文件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (60,'利用Linux / Unix漏洞',1,  '该报警表示检测到了针对UNIX和Linux服务器（不包括缓存溢出攻击）的本地或远程攻击，和针对UNIX专用服务的攻击（例如finger，rpc.statd,X,NFS等）以及UNIX机器威胁（例如端口22上的shell命令 SSH）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (61,'利用网络设备漏洞', 3,  '该报警表示检测到了针对不同网络设备，例如路由器、交换机和其他非电脑设备的攻击（不包括缓存区溢出攻击）以及没有限定在特定操作系统中的SNMP协议的漏洞攻击。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (62,'利用其他主机漏洞', 3,  '该报警表示检测到了针对没有被其他报警（数据库，访问控制和认证服务器，游戏服务器等）包括的远程和本地的应用程序漏洞攻击（不包括缓冲区溢出攻击）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (63,'利用Telnet漏洞',1,  '该报警表示检测到了针对所有主机平台的telnet服务器或客户端的远程或本地的攻击。这包括在一般telnet上进行远程漏洞发现，和通过telnet客户软件的漏洞尝试提升本地权限的行为。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (64,'TCP劫持',1,  '该报警表示NIDS发现了TCP连接被劫持的迹象。TCP劫持是一种的抢占已建立的TCP连接的方法，它通过发送欺骗包到通讯的双方来达到目的。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (65,'访问结束',5,  '此类事件包括了用户退出登录和网络会话、访问的结束事件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (66,'访问阻断',1,  '此类事件包括了由于配置了相应的安全策略而产生的访问、命令、操作等被禁止的事件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (67,'利用Web漏洞',2,  '该报警表示检测到了针对web服务器，CGI脚本，MS IIS,和其他电子商务，web应用的攻击，web服务器上的漏洞探索行为，或威胁迹象（例如通过HTTP协议下载系统敏感的文件）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (68,'洪水攻击', 2,  '该报警表示检测到了向目的主机发送大量IP包导致其耗尽系统资源(例如TCP连接表)或带宽的攻击行为。这种攻击可以使用任何IP协议，例如TCP，UDP或ICMP。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (69,'未定义拒绝服务事件',1,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (70,'畸形Dos数据包',1,  '该报警表示检测到了针对网络主机的拒绝服务攻击，这种攻击通过发送特殊的畸形IP包来攻击。拒绝服务包有时违反TCP/IP规则，携带会使脆弱的操作系统和网路服务崩溃的参数。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (71,'邮件服务攻击',2,  '该报警表示检测到了试图使邮件服务器（例如SMTP，POP或IMAP服务器）崩溃的攻击。一些攻击利用邮件服务器软件的缺陷，用有害请求或违规SMTP协议尝试使服务器超载。垃圾邮件（转发大量第三方的邮件）也包括在其中。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (72,'利用拒绝服务漏洞', 1,  '该报警表示检测到了利用实现或设计上的缺陷使应用程序和系统崩溃的攻击。不同于畸形的DoS包，该报警汇总了依赖于应用层弱点的攻击，包括本地（非网络的）攻击。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (73,'未定义探测',5,  '该报警不能归到其他种类中，通常不被使用。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (74,'主机探测',1,  '该报警表示检测到了试图获取不同网络应用信息（例如web应用，认证服务器和未包含在其他报警中的应用）的行为。这样的侦测行为一般都暗示着攻击前的准备阶段。同时，该报警还包括了不同的ICMP包，traceroutes，OS fingerprinting尝试，和一般包含在OS中的应用程序的询问（比如finger）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (75,'网络扫描', 1,  '该报警表示检测到了通过同时向多主机发送IP包，以试图获取关于这些主机或网络拓扑的信息的行为。通常这样的侦测行为都暗示着攻击前的准备阶段，攻击者正在决定最佳的攻击方式。这些泄露的信息会携带关于网络拓扑和防御区域的重要信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (76,'邮件探测',2,  '该报警表示检测到了试图获取邮件服务器信息的行为，比如试图通过telnet客户端登陆和运行SMTP EXPN和VRFY命令。通常，这样的侦测行为都暗示着攻击前的准备阶段，攻击者正在决定最佳的攻击方式。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (77,'Windows探测',1,  '该报警表示检测到了通过Windows查询用户信息、访问权限和windows系统资源有效性的事件。通常，这样的侦测行为都暗示着攻击前的准备阶段，攻击者正在决定最佳的攻击方式。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (78,'端口映射/RPC请求', 1,  '该报警表示检测到了UNIX RPC网络服务信息请求。它们能够被攻击者用来发起一个针对脆弱RPC服务（例如rpc.statd）的攻击和获取更多关于UNIX/LINUX 主机的信息。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (79,'端口扫描',1,  '该报警表示检测到了端口扫描，例如重复连接到一个系统的不同端口以确认哪个服务在监听网络请求。端口扫描是攻击者最常使用的侦测技术。了解开放的端口将帮助攻击者决定使用什么方法来攻击系统。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (80,'IP欺骗',1,  '该报警表示检测到了数据包中的源IP地址的欺骗事件。IP欺骗在拒绝服务攻击时和尝试利用网络中主机之间的信任关系时隐藏攻击者信息。很多工具允许创建和欺骗包的注入。某些欺骗包（例如源地址和目的地址相同的包）能用使易受攻击的主机瘫痪。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (81,'IP分片异常',1,  '该报警表示检测到了IP分片的滥用，例如分片过小，分片过大，分片畸形包和其他违规的分片行为。这些分片异常代表着一个攻击或有故障的网络设备。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (82,'IP分片重叠',1,  '该报警表示检测到了IP分片出现重叠偏移值。它能被用来做旁路入侵检测，有时会崩溃网络服务。有故障的网络硬件设备有时也会产生重叠的IP分片。一些操作系统很难重组这样的IP包。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (83,'IDS逃避', 1,  '该报警表示检测到了逃避网络入侵检测的迹象。这些技术从分片滥用到应用层Unicode编码，分解网络请求到小的片段和注入一个虚构的log条目。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (84,'后门活动',1,  '该报警表示IDS检测到了后门行为。入侵防御系统有用于检测已知后门程序的签名。入侵者会将这些程序放置到受到攻击的机器上，用来秘密的访问他们。后门也能部署病毒代码和有害邮件附件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (85,'邮件病毒',2,  '该报警表示IDS检测到了通过SMTP协议传播的可疑代码的信息。可疑邮件附件可能包括病毒和蠕虫（在传输中同样受到保护），或发送这些附件到其他组织。这个报警会在邮件中包含ＶＢＳ文件时同样会被触发。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (86,'恶意程序',2,  '该报警表示检测到了违规软件安装或在被保护的系统上执行的情况。特别是危险地DDoS代理，也包括在这个报警中。包括多种系统木马、DDoS代理、UNIX rootkits和IIS蠕虫。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (87,'可疑程序传播',2,  '该报警表示检测到了网络传输中的可疑软件的信息，包括攻击工具，一般性的安全工具，扫描器或自动攻击代理（蠕虫，病毒）。安全工具可能被攻击者用来扫描脆弱性，攻击其他机器和建立到你的网络的远程访问。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (88,'防火墙内容修改',5, '该报警表示防火墙依据安全策略改变了网络负载。经常使用这些防火墙功能是用来阻止可疑的Java applets和有害的ActiveX控制。后者可能拥有目标系统的全部权限（包括擦除硬盘或安装后门），同时能够嵌入到一个网页中。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (89,'无效命令或数据',5, '该报警表示检测到了可疑、有害，非法和无效的命令、请求和用户数据。很多汇总的报警本身并没有危害，可能会在一般情况下被触发（例如不兼容问题时），这些行为一般代表着探测、缺陷发现和漏洞测试。至少它可能代表一些出错的需要关注的软件或硬件。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (90,'可疑数据包',1,  '该报警表示检测到了可疑的IP包。它会在检测到可疑、有害或不合格的包时产生。这不是一个已知的攻击，但在一定程度上可能是一个有害而不仅仅是无效的行为。报警同时包括现代网络中不常见的合格包（源路由）。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (91,'可疑活动',5,  '该报警表示检测到了可疑的网络和主机行为。很多汇总的报警本身并没有危害，可能会在一般情况下被触发，这些行为一般代表着探测、缺陷发现。该报警也包括，安全工具（例如脆弱性扫描器）运行在被保护网络，和一些被IDS发现的一般攻击响应的迹象。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (92,'可疑的端口活动',1,  '该报警表示检测到了不可信任的IDS签名，仅通过端口号来检测木马和不同的违禁应用（例如远程接入工具）而不是使用流量签名。合法的应用程序也有可能会使用这些端口。报警也包括NIDS报告的在不使用端口上的行为。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (93,'可疑的路由', 1,  '该报警表示NIDS检测到了使用可疑或罕见的路由选项的包，例如源路由或记录路由。这个数据包可能会被用来绕过网络数据包级别的访问控制。它也指示路由协议中的可疑改变。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (94,'潜在的 web 弱点',2,  '该报警表示检测到了试图访问一个已知的脆弱web应用的行为，例如电子商务解决方案，CGI脚本等。报警不能确认为是一个漏洞攻击的尝试，但展示了脆弱的应用在网络上是活跃的，或被客户访问过。同时，某些web服务器功能（例如路径和目录内容泄露）的滥用行为也被包括在内了。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (95,'地址转换',1,  '该报警会在防火墙执行地址转换时被触发。网络地址转换和端口转化被用来映射内部IP地址到互联网地址。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (96,'应用软件配置',2,  '该报警会在应用配置被执行或修改时触发。这些改变的执行者可能正常用户或系统管理员，也可能是入侵者。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (97,'IP 冲突',1,  '该报警会在检测到网络中有相同的IP时被触发。它可能是由系统错误配置或入侵者连接到网络中，或IP欺骗攻击造成的。所有的IP地址在同一内网段中应该是唯一的。');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (98,'帐户（组）更改',1,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (99,'策略改变',5,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (100,'恶意代码监控',2,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (101,'蠕虫类攻击',5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (102,'病毒类攻击', 5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (103,'恶意软件攻击', 5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (104,'木马类攻击',5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (105,'Smurf攻击IDS',1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (106,'Dos泛洪攻击', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (107,'Smurf攻击防火墙',1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (108,'Arp地址欺骗检测', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (109,'未授权的入站端口', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (110,'DNS服务器攻击', 2,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (111,'未授权的出站端口', 2,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (112,'网络监听',4,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (113,'漏洞扫描',5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (114,'注入攻击', 5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (115,'漏洞攻击', 5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (116,'非法上传', 5,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (117,'新建操作系统帐号', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (118,'口令暴力攻击', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (119,'操作系统账号口令修改', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (120,'口令猜解成功', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (121,'异常时段远程登录', 1,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (122,'意外停机',3,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (123,'重要服务意外停止', 2,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (124,'磁盘空间不足', 3,  '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (125,'网卡故障', 20, '自定义事件');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (126,'socks访问', 4,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (127,'取消阻断',1,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (128,'包过滤',1,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (129,'邮件过滤',2,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (130,'流媒体播放', 2,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (131,'监控配置事件', 2,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (132,'监控性能事件', 2,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (133,'监控故障事件',2,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values (134,'异常流量', 3,  'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(135,'与服务器 [IP地址=%s：端口号=%d] 的通讯连接被拒绝！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(136,'接收来自服务器[IP地址=%s：端口号=%d]的数据失败！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(137,'服务器[IP地址=%s：端口号=%d]关闭了通讯连接，数据传输终止！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(138,'与服务器[IP地址=%s：端口号=%d]的通讯通道阻塞， 传输超时！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(139,'数据包超出了允许的最大长度 [%d > %d]，该数据包被丢弃！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(140,'不可识别数据包信息类型，该数据包被丢弃！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(141,'容灾数据包长度过长 [%d > %d] ，该数据包被丢弃！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(142,'信号量创建失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(143,'内存分配失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(144,'进程创建失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(145,'线程创建失败！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(146,'文件打开失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(147,'读文件失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(148,'写文件失败！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(149,'Socket创建失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(150,'Socket绑定失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(151,'Socket Listen 失败！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(152,'Socket Accept 失败！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(153,'服务器[IP地址=%s：端口号=%d]的通讯连接被关闭！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(154,'容灾目的地条目超出范围[0...%d]！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(155,'读配置文件(%s)出错！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(156,'初始化数据库上下文出错！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(157,'写进程信息出错！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(158,'sql语句执行错误！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(159,'备份节点数据库连接出错！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(160,'数据库连接失败，数据加载线程退出！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(161,'入库数据出错',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(162,'数据库表空间利用率大于90%',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(163,'数据库表空间利用率大于95%',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(164,'CPU利用率大于95%', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(165,'内存利用率大于95%',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(166,'硬盘利用率大于95%', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(167,'线程不正常退出', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(168,'Cpu利用率超过95%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(169,'Cpu利用率超过85%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(170,'Cpu利用率超过75%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(171,'内存利用率超过95%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(172,'内存利用率超过85%！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(173,'内存利用率超过75%！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(174,'硬盘利用率超过95%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(175,'硬盘利用率超过85%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(176,'硬盘利用率超过75%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(177,'表空间利用率超过95%！', 2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(178,'表空间利用率超过85%！',2, 'NA');
insert into "MNGT_SYS"."EVENTTYPETBL"("id", "format", "assetType", "description")  values(179,'表空间利用率超过75%！',2, 'NA');

--事件表
SET IDENTITY_INSERT MNGT_SYS.EVENTTBL ON;
--随机生成事件表
CREATE OR REPLACE PROCEDURE INSERT_EVENT AS
i int := 1;
collectTime time := '2017-01-01 00:00:00';
--使用数组定义设备ID
TYPE ARR IS ARRAY VARCHAR[11];
devID ARR;
Begin
devID[1] := '0001-00001';
devID[2] := '0001-00002';
devID[3] := '0001-00004';
devID[4] := '0001-00051';
devID[5] := '0001-00052';
devID[6] := '0001-00053';
devID[7] := '0001-00054';
devID[8] := '0001-00061';
devID[9] := '0001-00062';
devID[10] := '0001-00063';

for i in 1..10000 loop	
	insert into "MNGT_SYS"."EVENTTBL"("time", "priority", "eventTypeID", "eqpNo", "pluginID", "rank", "category") 
	VALUES(collectTime, ceil(rand()*5), ceil(rand()*178), devID[ceil(rand())], '', ceil(rand()*5), ceil(rand()*2));
	collectTime = TIMESTAMPADD(SQL_TSI_HOUR, ceil(rand()*24), collectTime);
end loop;
END;
call INSERT_EVENT;

--6-2警报表
SET IDENTITY_INSERT MNGT_SYS.ALERTTBL ON;
--随机生成报警
CREATE OR REPLACE PROCEDURE INSERT_ALERT AS
i int := 1;
collectTime time := '2017-02-01 00:00:00';
--使用数组定义设备ID
TYPE ARR IS ARRAY VARCHAR[11];
attackSource ARR;
region ARR;
Begin
attackSource[1] = '210.73.43.120';
attackSource[2] = '110.42.43.110';
attackSource[3] = '134.74.13.23';
attackSource[4] = '154.73.43.19';
attackSource[5] = '154.45.31.12';
attackSource[6] = '220.73.43.102';
attackSource[7] = '231.45.43.12';
attackSource[8] = '223.1.2.31';
attackSource[9] = '212.23.32.108';
attackSource[10] = '219.73.54.23';

region[1] = '10.10.30.0/24';
region[2] = '10.10.32.0/24';
region[3] = '173.5.4.0/26';
region[4] = '176.34.22.34';
region[5] = '210.84..72.11';
region[6] = '202.44.21.0/25';
region[7] = '174.23.42.0/25';
region[8] = '196.232.12.0/24';
region[9] = '194.2.2.0/24';
region[10] = '68.54.32.128/26';

for i in 1..200 loop	
	insert into "MNGT_SYS"."ALERTTBL"("reportTime", "startTime", "lastTime", "reportLevel", "confidence", "seriousLevel", "ugentLevel", "assetType", "targetAssets", "alertTypeID", "alertProc", "attackSource", "alertRegion", "strategy", "isSolve") 
	VALUES(collectTime, '', '', ceil(rand()*5), rand(), ceil(rand()*5), ceil(rand()*5), ceil(rand()*5), ceil(rand()*5), floor(rand()*11+1), ceil(rand()*4), attackSource[ceil(rand()*10)], region[ceil(rand()*10)], '', round(rand()*2));
	collectTime = TIMESTAMPADD(SQL_TSI_HOUR, ceil(rand()*24), collectTime);
end loop;
END;
call INSERT_ALERT;


--6-4随机生成报警-事件关联表
CREATE OR REPLACE PROCEDURE INSERT_ALERT_EVENT AS
i int := 1;
j int := 1;
--使用数组定义设备ID
Begin
for i in 1..200 loop	
	for j in 1..10 loop
		insert into "MNGT_SYS"."EVENT_ALERTTBL"("Event_id", "Alert_id", "relevancyStrength") 
		VALUES(ceil(rand()*10000), i, round(rand(), 2));
	end loop;
end loop;
END;
call INSERT_ALERT_EVENT;

--6-5随机生成报警类型-事件类型关联表
CREATE OR REPLACE PROCEDURE INSERT_ALERTTYPE_EVENTTYPE AS
i int := 1;
j int := 1;
--使用数组定义设备ID
Begin
for i in 1..11 loop	
	for j in 1..5 loop
		insert into "MNGT_SYS"."EVENTTYPE_ALERTTYPETBL"("EventType_id", "AlertType_id")
		VALUES(ceil(rand()*179), i);
	end loop;
end loop;
END;
call INSERT_ALERTTYPE_EVENTTYPE;



