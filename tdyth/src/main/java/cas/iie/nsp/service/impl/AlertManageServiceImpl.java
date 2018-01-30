package cas.iie.nsp.service.impl;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cas.iie.nsp.dao.IAlertManageDao;
import cas.iie.nsp.page.Pagination;
import cas.iie.nsp.service.IAlertManageService;

@Service("AlertManageService")
public class AlertManageServiceImpl extends BaseServiceImpl<Object> implements IAlertManageService {
	@Autowired IAlertManageDao alertManageDao;

	@Override
	public Map<String, Object> getAlertTypeList(int operateType,int currentPage, int numPerPage) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		String sql = null;
		if(operateType==1){
			sql="select * from \"MNGT_SYS\".\"ALERTTYPETBL\" where 1=1";
		}else if(operateType==2){
			 sql="select * from \"MNGT_SYS\".\"ALERTTYPETBL\" where \"mixType\" = 0";
		}
		Pagination pagination=alertManageDao.queryPage(currentPage, numPerPage, sql);
		List<Map<String,Object>> resultList=pagination.getResultList();
		for (Map<String, Object> map : resultList) {
			if((Integer)map.get("mixType")==1){
				map.put("mixType", "是");
			}else{
				map.put("mixType", "否");
			}
		}
		resultMap.put("totalRows", pagination.getTotalRows());
		resultMap.put("infoList", resultList);
		resultMap.put("result", true);
		return resultMap;
	}

	@Override
	public boolean alertTypeModify(int operateType, int alertTypeId, String typeName, String description, int mixType,
			String mixTypeValue) {
		int affectRows = 0;
		if (operateType == 1) {
			affectRows = insert("insert into \"MNGT_SYS\".\"ALERTTYPETBL\"(\"id\", \"typeName\", \"description\",\"mixType\",\"mixTypeValue\") values(?,?,?,?,?)",
					new Object[] { alertTypeId, typeName, description, mixType, mixTypeValue });
		} else if (operateType == 2) {
			affectRows = update(
					"update \"MNGT_SYS\".\"ALERTTYPETBL\" t set t.\"typeName\" = ?,t.\"description\"=?,t.\"mixType\"=?,t.\"mixTypeValue\"=? where t.\"id\" = ?;",
					new Object[] {typeName, description, mixType, mixTypeValue, alertTypeId});
		}
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public boolean alertTypeDelete(String alertTypeIds) {
		String sql = "delete from \"MNGT_SYS\".\"ALERTTYPETBL\" where \"id\"= ? ";
		int affectRows = 0;
		List<Object> paramsList = new ArrayList<Object>();
		String[] resultStr = alertTypeIds.split(",");
		for (String string : resultStr) {
			paramsList.add(Integer.parseInt(string));
		}
		affectRows = alertManageDao.batchDelete(sql, paramsList);
		if (affectRows > 0) {
			return true;
		}
		return false;
	}

	@Override
	public Map<String,Object> getAlertTypeStatistics() {
		Map<String, Object> resultMap=new HashMap<String,Object>();
		//获取所有类型的名字
		List<String> nameList=new ArrayList<String>();
		//获取所有类型的数量
		List<Object> valueList=new ArrayList<Object>();
		String sqlCount="select \"alertTypeID\",count(*) from \"MNGT_SYS\".\"ALERTTBL\" group by \"alertTypeID\"";
		List<Map<String, Object>> countlist=alertManageDao.findList(sqlCount,null);
		if(countlist==null){
			resultMap.put("result", false);
			return resultMap;
		}
		String sqlName=null;
		for (Map<String, Object> map : countlist) {
			long count=(long)map.get("COUNT(*)");
			valueList.add(count);
			sqlName="select \"typeName\" from \"MNGT_SYS\".\"ALERTTYPETBL\" where \"id\" = ?";
			Map<String,Object> nameResultMap=alertManageDao.find(sqlName,new Object[]{(Integer)map.get("alertTypeID")});
			nameList.add((String)nameResultMap.get("typeName"));
		} 
		resultMap.put("result", true);
		resultMap.put("nameList", nameList);
		resultMap.put("valueList", valueList);
		return resultMap;
	}

	/**
	 * 5.严重告警
	 * 4.重大告警
	 * 3.次要告警
	 * 2.警告告警
	 * 1.待定告警
	 */
	@Override
	public Map<String, Object> getAlertUrgentStatistics() {
		Map<String, Object> resultMap=new HashMap<String,Object>();
		List<Object> typeList =new ArrayList<Object>();
		typeList.add("待定告警");
		typeList.add("警告告警");
		typeList.add("次要告警");
		typeList.add("重大告警");
		typeList.add("严重告警");
		String sql ="select \"ugentLevel\",count(*) from \"MNGT_SYS\".\"ALERTTBL\" group by \"ugentLevel\"";
		List<Map<String, Object>> countList=alertManageDao.findList(sql, null);
		List<Map<String,Object>> dataList=new ArrayList<Map<String,Object>>();
		for (Map<String, Object> map : countList) {
			Map<String,Object> dataMap=new HashMap<String,Object>();
			if((Integer)map.get("ugentLevel")==1)
			{
				dataMap.put("name", "待定告警");
			}else if((Integer)map.get("ugentLevel")==2){
				dataMap.put("name", "警告告警");
			}else if((Integer)map.get("ugentLevel")==3){
				dataMap.put("name", "次要告警");
			}else if((Integer)map.get("ugentLevel")==4){
				dataMap.put("name", "重大告警");
			}else if((Integer)map.get("ugentLevel")==5){
				dataMap.put("name", "严重告警");
			}
			dataMap.put("value", map.get("COUNT(*)"));
			dataList.add(dataMap);
		}
		resultMap.put("typeList", typeList);
		resultMap.put("dataList", dataList);
		resultMap.put("result", true);
		return resultMap;
	}

	@Override
	public List<Object> getAlertStatisticsByTime() {
		String sql="SELECT HOUR(\"reportTime\"),count(*) from \"MNGT_SYS\".\"ALERTTBL\" group by HOUR(\"reportTime\") order by HOUR(\"reportTime\")";
		List<Map<String,Object>> resultList=alertManageDao.findList(sql, null);
		List<Object> result= new ArrayList<Object>();
		for (Map<String,Object> map : resultList) {
			result.add(map.get("COUNT(*)"));
		}
		return result;
	}

	@Override
	public Map<String, Object> getEventTypeStatistics() {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		List<String> nameList=Arrays.asList("操作系统事件","应用软件","网络设备","链路告警","其他");
		List<Map<String,Object>> valueList=new ArrayList<Map<String,Object>>();
		String sql="select t2.\"assetType\",count(*) from MNGT_SYS.EVENTTBL t1 left join MNGT_SYS.EVENTTYPETBL t2 on t1.\"eventTypeID\" = t2.\"id\" group by  t2.\"assetType\"";
		List<Map<String, Object>> list=alertManageDao.findList(sql, null);
		if(list!=null&&list.size()!=0){
			for (Map<String, Object> map : list) {
				Map<String, Object> resultValuesMap=new HashMap<String,Object>();
				if(((BigDecimal)map.get("assetType")).intValue()==1){
					resultValuesMap.put("name", "操作系统事件");
				}else if(((BigDecimal)map.get("assetType")).intValue()==2)
				{
					resultValuesMap.put("name", "应用软件");
				}else if(((BigDecimal)map.get("assetType")).intValue()==3)
				{
					resultValuesMap.put("name", "网络 设备");
				}else if(((BigDecimal)map.get("assetType")).intValue()==4)
				{
					resultValuesMap.put("name", "链路告警");
				}else if(((BigDecimal)map.get("assetType")).intValue()==5)
				{
					resultValuesMap.put("name", "其他");
				}
				resultValuesMap.put("value", map.get("COUNT(*)"));
				valueList.add(resultValuesMap);
			}
			resultMap.put("result", true);
			resultMap.put("nameList", nameList);
			resultMap.put("valueList", valueList);
		}else{
			resultMap.put("result", false);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getEventRankStatistics() {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		List<String> nameList=Arrays.asList("一般信息","一般故障","较大故障","严重故障","致命故障");
		List<Map<String,Object>> valueList=new ArrayList<Map<String,Object>>();
		String sql="select \"rank\",count(*) from \"MNGT_SYS\".\"EVENTTBL\" group by \"rank\"";
		List<Map<String, Object>> countList=alertManageDao.findList(sql, null);
		if(countList!=null&&countList.size()!=0){
			for (Map<String, Object> map : countList) {
				Map<String, Object> resultValuesMap=new HashMap<String,Object>();
				if(((BigDecimal)map.get("rank")).intValue()==1){
					resultValuesMap.put("name", "一般信息");
				}else if(((BigDecimal)map.get("rank")).intValue()==2)
				{
					resultValuesMap.put("name", "一般故障");
				}else if(((BigDecimal)map.get("rank")).intValue()==3)
				{
					resultValuesMap.put("name", "较大故障");
				}else if(((BigDecimal)map.get("rank")).intValue()==4)
				{
					resultValuesMap.put("name", "严重故障");
				}else if(((BigDecimal)map.get("rank")).intValue()==5)
				{
					resultValuesMap.put("name", "致命故障");
				}
				resultValuesMap.put("value", map.get("COUNT(*)"));
				valueList.add(resultValuesMap);
			}
			resultMap.put("result", true);
			resultMap.put("nameList", nameList);
			resultMap.put("valueList", valueList);
		}else{
			resultMap.put("result", false);
		}
		return resultMap;
	}

	@Override
	public List<Object> getEventStatisticsByTime() {
		String sql="SELECT HOUR(\"time\"),count(*) from \"MNGT_SYS\".\"EVENTTBL\" group by HOUR(\"time\") order by HOUR(\"time\")";
		List<Map<String,Object>> resultList=alertManageDao.findList(sql, null);
		List<Object> result= new ArrayList<Object>();
		for (Map<String,Object> map : resultList) {
			result.add(map.get("COUNT(*)"));
		}
		return result;
	}

	@Override
	public Integer getAlertTypeMaxId() {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		String sql="SELECT MAX(\"id\") FROM \"MNGT_SYS\".\"ALERTTYPETBL\"";
		resultMap=alertManageDao.find(sql, null);
		Integer maxId=(Integer)resultMap.get("MAX(\"id\")");
		return maxId;
	}

	@Override
	public Map<String, Object> getAlertList(int currentPage, int numPerPage) {
		// HH表示24小时
		DateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<Map<String, Object>> result = null;
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = null;
		int totalRows;
		Pagination page = null;
		sql = "select t1.*, t2.\"typeName\"  as \"alertTypeName\" from \"MNGT_SYS\".\"ALERTTBL\" t1 left join \"MNGT_SYS\".\"ALERTTYPETBL\" t2  on t1.\"alertTypeID\" = t2.\"id\" where 1 = 1";
		page = alertManageDao.queryPage(currentPage, numPerPage, sql);
		totalRows = page.getTotalRows();
		result = page.getResultList();
		for (Map<String, Object> map : result) {
			if (map.get("reportTime") != null)
				// 将sql结果中的Timestamp 转换为 Date类型，然后再通过format格式化为日期字符串
				map.put("reportTime", dFormat.format(new Date(((Timestamp) map.get("reportTime")).getTime())));
			if (map.get("startTime") != null)
				// 将sql结果中的Timestamp 转换为 Date类型，然后再通过format格式化为日期字符串
				map.put("startTime", dFormat.format(new Date(((Timestamp) map.get("startTime")).getTime())));
			if (map.get("lastTime") != null)
				// 将sql结果中的Timestamp 转换为 Date类型，然后再通过format格式化为日期字符串
				map.put("lastTime", dFormat.format(new Date(((Timestamp) map.get("lastTime")).getTime())));
		}
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		resultMap.put("infoList", result);
		return resultMap;
	}

	@Override
	public Map<String, Object> getAlertDelInfo(int currentPage, int numPerPage,int alertID) {
		// HH表示24小时
		DateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<Map<String, Object>> result = null;
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = "select * from \"MNGT_SYS\".\"EVENT_ALERTTBL\" t1 left join \"MNGT_SYS\".\"EVENTTBL\" t2  on t1.\"Event_id\" = t2.\"id\" where t1.\"Alert_id\" = ?";
		Pagination page = alertManageDao.queryPage(currentPage, numPerPage, sql,alertID);
		int totalRows = page.getTotalRows();
		result = page.getResultList();
		for (Map<String, Object> map : result) {
			if (map.get("time") != null)
				// 将sql结果中的Timestamp 转换为 Date类型，然后再通过format格式化为日期字符串
				map.put("time", dFormat.format(new Date(((Timestamp) map.get("time")).getTime())));
		}
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		resultMap.put("infoList", result);
		return resultMap;
	}
	
	
}
