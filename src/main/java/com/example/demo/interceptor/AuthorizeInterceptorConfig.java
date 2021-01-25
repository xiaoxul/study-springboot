package com.example.demo.interceptor;

import java.util.Enumeration;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.util.EhcacheUtils;
import com.example.demo.util.IBMSSOUtils;

import net.sf.json.JSONObject;

import java.util.Date;  
import java.text.SimpleDateFormat; 


@Component
public class AuthorizeInterceptorConfig implements HandlerInterceptor {
	
	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	private static final String VERIFY_WITHSTATE_URL = "/api/v1/verify?state=";

	@Autowired
	private IBMSSOUtils ibmSSOUtils;

	@Autowired
	private EhcacheUtils ehcacheUtils;

	@Value("${ibm.introspectionUri}")
	private String introspectionUri;
	
	
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
	
		 

		// System.out.println(df.format(new Date()));
		
		System.out.println(df.format(new Date()) + "  monitor the interceptor prehandle");
		String ibmToken = null == request.getHeader("ibmToken") ? request.getParameter("ibmToken")
				: request.getHeader("ibmToken");
		
		System.out.println(" preHandle ibmToken=  " + ibmToken);
		
		String ibmRefreshToken = null == request.getHeader("ibmRefreshToken") ? request.getParameter("ibmRefreshToken")
				: request.getHeader("ibmRefreshToken");
		
		System.out.println("preHandle ibmRefreshToken=  " + ibmRefreshToken);
		
		boolean persistent = null == request.getParameter("persistent") ? true
				: request.getParameter("persistent").equals("true");
		
		System.out.println("preHandle persistent=  " + persistent);
		 
		String ssoCode = ibmSSOUtils.retrieveSSOCode(request);
		
		System.out.println("preHandle request=  " + request.toString());
		System.out.println("preHandle ssoCode=  " + ssoCode);
		 
		String redirectUri = request.getRequestURI();
		System.out.println("preHandle redirectUri=  " + redirectUri);
		
		if (null != ssoCode) {
			System.out.println("preHandle step into (null != ssoCode) logic");
			JSONObject object = ibmSSOUtils.doRetrieveAccessToken(ssoCode, redirectUri);
			//System.out.println("preHandle" + "object ==  "+object.toString());
			if (null == object) {
				System.out.println("preHandle step into (null == object) logic");
				//response.sendRedirect(storeVerifyParametersAndCreateRedirectUrl(request));
				String state = ibmSSOUtils.retrieveSSOState(request);
				response.sendRedirect(ibmSSOUtils.loginUrlWithState(state, redirectUri));
				return false;
			}
			ibmToken = object.getString(IBMSSOUtils.ACCESS_TOKEN);
			System.out.println("preHandle (null != ssoCode) ibmToken==  "+ibmToken);
			ibmRefreshToken = object.getString(IBMSSOUtils.REFRESH_TOKEN);
			System.out.println("preHandle (null != ssoCode) ibmRefreshToken==  "+ibmRefreshToken);
		}
		else
		{
			System.out.println(" preHandle step into else that (ssoCode is null");
			String state = ibmSSOUtils.retrieveSSOState(request);
			System.out.println("preHandle state==  "+state);
			System.out.println("preHandle redirectUri===  "+redirectUri);
			response.sendRedirect(ibmSSOUtils.loginUrlWithState(state, redirectUri));
			return false;
			//return true;
		}
		
		String intranetId = ibmSSOUtils.doIntrospect(ibmToken);
		System.out.println("preHandle we has steped out   ssoCode logic " );
		System.out.println("preHandle intranetId=  " + intranetId);
		
		if (null == intranetId) {
			System.out.println("preHandle step into (intranetId==null) logic");
			if (null != ibmRefreshToken) {
				System.out.println("preHandle step into null != ibmRefreshToken logic");
				JSONObject refreshResult = ibmSSOUtils.doRefreshToken(ibmRefreshToken);
				System.out.println("preHandle" + "refreshResult ==  "+refreshResult.toString());
				if (null != refreshResult) {
					ibmToken = refreshResult.getString(IBMSSOUtils.ACCESS_TOKEN);
					ibmRefreshToken = refreshResult.getString(IBMSSOUtils.REFRESH_TOKEN);
					intranetId = ibmSSOUtils.doIntrospect(ibmToken);
					request.setAttribute("intranetId", intranetId);
					request.setAttribute("ibmToken", ibmToken);
					request.setAttribute("ibmRefreshToken", ibmRefreshToken);
					return true;
				}
			}
			if (persistent) {
				System.out.println("preHandle" + " step into persistent  logic");
//				response.sendRedirect(storeVerifyParametersAndCreateRedirectUrl(request));
//				return false;
			}
			request.setAttribute("redirectUrl", ibmSSOUtils.loginUrl(redirectUri));
			return true;
		}
		request.setAttribute("intranetId", intranetId);
		System.out.println("preHandle step out all the logic  and intranetId= " + intranetId);
		request.setAttribute("ibmToken", ibmToken);
		System.out.println("preHandle ibmToken" + "  ibmToken is set");
		request.setAttribute("ibmRefreshToken", ibmRefreshToken);
		System.out.println("preHandle ibmRefreshToken" + "   ibmRefreshToken is set");
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println(df.format(new Date()) + "preHandle  " + "monitor the interceptor postHandle has finished");

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println(df.format(new Date()) + "preHandle  " + "monitor the interceptor afterCompletion has finished ");

	}

	private String storeVerifyParametersAndCreateRedirectUrl(HttpServletRequest request) {
		
		System.out.println("preHandle  " + "monitor storeVerifyParametersAndCreateRedirectUrl");
		JSONObject parameters = new JSONObject();
		Enumeration<String> pEnumeration = request.getParameterNames();
		while (pEnumeration.hasMoreElements()) {
			String name = pEnumeration.nextElement();
			parameters.put(name, request.getParameter(name));
		}
		String state = UUID.randomUUID().toString();
		ehcacheUtils.putVerifyParameters(state, parameters);
		return VERIFY_WITHSTATE_URL + state;
	}

}