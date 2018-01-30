$(function() {
	alert("sdasdasdasdasd");
	var new_data = {nodes: [],links: []};
	$.ajax({
		type : "POST",
		url : "topo/topo_preview",
		dataType : "json",
		data : {
			zoomLevel:0,
		},
		async:false,
		success : function(data) {
			var listNodes=data.listNodes;
			for(var i=0;i<listNodes.length;i++)
			{			
				new_data.nodes.push({"areaID":listNodes[i].areaID,node_output:"","NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID,"fx":listNodes[i].locationX, "fy":listNodes[i].locationY})
			}	
			var listEdges=data.listEdges;
			for(var i=0;i<listEdges.length;i++)
			{
				new_data.links.push({link_link_type:"NTG","source":listEdges[i].source,"target":listEdges[i].target});
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
		 	
		 	var div = d3.select("#preview").append("div")
 			.attr("class", "tooltip")
 			.style("opacity", 0);
		 	
		 	var simulation = d3.forceSimulation()
		 			.force("link", d3.forceLink().id(function(d) {
		 				return d.nodeID;
		 			}))
		 			.force("charge", d3.forceManyBody().strength(-400))
		 			//.force("center", d3.forceCenter(width_2 / 2, height_2 / 2))
		 			.force("xPos", d3.forceX(width_2/6))
    				.force("yPos", d3.forceY(height_2/2))
		 			.on("tick",tickHandle);
		 	simulation.stop();
		 	
		 	var force_svg = d3.select("#preview").append("div")
 			.append("svg")
 			.attr("width", 3*width_2/10)
 			.attr("height", height_2)
 			.style("fill","white")
		 	.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", function () 
			{
				force_svg.attr("transform", d3.event.transform)
			})).append("g");
		 	
            force_svg.append('defs').append('marker')
		        .attr('id','end')
		        .attr('viewBox','-0 -5 10 10')
		        .attr('refX',25)
		        .attr('refY',0)
		        .attr('orient','auto')
		        .attr('markerWidth',10)
		        .attr('markerHeight',10)
		        .attr('xoverflow','visible')
		        .append('svg:path')
		            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
		            .attr('fill', '#ccc')
		            .attr('stroke','#ccc');
		 	
		 	force_svg.append("g").attr("id","link_group");
		 	force_svg.append("g").attr("id","path_group");
		 	force_svg.append("g").attr("id","node_group");
		 	force_svg.append("g").attr("id","lable_group");
		 	
		 	path =   force_svg.select("#path_group").selectAll(".path");
		 	node = force_svg.select("#node_group").selectAll(".node");
		 	link = force_svg.select("#link_group").selectAll(".line");
		 	linklabels = force_svg.select("#lable_group").selectAll(".lable");
			
		 	//节点的点击事件
			function click(d) {
				console.log("id:"+d.nodeID+"  x,y坐标:"+d.x+","+d.y);	
				//获取全部的node节点，以及其image标签
				d3.selectAll(".node").select("image").transition()
                .duration(200)//动画变化过程需要的时间
                .attr("x", -16)
				.attr("y", -16)
				.attr("width", 32)
    	 		.attr("height", 32);
				////获取全部的node节点，以及其text标签
	 			d3.selectAll(".node").select("text").transition()
	 	        .duration(200)
		        .attr("dx",-46)
				.attr("dy",36)
				.style("fill", "black")
	 		    .style("stroke", null) //SVG stroke 属性 
	 	        .style("stroke-width", null)//SVG stroke-width属性
	 	        .style("font", null)
	 	       ;
			
	     		d3.select(this).select("image").transition()
                .duration(200)//这个变化过程需要多长时间
                .attr("x", -32)
    	 		.attr("y", -32)
    	 		.attr("width", 100)
    	 		.attr("height", 100);
	 				
	 			d3.select(this).select("text").transition()
	 		    .duration(200)
	 		    .attr("dx", -46)
	 		    .attr("dy",-16)
	 		    .style("fill", "blue")	 		      
	 		    .style("font", "20px sans-serif")
	 			.style("z-index",999);
	 			
	 			//当触发点击事件时,修改右侧div里面的内容，即获取第二层里面的详细信息
				getZoomLevel2Details(d.areaID);
			}  
			
			
		 	function showForce(){
		 		//边
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

		 		//节点 
		 		node = node.data(graph.nodes);

		 		//remove 
		        node.exit().remove();
		 		var nodeEnter = node.enter()
	 			.append("g")
	 			.attr("class","node")	 			
				.on("click", click)
	 			.call(d3.drag().on("start", dragstarted)
		 				.on("drag", dragged)
		 				.on("end", dragended));
		 		
		 		
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
	 					return d.x=Math.max(16, Math.min(width_2 - 16, d.x));
	 				})
	 				.attr("cy", function(d) {
	 					return d.y= Math.max(16, Math.min(height_2 - 16, d.y));
	 				});

	 			 link.attr("x1", function(d) {
	 					return d.source.x;
	 				})
	 				.attr("y1", function(d) {
	 					return d.source.y;
	 				})
	 				.attr("x2", function(d) {
	 					return d.target.x;
	 				})
	 				.attr("y2", function(d) {
	 					return d.target.y;
	 				}); 
	 			
	 			node.attr("transform", function(d) {
	 				return "translate(" + d.x + "," + d.y + ")";
	 			});
	 			
	 			//更新文字坐标
	 			node_text.attr("x", function(d) {
	 					return d.x;
	 				})
	 				.attr("y", function(d) {
	 					return d.y;
	 				});
	 		}
		 	
		 	function myGraph() {
		 		//处理节点
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

		 		//处理边

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
		 		
				//处理节点
	 			$.each(new_data.nodes, function(i,new_node) {
	 				var old_node = my_graph.findNode(new_node.nodeID);
	 				if (!old_node) {
	 					my_graph.addNode(new_node);
	 				} else {
	 					my_graph.updateNode(new_node);
	 				}
	 			});
	 			my_graph.clearNode(new_data.nodes);

	 			//处理边
	 			$.each(new_data.links,function(i,new_link) {
	 				var old_link = my_graph.findLink(new_link.source, new_link.target);
	 				if (!old_link) {
	 					my_graph.addLink(new_link);
	 				} else {
	 					old_link.link_link_type = new_link.link_link_type;
	 				}
	 			});
	 			my_graph.clearLink(new_data.links); 		
		 	}
			reloadData();
		 	
		 	
		 	$(window).resize(function() {
		 		width_2 = $(window).width();
		 		height_2 = $(window).height();
		 		reloadData(); 	
		 	});
		 	
});

