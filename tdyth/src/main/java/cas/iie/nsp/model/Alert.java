package cas.iie.nsp.model;

import java.sql.Timestamp;

import cas.iie.nsp.utils.ColumnAnnotationUtils.Column;

/**
 * "id"			INTEGER IDENTITY(1,1) NOT NULL,
	"reportTime"	TIMESTAMP(4) NOT NULL,
	"startTime"		TIMESTAMP(4),
	"lastTime"		TIMESTAMP(4),
	"reportLevel"	INTEGER NOT NULL,
	"confidence"	NUMBER(2, 2) NOT NULL, 
	"seriousLevel"	INTEGER	NOT NULL, 
	"ugentLevel"	INTEGER	NOT NULL, 
	"assetType"	INTEGER,
	"targetAssets"	VARCHAR(50), 
	"alertTypeID"	INTEGER NOT NULL,
	"alertProc"	INTEGER,
	"attackSource"	VARCHAR(50),
	"alertRegion"	VARCHAR(256), 
	"strategy"		VARCHAR(256),
	"isSolve"		NUMBER(1),
 * @author chenpx
 *
 */
public class Alert {
	@Column(name="id")
	private Integer id;
	@Column(name="reportTime")
	private Timestamp reportTime;
	@Column(name="startTime")
	private Timestamp startTime;
	@Column(name="lastTime")
	private Timestamp lastTime;
	@Column(name="reportLevel")
	private int reportLevel;
	@Column(name="confidence")
	private int confidence;
	@Column(name="seriousLevel")
	private int seriousLevel;
	@Column(name="ugentLevel")
	private int ugentLevel;
	@Column(name="assetType")
	private int assetType;
	@Column(name="targetAssets")
	private String targetAssets;
	@Column(name="alertProc")
	private int alertProc;
	@Column(name="alertTypeID")
	private int alertTypeID;
	@Column(name="attackSource")
	private String attackSource;
	@Column(name="alertRegion")
	private String alertRegion;
	@Column(name="strategy")
	private String strategy;
	@Column(name="isSolve")
	private int isSolve;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Timestamp getReportTime() {
		return reportTime;
	}
	public void setReportTime(Timestamp reportTime) {
		this.reportTime = reportTime;
	}
	public Timestamp getStartTime() {
		return startTime;
	}
	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	public Timestamp getLastTime() {
		return lastTime;
	}
	public void setLastTime(Timestamp lastTime) {
		this.lastTime = lastTime;
	}
	public int getReportLevel() {
		return reportLevel;
	}
	public void setReportLevel(int reportLevel) {
		this.reportLevel = reportLevel;
	}
	public int getConfidence() {
		return confidence;
	}
	public void setConfidence(int confidence) {
		this.confidence = confidence;
	}
	public int getSeriousLevel() {
		return seriousLevel;
	}
	public void setSeriousLevel(int seriousLevel) {
		this.seriousLevel = seriousLevel;
	}
	public int getUgentLevel() {
		return ugentLevel;
	}
	public void setUgentLevel(int ugentLevel) {
		this.ugentLevel = ugentLevel;
	}
	public int getAssetType() {
		return assetType;
	}
	public void setAssetType(int assetType) {
		this.assetType = assetType;
	}
	public String getTargetAssets() {
		return targetAssets;
	}
	public void setTargetAssets(String targetAssets) {
		this.targetAssets = targetAssets;
	}
	public int getAlertProc() {
		return alertProc;
	}
	public void setAlertProc(int alertProc) {
		this.alertProc = alertProc;
	}
	public int getAlertTypeID() {
		return alertTypeID;
	}
	public void setAlertTypeID(int alertTypeID) {
		this.alertTypeID = alertTypeID;
	}
	public String getAttackSource() {
		return attackSource;
	}
	public void setAttackSource(String attackSource) {
		this.attackSource = attackSource;
	}
	public String getAlertRegion() {
		return alertRegion;
	}
	public void setAlertRegion(String alertRegion) {
		this.alertRegion = alertRegion;
	}
	public String getStrategy() {
		return strategy;
	}
	public void setStrategy(String strategy) {
		this.strategy = strategy;
	}
	public int getIsSolve() {
		return isSolve;
	}
	public void setIsSolve(int isSolve) {
		this.isSolve = isSolve;
	}
	@Override
	public String toString() {
		return "Alert [id=" + id + ", reportTime=" + reportTime + ", startTime=" + startTime + ", lastTime=" + lastTime
				+ ", reportLevel=" + reportLevel + ", confidence=" + confidence + ", seriousLevel=" + seriousLevel
				+ ", ugentLevel=" + ugentLevel + ", assetType=" + assetType + ", targetAssets=" + targetAssets
				+ ", alertProc=" + alertProc + ", alertTypeID=" + alertTypeID + ", attackSource=" + attackSource
				+ ", alertRegion=" + alertRegion + ", strategy=" + strategy + ", isSolve=" + isSolve + "]";
	}
	public Alert(Integer id, Timestamp reportTime, Timestamp startTime, Timestamp lastTime, int reportLevel,
			int confidence, int seriousLevel, int ugentLevel, int assetType, String targetAssets, int alertProc,
			int alertTypeID, String attackSource, String alertRegion, String strategy, int isSolve) {
		super();
		this.id = id;
		this.reportTime = reportTime;
		this.startTime = startTime;
		this.lastTime = lastTime;
		this.reportLevel = reportLevel;
		this.confidence = confidence;
		this.seriousLevel = seriousLevel;
		this.ugentLevel = ugentLevel;
		this.assetType = assetType;
		this.targetAssets = targetAssets;
		this.alertProc = alertProc;
		this.alertTypeID = alertTypeID;
		this.attackSource = attackSource;
		this.alertRegion = alertRegion;
		this.strategy = strategy;
		this.isSolve = isSolve;
	}
}
