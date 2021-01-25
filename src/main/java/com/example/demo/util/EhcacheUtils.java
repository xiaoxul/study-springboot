package com.example.demo.util;

import java.time.Duration;

import org.ehcache.Cache;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ExpiryPolicyBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.ExpiryPolicy;
import org.springframework.stereotype.Component;

import net.sf.json.JSONObject;

@Component
public class EhcacheUtils {
	private static final long DURATION = 15;
	private static CacheManager cacheManager = null;
	private static Cache<String, JSONObject> verifyParametersCache;

	static {
		ExpiryPolicy<? super String, ? super JSONObject> expirePolicy = ExpiryPolicyBuilder
				.timeToIdleExpiration(Duration.ofMinutes(DURATION));
		cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
				.withCache("verifyParametersCache",
						CacheConfigurationBuilder
								.newCacheConfigurationBuilder(String.class, JSONObject.class,
										ResourcePoolsBuilder.heap(2000))
								.withExpiry(expirePolicy))
				.build();
		cacheManager.init();
		verifyParametersCache = cacheManager.getCache("verifyParametersCache", String.class, JSONObject.class);
	}

	public JSONObject getVerifyParameters(String key) {
		return verifyParametersCache.get(key);
	}

	public void putVerifyParameters(String key, JSONObject parameters) {
		verifyParametersCache.put(key, parameters);
	}
	
	public void removeVerifyParameters(String key) {
		verifyParametersCache.remove(key);
	}
}