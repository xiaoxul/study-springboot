package com.example.demo.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.entity.StudentEntity;
import com.example.demo.service.impl.TestServiceImpl;

import java.util.Date;  
import java.text.SimpleDateFormat; 

@RestController
public class TestController {
	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	@Autowired
	TestServiceImpl testServiceImpl;

	@RequestMapping("/user")
    public Principal user(@AuthenticationPrincipal Principal principal) {
        // Principal holds the logged in user information.
        // Spring automatically populates this principal object after login.
        return principal;
    }
    
	@RequestMapping("/hello")
	public String hello()
	{
		return "Welcome Sales Springboot World！！";
	}
	
	@RequestMapping("/env")

    public ModelAndView env(HttpServletRequest request, HttpServletResponse response) throws Exception {

		

		String user = System.getenv("user");
		
		System.out.println(df.format(new Date()) + "  monitor the env user==  "+user);

		String password = System.getenv("pass");
		
		System.out.println(df.format(new Date()) + "  monitor the env password==  "+password);

		StudentEntity studentEntity = new StudentEntity();

		studentEntity.setUser(user);

		studentEntity.setPass(password);

		ModelAndView mv = new ModelAndView("env");

		mv.addObject("studentEntity", studentEntity);

		return mv;
		
	}
	@RequestMapping(value="/student")

	public ModelAndView student() {

		ModelAndView mv = new ModelAndView("add");
        return mv;

	}
    
	@RequestMapping(value = "/save",method = RequestMethod.POST)
	public ModelAndView save(StudentEntity sentity) throws IOException
	{
		sentity = testServiceImpl.save(sentity);
		
		ModelAndView mv = new ModelAndView("redirect:./list");
		return mv;
	}
	
	@RequestMapping(value = "/update",method = RequestMethod.GET)
	public ModelAndView update(@RequestParam String id, HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		StudentEntity studentEntity = testServiceImpl.getFindById(id);
		request.getSession().setAttribute("updateStudentEntity", studentEntity);
		ModelAndView mv = new ModelAndView("update");
		mv.addObject("studentEntity", studentEntity);
		return mv;
	}
	
	@RequestMapping(value = "/updatesave",method = RequestMethod.POST)
	public ModelAndView updatesave(StudentEntity sEntity, HttpServletRequest request,
			HttpServletResponse response) throws IOException
	{
		StudentEntity studentEntity = (StudentEntity)request.getSession().getAttribute("updateStudentEntity");
		sEntity.set_id(studentEntity.get_id());
		sEntity.set_rev(studentEntity.get_rev());
		studentEntity = testServiceImpl.updatesave(sEntity);
		request.getSession().removeAttribute("updateStudentEntity");
		
		ModelAndView mv = new ModelAndView("redirect:./list");
		return mv;
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public ModelAndView list(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		List<StudentEntity> studentEntityList = testServiceImpl.getList();
		ModelAndView mv = new ModelAndView("list");
		mv.addObject("studentEntityList", studentEntityList);
		return mv;
	}
	
	@RequestMapping(value="/delete",method=RequestMethod.GET)
	public ModelAndView delete(@RequestParam String id)
	{
		ModelAndView mov=new ModelAndView();
		testServiceImpl.delete(id);
		mov.setViewName("redirect:./list");
		return mov;
	}
	
	@RequestMapping(value="/tosend") 
 	public ModelAndView tosend() { 
 

 		ModelAndView mv = new ModelAndView("sendmail"); 
         return mv; 
 

 	} 
	
	@RequestMapping(value="/viewuser") 
 	public ModelAndView viewuser() { 
  		ModelAndView mv = new ModelAndView("/User/viewuser"); 
         return mv; 
 
 	} 
 	 
	@RequestMapping(value="/viewContractor") 
 	public ModelAndView viewContractor() { 
  		ModelAndView mv = new ModelAndView("viewContractor"); 
         return mv; 
 
 	} 
 	@RequestMapping(value="/send",method = RequestMethod.POST) 
 	public ModelAndView send(StudentEntity sentity) throws Exception{ 
 		 
 		sentity = testServiceImpl.send(sentity); 
 		 
 		ModelAndView mv = new ModelAndView("sendmail"); 
         return mv; 
 	}
}
