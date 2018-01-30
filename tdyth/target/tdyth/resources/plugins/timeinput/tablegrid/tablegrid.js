define(function (){
	return {
		render:function (elDiv ,opt){

			var self = this;

			var default_opt = {
				header : [],
				data : [],
				paginator : true,
				oper : [],
				url : "",
				paramObj : null,
				currentPage : 1,
				pageSize : 10,
				isLoad : true,
				allowCheckBox:true,
				maskObj : 'body',
				isAsync : false
			}

			var opt = $.extend(default_opt ,opt);

			var header = opt.header;
			var data = opt.data;
			var oper = opt.oper;
			var url = opt.url;
			var buffer = [];

			elDiv.empty();

			elDiv.append('<table class="table table-hover table-bordered table-sort m0 ovxh"'
							+' data-resizable-columns-id="tablegrid">'
						+'</table>');
			el  = elDiv.find('table').eq(0);

			// 渲染表头
			buffer.push("<tr>");
			// 是否允许全选
			if (opt.allowCheckBox)
			{
				buffer.push('<th><input type="checkbox" data-id="check_all"/></th>');
			}
			
			for (var i=0;i<header.length;i++){
				buffer.push('<th>'+'<span class="custom-down" data-id="sort"></span>'+header[i].text+'</th>');
			}
			buffer.push("</tr>");

			el.append(buffer.join(""));

			// 渲染数据
			this.renderData(el ,opt);
		},
		renderData:function (el ,opt){
			var self = this;
			if (opt.paginator)
			{
				if (!opt.paramObj)
				{
					opt.paramObj = new Object();
				}
				opt.paramObj.currentPageNum = opt.currentPage;
				opt.paramObj.pageSize = opt.pageSize;
			}

			um_ajax_get({
				url : opt.url,
				isLoad : opt.isLoad,
				paramObj : opt.paramObj,
				maskObj : opt.maskObj,
				isAsync : opt.isAsync,
				successCallBack : function (data){
					var header = opt.header;
					var oper = opt.oper;
					var buffer = [];
					var dataObj;
					var tdText;
					for (var i=0;i<data.length;i++)
					{
						buffer.push("<tr>");
						dataObj = data[i];
						// 是否允许全选
						if (opt.allowCheckBox)
						{
							buffer.push('<td><input type="checkbox" data-id="check_inp"/></td>');
						}
						for (var j=0;j<header.length;j++)
						{
							tdText = dataObj[header[j].name];
							if (header[j].render)
							{
								tdText = header[j].render(tdText);
							}
							buffer.push('<td>'+tdText+'</td>');
						}
						// 渲染操作栏
						if (oper && oper.length > 0)
						{
							buffer.push('<td data-id="oper_td" style="text-align:center">');
							for (var j=0;j<oper.length;j++)
							{
								buffer.push('<a data-id="aclick" href="javascript:void(0);" style="color:#000"><i class="'
													+oper[j].icon+'" title="'+oper[j].text+'"></i>')
							}
							buffer.push("</td>");
						}

						buffer.push("</tr>");
					}

					el.append(buffer.join(""));

					// 全选事件
					if (opt.allowCheckBox)
					{
						el.find("[data-id=check_all]").click(function (){
							if ($(this)[0].checked)
							{
								el.find("input[data-id=check_inp]").prop("checked" ,"checked");
							}
							else
							{
								el.find("input[data-id=check_inp]").removeAttr("checked");
							}
						});
					}

					// 操作栏事件
					el.find("[data-id=oper_td]").each(function (){
						$(this).find("[data-id=aclick]").each(function (i){
							$(this).click(function (){
								oper[i].aclick();
							});
						});
					});

					// 设置表头可以拖拽
					//el.resizableColumns();

					// 排序事件
					el.find("th").click(function (){
						$(this).find("[data-id=sort]").toggleClass("custom-up");
					});

				    // 分页信息
				    if (opt.paginator)
				    {
				    	var numPerPage = opt.pageSize;
				    	var dataCount = 0;
				    	var totalPages = 1;

				    	if (data && data.length > 0)
				    	{
				    		dataCount = data[0].recordCount;
				    		totalPages = Math.ceil(dataCount/numPerPage);
				    	}
					    var paginator_obj = 
					    		$('<ul></ul>');

						var paginator_options =	{
								            bootstrapMajorVersion: 3, //版本
								            currentPage: opt.currentPage, //当前页数
								            totalPages: totalPages, //总页数
								            itemTexts: function (type, page, current)
								            {
								              switch (type)
								              {
								                case "first":
								                  return "首页";
								                case "prev":
								                  return "上一页";
								                case "next":
								                  return "下一页";
								                case "last":
								                  return "末页";
								                case "page":
								                  return page;
								              }
								            },
								            onPageClicked: function (event, originalEvent, type, page)
								            {
								            	opt.currentPage = page;
								            	self.render(el.parent() ,opt);
								            }
							            }
						paginator_obj.bootstrapPaginator(paginator_options);

						el.after(paginator_obj);

						el.after('<div class="pagination-msg">共检索到'+dataCount+'条记录</div>')
				    }

				}
			});
		}
	}
});