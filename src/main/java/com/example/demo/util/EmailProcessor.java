//package com.example.demo.util;

//

//import java.util.ArrayList;

//import java.util.Calendar;

//import java.util.Iterator;

//import java.util.Properties;

//import java.util.logging.Logger;

//

//import javax.activation.DataHandler;

//import javax.mail.Message;

//import javax.mail.MessagingException;

//import javax.mail.Multipart;

//import javax.mail.Session;

//import javax.mail.Transport;

//import javax.mail.internet.InternetAddress;

//import javax.mail.internet.MimeBodyPart;

//import javax.mail.internet.MimeMessage;

//import javax.mail.internet.MimeMultipart;

//import javax.mail.internet.PreencodedMimeBodyPart;

//import javax.mail.util.ByteArrayDataSource;

//

//import org.apache.commons.codec.binary.Base64;

//

//import com.example.demo.configuration.MailConfig;

//import com.example.demo.configuration.ServiceMessages;

//import com.example.demo.configuration.ServiceProperties;

//import com.example.demo.util.exception.BadMailException;

//import com.example.demo.util.exception.SendException;

//import com.example.demo.util.model.Attachment;

//import com.example.demo.util.model.Email;

//import com.example.demo.util.model.Header;

//import com.google.gson.JsonObject;

//

//import net.sf.json.JSONArray;

//import net.sf.json.JSONObject;

//

//

//

//

//public class EmailProcessor implements ServiceProperties, ServiceMessages {

//	

//    private static final Logger LOGGER = Logger.getLogger(EmailProcessor.class.getName());

//	

//	private static EmailProcessor instance;

//	

//	

//	

//	private EmailProcessor() {

//		// Nothing to see here. Move along.

//	}

//	

//	public static synchronized EmailProcessor getInstance() {

//		

//		if (null == instance) {

//			instance = new EmailProcessor();

//		}

//		

//		return instance;

//	}

//	

//	public void sendEmail(JsonObject document) throws SendException, BadMailException {

//		//from

//		String email = "qhkqi@cn.ibm.com";

//		

//		//to;

//		String emailID = "609035997@qq.com"; //Tamer added

//		

//		buildEmail(parseJson(email), emailID);

//	}

//	

//	/*

//	public void sendStatusEmail(JsonObject document, String subject, String status) throws SendException {

//		

//		// Extract the email message (what our customers send via the EmailService)

//		JsonObject email = document.getJsonObject(KEY_EMAIL);

//		

//		System.out.println(MSG_EMAIL_RETRIEVED + subject);

//		

//		buildStatusEmail(parseJson(email.toString()), subject, status);

//	}*/

//	

//	private Email parseJson(String email) {

//		

//		Email targetEmail = new Email();

//		targetEmail.setHost(MailConfig.DEFAULT_EMAIL_SERVER);

//		targetEmail.setPort(MailConfig.DEFAULT_EMAIL_PORT);

//		targetEmail.setContact(email);

//		targetEmail.setRecipients(recipients);

//		targetEmail.setSubject((String) jsonObject.get(ELEMENT_SUBJECT));

//		targetEmail.setMessage((String) jsonObject.get(ELEMENT_MESSAGE));

//		targetEmail.setAttachments(attachments);

//		targetEmail.setHeaders(headers);

//			

//		return targetEmail;		

//	}

//	

//	private void buildEmail(Email targetEmail , String emailID) throws SendException, BadMailException {

//		try {

//			

//			// Get system properties

//			Properties properties = System.getProperties();

//

//			// Setup mail server

//			properties.setProperty(PROP_SMTP_HOST, targetEmail.getHost());

//

//			// Get the default Session object.

//			Session session = Session.getDefaultInstance(properties);

//

//			// Create a default MimeMessage object.

//			MimeMessage message = new MimeMessage(session);

//

//			// Set From: header field of the header.

//			message.setFrom(new InternetAddress(targetEmail.getContact()));

//

//			// Set To: header field of the header. This may be null now as folks may want to bcc only

//			ArrayList<String> recipients = targetEmail.getRecipients();

//			if (null != recipients) {

//			

//				Iterator<String> iterator = recipients.iterator();

//			      

//				while (iterator.hasNext()) {

//					message.addRecipient(Message.RecipientType.TO, new InternetAddress(iterator.next()));

//				}

//			}

//			

//			// Do we have any ccs?

