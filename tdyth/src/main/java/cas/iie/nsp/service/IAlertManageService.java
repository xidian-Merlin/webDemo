package cas.iie.nsp.service;

import java.util.List;
import java.util.Map;

public interface IAlertManageService extends IBaseService<Object> {
	
	/*********************************************告警类型***************************************************/
	/**
	 * 告警类型列表
	 * @param currentPage 当前页数
	 * @param numPerPage 每页大小
	 * operateType :1表示显示所有的告警类型列表；2表示只显示基本告警类型列表
	 */
	Map<String,Object> getAlertTypeList(int operateType,int currentPage, int numPerPage);
	
	/**
	 * 告警类型新增,编辑
	 * @param operateType 操作类型 ,当operateType为新增时
	 * @param alertTypeId  告警类型id
	 * @param typeName 告警类型名字
	 * @param description 告警类型描述
	 * @param mixType 是否为混合类型，0表示否，1表示是
	 * @param mixTypeValue 混合类型的值，字符串表示，以英文逗号“,”隔开
	 * @return true或者false
	 */
	public boolean alertTypeModify(int operateType,int alertTypeId,String typeName,String description,int mixType,String mixTypeValue);
	
	/**
	 * 告警类型删除（批量删除）
	 * @param alertTypeIds 告警类型id组成的字符串
	 * @return true或者false
	 */
	public boolean alertTypeDelete(String alertTypeIds);
	
	
	/**
	 * 获取当前表中的最大id值
	 * @return 当前表中的最大id
	 */
	public Integer getAlertTypeMaxId();
	
	
	
	
	
	/*********************************************告警统计***************************************************/
	
	/**
	 * 柱状图基本数据结构示例:
	 * data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
	 * 
	 * 饼状图基本数据结构示例:
	 * data:[
     *           {value:335, name:'直接访问'},
     *           {value:310, name:'邮件营销'},
     *           {value:234, name:'联盟广告'},
     *           {value:135, name:'视频广告'},
     *           {value:1548, name:'搜索引擎'}
     *     ]
     *      
	 * 折线图基本数据结构示例:
	 * data:[11, 11, 15, 13, 12, 13, 10]
	 */
	/******************告警******************/
	/**
	 * 告警类别统计（柱状图）
	 */
	 Map<String,Object> getAlertTypeStatistics();
	
	/**
	 * 告警紧急程度统计（饼状图）
	 */
	Map<String,Object> getAlertUrgentStatistics();
	
	
	
	/**
	 * 基于时间的告警统计（横坐标为24小时，纵坐标为数量）
	 */
	List<Object> getAlertStatisticsByTime();
	
	
	/******************事件******************/
	/**
	 *事件类别统计（饼状图）
	 */
	Map<String,Object> getEventTypeStatistics();
	
	/**
	 * 事件级别统计（饼状图）
	 */
	Map<String,Object> getEventRankStatistics();
	
	/**
	 *基于时间的事件统计（横坐标为24小时，纵坐标为数量）
	 */
	List<Object> getEventStatisticsByTime();
	
	
	/*********************************************告警列表页面***************************************************/
	/**
	 * 获取告警信息列表
	 * @param currentPage
	 * @param numPerPage
	 * @return
	 */
	Map<String, Object> getAlertList(int currentPage, int numPerPage);
	
	/**
	 * 获取当前告警的详细信息
	 * @param alertID
	 * @return
	 */
	Map<String, Object> getAlertDelInfo(int currentPage, int numPerPage,int alertID);
}
