package cas.iie.nsp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface IProtocolService {
	
	/**
	 * @param heaher 消息头部
	 * @param fixedBody 消息主体的固定部分
	 * @param paramsMapList 消息主体的可变部分
	 * @return
	 */
	Map<String,Object> sendMsg(HashMap<String, Object> heaher,HashMap<String, Object> fixedBody,List<HashMap<String, Object>> paramsMapList) throws Exception;
}
