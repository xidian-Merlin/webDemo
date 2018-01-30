/**
 
 */
define([""] ,function(){
	
	return{
		initDIV:function(el,data){
			function isNULL(v){
				if(v == "null" || v == null || v == undefined || v == "undefined" || v == "")
					return true;
				return false;
			}
			$.each(data,function(index,obj)
			{
				if(obj instanceof Array )
				{
					initDIV(el,obj);
				}
				else if(!isNULL(obj))
				{
					try
					{
						var tag = el.find("[name='"+index+"']");
						var tagname = tag[0].tagName.toUpperCase();
						if(tagname == "INPUT")
						{
							tag.val(obj);
						}
						else if(tagname == "SELECT")
						{
							var ops = tag.find("option");
							for(var i=0;i<ops.length;i++)
							{
								if($(ops[i]).val() == obj || $(ops[i]).text())
								{
									ops[i].selected = true;
								}
								else
									ops[i].selected = false;
							}
						}
						else if(tagname == "DIV")
						{
							tag.html(obj);
						}
						else
						{
							tag.text(obj);
						}
						//回填一个data-id属性
						tag.attr("data-id",index);
					}catch(e){
						
					}
					
				}
				
			});
			
			//只检查子节点
			var checks1 = el.find(".radio-div-one").children();
			var checks2 = el.find(".radio-div-group");
			var tv1 = 0;
			var tv2 = 0;
			
			for(var i=0;i<checks1.length;i++)
			{
				var v = getvalue($(checks1[i]));
				if(!isNULL(v))
				{
					tv1 = tv1+1;
				}
			}
			
			for(var i=0;i<checks2.length;i++)
			{
				var v = getvalue($(checks2[i]));
				if(!isNULL(v))
				{
					tv2 = tv2+1;
				}
			}
			
			//通过权值隐藏不需要显示的的模块
			if(tv2 > tv1)
			{
				el.find(".radio-div-one").remove();
			}
			else
				el.find(".radio-div-group").remove();
			
			//检查需要关联的值域
			var association = el.find(".check-div-association");
			
			for(var i=0;i<association.length;i++)
			{
				var r = $(association[i]).attr("result");
				
				if(isNULL(r))
					continue;
				var rs = r.split(",");
				var alen = $(association[i]).attr("associationlen");
				if(isNULL(alen))
					alen = rs.length;
				var asslen = 0;
				for(var j=0;j<rs.length;j++)
				{
					var vs = rs[j].split(":");
					
					var v = getvalue(el.find("[name='"+vs[0]+"']"));
					//比较两个值是否相等，相等就将关联长度加一
					if(v == vs[1])
					{
						asslen = asslen+1;
					}
				}
				//判断是否删除该节点,不等就删除
				if(asslen != alen)
				{
					association.remove();
				}
			}
			
			//删除为空选项
			var checks = el.find(".check-div-data");
			for(var i=0;i<checks.length;i++)
			{
				var r = $(checks[i]).attr("result");
				if(isNULL(r))
					continue;
				var rs = r.split(",");
				for(var j=0;j<rs.length;j++)
				{
					var v = getvalue(el.find("[name='"+rs[j]+"']"));
					if(isNULL(v))
					{
						el.find("[name='"+rs[j]+"']").remove();
					}
					
				}
			}

			function getvalue(tag)
			{
				if(tag == undefined || tag == "undefined")
					return null;
				var tagname = tag[0].tagName.toUpperCase();
				if(tagname == "INPUT")
				{
					return tag.val();
				}
				else if(tagname == "SELECT")
				{
					return tag.val();
				}
				else if(tagname == "DIV")
				{
					return tag.html();
				}
				else
				{
					return tag.text();
				}
			}
		},
		initSelectAssociationData:function(el,optionValue)
		{

			var isNULL=function(v)
			{
				if(v == "null" || v == null ||v == undefined ||v == "undefined" ||v == "")
					return true;
				return false;
			};
			//外部寻找
			var findObjById_Outside=function(tag,id)
			{
				if(isNULL(tag) || isNULL($(tag).html()))
					return null;
				if(id.indexOf("#")!=-1)
				{
					id = id.substring(1);
				}
				if($(tag).find("[data-id='"+id+"']").length > 0)
				{
					return $(tag).find("[data-id='"+id+"']");
				}
				else if($(tag).find("[id='"+id+"']").length > 0)
				{
					return $(tag).find("[data-id='"+id+"']");
				}
				
				return findObjById_Outside($(tag).parent(),id);
			};
		$(el).find(".association-select").each(function(){
			$(this).parent().unbind("change").change(function(){
				$(this).find("option:selected").click();
			});
			
			$(this).click(function(){
				var weeks = ["一","二","三","四","五","六","日"];
				var month = ["1","2","3","4","5","6","7","8","9","10","11","12"];
				var day = ["1","2","3","4","5","6","7","8","9","10",
				     "11","12","13","14","15","16","17","18","19","20",
				     "21","22","23","24","25","26","27","28","29","30","31"];
				
				var associationid = $(this).attr("association-select-id");
				if(!isNULL(associationid))
				{
					var obj = JSON.parse(associationid);
					if(!isNULL(obj.show))
					{
						var shows = obj.show.split(",");
						for(var i=0;i<shows.length;i++)
						{
							try
							{
								var t = findObjById_Outside($(this).parent(), shows[i]);
								t.parent().show();
							}catch(e)
							{
							}
						}
					}
					if(!isNULL(obj.hide))
					{
						var hides = obj.hide.split(",");
						for(var i=0;i<hides.length;i++)
						{
							try
							{
								var t = findObjById_Outside($(this).parent(), hides[i]);
								t.parent().hide();
							}catch(e)
							{
							}
						}
					}
				}
				//association-select-obj
				var associationobj = $(this).attr("association-select-obj");
				if(!isNULL(associationobj))
				{
					var obj = JSON.parse(associationobj);
					var tag = findObjById_Outside($(this).parent(), obj.id);
					if(!isNULL(tag))
					{
						if(isNULL(obj.value))
							tag[0].disabled = true;
						else
							tag[0].disabled = false;
						try
						{
							/**
							 * {"id":"eventType1",
							 * "vtype":"weeks",
							 * "value":"1~",
							 * "text":"一~日",
							 * "startstr":"周",
							 * "endstr":""}
							 */
							$(tag).html("");
							var data = [];
							if(obj.vtype == "weeks")
							{
								data = weeks;
							}
							else if(obj.vtype == "month")
							{
								data = month;
							}
							else if(obj.vtype == "day")
							{
								data = day;
							}
							else {
								//暂时不处理其他情况
							}
							var opv = obj.value;
							if(isNULL(opv))
								opv = 0;
							opv = opv.split(",");
							if(opv.length <=1)
							{
								opv = opv[0];
								opv = opv.split("~");
								
								for(var j = 0;j<opv[1];j++)
								{
									$(tag).append($('<option value="'+(opv[0]+j)+'">'+obj.startstr+data[j]+obj.endstr+'</option>'));
								}
							}
							else
							{
								for(var j = 0;j<opv.length;j++)
								{
									$(tag).append($('<option value="'+opv[j]+'">'+obj.startstr+data[j]+obj.endstr+'</option>'));
								}
							}
						}catch(e)
						{}
						
						
					}
				}
				//已经初始化完数据需要删除此属性
				$(this).removeAttr("association-select-obj");
				//association-select-obj-LinkedId
				var associationLinkid = $(this).attr("association-select-obj-LinkedId");
				if(!isNULL(associationLinkid))
				{
					var ids = associationLinkid.split(",");
					for(var i=0;i<ids.length;i++)
					{
						findObjById_Outside($(this),ids[i]).show();
					}
					
				}
			});

		});

		if($(el).find("option").length>0)
		{
			//先全部执行一遍click事件
			if(!isNULL(optionValue))
			{
				$(el).find("option[value='"+optionValue+"']")[0].selected = true;
				$(el).find("option[value='"+optionValue+"']").click();
			}
			else
			{
				$(el).find("option")[0].selected = true;
				$($(el).find("option")[0]).click();
			}
		}
	}
	}
	
});