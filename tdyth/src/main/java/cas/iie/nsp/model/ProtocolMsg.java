package cas.iie.nsp.model;

import java.util.HashMap;
import java.util.List;

public class ProtocolMsg {
	private HashMap<String, Object> heaher;
	private HashMap<String, Object> fixedBody;
	private List<HashMap<String, Object>> paramsMapList;
	public HashMap<String, Object> getHeaher() {
		return heaher;
	}
	public void setHeaher(HashMap<String, Object> heaher) {
		this.heaher = heaher;
	}
	public HashMap<String, Object> getFixedBody() {
		return fixedBody;
	}
	public void setFixedBody(HashMap<String, Object> fixedBody) {
		this.fixedBody = fixedBody;
	}
	public List<HashMap<String, Object>> getParamsMapList() {
		return paramsMapList;
	}
	public void setParamsMapList(List<HashMap<String, Object>> paramsMapList) {
		this.paramsMapList = paramsMapList;
	}
	@Override
	public String toString() {
		return "ProtocolMsg [heaher=" + heaher + ", fixedBody=" + fixedBody + ", paramsMapList=" + paramsMapList + "]";
	}
	public ProtocolMsg(HashMap<String, Object> heaher, HashMap<String, Object> fixedBody,
			List<HashMap<String, Object>> paramsMapList) {
		super();
		this.heaher = heaher;
		this.fixedBody = fixedBody;
		this.paramsMapList = paramsMapList;
	}
	public ProtocolMsg() {
		super();
	}
}
