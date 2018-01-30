/** 
	插件名称  :  inputdrop
	插件功能  :  自定义元素的下拉选择项，可支持下拉树以及下拉列表
	参数      :  
				  方法名  renderTree
				  参数      zNodes
				  方法名  renderSelect
				  参数    {
							data : [{text:1}],
							removeClick : function (){}
				  		  }
*/

define(['tree' ,'/tdyth/resources/plugins/validate/validate.js'] ,function (tree ,validate){
	return {
		renderTree:function (el ,zNodes ,opt){
			var id = el.attr("id");
			var height = "150px";SS
			if (!opt)
			{
				opt = new Object();
			}
			opt.height && (height = opt.height);
			if (opt.enableChk == undefined)
			{
				opt.enableChk = true;
			}
			var buffer = [];
			buffer.push('<input type="text" class="form-control input-sm no-write no-event" readonly data-type="input" queryValue>');
			buffer.push('<input type="hidden" data-id="'+id+'" search-data="'+id+'" name="'+id+'"/>');
			buffer.push('<div class="inputdrop-content" data-id="content" style="height:'+height+';overflow-y:auto;overflow-x:hidden"><ul class="ztree" id="'+new Date().getTime()+'"></ul></div>');
			el.append(buffer.join(""));
			
			tree.renderCheck(el.find("[data-id=content]").find("ul").eq(0),
								{
									inpDiv:el.find("input").eq(0),
									inpHiddenDiv:el.find("input").eq(1),
									zNodes:zNodes,
									enableChk:opt.enableChk,
									pId:opt.pId,
									label:opt.label,
									id:opt.id,
									chkboxType: (opt.chkboxType?opt.chkboxType:{ "Y" : "", "N" : "" }),
									aCheckCb:opt.aCheckCb?opt.aCheckCb:function (){},
									noSelectVal : el.attr("no-select"),
									onlyLastChild : opt.onlyLastChild
								}
							);
			var treeObj = el.find("[data-id=content]").find("ul").data("tree");

			this.initEvent(el);

			// 默认展开roota节点
			var rootNode = "roota";
			opt.rootNode && (rootNode = opt.rootNode);
			var nodes = treeObj.getNodesByParam("id",rootNode, null);
			treeObj.expandNode(nodes[0] ,true ,false);

			el.css("border" ,"none");
			el.find("input").eq(0).css("border" ,"1px solid #cfdadd");

			opt && opt.position && (this.setPosition(el.find("[data-id=content]") ,opt));

			// 是否有初始化的值
			opt && opt.initVal && (this.setDataTree(el ,opt.initVal));

			el.attr("required")
					&& el.find("input").eq(0).attr("validate" ,"required");
		},
		setDataTree:function (el,idStr){
			var buffer = [];
			try{
				var buffer = tree.setCheck(el.find("[data-id=content]").find("ul").eq(0) ,idStr);
			}catch(e){
				idStr = "";
			}
			el.find("input[data-type=input]").val(buffer.join(","));
			el.find("input[type=hidden]").val(idStr);
		},
		/** 
			param : height 默认值:150px
					data   [{id:1,text:1}]
					hideRemove   true/false
					allowCheckBox  true/false
					isSingle   true/false
					isNew  true/false
					allowAll true/false
		*/
		renderSelect:function (el ,opt){
			var default_opt = {
				data : [],
				removeClick : function (){},
				hideRemove : true,
				allowCheckBox : true,
				isSingle : false
			}
			var id = el.attr("id");
			var height = "150px";
			opt && opt.height && (height = opt.height);
			var opt = $.extend(default_opt ,opt);
			var data = opt.data;
			var buffer = [];
			var idTextMap = new HashMap();
			var el_chk;

			buffer.push('<input data-t="name_inp" type="text" class="form-control input-sm no-write" readonly data-type="input">');
			buffer.push('<input type="hidden" data-type="id_inp" data-id="'+id+'" search-data="'+id+'" name="'+id+'"/>');
			buffer.push('<div class="inputdrop-content" data-id="content" style="height:'+height+';overflow-y:auto;overflow-x:hidden;padding-left:0;padding-right:0px"><ul class="select-ul tran"></ul></div>');
			el.append(buffer.join(""));

			if (opt.allowAll)
			{
				el.find("ul").append('<li class="prel" style="padding-left:30px"><input class="pabs" style="left:5px;top:2px" type="checkbox" data-type="chk_all"/><span class="dib">全部</span></li>');
				el.find("ul").find("[data-type=chk_all]").click(function (){
					if ($(this).is(":checked"))
					{
						el_chk.prop("checked" ,"checked");
						getAll();
					}
					else
					{
						el_chk.removeAttr("checked");
						el_id_inp.val("");
						el_name_inp.val("");
						if (el.attr("initVal"))
						{
							el_id_inp.val(el.attr("initVal"));
						}
					}
				});	
			}
			
			for (var i=0;i<data.length;i++)
			{
				el.find("ul").append('<li class="prel" style="padding-left:30px"><input class="pabs" style="left:5px;top:2px" type="checkbox" data-type="chk" data-val="'
											+data[i].id+'"/><span class="dib">'
											+data[i].text+'</span><i class="icon-remove r" data-type="remove" data-idVal="'+data[i].id+'"></i></li>');
				idTextMap.put(data[i].id ,data[i].text);
			}
			el.data("map" ,idTextMap);

			el.attr("required")
					&& el.find("input").eq(0).attr("validate" ,"required");
			
			var chkIdList = [];
			var chkNameList = [];
			var el_id_inp = el.find("[data-id="+id+"]");
			var el_name_inp = el.find("[data-t=name_inp]");
			el_chk = el.find("ul").find("[data-type=chk]");
			var el_remove_i = el.find("ul").find("[data-type=remove]");

			el.css("border" ,"none");
			el.find("input").eq(0).css("border" ,"1px solid #cfdadd");
			
			if (el.hasClass("disable"))
			{
				el_name_inp.attr("disabled" ,"disabled");
			}

			el.find("ul").on("click" ,"[data-type=remove]" ,function (){
				var idVal = $(this).attr("data-idVal");
				idTextMap.remove(idVal);
				var keyArray = idTextMap.keys();
				var valueArray = idTextMap.values();
				el.find("[data-type=id_inp]").val(keyArray.join(","));
				el.find("[data-t=name_inp]").val(valueArray.join(","));
				$(this).closest("li").remove();
			});

			if (opt.hideRemove)
			{
				el_remove_i.hide();
			}

			if (!opt.allowCheckBox)
			{
				el.find("[type=checkbox]").hide();
			}

			if (opt.isSingle)
			{
				var keyArray = idTextMap.keys();
				var valueArray = idTextMap.values();
				el.find("[data-type=id_inp]").val(keyArray.join(","));
				el.find("[data-t=name_inp]").val(valueArray.join(","));
			}

			el_chk.click(function (){
				chkIdList = [];
				chkNameList = [];
				el_chk.each(function (){
					if ($(this).is(":checked"))
					{
						chkIdList.push($(this).attr("data-val"));
						chkNameList.push($(this).next().text());
					}
				});
				
				el_id_inp.val(chkIdList.join(","));
				el_name_inp.val(chkNameList.join(","));

				if (el_id_inp.val())
				{
					g_validate.clear([el_name_inp]);
				}
			});

			this.initEvent(el);

			function getAll()
			{
				chkIdList = [];
				chkNameList = [];
				el_chk.each(function (){
					chkIdList.push($(this).attr("data-val"));
					chkNameList.push($(this).next().text());
				});
				
				el_id_inp.val(chkIdList.join(","));
				el_name_inp.val(chkNameList.join(","));
			}
		},
		setDataSelect:function (el ,idStr)
		{
			if (!idStr)
			{
				return false;
			}
			el.find("input[type=checkbox]").removeAttr("checked");
			var el_id_inp = el.find("[data-type=id_inp]");
			var el_name_inp = el.find("[data-t=name_inp]");
			var el_chk = el.find("[data-type=chk]");
			var name_buffer = [];

			var idArray = idStr.split(",");

			for (var i = 0; i < idArray.length; i++) {
				el_chk.each(function (){
					if ($(this).attr("data-val") == idArray[i])
					{
						$(this)[0].checked = true;
						name_buffer.push($(this).next().text());
					}
				});
			}

			el_id_inp.val(idStr);
			el_name_inp.val(name_buffer.join(","));
		},
		addDataSelect:function (el ,opt){
			var idTextMap = el.data("map");
			var data = opt.data;
			for (var i = 0; i < data.length; i++) {
				el.find("ul").append('<li><input style="display:none" type="checkbox" data-type="chk" data-val="'
											+data[i].id+'"/><span class="ml10">'
											+data[i].text+'</span><i class="icon-remove r" data-type="remove" data-idVal="'+data[i].id+'"></i></li>');
				idTextMap.put(data[i].id ,data[i].text);
			}
			var keyArray = idTextMap.keys();
			var valueArray = idTextMap.values();
			el.find("[data-type=id_inp]").val(keyArray.join(","));
			el.find("[data-t=name_inp]").val(valueArray.join(","));
		},
		setEnable:function (el){
			el.removeClass("disable");
			el.find("[data-t=name_inp]").removeAttr("disabled");
			g_validate.clear([el.find("[validate]")]);
		},
		setDisable:function (el){
			el.addClass("disable");
			el.find("[data-t=name_inp]").attr("disabled" ,"disabled");
			g_validate.clear([el.find("[validate]")]);
		},
		clearSelect:function (el){
			el.find("input[type=text]").val("");
			el.find("input[type=hidden]").val("");
			el.find("input[type=checkbox]").removeAttr("checked");
		},
		initSelect:function (el){
			el.data("map" ,new HashMap());
			el.find("input[type=text]").val("");
			el.find("input[type=hidden]").val("");
			el.find("li").remove();
		},
		initEvent:function (el){
			if (!isNaN(el.attr("noEdit")))
			{
				return false;
			}
			var isUsing = false;
			el.find("input[data-type=input]").click(function (e){

				if (isUsing)
				{
					return false;
				}

				isUsing = true;

				$("body").find("div[data-id=content]").hide();
				
				var contentEl = el.find("div[data-id=content]");

				var height = parseInt(contentEl.css("height"));

				contentEl.height(0);

				contentEl.show();

				var child = contentEl.children();

				child.css("opacity" ,0);
				child.css("position" ,"relative");
				child.css("top" ,"20px");

				contentEl.animate({height : height},"fast" ,function (){
					child.animate({top : "0",opacity : 1},"fast" ,function (){
						isUsing = false;
					});
				});

				e.stopPropagation();
			});

    		el.find("div[data-id=content]").click(function(e){

				e.stopPropagation();//阻止冒泡到body
			});

    		$("body").on("click.inputdrop" ,function (){
    			el.find("div[data-id=content]").hide();
    		});
		},
		setPosition:function (inpContentEl ,opt){
			if (opt.position == "top")
			{
				inpContentEl.css("top" ,"-" + opt.height);
				inpContentEl.css("border-top" ,"1px solid #cfdadd");
				inpContentEl.css("border-bottom" ,"0");
			}
		},
		getText : function (el){
			return el.find("input[data-type=input]").val();
		},
		/** 渲染周历 */
		renderFlexoCalendar : function (el,opt){
			require(['/js/plugin/FlexoCalendar/FlexoCalendar.js','css!/js/plugin/FlexoCalendar/FlexoCalendar.css'] ,function (){

					el.attr("readonly",true);
					el.css("cursor","pointer");
					if($("body").find("#weekCalendar").length==0){

						var offset = el.offset();
						var width = el.outerWidth();
						var height = "183px";
						var buffer = [];
						buffer.push('<div id="weekCalendar" class="inputdrop-content" data-id="content" style="height:'+height+'px;width:'+width+'px;overflow-y:auto;overflow-x:hidden;position:absolute;z-index:99999;top:'+(offset.top+20)+'px;left:'+(offset.left)+'px;"><div id="weekDiv"></div></div>');
						$("body").append(buffer.join(""));
					}
					var startDate = $('<input type="text" class="form-control input-sm"  data-id="startDate" style="display:none;">');
					var endDate = $('<input type="text" class="form-control input-sm"  data-id="endDate" style="display:none;">');
					el.after(startDate);
					el.after(endDate);
					var date = new Date();
					var dateStr = g_moment(date).subtract(7,"day").format("YYYY-MM-DD");
					console.log(dateStr);
					$("body").find("#weekCalendar").flexoCalendar({
						type : "weekly",
						today: false,
						selectDate : dateStr,
						onselect : function (daterange,target){
							var week = $(target).find(".week").text();
							var process = $(target).find(".process").text();
							el.val(week + " " + process);
							el.parent().find("[data-id=startDate]").val(daterange.split(",")[0]+" 00:00:00");
							el.parent().find("[data-id=endDate]").val(daterange.split(",")[1]+" 23:59:59");
							$("body").find("#weekCalendar").hide();
						}
					});
					var selectedEl = $("body").find("#weekCalendar").find("td.selected");
					var week = selectedEl.find(".week").text();
					var process = selectedEl.find(".process").text();
					var currentData = selectedEl.data("time");
					el.val(week + " " + process);
					if(currentData){
						el.parent().find("[data-id=startDate]").val(currentData.split(",")[0]+" 00:00:00");
						el.parent().find("[data-id=endDate]").val(currentData.split(",")[1]+" 23:59:59");
					}

					if (!isNaN(el.attr("noEdit")))
					{
						return false;
					}
					el.click(function (e){
						$("body").find("#weekCalendar").hide();

						var offset = el.offset();
						$("body").find("#weekCalendar").css("left",offset.left);
						$("body").find("#weekCalendar").css("top",(offset.top+30));
						var width = el.outerWidth();
						$("body").find("#weekCalendar").css("width",width);

						var contentEl = $("body").find("#weekCalendar");

						var height = parseInt(contentEl.css("height"));

						contentEl.height(0);

						contentEl.show();

						var child = contentEl.children();

						child.css("opacity" ,0);
						child.css("position" ,"relative");
						child.css("left" ,"20px");

						contentEl.animate({height : height},"fast" ,function (){
							child.animate({left : "0",opacity : 1},"fast" ,function (){});
						});

						e.stopPropagation();
					});
					$("body").find("#weekCalendar").click(function(e){
						e.stopPropagation();
					});

					$("body").on("click.inputdrop" ,function (){
						$("body").find("#weekCalendar").hide();
					});
			});
		}
	}
});