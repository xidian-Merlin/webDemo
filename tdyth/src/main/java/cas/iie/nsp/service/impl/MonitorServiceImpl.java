package cas.iie.nsp.service.impl;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cas.iie.nsp.dao.IMonitorDao;
import cas.iie.nsp.model.Eqp;
import cas.iie.nsp.page.Pagination;
import cas.iie.nsp.service.IMonitorService;
import cas.iie.nsp.utils.ListUtils;
import cas.iie.nsp.utils.ReflectUtils;

@Service("MonitorServiceImpl")
public class MonitorServiceImpl extends BaseServiceImpl<Eqp> implements IMonitorService {

	@Autowired
	IMonitorDao monitorDao;

	/**
	 * 第二次查询是在for循环里面进行数据库查询，每一次循环都进行一次查询
	 * 第三次查询是将数据库表中的数据全部查询出来，然后检测现有记录的id是否已经在数据库结果集里面
	 * 改进之处，可以通过测试，比较在for循环里多次数据库查询和一次数据库查询然后在for循环中使用contains查找所花的时间
	 */
	@Override
	public List<Map<String, Object>> getPreInfo(String type) {
		if("2".equals(type)){
			String countSql="SELECT t2.\"id\",count(t2.\"id\") from \"MNGT_SYS\".\"EQPREGTBL\" t1 left join \"MNGT_SYS\".\"SECDOMAINTBL\" t2 on t1.\"securityDomain\" = t2.\"id\" group by t2.\"id\" order by t2.\"id\"";
			List<Map<String, Object>> countMapList=monitorDao.findList(countSql, null);
			List<Map<String, Object>> resultList=new ArrayList<Map<String, Object>>();
			for (Map<String, Object> map : countMapList) {
				Map<String,Object> resultMap=new HashMap<String,Object>();
				String securityDomainSql="select * from MNGT_SYS.SECDOMAINTBL where \"id\"=?";
				Map<String, Object> securityDomainMap=monitorDao.find(securityDomainSql, new Object[]{map.get("id")});
				resultMap.put("name", securityDomainMap.get("name")+"("+map.get("COUNT(T2.\"id\")") +")");
				resultMap.put("id", map.get("id"));
				resultMap.put("parentId","root");
				resultList.add(resultMap);
			}
			Map<String,Object> endMap=new HashMap<String,Object>();
			endMap.put("name", "安全域");
			endMap.put("id", "root");
			endMap.put("parentId", null);
			resultList.add(endMap);
			return resultList;
		}
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> list = monitorDao.findList("select * from MNGT_SYS.EQPREGTBL", null);
		// 设置需要统计的字段
		String itemName = "assetType";
		// 统计每种设备出现的次数 是
		Map<String, Object> countMap = ListUtils.countRepeatedItem(list, itemName);
		Set<String> set = countMap.keySet();
		Integer param = null;
		int typeCount;
		// 用来记录EQPREGTBL中出现过的设备Class的id (eg: 表EQPCLASS.id (1,2,3,4))
		Map<String, Object> classMap = new HashMap<String, Object>();
		for (String key : set) {
			// 该类型设备的id
			param = Integer.parseInt(key);
			// 统计得到同一类型的设备个数
			typeCount = (int) countMap.get(key);
			// 获取该类型设备的一条记录
			Map<String, Object> parentMap = monitorDao.find("select * from MNGT_SYS.EQPTYPE where \"id\" = ?",
					new Object[] { param });
			// 新建一个Hashmap用来存储Tree的一个节点
			Map<String, Object> eqpTypeMap = new HashMap<String, Object>();
			eqpTypeMap.put("id", param);
			eqpTypeMap.put("name", parentMap.get("name") + "(" + typeCount + ")");
			eqpTypeMap.put("parentId", "-" + parentMap.get("cfg"));
			// 添加设备type节点到结果集中
			resultList.add(eqpTypeMap);
			// 键和值是一样的，纯粹是为了记录已经出现的class而已，方便后面使用keySet处理
			classMap.put(parentMap.get("cfg") + "", parentMap.get("cfg"));
		}
		// 查找数据库中所有class的记录
		List<Map<String, Object>> classMapList = monitorDao.findList("select * from MNGT_SYS.EQPCLASS", null);
		// 获取到EQPREGTBL表中记录过的EQPCLASS类型id
		Set<String> setClass = classMap.keySet();
		for (Map<String, Object> map : classMapList) {
			// 筛选EQPREGTBL记录中已经出现过的class，并获取该class设备记录的其他字段
			if (setClass.contains(map.get("id") + "")) {
				// 新建HashMap用来存储Tree的一个节点
				Map<String, Object> eqpClassMap = new HashMap<String, Object>();
				eqpClassMap.put("id", "-" + map.get("id"));
				eqpClassMap.put("name", map.get("name"));
				eqpClassMap.put("parentId", "root");
				// 添加设备class节点到结果集中
				resultList.add(eqpClassMap);
			}
		}
		// 新建HashMap用来存储Tree的根节点
		Map<String, Object> rootMap = new HashMap<String, Object>();
		rootMap.put("id", "root");
		rootMap.put("name", "资产类型");
		rootMap.put("parentId", null);
		// 将根节点添加到结果集中
		resultList.add(rootMap);
		return resultList;
	}

