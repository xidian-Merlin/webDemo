<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
    <%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8" />
<title>后台管理系统</title>

<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
<link rel="icon"
	href="/tdyth/resources/images/icon/favicon.ico"
	type="/tdyth/resources/image/x-icon">
<link rel="stylesheet" type="text/css"
	href="/tdyth/resources/css/style.css" />
<script type="text/javascript"
	src="/tdyth/resources/js/main/init.js"></script>
	<script type="text/javascript"
	src="/tdyth/resources/js/dataStatistical/public.js"></script>
</head>
<body>
	<div class="main-wrap">
	

		<div class="content-wrap">
			<header class="top-hd">
			<div class="hd-lt">
				<a class="icon-reorder"></a>
			</div>
			<div class="hd-rt">
				
			</div>
			</header>
			
				<div class="side-nav">
			<div class="side-logo">
				<div class="logo">
					<span class="logo-ico"> <i class="i-l-1"></i> <i
						class="i-l-2"></i> <i class="i-l-3"></i>
					</span> <strong>设备配置</strong>
				</div>
			</div>

			<nav class="side-menu content mCustomScrollbar"
				data-mcs-theme="minimal-dark">
			<ul>
				<li>
					<dl>
						<dt>
							<i class="icon-columns" id="packageFilter">包过滤</i>
						</dt>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-external-link" id="interface">接口</i>
						</dt>
						
						
					</dl>
				</li>
				
			</ul>
			</nav>
			<footer class="side-footer">© CAS IIE 版权所有</footer>

		</div>
			
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
<link rel="stylesheet" href="/tdyth/resources/lib/ztree/css/metroStyle.css">
<script  src="/tdyth/resources/plugins/tree/tree.js"></script>

<script src="/tdyth/resources/plugins/tip/tip.js"></script>
<script src="/tdyth/resources/plugins/grid/grid.js"></script>
<script src="/tdyth/resources/plugins/mask/mask.js"></script>
<script src="/tdyth/resources/plugins/dialog/dialog.js"></script>
<script
	src="/tdyth/resources/js/main/config_controller.js"></script>
</html>