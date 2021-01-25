package com.example.demo.common;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(value = Exception.class)
	public ModelAndView defaultErrorHandler(HttpServletRequest req, Exception ex) throws Exception {		
		Map<String, Object> model = new HashMap<String, Object>(); 
		 
		  if(ex instanceof MaxUploadSizeExceededException)
		  {
			  model.put(ConstantInterface.ERROR_MSG_KEY, ConstantInterface.MSG_UP_FILE_FAILD_SIZE_T); 
		  }
		  else
		  {
			  model.put(ConstantInterface.ERROR_MSG_KEY, ConstantInterface.ERROR_MSG_VALUE);
			  ex.printStackTrace();
		  }
		  return new ModelAndView(ConstantInterface.ERROR_VIEW, model); 
	}

}
