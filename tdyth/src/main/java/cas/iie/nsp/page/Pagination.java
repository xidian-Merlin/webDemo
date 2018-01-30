package cas.iie.nsp.page;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;

public class Pagination {
	public static final int NUMBERS_PER_PAGE = 10;
	//一页显示的记录数
	 private int numPerPage; 
	//记录总数
	 private int totalRows; 
	//总页数
	 private int totalPages; 
	//当前页码
	 private int currentPage; 
	 //起始行数
	 private int startIndex;
	 //结果集存放在List
	 private List<Map<String,Object>> resultList;
	 
	 private JdbcTemplate jdbcTemplate;
	 
	 /**分页构造函数
	  * @param tabName 数据库表名
	  * @param sqlParams 查询条件
	  * @param currentPage 当前页
	  * @param numPerPage 每页记录数
	  * @param jdbcTemplate JdbcTemplate实例
	  */
	 public Pagination(int currentPage,int numPerPage,JdbcTemplate jdbcTemplate,String sql,Object ...params){
	   if(jdbcTemplate == null){
	     throw new IllegalArgumentException("jdbcTemplate 未初始化...");
	   }
	   if(sql==null)
		   throw new IllegalArgumentException("sql语句未初始化...");
	   //设置每页显示记录数
	   setNumPerPage(numPerPage);
	   //设置要显示的页数
	   setCurrentPage(currentPage);
	   //计算总记录数
	   StringBuffer totalSQL = new StringBuffer("select count(*) from (");
	   totalSQL.append(sql);
	   totalSQL.append(" ) ");
	   //给JdbcTemplate赋值
	   setJdbcTemplate(jdbcTemplate);
	   //总记录数
	   setTotalRows(getJdbcTemplate().queryForObject(totalSQL.toString(), params,Integer.class));
	   //计算总页数
	   setTotalPages();
	   //计算起始行数
	   setStartIndex();
	   //装入结果集
	   setResultList(getJdbcTemplate().queryForList(getMySQLPageSQL(startIndex,numPerPage,sql),params));
	 }
	 


	/**
	* 构造数据分页SQL 
	* @param queryString 拼接好的sql查询语句
	* @param startIndex  开始查询的记录数
	* @param pageSize 每页大小
	* @return
	*/
	public String getMySQLPageSQL(Integer startIndex, Integer pageSize,String sql)
	{
		String result=null;
		if (null != startIndex && null != pageSize){
			result = sql+" limit " + startIndex + "," + pageSize;
		} else{
			throw new IllegalArgumentException("startIndex和pageSize参数未初始化...");
		}
		return result;
	}

	 public int getCurrentPage() {
	   return currentPage;
	 } 

	 public void setCurrentPage(int currentPage) {
	   this.currentPage = currentPage;
	 }

	 public int getNumPerPage() {
	   return numPerPage;
	 }

	 public void setNumPerPage(int numPerPage) {
	   this.numPerPage = numPerPage;
	 }

	 public List<Map<String,Object>> getResultList() {
	   return resultList;
	 }

	 public void setResultList(List<Map<String,Object>> resultList) {
	   this.resultList = resultList;
	 }

	 public int getTotalPages() {
	   return totalPages;
	 }
	//计算总页数
	 public void setTotalPages() {
	   if(totalRows % numPerPage == 0){
	     this.totalPages = totalRows / numPerPage;
	   }else{
	     this.totalPages = (totalRows / numPerPage) + 1;
	   }
	 }

	 public int getTotalRows() {
	   return totalRows;
	 }

	 public void setTotalRows(int totalRows) {
	   this.totalRows = totalRows;
	 }

	 public int getStartIndex() {
	   return startIndex;
	 }

	 public void setStartIndex() {
	   this.startIndex = (currentPage - 1) * numPerPage;
	 }

	 public JdbcTemplate getJdbcTemplate() {
	   return jdbcTemplate;
	 }

	 public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
	   this.jdbcTemplate = jdbcTemplate;
	 }
}
