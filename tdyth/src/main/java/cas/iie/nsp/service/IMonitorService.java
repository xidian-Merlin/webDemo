package cas.iie.nsp.service;

import java.util.List;
import java.util.Map;

import cas.iie.nsp.model.Eqp;

/**
 * @author chenpx
 */
public interface IMonitorService extends IBaseService<Eqp> {
	
	/**
	 * 功能：获取左侧的preview树形结构目录
	 * @param type :安全域和资产类型
	 * 返回值：id 当前结点的id，parentId 父节点的id，name 节点名称
	 */
	List<Map<String, Object>> getPreInfo(String type);
	
	/**
	 * 功能：获取右侧设备的详细列表
	 * @param type 资产设备的类型，是class大类，还是type小类
	 * @param id 类型的id
	 * 返回值：
	 */
	Map<String,Object> getDelInfo(String tabType, String type, Integer id, int currentPage, int numPerPage);
	
	
	/**
	 * 功能：获取点击加号之后的该设备上的监控属性列表
	 * @param eqpNo：设备编号
	 * @return
	 */
	List<Map<String, Object>> getPlusPreInfo(String eqpNo);
	
	/**
	 * 功能：获取点击图标显示详细信息列表
	 * @param eqpNo：设备编号
	 * @return
	 */
	Map<String, Object> getPlusDelInfo(String eqpNo, String infoType,int currentPage,int numPerPage);
	
	
	/**
	 * 功能：获取基于时间的内存统计折线图
	 * @param eqpNo：设备编号
	 * @return
	 */
	Map<String, Object> getMemStatisticsByTime(String eqpNo);
	
	/**
	 * 功能：
	 * 折线统计图 NET_INTERFACE_STAT_INFO（网络接口状态表），按接口+rxBytes、接口+txBytes显示多条折现统计图，
	 * 横轴时间
	 * 纵轴单位是字节
	 * @param eqpNo：设备编号
	 * @return
	 */
	Map<String, Object> getIfStatStatisticsByTime1(String eqpNo);
	
	/**
	 * 功能：
	 * 折线统计图 NET_INTERFACE_STAT_INFO（网络接口状态表）接受的错误包数、传送的错误包数显示多条折现统计图，
	 * 横轴时间
	 * 纵轴单位是个数
	 * @param eqpNo：设备编号
	 * @return
	 */
	Map<String, Object> getIfStatStatisticsByTime2(String eqpNo);
	
	/**
	 * 功能：
	 * 折线统计图 SYS_STAT_INFO(用户态时间占比，核心态时间占比，1分钟平均负载，5分钟平均负载)
	 * 横轴时间
	 * @param eqpNo：设备编号
	 * @return
	 */
	Map<String, Object> getSysStatInfoStatisticsByTime(String eqpNo);

}
