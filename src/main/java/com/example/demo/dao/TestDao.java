package com.example.demo.dao;

import java.io.IOException;
import java.util.List;

import com.example.demo.entity.StudentEntity;

public interface TestDao {

	abstract public void save(StudentEntity sentity) throws IOException;

	abstract public void updatesave(StudentEntity sentity) throws IOException;
	
	abstract public StudentEntity getFindById(String id);
	
	abstract public List<StudentEntity> getList();
	
	abstract public void delete(String id);

}

