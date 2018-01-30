package cas.iie.nsp.model;

public class TopoEdge {
/* edgeID
	areaID
	upperLevelAreaID
	startNodeID
	endNodeID
	color
	width
	edgeStatus
*/
	private int edgeID;
	private int areaID;
	private int upperLevelAreaID;
	private int startNodeID;
	private int endNodeID;
	private String color;
	private int width;
	private String edgeStatus;
	public int getEdgeID() {
		return edgeID;
	}
	public void setEdgeID(int edgeID) {
		this.edgeID = edgeID;
	}
	public int getAreaID() {
		return areaID;
	}
	public void setAreaID(int areaID) {
		this.areaID = areaID;
	}
	public int getUpperLevelAreaID() {
		return upperLevelAreaID;
	}
	public void setUpperLevelAreaID(int upperLevelAreaID) {
		this.upperLevelAreaID = upperLevelAreaID;
	}
	public int getStartNodeID() {
		return startNodeID;
	}
	public void setStartNodeID(int startNodeID) {
		this.startNodeID = startNodeID;
	}
	public int getEndNodeID() {
		return endNodeID;
	}
	public void setEndNodeID(int endNodeID) {
		this.endNodeID = endNodeID;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public String getEdgeStatus() {
		return edgeStatus;
	}
	public void setEdgeStatus(String edgeStatus) {
		this.edgeStatus = edgeStatus;
	}
	@Override
	public String toString() {
		return "TopoEdge [edgeID=" + edgeID + ", areaID=" + areaID + ", upperLevelAreaID=" + upperLevelAreaID
				+ ", startNodeID=" + startNodeID + ", endNodeID=" + endNodeID + ", color=" + color + ", width=" + width
				+ ", edgeStatus=" + edgeStatus + "]";
	}
	public TopoEdge(int edgeID, int areaID, int upperLevelAreaID, int startNodeID, int endNodeID, String color,
			int width, String edgeStatus) {
		super();
		this.edgeID = edgeID;
		this.areaID = areaID;
		this.upperLevelAreaID = upperLevelAreaID;
		this.startNodeID = startNodeID;
		this.endNodeID = endNodeID;
		this.color = color;
		this.width = width;
		this.edgeStatus = edgeStatus;
	}
	
}
