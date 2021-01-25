package com.example.demo.controller;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.util.EhcacheUtils;
import com.example.demo.util.IBMSSOUtils;

import net.sf.json.JSONObject;

@RestController
@RequestMapping(value = "api/v1/", produces = "application/json; charset=UTF-8")
public class MainController {

	
	@Autowired
	private IBMSSOUtils ibmSSOUtils;

	@Autowired
	private EhcacheUtils ehcacheUtils;

	@Autowired
	protected HttpServletRequest request;

	@Autowired
	protected HttpServletResponse response;

	@GetMapping("/verify")
	public void verify() {
		System.out.println("20200527" + "monitor the MainController /verify");
		String ssoCode = ibmSSOUtils.retrieveSSOCode(request);
		String state = ibmSSOUtils.retrieveSSOState(request);
		System.out.println("state" + state);
		String redirectUri = request.getRequestURI();
		if (null == ssoCode) {
			System.out.println("20200530" + "monitor the MainController ssoCode is null");
			try {
				response.sendRedirect(ibmSSOUtils.loginUrlWithState(state, redirectUri));
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			try {
				System.out.println("20200530" + "monitor the MainController ssoCode is not null");
				System.out.println("MainController ssoCode== " + ssoCode);
				StringBuilder builder = new StringBuilder();
				builder.append("/api/v1/authorize?code=");
				builder.append(ssoCode);
				builder.append("&state=");
				builder.append(state);
				response.sendRedirect(builder.toString());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	@GetMapping("/authorize")
	public Object authorize() {
		
		System.out.println("20200524" + "monitor the MainController /authrize");
		JSONObject result = new JSONObject();
		result.put("method", "authorize");
		Enumeration<String> aEnumeration = request.getAttributeNames();
		while (aEnumeration.hasMoreElements()) {
			String name = aEnumeration.nextElement();
			if (name.contains(".")) {
				continue;
			}
			result.put(name, request.getAttribute(name));
			System.out.println("MainController /authorize name== " + request.getAttribute(name));
		}
		Enumeration<String> pEnumeration = request.getParameterNames();
		while (pEnumeration.hasMoreElements()) {
			String name = pEnumeration.nextElement();
			result.put(name, request.getParameter(name));
		}
		String state = ibmSSOUtils.retrieveSSOState(request);
		if (null != state) {
			JSONObject originalParameters = ehcacheUtils.getVerifyParameters(state);
			if (null != originalParameters) {
				result.put("originalParameters", originalParameters);
				ehcacheUtils.removeVerifyParameters(state);
			} else {
				result.put("isExpired", true);
			}
		}
		return result;
	}

	@GetMapping("/dummy")
	public Object dummy() {
		System.out.println("20200527" + "monitor the MainController /dummy");
		JSONObject result = new JSONObject();
		result.put("method", "dummy");
		Enumeration<String> aEnumeration = request.getAttributeNames();
		while (aEnumeration.hasMoreElements()) {
			String name = aEnumeration.nextElement();
			if (name.contains(".")) {
				continue;
			}
			result.put(name, request.getAttribute(name));
		}
		Enumeration<String> pEnumeration = request.getParameterNames();
		while (pEnumeration.hasMoreElements()) {
			String name = pEnumeration.nextElement();
			result.put(name, request.getParameter(name));
		}
		return result;
	}

//	@GetMapping("/samlauth")
//	public Object samlauth() {
//		JSONObject result = new JSONObject();
//		result.put("method", "samlauth");
//		Enumeration<String> aEnumeration = request.getAttributeNames();
//		while (aEnumeration.hasMoreElements()) {
//			String name = aEnumeration.nextElement();
//			if (name.contains(".")) {
//				continue;
//			}
//			result.put(name, null == request.getAttribute(name) ? null : request.getAttribute(name).toString());
//		}
//		Enumeration<String> pEnumeration = request.getParameterNames();
//		while (pEnumeration.hasMoreElements()) {
//			String name = pEnumeration.nextElement();
//			result.put(name, null == request.getParameter(name) ? null : request.getParameter(name).toString());
//		}
//		return result;
//	}

//	@RequestMapping("/landing")
//	public Object landing() {
//		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//		Assert.isInstanceOf(SAMLCredential.class, auth.getCredentials(),
//				"Authentication object doesn't contain SAML credential, cannot retrieve it.");
//		SAMLCredential credential = (SAMLCredential) auth.getCredentials();
//		JSONObject result = new JSONObject();
//		result.put("Name", auth.getName());
//		result.put("NameID", credential.getNameID().getValue());
//		result.put("LocalEntityID", credential.getLocalEntityID());
//		result.put("RelayState", credential.getRelayState());
//		result.put("RemoteEntityID", credential.getRemoteEntityID());
//		List<Attribute> attributes = credential.getAttributes();
//		attributes.forEach(attribute -> {
//			if (null != attribute.getName())
//				result.put(attribute.getName(), attribute.getAttributeValues().toString());
//		});
//		result.put("method", "landing");
//		return result;
//	}

	@GetMapping("/error")
	public Object error() {
		System.out.println("20200527" + "monitor the MainController /error");
		JSONObject result = new JSONObject();
		result.put("method", "error");
		Enumeration<String> aEnumeration = request.getAttributeNames();
		while (aEnumeration.hasMoreElements()) {
			String name = aEnumeration.nextElement();
			if (name.contains(".")) {
				continue;
			}
			result.put(name, null == request.getAttribute(name) ? null : request.getAttribute(name).toString());
		}
		Enumeration<String> pEnumeration = request.getParameterNames();
		while (pEnumeration.hasMoreElements()) {
			String name = pEnumeration.nextElement();
			result.put(name, null == request.getParameter(name) ? null : request.getParameter(name).toString());
		}
		return result;
	}

	public String prepareRedirectUrl(String url, HttpServletRequest request) {
		System.out.println("20200527" + "monitor the MainController /prepareRedirectUrl");
		StringBuilder builder = new StringBuilder(url);
		Enumeration<String> pEnumeration = request.getParameterNames();
		while (pEnumeration.hasMoreElements()) {
			String name = pEnumeration.nextElement();
			builder.append("&");
			builder.append(name);
			builder.append("=");
			builder.append(request.getParameter(name));
		}
		System.out.println("20200527 monitor the MainController builder== " + builder );
		return builder.toString();
	}

}
