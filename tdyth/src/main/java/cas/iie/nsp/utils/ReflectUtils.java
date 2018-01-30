package cas.iie.nsp.utils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;

import cas.iie.nsp.model.User;
import cas.iie.nsp.utils.ColumnAnnotationUtils.Column;

public class ReflectUtils {
	/** 
     * 将jdbcTemplate查询的map结果集 反射生成对应的bean 
     * @param clazz 意向反射的实体.clazz 
     * @param jdbcMapResult 查询结果集
     * @return  
     * @see 
     */  
    public static <T> T reflect(Class<T> clazz, Map<String, Object> jdbcMapResult)  
    {  
        //获得  
        Field[] fields = clazz.getDeclaredFields();  
  
        //存放field和column对应关系，该关系来自于实体类的 @Column配置  
        Map<String/*field name in modelBean*/, String/*column in db*/> fieldHasColumnAnnoMap = new LinkedHashMap<String, String>();  
        Annotation[] annotations = null;  
        for (Field field : fields)  
        {  
            annotations = field.getAnnotations();  
            for (Annotation an : annotations)  
            {  
                if (an instanceof Column)  
                {  
                    Column column = (Column)an;  
                    fieldHasColumnAnnoMap.put(field.getName(), column.name());  
                }  
            }  
        }  
        //存放field name 和 对应的来自map的该field的属性值，用于后续reflect成ModelBean  
        Map<String, Object> conCurrent = new LinkedHashMap<String, Object>();  
        for (Map.Entry<String, String> en : fieldHasColumnAnnoMap.entrySet())  
        {         
            String key = en.getValue();//.toUpperCase();  
            //获得map的该field的属性值  
            Object value = jdbcMapResult.get(key);  
            //确保value有效性，防止JSON reflect时异常  
            if (value != null)  
            {  
                conCurrent.put(en.getKey(), jdbcMapResult.get(key));  
            }  
        }  
        //将json字符串转换成对象  
        return JSON.parseObject(JSON.toJSONString(conCurrent), clazz);  
    }  
  
    /**
     * 功能：将List类型的Map<String,Object> 转换为List类型的类
     * @param clazz 类名称
     * @param jdbcMapResultList 返回的数据库查询结果集
     * @return List类型的类
     */
    public static <T> List<T> getReflectList(Class<T> clazz, List<Map<String, Object>> jdbcMapResultList)
    {
    	List<T> list=new ArrayList<T>();
    	for (Map<String, Object> map : jdbcMapResultList) {
    		list.add(reflect(clazz,map));
		}
    	return list;
    }
    
   
    /**
     * 测试
     * @param args
     * @throws Exception
     */
    public static void main(String[] args)  
        throws Exception  
    {              
        //call reflect testing  
        Map<String, Object> jdbcMapResult = new HashMap<>();  
        jdbcMapResult.put("userId", "1");  
        jdbcMapResult.put("userName", "reflect123456");  
        jdbcMapResult.put("userName1", "123"); 
          
        System.out.println(ReflectUtils.reflect(User.class, jdbcMapResult));  
    }  
}
