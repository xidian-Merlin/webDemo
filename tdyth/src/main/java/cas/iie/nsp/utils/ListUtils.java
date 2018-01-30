package cas.iie.nsp.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListUtils {
	/**
	 * 
	 * @param list 查询到的数据记录
	 * @param itemName 字段名字
	 * @return 返回统计好的各个元素的出现次数
	 */
	public static Map<String,Object> countRepeatedItem(List<Map<String,Object>> list ,String itemName) {
		
		Map<String,Object> mapResult=new HashMap<String,Object>();
		List<Integer> itemList= new ArrayList<Integer>();
		for (Map<String, Object> map : list) {
			itemList.add((Integer)map.get(itemName));
		}
		for (Integer item : itemList) {
			mapResult.put(item+"",Collections.frequency(itemList,item));
		}
		System.out.println("mapResult===>"+mapResult.toString());
		return mapResult;
	}

	public static void main(String[] args) {
		List<Map<String, Object>>list=new ArrayList<Map<String,Object>>();
		Map<String, Object> map1=new HashMap<String,Object>();
		map1.put("123", 1);
		for(int i=0;i<100;i++)
			list.add(map1);
		
		Map<String, Object> map2=new HashMap<String,Object>();
		map2.put("123", 2);
		for(int i=0;i<100;i++)
			list.add(map2);
		
		Map<String, Object> map3=new HashMap<String,Object>();
		map3.put("123", 2);
		for(int i=0;i<500;i++)
			list.add(map3);
		
		countRepeatedItem(list,"123");
	}
}
