package com.example.demo.service;

import java.io.IOException;
import java.util.List;

import com.example.demo.entity.StudentEntity;

public interface TestService {

	abstract public StudentEntity save(StudentEntity sentity) throws IOException;

	abstract public StudentEntity updatesave(StudentEntity sentity) throws IOException;
	
	abstract public StudentEntity getFindById(String id);
	
	abstract public List<StudentEntity> getList();
	
	abstract public void delete(String id);

	abstract public StudentEntity send(StudentEntity sentity) throws Exception;
}