//			ArrayList<String> ccs = targetEmail.getCc();

//			if (null != ccs) {

//				Iterator<String> ccIterator = ccs.iterator();

//			      

//				while (ccIterator.hasNext()) {

//					message.addRecipient(Message.RecipientType.CC, new InternetAddress(ccIterator.next()));

//				}

//			}

//			

//			// Do we have any bccs?

//			ArrayList<String> bccs = targetEmail.getBcc();

//			if (null != bccs) {

//				Iterator<String> bccIterator = bccs.iterator();

//			      

//				while (bccIterator.hasNext()) {

//					message.addRecipient(Message.RecipientType.BCC, new InternetAddress(bccIterator.next()));

//				}

//			}

//

//			// Set Subject: header field

//			message.setSubject(targetEmail.getSubject());

//			

//			// Now, the content

//			Multipart multipart = new MimeMultipart();

//

//			// The email body (primary message) // message.setText(targetEmail.getMessage()); message.setContent(targetEmail.getMessage(),"text/html");

//			MimeBodyPart messageBodyPart = new MimeBodyPart();

//			

//			if (null != targetEmail.getMessage()) {

//				messageBodyPart.setContent(targetEmail.getMessage(),"text/html; charset=UTF-8"); 

//				

//			} else {

//				messageBodyPart.setContent(Calendar.getInstance().getTime().toString(),"text/html; charset=UTF-8");

//			}

//			

//			// Do we have any attachments?

//			ArrayList<Attachment> attachments = targetEmail.getAttachments();

//			if (null != attachments) {

//				Iterator<Attachment> attachmentIterator = attachments.iterator();

//				

//				Base64 b64 = new Base64(100);

//				

//				while (attachmentIterator.hasNext()) {

//					Attachment attachment = attachmentIterator.next();

//					String data = attachment.getData();

//					

//			         byte[] decoded = b64.decode(data);

//	                 data = b64.encodeAsString(decoded);

//	                    

//					MimeBodyPart attachmentBodyPart = new PreencodedMimeBodyPart("base64"); //new MimeBodyPart();

//					

//					attachmentBodyPart.setText(data);

//					attachmentBodyPart.setFileName(attachment.getFilename());

//					multipart.addBodyPart(attachmentBodyPart);

//				}

//			}

//			

//			// Is there a calendar invite?

//			String calendar = targetEmail.getCalendar();

//			if (null != calendar) {

//

//				// Fill the message

//		        messageBodyPart.setHeader("Content-Class", "urn:content-classes:calendarmessage");

//		        messageBodyPart.setHeader("Content-ID", "calendar_message");

//		        messageBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(calendar, "text/calendar"))); // very important

//			}

//			

//			// Any SMTP headers?

//			ArrayList<Header> headers = targetEmail.getHeaders();

//			if (null != headers) {

//				//System.out.println("HEADERS!");

//				Iterator<Header> headerIterator = headers.iterator();

//				

//				while(headerIterator.hasNext()) {

//					Header targetHeader = headerIterator.next();

//					message.setHeader(targetHeader.getName(), targetHeader.getValue());

//				}

//			}

//			

//			multipart.addBodyPart(messageBodyPart);

//			

//			// Add our multipart to the message

//			message.setContent(multipart);

//

//			// Send message

//			sendMessage(message, targetEmail.getHost());

//		//	LOGGER.info("Email " + emailID + ": " + MSG_SENT_SUCCESSFUL);

//		

//			LOGGER.warning("Email " + emailID + ": " + MSG_SENT_SUCCESSFUL + " - " + targetEmail.getSubject());

//			// If we've gotten this far, mark the email as dispatched

//			//LOGGER.info(MSG_SENT_SUCCESSFUL);

//			

//		} catch (Exception e) {

//			

//			//e.printStackTrace();

//			LOGGER.severe(e.getMessage());

//			

//			// This could get crazy - consider checking for the relay exception only

//			if (e.getMessage().contains(ERR_MAIL_DOMAIN_ILLEGAL_CHAR) 

//					|| e.getMessage().contains(ERR_MAIL_NO_RECIPIENTS) 

//					|| e.getMessage().contains(ERR_MAIL_ILLEGAL_ADDRESS)

//					|| e.getMessage().contains(ERR_MAIL_INVALID_ADDRESS) //Tamer added more check for bad email

