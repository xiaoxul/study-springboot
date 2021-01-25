package com.example.demo.common;

public class UpdateLog {

	//日時
	private String updateLogDayTime = null;
	//操作
	private String updateLogAction = null;
	//編集者ID
	private String updateLogUserId = null;

	public String getUpdateLogDayTime() {
		return updateLogDayTime;
	}

	public void setUpdateLogDayTime(String updateLogDayTime) {
		this.updateLogDayTime = updateLogDayTime;
	}

	public String getUpdateLogAction() {
		return updateLogAction;
	}

	public void setUpdateLogAction(String updateLogAction) {
		this.updateLogAction = updateLogAction;
	}

	public String getUpdateLogUserId() {
		return updateLogUserId;
	}

	public void setUpdateLogUserId(String updateLogUserId) {
		this.updateLogUserId = updateLogUserId;
	}

	@Override
	public String toString() {
		return updateLogDayTime + "," + updateLogAction
				+ "," + updateLogUserId;
	}

}
