$(function(){
	//var data= ${result};
	console.log(data)
	var dataSet = {
		      nodes: [                   
		      ],		
		      edges: [             
		      ]
		    };
	var listNodes=data.listNodes;
	for(var i=0;i<listNodes.length;i++)
	{			
		var isFixed=(listNodes[i].isFixed==1)?true:true
		dataSet.nodes.push({"type":listNodes[i].eqpType, "name":listNodes[i].nodeName, "id":listNodes[i].nodeID,"x":listNodes[i].locationX, "y":listNodes[i].locationY,"fixed":isFixed})
	}	
	var listEdges=data.listEdges;
	for(var i=0;i<listEdges.length;i++)
	{
		dataSet.edges.push({"source":listEdges[i].startNodeID,"target":listEdges[i].endNodeID});
	}  
	
	var edges = [];
	dataSet.edges.forEach(function(e) { 
	var sourceNode = dataSet.nodes.filter(function(n) { return n.id == e.source; })[0],
	targetNode = dataSet.nodes.filter(function(n) { return n.id == e.target; })[0];
		
	edges.push({source: sourceNode, target: targetNode});
	});
	
	var zoom = d3.behavior.zoom()
	            .scaleExtent([0.5, 5])  
	            .on("zoom",  zoomed); 
				
	var width_image ,height_image ;
	var w = 1200,h = 800;
	var svg = d3.select("#svgContent")
	                  .append("svg")
	                  .attr("width", w)
	                  .attr("height", h)
	                  .attr('preserveAspectRatio', 'xMinYMin slice')
	                  .append('g')
					  .call(zoom);
				  
  /* .call(d3.zoom()
				  .scaleExtent([1, 8])
				  .on("zoom", zoom)); */
    var force = self.force = d3.layout.force()
	  
      .nodes(dataSet.nodes)
      .links(edges)
      .linkStrength(0.1)
      .gravity(0)
      .distance(120)
      .charge(-5000)
      .size([w,h])
      .start();

  
function zoomed() {  
	d3.select(this).attr("transform","translate(" + d3.event.translate + ")"+ 
	"scale(" + d3.event.scale + ")");
	if(zoom.scale()>=1.5){
		window.location.href='topo_2';
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
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", function(d){    
		if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
			width_image=86;
			return width_image;
		}	  
		return 26;
      })
      .attr("height", function(d){    
        if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
			height_image=86;
			return height_image;
		}
		return 26;
      });
	  
 node.append("text")
      .attr("class", "nodetext")
	  .attr("x", function(d){    
		if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
			width_text=-16;
			return width_text;
		}	  
		return -40;
      })
      .attr("y", function(d){    
        if("access"==d.type.substr(0,6)||"djyg_mib"==d.type||"combinatation_702"==d.type||"tdyth"==d.type.substr(0,5)){
			height_text=86;
			return height_text;
		}
		return 36;
      })
	  
      .text(function(d) { return d.name });	  
	  
	
	function dblclick(d) {
		//console.log("zoom.scale============>"+zoom.scale());
	   console.log("dblclick==============="+d.id+":\t"+d.x+"\t"+d.y);
	   window.location.href='topo_2';
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
});