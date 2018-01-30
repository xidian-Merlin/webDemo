<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%> --%>
<%@ taglib prefix="shiro" uri="shiro.tld"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<base href="<%=basePath%>">
<meta charset="utf-8" />
<title>后台管理系统</title>

<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="icon"
	href="${pageContext.request.contextPath}/resources/images/icon/favicon.ico"
	type="${pageContext.request.contextPath}/image/x-icon">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/js/main/init.js"></script>


</head>
<body>
	<div class="main-wrap">
		<div class="side-nav">
			<div class="side-logo">
				<div class="logo">
					<span class="logo-ico"> <i class="i-l-1"></i> <i
						class="i-l-2"></i> <i class="i-l-3"></i>
					</span> <strong>后台管理系统</strong>
				</div>
			</div>

			<nav class="side-menu content mCustomScrollbar"
				data-mcs-theme="minimal-dark">
			<h2>
				<a id="index-init" class="InitialPage"><i class="icon-dashboard"></i>数据概况</a>
			</h2>
			<ul>
				<li>
					<dl>
						<dt>
							<i class="icon-columns"></i>拓扑展示<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a  id="topo_v2">全网拓扑</a>
						</dd>
						<dd>
							<a href="flow-layout.html">地理拓扑</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-external-link"></i>设备管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a id="eqpType">设备类型</a>
						</dd>
						
						<dd>
							<a id="eqpRegist">设备登记</a>
						</dd>
						<dd>
							<a id="eqpDiscover">设备发现</a>
						</dd>
						<dd>
							<a id="asset_monitor">设备状态</a>
						</dd>
						
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-spinner"></i>告警管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a id="alertType">告警类型</a>
						</dd>
						<dd>
							<a id="alertStatistic">告警统计</a>
						</dd>
						<dd>
							<a id="alertInfo">告警列表</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-list-alt"></i>策略配置<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="form.html">汇集配置</a>
						</dd>
						<dd>
							<a href="form.html">管控配置</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-columns"></i>基础数据<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a id="eqpSecDom">安全域</a>
						</dd>
						<dd>
							<a href="paging.html">采集项</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-spinner"></i>系统管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="animation.html">用户管理</a>
						</dd>
						<dd>
							<a href="animation.html">角色管理</a>
						</dd>
						<dd>
							<a href="animation.html">权限管理</a>
						</dd>
						<dd>
							<a href="animation.html">菜单管理</a>
						</dd>
						<dd>
							<a href="animation.html">日志管理</a>
						</dd>
						<dd>
							<a href="animation.html">告警通知管理</a>
						</dd>
					</dl>
				</li>
			</ul>
			</nav>
			<footer class="side-footer">© CAS IIE 版权所有</footer>

		</div>

		<div class="content-wrap">
			<header class="top-hd">
			<div class="hd-lt">
				<a class="icon-reorder"></a>
			</div>
			<div class="hd-rt">
				<ul>
					<li><a href="http://www.deathghost.cn" target="_blank"><i
							class="icon-home"></i>前台访问</a></li>
					<li><a><i class="icon-random"></i>清除缓存</a></li>
					<li><a><i class="icon-user"></i>管理员:<em>Admin</em></a></li>
					<li><a><i class="icon-bell-alt"></i>系统消息</a></li>
					<li><a href="javascript:void(0)" id="JsSignOut"><i
							class="icon-signout"></i>安全退出</a></li>
				</ul>
			</div>
			</header>
			<main id="mainContainer" class="main-cont content mCustomScrollbar">
			<!--开始::内容--> </main>
			<footer class="btm-ft">
			<p class="clear">
				<span class="fl">©Copyright 2017 <a href="http://iie.ac.cn"
					title="IIE" target="_blank">iie.ac.cn</a></span> <span
					class="fr text-info"> <em class="uppercase"> <i
						class="icon-user"></i> author:iie.nsp
				</em>
				</span>
			</p>
			</footer>
		</div>
	</div>
</body>

<script  src="/tdyth/resources/lib/ztree/jquery.ztree.core.js"></script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/lib/ztree/css/metroStyle.css">
<script  src="${pageContext.request.contextPath}/resources/plugins/tree/tree.js"></script>

<script src="${pageContext.request.contextPath}/resources/plugins/tip/tip.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/grid/grid.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/mask/mask.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/dialog/dialog.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/main/extra_controller.js"></script>



</html>
