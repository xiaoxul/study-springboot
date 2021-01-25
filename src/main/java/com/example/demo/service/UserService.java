package com.example.demo.service;

import com.example.demo.vo.UserListVo;
import com.example.demo.vo.UserVo;

public interface UserService {

	abstract public UserListVo getUserList();

	abstract public void saveUser(UserVo userVo);

	abstract public void updateSaveUser(UserVo userVo);

	abstract public void deleteUser (String docId);

	abstract public UserVo getUserVoByUserId(String userId);

	abstract public UserListVo getUserVoByUserRole(String userRole);

}
