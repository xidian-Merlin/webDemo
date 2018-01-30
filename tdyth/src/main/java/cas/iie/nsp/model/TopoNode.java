package cas.iie.nsp.model;

public class TopoNode {
	private int nodeID;
	private String eqpNo;
	private int areaID;
	private int upperLevelAreaID;
	private String eqpType;
	private String nodeRemark;
	private String nodeName;
	private int locationX;
	private int locationY;
	private int isFixed;
	
	
	public TopoNode(int nodeID, String eqpNo, int areaID, int upperLevelAreaID, String eqpType, String nodeRemark,
			String nodeName, int locationX, int locationY, int isFixed) {
		super();
		this.nodeID = nodeID;
		this.eqpNo = eqpNo;
		this.areaID = areaID;
		this.upperLevelAreaID = upperLevelAreaID;
		this.eqpType = eqpType;
		this.nodeRemark = nodeRemark;
		this.nodeName = nodeName;
		this.locationX = locationX;
		this.locationY = locationY;
		this.isFixed = isFixed;
	}
	public int getNodeID() {
		return nodeID;
	}
	public void setNodeID(int nodeID) {
		this.nodeID = nodeID;
	}
	public String getEqpNo() {
		return eqpNo;
	}
	public void setEqpNo(String eqpNo) {
		this.eqpNo = eqpNo;
	}
	public int getAreaID() {
		return areaID;
	}
	public void setAreaID(int areaID) {
		this.areaID = areaID;
	}
	public String getEqpType() {
		return eqpType;
	}
	public void setEqpType(String eqpType) {
		this.eqpType = eqpType;
	}
	public String getNodeRemark() {
		return nodeRemark;
	}
	public void setNodeRemark(String nodeRemark) {
		this.nodeRemark = nodeRemark;
	}
	public String getNodeName() {
		return nodeName;
	}
	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}
	public int getLocationX() {
		return locationX;
	}
	public void setLocationX(int locationX) {
		this.locationX = locationX;
	}
	public int getLocationY() {
		return locationY;
	}
	public void setLocationY(int locationY) {
		this.locationY = locationY;
	}
	public int getIsFixed() {
		return isFixed;
	}
	public void setIsFixed(int isFixed) {
		this.isFixed = isFixed;
	}
	public int getUpperLevelAreaID() {
		return upperLevelAreaID;
	}
	public void setUpperLevelAreaID(int upperLevelAreaID) {
		this.upperLevelAreaID = upperLevelAreaID;
	}
	@Override
	public String toString() {
		return "TopoNode [nodeID=" + nodeID + ", eqpNo=" + eqpNo + ", areaID=" + areaID + ", upperLevelAreaID="
				+ upperLevelAreaID + ", eqpType=" + eqpType + ", nodeRemark=" + nodeRemark + ", nodeName=" + nodeName
				+ ", locationX=" + locationX + ", locationY=" + locationY + ", isFixed=" + isFixed + "]";
	}
	
	
}
