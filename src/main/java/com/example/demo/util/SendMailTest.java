package com.example.demo.util; 


import java.util.Date; 
import java.util.Properties; 


import javax.mail.Message.RecipientType; 
import javax.mail.Session; 
import javax.mail.Transport; 
import javax.mail.internet.InternetAddress; 
import javax.mail.internet.MimeMessage; 


import org.apache.ibatis.annotations.Mapper; 


import com.example.demo.entity.StudentEntity; 


/** 
 * 使用SMTP协议发送电子邮件 
 */ 


public class SendMailTest { 


// 邮件发送协议 
private final static String PROTOCOL = "smtp"; 


// SMTP邮件服务器  
private final static String HOST = "na.relay.ibm.com"; 


// SMTP邮件服务器默认端口  
private final static String PORT = "25"; 


// 是否要求身份认证 
private final static String IS_AUTH = "true"; 


private final static String IS_ENABLED_DEBUG_MOD = "true"; 


// 发件人  
private static String from = ""; 
//发件人password  
private static String password = ""; 
// 收件人  
private static String to = ""; 


// 初始化连接邮件服务器的会话信息  
private static Properties props = null; 


static { 
props = new Properties(); 
props.setProperty("mail.transport.protocol", PROTOCOL); 
props.setProperty("mail.smtp.host", HOST); 
props.setProperty("mail.smtp.port", PORT); 
props.setProperty("mail.smtp.auth", IS_AUTH); 
props.setProperty("mail.debug",IS_ENABLED_DEBUG_MOD); 
} 


@Mapper 
//20200505 liu add static
public static StudentEntity sendTextEmail(StudentEntity sentity) throws Exception { 
// 创建Session实例对象  
Session session = Session.getDefaultInstance(props); 
// 创建MimeMessage实例对象  
MimeMessage message = new MimeMessage(session); 
// 设置发件人  
from = sentity.getSenderemail(); 
password = sentity.getSenderpassword(); 
message.setFrom(new InternetAddress(from)); 
// 设置邮件主题  
message.setSubject(sentity.getSubject(), "UTF-8"); 
// 设置收件人  
to = sentity.getRecipientemail(); 
message.setRecipient(RecipientType.TO, new InternetAddress(to)); 
//增加CC功能 
//if(cc != null) { 
//	InternetAddress[] ccAddress = new InternetAddress[cc.size()]; 
//	for(int k = 0;k<cc.size();k++){ 
//		String emailAddress = cc.get(k); 
//		new InternetAddress(emailAddress); 
//			ccAddress[k]=new InternetAddress(emailAddress); 
//	} 
//	msg.addRecipients(Message.RecipientType.CC, ccAddress); 
//} 
//增加BCC功能 
//if(bcc != null) { 
//	InternetAddress[] bccAddress = new InternetAddress[bcc.size()]; 
//	for(int k = 0;k<bcc.size();k++){ 
//		String emailAddress = bcc.get(k); 
//		new InternetAddress(emailAddress); 
//			bccAddress[k]=new InternetAddress(emailAddress); 
//	} 
//	msg.addRecipients(Message.RecipientType.BCC, bccAddress); 
//} 
// 设置发送时间  
message.setSentDate(new Date()); 
// 设置纯文本内容为邮件正文  
message.setText(sentity.getContent(), "UTF-8"); 
// 保存并生成最终的邮件内容  
message.saveChanges(); 


// 获得Transport实例对象  
Transport transport = session.getTransport(); 
// 打开连接  
 transport.connect(from, password); 
 // 将message对象传递给transport对象，将邮件发送出去  
 transport.sendMessage(message, message.getAllRecipients()); 
 // 关闭连接  
 transport.close(); 
 return sentity; 
 } 
 } 
