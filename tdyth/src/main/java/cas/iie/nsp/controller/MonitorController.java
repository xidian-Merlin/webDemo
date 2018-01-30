package cas.iie.nsp.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cas.iie.nsp.service.IMonitorService;
import net.sf.json.JSONSerializer;

@Controller 
@RequestMapping(value="/eqpMonitor")
public class MonitorController {
	private static Logger logger = Logger.getLogger(MonitorController.class);  
	@Autowired IMonitorService monitorService;
	
	/**
	 * 页面跳转
	 * @return
	 */
	@RequestMapping(value="/monitorManage")
	public String monitorManage(){
		return "eqpMonitor/monitorManage";
	}
	
	/**
	 * 页面跳转
	 * @return
	 */
	@RequestMapping(value="/eqpMonitor")
	public String eqpMonitor(){
		return "eqpMonitor/eqpMonitor";
	}
	
	
	/**
	 * 功能：获取左侧的设备树形结构
	 * @param request 
	 * type:设备类型和安全域2种
	 * @return
	 */
    @RequestMapping(value="/preMonitor")
    public @ResponseBody Map<String,Object> preMonitor(HttpServletRequest request){  
    	Map<String,Object>resultMap=new HashMap<String,Object>();
    	String type=request.getParameter("type");
    	if(type==null)
    	{
    		resultMap.put("result", false);
    		return resultMap;
    	}else{
    		List<Map<String, Object>> mapList=monitorService.getPreInfo(type);
	    	resultMap.put("result", true);
	    	if("1".equals(type)){
	    		resultMap.put("assetPreviewList", mapList);
	    	}else if("2".equals(type)){
	    		resultMap.put("sdTreeWithCnt", mapList);
	    	}
	    	logger.info(JSONSerializer.toJSON(resultMap));
	    	return resultMap;
    	}
    } 

    /**
     * 功能：获取右侧的设备列表详细信息
     * @param request
     * type:值有3种root,class和type,即:全部,大类和小类,当type为root时显示全部 
     * id: 设备类型的id
     * @return
     */
    @RequestMapping(value="/delMonitor")
    public @ResponseBody Map<String,Object> DelMonitor(HttpServletRequest request){  
    	String tabType=request.getParameter("tabType");
    	String type=request.getParameter("type");
    	String idParam =request.getParameter("id");
    	String currentPageParam=request.getParameter("currentPage");
    	String numPerPageParam=request.getParameter("numPerPage");
    	if(tabType==null||type==null||idParam==null||currentPageParam==null||numPerPageParam==null)
    	{
    		Map<String,Object> resultMap=new HashMap<String,Object>();
    		resultMap.put("result", false);
    		return resultMap;
    	}else{
    		int id =Integer.parseInt(idParam);
        	int currentPage=Integer.parseInt(currentPageParam);
        	int numPerPage=Integer.parseInt(numPerPageParam);
	    	
	    	Map<String,Object> resultMap=monitorService.getDelInfo(tabType,type, id,currentPage,numPerPage); 
	    	return resultMap;
    	}
    } 
    
    /**
     * 功能:点击加号显示各层的内容
     */
    @RequestMapping(value="/plusPreInfo")
    public @ResponseBody Map<String,Object> plusPreInfo(HttpServletRequest request){
    	Map<String,Object>resultMap=new HashMap<String,Object>();
    	String eqpNo=request.getParameter("eqpNo");
    	if(eqpNo==null)
    	{
    		resultMap.put("result", false);
    		return resultMap;
    	}else{
    		List<Map<String,Object>>resultList=monitorService.getPlusPreInfo(eqpNo);
        	resultMap.put("result", true);
        	resultMap.put("typeList", resultList);
        	return resultMap;
    	}
    }
    /********************************************点击图标显示信息列表或者图形统计列表************************************************/
    /**
     * 功能:点击图标显示详细信息列表
     */
    @RequestMapping(value="/plusDelInfo")
    public @ResponseBody Map<String,Object> plusDelInfo(HttpServletRequest request){
    	
    	String eqpNo=request.getParameter("eqpNo");
    	String currentPageParam=request.getParameter("currentPage");
    	String numPerPageParam=request.getParameter("numPerPage");
    	String infoType=request.getParameter("infoType");
    	if(eqpNo==null||infoType==null||currentPageParam==null||numPerPageParam==null)
    	{
    		Map<String,Object>resultMap=new HashMap<String,Object>();
    		resultMap.put("result", false);
    		return resultMap;
    	}else
    	{
    		Map<String,Object>resultMap=monitorService.getPlusDelInfo(eqpNo,infoType,Integer.parseInt(currentPageParam),Integer.parseInt(numPerPageParam));
        	return resultMap;
    	}
    } 
    
    /**
	 * 基于时间的内存信息统计（折线图）
	 */
	@RequestMapping("/memTimeStatistics")
	public @ResponseBody Map<String, Object> memTimeStatistics(HttpServletRequest request) {
		String eqpNo=request.getParameter("eqpNo");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		Map<String, Object> statisticsValues = monitorService.getMemStatisticsByTime(eqpNo);
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("statisticsDataValues", statisticsValues.get("statisticsList"));
			resultMap.put("memTotal", statisticsValues.get("memTotal"));
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}
	
	/**
	 * 基于时间的网络接口状态信息统计（折线图）
	 */
	@RequestMapping("/ifStatStatistics1")
	public @ResponseBody Map<String, Object> getIfStatTimeStatistics1(HttpServletRequest request) {
		String eqpNo=request.getParameter("eqpNo");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		Map<String, Object> statisticsValues = monitorService.getIfStatStatisticsByTime1(eqpNo);
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("rxBytesList", statisticsValues.get("rxBytesList"));
			resultMap.put("txBytesList", statisticsValues.get("txBytesList"));
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}
	
	/**
	 * 基于时间的网络接口状态信息统计（折线图）
	 */
	@RequestMapping("/ifStatStatistics2")
	public @ResponseBody Map<String, Object> getIfStatTimeStatistics2(HttpServletRequest request) {
		String eqpNo=request.getParameter("eqpNo");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		Map<String, Object> statisticsValues = monitorService.getIfStatStatisticsByTime2(eqpNo);
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("rxErrorsList", statisticsValues.get("rxErrorsList"));
			resultMap.put("txErrorsList", statisticsValues.get("txErrorsList"));
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}
	
	/**
	 * 基于时间的网络接口状态信息统计（折线图）
	 */
	@RequestMapping("/sysStatInfoStatistics")
	public @ResponseBody Map<String, Object> getSysStatInfoStatisticsByTime(HttpServletRequest request) {
		String eqpNo=request.getParameter("eqpNo");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		Map<String, Object> statisticsValues = monitorService.getSysStatInfoStatisticsByTime(eqpNo);
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("cpuUserPercent", statisticsValues.get("cpuUserPercent"));
			resultMap.put("cpuSysPercent", statisticsValues.get("cpuSysPercent"));
			resultMap.put("sysOneMinLoad", statisticsValues.get("sysOneMinLoad"));
			resultMap.put("sysFiveMinLoad", statisticsValues.get("sysFiveMinLoad"));
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}
}
