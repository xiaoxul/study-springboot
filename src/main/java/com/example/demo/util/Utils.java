package com.example.demo.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import javax.net.ssl.HttpsURLConnection;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

public class Utils {
	
	public static String generateUniqueKey() {
		StringBuilder key = new StringBuilder();
		key.append(System.currentTimeMillis());
		key.append(generateRandomSequence(9));
		return key.toString();
	}

	public static String generateToken() {
		StringBuilder key = new StringBuilder();
		key.append(System.currentTimeMillis());
		key.append(generateRandomSequence(9));
		return key.toString();
	}

	private static StringBuilder generateRandomSequence(int length) {
		char[] chars = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
				'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };
		int cursor = 0;
		StringBuilder sequence = new StringBuilder();
		while (cursor < length) {
			int index = (int) (Math.random() * 35);
			sequence.append(chars[index]);
			cursor++;
		}
		return sequence;
	}

	private static String buildBasicAuthorizationHeader(String username, String password) {
		return "Basic " + Base64.getEncoder().encodeToString((username + ":" + password).getBytes());
	}

	public static String sendPost(String strURL, JSONObject object) {
		try {
			HttpsURLConnection connection = buildHttpsURLConnection(strURL, "POST");
			connection.connect();
			return retrieveResponse(connection, object);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String sendPost(String strURL, String data) {
		System.out.println(" step into Utils sendPost logic");
		System.out.println("Utils sendPost logic strURL==  "+strURL);
		try {
			HttpsURLConnection connection = buildHttpsURLConnection(strURL, "POST",
					"application/x-www-form-urlencoded");
			connection.connect();
			return retrieveResponse(connection, data);
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println(" step out Utils sendPost logic");
		return null;
	}

	public static String sendPostWithBasicAuthorization(String strURL, JSONObject object, String username,
			String password) {
		try {
			HttpsURLConnection connection = buildHttpsURLConnection(strURL, "POST");
			connection.setRequestProperty("Authorization", buildBasicAuthorizationHeader(username, password));
			connection.connect();
			return retrieveResponse(connection, object);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	private static HttpsURLConnection buildHttpsURLConnection(String strURL, String method, String contentType)
			throws IOException {
		URL url = new URL(strURL);// 创建连接
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestMethod("POST"); // 设置请求方式
		connection.setRequestProperty("Content-Type", contentType); // 设置发送数据的格式
		return connection;
	}

	private static HttpsURLConnection buildHttpsURLConnection(String strURL, String method) throws IOException {
		URL url = new URL(strURL);// 创建连接
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestMethod("POST"); // 设置请求方式
		connection.setRequestProperty("Content-Type", "application/json"); // 设置发送数据的格式
		return connection;
	}

	private static String retrieveResponse(HttpsURLConnection connection, String data) throws IOException {
		OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8编码
		out.append(data);
		out.flush();
		out.close();
		int code = connection.getResponseCode();
		InputStream is = null;
		if (code == 200) {
			is = connection.getInputStream();
		} else {
			is = connection.getErrorStream();
		}
		// 读取响应
		int length = (int) connection.getContentLength();// 获取长度
		if (length != -1) {
			byte[] responseData = new byte[length];
			byte[] temp = new byte[512];
			int readLen = 0;
			int destPos = 0;
			while ((readLen = is.read(temp)) > 0) {
				System.arraycopy(temp, 0, responseData, destPos, readLen);
				destPos += readLen;
			}
			String result = new String(responseData, "UTF-8");
			return result;
		}
		return null;
	}

	private static String retrieveResponse(HttpsURLConnection connection, JSONObject object) throws IOException {
		OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8编码
		out.append(object.toString());
		out.flush();
		out.close();
		int code = connection.getResponseCode();
		InputStream is = null;
		if (code == 200) {
			is = connection.getInputStream();
		} else {
			is = connection.getErrorStream();
		}
		// 读取响应
		int length = (int) connection.getContentLength();// 获取长度
		if (length != -1) {
			byte[] data = new byte[length];
			byte[] temp = new byte[512];
			int readLen = 0;
			int destPos = 0;
			while ((readLen = is.read(temp)) > 0) {
				System.arraycopy(temp, 0, data, destPos, readLen);
				destPos += readLen;
			}
			String result = new String(data, "UTF-8");
			return result;
		}
		return null;
	}

	public static String sendGet(String urlParam, Map<String, Object> params, String charset) {
		StringBuffer resultBuffer = null;

		StringBuffer sbParams = new StringBuffer();
		if (params != null && params.size() > 0) {
			for (Entry<String, Object> entry : params.entrySet()) {
				sbParams.append(entry.getKey());
				sbParams.append("=");
				sbParams.append(entry.getValue());
				sbParams.append("&");
			}
		}
		HttpsURLConnection con = null;
		BufferedReader br = null;
		try {
			URL url = null;
			if (sbParams != null && sbParams.length() > 0) {
				url = new URL(urlParam + "?" + sbParams.substring(0, sbParams.length() - 1));
			} else {
				url = new URL(urlParam);
			}
			con = (HttpsURLConnection) url.openConnection();
			con.setRequestProperty("Content-Type", "application/json");
			con.setConnectTimeout(15000);
			con.setReadTimeout(30000);
			con.connect();
			resultBuffer = new StringBuffer();
			br = new BufferedReader(new InputStreamReader(con.getInputStream(), charset));
			String temp;
			while ((temp = br.readLine()) != null) {
				resultBuffer.append(temp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					br = null;
					e.printStackTrace();
				} finally {
					if (con != null) {
						con.disconnect();
						con = null;
					}
				}
			}
		}
		if (resultBuffer != null) {
			return resultBuffer.toString();
		}
		return null;
	}

	public static Map<String, JSONObject> loadConfiguration(String path) throws JSONException {
		BufferedInputStream in;
		try {
			in = new BufferedInputStream(new FileInputStream(path));
			Properties properties = new Properties();
			properties.load(in);
			Map<String, JSONObject> jobInfos = new HashMap<String, JSONObject>();
			for (Object key : properties.keySet()) {
				String[] keyParts = key.toString().split("\\.");
				if (keyParts.length != 2) {
					continue;
				}
				String id = keyParts[0];
				String field = keyParts[1];
				if (!jobInfos.containsKey(id)) {
					JSONObject info = new JSONObject();
					info.accumulate("id", id);
					info.accumulate(field, properties.get(key));
					jobInfos.put(id, info);
				} else {
					JSONObject info = jobInfos.get(id);
					info.accumulate(field, properties.get(key));
				}
			}
			return jobInfos;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

}