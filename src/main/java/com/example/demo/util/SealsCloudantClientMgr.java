package com.example.demo.util;

import java.util.Map.Entry;
import java.util.Set;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.org.lightcouch.CouchDbException;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class SealsCloudantClientMgr {

	private static CloudantClient cloudant = null;
	private static Database db = null;

	private static String databaseName = "student";

	//private static String user = "7f855e37-076d-4833-9a39-b0b7bdf5e7e1-bluemix";
	private static String user = "8489d4df-bbab-418d-a456-dde293219537-bluemix";
	//private static String password = "61bb2256d0ca105f31f2504952810236a37f35f521570f85eaa1874491e93d1b";
	private static String password = "d297aaf0af61e8ec95629a48f69fcc253d2a48e676707c6b4cc260c536f3afb7";
	private static void initClient() {
		if (cloudant == null) {
			synchronized (SealsCloudantClientMgr.class) {
				if (cloudant != null) {
					return;
				}
				cloudant = createClient();

			}
		}
	}

	private static CloudantClient createClient() {
		
			System.out.println("running locally.");

		try {
			System.out.println("Connecting to Cloudant : " + user);
			CloudantClient client = ClientBuilder.account(user)
					.username(user)
					.password(password)
					.build();
			return client;
		} catch (CouchDbException e) {
			throw new RuntimeException("Unable to connect to repository", e);
		}
	}

	public static Database getDB() {
		if (cloudant == null) {
			initClient();
		}

		if (db == null) {
			try {
				db = cloudant.database(databaseName, true);
			} catch (Exception e) {
				throw new RuntimeException("DB Not found", e);
			}
		}
		return db;
	}

	private SealsCloudantClientMgr() {
	}
}
