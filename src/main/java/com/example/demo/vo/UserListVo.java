package com.example.demo.vo;

import java.util.ArrayList;
import java.util.List;

public class UserListVo {
	
	private String totalRows = null;
	
	private String pageCount = null;
	
	private String currentPageNum = null;
	
	private List<UserVo> userVoList = new ArrayList<UserVo>();

	public List<UserVo> getUserVoList() {
		return userVoList;
	}

	public void setUserVoList(List<UserVo> userVoList) {
		this.userVoList = userVoList;
	}


	public String getPageCount() {
		return pageCount;
	}

	public void setPageCount(String pageCount) {
		this.pageCount = pageCount;
	}

	public String getCurrentPageNum() {
		return currentPageNum;
	}

	public void setCurrentPageNum(String currentPageNum) {
		this.currentPageNum = currentPageNum;
	}

	public String getTotalRows() {
		return totalRows;
	}

	public void setTotalRows(String totalRows) {
		this.totalRows = totalRows;
	}

	
}
