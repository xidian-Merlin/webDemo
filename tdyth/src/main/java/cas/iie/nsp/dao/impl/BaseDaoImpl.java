package cas.iie.nsp.dao.impl;

import java.util.List;
import java.lang.reflect.Field;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import cas.iie.nsp.dao.IBaseDao;
import cas.iie.nsp.page.Pagination;

/**
 * 泛型通用dao实现 依赖于spring jdbc
 */
public class BaseDaoImpl<T> implements IBaseDao<T> {
	@Autowired
	JdbcTemplate jdbcTemplate;

	/**
	 * @param sql
	 * @param args
	 * @param classT
	 *            注意该参数，jdbcTemplate.queryForObject传入的不能是自定义的classType，
	 *            如果是自定义的，需要经过new
	 *            BeanPropertyRowMapper<T>(classT)转换，默认支持的只有比如String，int等类型
	 * @param <T>
	 * @return 返回以对象的方式返回一条记录
	 */
	@Override
	public T findForObject(String sql, Object[] args, Class<T> classT) {
		if (sql == null || sql.length() <= 0) {
			return null;
		}
		if (args == null || args.length <= 0) {
			return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<T>(classT));
		}
		return jdbcTemplate.queryForObject(sql, args, new BeanPropertyRowMapper<T>(classT));
	}

	/**
	 * @param sql
	 * @param args
	 * @return 以Map<String, Object>的方式返回一条记录，<"字段名"，值>
	 */
	@Override
	public Map<String, Object> find(String sql, Object[] params) {
		return jdbcTemplate.queryForMap(sql, params);
	}

	/**
	 * @param sql
	 * @param params
	 * @return 返回表里面的多行row数据的字段 eg: 使用(Long)(row.get("USER_ID"))获取数据
	 */
	@Override
	public List<Map<String, Object>> findList(String sql, Object[] params) {
		return jdbcTemplate.queryForList(sql, params);
	}

	/**
	 * @param sql
	 * @param params
	 * @param tClass
	 *            对象类型
	 * @return 以List的方式对象
	 */
	@Override
	public List<T> findListForObject(String sql, Object[] params, Class<T> tClass) {
		List<T> resultList = null;
		try {
			if (params != null && params.length > 0)
				resultList = jdbcTemplate.query(sql, params, new BeanPropertyRowMapper<T>(tClass));
			else
				// BeanPropertyRowMapper是自动映射实体类的
				resultList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<T>(tClass));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultList;
	}
	
	
	/**
	 * 新建，更新
	 */
	@Override
	public int insertUpdate(String sql, Object[] params) {
		int affectRows=0;
		try {
			affectRows=jdbcTemplate.update(sql, params);
		} catch (DataAccessException e) {
			affectRows=-1;
		}
		return affectRows;
	}
	
	/**
	 * 批量更新，删除
	 * 
	 * @author cpx
	 * @since 2017-9-11
	 * @param sql
	 * @param paramsList
	 * @return 返回受到影响的记录数组
	 */
	@Override
	public int batchDelete(String sql, final List<Object> paramsList) {
		int result = 1;
		int[] affectedRowNum ;
		try {
			affectedRowNum = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
				@Override
				public void setValues(PreparedStatement ps, int index) throws SQLException {
					//setObject中，第一个参数为？的index值，如果只有一个？,则可直接设置为1
					ps.setObject(1, paramsList.get(index));
				}
				@Override
				public int getBatchSize() {
					return paramsList.size();
				}
			});
			if(affectedRowNum.length>0)
				result=1;
		} catch (Exception e) {
			e.printStackTrace();
			result = -1;
		}
		return result;
	}

	/**
	 * 批量更新，删除
	 * 
	 * @author cpx
	 * @since 2017-9-11
	 * @param sql
	 * @param paramsList
	 * @return 返回受到影响的记录数组
	 */
	@Override
	public int  batchInsert(String sql, final List<?> paramsList,final Class<?> clazz) {
		int result = 1;
		int[] affectedRowNum ;
		try {
			affectedRowNum = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
				@Override
				public void setValues(PreparedStatement ps, int index) throws SQLException {
					Field[] fields=clazz.getDeclaredFields();
					//setObject中，第一个参数为？的index值，如果只有一个？,则可直接设置为1
					for(int i=0;i<fields.length;i++)
						try {  
							fields[i].setAccessible(true);
							ps.setObject(1+i, fields[i].get(paramsList.get(index)));
						} catch (IllegalArgumentException | IllegalAccessException e) {
							e.printStackTrace();
						}
				} 
				@Override
				public int getBatchSize() {
					return paramsList.size();
				}
			});
			if(affectedRowNum.length>0)
				result=1;
		} catch (Exception e) {
			e.printStackTrace();
			result = -1;
		}
		return result;
	}
	/**
	 * 分页查询
	 * 
	 * @author cpx
	 * @since 2017-11-06 tabName 要查询的数据库表名 sqlParams 查询条件 currentPage当前页数
	 *        numPerPage每页记录数
	 */
	@Override
	public Pagination queryPage(Integer currentPage, Integer numPerPage, String sql, Object... sqlParams) {
		// 这里需要特殊考虑sqlParams为null的情况
		// 即使传给queryPage的sqlParams为null,由于某种原因，任然会为sqlParams分配内存使得这里的sqlParams不为null
		if (sqlParams != null) {
			for (Object object : sqlParams) {
				if (object == null)
					sqlParams = null;
			}
		}
		Pagination page = new Pagination(currentPage, numPerPage, jdbcTemplate, sql, sqlParams);
		return page;
	}

}
