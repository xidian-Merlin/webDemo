<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8"/>
<title>天地一体化管理系统</title>
<style type="text/css">
body{font:12px/24px "微软雅黑";color:#333;background:url(resources/images/bg.gif) repeat-x;}
#wrapper{width:780px;margin:30px auto;}
#header{color:#fff;margin-bottom:80px;}
#main{height:330px;background-color:#fff;border:1px #ccc solid;border-radius:15px;padding:25px;margin-bottom:10px;}
#footer{}

#image{float:left;margin-right:20px;}
#form{float:left;}

#form h2{font-size:20px;margin:0 0 35px 0;}
#form select,input[type="text"],input[type="password"]{display:block;height:30px;width:315px;margin-bottom:15px;}
#form select{height:40px;}
#form input[type="checkbox"]{clear:left;float:left;}
#form label{float:left;}
#reset-button{font-size:16px;text-decoration:none;text-align:center;color:#fff;padding:10px 10px;display:block;width:135px;background-color:#49B52B;margin-top:10px;margin-right:10px;clear:left;float:left;}
#login-button{font-size:16px;text-decoration:none;text-align:center;color:#fff;padding:10px 10px;display:block;width:135px;background-color:#EC9D23;margin-top:10px;float:left;}
#form p{clear:left;}

</style>
</head>

<body>
	<div id="wrapper">
		<div id="header"><h1>天地一体化管理系统-登录</h1><h2>CAS IIE</h2></div>
		<div id="main">
			<div id="image"><img src="resources/images/icon.png"></div>
			<div id="form">
				<form id="loginForm">
					<h2>系统登录</h2>
					<select>
						<option value="权限" selected="selected">系统管理员</option>
						<option value="普通管理员">普通管理员</option>
					</select>
					<input type="text" id="username" placeholder="用户名" required/>
					<input type="password" id="password" placeholder="密码" required/>
					<input type="checkbox" id="remoberPassword" checked="checked" /><label id="lab">记住用户名密码</label>
					<a href="#" id="reset-button" >重  置</a>
					<a href="#" id="login-button" >登  录</a>
					<p>若您没有用户名、密码，请联系管理员。</p>
				</form>
			</div>
		</div>
		<div id="footer">©2017 中科院信工所</div>
	</div>
<script type="text/javascript" src="resources/plugins/jquery.min.js"></script>
<script type="text/javascript" src="resources/plugins/jquery.validate.js"></script>
<script type="text/javascript">
function getCookie(name){ 
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
	var arr=arrCookie[i].split("="); 
	if(arr[0]==name)return arr[1]; 
	} 
	return ""; 
} 

$(document).ready(function() {		
	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/6./i)=="6."){ 
		alert("浏览器版本太低！为保证正常使用本系统，请选择满足IE9以上的内核的浏览器。"); 
	}else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7."){ 
		alert("浏览器版本太低！为保证正常使用本系统，请选择满足IE9以上的内核的浏览器。"); 
	}else if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8."){ 
		alert("浏览器版本太低！为保证正常使用本系统，请选择满足IE9以上的内核的浏览器。"); 
	}
	//读取cookie的内容
	var username = getCookie('username');
	var password = getCookie('password');
	var remember = getCookie("remember");
	
	$("#loginForm").find("#username").val(username.replace(/\"/g,""));
	$("#loginForm").find("#password").val(password.replace(/\"/g,""));
	
	if(remember == 'true'){
		$("#remoberPassword").attr("checked",true);
	}else{
		$("#remoberPassword").attr("checked",false);
	}
	
	function loginAction(){
		var  username = $.trim($("#loginForm").find("#username").val());
		 var  password = $.trim($("#loginForm").find("#password").val());
	  	 if(username==""){
		    alert("请输入用户名!");
	   		return false;
	  	 }
	  	 if(password==""){
	  		alert("请输入密码!");
	   		return false;
	  	 }
	  	 
	  	$.ajax({
	  	   type: "POST",
	  	   url: "user/login",
	  	   data: { username: username, password: password,remember: $("#remoberPassword")[0].checked},
	  	   dataType: "json",
	  	   success: function(data){
	  		 if(!data.result){ //失败
	  		     alert(data.message);
 		     }else{ //成功
 		    	//response.sendRedirect("user/index.jsp");
 		    	 window.location.href = "index/main"
 		     }
	  	   }
	  	});
	  	 
	}
	
	var $inp = $('#password'); //所有的input元素
	$inp.keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
	    var key = e.which; //e.which是按键的值
	    if (key == 13) {
	    	loginAction();
	    }
	});
	
	$("#login-button").click(function(){
		loginAction();
	});
});
</script>


</body></html>