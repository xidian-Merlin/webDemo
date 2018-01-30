package cas.iie.nsp.service;

import java.util.List;
import java.util.Map;

import cas.iie.nsp.model.TopoNode;
import cas.iie.nsp.model.User;

public interface ITopoService extends IBaseService<TopoNode>
{
	/**
	 * 通过缩放层级获取某一层所有节点
	 * @param zoomLevel 缩放层级
	 * @return
	 */
	List<Map<String,Object>> findDataByZoomLevel(int zoomLevel);
	
	/**
	 * 通过缩放层级获取第3层所有节点，由于图上的第3层级所有节点的获取来自于数据库里zoomLevelID为2和3
	 * @param zoomLevel 缩放层级
	 * @return
	 */
	List<Map<String,Object>> findDataByZoomLevel3(int zoomLevel);
	
	/**
	 * 获取第二层级的某个areaID节点
	 * @param zoomLevel
	 * @param areaID
	 * @return
	 */
	List<Map<String,Object>> findDataByareaID(int areaID);
	/**
	 * 获取某一层所有节点
	 * @param param
	 * @return
	 */
	List<Map<String,Object>> findTopoNodesAll(String param);
	
	/**
	 * 获取某一层所有的边
	 * @param param
	 * @return
	 */
	List<Map<String,Object>> findTopoEdgesAll(String param);
	
	/**
	 * 获取第2层的拓扑节点
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findTopoNodes_2_All(String param);
	

	/**
	 * 获取第2层的拓扑边信息
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findTopoEdges_2_All(String param);
	
	

	/**
	 * 获取第3层的拓扑节点
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findTopoNodes_3_All(String param);

	/**
	 * 获取第3层的拓扑边信息
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findTopoEdges_3_All(String param);
	
}
