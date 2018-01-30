define([	'/js/plugin/dialog/dialog.js',
        	'/js/plugin/topo/jtopo-0.4.8-dev.js',
        	//'/js/plugin/topo/editor.js',
        	//'/js/plugin/topo/network.js',
        	'/js/plugin/topo/topologyProperties.js'],function (dialog,jtopo,topologyProperties){
	
    return{
    		containers:null,
    		eventList:new Array(),
    		timerObjs:new Array(),
    		customGroupEvent:null,
    		openAlarmTimerObj:{
    			timer:null,
    			time:1000,
    			flashTim:150,
    		},
    		mountEvent:function(containers){
    			if(this.groupId == null)
    				return;
//    			var  pObj = this;
//    			for(var i=0;i<containers.length;i++){
//    				var nods = containers[i].childs;
//    				for(var j=0;j<nods.length;j++){
//    					nods[j].addEventListener('mousedown', function(event){
//    						this.cid = pObj.findCid(this.id);
////    						console.log("--------- mousedown "+this.cid);
//    		            });
//    					nods[j].addEventListener('mouseup', function(event){
//    				    	if(this.cid != undefined && this.cid != ""){
//    				    		pObj.updateLocation(this.cid);
//    				    		this.cid = undefined;
//    				    	}
//    						this.cid = undefined;
////    						console.log("--------- mouseup "+this.cid);
//    		            });
//    					nods[j].addEventListener('mousemove', function(event){
//    						console.log("--------- mousemove "+this.cid);
//    				    	if(this.cid != undefined && this.cid != ""){
//    				    		pObj.updateLocation(this.cid);
//    				    		this.cid = undefined;
//    				    	}
//    		            });
//    					nods[j].mousedown(function(){
////    						//
////    		        		if(3 == event.which)
////    		        		{
////    		        			return;
////    		                }
//    				    	this.cid = pObj.findCid(this.id);
//    				    });
//    					nods[j].mouseup(function(){
//    				    	if(this.cid != undefined && this.cid != ""){
//    				    		pObj.updateLocation(this.cid);
//    				    		this.cid = undefined;
//    				    	}
//    				    });
//    					nods[j].mousemove(function(){
//    				    	if(this.cid != undefined && this.cid != ""){
//    				    		pObj.updateLocation(this.cid);
//    				    		this.cid = undefined;
//    				    	}
//    				    });
//    				}
//    			}
    		},
    		findCid:function(id){
    			for(var i=0;i<this.containers.length;i++){
    				var nods = this.containers[i].childs;
    				for(var j=0;j<nods.length;j++){
    					if(nods[j].id == id)
    						return this.containers[i].id;
    				}
    			}
    			return "";
    		},
    		updateLocation:function(id){
    			var index = 0;
    			for(;index<this.containers.length;index++){
    				if(this.containers[index].id == id)
    					break;
    			}
    			var nods = this.containers[index].childs;
    			var box  = this.getSquareBox(nods);
    			//更新组边界
    			var width = Math.abs(box.endX - box.startX);
    			var height = Math.abs(box.endY - box.startY);
    			this.containers[index].setLocation(box.startX-box.width/2,box.startY-box.height/2);
    			this.containers[index].setSize(width+box.width,height+box.height);
    		},
    		customAlarmBack:function(option){
    			customAlarmBackAttr = option;
    		},
    		//redLevel红色等级
    		openAlarm:function(redLevel){
    			if(this.containers != null)
    			{
	    			for(var i=0;i<this.containers.length;i++){
	    				var nods = this.containers[i].childs;
	    				//查找是否有红色等级事件
	    				var isRedLevel = false;
	    				for(var j=0;j<nods.length;j++){
	    					if(nods[j].myTopoStyle == true && nods[j].healthlevel == redLevel){
	    						isRedLevel = true;
	    						break;
	    					}
	    				}
	    				var timerObj = null;
						for(var j=0;j<this.timerObjs.length;j++){
							if(this.timerObjs[j].id == this.containers[i].id){
								timerObj = this.timerObjs[j];
								break;
							}
						}
						if(timerObj == null && isRedLevel == true)
						{
							var index = this.timerObjs.length;
							this.timerObjs[index] = new Object();
							this.timerObjs[index].fillColor = this.containers[i].fillColor;
							this.timerObjs[index].alpha = this.containers[i].alpha;
							this.timerObjs[index].index = i;
						}
						else if(isRedLevel == false && timerObj != null){
							//
							for(var j=0;j<this.timerObjs.length;j++){
								if(this.timerObjs[j].container.id == timerObj.id){
									var index = this.timerObjs[j].index;
									this.containers[index].fillColor = this.timerObjs[i].fillColor;
									this.containers[index].alpha = this.timerObjs[i].alpha;
									this.timerObjs.remove(j);
									break;
								}
							}
						}
						else if(isRedLevel == true && timerObj != null){
							
						}
						
	    			}
    			}
    			this.flashing();
			},
			closeAlarm:function(){
				if(this.containers == null)
					return;
				if(this.openAlarmTimerObj.timer != undefined && this.openAlarmTimerObj.timer != null){
					clearTimeout(this.openAlarmTimerObj.timer);
					this.openAlarmTimerObj.timer = null;
				}
				//关闭所有告警闪烁还原相关状态
				for(var i=0;i<this.timerObjs.length;i++){
					var index = this.timerObjs[i].index;
					this.containers[index].fillColor = this.timerObjs[i].fillColor;
					this.containers[index].alpha = this.timerObjs[i].alpha;
					this.timerObjs.remove(j);
				}
			},
			flashing:function(){
				var pObj = this;
				for(var i=0;i<this.timerObjs.length;i++)
				{
					var timerObj = this.timerObjs[i];
					if(timerObj!=undefined)
					{
						//改变状态
						if(this.containers[timerObj.index].fillColor != "234,91,91"){
							this.containers[timerObj.index].fillColor = "234,91,91";
							this.containers[timerObj.index].alpha = 0.1;
						}
							
						
						this.containers[timerObj.index].alpha = this.containers[timerObj.index].alpha+0.1;
						if(this.containers[timerObj.index].alpha > 1)
							this.containers[timerObj.index].alpha = 0.1;
						
						
					}
				}
				this.openAlarmTimerObj.timer = setTimeout(function(){ pObj.flashing();}, this.openAlarmTimerObj.flashTim);

			},
			checkInGroup:function(nodes){
				if(this.containers == null || this.containers == undefined)
					return false;
				for(var i=0;i<this.containers.length;i++){
					var nods = this.containers[i].childs;
					for(var j=0;j<nodes.length;j++){
						for(var k=0;k<nods.length;k++){
							if(nodes[j].id == nods[k].id)
								return true;
						}
					}
				}
				return false;
			},
    		appendNodeToContainer:function(scene){
    			var nodes = scene.selectedElements;
    			//先检查是否已经有元素属于其他分组
    			if(this.checkInGroup(nodes) == true){
    				g_dialog.operateAlert($("#flashContent"), "选中元素有一个或多个属于其他组", "error");
    				return;
    			}
    			try{
                    var nodesArray = [];
                    for(var i=0;i<nodes.length;i++){
                        if(     nodes[i].type== "dependence" || 
                                nodes[i].type== "arrow" || 
                                nodes[i].type== "layer" ||
                                nodes[i].type== "line")
                            continue;
                        nodesArray.push(nodes[i]);
                    }
    				if(nodesArray.length > 0)
    				{
    					// 不指定布局的时候，容器的布局为自动(容器边界随元素变化）
    					var box = this.getSquareBox(nodesArray);
                        console.log(box);
                        console.log(nodesArray);
    					var container = this.createObj(scene,box);
    					for(var i=0;i<nodesArray.length;i++){
							container.add(nodesArray[i]);
							nodesArray[i].containerId = container.id;
    					}
    				}
    				if(this.containers!=null)
    					this.containers == null;
    				this.containers = this.findAllContainerScene(scene);
    				this.mountEvent(this.containers);
    			}catch(e){
    				alert(e);
    			}
    		},
    		//自动将有分组的节点分组归类
    		appendAllNodeToContainer:function(scene,containerObjs){
    			try
    			{
    				for(var i=0;i<containerObjs.length;i++)
    				{
    					var cids = containerObjs[i].cids.split(",");
    					
    					if(cids!=null && cids !=undefined)
    					{
	    					var nodes = new Array();
	    					for(var j=0;j<cids.length;j++)
	    					{
	    						
								if(cids[j]=="")
									continue;
								
								var node = this.findNodeByScene(scene,cids[j]);
		                        if(     node.type== "dependence" || 
		                        		node.type== "arrow" || 
		                        		node.type== "layer" ||
		                        		node.type== "line")
		                            continue;
								if(node != undefined && node != null)
								{
									//挂载事件函数
									nodes[nodes.length] = node;
								}
	    					}
	    					
	    					var box = this.getSquareBox(nodes);
	    					//customAlarmBackAttr
    						var container = this.createObj(scene,box,containerObjs[i]);
    						for(var j=0;j<nodes.length;j++)
    						{
    							try
    							{
    	    						if(this.groupId == null)
    	    							nodes[j].dragable = false;
    								container.add(nodes[j]);
    								nodes[i].containerId = container.id;
    							}catch(e)
    							{
    								
    							}
    							
    						}
    					}
    				}
    				if(this.containers!=null)
    					this.containers == null;
    				this.containers = this.findAllContainerScene(scene);
    				this.mountEvent(this.containers);
    			}catch(e){
    			}
    		},
	 		removeGroup:function(_scene,id){
	 			var pObj = this;
				g_dialog.operateConfirm("删除分组？",{saveclick : function (){
					
					var gId = (id!=undefined?id:$("#"+pObj.groupId).find("input[id='groupId']").val());
					if(checkIsNULL(gId) == true){
						gId = pObj.id;
					}
					pObj.popObjById(_scene,gId);
					if(checkIsNULL(pObj.closeEl) ==false){
						g_dialog.hide(pObj.closeEl);
						pObj.closeEl = undefined;
					}
				}});
	 		},
	 		removeNodeFromGroup:function(container,nodes){
	 			if(checkIsNULL(nodes) == false)
	 			for(var i=0;i<nodes.length;i++){
	 				container.remove(nodes[0]);
	 			}
	 		},
	 		addNodeForGroup:function(container,nodes){
	 			var nods = container.childs;
	 			if(checkIsNULL(nods) == false){
	 				for(var i=0;i<nodes.length;i++){
	 					for(var j =0;j<nods.length;j++){
	 						if(nods[j].id == nodes[i].id){
	 							nodes.remove(i);
	 							i--;
	 							break;
	 						}
	 					}
	 					
	 				}
	 			}
 				for(var i=0;i<nodes.length;i++){
 					container.add(nodes[i]);
 				}
	 		},
	   		 findNodeByScene:function(_scene,nodeId){
//	   			var nodes  = _scene.getDisplayedElements();
	 			try
	 			{
//	 				for(var i=0;i<nodes.length;i++){
////	 					console.log(nodes[i].id + "  ===  "+nodeId);
//	 					if(nodes[i].id == nodeId && 
//	 							nodes[i].type.indexOf("line") == -1 && 
//	 							nodes[i].type.indexOf("arrow") == -1 &&
//	 							nodes[i].type.indexOf("layer") == -1)
//	 						return nodes[i];
//	 				}
	 				
	 				return _scene.findElements(function(e){ 
	 					return e.id == nodeId; 
	 				})[0];
	 			}catch(e){
	 			}
	 			return null;
	 		},
	 		checkNodesInContainer:function(nodes){
	 			var containers = this.findAllContainerScene(_scene);
	 			var length = 0;
	 			for(var i=0;i<containers.length;i++){
	 				var nods = containers[i].childs;
	 				for(var k = 0;k<nods.length;k++){
		 				for(var j=0;j<nodes.length;j++){
		 					if(nodes[j].id==nods[k].id){
		 						nodes.remove(j);
		 						j--;
		 						length++;
		 					}
		 				}
	 				}
	 			}
	 			if(length != nodes.length)
	 				return false;
	 			return true;
	 		},
	 		findContainerChilds:function(container){
	 			return container.childs;
	 		},
	 		findOutContainerNode:function(_scene){
	 			var nodes  = _scene.getAllNodes();
	 			var containers = this.findAllContainerScene(_scene);
	 			for(var i=0;i<containers.length;i++){
	 				var nods = containers[i].childs;
	 				for(var k = 0;k<nods.length;k++){
		 				for(var j=0;j<nodes.length;j++){
		 					if(nodes[j].type== "dependence" || 
		 							nodes[j].type== "arrow" || 
		 							nodes[j].type== "layer" ||
		 							nodes[j].type== "line" ||
		 							nodes[j].type== "container" ){
		 						nodes.remove(j);
		 						j--;
		 					}
		 					else if(nodes[j].type=="text" && 
		 							(checkIsNULL(nodes[j].name) || 
		 							checkIsNULL(nodes[j].text))){
		 						nodes[j].tipText = "空文字节点";
		 					}
		 					else if(nodes[j].id==nods[k].id){
		 						nodes.remove(j);
		 						j--;
		 					}
		 					else if((nodes[j].type.indexOf("arrow")!=-1  || 
		 							nodes[j].type.indexOf("layer")!=-1  ||
		 							nodes[j].type.indexOf("line")!=-1)  && checkIsNULL(nodes[j].name)==true){
		 						
		 						nodes[j].tipText = "线段端点";
		 					}
		 				}
	 				}
	 			}
	 			return nodes;
	 		},
	   		findContainerSceneById:function(_scene,cid){
	 			try
	 			{
	 				var nodes =  _scene.findElements(function (a){
	 					return a.type == "container" && a.id == cid;
	 				});
	 				return nodes;
	 			}catch(e){
	 			}
	 			return null;
	 		},
	   		findAllContainerScene:function(_scene){
		 			try
		 			{
		 				var nodes =  _scene.findElements(function (a){
		 					return a.type == "container";
		 				});
		 				return nodes;
		 			}catch(e){
		 			}
		 			return null;
		 		},
		 		
		 	deleteNodeFromContainer:function(_scene,nodeID){
		 		var node = this.findNodeByScene(_scene,nodeID);
		 		if(node!=undefined){
		 			var cons = this.findNodeByScene(_scene,node.containerId);
		 			if(cons!=undefined){
		 				cons.remove(node);
		 			}
		 		}
		 	},

    		getInContainerNodes:function(scene){
    			var allContainer = new Array();
    			var nodes  = scene.getAllNodes();
    			for(var i=0;i<nodes.length;i++){
    				if(nodes[i].attributes.inContainer != undefined){
    					var j = 0;
    					for(;j<allContainer.length;j++){
    						if(allContainer[j].id==nodes[i].attributes.inContainer){
    							break;
    						}
    					}
    					if(allContainer[j] == undefined)
    						allContainer[j] = new Object();
    					if(allContainer[j].nodes == undefined)
    						allContainer[j].nodes = new Array();
    					
    					allContainer[j].id = nodes[i].attributes.inContainer;
    					allContainer[j].nodes.insert(allContainer[j].nodes.length, nodes[i]);
    				}
    			}
    			return allContainer;
    		},
    		getSquareBox:function(nodes){
                var  box = {padding : 20};
                JTopo.layout.AutoBoundLayout(box,nodes);
                return box;
    			// var left = 0;
    			// var right = 0;
    			// var up = 0;
    			// var down = 0;
    			
    			// var width = 0;
    			// var height = 0;
    			
    			// for(var i=0;i<nodes.length;i++)
    			// {
       //  			var lefttemp = Number(nodes[i].x);
       //  			var righttemp = Number(nodes[i].x)+Number(nodes[i].width);
       //  			var uptemp = Number(nodes[i].y);
       //  			var downtemp = Number(nodes[i].y)+Number(nodes[i].height);
    			// 	if(width == 0 || width < Number(nodes[i].width)){
    			// 		width = Number(nodes[i].width);
    			// 	}
    			// 	if(height == 0 || height < Number(nodes[i].height)){
    			// 		height = Number(nodes[i].height);
    			// 	}
    			// 	//最小的X
    			// 	if(left == 0 || left > lefttemp){
    			// 		left = lefttemp;
    			// 	}
    			// 	//最大的X
    			// 	if(right == 0 || right < righttemp){
    			// 		right = righttemp;
    			// 	}
    			// 	//最小的Y
    			// 	if(up == 0 || up > uptemp){
    			// 		up = uptemp;
    			// 	}
    			// 	//最大的Y
    			// 	if(down == 0 || down < downtemp){
    			// 		down = downtemp;
    			// 	}
    			// }
    			// return {
    			// 	startX:left-10,
    			// 	startY:up-10,
    			// 	endX:right+width+20,
    			// 	endY:down+height+20,
    			// 	width:width,
    			// 	height:height
    			// 	};
    		},
    		createObj:function(scene,box,temp){
    			var pObj = this;
    			var container = new JTopo.Container((temp!=undefined&&temp!=null?temp.text:""));
    			if(temp!=undefined && temp!=null){
    				temp.cids = undefined;
    				
        			container.fillColor = temp.fillColor;
        			container.borderRadius = Number(temp.borderRadius);
//        			container.alpha = parseFloat(temp.alpha);
        			container.textPosition = temp.textPosition;
        			if(checkIsNULL(temp.fontSize) == false)
        				container.font = temp.fontSize+"px Consolas";
        			if(checkIsNULL(temp.fontColor) == false)
        				container.fontColor = temp.fontColor;
    			}
    			else{

        			
        			container.fillColor = '100,255,0';
        			container.borderRadius = 15;
        			
        			container.textPosition = "Middle_Center";
    			}
    			container.alpha = 0.2;
    			if(checkIsNULL(temp) == false && checkIsNULL(temp.alpha) == false ){
    				container.alpha = parseFloat(temp.alpha);
    			}
    			container.id = Math.random()*1000000+"";
    			container.id = container.id.replace(".","");
    			container.type = "container";
    			container.groupId = this.groupId;
    			var width = Math.abs(box.endX - box.startX);
    			var height = Math.abs(box.endY - box.startY);
//    			container.layout = null;
    			container.dragable = true;
                container.padding = box.padding;
    			container.setLocation(box.x,box.y);
    			container.setSize(box.width,box.height);
    			scene.add(container);
    			//编辑模式下
    			if(this.groupId!=null){
    				container.mouseup(function(event){
						//如果不是右键
						if(3 != event.which){
							//关闭提示框
							return;
						}
						if(pObj.customGroupEvent != null){
							pObj.customGroupEvent({
								event:event||window.event,
								node:this
							});
							return ;
						}
						pObj.fillAttrs(this);
//						$("#"+this.groupId).css("display","block");
//						//初始化数据
//						var color = this.fillColor;
//						var fontcolor = this.fontColor;
//						var fontsize = this.font.split("px ")[0];
//						var text  = this.text;
//						var alpha = this.alpha;
//						var textPosition = this.textPosition;
//						if(textPosition == undefined){
//							textPosition = "Middle_Center";
//						}
////						console.log(this.id);
//						$("#"+this.groupId).find("input[id='groupId']").val(this.id);
//						//设置初始颜色
//						setColor(color,"isGroup");
//						//设置文字初始颜色
//						setColor(fontcolor,"isFont");
//						//设置文字大小
//						setFontSize(fontsize);
//						//sheZara透明度
//						setSlider(alpha,"isGroup");
//						//设置初始文本
//						$("#"+this.groupId).find("input[name='groupname']").val(text);
//						//设置初始文本模式
//						$("#"+this.groupId).find(":radio[name='textPosition'][value='" + textPosition + "']").prop("checked", "checked");
	    			});
    			}
    			container.box = box;
    			return container;
    		},
    		fillAttrs:function(node){
				$("#"+node.groupId).css("display","block");
				//初始化数据
				var color = node.fillColor;
				var fontcolor = node.fontColor;
				var fontsize = node.font.split("px ")[0];
				var text  = node.text;
				var alpha = node.alpha;
				var textPosition = node.textPosition;
				if(textPosition == undefined){
					textPosition = "Middle_Center";
				}
//				console.log(this.id);
				$("#"+node.groupId).find("input[id='groupId']").val(node.id);
				//设置初始颜色
				setColor(color,"isGroup");
				//设置文字初始颜色
				//setColor(fontcolor,"isFont");
				//设置文字大小
				setFontSize(fontsize);
				//sheZara透明度
				setSlider(alpha,"isGroup");
				//设置初始文本
				$("#"+node.groupId).find("input[name='groupname']").val(text);
				//设置初始文本模式
				$("#"+node.groupId).find(":radio[name='textPosition'][value='" + textPosition + "']").prop("checked", "checked");
    		},
    		popObjById:function(scene,id){
    			var node = this.findNodeByScene(scene,id);
//    			console.log("删除ID "+id);
    			scene.remove(node);
    			this.containers = this.findAllContainerScene(scene);
    			$("#"+this.groupId).css("display","none");
    		},
    		modifyGroupStlye:function(){
    			
    			var gId = $("#"+this.groupId).find("input[id='groupId']").val();
    			var color = $("#"+this.groupId).find("input[name='color']").val();
    			var fontsize = $("#"+this.groupId).find("select[name='fontsize']").val();
    			var fontcolor = $("#"+this.groupId).find("input[name='fontcolor']").val();
    			var alpha = $("#"+this.groupId).find("input[name='slider']").val();
    			if(parseFloat(alpha)<0.01)
    				alpha = 0.01;
    			var text = $("#"+this.groupId).find("input[name='groupname']").val();
    			var textPosition = $("#"+this.groupId).find('input:radio[name="textPosition"]:checked').val();
    			for(var i=0;i<this.containers.length;i++){
    				
    				if(this.containers[i].id == gId){
    					this.containers[i].fillColor = color;
    					this.containers[i].text = text;
    					this.containers[i].alpha = alpha;
    					this.containers[i].font = fontsize+"px Consolas";
    					this.containers[i].fontSize = fontsize;
    					this.containers[i].fontColor = fontcolor;
    					this.containers[i].textPosition = textPosition;
    					break;
    				}
    			}
    			$("#"+this.groupId).css("display","none");
    		},
    		groupId:null,
    		initOperatingBoxForGroup:function(groupId){
    			this.groupId = groupId;
    			$("#"+groupId).draggable();
    		},
    		closeModifyGroupStlyeDiv:function(){
    			$("#"+this.groupId).css("display","none");
    		},
    		toXml:function(scene){
    			var containerXML = "";
				var containers = this.findAllContainerScene(scene);
    			for(var i=0;i<containers.length;i++){
    				//所有分组内的子节点
    				try{
        				var nods = containers[i].childs;
        				var cids = "";
        				for(var j=0;j<nods.length;j++){
        					cids = cids+nods[j].id+",";
        				}
            			containerXML = containerXML+ "<container "+
    					" fillColor=\""+containers[i].fillColor+"\""+
    					" borderRadius=\""+containers[i].borderRadius+"\""+
    					" alpha=\""+containers[i].alpha+"\""+
    					" fontSize=\""+(checkIsNULL(containers[i].fontSize)==false?containers[i].fontSize:"")+"\""+
    					" fontColor=\""+(checkIsNULL(containers[i].fontColor)==false?containers[i].fontColor:"")+"\""+
    					" dragable=\""+containers[i].dragable+"\""+
    					" text=\""+containers[i].text+"\""+
    					" textPosition=\""+(containers[i].textPosition==undefined?"Middle_Center":containers[i].textPosition)+"\""+
    					" cids=\""+cids+"\"/>";
    				}catch(e){
    					alert(e);
    				}

    			}
    			return containerXML;
    		}
    	};
});
