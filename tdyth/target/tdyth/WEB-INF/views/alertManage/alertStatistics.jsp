
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="ch">
<head>
    <meta charset="UTF-8">
    <title>后台管理系统</title>
    <!-- 引入 echarts.js -->
    <script src="/tdyth/resources/plugins/echarts.js"></script>
    <style type="text/css">
        *{
            margin: 0;
            padding: 0;
        }
        .main{
            width: 90%;
            height: 100%;
            position: absolute;
        }
        .quarter-div{
            width: 30%;
            height: 50%;
            float: left;
        }
        .blue{
            background-color: #5BC0DE;
        }
        .green{
            background-color: #5CB85C;
        }
        .orange{
            background-color: #F0AD4E;
        }
        .yellow{
            background-color: #FFC706;
        }
    </style>

</head>
<body>
    <div class="main" id="main">
        <div  id="tu1"  class="quarter-div "></div>
        <div  id="tu2" class="quarter-div "></div>
        <div  id="tu3" class="quarter-div "></div>
        <div  id="tu4" class="quarter-div "></div>
        <div  id="tu5" class="quarter-div "></div>
        <div  id="tu6" class="quarter-div "></div>
    </div>
</body>

<script src="/tdyth/resources/js/alertManager/alertStatistics/tu1.js"></script>
<script src="/tdyth/resources/js/alertManager/alertStatistics/tu2.js"></script>
<script src="/tdyth/resources/js/alertManager/alertStatistics/tu3.js"></script>
<script src="/tdyth/resources/js/alertManager/alertStatistics/tu4.js"></script>
<script src="/tdyth/resources/js/alertManager/alertStatistics/tu5.js"></script>
<script src="/tdyth/resources/js/alertManager/alertStatistics/tu6.js"></script>

</html>