package cas.iie.nsp.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import cas.iie.nsp.service.IAlertManageService;

@Controller
@RequestMapping(value = "/alertManage")
public class AlertManageController {
	@Autowired
	IAlertManageService alertManageService;

	/********************************************* 告警类型 ***************************************************/
	/**
	 * 告警类型页面跳转
	 * 
	 * @return
	 */
	@RequestMapping("/alertTypeInit")
	public String alertTypeInit() {
		return "alertManage/alertType";
	}

	/**
	 * 告警类型列表
	 * 
	 * @param currentPage
	 *            当前页数
	 * @param numPerPage
	 *            每页大小 operateType :1表示显示所有的告警类型列表；2表示只显示基本告警类型列表
	 */
	@RequestMapping("/alertTypeList")
	public @ResponseBody Map<String, Object> alertTypeList(HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String currentPageStr =request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		String operateTypeStr = request.getParameter("operateType");
		int currentPage , numPerPage ;
		if (currentPageStr == null || numPerPageStr == null || operateTypeStr == null) {
			resultMap.put("result", false);
			return resultMap;
		} else {
			int operateType = Integer.parseInt(operateTypeStr);
			currentPage = Integer.parseInt(currentPageStr);
			numPerPage = Integer.parseInt(numPerPageStr);
			Map<String, Object> listMap = alertManageService.getAlertTypeList(operateType, currentPage, numPerPage);
			/*resultMap.put("result", true);
			resultMap.put("infoList", listMap);*/
			resultMap = listMap;
		}
		return resultMap;
	}

