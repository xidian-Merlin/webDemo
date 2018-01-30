package cas.iie.nsp.service;

import java.util.List;
import java.util.Map;

public interface IBaseService<T> {

	/**
	 * 查询单个对象
	 * @param sql
	 * @param args
	 * @param classT
	 * @return
	 */
	T findForObject(String sql, Object[] args, Class<T> classT);
	
	
	/**
	 * 查询单个记录的字段属性值
	 * @param sql
	 * @param params
	 * @return
	 */
	Map<String, Object> find(String sql, Object[] params);
	
	
	/**
	 * 查询List形式的记录字段属性值
	 * @param sql
	 * @param params
	 * @return
	 */
	List<Map<String, Object>> findList(String sql, Object[] params);
	
	/**
	 * 查询List形式的对象
	 * @param sql
	 * @param params
	 * @param tClass
	 * @return
	 */
	List<T> findListForObject(String sql, Object[] params, Class<T> tClass);
	
	/**
	 * 更新记录
	 * @param sql
	 * @param params
	 * @return
	 */
	int update(String sql, Object[] params);

	/**
	 * 新建记录
	 * @param sql
	 * @param params
	 * @return
	 */
	int insert(String sql, Object[] params);

	/**
	 * 删除记录
	 * @param sql
	 * @param params
	 * @return
	 */
	int batchDelete(String sql, List<Object> params);

}
