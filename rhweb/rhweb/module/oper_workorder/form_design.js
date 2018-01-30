$(document).ready(function (){

	var width_range_slider = $("#range");

	var form_design = $("#form_design");

	var container = $("#form_design_container");

	var form_el_info = $("#form_el_info")

	var el_map = new HashMap();

	var form_el_current_id;

	var form_el_current;

	var default_el_width = 30;

	var el_outter = '<div class="um-fd-el"></div>'

	width_range_slider.ionRangeSlider({
		type: "single",
	    min: 1,
	    max: 100,
	    from:30,
	    onChange: function(obj){
	    	container.find("[id="+form_el_current_id+"]")
	    		.css("width" ,obj.from + "%")
	    		.data("width" ,obj.from);
    	}
	});

	// 元素更新点击事件
	$("#update").click(function (){
		form_el_current = container.find("[id="+form_el_current_id+"]")
				 			.data("param" ,form_el_info.umDataBind("serialize"));
		if (form_el_current.data("type") == "label")
		{
			form_el_current.children().text(form_el_current.data("param").text);
		}
		g_dialog.operateAlert(form_el_info ,"保存成功!");
	});

	// 元素删除点击事件
	$("#delete").click(function (){
		container.find("[id="+form_el_current_id+"]").remove();
		form_el_current_id = "";
		form_el_info.find("div[class*=form-group]").not("[data-id=btn_group]").hide();
		g_dialog.operateAlert(form_el_info ,"删除成功!");
	});

	$("#submit").click(function (){
		createLayoutXml();
	});

	// 键盘方向键
	$(document).on("keyup.fd" ,function (e){
		e.preventDefault();
		var keyCode = e.keyCode;
		if (!form_el_current_id)
		{
			return;
		}
		form_el_current = container.find("[id="+form_el_current_id+"]");
		var left = parseInt(form_el_current.css("left"));
		var top = parseInt(form_el_current.css("top"));
		switch(keyCode){
			case 37 : 
						form_el_current.css("left" ,(left - 1) + "px");
						break;
			case 38 : 
						form_el_current.css("top" ,(top - 1) + "px");
						break;
			case 39 : 
						form_el_current.css("left" ,(left + 1) + "px");
						break;
			case 40 : 
						form_el_current.css("top" ,(top + 1) + "px");
						break;
		}
	});

	$("#form_design_container").on("click.fd" ,function (){
		form_el_info.find("[data-type]").hide();
		container.find("[id="+form_el_current_id+"]").removeClass("active");
		form_el_current_id = "";
	});

	// label
	el_map.put("label" ,'<label class="control-label" data-width="auto">新标签</label>');

	// 输入框
	el_map.put("input" ,'<input type="text" class="form-control input-sm">');

	// 下拉框
	el_map.put("select" ,'<select class="form-control input-sm"></select>');

	// radio
	el_map.put("radio" ,'<div class="radio" data-width="auto"><label class="i-checks"><input type="radio"><i></i></label></div>');

	// checkbox
	el_map.put("checkbox" ,'<div class="checkbox" data-width="auto"><label class="i-checks"><input type="checkbox"><i></i></label></div>')

	// 分割线
	el_map.put("split" ,'<div class="form_design_split" data-width="95%"></div>')

	form_design.find("[data-id=fd_tool_ul]").find("a").click(function (e){
		addEl($(this).attr("data-id"));
		e.preventDefault();
	});

	/** 添加元素 */
	function addEl(elKey)
	{
		var el_outter_clone = $(el_outter).clone();

		el_outter_clone.data("type" ,elKey);

		el_outter_clone.data("width" ,default_el_width);

		var id = new Date().getTime();

		el_outter_clone.attr("id" ,id);

		container.append(el_outter_clone.append(el_map.get(elKey)));

		var data_width = el_outter_clone.children().attr("data-width");

		data_width && el_outter_clone.css("width" ,data_width)
				   && el_outter_clone.data("width" ,parseInt(data_width));


		initEvent(el_outter_clone);

		el_outter_clone.click();

		el_outter_clone.siblings().removeClass("active");

		el_outter_clone.addClass("active");
	}

	/** 删除元素 */
	function removeEl()
	{

	}

	/** 元素信息显示 */
	function infoEl(el_outter_param)
	{
		form_el_info.umDataBind("reset");
		var type = el_outter_param.data("type")
		form_el_info.find("[data-id=type]").val(type);
		form_el_info.find("[data-type]").hide();
		form_el_info.find("[data-type*="+type+"]").show();
		if (type.indexOf("input") >=0 || type.indexOf("select") >=0 
									  || type.indexOf("split") >=0)
		{
			width_range_slider.data("ionRangeSlider").update({from : el_outter_param.data("width")});
		}
		el_outter_param.data("param") &&
				form_el_info.umDataBind("render" ,el_outter_param.data("param"));
	}

	/** 初始化元素事件 */
	function initEvent(el_outter_param)
	{
		// 元素拖拽事件
		//鼠标离控件左上角的相对位置
		var _x;
		var _y;

		var diff_x;
		var diff_y;

		var _left = parseInt(el_outter_param.css("left"));
		var _top = parseInt(el_outter_param.css("top"));


		el_outter_param.mousedown(function (e){
			e.preventDefault();

			el_outter_param.siblings().removeClass("active");

			el_outter_param.addClass("active");

			_x = e.pageX;
			_y = e.pageY;

			$(document).on('mousemove.fd' ,function (e){
				diff_x = e.pageX - _x;
				diff_y = e.pageY - _y;
				el_outter_param.css("left" ,(_left + diff_x) + "px");
				el_outter_param.css("top" ,(_top + diff_y) + "px");
			});

			$(document).one('mouseup' ,function (e){
				$(document).off('mousemove.fd');
				_left = parseInt(el_outter_param.css("left"));
				_top = parseInt(el_outter_param.css("top"));
			});
		});

		// 元素点击事件
		el_outter_param.click(function (e){
			if (form_el_current_id == $(this).attr("id"))
			{
				e.stopPropagation();
				return;
			}

			infoEl(el_outter_param);
			
			form_el_current_id = $(this).attr("id");

			e.stopPropagation();
		});
	}

	/** 布局算法 */
	function autoLayout()
	{

	}

	/** 生成布局 */
	function createLayoutXml()
	{
		var form_el_list = [];
		var resultObj = new Object();
		resultObj.objList = [];
		var obj;
		var form_width = parseInt(container.width());
		var top;
		var left;
		console.log(form_width)
		container.find("div[class*=um-fd-el]").each(function (){
			obj = new Object();
			obj = $(this).data("param");
			$(this).data("width") && (obj.width = $(this).data("width"));
			form_el_list.push(obj);
			console.log($(this).css("top"));
			console.log($(this).css("left"));
			resultObj.objList.push(obj);
		});

		require(['/js/lib/Json2xml.js'] ,function (xml2json){
			var x2js = new xml2json();
			console.log(x2js.json2xml_str(resultObj));

			var xmlText = "<t><objList><type>label</type><text>123123123</text><id></id><name></name></objList><objList><type>label</type><text>123123</text><id></id><name></name></objList></t>";
			var jsonObj = x2js.xml_str2json( xmlText );
			console.log(jsonObj);
		});
	}
});