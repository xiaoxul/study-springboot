package com.example.demo.util;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.stereotype.Component;

import net.sf.json.JSONObject;

import java.text.SimpleDateFormat; 
@Component
public class IBMSSOUtils {
	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Value("${ibm.clientId}")
	private String clientId;

	@Value("${ibm.clientSecret}")
	private String clientSecret;

	@Value("${ibm.accessTokenUri}")
	private String accessTokenUri;

	@Value("${ibm.userAuthorizationUri}")
	private String userAuthorizationUri;

	@Value("${ibm.introspectionUri}")
	private String introspectionUri;

	@Value("${ibm.redirectUri}")
	private String redirectUri_;

	public final static String ACCESS_TOKEN = "access_token";
	public final static String REFRESH_TOKEN = "refresh_token";
	public final static String USER_ID = "intranetId";
	
	private final static String PARAMETER_STRING = "response_type=code&scope=openid";

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}

	public String loginUrl(String redirectUri) {
		System.out.println(df.format(new Date())+ "step into  IBMSSOUtils loginUrl ");
		StringBuilder builder = new StringBuilder();
		builder.append(userAuthorizationUri);
		builder.append("?");
		builder.append(PARAMETER_STRING);
		builder.append("&client_id=");
		builder.append(clientId);
		builder.append("&redirect_uri=");
		builder.append(redirectUri_ + redirectUri);
		return builder.toString();
	}

	public String loginUrlWithState(String state, String redirectUri) {
		System.out.println(df.format(new Date())+ "  step into  IBMSSOUtils loginUrlWithState ");
		StringBuilder builder = new StringBuilder();
		System.out.println("loginUrlWithState() userAuthorizationUri==  "+userAuthorizationUri);
		builder.append(userAuthorizationUri);
		builder.append("?");
		System.out.println("PARAMETER_STRING==  "+PARAMETER_STRING);
		builder.append(PARAMETER_STRING);
		
		System.out.println("loginUrlWithState() client_id==  "+ clientId);
		builder.append("&client_id=");
		builder.append(clientId);
		
		System.out.println("loginUrlWithState() redirectUri_==  "+ redirectUri_);
		System.out.println("loginUrlWithState() redirectUri==  "+ redirectUri);
		builder.append("&redirect_uri=");
		builder.append(redirectUri_ + redirectUri);
		
		System.out.println("loginUrlWithState() state==  "+ state);
		System.out.println("loginUrlWithState() builder==  "+ builder.toString());
		//builder.append("&state=");
		//builder.append(state);		
		System.out.println(df.format(new Date())+ "  step out  IBMSSOUtils loginUrlWithState ");
		
		return builder.toString();
		
	}
	
	/**
	 * 
	 * @param request
	 * @return sso code
	 */
	public String retrieveSSOCode(HttpServletRequest request) {
		System.out.println(df.format(new Date())+"  step into  IBMSSOUtils retrieveSSOCode ");
		System.out.println(df.format(new Date())+ "  step out  IBMSSOUtils retrieveSSOCode ");
		return request.getParameter("code");
		
	}

	public String retrieveSSOState(HttpServletRequest request) {
		System.out.println(df.format(new Date())+"  step into  IBMSSOUtils retrieveSSOState ");
		System.out.println(df.format(new Date())+ "  step out  IBMSSOUtils retrieveSSOState ");
		return request.getParameter("state");
	}
	
	/**
	 * 
	 * @param code
	 * @return null or json object which contains access_token and refresh_token
	 */
	public JSONObject doRetrieveAccessToken(String code, String redirectUri) {
		System.out.println(df.format(new Date())+ "  step into  IBMSSOUtils doRetrieveAccessToken() ");
		
		System.out.println(" IBMSSOUtils.java doRetrieveAccessToken() redirectUri== "+redirectUri);
		System.out.println(" IBMSSOUtils.java code== "+code);
		// step 1: build access token request data.
		String data = buildTokenRequestData(code, redirectUri);
		// step 2: retrieve access token
		String responseContent = Utils.sendPost(accessTokenUri, data);
		System.out.println(df.format(new Date())+ "  step out  IBMSSOUtils doRetrieveAccessToken() ");
		return processTokenData(JSONObject.fromObject(responseContent));

	}

	/**
	 * 
	 * @param refreshToken
	 * @return null or json object which contains access_token and refresh_token
	 */
	public JSONObject doRefreshToken(String refreshToken) {
		System.out.println(df.format(new Date())+ " step into  IBMSSOUtils  doRefreshToken" );
		// step 1: build refresh token request data
		String data = buildTokenRefreshData(refreshToken);
		// step 2: refresh access token
		String responseContent = Utils.sendPost(accessTokenUri, data);
		System.out.println(df.format(new Date())+ " step out  IBMSSOUtils  doRefreshToken" );
		return processTokenData(JSONObject.fromObject(responseContent));
	}

	/**
	 * 
	 * @param accessToken
	 * @return null or user intranet email
	 */
	public String doIntrospect(String accessToken) {
		System.out.println(df.format(new Date())+ " step into  IBMSSOUtils  doIntrospect()" );
		// step 1: build introspect request data
		String data = buildIntrospectData(accessToken);
		// step 2: introspect
		String responseContent = Utils.sendPost(introspectionUri, data);
		System.out.println(df.format(new Date())+  "  step out  IBMSSOUtils  doIntrospect()" );
		return processIntrospectData(JSONObject.fromObject(responseContent));
		
	}

	private String buildTokenRequestData(String code, String redirectUri) {
		System.out.println(df.format(new Date())+ " step into  IBMSSOUtils  buildTokenRequestData()" );
		StringBuilder builder = new StringBuilder();
		builder.append("client_id=");
		builder.append(clientId);
		builder.append("&client_secret=");
		builder.append(clientSecret);
		builder.append("&code=");
		builder.append(code);
		builder.append("&grant_type=authorization_code&redirect_uri=");
		builder.append(redirectUri_ + redirectUri);
		System.out.println(" IBMSSOUtils  buildTokenRequestData() builder==  " +builder);
		System.out.println(df.format(new Date())+ " step out  IBMSSOUtils  buildTokenRequestData()" );
		return builder.toString();
	}

	private String buildTokenRefreshData(String refreshToken) {
		StringBuilder builder = new StringBuilder();
		builder.append("client_id=");
		builder.append(clientId);
		builder.append("&client_secret=");
		builder.append(clientSecret);
		builder.append("&grant_type=refresh_token");
		builder.append("&refresh_token=");
		builder.append(refreshToken);
		return builder.toString();
	}

	private String buildIntrospectData(String accessToken) {
		StringBuilder builder = new StringBuilder();
		builder.append("client_id=");
		builder.append(clientId);
		builder.append("&client_secret=");
		builder.append(clientSecret);
		builder.append("&token=");
		builder.append(accessToken);
		return builder.toString();
	}

	private String processIntrospectData(JSONObject object) {
		if (object.has("sub")) {
			if (object.has("active") && true == object.getBoolean("active")) {
				return object.getString("sub");
			}
		}
		return null;
	}

	private JSONObject processTokenData(JSONObject object) {
		if (object.has("access_token") && object.has("refresh_token")) {
			JSONObject storedUserSign = new JSONObject();
			storedUserSign.put(ACCESS_TOKEN, object.get(ACCESS_TOKEN));
			storedUserSign.put(REFRESH_TOKEN, object.get(REFRESH_TOKEN));
			return storedUserSign;
		}
		return null;
	}
}