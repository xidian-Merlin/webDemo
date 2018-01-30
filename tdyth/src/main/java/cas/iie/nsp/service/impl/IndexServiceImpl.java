package cas.iie.nsp.service.impl;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cas.iie.nsp.dao.IIndexDao;
import cas.iie.nsp.model.Index;
import cas.iie.nsp.service.IIndexService;



@Service("indexServiceImpl")
public class IndexServiceImpl extends BaseServiceImpl<Index> implements IIndexService
{
	@Autowired
	IIndexDao IndexDao;
	@Override
	public Map<String, Object> findUserByName(String param) {
		String sql = "select * from sysdba.myuser where username = ?" ;
		return IndexDao.find(sql, new Object[]{param});
	}	
	
	
}
