package com.example.demo.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.impl.TestDaoImpl;
import com.example.demo.entity.StudentEntity;
import com.example.demo.service.TestService;
import com.example.demo.util.SendMailTest;


@Service("testServiceImpl")
public class TestServiceImpl implements TestService{

	@Autowired
	private TestDaoImpl testDaoImpl;

	
	@Override
	public StudentEntity save(StudentEntity sentity) throws IOException {
		
		String currTime = String.valueOf(System.currentTimeMillis());
		sentity.set_id(currTime);

		testDaoImpl.save(sentity);
		return sentity;

	}
	
	@Override
	public StudentEntity updatesave(StudentEntity sentity) throws IOException {

		testDaoImpl.updatesave(sentity);
		return sentity;

	}
	
	@Override
	public StudentEntity getFindById(String id) {
		//Request情報を取得する
		StudentEntity studentEntity = testDaoImpl.getFindById(id);

		return studentEntity;
	}
	
	@Override
	public List<StudentEntity> getList() {
		//Request情報を取得する
		List<StudentEntity> studentEntity = testDaoImpl.getList();

		return studentEntity;
	}

	@Override
	public void delete(String id) {

		testDaoImpl.delete(id);

	}

	@Mapper 
 	@Override 
 	public StudentEntity send(StudentEntity sentity) throws Exception{		
		SendMailTest.sendTextEmail(sentity); 
 		return sentity; 
 	}
}
