package com.example.demo.dao;

import java.util.List;

import com.example.demo.entity.UserEntity;

public interface UserDao {

	abstract public List<UserEntity> getUserList();

	abstract public void save(UserEntity userEntity);

	abstract public void updateSave(UserEntity userEntity);

	abstract public void delete(String userId);

	abstract public UserEntity getUserByUserId(String userId);

	abstract public List<UserEntity> getUserVoListByUserRole(String userRole);

}
