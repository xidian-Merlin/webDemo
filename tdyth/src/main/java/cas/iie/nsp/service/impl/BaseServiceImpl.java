package cas.iie.nsp.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import cas.iie.nsp.dao.IBaseDao;
import cas.iie.nsp.service.IBaseService;

public class BaseServiceImpl<T> implements IBaseService<T> {
	@Autowired
	IBaseDao<T> baseDao;

	@Override
	public T findForObject(String sql, Object[] args, Class<T> classT) {
		return baseDao.findForObject(sql, args, classT);
	}

	@Override
	public Map<String, Object> find(String sql, Object[] params) {
		return baseDao.find(sql, params);
	}

	@Override
	public List<Map<String, Object>> findList(String sql, Object[] params) {
		return baseDao.findList(sql, params);
	}

	@Override
	public List<T> findListForObject(String sql, Object[] params, Class<T> tClass) {
		return baseDao.findListForObject(sql, params, tClass);
	}

	@Override
	public int update(String sql, Object[] params) {
		return baseDao.insertUpdate(sql, params);
	}   

	@Override
	public int insert(String sql, Object[] params) {
		 return baseDao.insertUpdate(sql, params);
	}

	@Override
	public int batchDelete(String sql, List<Object> params) {
		 return baseDao.batchDelete(sql, params);
	}
}
