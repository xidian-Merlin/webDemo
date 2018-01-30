package cas.iie.nsp.model;

import cas.iie.nsp.utils.ColumnAnnotationUtils.Column;

public class Monitor {
	@Column(name="eqpNo")
	private String eqpNo;
	@Column(name="eqpID")
	private String eqpID;
	@Column(name="name")
	private String name;
	@Column(name="assetType")
	private String assetType;
	@Column(name="assetValue")
	private int assetValue;
	@Column(name="securityDomain")
	private String securityDomain; 
	@Column(name="workMode")
	private int workMode;
	@Column(name="manageMode")
	private int manageMode;
	@Column(name="os")
	private String os;
	@Column(name="account")
	private String account;
	@Column(name="pass")
	private String pass;
	@Column(name="ip")
	private String ip;
	@Column(name="location")
	private String location;
	@Column(name="serial")
	private String serial;
	@Column(name="contaction")
	private String contaction;
	public String getEqpNo() {
		return eqpNo;
	}
	public void setEqpNo(String eqpNo) {
		this.eqpNo = eqpNo;
	}
	public String getEqpID() {
		return eqpID;
	}
	public void setEqpID(String eqpID) {
		this.eqpID = eqpID;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAssetType() {
		return assetType;
	}
	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}
	public int getAssetValue() {
		return assetValue;
	}
	public void setAssetValue(int assetValue) {
		this.assetValue = assetValue;
	}
	public String getSecurityDomain() {
		return securityDomain;
	}
	public void setSecurityDomain(String securityDomain) {
		this.securityDomain = securityDomain;
	}
	public int getWorkMode() {
		return workMode;
	}
	public void setWorkMode(int workMode) {
		this.workMode = workMode;
	}
	public int getManageMode() {
		return manageMode;
	}
	public void setManageMode(int manageMode) {
		this.manageMode = manageMode;
	}
	public String getOs() {
		return os;
	}
	public void setOs(String os) {
		this.os = os;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getPass() {
		return pass;
	}
	public void setPass(String pass) {
		this.pass = pass;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}
	public String getContaction() {
		return contaction;
	}
	public void setContaction(String contaction) {
		this.contaction = contaction;
	}
	@Override
	public String toString() {
		return "Monitor [eqpNo=" + eqpNo + ", eqpID=" + eqpID + ", name=" + name + ", assetType=" + assetType
				+ ", assetValue=" + assetValue + ", securityDomain=" + securityDomain + ", workMode=" + workMode
				+ ", manageMode=" + manageMode + ", os=" + os + ", account=" + account + ", pass=" + pass + ", ip=" + ip
				+ ", location=" + location + ", serial=" + serial + ", contaction=" + contaction + "]";
	}
	

}
