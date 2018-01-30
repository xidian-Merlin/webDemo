package cas.iie.nsp.model;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class Configuration {

	public static final List<ConcurrentHashMap<String, Object>> list = new ArrayList<ConcurrentHashMap<String, Object>>();
	public static final ConcurrentHashMap<String, Object> protocolParams1 = new ConcurrentHashMap<String, Object>();
	public static final ConcurrentHashMap<String, Object> protocolParams2 = new ConcurrentHashMap<String, Object>();
	public static final ConcurrentHashMap<String, Object> protocolParams3 = new ConcurrentHashMap<String, Object>();
	public static final ConcurrentHashMap<String, Object> protocolParams5 = new ConcurrentHashMap<String, Object>();
	public static final ConcurrentHashMap<String, Object> protocolParams6 = new ConcurrentHashMap<String, Object>();

	/*
	 * 表1-1
	 */
	static {
		protocolParams1.put("1", byte.class);
		protocolParams1.put("2", byte.class);
		protocolParams1.put("3", String.class);
		protocolParams1.put("4", String.class);
		protocolParams1.put("5", byte.class);
		list.add(protocolParams1);
		/*
		 * 表1-2
		 */
		protocolParams2.put("1", byte.class);
		protocolParams2.put("2", byte[].class);
		protocolParams2.put("3", byte[].class);
		protocolParams2.put("4", byte[].class);
		protocolParams2.put("5", byte[].class);
		protocolParams2.put("6", byte[].class);
		protocolParams2.put("7", byte[].class);
		protocolParams2.put("8", byte[].class);
		protocolParams2.put("9", byte[].class);
		protocolParams2.put("10", int.class);
		protocolParams2.put("11", int.class);
		protocolParams2.put("12", int.class);
		protocolParams2.put("13", int.class);
		protocolParams2.put("14", byte.class);
		protocolParams2.put("15", String.class);
		protocolParams2.put("16", String.class);
		protocolParams2.put("17", String.class);
		protocolParams2.put("18", String.class);
		protocolParams2.put("19", byte.class);
		///////////////////////////// TODO 需要确定长度
		protocolParams2.put("20", int.class);
		protocolParams2.put("21", int.class);
		protocolParams2.put("22", int.class);
		/////////////////////////////
		protocolParams2.put("23", String.class);
		protocolParams2.put("24", String.class);
		protocolParams2.put("25", byte.class);
		list.add(protocolParams2);
		/*
		 * 表1-3
		 */
		protocolParams3.put("1", int.class);
		protocolParams3.put("2", int.class);
		protocolParams3.put("3", int.class);
		list.add(protocolParams3);
		/*
		 * 表1-5
		 */
		protocolParams5.put("1", String.class);
		protocolParams5.put("2", byte[].class);
		protocolParams5.put("3", byte[].class);
		list.add(protocolParams5);
		/*
		 * 表1-6
		 */
		protocolParams6.put("1", String.class);
		protocolParams6.put("2", byte[].class);
		list.add(protocolParams6);
	}
}
