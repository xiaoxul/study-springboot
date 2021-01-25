package com.example.demo.entity; 


public class StudentEntity { 
	// id,rev 
	private String _id; 


	private String _rev; 
	 
	// docType 
 	private String docType = "student"; 
 	 
 	// name,age,sex 
     private String name; 
     private int age; 
     private String sex; 
     private String senderemail; 
     private String senderpassword; 
     private String recipientemail; 
     private String subject; 
     private String content; 
     private String user;

     private String pass;
      
 	 
 	public String get_id() { 
 		return _id; 
 	} 
 	public void set_id(String _id) { 
 		this._id = _id; 
 	} 
 	public String get_rev() { 
 		return _rev; 
 	} 
 	public void set_rev(String _rev) { 
 		this._rev = _rev; 
 	} 
 	public String getName() { 
 		return name; 
 	} 
 	public void setName(String name) { 
 		this.name = name; 
 	} 
 	public int getAge() { 
 		return age; 
 	} 
 	public void setAge(int age) { 
 		this.age = age; 
 	} 
 	public String getSex() { 
 		return sex; 
 	} 
 	public void setSex(String sex) { 
 		this.sex = sex; 
 	} 
 	public String getDocType() { 
 		return docType; 
 	} 
 	public void setDocType(String docType) { 
 		this.docType = docType; 
 	} 
 	public String getSubject() { 
 		return subject; 
 	} 
 	public void setSubject(String subject) { 
 		this.subject = subject; 
 	} 
 	public String getContent() { 
 		return content; 
 	} 
 	public void setContent(String content) { 
 		this.content = content; 
 	} 
 	public String getSenderemail() { 
 		return senderemail; 
 	} 
 	public void setSenderemail(String senderemail) { 
 		this.senderemail = senderemail; 
 	} 
 	public String getSenderpassword() { 
 		return senderpassword; 
 	} 
 	public void setSenderpassword(String senderpassword) { 
 		this.senderpassword = senderpassword; 
 	} 
 	public String getRecipientemail() { 
 		return recipientemail; 
 	} 
 	public void setRecipientemail(String recipientemail) { 
 		this.recipientemail = recipientemail; 
 	} 
 	 
 	public String getUser() {

		return user;

	}

	public void setUser(String user) {

		this.user = user;

	}

	public String getPass() {

		return pass;

	}

	public void setPass(String pass) {

		this.pass = pass;

	}
 } 
