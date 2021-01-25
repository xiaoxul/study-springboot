package com.example.demo.vo;

import java.util.Date;

public class UserVo {
	private String userid; 
	private String role_category; 
	private Integer role_key;
	private String username; 
	private String lineflg; 
	private String comment; 
	private String update_timestamp; 
	private String create_timestamp; 
	private String create_user; 
	private String update_user; 
	
	
	

	public String getUserid() { 
 		return userid; 
 	} 
 	public void setUserid(String userid) { 
 		this.userid = userid; 
 	} 
 	public String getUsername() {	
 		return username; 
 	} 
 	public void setUsername(String username) { 
 		this.username = username; 
 	} 
 	public String getLineflg() { 
 		return lineflg; 
 	} 
 	public void setLineflg(String lineflg) { 
 		this.lineflg = lineflg; 
 	} 
 	public String getRole_category() { 
 		return role_category; 
 	} 
 	public void setRole_category(String role_category) { 
 		this.role_category = role_category; 
 	} 

	public Integer getRole_key() {
		return role_key;
	}
	public void setRole_key(Integer role_key) {
		this.role_key = role_key;
	}
	
	
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getUpdate_timestamp() {
		return update_timestamp;
	}
	public void setUpdate_timestamp(String update_timestamp) {
		this.update_timestamp = update_timestamp;
	}
	public String getCreate_timestamp() {
		return create_timestamp;
	}
	public void setCreate_timestamp(String create_timestamp) {
		this.create_timestamp = create_timestamp;
	}
	public String getCreate_user() {
		return create_user;
	}
	public void setCreate_user(String create_user) {
		this.create_user = create_user;
	}
	public String getUpdate_user() {
		return update_user;
	}
	public void setUpdate_user(String update_user) {
		this.update_user = update_user;
	}

//	public ArrayList<UpdateLog> getUpdateLogList() {
//		return updateLogList;
//	}
//
//	public void setUpdateLogList(ArrayList<UpdateLog> updateLogList) {
//		this.updateLogList = updateLogList;
//	}
}
