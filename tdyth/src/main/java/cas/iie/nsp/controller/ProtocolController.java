package cas.iie.nsp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import cas.iie.nsp.service.IProtocolService;

@Controller
@RequestMapping(value = "/protocol")
public class ProtocolController {
	@Autowired
	IProtocolService protocolService;
	/**
	 * 获取设备class下拉列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/historyInfoList")
	public @ResponseBody Map<String, Object> getHistoryInfoList(HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("result", true);
		resultMap.put("infoList", null);
		return resultMap;
	}
	
	/**
	 * 发送消息
	 * @param request
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value = "/sendMsg")
	public @ResponseBody Map<String, Object> sendMsg(HttpServletRequest request) throws Exception {
		//String params=request.getParameter("info");
		String params="{\"headerMsg\":{\"version\":1,\"classfication\":3,\"type\":1},\"fixedBodyMsg\":{\"eqpId\":\"0001-00001\",\"configSenderID\":1234,\"userID\":12,\"time\":1514449844168,\"command\":5,\"subcommand\":1,\"targetSize\":1,\"targetID\":\"0001-00001\"},\"unFixedBodyMsg\":[{\"type\":\"1\",\"value\":\"49\"},{\"type\":\"2\",\"value\":\"0f:0f:0f:0f:0f:0f\"},{\"type\":\"3\",\"value\":\"0f:0f:0f:0f:0f:0f\"},{\"type\":\"4\",\"value\":\"0f:0f:0f:0f:0f:0f\"},{\"type\":\"5\",\"value\":\"0f:0f:0f:0f:0f:0f\"},{\"type\":\"6\",\"value\":\"192.168.90.23\"},{\"type\":\"7\",\"value\":\"192.168.90.22\"},{\"type\":\"8\",\"value\":\"192.168.90.22\"},{\"type\":\"9\",\"value\":\"192.168.90.22\"},{\"type\":\"10\",\"value\":\"2334\"},{\"type\":\"11\",\"value\":\"2334\"},{\"type\":\"12\",\"value\":\"2334\"},{\"type\":\"13\",\"value\":\"2334\"},{\"type\":\"14\",\"value\":\"12\"},{\"type\":\"15\",\"value\":\"2017-12-21\"},{\"type\":\"16\",\"value\":\"05:00:00\"},{\"type\":\"17\",\"value\":\"2017-12-28\"},{\"type\":\"18\",\"value\":\"00:32:00\"},{\"type\":\"19\",\"value\":\"1\"},{\"type\":\"20\",\"value\":\"123\"},{\"type\":\"21\",\"value\":\"123\"},{\"type\":\"22\",\"value\":\"123\"},{\"type\":\"23\",\"value\":\"china\"},{\"type\":\"24\",\"value\":\"china\"},{\"type\":\"25\",\"value\":\"49\"}]}";
		System.out.println("params===>"+params.toString());
		HashMap<String,Object>paramsMap=JSON.parseObject(params,new TypeReference<HashMap<String,Object>>(){});
		HashMap<String, Object>headerMsgMap=JSON.parseObject(paramsMap.get("headerMsg").toString(),new TypeReference<HashMap<String,Object>>(){});
		HashMap<String, Object>fixedBodyMsgMap=JSON.parseObject(paramsMap.get("fixedBodyMsg").toString(),new TypeReference<HashMap<String,Object>>(){});
		List<HashMap<String, Object>>unFixedMsgMapList=JSON.parseObject(paramsMap.get("unFixedBodyMsg").toString(),new TypeReference<List<HashMap<String, Object>>>(){});
		Map<String, Object> resultMap = new HashMap<String, Object>();
		protocolService.sendMsg(headerMsgMap, fixedBodyMsgMap, unFixedMsgMapList);
		resultMap.put("result", true);
		resultMap.put("info", null);
		return resultMap;
	}
}
