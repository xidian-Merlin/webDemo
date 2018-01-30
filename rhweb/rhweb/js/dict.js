/** 
	风险等级背景色
*/
var dict_level_name_bgcolor = {
	"很高" : "#e74c3c",
	"高"   : "#fe8174",
	"中"   : "#ffb933",
	"低"   : "#62cb31",
	"很低" : "#96e174"
};

var dict_level_id_bgcolor = {
	"5" : "#ec7063",
	"4"   : "#E58308",
	"3"   : "#FADA8D",
	"2"   : "#7DAFDA",
	"1" : "#BAE0BA"
};

var dict_monitor_status_color = {
	"正常" : "#64cc34",
	"性能" : "#ffb933",
	"故障" : "#e74c3c",
	"凭证" : "#1397d5",
	"未知" : "#969593"
}

// 风险趋势对象
var risk_tend_id_obj = {
	"1" : {"icon":"icon-circle-arrow-up" ,"name":"上升" ,"color":"#ec7063"},
	"2" : {"icon":"icon-circle-arrow-right" ,"name":"不变" ,"color":""},
	"3" : {"icon":"icon-circle-arrow-down" ,"name":"下降" ,"color":"#1abc9c"}
}

var dict_event_status = {
	"1" : {name:"未处理"},
	"2" : {name:"忽略"},
	"3" : {name:"处理中"},
	"4" : {name:"已处理"}
}

var dict_big_panel = {
	"data" : "数据分析中心",
	"net"  : "网络监控中心",
	"event": "事态监控中心",
	"topo" : "拓扑展示中心",
	"biz"  : "应用监控中心"
}

var dict_fault_event_header = [
										{text:"事件名称",name:"faultName"},
										{text:"当前状态",
											name:"currentStatus",
											render: function(text) {
												return (text == "1" ? "正常" : "异常");
											},
											searchRender:function (el){
												var data = [
																{text:"----" ,id:"-1"},
										  						{text:"正常" ,id:"1"},
										  						{text:"异常" ,id:"0"}
													  		];
												g_formel.select_render(el ,{
													data : data,
													name : "currentStatus"
												});
											}
										},
										{text:"状态",
												name:"faultStatus",
												render:function(text){
											  	var status;
											  	switch(parseInt(text)){
											  		case 1: status="未处理"; break;
											  		case 2: status="忽略"; break;
											  		case 3: status="处理中"; break;
											  		case 4: status="已处理"; break;
											  		default :break;
											  	}
											  	return status;
											  },
											  searchRender:function(el){
											  var data = [
									  						{text:"未处理" ,id:"-1"},
									  						{text:"忽略" ,id:"2"},
									  						{text:"处理中" ,id:"3"},
									  						{text:"已处理" ,id:"4"}
												  		];
											  g_formel.select_render(el ,{
												  data : data,
												  name : "faultStatus"
											  });
									    }},
										{text:"资产名称",name:"edName"},
										{text:"事件类型",name:"className"},
										{text:"事件等级",
											name:"faultLevel",
											render: function(text) {
												var level;
												switch (parseInt(text)) {
													case 1:
														level = "高";
														break;
													case 2:
														level = "中";
														break;
													case 3:
														level = "低";
														break;
													case 4:
														level = "很低";
														break;
													default:
														break;
												}
												return level;
											},
											searchRender: function (el){
												var data = [
																{text:"----" ,id:"-1"},
										  						{text:"很高" ,id:"0"},
										  						{text:"高" ,id:"1"},
										  						{text:"中" ,id:"2"},
										  						{text:"低" ,id:"3"},
										  						{text:"很低" ,id:"4"},
													  		];
												g_formel.select_render(el ,{
													data : data,
													name : "faultLevel"
												});
											}
										},
										{text:"最新发生时间",name:"enterDate"},
										{text:"恢复时间",name:"updateDate"}
									];
var dict_perform_event_header = [
									{text:"事件名称",name:"perfName"},
									{text:"当前状态",
										name:"currentStatus",
										render: function(text) {
											return (text == "1" ? "正常" : "异常");
										},
										searchRender:function (el){
											var data = [
															{text:"----" ,id:"-1"},
									  						{text:"正常" ,id:"1"},
									  						{text:"异常" ,id:"0"}
												  		];
											g_formel.select_render(el ,{
												data : data,
												name : "currentStatus"
											});
										}
									},
									{text:"状态",
										name:"perfStatus",
										render:function(text){
									  	var status;
									  	switch(parseInt(text)){
									  		case 1: status="未处理"; break;
									  		case 2: status="忽略"; break;
									  		case 3: status="处理中"; break;
									  		case 4: status="已处理"; break;
									  		default :break;
									  	}
									  	return status;
									  },
									  searchRender:function(el){
									  var data = [
							  						{text:"未处理" ,id:"-1"},
							  						{text:"忽略" ,id:"2"},
							  						{text:"处理中" ,id:"3"},
							  						{text:"已处理" ,id:"4"}
										  		];
									  g_formel.select_render(el ,{
										  data : data,
										  name : "perfStatus"
									  });
							    }},
									{text:"资产名称",name:"edName"},
									{text:"事件类型",name:"className"},
									{text:"事件等级",
										name:"perfLevel",
										render: function(text) {
											var level;
											switch (parseInt(text)) {
												case 1:
													level = "高";
													break;
												case 2:
													level = "中";
													break;
												case 3:
													level = "低";
													break;
												default:
													break;
											}
											return level;
										},
										searchRender: function (el){
											var data = [
															{text:"----" ,id:"-1"},
									  						{text:"很高" ,id:"0"},
									  						{text:"高" ,id:"1"},
									  						{text:"中" ,id:"2"},
									  						{text:"低" ,id:"3"},
									  						{text:"很低" ,id:"4"},
												  		];
											g_formel.select_render(el ,{
												data : data,
												name : "perfLevel"
											});
										}
									},
									{text:"最新发生时间",name:"enterDate"},
									{text:"恢复时间",name:"updateDate"}
								];

var dict_pass_info = {
	"PASS_MAX_DAYS" : "密码最长过期天数",
	"PASS_MIN_DAYS" : "密码最小过期天数",
	"PASS_MIN_LEN" : "密码最小长度",
	"PASS_WARN_AGE" : "密码过期警告天数",
	"maxrepeats" :  "密码字符重复出现的次数",
	"histexpire" :  "用户密码重新使用间隔",
	"histsize" :  "新密码不能和之前几次的相同",
	"minage" :  "最短修改密码的时间",
	"mindiff" :  "新口令与原口令至少要多少字符不相同",
	"minalpha" :  "口令中至少包含的字母数",
	"minother" :  "口令中至少包含特殊字符的个数",
	"minlen" :  "口令的最小长度",
	"loginretries" :  "密码最大输错多少次",
	"maxage" :  "密码的可用时间（周）",
	"maxexpired" :  "密码时间超过maxage后多长时间用户或过期"
}