	/**
	 * 增加,删除和修改告警类型
	 * mixType:0表示基本类型，1表示混合类型
	 */
	@RequestMapping("/alertTypeModify")
	public @ResponseBody Map<String, Object> alertTypeModify(HttpServletRequest request) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		int operateType = Integer.parseInt(request.getParameter("operateType"));
		// 新增和编辑告警类型
		if (operateType == 1 || operateType == 2) {
			String alertTypeIdStr = request.getParameter("alertTypeId");
			String typeName = request.getParameter("typeName");
			String description = request.getParameter("description");
			String mixTypeStr = request.getParameter("mixType");
			String mixTypeValue = null;
			int mixType = Integer.parseInt(mixTypeStr);
			if (mixType == 1) {
				mixTypeValue = request.getParameter("mixTypeValue");
			}
			int alertTypeId;
			if (alertTypeIdStr != null) {
				alertTypeId = Integer.parseInt(alertTypeIdStr);
			} else {
				alertTypeId = alertManageService.getAlertTypeMaxId() + 1;
			}
			boolean result = alertManageService.alertTypeModify(operateType, alertTypeId, typeName, description, mixType,
					mixTypeValue);
			resultMap.put("result", result);
			return resultMap;
		} else if (operateType == 3) {
			String alertTypeIdList = request.getParameter("alertTypeIdList");
			boolean result = alertManageService.alertTypeDelete(alertTypeIdList);
			resultMap.put("result", result);
			return resultMap;
		} else {
			resultMap.put("result", false);
			return resultMap;
		}
	}

	/********************************************* 告警统计 ***************************************************/
	/****************** 告警 ******************/
	/**
	 * 告警统计页面跳转
	 * 
	 * @return
	 */
	@RequestMapping("/alertStatistics")
	public String alertStatistics() {
		return "alertManage/alertStatistics";
	}

	/**
	 * 告警类别统计（柱状图）
	 */
	@RequestMapping("/alertTypeStatistics")
	public @ResponseBody Map<String, Object> alertTypeStatistics(HttpServletRequest request) {
		Map<String, Object> statisticsMap = alertManageService.getAlertTypeStatistics();
		return statisticsMap;
	}

	/**
	 * 告警紧急程度统计（饼状图）
	 */
	@RequestMapping("/alertUrgentStatistics")
	public @ResponseBody Map<String, Object> alertUrgentStatistics(HttpServletRequest request) {
		Map<String, Object> statisticsMap = alertManageService.getAlertUrgentStatistics();
		return statisticsMap;
	}

	/**
	 * 基于时间的告警统计（折线图）
	 */
	@RequestMapping("/alertTimeStatistics")
	public @ResponseBody Map<String, Object> alertTimeStatistics(HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		List<Object> statisticsValues = alertManageService.getAlertStatisticsByTime();
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("statisticsDataValues", statisticsValues);
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}

	/****************** 事件 ******************/

	/**
	 * 事件类别统计（饼状图）
	 */
	@RequestMapping("/eventTypeStatistics")
	public @ResponseBody Map<String, Object> eventTypeStatistics(HttpServletRequest request) {
		Map<String, Object> resultMap = alertManageService.getEventTypeStatistics();
		return resultMap;
	}

	/**
	 * 事件级别统计（饼状图）
	 */
	@RequestMapping("/eventRankStatistics")
	public @ResponseBody Map<String, Object> eventRankStatistics(HttpServletRequest request) {
		Map<String, Object> resultMap = alertManageService.getEventRankStatistics();
		return resultMap;
	}

	/**
	 * 基于时间的事件统计（折线图）
	 */
	@RequestMapping("/eventTimeStatistics")
	public @ResponseBody Map<String, Object> eventTimeStatistics(HttpServletRequest request) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<String> statisticsDataName = Arrays.asList("00:00时", "01:00时", "02:00时", "03:00时", "04:00时", "05:00时",
				"06:00时", "07;00时", "08:00时", "09:00时", "10:00时", "11:00时", "12:00时", "13:00时", "14:00时", "15:00时",
				"16:00时", "17:00时", "18:00时", "19:00时", "20:00时", "21:00时", "22:00时", "23:00时");
		List<Object> statisticsValues = alertManageService.getEventStatisticsByTime();
		if (statisticsValues != null && statisticsValues.size() != 0) {
			resultMap.put("result", true);
			resultMap.put("statisticsDataValues", statisticsValues);
			resultMap.put("statisticsDataName", statisticsDataName);
		} else {
			resultMap.put("result", false);
		}
		return resultMap;
	}

	/********************************************* 告警列表页面 ***************************************************/
	/**
	 * 告警列表页面跳转
	 */
	@RequestMapping("/alertInfoInit")
	public String alertInfoInit() {
		return "alertManage/alertInfoInit";
	}

	/**
	 * 告警信息列表展示
	 */
	@RequestMapping("/alertInfoList")
	public @ResponseBody Map<String, Object> alertInfoList(HttpServletRequest request) {

		String currentPageStr = request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		if (currentPageStr == null || numPerPageStr == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			int currentPage = Integer.parseInt(currentPageStr);
			int numPerPage = Integer.parseInt(numPerPageStr);
			Map<String, Object> resultMap = alertManageService.getAlertList(currentPage, numPerPage);
			return resultMap;
		}

	}

	/**
	 * 告警所包含的详细事件列表
	 */
	@RequestMapping("/alertOfEventsInfoList")
	public @ResponseBody Map<String, Object> alertOfEventsInfoList(HttpServletRequest request) {
		String currentPageStr = request.getParameter("currentPage");
		String numPerPageStr = request.getParameter("numPerPage");
		String alertIDStr = request.getParameter("alertID");
		if (currentPageStr == null || numPerPageStr == null || alertIDStr == null) {
			Map<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("result", false);
			return resultMap;
		} else {
			int currentPage = Integer.parseInt(currentPageStr);
			int numPerPage = Integer.parseInt(numPerPageStr);
			int alertID = Integer.parseInt(alertIDStr);
			Map<String, Object> resultMap = alertManageService.getAlertDelInfo(currentPage, numPerPage, alertID);
			return resultMap;
		}
	}

}
