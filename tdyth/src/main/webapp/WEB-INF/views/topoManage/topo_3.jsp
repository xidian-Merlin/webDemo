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
	height: 200%;
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
	src="${pageContext.request.contextPath}/resources/js/public.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plugins/d3.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/plugins/jquery.min.js"></script>
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
				<a href="index/init" class="InitialPage"><i
					class="icon-dashboard"></i>数据概况</a>
			</h2>
			<ul>
				<li>
					<dl>
						<dt>
							<i class="icon-columns"></i>拓扑展示<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="topo/topo_1">展示页面1</a>
						</dd>
						<dd>
							<a href="flow-layout.html">展示页面2</a>
						</dd>
					</dl>
				</li>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-table"></i>本机配置<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="user/button">系统配置</a>
						</dd>
						<dd>
							<a href="table.html">管理员配置</a>
						</dd>
						<dd>
							<a href="table.html">管理员</a>
						</dd>
						<dd>
							<a href="table.html">日志</a>
						</dd>
						<dd>
							<a href="table.html">告警</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-list-alt"></i>策略配置<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="form.html">协同采集管理中心</a>
						</dd>
						<dd>
							<a href="form.html">汇聚系统</a>
						</dd>
						<dd>
							<a href="form.html">指挥系统</a>
						</dd>
						<dd>
							<a href="form.html">系统基本配置</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-external-link"></i>设备管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="popups.html">设备类型登记</a>
						</dd>
						<dd>
							<a href="popups.html">设备登记</a>
						</dd>
						<dd>
							<a href="popups.html">基本配置</a>
						</dd>
						<dd>
							<a href="popups.html">备份与恢复</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-bar-chart"></i>感知管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="echarts.html">采集项管理</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-tags"></i>安全系统管理<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="tab.html">软件登记</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-columns"></i>设备状态<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="paging.html">设备状态（时变）</a>
						</dd>
						<dd>
							<a href="paging.html">设备硬件信息（非时变）</a>
						</dd>
					</dl>
				</li>
				<li>
					<dl>
						<dt>
							<i class="icon-spinner"></i>异常报警<i class="icon-angle-right"></i>
						</dt>
						<dd>
							<a href="animation.html">异常报警（含证据）</a>
						</dd>
						<dd>
							<a href="animation.html">告警配置</a>
						</dd>
					</dl>
				</li>
			</ul>
			</nav>

		</div>
		<div class="content-wrap">
			<header class="top-hd">
			<div class="hd-lt">
				<a class="icon-reorder"></a>
			</div>
			<div class="hd-rt">
				<ul>
					<li><a target="_blank"><i class="icon-home"></i>前台访问</a></li>
					<li><a><i class="icon-random"></i>清除缓存</a></li>
					<li><a><i class="icon-user"></i>管理员:<em>Admin</em></a></li>
					<li><a><i class="icon-bell-alt"></i>系统消息</a></li>
					<li><a href="javascript:void(0)" id="JsSignOut"><i
							class="icon-signout"></i>安全退出</a></li>
				</ul>
			</div>
			</header>

			<main class="main-cont content mCustomScrollbar"> <!--开始::内容-->
			<div id="svgContent"></div>
			<script type="text/javascript">
				var data= ${result};
				console.log(data)
				
				var dataSet = {
					      nodes: [                   
					      ],
						  //edges是根据node的index来确定的
					      edges: [             
					      ]
					    };
				var w = 1200,h = 800;
				
				var listNodes=data.listNodes;
				for(var i=0;i<listNodes.length;i++)
				{			
					dataSet.nodes.push({"type":listNodes[i].nodeRemark, "name":listNodes[i].nodeName, "id":listNodes[i].nodeID,"x":listNodes[i].locationX, "y":listNodes[i].locationY,"fixed":true})
				}	
				var listEdges=data.listEdges;
				for(var i=0;i<listEdges.length;i++)
				{
					dataSet.edges.push({"source":listEdges[i].source,"target":listEdges[i].target});
				}
				 
				var edges = [];
				dataSet.edges.forEach(function(e) { 
				var sourceNode = dataSet.nodes.filter(function(n) { return n.id == e.source; })[0],
				targetNode = dataSet.nodes.filter(function(n) { return n.id == e.target; })[0];
					
				edges.push({source: sourceNode, target: targetNode});
				});
				 
				var zoom = d3.behavior.zoom()
				            .scaleExtent([0.1, 5])  
				            .on("zoom",  zoomed); 
				
				/* function zoom() {
				  g.attr("transform", d3.event.transform);
				} */
				
							
				var width_image ,height_image ;
				
				var svg = d3.select("#svgContent")
				                  .append("svg")
				                  .attr("width", w)
				                  .attr("height", h)
				                  .attr('preserveAspectRatio', 'xMinYMin slice')
				                  .append('g')
								  .call(zoom);	
				/*size()
					用于设定力学图的作用范围，使用方法为 force.size( [ x , y ] )，这个函数用于指定两件事：
					重力的重心位置为 ( x/2 , y/2 )所有节点的初始位置限定为 [ 0 , x ] 和 [ 0 , y ] 之间
					（但并非之后也是如此）如果不指定，默认为 [ 1 , 1 ] 。 
				*/
				    var force = self.force = d3.layout.force()
					   .nodes(dataSet.nodes)
				       .links(edges)
				       .linkStrength(0.5)
				       .gravity(0.05)
				       .distance(300)
				       .charge(-100)
				       .size([w,h])
				       .start(); 
				
				function zoomed() {  
					d3.select(this).attr("transform","translate(" + d3.event.translate + ")"+ 
					"scale(" + d3.event.scale + ")");
					if(zoom.scale()<=0.4){
						window.location.href='topo/topo_2?name='+dataSet.nodes[0].upperLevelAreaID;
					}
				}
				    var link = svg.selectAll(".link")
				      .data(edges)
				      .enter().append("line")
				      .attr("class", "link")
				      .attr("x1", function(d) { return d.source.x; })
				      .attr("y1", function(d) { return d.source.y; })
				      .attr("x2", function(d) { return d.target.x; })
				      .attr("y2", function(d) { return d.target.y; });	  
				
				
				    var node_drag = d3.behavior.drag()
				      .on("dragstart", dragstart)
				      .on("drag", dragmove)
				      .on("dragend", dragend)
					  .on("dragstart", function() {
						  //实现拖拽节点，整个图不动的效果
				        d3.event.sourceEvent.stopPropagation();
				    });
				
				    var node = svg.selectAll(".node")
				      .data(dataSet.nodes)
				      .enter().append("g")
				      .attr("class", "node")
					  .on("dblclick", dblclick)
				      .call(node_drag);
				
				  node.append("image")
					  .attr("xlink:href", function(d){     
						  return "${pageContext.request.contextPath}/resources/images/topo/"+d.type +".png";
				      })
				      .attr("x", -10)
				      .attr("y", -10)
				      .attr("width", function(d){    
						if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
							width_image=86;
							return width_image;
						}	  
						return 36;
				      })
				      .attr("height", function(d){    
				        if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
							height_image=86;
							return height_image;
						}
						return 36;
				      });
					  
				 node.append("text")
				      .attr("class", "nodetext")
					  .attr("x", function(d){    
						if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
							width_text=-16;
							return width_text;
						}	  
						return -20;
				      })
				      .attr("y", function(d){    
				        if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
							height_text=86;
							return height_text;
						}
						return 40;
				      })
					  
				      .text(function(d) { return d.name});	  
					  
					
					function dblclick(d) {
						//console.log("zoom.scale============>"+zoom.scale());
					   console.log("dblclick==============="+d.id+":\t"+d.x+"\t"+d.y);
					}  
					  
				    function dragstart(d, i) {
				      force.stop(); 
				    }
				
				    function dragmove(d, i) {
				      d.px += d3.event.dx;
				      d.py += d3.event.dy;
				      d.x += d3.event.dx;
				      d.y += d3.event.dy;
					  //console.log( "id:"+d.id+"\t"+"x:"+d.x +"\t"+"y:"+d.y);
				      tick();
				    }
				
				    function dragend(d, i) {
				      d.fixed = true; 
				      tick();
				      force.resume();
				    }
				
				    force.on("tick", tick);
				
				    function tick() {
				          link.attr("x1", function(d) { return d.source.x; })
				          .attr("y1", function(d) { return d.source.y; })
				          .attr("x2", function(d) { return d.target.x; })
				          .attr("y2", function(d) { return d.target.y; });
				
				      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				          }		
			</script> <!--开始::结束--> </main>
		</div>
	</div>
</body>
</html>
