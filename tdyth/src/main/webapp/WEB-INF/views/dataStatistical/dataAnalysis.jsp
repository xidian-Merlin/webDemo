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
<link rel="icon"
	href="${pageContext.request.contextPath}/resources/images/icon/favicon.ico"
	type="${pageContext.request.contextPath}/image/x-icon">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/resources/css/style.css" />
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plugins/jquery.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plug-ins/customScrollbar.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plug-ins/echarts.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plug-ins/layerUi/layer.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plug-ins/pagination.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/js/dataStatistical/public.js"></script>
</head>
<body>

	<!--开始::内容-->
	<div class="page-wrap">
		<section class="page-hd"> <header>
		<h2 class="title">
			<i class="icon-home"></i>模块化后台管理模板
		</h2>
		</header>
		<hr>
		</section>


		<div class="clear mt-20">
			<div class="fl">
				<button class="btn btn-secondary">
					<i class="icon-double-angle-left"></i>上一周
				</button>
				<button class="btn btn-secondary">
					下一周<i class="icon-double-angle-right"></i>
				</button>
			</div>
			<div class="fr input-group">
				<input type="text" class="form-control" placeholder="搜索..."
					style="width: 290px;" />
				<button class="btn btn-secondary-outline">搜索</button>
			</div>
		</div>
		<table class="table table-bordered  mb-15 mt-15">
			<thead>
				<tr class="cen">
					<th>编号</th>
					<th>信息分组</th>
					<th>采集时间</th>
					<th>接口描述</th>
					<th>接口类型</th>
					<th>接口速度</th>
					<th>接口操作装态</th>
					<th>接口进8位字节</th>
					<th>接口进错误数</th>
					<th>接口出8位字节</th>
					<th>接口出错误数</th>
				</tr>
			</thead>
			<tbody id="disks_info_list">

			</tbody>
		</table>
		<div class="lt clear">
			<div class="fl">
				<button class="btn btn-warning">
					<i class="icon-cog"></i>批量编辑
				</button>
				<button class="btn btn-danger">
					<i class="icon-trash"></i>批量删除
				</button>
				<button class="btn btn-disabled" disabled="disabled">
					<i class="icon-remove-sign"></i>不可编辑
				</button>
			</div>
			<div id="ifstatus_page" class="pagination fr"></div>
		</div>
		<table class="table table-bordered  mb-15 mt-15">
			<tbody>
				<tr class="cen">
					<td style="width: 50%">
						<div id="demo1" style="height: 300px"></div>
					</td>
					<td style="width: 50%">
						<div id="demo2" style="height: 300px"></div>
					</td>
				</tr>
			</tbody>
		</table>

		<script>
			//分页
			//....
				//demo1
				var dom = document.getElementById("demo1");
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				function randomData() {
					now = new Date(+now + oneDay);
					value = value + Math.random() * 21 - 10;
					return {
						name: now.toString(),
						value: [
							[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
							Math.round(value)
						]
					}
				}
				
				var data = [];
				var now = +new Date(1997, 9, 3);
				var oneDay = 24 * 3600 * 1000;
				var value = Math.random() * 1000;
				for (var i = 0; i < 1000; i++) {
					data.push(randomData());
				}
			
				option = {
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							params = params[0];
							var date = new Date(params.name);
							return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
						},
						axisPointer: {
							animation: false
						}
					},
					xAxis: {
						type: 'time',
						splitLine: {
							show: false
						}
					},
					yAxis: {
						type: 'value',
						boundaryGap: [0, '100%'],
						splitLine: {
							show: false
						}
					},
					series: [{
						name: '模拟数据',
						type: 'line',
						showSymbol: false,
						hoverAnimation: false,
						data: data
					}]
				};
			
				setInterval(function () {
			
					for (var i = 0; i < 5; i++) {
						data.shift();
						data.push(randomData());
					}
			
					myChart.setOption({
						series: [{
							data: data
						}]
					});
				}, 10000);;
				if (option && typeof option === "object") {
					myChart.setOption(option, true);
				}
				
				//demo2
				var dom = document.getElementById("demo2");
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				option = {
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一','周二','周三','周四','周五','周六','周日']
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name:'lo',
							type:'line',
							stack: '总量',
							data:[4, 2, 3, 5, 1, 7, 2]
						},
						{
							name:'eth0',
							type:'line',
							stack: '总量',
							data:[0, 2, 4, 5, 1, 7, 3]
						},
						{
							name:'ens33',
							type:'line',
							stack: '总量',
							data:[3, 5, 2, 4, 6, 8, 0]
						}
					]
				};
				;
				if (option && typeof option === "object") {
					myChart.setOption(option, true);
				}	
			</script>

	</div>
</body>
<script src="${pageContext.request.contextPath}/resources/js/dataStatistical/index.js"></script>
</html>
