define(function (){
	
	return{
			scene:null,						//画布
			stage:null,						//画布
			sceneTool:null,					//画布
			stageTool : null,				//画布
			canDrawId : "",					//画布ID
			linkLineColor : "200,180,0",	//关联线条默认颜色
			
			drawScalingX : 1,				//画图区X的缩放比例
			drawScalingY : 1,				//画图区Y的缩放比例
			
			monitors : new Array(),			//缓存所有的监控器节点
			
			queryMonitorUrl : "",
			queryOneMonitorStatusUrl : "",
			queryOneMonitorStatusByIdUrl : "",
			xmlModuleDataUrl : "",
			saveDataUrl : "",
			
			imgPath : "",
			customMonitorImgePath : "",
			imgsuffix : ".svg",
			
			isEditer : false,
			addApp : false,
			addAppUrl : "",
			nodeMaxId : 80000,
			sizeProportion : 1,
		
		
			tmpXmlObj : null,
		
		
			drawAppId : "",
			canvasToolBarId : "",
			canDrawShowAttr : "",			//画图弹框属性ID
			canDrawShowAttrLine : "",		//画图弹框线条属性ID
			rootObj : null,					//请求ROOT数据

			
			drawLineClickTimes : 0,			//在画图区域点击的次数
			drawLineNodes : new Array(),	//临时存储线段的两点NODE
			drawLineFlag : false,			//是否是点击直线
			isMouseDown : false,			//鼠标是否按下
			LineType : "line",				//全局线条属性
			toolsNodeList : new Array(),	//工具栏初始化列表
			
			nodeEventFunction:new Array(),	//是否子定义处理函数
			size:[],						//节点默认大小
			enCode:new Array(),				//特殊字符编码设置
			appSystem:"appSystem",			//应用系统类型名称
			
			showMonitorImgInEdit:false,		//是否在编辑界面显示监控器图标
			customComTypes:new Array(),		//自定义组件类型列表
			
	
	}
	
	
	
})