//					|| e.getMessage().contains(ERR_MAIL_ADDRESS_WITH_WHITESPACE) //Tamer added more check for bad email

//					|| e.getMessage().contains(ERR_MAIL_DOMAIN_START_WITH_DOT) //Tamer added more check for bad email

//					

//					

//					) {

//				// cc.permaFailDocument(emailID, MSG_BAD_EMAIL + " :: " + e.getLocalizedMessage()); // Tamer added

//				

// 			throw new BadMailException(e.getLocalizedMessage());

//				

//			} else {

//				throw new SendException(e.getLocalizedMessage());

//			}

//		}

//		

//	}

//	

//	

//	/**

//	 * Send the message, and if the send fails, try 2 more times (for a total of 3 attempts)

//	 * 

//	 * @param message

//	 * @param host

//	 * @throws SendException

//	 */

//	private void sendMessage(MimeMessage message, String host) throws SendException {

//		EmailRetryStrategy ers = new EmailRetryStrategy();

//		

//		while(ers.shouldRetry()) {

//			try {

//				Transport.send(message);

//				break;

//				

//			} catch (MessagingException mex) {

//				

//				try {

//					ers.errorOccured();

//					if (mex.getMessage().contains(ERR_MAIL_NO_RECIPIENTS)) {

//						LOGGER.severe("Messaging Exception occured during send attempt: " + mex.getMessage());

//						throw new BadMailException(ERR_MAIL_NO_RECIPIENTS);

//					}else if (mex.getMessage().contains(ERR_MAIL_INVALID_ADDRESS)) { //tamer added

//						LOGGER.severe("Messaging Exception occured during send attempt: " + mex.getMessage());

//						throw new BadMailException(ERR_MAIL_INVALID_ADDRESS);

//					}else if (mex.getMessage().contains(ERR_MAIL_ADDRESS_WITH_WHITESPACE)) { //tamer added

//						LOGGER.severe("Messaging Exception occured during send attempt: " + mex.getMessage());

//						throw new BadMailException(ERR_MAIL_ADDRESS_WITH_WHITESPACE);

//					}else if (mex.getMessage().contains(ERR_MAIL_DOMAIN_START_WITH_DOT)) { //tamer added

//						LOGGER.severe("Messaging Exception occured during send attempt: " + mex.getMessage());

//						throw new BadMailException(ERR_MAIL_DOMAIN_START_WITH_DOT);

//					}

//					

//					LOGGER.severe("Messaging Exception occured during send attempt: " + mex.getMessage());

//					

//				} catch (RuntimeException e1) {

//					throw new SendException("Messaging Exception: " + host + " " + e1.getLocalizedMessage());

//					

//				} catch (Exception e1) {

//					throw new SendException("Messaging Exception: " + host + " " + e1.getLocalizedMessage());

//				}

//			}

//		}

//	}

//	

//	/**

//	 * Retry logic courtesy of Crunchify to cover moody na.relay mail server

//	 */

//	static class EmailRetryStrategy {

//		public static final int DEFAULT_RETRIES = 3;

//		public static final long DEFAULT_WAIT_TIME_MILLI = 2000;

// 

//		private int numberOfRetries;

//		private int numberOfTriesLeft;

//		private long timeToWait;

// 

//		public EmailRetryStrategy() {

//			this(DEFAULT_RETRIES, DEFAULT_WAIT_TIME_MILLI);

//		}

// 

//		public EmailRetryStrategy(int numberOfRetries, long timeToWait) {

//			this.numberOfRetries = numberOfRetries;

//			numberOfTriesLeft = numberOfRetries;

//			this.timeToWait = timeToWait;

//		}

// 

//		/**

//		 * @return true if there are tries left

//		 */

//		public boolean shouldRetry() {

//			return numberOfTriesLeft > 0;

//		}

// 

//		public void errorOccured() throws SendException {

//			numberOfTriesLeft--;

//			

//			if (!shouldRetry()) {

//				throw new SendException("Retry Failed: Total " + numberOfRetries + " attempts made at interval " + getTimeToWait() + "ms");

//			}

//			

//			waitUntilNextTry();

//		}

// 

//		public long getTimeToWait() {

//			return timeToWait;

//		}

// 

//		private void waitUntilNextTry() {

//			try {

//				Thread.sleep(getTimeToWait());

//				

//			} catch (InterruptedException ignored) {

//			

//			}

//		}

//	}

//

//}