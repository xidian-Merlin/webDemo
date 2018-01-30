package cas.iie.nsp.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cas.iie.nsp.dao.ITopoDao;
import cas.iie.nsp.model.TopoNode;
import cas.iie.nsp.model.User;
import cas.iie.nsp.service.ITopoService;

@Service("topoServiceImpl")
public class TopoServiceImpl extends BaseServiceImpl<TopoNode> implements ITopoService
{
	@Autowired 
	ITopoDao topoDao;
	@Override
	public List<Map<String, Object>> findTopoNodesAll(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql, null);
	}
	@Override    
	public List<Map<String, Object>> findTopoEdgesAll(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql,null);
	}
	
	@Override
	public List<Map<String, Object>> findTopoNodes_2_All(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql, null);
	}
	@Override
	public List<Map<String, Object>> findTopoEdges_2_All(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql,null);
	}
	@Override
	public List<Map<String, Object>> findTopoNodes_3_All(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql, null);
	}
	@Override
	public List<Map<String, Object>> findTopoEdges_3_All(String param) {
		String sql = "select * from TEST_TOPO_ONETBL.TOPOLONODE where 1=1" ;
		return topoDao.findList(sql,null);
	}
	@Override
	public List<Map<String, Object>> findDataByZoomLevel(int zoomLevel) {
		//String sql = "select * from SYSDBA.TOPOLONODE_COPY where \"zoomLevelID\"=?" ;
		String sql = "select * from MNGT_SYS.TOPOLONODE where \"zoomLevelID\"=?" ;
	    return topoDao.findList(sql,new Object[]{zoomLevel});
	}
	@Override
	public List<Map<String, Object>> findDataByareaID(int upperLevelAreaID) {
		//String sql = "select * from SYSDBA.TOPOLONODE_COPY where \"upperLevelAreaID\"=? and \"zoomLevelID\"=2 ";
		String sql = "select * from MNGT_SYS.TOPOLONODE where \"upperLevelAreaID\"=? and \"zoomLevelID\"=2 ";
	    return topoDao.findList(sql,new Object[]{upperLevelAreaID});
	}
	@Override
	public List<Map<String, Object>> findDataByZoomLevel3(int zoomLevel) {
		//String sql = "select * from SYSDBA.TOPOLONODE_COPY where \"zoomLevelID\"=2 or \"zoomLevelID\"=3" ;
		String sql = "select * from MNGT_SYS.TOPOLONODE where \"zoomLevelID\"=2 or \"zoomLevelID\"=3" ;
	    return topoDao.findList(sql,null);
	}
}
