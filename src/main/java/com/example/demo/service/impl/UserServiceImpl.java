package com.example.demo.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.impl.UserDaoImpl;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.UserService;
//import com.example.demo.util.DatePeriod;
import com.example.demo.vo.UserListVo;
import com.example.demo.vo.UserVo;

@Service("userServiceImpl")
public class UserServiceImpl implements UserService {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserDaoImpl userDaoImpl;

	/**
	 * BookMarkにより、ユーザーリストを取得する
	 * @throws Exception
	 *
	 *
	 */
	@Override
	public UserListVo getUserList()
	{

		List<UserEntity> userEntityList = userDaoImpl.getUserList();
		UserListVo userListVo = new UserListVo();
		//Entity→VOにコピーする
		for(int i = 0 ; i<userEntityList.size(); i ++)
		{
			UserVo userVo = new UserVo();
			//同じItemの値をコピーする
			BeanUtils.copyProperties(userEntityList.get(i), userVo);

			userListVo.getUserVoList().add(userVo);
		}
		//レコード総数を取得する

		return userListVo;
	}


	/**
	 * ユーザーを保存する
	 *
	 *
	 */
	@Override
	@Transactional
	public void saveUser(UserVo userVo)
	{

		UserEntity userEntity = new UserEntity();

		BeanUtils.copyProperties(userVo,userEntity);

		//userEntity.setCreate_timestamp((DatePeriod.getJapDate());

		//userEntity.setUpdate_timestamp(DatePeriod.getJapDate());

//		StringBuilder sbLogList = new StringBuilder();
//
//		ArrayList<UpdateLog> updateLogList = userVo.getUpdateLogList();
//
//		for(UpdateLog updateLog : updateLogList)
//		{
//			sbLogList.append(updateLog.toString()).append(";");
//		}
//
//		userEntity.setDB_LOG(sbLogList.toString());

		userDaoImpl.save(userEntity);
	}





	/**
	 * ユーザーを保存する
	 *
	 *
	 */
	@Override
	public void updateSaveUser(UserVo userVo)
	{

		UserEntity userEntity = new UserEntity();

		BeanUtils.copyProperties(userVo,userEntity);

		//userEntity.setUpdate_timestamp(DatePeriod.getJapDate());

		userDaoImpl.updateSave(userEntity);
	}


    /**
     *
     * ユーザーを削除する
     *
     */
	@Override
    public void deleteUser (String intranet_id)
	{

    	userDaoImpl.delete(intranet_id);
    }

	/**
	 *
	 * UserIdにより、ユーザーVOを取得する
	 * @param docId
	 * @return
	 */
	@Override
	public UserVo getUserVoByUserId(String intranet_id)
	{

		UserEntity userEntity = userDaoImpl.getUserByUserId(intranet_id);

		UserVo userVo = new UserVo();

		BeanUtils.copyProperties(userEntity,userVo);

//		ArrayList<UpdateLog> updateLogList= new ArrayList<UpdateLog>();
//
//		String[] strUpdateLogList = userEntity.getDB_LOG().split(";");
//
//		String[] strUpdateLog;
//
//		UpdateLog updateLogTem = new UpdateLog();
//		for(String str:strUpdateLogList)
//		{
//			strUpdateLog = str.split(",");
//			updateLogTem.setUpdateLogDayTime(strUpdateLog[0]);
//			updateLogTem.setUpdateLogAction(strUpdateLog[1]);
//			updateLogTem.setUpdateLogUserId(strUpdateLog[2]);
//			updateLogList.add(updateLogTem);
//		}
//
//		userVo.setUpdateLogList(updateLogList);

		return userVo;
	}

	/**
	 *
	 * UserRoleにより、ユーザーVOを取得する
	 * @param docId
	 * @return
	 */
	@Override
	public UserListVo getUserVoByUserRole(String userRole)
	{

		List<UserEntity> userEntityList = userDaoImpl.getUserVoListByUserRole(userRole);

		UserListVo userListVo = new UserListVo();

		//Entity→VOにコピーする
		for(int i = 0 ; i<userEntityList.size(); i ++)
		{
			UserVo userVo = new UserVo();
			//同じItemの値をコピーする
			BeanUtils.copyProperties(userEntityList.get(i), userVo);

			userListVo.getUserVoList().add(userVo);
		}
		//レコード総数を取得する

		return userListVo;
	}


}
