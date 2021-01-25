package com.example.demo.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
//import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.common.ConstantInterface;
import com.example.demo.service.impl.UserServiceImpl;
import com.example.demo.vo.UserListVo;
import com.example.demo.vo.UserVo;

/**
 * @version: V1.0
 * @author: CIO-DaLian
 * @data: 2020-06-16 00:00
 * 
 **/
@Controller
@Scope("prototype")
@RequestMapping("/user")
public class UserControl {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserServiceImpl userServiceImpl;
	
	/**
	 * ユーザー一覧画面に遷移する
	 *
	 * @param HttpServletRequest request
	 * @param HttpServletResponse response
	 * @return ModelAndView
	 * @throws Exception
	 */
	@RequestMapping(value="/listUser",method=RequestMethod.GET)
	public ModelAndView getlistUser(HttpServletRequest request,HttpServletResponse response) throws Exception
	{
		ModelAndView mov =new ModelAndView();
		UserListVo userListVo = userServiceImpl.getUserList();
		mov.addObject("userListVo",userListVo);
		mov.setViewName("/User/user_list");
		logger.info("list");
		return mov;
	}

	/**
	 * ユーザー新規作成画面に遷移する
	 *
	 * @param HttpServletRequest request
	 * @param HttpServletResponse response
	 * @return ModelAndView
	 */
	@RequestMapping(value="/addUser",method=RequestMethod.GET)
	public ModelAndView addUser(HttpServletRequest request,HttpServletResponse response)
	{
		
		System.out.println("20200727 liu test /addUser");
		ModelAndView mov=new ModelAndView();
		//登録したUserIdを取得する
		String loginId = (String)request.getSession().getAttribute(ConstantInterface.LOGIN_ID);
		UserVo userVo = new UserVo();
		
		userVo.setUserid(loginId);
		userVo.setUpdate_user(loginId);
		
		mov.addObject("userVo", userVo);
		mov.setViewName("/User/viewuser");
		return mov;
	}

	/**
	 * ユーザーを保存する
	 *
	 * @param UserVo userVo
	 * @param BindingResult result
	 * @return ModelAndView
	 */
	@RequestMapping(value="/saveUser",method=RequestMethod.POST)
	public ModelAndView saveUser(@Valid @ModelAttribute("userVo") UserVo userVo,
			HttpServletRequest request,HttpServletResponse response)
	{
		ModelAndView mov=new ModelAndView();

//		UpdateLog updateLog = UpdateLogUtil.setUpdateLogInfo(ConstantInterface.ACTION_SUBMIT, userVo.getCreate_user_id());

//		if (userVo.getUpdateLogList() != null && ! userVo.getUpdateLogList().isEmpty()){
//			userVo.getUpdateLogList().add(updateLog);
//		} else {
//			ArrayList<UpdateLog> updateLogList = new ArrayList<UpdateLog>();
//			updateLogList.add(updateLog);
//			userVo.setUpdateLogList(updateLogList);
//		}
		
		userServiceImpl.saveUser(userVo);
		mov.addObject("userVo", userVo);
		mov.setViewName("redirect:./listUser");
		return mov;
	}

	/**
	 * ユーザーをアップデートする
	 *
	 * @param UserVo userVo
	 * @param BindingResult result
	 * @param HttpServletRequest request
	 * @return ModelAndView
	 */
	@RequestMapping(value="/updatesaveUser",method=RequestMethod.POST)
	public ModelAndView updateSaveUser(@Valid @ModelAttribute("userVo") UserVo userVo,BindingResult result, HttpServletRequest request)
	{
		ModelAndView mov=new ModelAndView();
		
		String loginId = (String)request.getSession().getAttribute(ConstantInterface.LOGIN_ID);
		userVo.setUpdate_user(loginId);
		
		userServiceImpl.updateSaveUser(userVo);
		mov.addObject("userVo", userVo);
		mov.setViewName("redirect:./detail?intranet_id="+userVo.getUserid());
		return mov;
	}

	/**
	 * ユーザー詳細画面に遷移する
	 *
	 * @param String docid
	 * @return ModelAndView
	 */
	@RequestMapping(value="/detailUser",method=RequestMethod.GET)
	public ModelAndView detailUser(@RequestParam String intranet_id)
	{
		ModelAndView mov=new ModelAndView();
		UserVo userVo = userServiceImpl.getUserVoByUserId(intranet_id);
		mov.addObject("userVo",userVo);
		mov.setViewName("user_detail");
		return mov;
	}

	/**
	 * ユーザー更新画面に遷移する
	 *
	 * @param String docid
	 * @return ModelAndView
	 */
	@RequestMapping(value="/updateUser",method=RequestMethod.GET)
	public ModelAndView updateUser(@RequestParam String intranet_id)
	{
		ModelAndView mov=new ModelAndView();
		UserVo userVo = userServiceImpl.getUserVoByUserId(intranet_id);
		mov.addObject("userVo",userVo);
		mov.setViewName("user_update");
		return mov;
	}

	/**
	 * ユーザーを削除する
	 *
	 * @param String docid
	 * @return ModelAndView
	 */
	@RequestMapping(value="/deleteUser",method=RequestMethod.GET)
	public ModelAndView deleteUser(@RequestParam String intranet_id)
	{
		ModelAndView mov=new ModelAndView();
		userServiceImpl.deleteUser(intranet_id);
		mov.setViewName("redirect:./listUser");
		return mov;
	}
}
