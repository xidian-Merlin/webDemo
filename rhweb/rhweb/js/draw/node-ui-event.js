define([
	'/js/plugin/dialog/dialog.js',
    ],function (dialog,nodeFunction){
	
	return{
		/**
		 * 事件处理
		 * @param event
		 * @param node
		 * @returns
		 */
		nodeFunction:null,
		setNodeFunction:function(nodeFunction){
			this.nodeFunction = nodeFunction;
		},
		 dealClickAndDblclick:function(event,node){
			var pObj = this;
			var nodeEntry = pObj.nodeFunction.getNodeEntry();
			//pObj.nodeFunction.closeCanvasDrawShowAttrDiv();
			nodeEntry.drawLineFlag == false;
			nodeEntry.isMouseDown == false;
			
			//将选择框置空
			pObj.nodeFunction.resetDependency();
			var div = $("#"+nodeEntry.canDrawShowAttrLine);
			//设置焦点
			$(div).unbind("focus");
			div.focus(function(){
				
			});
			$(div).unbind("blur");
			div.blur(function(){
				$(this).hide();
			});
			$(div).find("#pidLine").val(node.id);
			$(div).show();

			$(div).find("#deleteLine").unbind("click");
			$(div).find("#deleteLine").click(function(){
				var div = $("#"+nodeEntry.canDrawShowAttrLine);
				
				g_dialog.operateConfirm("删除线段？",{saveclick : function (){
					var no = pObj.nodeFunction.findNodeByScene(nodeEntry.scene,$(div).find("#pidLine").val());
					pObj.nodeFunction.deleteNodeByScene(nodeEntry.scene,no);
					//清除所有编辑值
					pObj.nodeFunction.clearAllData();
					if(checkIsNULL(pObj.nodeFunction.getNodeEntry().closeEl) ==false){
						g_dialog.hide(pObj.nodeFunction.getNodeEntry().closeEl);
						nodeEntry.closeEl = undefined;
					}
					$(div).hide();
				}});
				
//				if(confirm("删除线段？")){
//					var no = pObj.nodeFunction.findNodeByScene(nodeEntry.scene,$(div).find("#pidLine").val());
//					pObj.nodeFunction.deleteNodeByScene(nodeEntry.scene,no);
//					//清除所有编辑值
//					pObj.nodeFunction.clearAllData();
//					if(checkIsNULL(pObj.nodeFunction.getNodeEntry().closeEl) ==false){
//						g_dialog.hide(pObj.nodeFunction.getNodeEntry().closeEl);
//						nodeEntry.closeEl = undefined;
//					}
//				}
				
			});
			if(node.type == "dependence"){
				$(div).find("#pLine_dependence").show();
				$(div).find("#pLine_line_arrow_layer").show();
				
			}
			else{
				$(div).find("#pLine_dependence").hide();
				$(div).find("#pLine_line_arrow_layer").show();
			}
			//填充相关属性
			pObj.nodeFunction.fillLineAttr(node);
		},
		//线条处理函数
		linkDbClick:function(link)
		{
			var pObj = this;
        	if(link.type == "line" || link.type == "layer" || link.type == "arrow")
        	{
        		link.mousedown(function(event){
	        		if(3 == event.which)
	        		{
	        			var div = document.getElementById(pObj.nodeFunction.getNodeEntry().canDrawId);
	        			this.dotype = "move";
	        			$(div).attr("doMoveId",this.id);
	        			$(div).attr("doMoveX",event.clientX);
	        			$(div).attr("doMoveY",event.clientY);
	                }

        		});
        	}
        	link.mouseup(function(event){
        		//自定义了线段事件
	        	if(link.type == "line" || link.type == "layer" || link.type == "arrow"){
	        		this.dotype = undefined;
        			var div = document.getElementById(pObj.nodeFunction.getNodeEntry().canDrawId);
        			$(div).removeAttr("doMoveId");
        			$(div).removeAttr("doMoveX");
        			$(div).removeAttr("doMoveY");
	        	}
        		var customToolEvent = pObj.nodeFunction.nodeFactory.getCustomComEventByType(this.type);
				if(customToolEvent != null)
				{
					if(customToolEvent.line != null && customToolEvent.line.mouseup != null)
					{
						customToolEvent.line.mouseup({
							nodeFactory:pObj.nodeFunction.nodeFactory,
							event:event||window.event,
							node:this
						});
						return;
					}
				}
        	});
        	link.click(function(){
        		//自定义了线段事件
        		var customToolEvent = pObj.nodeFunction.nodeFactory.getCustomComEventByType(this.type);
				if(customToolEvent != null)
				{
					if(customToolEvent.line != null && customToolEvent.line.click != null)
					{
						customToolEvent.line.click({
							nodeFactory:pObj.nodeFunction.nodeFactory,
							event:event||window.event,
							node:this
						});
						return;
					}
				}
				pObj.nodeFunction.getNodeEntry().drawLineFlag == false;
				pObj.nodeFunction.getNodeEntry().isMouseDown == false;
        	});
		    link.dbclick(function(event){ 
        		//自定义了线段事件
		    	var customToolEvent = pObj.nodeFunction.nodeFactory.getCustomComEventByType(this.type);
				if(customToolEvent != null)
				{
					if(customToolEvent.line != null && customToolEvent.line.dbclick != null)
					{
						customToolEvent.line.dbclick({
							nodeFactory:pObj.nodeFunction.nodeFactory,
							event:event||window.event,
							node:this
						});
						return;
					}
				}
				pObj.dealClickAndDblclick(event,this);
		    });
        },
		addEventForNode:function(node)
		{
			var pObj = this;
			//如果自己定义了节点处理函数
			var customToolEvent = pObj.nodeFunction.nodeFactory.getCustomComEventByType(node.type,node);

			if(pObj.nodeFunction.getNodeEntry().isEditer==false){
				// node.dragable = false;
				if(customToolEvent != null && customToolEvent.node.click != null)
				{
					if(customToolEvent.node != null)
					{
						customToolEvent.node.click({
							nodeFactory:pObj.nodeFunction.nodeFactory,
							event:event||window.event,
							node:this
						});
					}
				}
				else
				{
					node.click(function(event){
						//初始化一条数据
						try{
							pObj.nodeFunction.nodeClickEventFunction(this);
						}catch(e){
							alert(e);
						}
					});
				}

			}
			else if(pObj.nodeFunction.getNodeEntry().isEditer==true)
			node.mouseup(function(event)
			{

				//修改成右键
				if(3 != event.which){
					//关闭提示框
					pObj.nodeFunction.closeCanvasDrawShowAttrDiv();
					return;
				}

				if(pObj.nodeFunction.getNodeEntry().scene.mode == "select"){
					g_dialog.operateConfirm("设置为一组？",{saveclick : function (){
						pObj.nodeFunction.nodeFactory._group.appendNodeToContainer(pObj.nodeFunction.getNodeEntry().scene);
					}});
					return;
				}
				//如果自定义了节点处理函数
				if(customToolEvent != null)
				{
					if(customToolEvent.node != null && customToolEvent.node.mouseup != null)
					{
						customToolEvent.node.mouseup({
							nodeFactory:pObj.nodeFunction.nodeFactory,
							event:event||window.event,
							node:this
						});
						return;
					}
				}
				//如果是直线，虚线，箭头，可以在画图区画图
				if(		this.type == "line" || 
						this.type == "layer" || 
						this.type == "arrow" ){
					
					//直线
					if(this.type == "line"){
						pObj.nodeFunction.getNodeEntry().LineType = "line";
					}
					//虚线
					else if(this.type == "layer"){
						pObj.nodeFunction.getNodeEntry().LineType = "layer";
					}
					//箭头
					else if(this.type == "arrow"){
						pObj.nodeFunction.getNodeEntry().LineType = "arrow";
					}
					pObj.nodeFunction.getNodeEntry().drawLineFlag = true;
					return;
				}
				//如果是复制品
				else if(this.cannClone == true)
				{
					pObj.dealNodeEvent(this);
//					var div = document.getElementById(pObj.nodeFunction.getNodeEntry().canDrawShowAttr);
//					$(div).show();
//					var input = $(div).find("#pname");
//					$(input).val(""+this.name);
//					$(div).find("#ptype").text(this.type);
//					$(input).attr("domainid",this.domainId);
//					$(input).attr("nodeid",this.id);
//					$(input).unbind("change");
//					$(input).change(function(){
//						var no = pObj.nodeFunction.findNodeByScene(pObj.nodeFunction.getNodeEntry().scene,$(this).attr("nodeid"));
//						no.text = $(this).val();
//						no.name = $(this).val();
//						
//					});
//					$(div).find("#pid").text(this.id);
//					//读取挂载点
//					pObj.nodeFunction.setDependency();
//					//读取可挂载的监控器点
//					if(this.monitor== undefined || this.monitor.entry == undefined || this.monitor.entry == null)
//						pObj.nodeFunction.getMonitorsByType(this.type);
//					else
//					{
//						pObj.nodeFunction.fillMonitorData(this.monitor.entry);
//					}
//					//关闭编辑线条框
//					pObj.nodeFunction.closeCanvasDrawShowAttrLineDiv();
				}
				pObj.nodeFunction.getNodeEntry().drawLineFlag = false;//是否是点击直线后
				pObj.nodeFunction.getNodeEntry().isMouseDown = false;
		    	return false;
		    });  
			
			//双击事件
			node.dbclick(function(event){
					//如果是编辑模式下
					if(pObj.nodeFunction.getNodeEntry().isEditer==true){
						//编辑模式下子定义的双击处理事件
						if(customToolEvent != null)
						{
							
							if(customToolEvent.node != null && customToolEvent.node.dbclick != null)
							{
								customToolEvent.node.dbclick({
									nodeFactory:pObj.nodeFunction.nodeFactory,
									event:event||window.event,
									node:this
								});
								return;
							}
						}
						pObj.nodeFunction.dleteAllSelectMounts(this);
//						var ids = [];
//						var tipname = [];
//						var pnode = this;
//						var nodes = pObj.nodeFunction.getScene().selectedElements;
//						for(var i=0;nodes!=null&&i<nodes.length;i++){
//							//屏蔽自己,以及各种线条和文字
//							if(nodes[i].id != this.id && 
//									nodes[i].type != "dependence" && 
//									nodes[i].type.indexOf("arrow") == -1 && 
//									nodes[i].type.indexOf("layer") == -1 && 
//									nodes[i].type.indexOf("line") == -1 && 
//									nodes[i].type.indexOf("text") == -1 &&
//									nodes[i].type.indexOf("node") == -1 ){
//								ids[ids.length] = nodes[i].id;
//								tipname[tipname.length] = nodes[i].text;
//							}
//						}
//						if(ids.length>0)
//						{
//							var tip = "";
//							var delmodel = "";
//							if(establishRelationshipModel_isDelete()){
//								delmodel = "delete";
//								tip = "请再次确认是否将 ["+tipname.join("，")+"] 从 [ "+this.text+"] 上解除关联关系";
//							}
//							else{
//								tip = "请再次确认是否将 ["+tipname.join("，")+"] 关联到 ["+this.text+"] 上？";
//							}
//							g_dialog.operateConfirm(tip,{saveclick : function (){
//								pObj.nodeFunction.mountPoint(delmodel,ids,pnode);
//								//如果有提示框开启的必须关闭,防止数据不同步的误操作
//								pObj.nodeFunction.closeCanvasDrawShowAttrDiv();
//							}});
//						}
//						else{
//							g_dialog.operateAlert(null,"此模式下需选择其他节点才能进行关联！");
//						}
						return;
					}
					//如果自定义了节点处理事件
					if(customToolEvent != null)
					{
						if(customToolEvent.node != null && customToolEvent.node.dbclick != null)
						{
							customToolEvent.node.dbclick({
								nodeFactory:pObj.nodeFunction.nodeFactory,
								event:event||window.event,
								node:this
							});
							return;
						}
					}
					//正常处理
					pObj.nodeFunction.nodeDBClickEventFunction(this);
				});
			//鼠标移进
			node.mouseover(function(event){
				if(pObj.nodeFunction.getNodeEntry().isEditer==false 
						 && customToolEvent.node.mouseover != null 
						 && customToolEvent.node.mouseover != undefined)
				{
					customToolEvent.node.mouseover({
						nodeFactory:pObj.nodeFunction.nodeFactory,
						event:event||window.event,
						node:this
					});
					return;
				}
			});
			//鼠标移出
			node.mouseout(function(event){
				if(pObj.nodeFunction.getNodeEntry().isEditer==false
						&& customToolEvent.node.mouseout != null 
						&& customToolEvent.node.mouseout != undefined)
				{
					customToolEvent.node.mouseout({
						nodeFactory:pObj.nodeFunction.nodeFactory,
						event:event||window.event,
						node:this
					});
					return;
				}
			});
		},
		dealNodeEvent:function(node){
			var pObj = this;
			var div = document.getElementById(pObj.nodeFunction.getNodeEntry().canDrawShowAttr);
			$(div).show();
			var input = $(div).find("#pname");
			$(input).val(""+node.name);
			$(div).find("#ptype").text(node.type);
			$(input).attr("domainid",node.domainId);
			$(input).attr("nodeid",node.id);
			$(input).unbind("change");
			$(input).change(function(){
				var no = pObj.nodeFunction.findNodeByScene(pObj.nodeFunction.getNodeEntry().scene,$(this).attr("nodeid"));
				no.text = $(this).val();
				no.name = $(this).val();
				
			});
			$(div).find("#pid").text(node.id);
			//读取挂载点
			pObj.nodeFunction.setDependency();
			//读取可挂载的监控器点
			if(this.monitor== undefined || node.monitor.entry == undefined || node.monitor.entry == null)
				pObj.nodeFunction.getMonitorsByType(node.type,node.id);
			else
			{
				pObj.nodeFunction.fillMonitorData(node.monitor.entry);
			}
			//关闭编辑线条框
			//pObj.nodeFunction.closeCanvasDrawShowAttrLineDiv();
		}
	}
})