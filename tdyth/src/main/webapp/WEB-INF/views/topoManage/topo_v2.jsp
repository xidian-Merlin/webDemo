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
<style type="text/css">
html, body {
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
}

#container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
}

#preview {
	width: 0%;
	overflow: scroll;
}

#divide {
	width: 10px;
	background: #DEDEDE;
	cursor: pointer;
}

#detail {
	flex: 1;
	overflow: scroll;
}

div.tooltip {
	position: absolute;
	text-align: center;
	width: 30px;
	height: auto;
	padding: 2px;
	font: 12px sans-serif;
	background: lightsteelblue;
	border: 0px;
	border-radius: 8px;
	pointer-events: none;
}

.body {
	background-color: #E7E7E7;
}

line {
	stroke: #aaa;
	stroke-width: 2px;
}

circle {
	stroke: grey;
	stroke-width: 4;
	opacity: 0.9;
}

nodetext {
	font: 12px sans-serif;
	-webkit-user-select: none;
	-moze-user-select: none;
	stroke-linejoin: bevel;
}

svg {
	height: 100%;
	width: 100%;
}

.axis line {
	fill: none;
	stroke: #ddd;
	shape-rendering: crispEdges;
	vector-effect: non-scaling-stroke;
}
</style>


<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">





<!-- <script src="https://d3js.org/d3.v4.min.js"></script>
<script src="http://code.jquery.com/jquery-1.4.1.min.js"></script> -->
</head>
<body>
	<div id="container">
		<div id="preview"></div>
		<div id="divide"></div>
		<div id="detail"></div>
	</div>

</body>
<%-- <script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plugins/d3.v4.min.js"></script> --%>
<script src="${pageContext.request.contextPath}/resources/js/topo/common.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/topo/topo_v2.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/topo/topo_details.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/topo/topo_preview.js"></script>
</html>