	@Override
	public Map<String, Object> getDelInfo(String tabType,String type, Integer id, int currentPage, int numPerPage) {
		List<Map<String, Object>> result = null;
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String sql = null;
		int totalRows;
		Pagination page = null;
		if("1".equals(tabType)){
			if ("class".equals(type)) {
				sql = "select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\" where t1.\"assetType\" in(select \"id\" from MNGT_SYS.EQPTYPE where \"cfg\" =?)";
			} else if ("type".equals(type)) {
				sql = "select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\" where t1.\"assetType\" =?";
			} else if ("root".equals(type)) {
				sql = "select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\"";
				id = null;
			}
		}else if("2".equals(tabType)){
			if("class".equals(type)){
				sql="select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\" where t1.\"securityDomain\" =?";

			}else if("root".equals(type)){
				sql="select t1.\"eqpNo\",t1.\"name\",t2.\"name\" as \"assetType\",t1.\"assetValue\",t3.\"name\" as \"securityDomain\",t1.\"workMode\",t1.\"manageMode\",t1.\"os\",t1.\"account\",t1.\"pass\",t1.\"ip\",t1.\"location\",t1.\"serial\",t1.\"contaction\" from MNGT_SYS.EQPREGTBL t1 left join MNGT_SYS.\"EQPTYPE\" t2 on t1.\"assetType\" =t2.\"id\" left join MNGT_SYS.\"SECDOMAINTBL\" t3 on t1.\"securityDomain\" =t3.\"id\"";
				id = null;
			}
		}
		page = monitorDao.queryPage(currentPage, numPerPage, sql, id);
		totalRows = page.getTotalRows();
		result = page.getResultList();
		resultMap.put("result", true);
		resultMap.put("totalRows", totalRows);
		// 将map转换为对象
		resultMap.put("infoList",
				result/* ReflectUtils.getReflectList(Eqp.class, result) */);
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> getPlusPreInfo(String eqpNo) {
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		String sqlAgentName = "select \"agentName\" from MNGT_SYS.EQPAGENT where \"eqpNo\" =?";
		// 获取到设备对应的代理列表
		List<Map<String, Object>> mapAgentList = monitorDao.findList(sqlAgentName, new Object[] { eqpNo });
		String sql = "select * from MNGT_SYS.AGENT_INFOGROUP where \"agentName\" =?";
		for (Map<String, Object> mapAgent : mapAgentList) {
			// 获取每一个代理对应的具体监控属性列表（内存，进程，磁盘等）
			List<Map<String, Object>> mapInfoList = monitorDao.findList(sql,
					new Object[] { mapAgent.get("agentName") });

			Map<String, Object> resultInfoMap = new HashMap<String, Object>();
			List<Map<String, Object>> resultInfoList = new ArrayList<Map<String, Object>>();
			String infoType = null;
			for (Map<String, Object> mapInfo : mapInfoList) {
				Map<String, Object> mapTemp = new HashMap<String, Object>();
				mapTemp.put("picName", mapInfo.get("description"));
				mapTemp.put("infoName", mapInfo.get("byName"));
				mapTemp.put("infoType", mapInfo.get("infoGroupName"));
				resultInfoList.add(mapTemp);
				infoType = (String) mapInfo.get("agentName");
			}
			resultInfoMap.put("infoType", infoType);
			resultInfoMap.put("infoList", resultInfoList);
			resultList.add(resultInfoMap);
		}
		return resultList;
	}

	/**
	 * String 字符串相加，StringBuilder,StringBuffer(线程安全)，3者种，当量级比较大的时候，后2者的效率明显高于第一种
	 */

	@Override
	public Map<String, Object> getPlusDelInfo(String eqpNo, String infoType,int currentPage,int numPerPage) {
		// HH表示24小时
		DateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		// 拼接sql字符串
		StringBuilder builder = new StringBuilder();
		builder.append("select * from MNGT_SYS.");
		builder = builder.append(infoType);
		builder.append(" where \"deviceID\" =?");
		Pagination pagination = monitorDao.queryPage(currentPage, numPerPage, builder.toString(), new Object[] { eqpNo });
		
		List<Map<String,Object>>resultList=pagination.getResultList();
		for (Map<String, Object> map : resultList) {
			if (map.get("deviceID") != null)
				map.put("eqpNo", map.get("deviceID"));
			if (map.get("timestamp") != null)
				// 将sql结果中的Timestamp 转换为 Date类型，然后再通过format格式化为日期字符串
				map.put("collectTime", dFormat.format(new Date(((Timestamp) map.get("timestamp")).getTime())));
		}
		Map<String,Object> resultMap=new HashMap<String,Object>();
		resultMap.put("resultList", resultList);
		resultMap.put("result", true);
		resultMap.put("totalRows", pagination.getTotalRows());
		return resultMap;
	}

	@Override
	public Map<String, Object> getMemStatisticsByTime(String eqpNo) {
		String sql = "SELECT HOUR(\"timestamp\"),avg(\"memUsedPercent\") from \"MNGT_SYS\".\"MEM_INFO\" where \"timestamp\">=to_char(sysdate,'yyyy-mm-dd') and \"timestamp\" < to_char(sysdate+1,'yyyy-mm-dd') and \"deviceID\" = ? group by HOUR(\"timestamp\") order by HOUR(\"timestamp\")";
		List<Map<String, Object>> statisticsList = monitorDao.findList(sql, new Object[]{eqpNo});
		DecimalFormat df=new DecimalFormat("######0.00");
		List<Object> statistics = new ArrayList<Object>();
		for (Map<String, Object> map : statisticsList) {
			statistics.add(df.format(map.get("AVG(\"memUsedPercent\")")));
		}
		String memTotalSql = "SELECT \"memTotal\" from \"MNGT_SYS\".\"MEM_INFO\" where \"deviceID\"= ?";
		List<Map<String, Object>> memTotalMapList = monitorDao.findList(memTotalSql, new Object[] { eqpNo });
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("memTotal", df.format(Long.parseLong(memTotalMapList.get(0).get("memTotal")+"") / (1024 * 1024)) + "MB");
		resultMap.put("statisticsList", statistics);
		return resultMap;
	}

	/*****************************NET_INTERFACE_STAT_INFO（2个折线图）***************************************/
	@Override
	public Map<String, Object> getIfStatStatisticsByTime1(String eqpNo) {
		String sql = "SELECT HOUR(\"timestamp\"),avg(\"rxBytes\"),avg(\"txBytes\") from \"MNGT_SYS\".\"NET_INTERFACE_STAT_INFO\" where \"timestamp\">=to_char(sysdate,'yyyy-mm-dd') and \"timestamp\" < to_char(sysdate+1,'yyyy-mm-dd') and \"deviceID\" = ? group by HOUR(\"timestamp\") order by HOUR(\"timestamp\")";
		List<Map<String, Object>> statisticsResult = monitorDao.findList(sql, new Object[]{eqpNo}); 
		
		DecimalFormat df=new DecimalFormat("######0.00");
		List<Object> statisticsRxBytes = new ArrayList<Object>();
		List<Object> statisticsTxBytes = new ArrayList<Object>();
		for (Map<String, Object> map : statisticsResult) {
			statisticsRxBytes.add(df.format(map.get("AVG(\"rxBytes\")")));
			statisticsTxBytes.add(df.format(map.get("AVG(\"txBytes\")")));
		}
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("rxBytesList", statisticsRxBytes);
		resultMap.put("txBytesList", statisticsTxBytes);
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getIfStatStatisticsByTime2(String eqpNo) {
		String sql = "SELECT HOUR(\"timestamp\"),avg(\"rxErrors\"),avg(\"txErrors\") from \"MNGT_SYS\".\"NET_INTERFACE_STAT_INFO\" where \"timestamp\">=to_char(sysdate,'yyyy-mm-dd') and \"timestamp\" < to_char(sysdate+1,'yyyy-mm-dd') and \"deviceID\" = ? group by HOUR(\"timestamp\") order by HOUR(\"timestamp\")";
		List<Map<String, Object>> statisticsResult = monitorDao.findList(sql, new Object[]{eqpNo}); 
		DecimalFormat df=new DecimalFormat("######0.00");
		List<Object> statisticsRxErrors = new ArrayList<Object>();
		List<Object> statisticsTxErrors = new ArrayList<Object>();
		for (Map<String, Object> map : statisticsResult) {
			statisticsRxErrors.add(df.format(map.get("AVG(\"rxErrors\")")));
			statisticsTxErrors.add(df.format(map.get("AVG(\"txErrors\")")));
		}
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("rxErrorsList", statisticsRxErrors);
		resultMap.put("txErrorsList", statisticsTxErrors);
		return resultMap;
	}
	
	/*****************************NET_INTERFACE_STAT_INFO（2个折线图）***************************************/
	
	
	/***
	 * SYS_STAT_INFO 用户态时间占比，核心态时间占比，1分钟平均负载，5分钟平均负载 折线图
	 */
	@Override
	public Map<String, Object> getSysStatInfoStatisticsByTime(String eqpNo) {
		String cpuUserPercentSql = "SELECT HOUR(\"timestamp\"),avg(\"cpuUserPercent\"),avg(\"cpuSysPercent\"),avg(\"sysOneMinLoad\"),avg(\"sysFiveMinLoad\") from \"MNGT_SYS\".\"SYS_STAT_INFO\" where \"timestamp\">=to_char(sysdate,'yyyy-mm-dd') and \"timestamp\" < to_char(sysdate+1,'yyyy-mm-dd') and \"deviceID\" = ? group by HOUR(\"timestamp\") order by HOUR(\"timestamp\")";
		DecimalFormat df=new DecimalFormat("######0.00");
		List<Map<String, Object>> cpuUserPercentResult = monitorDao.findList(cpuUserPercentSql, new Object[]{eqpNo});
		List<Object> cpuUserPercent = new ArrayList<Object>();
		List<Object> cpuSysPercent = new ArrayList<Object>();
		List<Object> sysOneMinLoad = new ArrayList<Object>();
		List<Object> sysFiveMinLoad = new ArrayList<Object>();
		for (Map<String, Object> map : cpuUserPercentResult) {
			cpuUserPercent.add(df.format(map.get("AVG(\"cpuUserPercent\")")));
			cpuSysPercent.add(df.format(map.get("AVG(\"cpuSysPercent\")")));
			sysOneMinLoad.add(df.format(map.get("AVG(\"sysOneMinLoad\")")));
			sysFiveMinLoad.add(df.format(map.get("AVG(\"sysFiveMinLoad\")")));
		}
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("cpuUserPercent", cpuUserPercent);
		resultMap.put("cpuSysPercent", cpuSysPercent);
		resultMap.put("sysOneMinLoad", sysOneMinLoad);
		resultMap.put("sysFiveMinLoad", sysFiveMinLoad);
		return resultMap;
	}

}
