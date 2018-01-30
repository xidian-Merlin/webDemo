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
<base href="<%=basePath%>">
<meta charset="utf-8" />
<title>后台管理系统</title>

<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">

</head>
<body>
<!-- 左侧 -->
<div class="p-panel um-panel left-panel" id="left-panel" style="width:210px">
	<div class="um-panel-head" id="accordion_icon">
		<div class="col-lg-4 unit-col" data-name="assetPreviewList" data-type="4" data-tree="ASSET_TYPE_TREE"
			style="padding:0 5px">资产类型</div>
			<div class="col-lg-4 unit-col" data-name="sdTreeWithCnt" data-type="3" data-tree="SECURITY_DOMAIN_TREE"
			style="padding:0 5px">安全域</div>
		
	</div>
	<div class="um-panel-body">
		<ul id="accordion" class="ztree" style="height:100%;overflow:hidden"></ul>
	</div>
</div>

<!-- 右侧 -->
<div class="p-panel um-panel right-panel" id="right-panel"
	style="left:450px;overflow-x:hidden">
	<div class="um-panel-head">
		<div class="table-oper" id="table_oper">
			<a href="javascript:void(0);" id="refresh_btn" class="bgblue">
				<i class="btn-commen refresh-white-btn"></i>
				<span>刷新</span>
			</a>
		</div>
	</div>
	<div class="um-panel-body">
		<div id="table_div" class="table-div table-list">
		</div>
	</div>
	<div id="table_slide_btn" class="slide_btn" style="display:none">
		<i data-status="active" data-id="slide_left" class="icon-double-angle-left"></i>
		<i id="slide_right" data-id="slide_right" class="icon-double-angle-right dn h-all" style="line-height:70px;"></i>
	</div>
</div>
</body>

<script src="${pageContext.request.contextPath}/resources/lib/jquery/jquery.slimScroll.js"></script>

<script src="/tdyth/resources/lib/jquery/jquery.timer.js"></script>
<script  src="/tdyth/resources/lib/ztree/jquery.ztree.core.js"></script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/lib/ztree/css/metroStyle.css">
<script  src="${pageContext.request.contextPath}/resources/plugins/tree/tree.js"></script>
 <!-- 引入 echarts.js -->
<script src="/tdyth/resources/plugins/echarts.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/tip/tip.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/grid/grid.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/mask/mask.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/dialog/dialog.js"></script>
<script  src="${pageContext.request.contextPath}/resources/js/eqpMonitor/statistic.js"></script>
<script  src="${pageContext.request.contextPath}/resources/js/eqpMonitor/eqpMonitor.js"></script>





</html>
