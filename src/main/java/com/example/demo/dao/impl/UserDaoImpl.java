package com.example.demo.dao.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.UserDao;
import com.example.demo.entity.UserEntity;

@Repository("userDaoImpl")
public class UserDaoImpl implements UserDao{


	private final Logger logger = LoggerFactory.getLogger(this.getClass());


	@Autowired
	JdbcTemplate jdbcTemplate;

	/**
	 *
	 * すべてのユーザーリストを取得する
	 *
	 */
	@Override
	public List<UserEntity> getUserList() {
		List<UserEntity> user_list = jdbcTemplate.query(
				"SELECT USERID,ROLE_CATEGORY,ROLE_KEY,USERNAME,LINEFLG,COMMENT, "
						+ "CREATE_TIMESTAMP,UPDATE_TIMESTAMP,CREATE_USER, UPDATE_USER FROM OIOCCM.T_USER",
				new BeanPropertyRowMapper<>(UserEntity.class));
		
		for (int i = 0, size = user_list.size(); i < size; i++) {
			  System.out.println(user_list.get(i).getUserid());
	            System.out.println(user_list.get(i).getUsername());
	            System.out.println(user_list.get(i).getLineflg());
	            System.out.println(user_list.get(i).getRole_category());
	        }
		return user_list;
	}


	/**
	 *
	 * ユーザーを保存する
	 * @param
	 *
	 */
	@Override
	public void save(UserEntity userEntity)
	{
		String sql = "insert into T_USER values(?,?,?,?,?,?,?,?)";

		Object obj[] = { userEntity.getUserid(), userEntity.getRole_category(),userEntity.getRole_key(),userEntity.getUsername(),
				userEntity.getLineflg(),userEntity.getComment(),userEntity.getCreate_timestamp(),userEntity.getUpdate_timestamp()};

		int temp = this.jdbcTemplate.update(sql, obj);

		if (temp > 0) {

			logger.info("insert succ");

		} else {

			logger.info("insert fail");

		}
	}


	/**
	 *
	 * ユーザーを更新する
	 * @param
	 *
	 */
	@Override
	public void updateSave(UserEntity userEntity)
	{
		String sql = "update T_USER set USERNAME = ?, ROLE_CATEGORY = ?, LINEFLG = ?, UPDATE_TIMESTAMP = ? where USERID = ?";

		Object obj[] = { userEntity.getUsername(), userEntity.getRole_category(), userEntity.getLineflg(),
				userEntity.getUpdate_timestamp(), userEntity.getUserid() };

		int temp = jdbcTemplate.update(sql, obj);

		if (temp > 0) {

			logger.info("update succ");

		} else {

			logger.info("update fail");

		}
	}


	/**
	 *
	 * ユーザーを削除する
	 *
	 */
	@Override
	public void delete(String intranet_id)
	{
		String sql = "delete from T_USER where USERID= ?";

		Object obj[] = { intranet_id };

		int temp = this.jdbcTemplate.update(sql, obj);

		if (temp > 0) {

			logger.info("delete succ");

		} else {

			logger.info("delete fail");
		}
	}

	/**
	 *
	 * userIdにより、ユーザーEntityを取得する
	 *
	 */
	@Override
	public UserEntity getUserByUserId(String userId) {
		String sql = "SELECT USERID,USERNAME,ROLE_CATEGORY,CREATE_USER ,UPDATE_USER,CREATE_TIMESTAMP,UPDATE_TIMESTAMP FROM T_USER where USERID = ?";
		Object obj[] = { userId };

		UserEntity userEntity = jdbcTemplate.queryForObject(sql, obj, new BeanPropertyRowMapper<>(UserEntity.class));
		return userEntity;
	}

	/**
	 *
	 * 特定Roleのユーザーリストを取得する
	 *
	 */
	@Override
	public List<UserEntity> getUserVoListByUserRole(String userRole) {
		String sql = "SELECT  USERID,USERNAME,ROLE_CATEGORY,CREATE_USER ,UPDATE_USER,CREATE_TIMESTAMP,UPDATE_TIMESTAMP  FROM T_USER where ROLE_CATEGORY = ?";
		Object obj[] = { userRole };

		List<UserEntity> user_list = jdbcTemplate.query(sql, obj, new BeanPropertyRowMapper<>(UserEntity.class));
		return user_list;
	}

}
