package cas.iie.nsp.dao;
import java.util.List;
import java.util.Map;

import cas.iie.nsp.page.Pagination;

public interface IBaseDao<T>
{	
	public int insertUpdate(String sql, Object[] params);
	
	public int batchDelete(String sql, final List<Object> paramsList);  
	
	public int batchInsert(String sql, final List<?> paramsList,final Class<?>  t);
	
	public Map<String, Object> find(String sql, Object[] params);
	
	public T findForObject(String sql, Object[] args, Class<T> classT);
	
	public List<Map<String, Object>> findList(String sql, Object[] params);
	
	public List<T> findListForObject(String sql, Object[] params, Class<T> tClass);
	
    public Pagination queryPage(Integer currentPage, Integer numPerPage,String sql,Object ... sqlParams);
}
