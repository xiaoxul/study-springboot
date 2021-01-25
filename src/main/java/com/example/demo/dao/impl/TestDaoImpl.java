package com.example.demo.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.cloudant.client.api.Database;
import com.example.demo.dao.TestDao;
import com.example.demo.entity.StudentEntity;
import com.example.demo.util.SealsCloudantClientMgr;


@Repository("testDaoImpl")
public class TestDaoImpl implements TestDao{

	
	@Override
	public void save(StudentEntity sentity) {
		Database db = SealsCloudantClientMgr.getDB();
    	db.save(sentity);
	}
	
	@Override
	public void updatesave(StudentEntity sentity) {
		Database db = SealsCloudantClientMgr.getDB();
    	db.update(sentity);
	}
	
	@Override
	public StudentEntity getFindById(String id) {
		Database db = SealsCloudantClientMgr.getDB();
		StudentEntity studentEntity = db.find(StudentEntity.class, id);
        return studentEntity;
		
	}
	
	@Override
	public List<StudentEntity> getList() {
		Database db = SealsCloudantClientMgr.getDB();
		List<StudentEntity> studentEntity_list = null;
		studentEntity_list = db.search("student/SearchInx01")
        	 	.limit(200)
        	 	.includeDocs(true)
        	 	//.query("docType:student", StudentEntity.class);
        	 	.query("student", StudentEntity.class);
		return studentEntity_list;
		
	}
		
		


	@Override
	public void delete(String id) {
		// TODO Auto-generated method stub
		Database db = SealsCloudantClientMgr.getDB();
		StudentEntity studentEntity = db.find(StudentEntity.class, id);
		db.remove(studentEntity);
		return;
	}
}
