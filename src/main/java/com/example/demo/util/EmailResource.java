//package com.example.demo.util; 
// 
//import java.net.URI; 
//import java.net.URISyntaxException; 
//import java.security.NoSuchAlgorithmException; 
//import java.security.spec.InvalidKeySpecException; 
//import java.util.Calendar; 
//import java.util.Iterator; 
//import java.util.Locale; 
//import java.util.TimeZone; 
//import java.util.UUID; 
//import java.util.logging.Logger; 
// 
//import javax.json.Json; 
//import javax.json.JsonArray; 
//import javax.json.JsonObject; 
//import javax.json.JsonObjectBuilder; 
//import javax.json.JsonValue; 
//import javax.servlet.http.HttpServletRequest; 
//import javax.ws.rs.Consumes; 
//import javax.ws.rs.GET; 
//import javax.ws.rs.POST; 
//import javax.ws.rs.PUT; 
//import javax.ws.rs.Path; 
//import javax.ws.rs.PathParam; 
//import javax.ws.rs.Produces; 
//import javax.ws.rs.WebApplicationException; 
//import javax.ws.rs.core.Context; 
//import javax.ws.rs.core.MediaType; 
//import javax.ws.rs.core.Response; 
//import javax.ws.rs.core.Response.Status; 
// 
//import org.apache.commons.codec.binary.Base64; 
// 
//import com.ibm.cio.cloud.config.ServiceProperties; 
// 
// 
//@Path("/v2/emails") 
//public class EmailResource implements ServiceProperties { 
// 
//    private static final Logger LOGGER = Logger.getLogger(EmailResource.class.getName()); 
//    
//	 
//	@GET 
//    public String getMessage() { 
//        return MSG_SERVICE_ACTIVE + Calendar.getInstance().getTime().toString(); 
//	} 
//	 
//	@GET 
//	@Path("{emailId}") 
//    @Produces(MediaType.APPLICATION_JSON) 
//	public Response getMessage(@Context 			 final HttpServletRequest httpServletRequest, 
//			   				   @PathParam("emailId") final String emailId) throws URISyntaxException { 
//		 
//		 
//		return Response.ok().build(); 
//		 
//	} 
//	 
//	@PUT 
//	@Path("{emailId}/resend") 
//	@Produces(MediaType.APPLICATION_JSON) 
//	public Response resendEmail(@Context 				 final HttpServletRequest httpServletRequest, 
//				 				@PathParam("emailId")    final String emailId) throws URISyntaxException { 
//		 
//		LOGGER.info("Resend email id " + emailId); 
//		System.out.println("*** Resend email id " + emailId); 
//		return Response.ok().build(); 
//	} 
//	 
//	 
//	@GET 
//	@Path("{emailId}/status") 
//    @Produces(MediaType.APPLICATION_JSON) 
//	public Response getMessageStatus(@Context 				 final HttpServletRequest httpServletRequest, 
//			   						 @PathParam("emailId") final String emailId) throws URISyntaxException { 
//		return Response.ok().build(); 
//		 
//	} 
//	 
//	@POST 
//    @Consumes(MediaType.APPLICATION_JSON) 
//    @Produces(MediaType.APPLICATION_JSON) 
//    public Response queueEmail(@Context final HttpServletRequest httpServletRequest, final JsonObject jsonObject) { 
//		 
//		try { 
//			 
//			// Base URI 
//	        final URI baseMetadataURI = new URI(httpServletRequest.getScheme(), 
//	                null, 
//	                httpServletRequest.getServerName(), 
//	                httpServletRequest.getServerPort(), 
//	                httpServletRequest.getContextPath(), 
//	                null, 
//	                null); 
//	         
//	        //for now... 
//	       // String brokerUser = "bluemailuser"; 
//	        String brokerUser = validateUser(httpServletRequest) ; 
 //			 
 //			UUID docId = UUID.randomUUID(); 
 //			 
 //			//this will be used by the mail handler... 
 //			JsonObject mailJson = createBluemailJson(docId.toString(),brokerUser,jsonObject); 
 //				 
 // 
 //			EmailProcessor ep = EmailProcessor.getInstance(); 
 //			ep.sendEmail(mailJson); 
 //	 
 //			//cc.createDocument(docId.toString(), brokerUser, jsonObject); 
 //			 
 //			JsonObjectBuilder result = Json.createObjectBuilder(); 
 //			result.add(KEY_EMAIL, docId.toString()); 
 //			result.add(KEY_ID_PLAN, "unsupported"); 
 //			result.add(KEY_USERNAME, brokerUser); 
 //			 
 //			/*String statusPath = httpServletRequest.getContextPath() + "/emails/" + docId.toString() + "/status"; 
 //			 
 //			URI statusUri = new URI(httpServletRequest.getScheme(), 
 //                    null, 
 //                    httpServletRequest.getServerName(), 
 //                    httpServletRequest.getServerPort(), statusPath, null, null); */ 
 //			 
 //			result.add("link", Json.createArrayBuilder() 
 //					.add(Json.createObjectBuilder() 
 //							.add("rel", "status") 
 //							.add("href", baseMetadataURI + "/rest/v2/emails/" + docId.toString() + "/status") 
 //							.add("method", "GET") 
 //							.build()) 
 //					 
 //	    			.add(Json.createObjectBuilder() 
 //	    					.add("rel", "resend") 
 //	    					.add("href", baseMetadataURI + "/rest/v2/emails/" + docId.toString() + "/resend") 
 //	    					.add("method", "PUT") 
 //	    					.build()) 
 //					.build()); 
 //			 
 //			// 5) Bill 
 //			 
 //			 
 //			return Response.status(Status.CREATED).entity(result.build()).build(); 
 //	         
 //		} catch (WebApplicationException e) { 
 //	    	 
 //			e.printStackTrace(); 
 //	    	// Nothing to see here. Move along. 
 //	    	throw e; 
 //	         
 //	    } catch (Exception e) { 
 //	    	e.printStackTrace(); 
 //	        LOGGER.severe("Exception encountered during create: " + e.getLocalizedMessage());           
 //	        throw new WebApplicationException(createJSONResponse(Status.INTERNAL_SERVER_ERROR, "Exception encountered during email enqueue: " + e.getLocalizedMessage())); 
 //		} 
 //	} 
 //     
 //    private static Response createJSONResponse(final Status status, final String text) { 
 //        //LOGGER.info("Response status: " + status.getStatusCode() + ", text: " + text); 
 // 
 //    	final JsonObjectBuilder jsonObject = Json.createObjectBuilder(); 
 //        jsonObject.add("description", text); 
 // 
 //        return Response.status(status).type(MediaType.APPLICATION_JSON).entity(jsonObject.build()).build(); 
 //    } 
 // 
 //    private static Response createJSONResponse(final Status status, 
 //                                               final String header, 
 //                                               final String headerValue, 
 //                                               final String text) { 
 //    	 
 //    	final JsonObjectBuilder jsonObject = Json.createObjectBuilder(); 
 //        jsonObject.add("description", text); 
 // 
 //        return Response.status(status).header(header, headerValue).type(MediaType.APPLICATION_JSON).entity(jsonObject.build()).build(); 
 //    } 
 //     
 //	private static String validateUser(final HttpServletRequest request) { 
 //		String userId = System.getenv("USER"); 
 //		String password = System.getenv("PASSWORD"); 
 // 
 //		final String authorization = request.getHeader("authorization"); 
 //		if (authorization != null) { 
 //			if (authorization.startsWith("Basic ")) { 
 //				final String basicAuthEncoded = authorization.substring(6); 
 //				// Ryan, add apache common's codec 
 //				Base64 decoder = new Base64(); 
 //				final byte[] basicAuthDecoded = decoder.decode(basicAuthEncoded);// DatatypeConverter.parseBase64Binary(basicAuthEncoded); 
 // 
 //				final String[] split = new String(basicAuthDecoded).split(":"); 
 // 
 //				if (split.length == 2) { 
 // 
 //					if (userId.contentEquals(split[0]) && password.contentEquals(split[1])) { 
 //						return userId; 
 //					} 
 // 
 //				} 
 // 
 //			} 
 //		} 
 //		throw new WebApplicationException(createJSONResponse(Status.UNAUTHORIZED, "WWW-Authenticate", 
 //				"Basic realm=\"Restricted Area\"", "Not authorized")); 
 //	} 
 //     
 // 
 //     
 //	 
 // 
 //	 
 //	 
 //	 
 //	//moving from cloudant client 
 //	public JsonObject createBluemailJson(String id, String brokerUser, JsonObject document) { 
 //		 
 //		return metastampDocument(id,document, brokerUser); 
 //	} 
 //	 
 //	private JsonObject metastampDocument(String id, 
 //			JsonObject originalDocument, String brokerUser) { 
 //    	 
 //		Calendar now = Calendar.getInstance(TimeZone.getTimeZone(KEY_TIME_ZONE_GMT), Locale.ROOT); 
 //		long timestampMilli = timestampMilli(now); 
 //		JsonArray timestampMap = timestampMap(now); 
 //		 
 //		JsonObject ob = Json.createObjectBuilder() 
 //				.add("_id", id) 
 //				.add(KEY_USERNAME, brokerUser) 
 //    			.add(KEY_EMAIL, originalDocument) 
 //	    		.add(KEY_DATE_CREATION_MAP, timestampMap) 
 //	    		.add(KEY_DATE_CREATION, timestampMilli) 
 //	    		.add(KEY_DATE_UPDATE_MAP, timestampMap) 
 //	    		.add(KEY_DATE_UPDATE, timestampMilli) 
 //	    		.add(KEY_DISPATCHED, false) 
 //	    		.add(KEY_STATUS, MSG_EMAIL_QUEUED) 
 //	    		.add(KEY_MESSAGE_TYPE, MESSAGE_TYPE_EMAIL_V2) 
 // 
 //	    		.build(); 
 //         
 //    	return ob; 
 //	} 
 //	 
 //	private long timestampMilli(Calendar now) { 
 //		 
 //		return now.getTimeInMillis(); 
 //	} 
 //	 
 //	private JsonArray timestampMap(Calendar now) { 
 //		  //Calendar now = Calendar.getInstance(TimeZone.getTimeZone(KEY_TIME_ZONE_GMT), Locale.ROOT); 
 //		  int year = now.get(Calendar.YEAR); 
 //		  int month = now.get(Calendar.MONTH); 
 //		  month++; // Calendar.MONTH is zero-indexed 
 //		  int day = now.get(Calendar.DATE); 
 //		  int hours = now.get(Calendar.HOUR_OF_DAY); 
 //		  int minutes = now.get(Calendar.MINUTE); 
 //		  int seconds = now.get(Calendar.SECOND); 
 //		   
 //		  //String jsonDate = BRACKET_OPEN + year + COMMA + month + COMMA + day + COMMA + hours + COMMA + minutes + COMMA + seconds + BRACKET_CLOSE; 
 //		  
 //		  JsonArray dateArray = Json.createArrayBuilder() 
 //				  .add(year) 
 //				  .add(month) 
 //				  .add(day) 
 //				  .add(hours) 
 //				  .add(minutes) 
 //				  .add(seconds) 
 //				  .build(); 
 //		   
