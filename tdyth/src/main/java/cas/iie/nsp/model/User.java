package cas.iie.nsp.model;

import cas.iie.nsp.utils.ColumnAnnotationUtils.Column;

public class User {
	@Column(name="userId")
    private Integer userId;
    /**
     * 用户名
     */
	@Column(name="userName")
    private String userName;
    /**
     * 描述
     */
	@Column(name="description")
    private String description;
    /**
     * 用户层级
     */
	@Column(name="userLevels")
    private Integer userLevels;
    /**
     * 密码
     */
	@Column(name="userPassword")
    private String userPassword;
    
    @Override
	public String toString() {
		return "User [userId=" + userId + ", userName=" + userName + ", description=" + description + ", userLevels="
				+ userLevels + ", userPassword=" + userPassword + "]";
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getUserLevels() {
		return userLevels;
	}
	public void setUserLevels(Integer userLevels) {
		this.userLevels = userLevels;
	}
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
    
    
}
