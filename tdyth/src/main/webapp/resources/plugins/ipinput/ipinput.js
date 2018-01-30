define(function (){
	return {
			render : function (el)
			{
				// 默认属性  
		        var defaults =  
		        {  
		            // 长度最低支持110像素  
		            width : 110,  
		            // 高度默认20像素  
		            height : 30,  
		            // 在键盘按下时用来存储未输入前的值  
		            currValue : '',  
		            // 原有值，就是从数据库中读取到的值  
		            value : ''  
		        }  
		          
		        // 传递的参数
		        var options = $.extend(defaults, options);

		        // 输入控件代码  
		        var html = '';  
		        html += '<div class="ipinput_div">';  
		        html += '<input type="text" id="ipOne" class="ipinput_input"/>';  
		        html += '<span class="ipinput_separator">.</span>';  
		        html += '<input type="text" id="ipTwo" class="ipinput_input"/>';  
		        html += '<span class="ipinput_separator">.</span>';  
		        html += '<input type="text" id="ipThree" class="ipinput_input"/>';  
		        html += '<span class="ipinput_separator">.</span>';  
		        html += '<input type="text" id="ipFour" class="ipinput_input"/>';  
		        html += '</div>';

		        el.append(html);


		        // 输入框绑定键盘按下事件  
		        $('.ipinput_input').keydown(function(event)  
		        {  
		            keydown(event ,this);  
		        });  
		          
		        // 输入框绑定键盘按下弹起事件  
		        $('.ipinput_input').keyup(function(event)  
		        {  
		            keyup(event ,this);
		        });  
		          
		        // 输入框失去焦点事件  
		        $('.ipinput_input').click(function()  
		        {  
		            $(this).select(); 
		        });

		        // 输入框失去焦点事件  
		        $('.ipinput_input').blur(function()  
		        {  
		            setData(this);
		        }); 

		        // 判断参数是否为空  
			    var isEmpty = function(obj)  
			    {  
			        if(null == obj)  
			        {  
			            return true;  
			        }  
			        else if(undefined == obj)  
			        {  
			            return true;  
			        }  
			        else if("" == obj)  
			        {  
			            return true;  
			        }  
			        else  
			        {  
			            return false;  
			        }  
			    };
		        // 键盘按下事件  
			    var keydown = function(event ,tis)  
			    {
			        // 当前输入的键盘值  
			        var code = event.keyCode;

			        // 除了数字键、删除键、小数点之外全部不允许输入  
			        if((code < 48 && 8 != code && 37 != code && 39 != code)   
			            || (code > 57 && code < 96)   
			            || (code > 105 && 110 != code && 190 != code))  
			        {  
			            return false;
			        }
			          
			        // 先存储输入前的值，用于键盘弹起时判断值是否正确  
			        options.currValue = $(tis).val();  
			          
			        // 110、190代表键盘上的两个点  
			        if(110 == code || 190 == code)  
			        {  
			            // 当前输入框的ID  
			            var id = $(tis).attr("id");  
			              
			            // 当前输入框的值  
			            var value = $(tis).val();  
			              
			            // 如果是第一个框则第二个框获的焦点  
			            if("ipOne" == id && !isEmpty(value))  
			            {  
			                $('#ipTwo').focus();  
			                return false;  
			            }  
			            // 如果是第二个框则第三个框获的焦点  
			            else if("ipTwo" == id && !isEmpty(value))  
			            {  
			                $('#ipThree').focus();  
			                return false;  
			            }  
			            // 如果是第三个框则第四个框获的焦点  
			            else if("ipThree" == id && !isEmpty(value))  
			            {  
			                $('#ipFour').focus();  
			                return false;  
			            }  
			            // 如果是第四个框则直接返回  
			            else if("ipFour" == id)  
			            {  
			                return false;  
			            }  
			            else if(isEmpty(value))  
			            {  
			                return false;  
			            }  
			        }  
			    }

		        // 键盘弹起事件  
			    var keyup = function(event ,tis)  
			    {  
			        // 当前值
			        var value = $(tis).val();

			        var code = event.keyCode;

			        // 除了数字键、删除键、小数点之外全部不允许输入  
			        if((code < 48 && 8 != code && 37 != code && 39 != code)   
			            || (code > 57 && code < 96)   
			            || (code > 105 && 110 != code && 190 != code))  
			        {
			        	$(tis).val("");
			            return false;
			        }

			        if(!isEmpty(value))  
			        {  
			            value = parseInt(value);  
			              
			            if(value > 255)  
			            {  
			                $(tis).val(options.currValue)  
			            }  
			            else if(value > 99)  
			            {
			                // 当前输入框的ID  
			                var id = $(tis).attr("id");  
			                  
			                // 如果是第一个框则第二个框获的焦点  
			                if("ipOne" == id && !isEmpty(value))  
			                {  
			                    $('#ipTwo').focus();  
			                }  
			                // 如果是第二个框则第三个框获的焦点  
			                else if("ipTwo" == id && !isEmpty(value))  
			                {  
			                    $('#ipThree').focus();  
			                }  
			                // 如果是第三个框则第四个框获的焦点  
			                else if("ipThree" == id && !isEmpty(value))  
			                {  
			                    $('#ipFour').focus();  
			                }  
			            }  
			        }  
			    }

			    // 赋值给隐藏框  
			    var setData = function(inputObj)  
			    {  
			        // 四个框的值  
			        var one = $('#ipOne').val();  
			        var two = $('#ipTwo').val();  
			        var three = $('#ipThree').val();  
			        var four = $('#ipFour').val();  
			          
			        // 如果四个框都有值则赋值给隐藏框  
			        if(!isEmpty(one) && !isEmpty(two) && !isEmpty(three) && !isEmpty(four))  
			        {  
			            var ip = one + "." + two + "." + three + "." + four;  
			            inputObj.val(ip);  
			        }  
			    }
			}
	}
});