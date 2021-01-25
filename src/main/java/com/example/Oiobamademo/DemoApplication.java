package com.example.Oiobamademo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("com.example") 
@SpringBootApplication
public class DemoApplication {
	
	public static void main(String[] args) {
		System.out.println("20200524" + "monitor the DemoApplication");
		SpringApplication.run(DemoApplication.class, args);
	}
} 