$(function() {
	var dataSet = {nodes: [],links: []};
	var scaleFactor = 1;
	var translation = [0,0];
	
	$.ajax({
		type : "POST",
		url : "topo/topo_detail",
		dataType : "json",
		data : {
			zoomLevel:1,
		},
		async:false,
		success : function(data) {
			var listNodes=data.listNodes;
			for(var i=0;i<listNodes.length;i++)
			{			
				dataSet.nodes.push({"nodeRemark":"该节点下面还有"+listNodes[i].nextLevelNum+"层","NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID,"fx":listNodes[i].locationX, "fy":listNodes[i].locationY})
			}	
			var listEdges=data.listEdges;
			for(var i=0;i<listEdges.length;i++)
			{
				dataSet.links.push({link_link_type:"NTG","source":listEdges[i].source,"target":listEdges[i].target});
			}  
		}
	});
	
		 	var width_2 = $(window).width();
		 	var height_2;
		 	if(parent){
		 		height_2 = $(parent).height();
		 	}else{
		 		height_2 = $(window).height();
		 	}
		 	var link,node,node_text,path,linklabels;
		 	var graph = {links:[],nodes:[]};
		 	
		 	var div = d3.select("#detail").append("div")
 			.attr("class", "tooltip")
 			.style("opacity", 0);
		 	
		 	
		 	var axiSvg = d3.select("#detail").append("div")
		 	.append("svg")
 			.attr("width", 10*width_2/10)
 			.attr("height", 1/18*height_2)
 			.style("fill","white");
 			
 			var xScale = d3.scaleLinear()     //坐标轴比例尺
 			.domain([0,5])
 			.range([100,300]);
			
			axiSvg
			.append("g")
			.attr("transform","translate(0,10)")
			.call(d3.axisBottom(xScale));
			
			
			
			//散点图绘制
			var dataset = [1];
			//初始化
			drawCircle();
			
			//外边框
			//var padding = {top: 30, right:30, bottom:30, left: 30};
			
			function drawCircle(){
				//绑定数据，获取update部分
				var circleUpdate = axiSvg.selectAll("circle")
				.data(dataset);        //绑定数据
				//console.log(dataset);
				//获取enter部分
				var circleEnter = circleUpdate.enter();
				
				//获取exit部分
				var circleExit = circleUpdate.exit();
				
				//1.update 部分的处理办法
				//使用过渡的方式，缓缓的移动到新坐标的位置
				circleUpdate.transition()
				.duration(500)
				.attr("cy",10)
				.attr("cx",function(d) {return 100 + d*40;});
				
				
				//2.enter 部分的处理方法
				//插入园到坐标原点，然后
				circleEnter.append("circle")
				.attr("r", 5)
				.attr("cy",10)
				.attr("cx",function(d) {return 100 + d*40;});
				
				//3.exit
				circleExit.remove();
			}
			
			function updateAxis(num){
				dataset.pop();
				dataset.push(num);
				drawCircle();
			}
		 	
		 	var simulation = d3.forceSimulation()
		 			.force("link", d3.forceLink().id(function(d) {
		 				return d.nodeID;
		 			}))
		 			.force("charge", d3.forceManyBody().strength(-400))
		 			 .force("xPos", d3.forceX(width_2/2))
    				.force("yPos", d3.forceY(height_2/2))
		 			.on("tick",tickHandle);
		 	simulation.stop();
		 	
		 	var force_svg = d3.select("#detail").append("div")
 			.append("svg")
 			.attr("width", 10*width_2/10)
 			.attr("height", 2*height_2)
 			.style("fill","white")
		 	.call(d3.zoom().scaleExtent([0, 5]).on("zoom", function (d) 
			{
				//语义缩放
		 		scaleFactor = d3.event.transform.k;
		 		translation = [d3.event.transform.x, d3.event.transform.y];
		 		tickHandle();
		 		
				updateAxis(d3.event.transform.k)
			})).append("g");
		 	
		 	
		 	force_svg.append("g").attr("id","link_group");
		 	force_svg.append("g").attr("id","node_group");
		 	
		 	node = force_svg.select("#node_group").selectAll(".node");
		 	link = force_svg.select("#link_group").selectAll(".line");
			
			function click(d) {
				console.log("click==============="+d.nodeID);
			}  
		 	function showForce(){
		 		//link
		 		link  = link.data(graph.links);
		 		link.exit().remove();
		 		var linkEnter = link
		 	      .enter()
		 	      .append("line")
		 	      .attr("class","link")
		 	      .attr("id",function(d,i) {return 'line'+i})
		 	      .style("stroke","#ccc")
		 	      .style("pointer-events", "none");
		 		
		 		link = linkEnter.merge(link);

		 		//node 
		 		node = node.data(graph.nodes);

		 		//可以删除掉多余的元素
		        node.exit().remove();
		 		var nodeEnter = node.enter()
	 			.append("g")
	 			.attr("class","node")
	 		
	 			/*.on("mouseover", function(d) {
	 				div.transition()
	 					.duration(200)
	 					.style("opacity", .9);
	 				div.html(d.nodeRemark)
	 					.style("left", (d3.event.pageX-200) + "px")
	 					.style("top", (d3.event.pageY - 50) + "px");
	 				d3.select(this).select("image").transition()
                    .duration(200)
                    .attr("x", -32)
    	 			.attr("y", -32)
    	 			.attr("width", 48)
    	 			.attr("height", 48);
	 				
	 				d3.select(this).select("text").transition()
	 		        .duration(200)
	 		        .attr("dx", -32)
	 		        .attr("dy",-32)
	 		        .style("fill", "blue")	 		      
	 		        .style("font", "20px sans-serif")
	 				.style("z-index",999);
	 				
	 			}).on("mouseout", function () {
	 				div.transition()
 					.duration(200)
 					.style("opacity", 0);
	 				d3.select(this).select("image").transition()
                    .duration(200)
                    .attr("x", -16)
    	 			.attr("y", -16)
    	 			.attr("width", 32)
    	 			.attr("height", 32);
	 				d3.select(this).select("text").transition()
	 		        .duration(200)
	 		        .attr("dx",-46)
	 		        .attr("dy",36)
	 		        .style("fill", "black")
	 		        .style("stroke", null)
	 		        .style("stroke-width", null)
	 		        .style("font", null)
	 		        .style("z-index",null);
	 	        })*/
				//.on("click", click)
	 			.call(d3.drag().on("start", dragstarted)
		 				.on("drag", dragged)
		 				.on("end", dragended))
		 		.call(d3.zoom().scaleExtent([1 / 2, 5]).on("zoom", function (d) 
	 					{
					force_svg.attr("transform", d3.event.transform)
					if(d3.event.transform.k>=1.1)
						getZoomLevel2Details(d.nodeName);
				}));
		 		
		 		
		 		//更新
		 		node.select("text").text(function(d) {
	 					return d.nodeName;
	 			}).style("fill", "black");
	 			//new 
		 		node_text = nodeEnter.append("text")
	 			.style("fill", "black")
	 			.attr("dx", -46)
	 			.attr("dy", 36)
	 			.text(function(d) {
	 				return d.nodeName+"id:"+d.nodeID;
	 			});		
		 		//update
		 		node.select("image").attr("xlink:href", function(d) {
	 				return "resources/images/topo/"+d.NodePicName +".png";
	 			});		
		 		
		 		//new
		 		var node_image = nodeEnter.append("image")
	 			.attr("xlink:href", function(d) {
	 				return "resources/images/topo/"+d.NodePicName +".png";
	 			})
	 			.attr("x", -16)
	 			.attr("y", -16)
	 			.attr("width", 42)
	 			.attr("height", 42);
		 				 		
		 		node = nodeEnter.merge(node);
		 		simulation.stop();
                
	 		    simulation.nodes(graph.nodes);
	 		              
	 		    simulation.force("link").links(graph.links).distance(120);
	 		    simulation.alpha(3);
	 		    simulation.restart();
		 	}		 	
		 	function dragstarted(d) {
	 			if (!d3.event.active) simulation.alphaTarget(1).restart();
	 			d.fx = d.x;
	 			d.fy = d.y;
	 		}

	 		function dragged(d) {
	 			d.fx = d3.event.x;
	 			d.fy = d3.event.y;
	 		}
			//d3 v3里面设置节点固定是使用fixed s属性
	        //d3 v4里面设置节点固定是使得fx,fy不为null
	 		function dragended(d) {
	 			if (!d3.event.active) simulation.alphaTarget(0);
	 			 d.fx = d.x;
	 			d.fy = d.y; 
	 		}		 	
		 	function tickHandle() { //对于每一个时间间隔
	 			node.attr("cx", function(d) {
	 				      
	 					//	d.x=Math.max(16, Math.min(width_2 - 16, d.x));
	 						//d.x = translation[0] + scaleFactor*d.x;
	 					
	 						return d.x;
	 				})
	 				.attr("cy", function(d) {
	 					//d.y= Math.max(16, Math.min(height_2 - 16, d.y));
	 					//  d.y = translation[1] + scaleFactor*d.y;
	 				
	 					     return d.y;
	 					
	 				});

	 			 link.attr("x1", function(d) {
	 					return translation[0] + scaleFactor*d.source.x;
	 				})
	 				.attr("y1", function(d) {
	 					return translation[1] + scaleFactor*d.source.y;
	 				})
	 				.attr("x2", function(d) {
	 					return translation[0] + scaleFactor*d.target.x;
	 				})
	 				.attr("y2", function(d) {
	 					return translation[1] + scaleFactor*d.target.y;
	 				}); 	 		
	 			
	 			node.attr("transform", function(d) {
	 				return "translate(" + (translation[0] + scaleFactor*d.x) + "," + (translation[1] + scaleFactor*d.y) + ")";
	 			});
	 			
	 			//更新文字坐标
	 			node_text.attr("x", function(d) {
	 					return translation[0] + scaleFactor*d.x;
	 				})
	 				.attr("y", function(d) {
	 					return translation[1] + scaleFactor*d.y;
	 				});
	 		}
		 	
		 	
			//-------------------define force end----------------
		 	function myGraph() {
		 		//---------node------------------------------
		 		this.findNode = function(id) {
		 			for (var i in graph.nodes) {
		 				if (graph.nodes[i]["nodeID"] === id) return graph.nodes[i];
		 			}
		 			return null;
		 		};

		 		this.findNodeIndex = function(id) {
		 			for (var i = 0; i < graph.nodes.length; i++) {
		 				if (graph.nodes[i].nodeID == id) {
		 					return i;
		 				}
		 			}
		 			return null;
		 		};
		 		this.removeNodeByIndex = function(index, id) {
		 			var i = graph.links.length;
		 			while (i--) {
		 				if ((graph.links[i]['source'].nodeID == id) || (graph.links[i]['target'].nodeID == id)) {
		 					graph.links.splice(i, 1);
		 				}
		 			}
		 			graph.nodes.splice(index, 1);
		 		};

		 		this.clearNode = function(new_nodes) {
		 			var i = this.getNodeLength();
		 			if (new_nodes.length < i) {
		 				while (i--) {
		 					if (!this.findeNodeInArray(new_nodes, graph.nodes[i]["nodeID"])) {
		 						this.removeNodeByIndex(i, graph.nodes[i]["nodeID"]);
		 					}
		 				}
		 			}
		 			update();
		 		}

		 		this.getNodeLength = function() {
		 			if (graph && graph.nodes) {
		 				return graph.nodes.length;
		 			}
		 			return 0;
		 		}
		 		this.findeNodeInArray = function(obj_arr, id) {
		 			for (var n in obj_arr) {
		 				if (n["nodeID"] === id) return n;
		 			}
		 			return null;
		 		};

		 		this.addNode = function(new_node) {
		 			graph.nodes.push( jQuery.extend(true, {}, new_node));
		 			update();
		 		};

		 		this.updateNode = function(new_data_node) {
		 			var index = this.findNodeIndex(new_data_node.nodeID);
		 			if (index) {
		 				for (var attr in new_data_node) {
		 					if (new_data_node.hasOwnProperty(attr)) graph.nodes[index][attr] = new_data_node[attr];
		 				}
		 			}
		 			update();
		 		}

		 		this.findLink = function(source, target) {
		 			for (var i = 0; i < graph.links.length; i++) {
		 				if (graph.links[i].source.nodeID == source && graph.links[i].target.nodeID == target) {
		 					return graph.links[i];
		 				}
		 			}
		 			return null;
		 		}

		 		this.findLinkInArray = function(objArray, link) {
		 			for (var l in objArray) {
		 				if (l.source == link.source.nodeID && l.target == link.target.nodeID) {
		 					return l;
		 				}
		 			}
		 			return null;
		 		}
				
		 		this.clearLink = function(links) {
		 			var i = graph.links.length;
		 			if (links.length < i) {
		 				while(i--){
		 					if (!this.findLinkInArray(links, graph.links[i])) {
		 						graph.links.splice(i, 1);
		 					}
		 				}
		 			}
		 			update();
		 		}

		 		this.removeLink = function(source, target) {
		 			for (var i = 0; i < graph.links.length; i++) {
		 				if (graph.links[i].source.nodeID == source && graph.links[i].target.nodeID == target) {
		 					graph.links.splice(i, 1);
		 					break;
		 				}
		 			}
		 			update();
		 		};

		 		this.removeallLinks = function() {
		 			graph.links.splice(0, graph.links.length);
		 			update();
		 		};

		 		this.removeAllNodes = function() {
		 			graph.nodes.splice(0, graph.nodes.length);
		 			update();
		 		};

		 		this.addLink = function(newLink) {
		 			graph.links.push(jQuery.extend(true, {}, newLink));
		 			update();
		 		};

		 		var update = function() {
		 			showForce();
		 			if(parent.iframeLoaded){
		 				parent.iframeLoaded();
		 			}
		 		};
		 		update();
		 	}
		 	
		 	var my_graph;
		 	function reloadData() {
		 		if(!my_graph){
			 		my_graph = new myGraph();
		 		}
		 		
				//handle node
	 			$.each(dataSet.nodes, function(i,new_node) {
	 				var old_node = my_graph.findNode(new_node.nodeID);
	 				if (!old_node) {
	 					my_graph.addNode(new_node);
	 				} else {
	 					my_graph.updateNode(new_node);
	 				}
	 			});
	 			my_graph.clearNode(dataSet.nodes);

	 			//handle line
	 			$.each(dataSet.links,function(i,new_link) {
	 				var old_link = my_graph.findLink(new_link.source, new_link.target);
	 				if (!old_link) {
	 					my_graph.addLink(new_link);
	 				} else {
	 					old_link.link_link_type = new_link.link_link_type;
	 				}
	 			});
	 			my_graph.clearLink(dataSet.links); 		
		 	}
			reloadData();
		 	
		 	
		 	$(window).resize(function() {
		 		width_2 = $(window).width();
		 		height_2 = $(window).height();
		 		reloadData(); 	
		 	});
		 	
});

