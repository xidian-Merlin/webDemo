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
<div class="p-panel um-panel left-panel" id="left-panel" style="width:260px">
	<div class="um-panel-head">
		<div class="col-lg-12 unit-col tc"></div>
	</div>
	<div class="um-panel-body prel">
		<i class="icon-plus pabs" id="tree_add_btn" title="添加资产类别" style="top: 28px; font-size: 16px; right: 10px; color: grey;"></i>
		<ul id="asset_class_tree" class="ztree" style="height:100%;overflow:hidden"></ul>
	</div>
</div>

<!-- 右侧 -->
<div class="p-panel um-panel right-panel" id="right-panel" style="left:230px">
	<div class="um-panel-head">
		<div class="table-div-outer" style="padding:0 10px">
			<div class="table-oper" id="table_oper">
				<a href="javascript:void(0);" id="add_btn" class="bgblue">
					<i class="btn-commen add-btn"></i>
					<span>新增</span>
				</a>
				<a href="javascript:void(0);" id="remove_btn">
					<i class="btn-commen delete-btn"></i>
					<span>批量删除</span>
				</a>
			</div>
		</div>
	</div>
	<div class="um-panel-body">
		<div id="table_div1" class="table-div table-list"></div>
	</div>
</div>
<script src="/tdyth/resources/lib/jquery/jquery.timer.js"></script>
<script src="${pageContext.request.contextPath}/resources/lib/jquery/jquery.slimScroll.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/tip/tip.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/grid/grid.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/mask/mask.js"></script>
<script src="${pageContext.request.contextPath}/resources/plugins/dialog/dialog.js"></script>
<script src="/tdyth/resources/js/eqpManager/eqpSecDom.js"></script>
</body>