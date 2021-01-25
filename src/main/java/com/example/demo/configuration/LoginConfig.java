package com.example.demo.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.demo.interceptor.AuthorizeInterceptorConfig;



@Configuration
public class LoginConfig implements WebMvcConfigurer {
	
	@Bean
    public AuthorizeInterceptorConfig authorizeInterceptorConfig() {
        return new AuthorizeInterceptorConfig();
    }
	
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注册TestInterceptor拦截器
        InterceptorRegistration registration = registry.addInterceptor(authorizeInterceptorConfig());
        registration.addPathPatterns("/**");                      //
        registration.excludePathPatterns(                         //
                                         "/save",            //exclude w3id authority
                                         "/update",
                                         "/updatesave",
                                         "/delete",
                                          "/send", 
        		                          "/tosend");        
	    }
}