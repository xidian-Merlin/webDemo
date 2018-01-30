var dataSet = {nodes: [],links: []};
//关口站
var gateWayStation;

//显示第二层的拓扑(收缩之后的拓扑)
function getZoomLevel2Details(gateWayStation) {
	gateWayStation=gateWayStation;
	$("#detail").empty();
	dataSet = {nodes: [],links: []};
	$.ajax({
		type : "POST",
		url : "topo/topo_detail_2",
		dataType : "json",
		data : {
			zoomLevel:2,
			//上层区域id
			upperLevelAreaID:1,
		},
		async:false,
		success : function(data) {
			if(data.result)
			{
			    var listNodes=data.listNodes;
			    //临时节点list,记录当前节点中，不属于该关口站的节点
			    var tempListNodes=[];
				for(var i=0;i<listNodes.length;i++)
				{	
					if(listNodes[i].zoomLevelMin==1)
					{
						tempListNodes.push(listNodes[i].nodeID);
					}
					if(listNodes[i].locationX||listNodes[i].locationY)
						dataSet.nodes.push({"nodeRemark":"该节点下面还有"+listNodes[i].nextLevelNum+"层","zoomLevelMin":listNodes[i].zoomLevelMin,"areaID":listNodes[i].areaID,"NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID,"fx":listNodes[i].locationX, "fy":listNodes[i].locationY})
					else
						dataSet.nodes.push({"nodeRemark":"该节点下面还有"+listNodes[i].nextLevelNum+"层","zoomLevelMin":listNodes[i].zoomLevelMin,"areaID":listNodes[i].areaID,"NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID})	
				}	
				var listEdges=data.listEdges;
				for(var i=0;i<listEdges.length;i++)
				{
					//标记边
					//对于不属于该关口站的节点所在的边进行标记
					var link_link_type="";
					for(var j=0;j<tempListNodes.length;j++)
						if(tempListNodes[j]==listEdges[i].source||tempListNodes[j]==listEdges[i].target)
							link_link_type="OUT_LINE";//标记为外联边
					dataSet.links.push({"link_link_type":link_link_type,"source":listEdges[i].source,"target":listEdges[i].target});
				}  
			}else{
					$("#detail").empty();
				}
			}
	});
	
	var width_2 = $(window).width();
 	var height_2;
 	if(parent){
 		height_2 = 1.5*$(parent).height();
 	}else{
 		height_2 = 1.5*$(window).height();
 	}

 	var link,node,node_text,path,linklabels;
 	var graph = {links:[],nodes:[]};
 	
 	var div = d3.select("#detail").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
 	
 	var axiSvg = d3.select("#detail").append("div")
 	.append("svg")
		.attr("width", 10*width_2/10)
		.attr("height", 1/20*height_2)
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
	function drawCircle(){
		//绑定数据，获取update部分
		var circleUpdate = axiSvg.selectAll("circle")
		.data(dataset);        //绑定数据
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
 	
	//document.getElementById('detail').innerHTML=gateWayStation; 
 	var simulation = d3.forceSimulation()
 			.force("link", d3.forceLink().id(function(d) {
 				return d.nodeID;
 			}))
 			.force("charge", d3.forceManyBody().strength(-300))
 			//.force("center", d3.forceCenter(width_2 / 2, height_2 / 2))
 			 .force("xPos", d3.forceX(width_2/2))
			.force("yPos", d3.forceY(height_2/10))
 			.on("tick",tickHandle);
 	simulation.stop();
 	
 	var force_svg = d3.select("#detail").append("div")
		.append("svg")
		.attr("width", width_2/1)
		.attr("height", height_2)
		.style("fill","white")
 	.call(d3.zoom().scaleExtent([0, 8]).on("zoom", function () 
	{
		force_svg.attr("transform", d3.event.transform)
		updateAxis(d3.event.transform.k)
		if(d3.event.transform.k<=0.3)
		{
			getDetailTopo();
		}
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
	
	function dblclick(d) {
		console.log("dblclick==============="+d.nodeID);
	}  
 	function showForce(){
 		//link
 		link = link.data(graph.links);
 		link.exit().remove();
 		var linkEnter = link
 	      .enter()
 	      .append("line")
 	      .attr("class","link")
 	      .attr("id",function(d,i) {return 'line'+i})
 	      .style("stroke",function(d){
 	    	  if(d.link_link_type=="OUT_LINE"){
 	    		  return "#F00";
 	    		 }
 	    	  else
 	    		  return "#ccc";
 	      })
 	      .style("pointer-events", "none")
 	      .style("stroke-width", function(d){
 	    	  if(d.link_link_type=="OUT_LINE"){
 	    		  return 10;
 	    		 }
 	    	  else
 	    		  return 1;
 	      });
 		
 		path = path.data(graph.links);
 		path.exit().remove();
 		var pathEnter = path.enter().append('path').
 		attr('class','path')
         .attr('fill-opacity',0)
                .attr('stroke-opacity',0)
               	.attr('fill','blue')
                .attr('stroke','red')
                .attr('id',function(d,i) {return 'link'+i})
         .style("pointer-events", "none");
 		path = pathEnter.merge(path);
 		
 		linklabels = linklabels.data(graph.links);
 		//remove exit
 		linklabels.exit().remove();
 		var linklabelsEnter = linklabels.enter().append('text')
         .style("pointer-events", "none")
         .attr('id',function(d,i){return 'linklabe'+i})
                .attr('dx',80)
                .attr('dy',0)
                .attr('font-size',10)
                .attr('fill','#aaa');
        //update
 		linklabels.select("text").select("textPath").attr('xlink:href',function(d,i) {return '#link'+i})
         .style("pointer-events", "none")
         .text(function(d,i){			
			return "";
         });
 		
 		//new 
 		linklabelsEnter.append('textPath')
         .attr('xlink:href',function(d,i) {return '#link'+i})
         .style("pointer-events", "none")
         .text(function(d,i){
			return "";
         });
 		linklabels = linklabelsEnter.merge(linklabels);
 		link = linkEnter.merge(link);

 		//node 
 		node = node.data(graph.nodes);

 		//remove 
        node.exit().remove();
 		var nodeEnter = node.enter()
			.append("g")
			.attr("class","node")
		
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				//鼠标移入时， 
			    //（1）通过 div.html() 来显示提示框的文字 
			    //（2）通过更改样式left和 top来设定提示框的位置
				div.html(d.nodeRemark)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 50) + "px");
				d3.select(this).select("image").transition()
            .duration(200)
            .attr("x",  function(d){
 				if(d.zoomLevelMin==1)
 					return -100;
 				else 
 					return -32;
 			})
 			.attr("y", function(d){
 				if(d.zoomLevelMin==1)
 					return -100;
 				else 
 					return -32;
 			})
 			.attr("width", function(d){
 				if(d.zoomLevelMin==1)
 					return 200;
 				else 
 					return 48;
 			})
 			.attr("height", function(d){
 				if(d.zoomLevelMin==1)
 					return 200;
 				else 
 					return 48;
 			});
				
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
            .attr("x",  function(d){
 				if(d.zoomLevelMin==1)
 					return -100;
 				else 
 					return -16;
 			})
 			.attr("y",  function(d){
 				if(d.zoomLevelMin==1)
 					return -100;
 				else 
 					return -16;
 			})
 			.attr("width", function(d){
 				if(d.zoomLevelMin==1)
 					return 200;
 				else 
 					return 48;
 			})
 			.attr("height", function(d){
 				if(d.zoomLevelMin==1)
 					return 200;
 				else 
 					return 48;
 			});
				
			d3.select(this).select("text").transition()
		      .duration(200)
		      .attr("dx",-46)
		      .attr("dy",36)
		      .style("fill", "black")
		      .style("stroke", null)
		      .style("stroke-width", null)
		      .style("font", null)
		      .style("z-index",null);
	        })
			.call(d3.drag().on("start", dragstarted)
 				.on("drag", dragged)
 				.on("end", dragended))
 		.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", function (d) 
					{
			force_svg.attr("transform", d3.event.transform)
			console.log("zoom====>"+d.nodeID);
			console.log("zoom.scale()====>"+d3.event.transform.k);
			if(d3.event.transform.k>=1.5)
				getZoomLevel3Details(gateWayStation);
		}));
 		
 		//更新
 		node.select("text").text(function(d) {
					return d.nodeName+"id:"+d.nodeID;
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
			})
			.attr("x",function(d){    
				if(d.zoomLevelMin==1){
					return -100;
				}else
					return -16;
			})
			.attr("y", function(d){    
				if(d.zoomLevelMin==1){
					return -100;
				}else
					return -16;
			})
			.attr("width", function(d){    
				if(d.zoomLevelMin==1){
					return 200;
				}else
					return 42;
			})
			.attr("height", function(d){    
				if(d.zoomLevelMin==1){
					return 200;
				}else
					return 42;
				});		
 		
 		//new
 		var node_image = nodeEnter.append("image")
			.attr("xlink:href", function(d) {
				return "resources/images/topo/"+d.NodePicName +".png";
			})
			.attr("x", -16)
			.attr("y", -16)
			.attr("width", function(d){    
				if(d.zoomlevelMin==1){
					return 200;
				}else
					return 42;
			})
			.attr("height", function(d){    
				if(d.zoomlevelMin==1){
					return 200;
				}else
					return 42;
				});
 				 		
 		node = nodeEnter.merge(node);
 		simulation.stop();
        
		simulation.nodes(graph.nodes);
		              
		simulation.force("link").links(graph.links).distance(20);
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
			path.attr("d", function(d) {
		        return "M" + 
	            d.source.x + "," + 
	            d.source.y + "L" + 
	            (d.target.x) + "," + 
	            (d.target.y)}
	            );
			linklabels.attr('transform',function(d,i){
	            if (d.target.x<d.source.x){
	                bbox = this.getBBox();
	                rx = bbox.x+bbox.width/2;
	                ry = bbox.y+bbox.height/2;
	                return 'rotate(180 '+rx+' '+ry+')';
	                }
	            else {
	                return 'rotate(0)';
	                }
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
 		
			$.each(dataSet.nodes, function(i,new_node) {
				var old_node = my_graph.findNode(new_node.nodeID);
				if (!old_node) {
					my_graph.addNode(new_node);
				} else {
					my_graph.updateNode(new_node);
				}
			});
			my_graph.clearNode(dataSet.nodes);

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
}
//获取第3层的详细拓扑
function getZoomLevel3Details(gateWayStation) {
	$("#detail").empty();
	dataSet = {nodes: [],links: []};
	$.ajax({
		type : "POST",
		url : "topo/topo_detail_3",
		dataType : "json",
		data : {
			zoomLevel:3,
		},
		async:false,
		success : function(data) {
			if(data.result)
			{
			    var listNodes=data.listNodes;
				for(var i=0;i<listNodes.length;i++)
				{	
					if(listNodes[i].locationX||listNodes[i].locationY)
						dataSet.nodes.push({"nodeRemark":"该节点下面还有"+listNodes[i].nextLevelNum+"层","areaID":listNodes[i].areaID,"NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID,"fx":listNodes[i].locationX, "fy":listNodes[i].locationY})
					else
						dataSet.nodes.push({"nodeRemark":"该节点下面还有"+listNodes[i].nextLevelNum+"层","areaID":listNodes[i].areaID,"NodePicName":listNodes[i].NodePicName, "nodeName":listNodes[i].nodeName, "nodeID":listNodes[i].nodeID})	
				}	
				var listEdges=data.listEdges;
				for(var i=0;i<listEdges.length;i++)
				{
					dataSet.links.push({link_link_type:"NTG","source":listEdges[i].source,"target":listEdges[i].target});
				}  
			}else{
					$("#detail").empty();
				}
			}

	});
	//document.getElementById('detail').innerHTML=gateWayStation; 
	var width_2 = 1.5*$(window).width();
 	var height_2;
 	if(parent){
 		height_2 = 1.5*$(parent).height();
 	}else{
 		height_2 = 1.5*$(window).height();
 	}

 	//定义拓扑图所需内容
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
	function drawCircle(){
		//绑定数据，获取update部分
		var circleUpdate = axiSvg.selectAll("circle")
		.data(dataset);        //绑定数据
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
 			 .force("xPos", d3.forceX(width_2/3))
			.force("yPos", d3.forceY(height_2/2))
 			.on("tick",tickHandle);
 	simulation.stop();
 	var force_svg = d3.select("#detail").append("div")
		.append("svg")
		.attr("width", width_2/1)
		.attr("height", 2*height_2/1)
		.style("fill","white")
 	.call(d3.zoom().scaleExtent([0, 5]).on("zoom", function () 
	{
		force_svg.attr("transform", d3.event.transform)
		if(d3.event.transform.k<=0.25)
		{
			console.log("缩放因子======>"+d3.event.transform.k);
			getZoomLevel2Details(gateWayStation);
		}
	})).append("g");
 	
 	//可以为边添加指向性箭头
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
 	
    //添加link path node lable 等属性
 	force_svg.append("g").attr("id","link_group");
 	force_svg.append("g").attr("id","path_group");
 	force_svg.append("g").attr("id","node_group");
 	force_svg.append("g").attr("id","lable_group");
 	
 	//获得这些元素
 	path =   force_svg.select("#path_group").selectAll(".path");
 	node = force_svg.select("#node_group").selectAll(".node");
 	link = force_svg.select("#link_group").selectAll(".line");
 	linklabels = force_svg.select("#lable_group").selectAll(".lable");
	
	//展示力导向图
 	function showForce(){
 		//填充边数据
 		link  = link.data(graph.links);
 		link.exit().remove();
 		var linkEnter = link
 	      .enter()
 	      .append("line")
 	      .attr("class","link")
 	      .attr("id",function(d,i) {return 'line'+i})
 	      .style("stroke","#ccc")
 	      .style("pointer-events", "none");
 		
 		//填充path数据
 		path = path.data(graph.links);
 		path.exit().remove();
 		var pathEnter = path.enter().append('path').
 		attr('class','path')
         .attr('fill-opacity',0)
                .attr('stroke-opacity',0)
               	.attr('fill','blue')
                .attr('stroke','red')
                .attr('id',function(d,i) {return 'link'+i})
         .style("pointer-events", "none");
 		path = pathEnter.merge(path);
 		
 		linklabels = linklabels.data(graph.links);
 		//remove exit
 		linklabels.exit().remove();
 		var linklabelsEnter = linklabels.enter().append('text')
         .style("pointer-events", "none")
         .attr('id',function(d,i){return 'linklabe'+i})
                .attr('dx',80)
                .attr('dy',0)
                .attr('font-size',10)
                .attr('fill','#aaa');
        //update
 		linklabels.select("text").select("textPath").attr('xlink:href',function(d,i) {return '#link'+i})
         .style("pointer-events", "none")
         .text(function(d,i){
        	 
        	//TODO 这里可以为边添加文字说明
			return "";
         });
 		
 		//new 
 		linklabelsEnter.append('textPath')
         .attr('xlink:href',function(d,i) {return '#link'+i})
         .style("pointer-events", "none")
         .text(function(d,i){
        	//TODO 这里可以为边添加文字说明
			return "";
         });
 		linklabels = linklabelsEnter.merge(linklabels);
 		link = linkEnter.merge(link);

 		//node 
 		node = node.data(graph.nodes);

 		//remove 
        node.exit().remove();
 		var nodeEnter = node.enter()
			.append("g")
			.attr("class","node")
		
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(d.nodeRemark)
					.style("left", (d3.event.pageX-100) + "px")
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
	        })
		//.on("dblclick", dblclick)
			.call(d3.drag().on("start", dragstarted)
 				.on("drag", dragged)
 				.on("end", dragended))
 		.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", function (d) 
					{
			force_svg.attr("transform", d3.event.transform)				
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
		              
		simulation.force("link").links(graph.links).distance(50);
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
			path.attr("d", function(d) {
		        return "M" + 
	            d.source.x + "," + 
	            d.source.y + "L" + 
	            (d.target.x) + "," + 
	            (d.target.y)}
	            );
			linklabels.attr('transform',function(d,i){
	            if (d.target.x<d.source.x){
	                bbox = this.getBBox();
	                rx = bbox.x+bbox.width/2;
	                ry = bbox.y+bbox.height/2;
	                return 'rotate(180 '+rx+' '+ry+')';
	                }
	            else {
	                return 'rotate(0)';
	                }
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

 	//定时修改数据，以后可以用到
 	/*d3.interval(function() {
 		//new_data.nodes[Math.floor(Math.random()*new_data.nodes.length)].node_current_state = Math.floor(Math.random()*4);
 		reloadData();
 	}, 60000, d3.now());*/
 	
 	var my_graph;
 	function reloadData() {
 		if(!my_graph){
	 		my_graph = new myGraph();
 		}
 		
		//处理节点数据
			$.each(dataSet.nodes, function(i,new_node) {
				var old_node = my_graph.findNode(new_node.nodeID);
				if (!old_node) {
					my_graph.addNode(new_node);
				} else {
					my_graph.updateNode(new_node);
				}
			});
			my_graph.clearNode(dataSet.nodes);

			//处理边数据
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
 		//获得浏览器宽度，jquery库
 		width_2 = $(window).width();
 		height_2 = $(window).height();
 		reloadData(); 	
 	});
}


//获取第一层的拓扑
function getDetailTopo()
{
	$("#detail").empty();
	var dataSet = {nodes: [],links: []};
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
			function drawCircle(){
				//绑定数据，获取update部分
				var circleUpdate = axiSvg.selectAll("circle")
				.data(dataset);        //绑定数据
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
		 	.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", function (d) 
			{
				force_svg.attr("transform", d3.event.transform)
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
	 		
	 			.on("mouseover", function(d) {
	 				div.transition()
	 					.duration(200)
	 					.style("opacity", .9);
	 				div.html(d.nodeRemark)
	 					.style("left", (d3.event.pageX-20) + "px")
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
	 	        })
				//.on("click", click)
	 			.call(d3.drag().on("start", dragstarted)
		 				.on("drag", dragged)
		 				.on("end", dragended))
		 		.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", function (d) 
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
}


