/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] =
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "69d912533634ca953234"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(218)(__webpack_require__.s = 218);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
})

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false && isObject(value) && ('@binding' in value))
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if (process.env.NODE_ENV !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    // reset _rendered flag on slots for duplicate slot check
    if (process.env.NODE_ENV !== 'production') {
      for (var key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false;
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
}

var builtInComponents = {
  KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.16';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
}

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
}

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
]

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
}

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
}

/*  */

/*  */









// add a raw attr (use this in preTransforms)








// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
}

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {}

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
}

var platformDirectives = {
  model: directive,
  show: show
}

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
}

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
}

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
}

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7), __webpack_require__(10), __webpack_require__(66).setImmediate))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = Object.create(options.computed || null)
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
    options.computed = computed
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(185)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(15);
var isBuffer = __webpack_require__(64);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/626008584984ba712d13c6053cec5358.jpg";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(5);
var normalizeHeaderName = __webpack_require__(31);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(11);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(11);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(5);
var settle = __webpack_require__(23);
var buildURL = __webpack_require__(26);
var parseHeaders = __webpack_require__(32);
var isURLSameOrigin = __webpack_require__(30);
var createError = __webpack_require__(14);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(25);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(28);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(22);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);
var bind = __webpack_require__(15);
var Axios = __webpack_require__(19);
var defaults = __webpack_require__(9);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(12);
axios.CancelToken = __webpack_require__(18);
axios.isCancel = __webpack_require__(13);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(33);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(12);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(9);
var utils = __webpack_require__(5);
var InterceptorManager = __webpack_require__(20);
var dispatchRequest = __webpack_require__(21);
var isAbsoluteURL = __webpack_require__(29);
var combineURLs = __webpack_require__(27);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);
var transformData = __webpack_require__(24);
var isCancel = __webpack_require__(13);
var defaults = __webpack_require__(9);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(14);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(5);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.accessibility-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.design-standards-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.feedback-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.support-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.mobile-nav-chooser {\n    padding: 10px 30px;\n    -webkit-transition: width 2s;\n    cursor: pointer;\n}\n.nav-indent a, .nav-indent {\n\tpadding: 10px 20px !important;\n}\n.nav-home a, .nav-home {\n\tfont-size: .81579rem !important;\n    letter-spacing: .02632rem !important;\n    font-weight: 500 !important;\n}\n.ds-side-nav .nav-sub {\n\tfont-size: .81579rem !important;\n    letter-spacing: .02632rem !important;\n    font-weight: 500 !important;\n\tpadding: 10px 40px !important;\n\twidth: 100%;\n\tdisplay: block;\n\tmargin: 0;\n}\n.ds-side-nav .nav-home a {\n\tfont-weight: 500 !important;\n\tpadding: 10px 20px;\n\twidth: 100%;\n\tdisplay: block;\n\tmargin: 0;\n}\n.ds-side-nav .nav-link a.router-link-exact-active {\n\tbackground-color: #edf3f7;\n\tborder-left: 5px solid #00598a;\n}\n.nav-indent {\n\tmargin-left: 20px;\n}\n.mobile-nav {\n\tmargin-bottom: 0;\n\tpadding-bottom: 0;\n}\n.desktop-nav .ds-side-nav {\n\tpadding-right: 10px;\n}\n.ds-side-nav .ds-nav-item a {\n\twidth: 100%;\n\tdisplay: block;\n\tmargin-bottom: 0;\n}\n@media only screen and (max-width: 778px) {\n.mobile-nav {\n \t\tdisplay: block;\n}\n.desktop-nav {\n \t\tdisplay: none;\n}\n.ds-side-nav {\n \t\tborder-right: none;\n}\n}\n@media screen and (min-width: 779px) {\n.mobile-nav {\n\t\tdisplay: none;\n}\n.desktop-nav {\n\t\tdisplay: block;\n}\n}\n\t\n", ""]);

// exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.urls-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.monitoring-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.search-container[data-v-632f642d] {\n  display: flex;\n  flex-direction: row;\n}\n.search-container label[data-v-632f642d] {\n    align-self: center;\n    white-space: nowrap;\n}\n.search-container i[data-v-632f642d] {\n    align-self: center;\n    margin-left: -30px;\n    z-index: 1;\n}\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.hosting-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.no-more-space {\n  margin-bottom: -25px;\n}\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.findability-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.landing-hero {\n\tbackground-image: url(" + escape(__webpack_require__(75)) + ");\n\tbackground-size: cover;\n\tmin-height: 200px;\n}\n.eco-img {\n\tpadding: 20px;\n\tmargin: 40px 20px;\n}", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.security-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.ds-tab-controls .ds-button {\n  border-color: #d1d1d1;\n  width: 200px;\n}\n.ds-tab-controls .ds-button:first-child {\n  border-left-width: 2px;\n}\n.ds-tab-controls .ds-button:last-child {\n  border-right-width: 2px;\n}\n", ""]);

// exports


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.usability-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.site-building-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n.guidance-table td {\n\twhite-space: normal !important;\n}", ""]);

// exports


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(6);
exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "\n.centralized-assets-hero {\n\tbackground-image: url(" + escape(__webpack_require__(8)) + ");\n\tbackground-size: cover;\n\tmin-height: 400px;\n}\n", ""]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6â€“8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(7)))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(65);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(72);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(166)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(116),
  /* template */
  __webpack_require__(133),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/masthead/masthead.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] masthead.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-50bf6e0d", Component.options)
  } else {
    hotAPI.reload("data-v-50bf6e0d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 69 */,
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_w3ds_w3ds_css__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_w3ds_w3ds_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vendor_w3ds_w3ds_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_debug__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_debug__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__global___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__global__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_vue__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__app_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__router__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__store_store__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_library_js__ = __webpack_require__(196);
// Imports











__WEBPACK_IMPORTED_MODULE_1_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_7__components_library_js__["a" /* default */]);

/**
 * Application entry
 */

// Toggle debugger based on deployed environment
if (false) {
  debug.disable();
} else {
  __WEBPACK_IMPORTED_MODULE_2_debug__["enable"]('*');
}

// Go!
const app = new __WEBPACK_IMPORTED_MODULE_1_vue__["default"]({ // eslint-disable-line no-unused-vars
  router: __WEBPACK_IMPORTED_MODULE_5__router__["a" /* default */],
  el: window.APP_PARENT_SELECTOR,
  store: __WEBPACK_IMPORTED_MODULE_6__store_store__["a" /* default */],
  render: h => h(__WEBPACK_IMPORTED_MODULE_4__app_vue___default.a),
  template: '<App/>',
  components: {},
});


/***/ }),
/* 71 */,
/* 72 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(74);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 73 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 74 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/cfe9ede7db4262f575755488739feb9f.png";

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/a8ff5490cc4c59feb51dc3796b132daa.png";

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0cAAAGCCAYAAAArALitAAAAAXNSR0IArs4c6QAAQABJREFUeAHsnQeYVEXWhg8MQ845Z5QgSUCUJJgD5pzXsLr+ZlwMu2tYXXPOcY2rrjmuYgAEFBAEFQQkIzlnmED6v7eGO/Q0PcMAA07DqYemp++9Vbfqq1NVJ9WpIhs2bNhknhwBR8ARcAQcAUfAEXAEHAFHwBHYyxEoupe335vvCDgCjoAj4Ag4Ao6AI+AIOAKOQEDAhSMnBEfAEXAEHAFHwBFwBBwBR8ARcASEgAtHTgaOgCPgCDgCjoAj4Ag4Ao6AI+AICIFieaFQpEiRvG77PUfAEXAEHAFHwBFwBBwBR8ARcASSGoFNm7aEYEgoHCEUpaWl2dy5c5O6oV55R8ARcAQcAUfAEXAEHAFHwBFwBBIhgFBUunRpq127tkUCUkLhiMzr16+3zMwMq1qlsh5OVJxfcwQcAUfAEXAEHAFHwBFwBBwBRyD5EMBBLj093dauXZuj8rkKRzyVkpISpKlIksqR0384Ao6AI+AIOAKOgCPgCDgCjoAjkIQIRNuHMtetyVH7PIUjnkQwcuEoB2b+wxFwBBwBR8ARcAQcAUfAEXAEkhyBRDKOR6tL8k716jsCjoAj4Ag4Ao6AI+AIOAKOQMEg4MJRweDopTgCjoAj4Ag4Ao6AI+AIOAKOQJIj4MJRknegV98RcAQcAUfAEXAEHAFHwBFwBAoGAReOCgZHL8URcAQcAUfAEXAEHAFHwBFwBJIcAReOkrwDvfqOgCPgCDgCjoAj4Ag4Ao6AI1AwCLhwVDA4eimOgCPgCDgCjoAj4Ag4Ao6AI5DkCLhwlOQd6NV3BBwBR8ARcAQcAUfAEXAEHIGCQcCFo4LB0UtxBBwBR8ARcAQcAUfAEXAEHIEkR8CFoyTvQK++I+AIOAKOgCPgCDgCjoAj4AgUDAIuHBUMjl6KI+AIOAKOgCPgCDgCjoAj4AgkOQIuHCV5B3r1HQFHwBFwBBwBR8ARcAQcAUegYBBw4ahgcPRSHAFHwBFwBBwBR8ARcAQcAUcgyRFw4SjJO9Cr7wg4Ao6AI+AIOAKOgCPgCDgCBYOAC0cFg6OX4gg4Ao6AI+AIOAKOgCPgCDgCSY6AC0dJ3oFefUfAEXAEHAFHwBFwBBwBR8ARKBgEXDgqGBy9FEfAEXAEHAFHwBFwBBwBR8ARSHIEXDhK8g706jsCjoAj4Ag4Ao6AI+AIOAKOQMEg4MJRweDopTgCjoAj4Ag4Ao6AI+AIOAKOQJIj4MJRknegV98RcAQcAUfAEXAEHAFHwBFwBAoGAReOCgZHL8URcAQcAUfAEXAEHAFHwBFwBJIcAReOkrwDvfqOgCPgCDgCjoAj4Ag4Ao6AI1AwCLhwVDA4eimOgCPgCDgCjoAj4Ag4Ao6AI5DkCLhwlOQd6NV3BBwBR8ARcAQcAUfAEXAEHIGCQcCFo4LB0UtxBBwBR8ARcAQcAUfAEXAEHIEkR8CFoyTvQK++I+AIOAKOgCPgCDgCjoAj4AgUDAIuHBUMjl6KI+AIOAKOgCPgCDgCjoAj4AgkOQIuHCV5B3r1HQFHwBFwBBwBR8ARcAQcAUegYBBw4ahgcPRSHAFHwBFwBBwBR8ARcAQcAUcgyRFw4SjJO9Cr7wg4Ao6AI+AIOAKOgCPgCDgCBYOAC0cFg6OX4gg4Ao6AI+AIOAKOgCPgCDgCSY6AC0dJ3oFefUfAEXAEHAFHwBFwBBwBR8ARKBgEXDgqGBy9FEfAEXAEHAFHwBFwBBwBR8ARSHIEXDhK8g706jsCjoAj4Ag4Ao6AI+AIOAKOQMEg4MJRweDopTgCjoAj4Ag4Ao6AI+AIOAKOQJIj4MJRknegV98RcAQcAUfAEXAEHAFHwBFwBAoGAReOCgZHL8URcAQcAUfAEXAEHAFHwBFwBJIcAReOkrwDvfqOgCPgCDgCjoAj4Ag4Ao6AI1AwCLhwVDA4eimOgCPgCDgCjoAj4Ag4Ao6AI5DkCLhwlOQduDdUv0iRIsbHkyOwJyLgtL0n9qq3KULA6TtCwr8dAUcgWRBw4ShZemoPquf2CDspKSm2bt0627hxkwtIexAN7KlNiWg7vwwh9J2RkWFFixZ1+t5TiWIPatf20Hf0LPQNnXtyBBwBRyBZEHDhKFl6ag+p56ZNmywzMzN8Nm7cmGerUlNT7fvvh9ppp59pV151lS1btiwwkXlmyuMmDGixYsW0UDvZ5wGT39oJBNavXx9oG4F+WwmG8fX/vGEnn3yq3X3PvbZhw4adEpAoD/rOr2AW1Y/ns8aFM7ARJv6dGAHomvkbOs8rQVM8+89/3mknn3Kavfvue4HG8sqT171Ao6JvaHx76Tua9/mOTfxes2aNXXddHzvhxJPttddeUx19DMRi5H87AnsrAjlni70VBW/3bkGgePFUGzt2rJ119jlB4Bky5DvjWl6p35df2pgxY+ybb/rbhAm/7fACy4K6fPlymzZtui1YsCivV/o9R2CHEIBxe/XV1+wkCTuXXna5rVq1KldhHnpEo/7BBx/axEmT7KOPPt4p4R+lw9y5c236jBm2evXqfDOQ1GP16jU2ffoM5Z9nlOPJEYhHADpBKLrlllsDfd911z2BVrieKCF4LFiwwD7+5GObOHGiffTxJ0FYyu35RGVE18iDoDVj5kybOWtWqEd+y+G5JUuWhHmf7/iEgm7ylClhXZo3b36+x018Of7bEXAE9iwEXDjas/qzULeGhWrN2rX2228T9fnNVqxYsc3F6MADO1udOnWsXbu21rhxo6Bd35FGYoV6X4zoqaedbg8/8qi7Me0IiJ4nTwSgbxjCCRMm2BQxXFiCcksIIcWLF7eDe/SwatWqWdeuXa18+fJyH83bmpqoPN4L83jz3/5uZ599rg0cOGibSoeoHOowZMgQO/Oss8X43rLDDGxUnn/vuQhAszN+/z3Q96zZs/NsKM9WqVLFunTpEui7R/euQbG1I8I3Sof5GlcXXXSxXXrpX+x31YFr+UnQ9/MvvGinnHq6vfzyKwnzYTVlfchvmfl5rz/jCDgCyY1AseSuvtc+2RCAkWMh4jvezSG+LTB8Rx15pLVr285KlSpplSpVSshwxpYFc5loAdbrLC0tzRYuXGgrJZTtaKLOvI93bC8jG+XNi2mOrVf0/I68K7Yc/3v3IQCDBX3DcG0r0a+XX36Z3I5OssqibRi5RLSbHzqAJnE7XbRokaWnp29T6RDVjbIzMjPCuKhdq1bC90fPFvR3ftpV0O/08nYOgfwKEsyNpUuXtvvuvSdY7GvUqJHrfJkfOqC8RYsWhzGS3/mTllL2GllSmfex5OY3MY4Let7NTzvj67cjeeLL8N+OgCOw/QhsewXf/jI9hyNQYAiwODRoUD8srAhLsYl7LNZrZY1aunSpFjOzypUrWZkyZYIQFS2iPMffs6XtjDSE0eLH9UQMaex7+Jv3wIDynpVaZEuVLGlVq1YN13E3iU+xixr5SCzuGzdtsGpVq4V88e2JyqCOMAO4gWBpK1e2rNpVWe83afbz9vWPyvDvwo8AdFeiRAlr3CjLIhq/jwM64JkVK1cGgZ5n0cZzHdqJ6JbfMH/Ll68IdAVth0/RFNuwMXfrFTRqtsnmzJkTaDs7n/JH4wLazXrOtlJMRDQO0tBrVB9+55UvGksIcyvVtpLbGEuU5yn5EIAmsIai1IK2o/k4agnKAK5DB2vWaJ4rVzY8C+1EcyN/Qy+z5FIHfUGj0B3flM8nt8QzrA0LFy7KMe/zfG75eNeG9RuCBZj3MMen6Htd3B6rWPqmrKx6FQnlbtiQcyyEcaxnlmjtWK09TmW1PjGOY9sZ3wbyUC552BeVnzzxZfhvR8AR2HEEXDjacew85y5GgAXii3797KV/v2wVKlawO/55u9WsWTMssixGCCpvvPmmDRjwrS1fsdyKSDiqJCHi4IN72NlnnSkhpKpYP5NbxQv25ZdfB3cMBKdffvnFzj3vgrDY3nTjDbbffq3y3GBMPcaNG2evvf4f5R2jBXdN0GA2adzEztJ7evToHhayiDnk+5ZbbtNekol2SK9edvJJJ9mDDz9sP/38iyEm1ald2y677M/B5SSeIWZx/n7oUHvzzbeCr356eoaVLlXKWqmO559/nrVv1y6bcdjF8HvxuxgBmK9nn3ve+vcfYC1aNLe/3XxTtvUIOvhFe+3YwzR+/ITAIMFM1qtXL9DTUUcdEZhGhIurrr420DZuqtDqy6+8EvZ61K1b12695R9BAItoM2pSiRLF7f33P7TXRdNz580LWn5cpS6+5FLJS5vswosulNX2CHv66Wfsy6++sv3bt7e+ff8amEDKQlCj3tS/TJnSdvttt8n9tXYYBzB91As3v5UrV9mVV1we3AZheFNTi4W9g6+99noYDzCvxVXnxk0a2zlnn62x1E3jOydzGdXZv5MHAWibvr3zzrts6rRpduyxx9ifLjg/zN3QB58vtZ/0rf++bbNmzQ7770qXLmUtmreQa+hZ1rFjh/AMe1QfeOAhgzbJE/Y93Xq7pWp89OzV0/58ycWB5mKR4Tlo9MEHH7LvFNBnpgSrsmXL2LeDBts555xnJUqWCGOtadOmsdnC2Jk0abI9+NDDwfW7aNEi1rBBQ7tC9NtO8240VzM2J0+ebHf+664wF1/fp4/WpRr25ltvaX/sWLv4ogvtsMMOC23i2eHDfwjrFK7kaWnp8oIoZS1btrDzzzvPOnTYf6v5nDzDhg+3N954037Tfq30zXlatWqpPOfa/vtvnSdHQ/yHI+AI7DQCLhztNIRewK5CgAUWjfjwH34IfusICix8RfVh0/nf/36LffX114GhrF69eli8WEx//vlnGzJ4iD311BNWW4LIlKnT7McffwxaTMpcJkFqgRYfFlCYOMrMLcFsDpWw0veGG6VhnyemsLhVrFhRVp2lNlXlIsjc0LevBJdzcyxy48aPt1GjRlmVylVsxIgRNljBJ0rJzWSdrEws1hO0UD7/3LPWvv0WYQfml6hOLLowumgX0VwuEAaTtWF/6NBhdu89d9shh/QKTEJudfbryYPA9OnTA30jkGzarAWHOUKA/78rrrL58+eLsSsrWqgclAHTxGh+//33Nm78hXbjDX0DswltE2wEpgtapkz2PSFw5aYhZxxgMRr+wwjRc4Ug9KChHjlyZKDjY4492oqXKCmNdVnR8Whp0hfaZX+5LLj/MW6wAgwYMNB+0NgMzNywYYGpxaWP3zCZgzUGS5YsZbXkrkc9GEswitdrvMydMzeMW8bS0qVLAgMNQ4iyAiEJQcpTciMAjYwd96uNlcDQWsqdaJ6FPt5++x375x13BgECyxI0Pnv2HCmEJtmAgQMlVN1hp55ycpifmf+hV+ZH6Ig5Hhfp+vIoiMpMhNQE7W39WQqp8uXLhfy4nM5SQAfeBa3H5g1rje5f1+ev9uuvvwbhPzNTQSBm/B4CNvz7xeetSZMmYY0hH/l//HGUrVcbR//0k3322f/sJ30TZKX3scdqPGXV98MPPwrtZHzSTvYXsqZ98smnYT6/55677HAJUpH3AW18/4MP7I47WANy5vlYQS1YA8hz2KGHZudJ1Ha/5gg4AjuHgAtHO4ef597FCESLIoxVtJilagEZquh1/QcMCAsODFX37t3CQvWDmK/Hn3giaKLxeUfbd8lFF9pxvY+1Rx99TAvrr0EreeUVVwThqHnzfbM1gvFN4d0IKQ89/IgRyajD/u3t2muvCW5+LHYvvPhvaT+/knb9aTvggE627777ZJcFA8AiPFKM66GHHmLvvvO2lZXbCAzlc8+9EFxJ3njjDWvbtk14LZYwFuLHn3gyLLzH9e5tV111hVWWgDRPUcjuvff+oE187PEnrL3qgatdboxvfDv8d+FFgH6HIYJeSNA4/frGG2+F6HPtZbG59dZ/WC1ZTHGve0dM5Wf/+9yailEjYQl96qknFY1ratCwwzRiYezVs2cQRigbYSY+wYz1Fo21adNms/V1YGD++v71+pCvcePG0livtf2l2UZIR4nwm6JFMs5IjIsfR/0YXOJggkdIqDr99NPCPdqEpZW6dJCWu3btOuE6ZTwkC+o8RcVr27at9elzrTTzDWT1XWH//ve/7YsvvrQnnnjKOnXsZM2aNc0eSyGz/5eUCGDhgQahCRJzKnMnFlEEiROOP96uvPL/gmBPtMSnn3nWfp/5u9WrW0cCcqY1b97cXn/tVRv47aAQaps5/eabbrT69etLcVQl4RwY0Tv0deaZZ9gjCsAzdepUKZUOsfPOPSeMMfJHliDqxfgbOPBbO/qooxR+/LZQ508//cz+o1D7KBHeffd9u+mmG3g0JMYpaxIfrPzkP+643laiuNxkNXaoA27czNfsdaLcq6660qpXr2bzpPC4T/P5UCkUHn308WCVrVChQqgXwtvjjz8p5d8qO+aYo+2qK68IAhXrz7333WfDhg0PefAgII+vAVGP+LcjULAIuHBUsHh6absBARaeabLasLjhOsSihG872uYGp9e3Tp06BqECdzQYt3333VduDC3tpZdeDr+x5uB6RzkwidFiGl91FrwvvugXXCXY83OLmNQDOnUKi3rDhg21iN4eQsSOl5b+9f/8x/4lbSeLZlQe9UPbeNttt1pFLWTUpbnqgmYSoQqLFgxjuXJZms333nsvuJggZMEQ40JIm2CM/3p9H7v4z5fJxWq8ff31N3aGGFGYC097HgL06xQxc4g0B3buLPfLbhJU1gQLzI1SBJx9ztlhnxL0BdPZtctBsuhUDIwntNesaTMxgj2DC09uFhhc1+rXr2dNmzYJSgZoE0Gre/euwdpDPj48A61jjf1lzC/Ws+fBonELlqFZs2aH8cfeONxN2TsCw5Yh69HP+s3BzW0k/ON2R72geTT5BJ+47dZbgkKB8ddIe65wy5s8eWqIYvmW3JNukTugpz0PgUg4QkBAsDhWSqtW+7WxtLWrQ1TSh5s+EIQJ5nXoD8siNDd33txAQ+THFW2//fYLczdjILfUpnXroER4/vkXwtxbS65vlEUePtE8TX5+t269X5h3I0UcCgisVAgkv8oCRn0iBV30TsZqs2bN7M47bpcSoJbGY7FQL2j/HXkBEFkPYem2224JXgyUgQvejTf2tQv+dFFwnf5a3g9nnXVWKPudd94LngVNmiiPxghW16w8Ne0GWYovvPDiMEY42gLBz9eAqCf82xEoWAQ8lHfB4uml7QYEcKurIq0hCyWatv/IN3vy5CnB1Q4mD4avjDSMkVaNhS9WCOI6v2OvJao2ZeE2R37CiLNYog3nN4sSTB5ucfKgl0vFz8HtiTpFifz16tW18hJ+cDdikcOPvUWLFmFhXr58WSiPBZcy2WOyadNGY1HHHTCqH+/aVxauatWqhjLG/TrOiqZseU/0Pv/eMxBAKMdaU0yCz6DBgyWg/0+Wy3mBhtjrs+8+WyyUtBi64hMl6A7aib0W3Yv9jp6LxgnMIq5E5OUavxGYUDas1yb18eMmBLovWjTFRo0eHZjYY+V+11r0inYdqyxWAixcv4qpZIN9RzGyWeVmBstnGBPS2mOxjR1LuBxhxULy+l6uQ2jb4xnR2Lr738mJALSA9QerOjT27rvv2vBhQ0PwGegOJRRWnYh2I9qB/qLEPZ5lzswrcZ/nKIMUzfvkj65F+bnXTHuQ2BNHHuZc6tmoYaOQb/HixaFO8TSJEHTC8cfJm6CB8q0LNE1Z5B83bryEMs3nbVoHRVdUF57jefYPUsfxssiShzVi3ISsPFhWUY5tySMlgpQUCI1ZeSYEgS+qv387Ao5AwSLglqOCxdNL2w0IEDmouzZuYw3CkvLAAw8GNw20jET+6q4ACcccfVRw1YAZ29FE3jnaG8GCiGUqkYsSizn3Q2Q5+aHzO+9UxEqKwSWx4LMokp/Ny/PnLwhuSghkvY87IdyLypKyPjDILOpz5s4Jm3TJF7/IR8/7d3IiQH9CZ6dov8Vw7cFhD8aVV15thEJGgCB4COHtDzjgANFH/iIt7gwSCPsoANgs/9vE34LQQh3ZOwSDi6tSampxuSQNDPU9UkEc2Iu3WNYkBDwEp4hJxZ0Omq202coV1YvysIBVrFCe4HnB7WrVqtXBoroz4zcq378LDwLMd+yjPF4CxXPPPR+s4CNGjAzBc9g3ihsnLsUouCIBaXfWPnY+hVaLa4+piDYIOYlokb1FxSRQxd4jH8I9e5w4guIH7es74cSTNFdntYS5fKN+sPeUhHUJXNhHu2hhVh7G/vEnkCcrU6I8se8MBfl/joAjUGAIuHBUYFB6QbsLARaFWjVr2aOPPGTPP/+i9j6MChvX2bzOXocv+n0ZmDWCF6D5ZuHZkcTCBGOn1TEwdYnKYCHUv7A45vc9m9fI7OIoA0Yg610WGEU0mFnlsSySo0gQBjdsyHIl5FksDJ72PASghSOPOEw9fp/2A70VrKLsX5gxY0YI8sEm7+u09+0CRf+KaGZXoUD5+7VqFaykixcvkRvpNKslqyZKCTTfWLFWrVwVxhnRGNF+T1SELdxFu3XrGgQ6xhGfdetl3QrjBZreOjEOorSeZz3tcQhEtHDF/10eFEmfffaZ/a69ltOmzwiBD1AMfaDDuu+/71476KAD/xABaXtBp02xCTpmjcJ6RELwx1Vvy2NZ8znW0w1am/ASoAzGWpQH6yxrQMI8skZFeWLf6387Ao5AwSHg3FXBYekl7UYEWEj2EWN23313SzBaqAhAC8IG2K+0H4cQw+zL6dWzp51xxunZC872Vg+tOa5zCCcwfSx4sW5zlIdrEAsbWnRcnuIXyvy8kzzsO+KMpmnTpluXgw6yu+66M7wzys9yipsVz/JhweXb056JAO46aNAPPvjgcOYKVkU2lbOPgUh0z7/womGlqVGj+i4FAAEdjT5WWgKgjB8/IQRQwFJ62GGHBtcjNs2zN2LKlCnZe/CoVDu5BjEmYPgQ5LF8iWizx0xsxXlPekY6OoBgOWM8OX3HIrTn/E1fc7bVZZf+2U49+WRF41wQrObsaXv77fdCIJJnnn0u7C2Kn2+TAQXah1KOyHQoCjpr3+Cdd94ezk+K6h8/n3M9yjNp0qQgGHJ0RazyI1GeqDz/dgQcgYJFwDcuFCyeXtp2IBBp1NCqxX7yYxHhmRnSpOOaxkZYfLSPV+QjTmRHo40gg3tPbotrlsVni6Y6UbV5Bxt/YdJwryNCV1S3SDs4ZfLk4CLBniRc6naEoSMP5TZs2FDV2GTT1S6sByyWMBF8KsitL3LdwxfeU+FHgD6Npevob+g+rwTNwhRNnTY90AD7Ew48sLNdfPFFCsxxnVx9SgQXHKJ7JaLviLb53t4U5Y3yQZuECGffEWNqjPbF4VLHc53l2sc3bnId5A5FQIZvv/02CG+4oXbs2CHkoQxouJUELP5mLGFZinCgDdD7NLVXD+ism+ZBWcCzngonAvR7RM/x39zLKzEuOLAYS3/lKpVCQAMC5Nxwww122mmnBOsie0lRPCUqi2uJruf1zujezuSNytjWN3TLHB2sO3oYpcYmKTtyzOdShnFOH+6jPBsJVFEeFA2UQzCTLWtAVh7c73wN2FYv+H1HYOcQcOFo5/Dz3DuIAIsUrkJjxowNG7nZzM2H3wRXYLHILcFUff75F3be+X+yRxSee6X8u0ksJjBe7N+B4apbt06OciJGcqOCHrDRlU9eifKOO+7YsDGWuhLtjgUbZoCy3nv/A7n0jQ57iE455ZTAROZV77zeRZuOP+64wBQSIQl//LVr0wIDybuIcHf1NdfZ9X/tG3zZo7bkVabf++MQQJDgLCv6MqJtvgm6QXCF3PqP69Dv/dpHd8GfLgwHsEKHJOh11qzZ0kCvDxYZrEZYmEix5WW552w7IAP5GIfk5R18onERvZNnoOm27dqGSHQjdbbLAFmQqksrjvCDUMMeKULZU9ZHH38S6sjYI4oXOERlcBAokbpoP4fHRmOJfLgKEtQES9OpYpBhCGPrEArx/woFAvQX5/yM1ZwUT9/8ziuYBvMcc2mfPtfrHK8rNa+NyxZ0VmsehzagN6yVsTQQS9/QHHSan7mWuvIh8Tz5CBG+O9Lxx/cOSi0svU8//WwY17SfthCE4Zpr++hcpeuDZZjrJPIQwAcLbVaeLWsA11gD4vPsjrb4OxyBvQ0Bd6vb23q8ULS3SGD6X/z3y/aKzruITTB2hN5+5ukng6Yt9l70N4sc4VXZyPqizhriUMxWLVuF25wrhNYRxiwK28qNYsVSrFGjRtJsD7LRo38SA3aGXOHK2MMPPRg2uydaaKkLLkPn6myMRx55zF57/T86t2hUCPqAKwjhi9HicV7M4XIxYuHd0UTerl27hJPk33nnXcOthDORmmhj8to1axUa+ZfAOLRuvV+wKkQL/o6+z/PtOgRgfmAQrxEjE99PaelpdtGFF+rg4L/mcJuMakM0Q86B+e6778P+nr59bwwBERrUb2CLFi8KVhtcPAnYEB2uyjtgJjnsEovMCy++qPNZ/mNdteeHM8BIuQkaMGUNFB0M+QtL7LnnXRCEHc56aS2rKWOADy6sCDYc1MlvNP3Vq9cIDCe/27VtF9zmJsuSym/O9sJVNBKOojIuOP98e+DBh8I5TozDJrK4LtQmdIRGxhIb9XvKHRYG2FPhRADLD3vOLrnk0hwVjGjs/vvuscMPPzzHvehHisbG9OnT7SeFhodWL1YZ++vcNoI0cDwDURCLS/l0yiknSVAuLjpYH2isoQ585b0oDm686W/hwOS/6FDiU089JVe3aeqDhYVxMlrl9td8yr64atWq2hOPPxZcoaN6FfQ39MueKY6Z4BwkxuSgQYPCfJ6eRqj7X4Iib79WLS1j87pBHlyqyfPWW/+V6+wL9i15mjQOigTWmzk68449gJk+Pgq6y7w8RyAHAi4c5YDDf+wOBLIEEfbxZO3XCRsNNr+YjdgsgFFigeP5SEMeXb/p5hutRs3q9t57HwQtG1p5EprnLl26WJ/rrg1htAmbSiL/OWefbVNklULjiS94BUXHYkGKZ2BDhs3/cf8SuTPxDIscmtFftLDxm+h4Z599VjgYlsMOOS09SlG9I4Yhus53XvdgZlnQOYBwnBgQ6go+FStW0Inxp9jVV18ZLFkwm54KHwJR30KzaNcROmJTWtraHMxc9HxEJ7iJEq73aR3s+rgOkBzy3Xc2ePAQ0e9g0ZwFAYRDXgnIQCIfn0oVK9k1V1+lQ4SfCu5KCBqNJHhsK0HfvXXWzKjRoyR4jZDVdnKwjCKAReOC8nHr5EDa6do4z/WOHTuGSFzRXjxC1jdr1lQBI0YHxQfPwszG0il//0lBJFRjCW9vBmsobnqUx/lIjM9rrr3aGEuRULWt+vv93YsAtABt05fR3BrVgHuk2D6Pno/uwdR3797dnnziMR1e/EyY3z7/vF+gCY5ogI7OO+9cO+nEEzU3Z82nlEfUwz9dcIGCNXwQorxB37hxRjQa1SH2m3dCg5dcfKHNl0VqkmibCHIoLrLWoKyn4+sYXwbPRvWPvcf13O7xPK50HKqMW+rHsqhyHt6vChgUzecnn3xSmM/rbQ7PTdnk6/vXv4Y8n3zyaRBC8RqI8pyiPVqsAXXr1MmBM3k9OQKOQMEhUESLUNzyrWGoSYoJZN68uVa7Vs2EE0PBVcFL2lsQgK5gGHF9CymRa7oWBwQcGEQWtqVaABcuWCCGq1g4kDIKp412Hq03ZeG2sGDhwiBUoAUnChACBoxfbKI83o/rBveKbtaa4yaXaPGL8kbvwiJFNLxFOvOiXNlyOq+ouULONg3jJZ6Zmzkzy2e+vASw2tJcRuWDAb7mC7VIpxZLDW2KfX9wrxAuaFFxo+DMGPZ07CNLGIcJcj+W+Yjq6N9/PAL07ULRYWDaRJ+J0iYxVOxNw9IDY7VAtL1ce9k4sBiapwxSJFggrEyZMjW4juLK1qhRw0BzEWPGs1EiT/R+6BHLDVrzbSVoCsslZxVlZGSGOtSpWyfUKZZu2fPGeS9FihQN5XKOUXSfdyxYsFD78pYHt6E6Yt4Yg7H3eYb2Uc+ssTQ+WMPKli2rfUYtZJ1qxiMuGAUUCt9/9CUucWkxgnOOWm7mJNgDCu0xT82aNTsE2iCwDTQf0QPzODzGb79NDBZL5mP22zRt1jQw/vyOnuUd0A0f5vs1a1aHsUN5BPmIfS5HfTb/gN5WrlgZAj9Qp2KadxvIEgXdM06gxXQFDalciXFZLbs85n3GJ2sQ9WVt4Rr1wCUULAjJzfxOexPVg+f5EOWR+Xy5xgeKDNrZpEljBdnJqUCgyljXiugzdXMexhTt5BwmDhX3NSBRL/s1R2DHEGA8o5BftXptGF/ROHbhaMfw9Fw7iACEyGKVV4I4IwGAhYXFQDo1Xdv6XBfu8aFcrU5hsWLBg3lMlKLFiud5D89GgyHR87HXcrxL9eGAv9zy00beQT14JjZFbcrt/eTjXTwX1TMqJ791jX2f/737EIj6La83Rn3JM9Hz9GtE81He3Ogg/rno+djy+Dv2PbHPJPo7ehffJN4RT2tRXbmfaIzF3k+Un3xR4lk+We/LeyxFefz7j0cgmtfyqkls30fPJ6LFaB7kmxTNh/HzZfSuLBplTsx6PhENRs/Gf/OO2Pk0dgzlVceIpuPHJ3UhHyk/9eDZ2PdHeMSPsdh670ie2Pz+tyPgCGwbAcayC0fbxsmfcAQcAUfAEXAEHAFHwBFwBByBPRyB3ISjxL4fezgY3jxHwBFwBBwBR8ARcAQcAUfAEXAE4hFw4SgeEf/tCDgCjoAj4Ag4Ao6AI+AIOAJ7JQIuHO2V3e6NdgQcAUfAEXAEHAFHwBFwBByBeARcOIpHxH87Ao6AI+AIOAKOgCPgCDgCjsBeiYALR3tlt3ujHQFHwBFwBBwBR8ARcAQcAUcgHgEXjuIR8d+OgCPgCDgCjoAj4Ag4Ao6AI7BXIuDC0V7Z7d5oR8ARcAQcAUfAEXAEHAFHwBGIR8CFo3hE/Lcj4Ag4Ao6AI+AIOAKOgCPgCOyVCLhwtFd2uzfaEXAEHAFHwBFwBBwBR8ARcATiEXDhKB4R/+0IOAKOgCPgCDgCjoAj4Ag4AnslAi4c7ZXd7o12BBwBR8ARcAQcAUfAEXAEHIF4BFw4ikfEfzsCjoAj4Ag4Ao6AI+AIOAKOwF6JgAtHe2W3e6MdAUfAEXAEHAFHwBFwBBwBRyAeAReO4hHx346AI+AIOAKOgCPgCDgCjoAjsFci4MLRXtnt3mhHwBFwBBwBR8ARcAQcAUfAEYhHwIWjeET8tyPgCDgCjoAj4Ag4Ao6AI+AI7JUIuHC0V3a7N9oRcAQcAUfAEXAEHAFHwBFwBOIRcOEoHhH/7Qg4Ao6AI+AIOAKOgCPgCDgCeyUCxfbKVu8hjU5JSbHU4iUsNbW4rcvMsPT0tD2kZd4MR8ARcAQcAUfAEXAEHAFHYPcj4MLR7sd8p9+YklLMSpUqbUUlHEWpeImStm7dOktLW2tFixY1BKciRYpEt/3bEXAEHAFHwBFwBBwBR8ARcAS2gYC71W0DoMJ4G8EnVjCK6li6TFlbuXKVLVmyREJSmm3cuDG65d+OgCPgCDgCjoAj4Ag4Ao6AI7ANBFw42gZAyXQbS1HdevVt1qzZtmDhQrnZpdumTZuSqQleV0fAEXAEHAFHwBFwBBwBR+APQ8CFoz8M+l3z4uLFi9v+HTra7NlzbPHiJZaRkeEC0q6B2kt1BBwBR8ARcAQcAUfAEdjDEHDhaA/rUJpTsWJFa9euvSxIs2zZsmVhL9Ie2ExvkiPgCDgCjoAj4Ag4Ao6AI1CgCHhAhgKFs/AUVqdOHVu1apXNnDnDihUrZpUqVQrfhaeGXhNHwBFwBBwBR8ARcAQcAUegcCHgwlHh6o8CrU3z5s1t9epVNmv2bEuRgFShfPkQxa5AX+KFOQKOgCPgCDgCjoAj4Ag4AnsIAu5Wt4d05OzlE239xnVbtaZjx066VsTmzpkrQWmNbdiwYatnku1CUQWeKJmaEj6xwcqLKYR5qeLFLDXFyTrZ+tTruwWBlKJFAh0XL5aTjvkNfXPfkyOQrAjkRsfZc7qTd7J2rdfbEdhjEMi5+u4xzdr7GjJz2Th7e/SdCRverVv34GK3YMH8Qh/iu5gYv2ISbvggBMUnri1alWZPffOrvTR4oqWt26DznMxS9N/kBSvs8S/H2JjZS8RAOmnHY1eYftOz9CV9t7ck2hpoW7TJd6KmF0spYr/NXW6Pfv6zfTJ6RjY0yEPfTV5gj3/9q81bobPM9ibgslFInj/onkDfyVPlna4p7Y3mbubx3BJ0/ej/frbf5i3PHgcbFVX13ZHT7JXvJ1n65jk9t/x+/Y9HgL72OeiP7wevwa5DwN3qdh22u73kkbP+Z1XL1rMjm/85x7vZc9S9x8H27cABlqpodjWqV9chsqUK3SGxLKgvDPrNhk2er4Nsi9iVh+9n7etXtXUbtpzXhNZ89rI11ueNoVatQik7fL+6VqZEsTBR3//Fz/bmJ6PtyENa2odXHWXJbyPL0Y171I9M9emajHVWoliKlZY1ZE8POA+vuCJtnd3x8ShbsTbDqlcobbcct7+VLJ6iaJJbujZVZ5j9MH2h3fDvb61n56Z2VJv6gbbT12+wy18dYlPGKwrln7rbv07qKPzWb8nofxUaBBAL1mautwwx+WVKpO4VlmyEorFSSj3x1a+2XmO7U5PqdlnPlobQE6VInn9mwHj7dvhke+rao6xtvSqWqUemSbF17jPfmGVusNo3H2eHt6xrGaJ5T4UTgVXpmfJU2WTlRN+s1Z4cgT0NAReO9rAe/WLCs1atbH3bv+6ROVpWunRpO/DAg2zY8KHS1hWz6tWrGWG/ORupMCQm2GVrMu2hfr8oyt5Sg2OsWKaEHdCoeg7hiLqisSopgQgXo9jqd21aw35pUdu67VNL17csyoWhfV6HLQiUlED09bg5do0EgDN6trD7Tz3A1oiZ3JNTcbX5+8mz7Pmvxpoh7It2e7dtYD32rWmZ67cI/2CAe6iJ6cDNKEqpunakFAElJUbu36CqGFCn7wibwvZdqniq3fvZT/Zq/3H28MUH24ntGhrC7Z6cUmXx/O/wqfaGLPqaoG3AxHl2WsfGVrlcSR1GnpNWA12LvgOdCxQEqMqa6w9vXc9Wpa+z+pXLaojkHBN7MnbJ1Db4Bfrm/14bYmO1Tr971RG2b82KQSBOpnZ4XR2BbSHgwtG2EErC+2+Out0qlapljaq0yVH7ylWqWJs2be3XsWMtNbWYVa5cOQhIOR76g34Ul+Zx2NQFNnvhSmvSqJotWL7G+ouBXrgyzcqXKp5DA5moiliXLurR3M48sJmVFlO5FcOp8qO9SBu0WK8TswLDinCVIeY0OiwXf3iEL8rjuSiRF6tV/HXyF5e2P1t7poWe8mI1ppSBZjWV/CoTZqHEZsaX5zKlYeZNlE+dSDyTX80pFrdU8qksFi/qyGdbiXbSXmUTXll4RO1Ypzasz4VBAQvaQwI3sI5vbyxetCV18/4Z6lVcgkH6uvU2R329Ii3TUtCux9UZxom6UW7UH/lp07ba/Efdh5Y+HzPTigi3/RpXt7Gi9U9+nmG9mtfaZpU2iTqQlx4440BLO7lToO942gCryJUUzT1a3RKb+zb2WegOdUgszVMBLHjQcnxfgj3lhJt6LtCraAWaiU2x40bOktn9DSMVjcVYuqGO+e1P5gboDVqDvmlP7NiMrUfs32FcKB9YQMtZbSySK82SFwxix3M0V8Q1NxsvcARP2kZb9SorJmvg0jUZNmfxKrVxk+g9ReM+53wCXtA4fcueUMZfftpEHQtbgkaWqb1f/TrbSlcqY7Url7Gps5bZkCkL7PSOjSxtY96CITRVScLRB1cdGegLXGLnntAnok/eQwIrUhbmmstFSyTugyu0GUvzZKPv46+TJ5pzoS3y896IXrlP4q3FY8YNgmA01lhHoC8S74jmz/z2J3WLpTcqmWj9CC+I+y8ac9Q3lKP3k5hveX9WrXJmijCKlKKJxiH3YucOMGL8sSak6JtxNW95ms1csjq8t5SwWaN3RmtAVJeov7anTTlr678cgT8OgXwJR7hipRTN16N/XEv2ojcXFTOeV1q/MdNeHH6d9en5mlUpUyfHo/Xq1Q/7jzgDCXc7zkTi+49OLE6f/zLTNklQuPHYdvbKd5Ns6PjZNvr3xXZ4q227WDAR/zZvhU2cv9waVStnrWpXymY2EDgm6foP0xba8lXp1rZhNesst4/+E+YE16SuzWpYuZLFg3AxfOpCWyCBrF39KlanYpkw4TPZU49ZS9fYfnUrSegsZxtUXxYNFqZBk2bbxDnLAmNUr0pZ69asplUpWzLHoo1//UR9mteqaDXKl7JPh89UXdKsed3K1rN5bcOaMn3xSus/fq6ly92sTYNqdpDqCPOkV+WaWCCnSMgYqv0oS1VeBTEZbeSqgjvihk0IfYmzgtcyuXeNmLYouCUeqHcNnDjXxqqdFVX3A8XA7yONYCyTQR7aDBa/zl4a3OIa16gQnq0gATZiUmAmRs1YbHPk/ti2QRWrJReyYWKUiorpaa4yB02cYR+Omg5nYrO0wH6ivQZVy6nedasEvGnTJLnZkGep+qtSmZLWVv3BZ4MYoVyalLihheAqDBNC/hdjZllN0cetJ3aws5/6JjCTS9UHZWRpiBiL3KpLP46cvsgWqo/3q1PZ6ooJJQ9Yw7CMnL7Yfpq52NaLKTpY9FRXDOpXvy4I1qcusqiylwlr05djZwcG8KAmNaxsSbkzqlzKGcBYkPUOSy2MKuMR5hMmf8ik+TZz0UopVFKsqfob+qaPYpl5xg1t7CjFRrpco74cN8s2aGx01ns66Br1/HnWEhsuOi0iPLqqjP3qVMqmmUTtht74jJyxyH4Sza2VVaF6RVnAVWajquXyzAudTlu0yn7VuGxYtaw1q17BPv15ps2WwFJXeWlDdVk1cO+MEkx5hgLWfD95ruaSZSLPotZS80gn1Z/yovby/Y3cG9kb032fmgFP6ldPFo9yJVMl9P4eFD3iMO1H1b2MlAH71qxg9dX34A3zybgjT3qm2lShjB3UtLo10LwSjaGoTsnwDW39PHOJjRf9HdOhkQT+2tb35UGaz3+3k/dvuM0mQBvMM9AQwgk0GNEmuIMJluaJc5dZKWF6tFxNEUp++n2J1RGdt9UcCqbQKnN8WT3TpWnNwLjrsq1JX29fTpkd5ljojjJJCDPTRNffT5lvi8Tsly9T3Fpr7uwoyyzze+irzXUb+Nu8ME5YK0bNWGYjpdwoqX49pFUda1KtfKCjb7ReTZA1pYLo6tCWdcK8l1d/Rm3rr/Vjwpzlofw6opEeqmPs+hEqm+C/oVOyxhy0k75uo8b7zCDA7Cc8GCOMndh5hXVw8ep0GyGcp6vd5UsXD26NbepVFsa0N0v5gMtcP41T3J17SnnDPM76xbqyUsqsQbIKTlu4IoyPgRPm2szFa6y95vlKpUsEzMOaOJE1cXlYv+qqTd3lzcG8gjDmyRFIBgS2yRWniBEvVapMMrTF6xiDwJrM5fb8sGvs2oNftlKp5WLumLVs2SoISLNnzzEErT86xDfM4/wV6ZrcZ1kVMQhHSBiat3ytDf1phn2iD+5E20owcu+MmGr3vDXMLu7dzp67oHsQfLBYfKwy+vzne5srAUmrhRXRonDT8fvr+Wk2VQvu8H+eEiZ+5u07tWdpgDYMv3D5oXZ+130CA5RSpKg9po3w7347we7Vfo8+R7QJTBR17PPmUPv0x2km1bC4HjgfLAPV7PmLe1o7LSYsjtTtreFT7MH3frAzD93PFouJ/IY81EVCxfW929vxYiLOeOorm6fN+FwvLgHlztM729XadxWvyYywYPF7VULkLSp3kRhBrYZy2dpkpbU4X3V0W/uH9rRI4ksoTMDQTJq/wk5/8ivbt3bFwHA8/PkvZmkZcG9Wp1Yle+Tcrta7HYzIxrDQwsDcrY3UTynoRYYYkZDUti5iBB7XszCStBdG5UG5R348bLLdduaBNnbmUvtw6CTr0aaBPXZOFzvjya9trTAQYdpXYiS/0v6D0w5uYW8I8wzh+KL2nd32/khbumRLm8pof9l1x7SzmyQ4oxkV0kmTsHwM0T66hWIoTum2b6DvFmJgxohx/lECD4xU5vrcW4QlBpHwrk9H21cSKp+59BC7qPu+gTbBGlfUe0S3aaJH+q6ilANXHd7aHvj8J6tWrrQNv+VEqyiaX7VunV3w4kBbLQZn+C0nWQsJJzD67I25UuODfR9f3dA7CA4whjD2177+nY0WoxQ4RS6KYTqiXQN74cIegYGD+aKMOz8ZZQPGzLbrjm1rH/w43X4Xs0yeMhJmnrygR7CS/Pmlby2dfldbqlQvby9e0suO3q9eDgE86lQ1I9TrDpX77DfjLHNNemgbZdaQgPbgWV3s1E6Nch0bML4IKX9/bYidenDzYLH9+PvJJu4MM651EtP33IUH275SVsCwoQ2fI2v19f8dZp9KWBchh6oUlVXz7G772N2ndrbKwpBeWiWB5i/a/7VIbXlc9Pxk/19trBjGW1Wn1mI0z3msXxD8ec+jcq97NPNHe/SSnnbVYfvZErXj9g9H2QsDxtk6CcaBm1Sbaklp8LDKOrF9wxwCW4RHYf6Gyf/kp9+RcOwIzdVHyz3u1vdL21cSaAgegjIoEiwTtYP5f+XqdXah3GyhzUE3Hy8lVOWQBze7a98cZm8Pnai5aV2Y49pK+IJpf+zTn+yELs3sP38+JAj/KMZOf/xLa6g+HXXbSZaquRgBl3497fGvrKZocZTmejwRoK83NCf/493hNk90Hy5o7iypufPP6qc7T+pghEyhbsvXZqpuAwM9X9KrpT36xS+WuUJ0rELq169sb/zlMNH8NHvks58h2lDHNvvWsrcuP0yCebmEAgEBhMDmOrXtM9YCKRSy1o8i1rpxDXtG4wv32UTCFWMeK+U/P/rRBssafbPckt/T2jdZcwlrRzEJIRcd0sruPqVTsADpkoZtiuaahXatxvkoxrPyk0qrb/6qOfW6I1oHoZFxgMLqdNFwU83nN+jeP975wRYuXW0f9u1tQyVIPvD2D8ooZaKe7fPKECuiOeFrzRs91GaErmu0H7jf6Okaa3qHaBuzd1spaJ676GApwBDEst6diBb8miNQWBDIUzhiEJYsWbqw1NXrsZ0ILFg13V7+4Qa7rMsTmvhydvUBB3S2gQMH2Px583QvxcqWLfOHnYGU5VI33+aIWT/+oKbSwJYJE22qFqr+0tDOFxOCT3peC2wsNJqOQ2LRnq1J/bo3vrd5sq4cKh/4Uzs1ttXSjL334wybpYk8CBSxmfPztxZWtMyDxRB9+sMUO0Yb5y+WSx+at8fFyA0WA3vL+yPsvSuPCExXdpHKg2vVyXI1efnqI+07aeRfHjTBHpOw0U9avxPEGB14ag1pXGfZO8Mm2X0SRLiGFSC+7RqawT//Sfn4I7w8oIUHTfxwaaTvF6N8vxiHrtKeHr4fjHfui1GKhKQZC1YGbeCDZx8UrBj/HTnVBkmgvFa47S+NYE1ZfnCreJI9FGpXU2l2rz+/jfa2lbT3xQi/9e14u+yVwfZ5n2OstLS2cJCqXlgUXx40MTC/3VrUkTazmhjqEnaPhL6PR82wAWJeD5Dm9WS1samYww1iTnCze0KCKOlhMc8talWQZneBPaD23K1gBmh+e2oRjtX4h4cL8X/03ReyioILARbQUB/Tpp6NmTA7MJVYRvOdIuJWBgSAAdLc3v7eiMConSsG5xAxjpMlhP1XdJkpZrVITr3Ilr7J44X03SYR2Ns/TLXR0pD/RQJPbwm2C8TM3fu/nyTMTrFHRWv3SGDI3Hw0AAIcDNcH6tfTD2hizWUdI/9XUjT0fWtosNbcJCUALlcvD5low8bOtHvUpwerL2HI4KFiUzExtr8uWGrPDRwvJq2i3XBM2yCMQW+viA4RYrD+1hbDGz82onJCkaLbr+Xu1VWa62cvO8RWitl+QfQ6ctxs+7to+b9iYPV6eErr+/Zw+/S7iXbYAU3lortvYGqf0rv+o31ipSUkPXrWQdnvChip7XdorJXQGOqpfm0iga+lrHp3nt3FXlEbUbycIQVLO1lEqStCPRp43t9cVtC+R7WR0FrC3hVj+7qu/fW/w62zLLbVxLDybDIkFDRLVsulTniWlAKjh3CuKwsa7f1W4xur49mdm2zTtS60lSbHNBsX0Ic1N749cJxVkvXhYil7WknwGSwG/b+iLUiOfsiR4srIcW/zD/iaNAm4T0uoXaX55u7zu8vSXsVGz1hi93822p6QQNtNzPyJUlhFjDxOxMtkdflaltd/nXKALFipmqfG2iRZyP/03ACrXLGUPfGnHpapMUCdx8jS9MLACZrrDkhUheB2OkjPfKZ2HK016RIJ8KwfT/cfbwNGTbObpfD67NqjE+aNLoZttQLgZSnITpfF7m/CB6v+S1LiPa9ol3g/XCxlDC6dWHUvfmmQTZLS4iIp3Hq3ra/ARqulQPnF7tBYYo5H4ZJNdxoUCzXeb/9olO6VChY15u5jROe892n1SaYUWZdpzmGPGFZRxtE38nzoJ+XCcQc1swu77xPG0JOsiVpP/qF56kOte54cgWRAICfHHFfjSpUqB8tC3GX/mUQITFokJv2Xe+2M9v/IUWsWiO7de1j/b76Ru8wCCUa1jKANuD7t7oT2+TO5vMBcMWnDF7SVBjZo1+UCgHb9GF3fsA3f9bBQ6r/wrUZgsflMTCnWmA5iwt+SZQIhiwX94OZ17Ij7PrVMtLcxKSoj5lL4M8d11Q+3jhO0eJa7/lgxBDWloS+lsVLEGotB6iGGcrRcPhasTLd6lbKUCyG/NGbd5ZbxgjTppFMkrP2iCE8/inlrW6+qPaPraLFp64+/L7Jpcl2bIGaqgdyC4hlAmMnysry8eHHP4N6Gax4L21FiYmdI6HtVC/R3YiKOFhOeKbtDrknlpGpPxIvSooM57zmpQ0M74qHPbczE+XJF+l0a79ZyKVxtT0gQKy78eJZAAjAOR0rzP1duF4OE80fSFl6oBRbrT2iv9hU1rVHeXpDgVkWucRFpXa0FdYnc5QaIKWwn98EbT+xo6bJYIcTBLL7y515BoEITGdrUur5NlQD3lpgZXGAOw9KidydDQkBHQ9xPfVxJWmRcjtYLH6xFDwiTr8VU4upSXm6dsS4widoWS4MII+vkNvmWrG4bxeCdL2sm/QJ3ifsbLpEXPts/KMRjyxLpb3WN+7HXRRIB976yPvaQhv44BY5gLBWThhhL7PlPfBVcc9LkhofQzDtD3dR/Zx/Y1O4+7QDbKEG3W7NadoDGwmJZtP4hYemaI9vaJo1xmLZudy60cXOW2lIx1lgW4m2BMHStJVS8KwUDQkcLMcUkmO+R0xbYOI2vCXKZy9q8n2XlCQ/E/BfqpIHSrEZFe100hcWA/ugu2j3q/v8FoWmMXP0OEiOMm9xnUmo0luD/sqw8NVUnMDlAwkr3uz6214f8ZpeItnFBIsEIZspd6zQx/jcJJ1ysQAJlA7h9KzfFqSqbOeIsMYpr1UdrNR5wd402se8jVzvqiIvfD8JpkuYpxjsCX0aSCEdYoEfJwjhZ89jBreqFvmK/ClFEv5Vg/D/NH6eJ+c9PiqVB5ujFmiOwuBeREuAOWUeulNUdRdCfuje3S2WxeEGW0dDHsYXrAuVslWKuI4QQzOd5CTOLRX/MJ4y9o6SkmSZr9b9loR0h9zz6Ljttrtw/FSXyuPYNwuUa5UvKwvKlzZVl6vW/HCrlT3U5DmTtlbzqhW9t6NT5msc2z4XZBWX9gbX2ZM2zZa87Kih7qkoRiHvsPqLzTpPn2Ti55zFv4D4bP/dHRYV2ai65VIo56sWa9Keu+ypibUm7TQqJlwf/ZudI2Vha+4vfFI6T1Kbjdf+p87oF+p2iUYoAAEAASURBVMWahCvnSQ99YY9LAUB9KmqMZCXt7ZM164GzO9ipUuahDCQRTIPx+Jo8AVZvWheEOtyhV0vpQPTMMw5orLm+uB0iTFlr8TxqLJfWgybNC9EMF6xcq7ElhQYLmCdHoBAjkEXxuVSQweop+REYNuND6z/p1a0akpqaqhDfPWz+fDEwi5dYRkZG0F5t9eAuvACzMlfMU38xiTCPaHhx3yLiE1oqcczhvJdE6922qsWCxz4f1NLd960dGHQm8NX6NJCmi2h4QRLbVkEJ7jO1s1Dg2sMig+/6GGnl8Hsnkh4WEIIOIITGpvpqI64ahPpFY95cLkKkffSNYMR1fL0by4+deqOth1FIlFg0O8j1AuYKFz+00uPEpLAYooFdpLrkljcqD4xqSDNYXQs9e054P77hR2hx02orBnZ5WLSnyvI2X5rGhqrnPrLm8Cx7LtDuIsTQTyMkxBaVxj87qd7HygWrUdXyoc3USa8LASgijSx7DDYqb2Tdwl2EPR4wrPMkdMEswkSzb4PMi/PRpuz3F4I/sIpiYVwq+jhYggZaWIQK/Pf3kZVhutoHI4bwsV1JJMHengnaG4OrW+R6yrlfaaJv9tggzID3jqSILk6VAL9arkJTZI36VVppmD1V1paLvunDiDSDcCOmuJmEYQKMQB/QUa1KZYMbWxPVJ13XGH91dK2MhOD1KgsGmPGQKMHEoixBAPpdTOtYKQuoR9gfqHcvk7tT9P5E+cM1jRGEEEKmgztjv4VcRltJyFmvNkxVv6Ro/LJHboN+s8+viurNOOCDoEK46TQx0eNkCYqYRGSXFO3ZOlUMJe2kCUDNmOQ9kQYeul6n39GmfXA6XmMCpnem9j+NUZumaWyVgylVm5YrYmf8nJFr2wrBDeaXjze71B0rF1zmA+YF3OtKiNbZyzZHezWZ57cn0a8r1L/swywvQfUQKbPojzTNScyTrWpr3tRDO0jeoZ8Yg7jnzRfDztw5QfN3KdGCKhusYfRlVGtoEethPfXbWtEQH6K0iSCC0A2dhDlRFqmWoi/GyEIpx6CDqIzY9lNv1g2ECTCbLrdo1o9Fctcrq31r0A3tz2v+Dm0XrpFraBj7wiesm6or7nEEyoCecJHFzY0AMKw79BFHKYBBda2F0OLvi1er6ZvnIc3DNdVW3DxLak8y/UFizJM3mlf4O9D75gusiWdIYcA4idqEIqy0lD88u1Kukew59OQIFHYE8rQcLVu2TBHNqmzVhkkLR9i4+UO2uu4X/jgE5q6cnOfLPxv3hNyg6lmb2ofkeK5MmTJ2QOcDbcSI4dI4F7OqVauGCHa7a4GGKfxe+zHmyzJRQhPoadqoztzJh4kdxu9bBQqA+Ue7tj2JxW0+vuEqrLwWnFhtFczfji6s1IFFC3/4++W+8J+hk22F6ipledBA4qpRDAElQWINYaEl8X8ss5V1NcgAWlsFgC5Qz9wS2A2QG8Mj/X6WS8hiWRLUJj2OUMbivD1LUPx7sGSQlq4WfioUHDeKGY/OlIrA4x0s5qSF6iMEWxbSUGt9s9TCzERtDg/m8R+WCKJePaJ9NDALUZtgimS2yCNn4bzFRuf/4VInUHAx6vKvj7P7FJdPGJaPpV0/Rtax7Ungvl5uXfOgb2ln6YN4+t6e8uKfhYGCWXpI+ys+1cb6dWJsoG/6EoVC4iNs4+lVe+cYyKKGWPqCFrA48B17Pb4OEPCL0n4/K9e2WRKOpCRXSZuCgKUCtno8twu8R/82pyxmNQhYwn7RKs0xquOczX3BuUTZSXmYB6F5FAVztGk/VpDjnnjIwGhvKT8791Z/gIT8Fe1Z3J6052i2mFe2moU2yQpFm8IzW+UsnBeYAxFuBygQgTh8ud2Ot9e1rwuooUUicy5ZttYGT5pr53fR/k3NDflNYLtsbXqwXpQvlyplWUo2rVB+nnSTj5cwdw6WNePRL8YoiMOCUFf6MMyd9EMuHZH9Xj0b1sjND0bXKYOxQ8przgM7BHXWjzeHTQkue9nrh4SictrTk0sVtmod7wYTEt9E1kPgpy3LJNRjSWKfKwWWjaVvPcvep3IS8lF8EYgoJ31n4Uxf0q5tJQRghJ975JaIxS/Hmqg2VZJbnidHIFkQyJPbWL9eGt3MDDHLOYmaCGiDp/5XA1Erg6ekQIDp8/Ufb7Gru9eS9qtFjjpXq1bNWrVqbRN/mxAi11WqVCkISDke2kU/EGBw3UJryuQKE5Q1D2eFVi2iyXyGNswShQg3h0gjm5/qsAAhFJFww9q8joXf/J1o8cltDYjNS0bqyib0p7XnoLM2IPdVsIBqEt4Q6G7Q3oGV0nLmJ+X2vtyuR2WyuI+RlejMp74Kmrsr5KrWQVH4cBf5rxYm/PTzmxJhEe0lQVsahEu58BWRljTR+TqBYVavlZX2G6EuY92W2m/5a9u14QDU0XInpE24Zf3fka2DGxKWtNe+n2gfiFFOpgSN4NfPviCEfCwqWBhzJGE6UC5dC+Vat8WlJccTuf6AkakgIXaOOJdgxYl5Mge9xlxP1B+Mg9jnI8aNPQrfs0dO+xZwJSIi4Ri5+9yuvTqJyol5Tfaf+X0uO8PmP4je+Kpcdy59rr/Vk7Xyem0MbywLJOlfcnsaI3fb/KbYtkV5sFpB10Q2ozFEeeR3Fi1HT2V9h2sabxU1BjRd7XDCQvCi9hhe8eK31oDN7se1t4Zya6JMDgceL8tcMiXmIOZlXF5TRN/LFWxiqeiYBE1hNU1X43CZPlP7MrOu5hNA0TRzD27eCA2xVpxQfqLJmxtKMPKxt+P7H+GFaJhnPfV1cO+9Qi6pnRVEBwUDZzWxhzLfBJ71yhz/56eFzA13ae14QkEVOsj1uY/2n1WXhYz1o6/Wj9hQ5jkKT/Ajvn1BGSCpvXhKatgDiitsUGCpYpHFPiqGQC+4KnIUBJEW8yMERXljv7PmkCIhSMRz2pfYWa64WWtiKQnQaWrTsJ0aO7Hv8r8dgd2BQJ7CERXISE9LKBy1q3Oo/TTn691RR39HASGwbkO6vTDsWruu56sKu1kzR6kNGza0VStXWhTiu0IFueXs4hDfgXmUy8VgbUwtron57f87zFqIaYgWBqwIt334o73x9dgQcS6HD7hqz4TMMzBziRLlEy0IwQuXGBY8nkdbtlxazHBeRkxWPZ7FoGo1JggE4YpZTNBy4+IQJbIQ0vTTn2QR0AL++Lndwt4EXMLwE/+7Np5uypB2XAt7TPFR9gL5ph2Dfptvy7TIn6boSg9qE3imBDLOECIqESsRuMRqAhO9mPqtltaaBR1mZn2RrFDZv8jdB/eS+trvtEll4YZYRswxe49wGYSRBxvy4ZKiFwX3pdz6Iv7d5COFOuo9fIPzQLnhrJKLybliFu5X9K9MuX4Ul8XoO/nh57dNWSX/8f9nu9TJNaizgi68dElPI9AAigq0ztDQ8Y/0s9/Vh4RiP2H/BjkqzTP0M/jHJ64gQBCmerwCVoydvcxO0d4Oxg6BGtJk5duo/okSzxN1EWFqpRjYhdL4t1XZ6zYruAh3HCXGDaHvh0qzXlvj8TlFzqK/i6ncLCsh9Ye+dw11UypuaOxXkVbD+h7b3q46so3oWy45uve0rC5wcdQzP/QGzjxLXtyG2ONF0AoEVtzbNgmnsKdJ1omJ6gveHdom/HHlIiS4QA17LWDS85Oip3gvQgQWVVylPqNN+r5ZgtFl7KFR+Sh8Htcctz1tyk8ddvUzgidEBJQpz/58fAe7QXutIqUKc98oKTqITDnot7nBxQuX4lj8wIZPogTlVpD1BHffJZpTOa6A/Zy4cMHIr4ReRQNRbph69pSJIBTyXfu7RDeVy2iPnLDHBS6W62dMDVSdFqrM3rJoPaxAG2HcaA0ioAHrBXRF3QgSU9CJsgli8YUUDymypjx4+oHWU4eXc0zBAlmCb353RKgPNAjGeSbRDu1DAMpYX0QBQFPsN611G3WtvFyzCQnOnNNE7q4U9pvGNW5tzC3MT+z5my+LP1Yd3FejtTfPd+pmhAr9HOYodQDRG/uNnWUEUnpYUUoJpw5ts2bcpIh35MpXm7b1cr/vCOwGBPB6yTOhhUhPk0k2Lh3S7IK4K/4zGRBYmbE4CEgZ6xX2Ny61btMmhG0nxPeq1as1WeffDSKuqHz9ZOH6Ti51C8SQcPZQNwU2wHcbv24+CDYnyVpEOF0WWM5bYMGKGKIMLSaEb4VZT7SIMDGz8b2EIvF8Kb/4BxWkgOAB7Fv4l8KuzpfLB0x9lGCc9tV+GnGjwfry3STtxRIT+bIiWOH6p5dHj4Z6BAZK7/hF53uwL4P9FG//ME2uOtKealHjPWGPRnaugv0juN6pznNknZgpBg5hZZw2gX+m83S0CmkBTg+YRXglejttZm/PvYqMN0Ua4DnC5BHh1E9MXHExJkfL3Qv3DDbhEm58uSwfaDzpCxgVrFQfKrBCJS2+ROHLT3vpq1B3VWiZtM3jJYjBsFJPFloYHM6Umi2hAtcc8P1crna6GbSQbIDOq02J2rm7r8HTYK0kIAiq7yMUuKKF9ijUVYAOaLuu6Jywtke1rhtCFH/684zAcZAvtE1/cN4I5+0Eq2dcA5iXsUQcLQ0tvou4adEX7HMYIeH4gX5jbKMsVcH1Z3NeXJOai743yvXliQG/Bu35bPXjw3p2vr6z9xtQB/UBwiououMV+ADmnuhV7ygSFf5t6ZkbtV9nleTViE2Kq+DO/lT7w/hSOTB0nAmGcMF5N7+Ixhm30AhndamquSfRzAApX56TKxuuoZMWLLe/SXkxUwxkM0Xca689e9Ax80RzBQf5Xla8ZxUhj6h2S0WbD8u9c4L20nVVIA32wq3Lx5xI/0VYzlYdUcywHwVMmfNg1FEorBDNg+uXOsKA85ho00wxksvVpkTzWe6N3P13aCNuWAOEV4qEmOPaa29Ylax5G/pmHj9EESpbicaXqU3fat8dzDj5oraBze9yLUyUmLtrKMjNYS3r2joJX4StHiJhnfn4EwV6eI2w7MIrSpAhlpdq2ue0SLRMFE/2a/6q/Yr3yTUUgTSWTII7s/Izj83QPINFfKLmIZh7CGqpXPq4t0uSKkLVGV8bVa8J0AcBDUQjjC9c4GjPNO0DQskRW+/Y+oTrqitRRL/+dU7AhgAv/5IVUoQa9nviJgqNnakIjGUql7Y3tJZ9pMAjGZrTp6v8f2kuTxdOp3RqYrXUZ+C+rUQfFtMHQZc1DkUKaw9rM21ar3czZ7CnaZU+tGm5aJ2iaRN7JXNr07be7fcdgd2FwDYtRyyu6bIelSxVKkedcM1qVrWTTV48Msd1/1H4EWB/0qsjbrZLDnpY60BO3/0DDzrI+vf/JoT4LiY3J/Yk7aoIdkyohBwW9x2i2+APjaY2Smi/CAlbUxqwOWKQOXDuAoXGradFuJE2eE+Qr/jR939mr156qJ2j8y4oj3MmYKJIMJUdFW2Ksyme+uJnu/m1IeE8mPWanA9qUcvqSOs+C63w5rRRQtGpWiQIwztO+0N63fuJlREDWlnCVTNt6h4tTSPvYPlAg36GXEXulYvRpXI/eujLsWFfRmMJCeepjq8pHPWpiuo18vaTQ9St+LpF7wzWK9U53I8u6ptoRlrVctXk4QoBQ1dbzMdQhZfd/7b3gxacQ0IvUAhVDu38UO4hFaXxfvGinkF4iyk++0+sXY0k+Pyk/T2dbntP1oGithKhUYzMNb3bhxC3uBXB7P1Nv3/ToveatNyc60HgB86/wJ3uXzpTgw3KuI4xZ7Agh/rTJ3FJMIsp1cGa0la+r/1an4ipv0ER6/51cidFuapnj8haMUjCWftb3xeTVUaCU5qdL9cu+uodMQKVZP14WuF3EUgLa4IRJojF51gKRCtHt6krMt+g/tzCfIhvtyMlfL6sSFFYSXDB4yDRFnUqWilFdPpOgkDPez6xYf840RpqDMTTBHROJKn3fmxog8TwnKWzXCqKQYTxOViWqtJyFYt2I8BsYVG6SCGD+0vQ/GLoFBuk8hn9LRQ9rqryLRKjirAD00NfHqq+6Ke+OVJjrJnCaaMZJhR5N7mRfqf6nvNcfxusM2lw5aRtieiVTeJcj7UYgADjHEtnIuGK+1h3Ydg+UujupxVu+H9SbsDoIRRe3KOFPSjXur/9d6hV0eHBF4o2EHASJtE3Qs3jYpZvffcH7WGTLCpNOWeBEfqY/RjQKhr2e07rbH956Vu74dXBdp/2TcAowtg3lBB1l6KlsfcIJpr68b71CeofcNacwWG4/cXE36zw4Ld/NNLeveIInRnWILTpU13n/COY1FIaQzCVhHJ+WKHN+yp8PnU5V/NZrm1K2NDdexFLBQejzpSlpZ4EzA6KwheslQAQ0qbghtlLc9Q4CX9va54nkiG00kbPfqEz5m4XNli5CacOtwxN8ImliWvkLszeoOGysvRSRD8sn0U0Nx2og0+nSpiJ3sY8Vks0fIFo4cEPRtq9+jyjuYIIbr1Ex0hklM3zzLWHKXppAx3o/ZMs1Z3/+WE4TJb9exerHwgk8KHWgJLqm5cu7hnyBHoVLcfWDVqEttOKq9yoIio/PMN1vS9Rgq4qK1LlSQp2co8E7yt0ZtbjWi8yNW7ra107T1ERX9cc+6cXBtrnfz3WOglf1rL4FF6pMU3EudOe/EoQbgoBPWRKsv0UJOeyXi0CDWMN4pDWf5zYyW7XGDj10X5WQwIse2bXSjDqJpfZPrLM0gbBlGf9mb4YM+1Up8/Vp2fJMlhbc1b/G3prHSlnJ3ZobA8J+8u0JqJ0AQPmjrN0Vthb6o8Lnh9o/foeo4N7s84AjG+T/3YECgsCKbfddtvt8ZWBucnMzLTVq1dZuXKc6i2ti87CiXezKleyso2a9UV8dv+dBAgsWjNTi8VKa1mza47a0vd169az8ePGBSa3ZMmSCtSg/SbMmgWYKA5LC9HImtWrIuagRTDtM/lGiT/xOy+RWjTs56mnhYNQuixahE0tpYhXTWRd6qkFuI4m+xVaFErq+e5a+NDKRwwZQkQtLSDFxLSwx6C3zoS4/YSsc1iWSROJ8FRDAhCb5wkr3EXR39K0UpTRe1jI7z/jwMC04nrQS1GYGuudLDicQl5F7y0SKr0pMER3icEiUlNRMQG4oh0pRhJfbqJ7EbGHunEeUaibMFixdp1V0jt7ipkl0lfWdQ4ezLCaOhPmEJUFwxy7KIMPvwkf3lWLIHUtKrDYX3WVmImr5WZXX/szSut3J0V9I3xwLFNOfhgyNO+va18HGlfCZ6MRZON9OwmUVx7VNhwMSK+zaPI+FsXeil5URt9oDgklDuNx9xmddSaIrEYwwiTdww2xmjSR4IUFMDZYAHXhVPmW6vfyYhKI2NdV0QSb6Zuzk7ooYuFaPYNemH0e16kuVx7aSkJxuSCIHaD+IYJYfJvCuwvJf2imYbIyxBwcoYhrJ7RvtNUYgmxClED9AUZYMQh5TkQ7mBncGBFSEBhLK3ojVpKaoqlDFDIZmoBWYK6PlcBSQoIQLjVEWrv8sNZ2ulzsXpGWmMADMN5YmaBZyiNEfqb6E3rpJXrkgFOEucZSAHDmEtHXoI9e0vyn6r0QAFac42Q5JGQw4a2xTLYUc0kIeQRn6JUxdqjyE42OtiFGLJfWv+HmcqFXWDyYSiLNcdDnYWoLdKRLORJtaymmqoWYqMwgkGxS/5e1OyRAnyUmu4LopKYsmz3kjlRf7w3jJqYELDScj8VZWgiK98l1CYtuaTGTB2o++KeEnRPFFEaKFPI3Vxjlw4R1iuYIHGKZU45X5K2H5HbVGsxQuoi2qT8HgzbXOAYv3L9i68/9jgoJXkP1ra42czgycxB900JtIl+m3oeSoKEO7KVNaPbLKgRyLfU98xlnBcW3KaZ5f/if9PlPsuBVEFYwvtBE/BxFJZlPM/QsNEEESizDRNisqvZxD5xCXuHBnMEhuocJU+ZMxnctzcuHaQ7ZqH5j7yFuvndrjmWe6CfhkvOiTtZ8Dvnw6aI5uWIFzcmauKpqLJ2rMNfXHt7aVmtu6qR3Yc1C2VdJa0cPzTnBWVr9Va5EcbvisFZ2jebOpqLXElpHOqksDmJl3OCayXEL1K2M6kZ/U78lsu52UtsJXU30ORJ0skrvO0Dt7SX6ZF6NT9AIir9qwgW3WT6Uc7foksiTKXo/c8Khqi8HOOt2dmItJj9nPf0uq9PtynOs5hg8IcDneNHSA1qzyE/dSQhknBHXQUIlUYipUnNF1TtfAtQ9px0Y1lee5Trr4HIpnjrLLY7xHaz52W/Psvp30ZEU5UTbnElInzFXENWOdbmyFFpZrsBqozC455TOGid1wmGxjUXvYIULJBh6cgT+aAQYT+t0QDpu25UrV86uThG5Tm1Fojy8atUqmzdvrtWuVTMMRK0KVr6CQlfGpfv6n2HzVkr77ykpETi5TV/r0eTMrepO/w8e/K3Vq1tPJ9JX12HAJTVxbj3Jb5VxOy5QGppEGDM0TLkxA4QHZYLGWkLEI/Lxm/M0qBNmes5F4TcLVOxzVIdqM3HzDBruIKyImet0+wdhv8dwnZpOSNPIegNjxYKGZYIFmUQduY4AED1HuWjjcSXDAoQ1CSsLkz6hg2Gw0DgiGORWN5hWysXiEqsdjNocrA0JtIahUvov1FV145wJ6hJ8z1VW9Dd1pQwwi03sp/pe+1yOfOCz4Ms/6G/HW1UtdqvkcsW7U8VApCsgS/wCBtOc1eYsHLD2sahGTGb0jqj+sXhF96LvUEe1ncqBHzhSz1j8o2fQ7kdYxfdvVF5h+wYr6BvGBPreaqJVhaFfaIx2E5EvGgPQMTiQgsZbHRFhGk8T0Cr3ovwETsANtNe9nwbL27BbTgzMSMS8giPvIbQ21hj+hh4oJyqD91J/6hBp3MuqnvQRY4F+gUHjHgnBDKYrvm60LX5801YOC5aDVcgf1SsUFPdfVFfeQzh38jKOUZBQv/j3Rdl57/1yp/r7a0PsLCk/EP7pB8phnELXwboZZdj8Hc0rKG6y+kbjW+MnVhCnDqU2C1CUl6j+5KVPsICRYnEFOzDn3KMQCU91YQxtq02hoEL0HzQDnTLn0Q+JEkoC5kIwIsQ8YwA6o1/pvygvMGXNtVlrQSym9AkueczHlIelmgidfV4abCdKMHv9z4dk9wHlMNeDN2VQJnMgSgSEdfbnROMwmjtxaSMYDEo4+jqMPbVtW3WjHZQfyhUdQFMk6J3rEb1lXd36f+oKLcSuH+w7EmkEzBgfzBuxWFAKtIWl7ESdsYSF/fVrj7Jz5a2wUooInmVOhrajuST2zbQNRQdWI/oAXOm72HeEdom+86o/fUfdaWs0D9B+6sZax/uZpxEkw5qoSjBHMNknalNsHf1vR2B3IgDNrl27VltJ1lqTJk0CPfP+bbrVRZXcsGF9kK6wIsSmQ5qdb2+MujX2kv+dRAh8OOYhadjqyoLULUety5UrZx07drIfR47cZSG+WUsi5irHy+N+hIV38+KbxWqImdAiwidKXIdBj5j06DnuM2mzWHItWgwSLRw8S4qEHyb/aGI3vIPiGADKpW7Zi1zM/bAJOKu48N7c6kaZ8eWSLbbNm4tJ+BXqqrpRVxbpqCwWp4j5i8UiYSG6CB7khWFggY7FNjZPYOq0YNNmtMe59V9+6h9bR94R1TMW/9AmtYUUi1X0bLhRSP8DK4TWvBKMBb758QlhMbhcxtzIDVMYG/oh6hOegzZzS+AIfjBKEY2s1x6i+ET9OXiZfiYFFzl9E0kwnj7CPZUbnxLRB1VD+MhPiupK8InssaiMMFjbk6AptNm0OeCYS2bewQcssUUkqif1jx3fiYqiX3OrI5hTfGiT5qyoq3J7PlH5heFa7JyWW30Q+lan56Qt6DW+rdBrIqwpN+oT6JD5AFe53BLlhLleABOAJOrrRC640dwJTVBu9Gz8vJRb3WhHonIRKrY17qk/5fLOba0fubU19joW/zD+1eZEYy56Nswr+oHAyTy/Vp/4FNq1jXkrWgfi80L3UZvC/BIzJ+TWv/Fl+G9HoDAgkLXq5aMmnHSclrb1Jv796x4hP2C5WXhKSgQIx/7qyJtt7orJW9W/Ro2a1rxFC5s1a7atWLEiCMdbPZREF2BCmPijxKIr7k/LYuLEs7ndi81BkbHlxt7bXX+HuuansjEVot7xghCLW36KIS/P7sq0I23alfUp7GXH9gl/R0xlonrTc/ml2UATu7ivE9UxuhbVdXupLbRP4xtGjhSVE5Wb13cWlnk9sXP3orpsb5t27q3JnTuLDrPaEN+38S2LHQvx9+J//9HzDHXN71iMrXuwZoq+o7zb0+b8zvOx79uev3e0TdvzDn/WEdiVCORrz1FUgY3SIqbqzKPYDfpZG/oV6WXh8Ogx/04yBDZsXBcO9W0vQbdksTI5ao8P5mpFrpu/YH4IzoDlMLb/czycJD/QsOGyUJU9C/J/Zu8QLi17FaOixhJZqIF8wNk3sZ/2dkQWgiTpRq9mHgjg9kLo5MMVDQ+XUX7vTQkRnzHdVG0/VPsdGmoP3l41vvfkzhbnXYK+1T4w9rgR4ntvSlkjuYj2Bha3jtqf2U0fQu1v1gHsTVB4Wx2BnUYAt7qd3HOUpSlOSSlmZcvlnIzS162x2/sdoz0KicNybl/tW9olvV+3ZktfshuHPrUla/Er7L5jz7b+/braV1tHFt/y3Hb/1dL+ovcVG3OevW3X29/bp9pdH59vi7a7nC0ZqjV8U+WYPfDh2ba47Ol2WA2zb6a+YzqLvVCnehVb2FXdX5DrSc7IhFT6u++GBD+A+vXrhyAdWBKTPbEngIGB606kfUv2Nm1P/YPvv1xKsJ2Bgac9B4Gob2Pdhfac1uWvJexPYQ8e1tHY/Xz5y+1PFWYE2DfDeUfsvYlcqQtzfXdF3aI9P7jKRdbRXfEeL9MR2JMRyG3PUb7d6gAnkrA2aUKKTSVTy1jXRqfEXtqpv/O9EWqn3rIls+ZYbVKUxaSo9lNtFyJbyoj9a9GCV+2tEa9aOO+88ol2eJsTTeevF/o0a/kEe/3HWxK6S3Xp0tXS0tNt/vx5YfPaxjgaKPSNS1BBfKPxfd8bBSPgoN3457tglIA4kvxS1LfRPookb84OVZ/9LoxvF4x2CL5CnQmXstC32rO1tyb2RoGBC0Z7KwV4u3clAtstChCdZG2CvUc9mp6lDZC7S6xpaSd06WePnjQqfG7scEUQPsrXecLuPuIJq7YZsZy/e9iZ3bbkua3bvVYnHtlonq1wo93R+zPrVTZ6oIGd2WuQ3dju9OjC5u9c6lGhlx22Ty+rpfrc0WFfPbuv3ba5XuWr3WK3nZBV7/uO+Ld13tpIE/eO3ftz7LyB9um4x7d6Ka50PXocbIsXL9HJ4gt19lV6QiFqq4x+wRFwBBwBR8ARcAQcAUfAEUgSBLZbOMJ6lJmJg1hOD+4KJatZx/rH7JZm12nyT+slV7WPB/3FnhnxtVWvf5Fd3rCl/JAr6ODDClZ8cy1if+/f4U47UFLT599dZ48Ne8dSqh1upzXplLi+K4bZytRa1qPxCVn3S51snSqWtTlzvs7xfK71KFlfZ7zUtnXzX7P+M+cpzyIbMOZdW1T2Ovt7txPN5r5jzwx4zKYXbWdnHfrvrYW0HG/Z/T8GTH7Nhs34cKsXlyhRwrp262Zz5s4NQpILSFtB5BccAUfAEXAEHAFHwBFwBJIYge0Wjmgr/uzEBY9PvZqeH39px35vYztL5TLlVG6qldZzE+fcZPcOusM+XiAhZLPlJxzsxptjfi+Y/5F9/F0f+2rRYEVmm25ruJ/rNovBNmT2aqtU97BgkWrU4GCdJD/Rvl+0jFzZKfd6ZIWZzdww0oYvWqp6LLQh8wdb5xZyr1v3sz098j6buOI1e/a7d9SM/ayVrEeNqp1u+9fkc0K25Sv7RX/AH+/+fI9NWjhiqzdX0FlXHTp0tJkzZ9qyZcvCYcFbPeQXHAFHwBFwBBwBR8ARcAQcgSREYIf84IL1KCPDSpfOGdmsZvlGOi+nu42fP2QnoBhvs5avt2Z5lDD2t5fst5rX2OHdnrXD9dzKpSPtoxEfW17hIFZlFrcDOr1uJ8Rs/pmSxzt+mDrMzqrb3TqlVLIa9etZxtxnbXrc8/mpR3idRFC+U4tKaEptZ3+XO+CWtNrWWSc7ttuN1jRcXG9f9/vY/legQSe2vC2/f23ctMFeHtHXrunxik6ib5QjW61atW1Vs9X2+4xpOgMp1SpWrBi+czzkPxwBR8ARcAQcAUfAEXAEHIEkQ2CHhKOsNuqwL+07KVmyZI4mH9rs/J0UjnTAnjaJp5Stl6Pc8tVaZwc1KF9qhX05pLc9u6Gp7V/7eDu67TF2Rvsr7MG5yqKw1FHaEh2upZ3d5XSrvOQje2DEkzYns7xdcsIHVjbLfhQ9nvN76fs2Q6LXga1utPKSAX/68b2c9/Ur13rM3urRcCE1RVitGWR3fXWnZRQvr+h11a1d7XY2O3OkDf3fydntW5lt+kpczu66mrZutT0/7Grr0/M1nbpdKcdr99lnH1u1aqXNmj3biFxXvnx5K6aTyT05Ao6AI+AIOAKOgCPgCDgCyYrADrnV0Vg26Gekb23eaFJ1f2tQab+dwmPG4t/Nyhxu1zbPCoBQouyf7fKO2h+UMdZ+0is7tL7brul1h5WXUDF6xi3260pFm9MbM9ZJMCra3LpUFiOfcoJd2qGVKYB5qIsiutrKZSMkGC2zOnWusRb6Xax41Zz1zIHGSBs8c5HVbXK4lZcr3JClOV3qyJhbPXIUGsosZpXlAjhpAe3qYAdUVl0yf7d2Le+0s9qfYjXk3peh31zjU5jS0rVz7cXhfXSg5NYSG+51RYum2Ny582zNmrUKmZurn2JhapLXxRFwBBwBR8ARcAQcAUfAEUiIQA5xIOETeVzkUNjMzK2Z5kNkPdqZNH3SFfb53EXWsMWNIRrdfYf/xWrZPPt48F/C+UNDx75jK0t0sTs2R6vrVXGRfTnuTVs551n7eU1J63XwN/bo8bda5YysvT9m423k9FlWbZ+7Q3l9O+5j05eutrqt7rEjtN8neirsUdq8T4n6j57yfdiWtGz2lzYnQYNyq0d4dHM5GekE9N7XLu/9mtnUK+zrBevtcOqnup/VqJz9OKKPjU5QdmG6NGPpGHtj1G0Jo9N17dot65BYhfhOS0uzPSHEd2HC3uviCDgCjoAj4Ag4Ao6AI7D7ECgibX/OsHN6N3uKVq1aZfPmzbXatWomZIq3VLGIldcm/di0cdNGu/vrk2zxmlz8y2Ifzuvv4i1tX7nXZW6YZdNXjI97soE1qtxcrnFp9vvSwSbjUXaqU6GHWdrYYCXKvqg/SpTqYQ2Lp9mMFSPDgazVSjWwlWm/5344a9k77dHDD7HP8zx4Nvd6ZL87pYGVVw1XbsiyPpUv28NqpaTZPNUjtt7ZzxfSP47Y9xI7puXlW9UOoWjggP5Wu05tq1mjhpUqVSrQ0FYP+gVHwBFwBBwBR8ARcAQcAUegECCAvEOAuVWr11qTJk2y5Z2dFo5wpSpXvuJW+02+n/aevfvLPYWg6TtWhdbN/21ntWhnJZa+Y9cPum/HCtkDc53T4Q7rVP/YrVpG5LqhQ7+zhg0aWrVqVY2w3xCdJ0fAEXAEHAFHwBFwBBwBR6CwIZCbcLRTbnU0kr1HWece5Wxy+7pH5LyQZL8y162wubM/sie/c8Eotuve++VeS18XAqHHXrZKlSpZrVp1bMaMGbZ8+XJt9doSGCPHg/7DEXAEHAFHwBFwBBwBR8ARKKQI7HR4MaSukiW1cScu/TT7q7gryfVz4tQ+NnFqctV5d9T2tLY3W8nUnCHcee/ChQvtww8+sKrVqshqVDxYEgnx7RHsdkev+DscAUfAEXAEHAFH4P/ZuwrwKo6ufSDuTpQ4bsHdi5XS0pa6t1D5+9X79atRN2qUlrZQL/WW4hR3d3cNEBJIIBDixv++c7Nhc3NjaKAzD+Hu3bs7c+bMmZnjozGgMXA+MHDOwpGDo6OyHpmBYczRvN0/mW/p6ysAA33qD5FW4VeX6klGRoZ8Mny4pKQkKyuiG86/8vDwUGne3dzctHtdKYzpGxoDGgMaAxoDGgMaAxoDGgPVEQPn7Fbn5FjynCN2cuPhueeejOEiY8vJEUkTkG5bF9sYaB7aW/rWf6jUj4w5GznyM0lEtrqCgkLJRHKGk2lpSO2dIXn5+cXBbaVeLOdGRZFKNWGtdHGwgwXLTszP2tvVFBdHe3HApy4aA9UVA2aatQWjXU3QN+jYkecPmAq/8z5/10VjoLpioCLqtEXHfIfrOdd1HataXUdWw6Ux8O/BQMndt4r9trd3kJo4ANS6zNtV/a1G3TutkU+6PqVAr1f/VxnWf5y81OpR6dR2RfF9637Z+t6pwxL5qNOj+KmhPIn03E9GNrT1WPG9M88X36r2F5G+TeT2lq/Z3LR++OF72b59O4SUGjgMtqa4IlOdFw6EpcXIAYfCVnWjI+PHdygA8c+62OHekbQs+WDaBvlizhZ1YDAf43tbD6fKsMlrZfX+ZLFHLJwu1RcDxphVlT6qb48qhox9rllE34rObbxCAX/LoePyzoTV8tfKvcVP8N252w7LsKnr5SCOIdACUjFqquUF6dqyllVL8C4IUMaabfS9rEbGgq7fGb9atiQcV4osrvL5hadlzNJd8uW8rZKZm489oKy39f3qgAE11lpJUx2GQsNwgTBwTm51jk6lrUa7U9ZKfOrmCwTu+at289ZhkikWOAN8I0SSf5b/rfhcAnyT5bei+5VpzaH4oUSZtnKEyPHE4ju2Ls48b+vX6nfP1zVEBrcbjk3MqRRwkydPlsWLFxcLRu7uHiqdd2RkBDLWBSi3uqowv/ZYbEdC4Fm6M1EJRk/2bSatowIkDxYpo5C5PHwiQ176c4X4e7nIgOaR4u4EIR276UfTN8jvk9ZJr+4NZOIT/YxX9Gc1wwAZn+y8AknLzFWWEA8Xx7OyMFazbpULDvmIE+jvi38jfX9GttTydpO3bmiN/tuh72depdVzdXyKvPbTYunWNlauaxGpaJv4euznJbJ3W4Kcyu0s7+DdjOJz3M68r68uPQa45qVn50omxsfT1VFZRMxjfOkhPP8QkG7XgW65BhfkF0qbOkHy+FWNpdDUcUPg+Xbhdpm/fJcE+LlJi4gARf97kk/IkK/m4tD2AokK8JDejWpLTr4+VPz8j9T5qTE1I0fyCgvFx9UJisgaYlrCzk8DuhaNgUuMgbMWjuxgMbIVbD9315hz7lK9mFFyf9PWQna8IGO9/DL/ARyUerc82+0GSTmaJg2iGuG3bNm+7X0ZtX2ias8zYKg81WGg+MBgkIN3xi16QFZk8aeGcl2Hj6V7YACu8+XQgd/lszXDpXbYTdK5JoS78Hfk+kAKeXfKs40SZEbBQOns7CwrjuNcJfch8myXhyWMgBQmy/J1Q+X3A6vwxVbxlOaxN0je1gWS6DVUnm3qL1tTPaVdWG08fEIWLXtM/k4qeVaTZ8Cb8myHHnJgwwvyU0o9eazLYLTFITkhy1c+L78nlNWWrfbP/z0XB3d5sP2nED58SlW+atUqGT9+nLrPjIWusBQFhwRLbEyshIeHiyesR7boo1RFRTco9BxLz5FPZ22WBGgUsatKAISf9rGBJYQjPk5ByBl4coWLkbHh8n6P+iGyc3+KXNUoDPf1ck2cVMfiZG8n0zcekke/niu39WgkH9/cTjJyr+zsho7o86KdSfITNONCYR+0ez0En+4NQiQXzKS5KKsnBH66GRnFAS51A/H8AghT7WMCJd+kMDCe0Z/VAwMuDvby1sQ18v2sTfLpkB5yQ8tIpQyoHtBdGCjs7WrI7yv2yLgF22HGryGL9x6V2yHc+3s642DwkmuxomvQt2HdpwDl7+4s17SMglCZB+HIE1Ok5Jy4MFDrWquKAQr+HJtHxiyUDQeOycQn+0qDYJ9Se3RV69XPawxUNwycte+RLatRUtpe2Zq06Nz66DhE7oFgtG/jG/L23GGyzzFO7u48FHV6iK9bbYmL8pXpcx+W3/YclvoNXpF7gyIgxDwlL3UaKHL4T/ly7gjZVzNObuv5rYTirU5tv4Rg5CDzlj0lY7ZslrDwO+U2vOPlHi5h7n6ybd+vsiktXwrSVsncvbBGwIrE+yJd5MleEIzyl8q3s16URcc8pF3LlySqzN654d3aEuVZS5wcvcTTrZG08zkmvyEV+Po0b+nc9nmheKZK3inA/D95tdPVUnDoB/lm/ya5vsPDEpwxU0ZMf1j+OZQn7dp8KG3P8EbGmxfts2YNO7m3zfsS5Fm6x3v37pGvv/5KafvtaiL2x8VZHf4aGxsjkZGRwix1Dg5Vs5E5QvO4bPcROZycJvWiA8XDz13mbj0sR05mYq+tUWG/aV26u2M9mf/ajfJEryalGE5qNilMMWaDzDlrdALzae3jTibWVlwH4eN9asnMhaApX/miuvkMBT3rYo6HonDH5/jHd42nySyYYbSuo6zvrJvvsS5+WseqlPWeggPvKHwACH4SJtbBOssqrN+Ak22yHutijivgz6yb93jtiPpzEauWnJqhXGjsIOhax4mdbZ+s4agu3wvAIP6z4YDUAF5bQIinhnzS+nibuLOG+TT0shyNd25sI/Nevl76Ng6DVr0k80i6NcaEuDTGluNjLvzOP2uLrjEXrMdS1YPxMujC1rus3zzextjxHd43Cq8JI/+sx9t4xtan8R7nKt81mGpbz5rv8TnCwLbYX77P7/wryy1R0WpRO2zLmBvmenlNPLA+4od//M5+c+7bQ4BNy8qV5BOZynJCerdu78x4Va1P1nBUh+/sPxVbs7YcEndfd6mP9fvYsXRZuCtRnICTigqFI29YIP76Ty+Z+nQ/ifb3VG52xnscE4Vv4JFjQlzyz5q+FK1iHEjL5mKMPeuwLsaay99YN8fFunB14+/8Y1221knjGcJkwGhdj63v5r4ZtGlr/7D1rnmvMmiddbD/rNdWYd3GPCCctuahgS8Dj9zz2Hfil8/zOuVUjhyFe7sd51jRb0Z7fJ/PGP3hJ9/VRWPgcsLAWVmOaClwcHAs1c/zYTUSO0fh8uTs4CWSPkZGTtsnTXzZVBt1f/PKR2XeyXhkfXhQooJmS+vYa6RtzkBxylsvH64aJsl4csfiYPmk1w3SyKWPNA9xl0NbnpKJSQtF8Bfs8yvELDc8BYFIciXt5J+yO+sJaVJzk6zNipfu+IX3PcPvEej7ZOKix2QTLFCbljlLQJcbpRa6vS8XD9kq4FcsngAUDJJlzBxYvOAZsG37NRLXxvJCXkG+2PndLG/0CpaMQ6Pk9TVf44eG4k505rmJo+yWmatuk/iDXQT2k0tWBjV7XurValuq/WPHjsmIESPUOUY1a9QUJ2cnqQUXuujoaImKihI/P9+zOgCWG+SUDfFyGkzj//o3k+8W75TFmw7KGsQP9W0SDleN8l0suPhuQqzGZlid6gR5SVxtP2i4LBpLbiK8v2zXEUk9lSXNo2tJ57pB8s/GA9BU5ksPaO+9ily7Fu44LIknsqR1dIBEQEBjHVzXl0MTuj/llDQP95fYQGo2TysmLTMvX2aCKdiGttlcbX8P6VY/GEKla7E2jbBtxu/0sW8c5ieBni4ybu0+OYHNpSHg7AVm1xXa5h1HTsjMzYckG+44cZEB0rVeMPAP1rik4rXEmFBo25oIyyRcEY+hPi83J2ke4S9tomqpd4tQUOIdfiFMx+DetRjWDHdnB+AjGDEtB2UD8O3t7iId6wRK41DfEq4tfAf7pCyFELvx4DGl5Y0FrjvXCRY/d6digRSPKEE3HgxSa+A6xMsV7SQo5rFJmK/MQB//XLGbgWKyF5bgP5bslCBYCVvChfI08Yr7WxA/xj6lnsoWbzdnaRHpr1wsSSfl4aNUR6vBDTIkSRDyp28+KCH+7jL0upZyy8iZMgt4OA73FLqFsl/lFf66aFcSaDMDuLDQJjXypE2Oy2L8xrmSj3nSo2GoRILBnAgXPDIm3UBHtDxRgTBh3SFldeI9DxcHhUvS8rSNByU9J086wR2KWnzCw3eOpmVDSZEgB6C0cADDUyfIW7qDvlmvMb8I98IdSaqPtPRmoJ5/UB/nbHvU1wH3yDCt2JssS3YkSg3go0u9ELhU+RXPEVt9Z7+oOViCebtqX7JkwVWN7ogdUWc90J3Z3db6fTLPOzGf1kO7HVPLUz3/18oDchBzuDbctrpBQA3xdi2mWb5Pxo/xLnOglNl6+Lia340wBzgXHOApYVgzaLWbApxk4dmewDUtf6v2HZUo4NzL1UH+WLlHWQnBpcoSzBWKB41B93QXM4aZtL2GfYLFNNDbHXgPlDqB5ffJuo/V5TutRnSp2w5cD2gTrSz4T307X6ZCGTCoVXSFYHK9yMY6umBzImjztHTC2uxZRJscR7qUcs3YlpAqrlCkXAtXao7BCqzJXKNbYT6QvlLSsxXePbCedcf4KvJB5acgqE5EvJ4zhFZ6F3B9YaHQvTPppCwATVKQ9cDaGRfupyyzVEhwrBRsoOPpaJ/zrVuDYFkaf0xW7E7CPucgfbB21w/2lpy8QpkMZccW4MDHw0V6NwmTcAiK5dEoBRr2m0Ll1kOpas6FoT/d64eq9bC8dwn//O2H1ZzrgrmcmVsA5Us8kiAVSBPsKbzHfpqtdhTqErEOLcFawXXXCwJpc8xB4o9zmXOec+4k8DUB+HIDrnvDC2Mv5sxW4J7PncjMkdlYV3ZjbtXA/s91Ywf2n3awZvsCf3yfc2jG5gPYE08AytMShj2Re2wt4KWiPrFfumgMVAcMnJVwZMtqdDIrWdYcnHbufcr6VaYf6CXXNXhCXsKf5CTKos3vy6aTrDpb9iTHF7WRKvtOZktrCGkONfOxs8XJS0iIcKakS55zrFCu2pedUnx76orb1XV305pty8bhVBN3C7fLZuWah1cKJsqoeRYXvuLKyrsoPCoHi/h5pxLKKMDqFCyeeDfTSUl9uNoqE9fNkvA2veSRvl3xPVv2w6L1XVJ5DVy433rUuVs6RN1QqoEsZKIbPvxjSUM2OgpGDo4O4uvrK5GRkRITE62EJGe4JHKjqkrhBkiBZDY2CX8wEFc1DJPDqZmyeM0+mbQuXq5uGl5hdWRs/l69T977bancd02cfH1vFxWTQQbvr1V75OlflsAlExY7goZF/+mr42T82v2yD0z4sjcGia8SpkTeQ8D7PNz/6pGrJLZTXWwaBbBc1ZTPEQs1dv42eRf1PhPSFOJzgRw4fkoeR2zILMCIPcBSsMHUwYbzzeDu0hqbCTcDwvYnGKaP/lopg3o2kiNgcBdhI8VuBFgc5LGrm6nYkls/nyUpyYAR79ghVuFVWAr+i9+s3a4MZHAjGr1gm7w6dqWcxOZOYYPSuSPefaR3U3nz+laquwZoxnv8JEOz60ia3DlqjtTF5k5XxC9mbsJ8g3sbXqgFhvKjOzvKja2isOEWqk2PzOBrk9bIqNmbpRBCpSrAZ0sIViPv6iTNIJRxc+b4f4K6JiHA+uVb2ykmcNry3dI5LlI+Q513j54rWRB6oHKUuRBQ50JQGtStgfwKnJMR+mLuZnl93Go5dRKTr6hPTth4H0MM2qvXtVDN2uqTBaDq9z+15wshhNIl+Kau9cFQh0gj0Nu6PUcUg9e3cfnxFUx2UohBeX/qOpkFGv/ioZ7yQJd6kg3a5G/vTFknH+AvjzjFXHL3cZP/Q7zHJzM2SgAYkpWvXK80uaeA2yHfLZAMCBnLX7lBGrr5KKaIVrynMW/2HTkpM/43AIK9C0izhhJwH/9xkWwBE896Fb2iL12a1JbvB3dTQj4ZKjJW701dK/PgKvmffk1lHGA8jHnF553hVvXJXZ2VoPHIDwslDwI5uU4vMI5foY7rQBO2YktIQ6S3l8etkq/nbpXTpEvCgLnh6+ch79/WXm5vF1sms0VGkMz5y2MWyfVd6iNxS6HMwBxESk3UU1OaQmD7Bu1TAcA5SkaVyo8nfl0qszD/VV9JSlg/BrWvIx/c0g64dFYMcxbwyPivFCgjPgIcn87aJLsgBA29vaM0CfeVwV/MttAt3v0CMThfQNkxfEh3FYOTDOXMi5iv32PenmbMWFGf/MFAfnRHR7mpdXSZfap+lG2BiJZ9rtNYqKQ3aLlv41B5yctN5mxJQHxopgRD8WEWpK37QeXBKawnD/2wSNLBmC986Tow2r7qHTLqj2KNnYD1A4QCvNaQbxCzRGb7i6kb5NoOsfLLgz3VekZB526soREh3rL2tRvEAes2LRsUCO76cjYEa1dZh7XeE7QBkOV7KOCG/rVCWbmMdcYeSrL74Or7/k1QxuIhwnYSsYIPfr9AgX1v5/oycuZGyYeljGUE2vr54atkLPaYLzHfYBJXe0x9CAt//l8vpUizJRCwbiZWefTnxTKHuONewIK5URcKuNEPdJW2UCzZepdzg4L6O0g+tAjCyTNY58eCtuOhgOP8wGSXu7s1lA/hruziCAEJVVNBSKHoCeByM+cz+s+2HCAgPYU5+/zVzdU+xb2YcN39+UyJCfGVw32byst/Llf7y3isDUshFH7wxwqBeUzR7gvYVwVC5+znBihl3k6sIY+OWSzzN7JPqkNqP6kPZd3X6FNL7hGEUReNgWqOgSoLR5yYtqxGC/b8KgWnsXidY3FyaSIpu5+QJ9ekQdM2SLo2HCydWw6W5VMxIQUma5OgEQYNZ356OiY1YoYyFsjbM9+UHEdPyZFaEhcSJ4ewD/dS8GQUQ9Wp6WfilfghkjFUotQMlCA8RmuUSB+5tXUf2bLhadlUluVIPVf0n0U5Zb5juSasJ/6UtzcHwhXwZrk39Hf5IUHEN+sfeWU8XO+8roM25xa5OuZ+uTZpivychEXmIpYmwd1lQKPHS7VYCEbsiy8+RzxQgmLI7LHY+sB9LgLxRbGxsRIYGCQuyFRHq2JVC4UHLrqJSWkysFMdCfV1ky7QTjuCsZsDDS03Nz+MdXkbLNskn8FdT2mccUl3gHgwPM/+tkxSjmfI1R3qyM3QbNKv/Tf4xydQEIFGmK8ZhfTNOvhhLtb3uenSDXDW+gNyQ8e6MhgMGBnFEbO3yCxs5K8g8H78431Am5aKFExglmbAenBH+1h5tGdjZRkZNWezfAFhY87WQ3IX6mmLTXUq6vxp4Tb5ePpGGQRmidpRZnMyF8LHfnwPRoHWo88e7CFNQn2UhestZIIagWx+tDz1a1q7TOGKkFF4jAfTvsY9RT6/r4tyCfkdG+2MVXsV3trCghYCbT2Zx+Hzt8oXE9dKQ2h2n+sfJ/4QWCiQfg/4H/5xoUx7tr94YmMGGixjABr5fuEONS69WkRKWwhR/mAwR4AJHIv6Z67eK+0h+N6KPqo4A2yadEf6dsEOwOEgwx7uIA0huC0Gnpm97SMIrtT4U7goS2A046i6XJMZmAZGnUTVD/1lAgoK/Ou2HJTJYIz6QdioTLGmQQoAtFq+O2GNyhQ5pH9zFcO05+hJ+XnZbskDM2nnWXI+ktkjLVqRt7LmKLo3AMEDEyEkMHPek2C+BgDepLRMeXvSWlkIpcUnEO4oMFCwYqGyhAM/BbQ7uGsDqQ+m8TfMg8mgpRf+WC4RELbfGtRGQnxcFXO7AP1+H8wtFSGcI6QZcyHzuAfWqp+X7pRmsCi+AHrjGkC6GQVh5H9IyEILQxgEwbLWBYUv4Gg2mHQK/z8+1lvRFzOibYSw+uLYVTL2P1cpJpjM5rO/L5dZWBeuwTx8APM5H337DPN5LOie1oiREOwNMO0B32m88y6EUm/81rdNjLIgNIVl+MN7OsvoedtkV8IxuQu4aBkeIB1gGWIbu8A8/rpsl7SEcPZcvzjxcXOEFRVuyphD7BOtVEGwtJbVJzOOqsM1aSmlyKXOBcIHLfKhPu7SLraWzAUT2Gb3AABAAElEQVT9LIRV5i6sd1nYPyoq1rRJy86XEIwnLNoBpZmnPAKBv2GwlyzCevA36IAmObWuFlUMUIrWbmvqttxn/Sx8joL394u2qzEZ/kA3eAT4yRpYv97GOvM1BNruWDuVYqiIkef6dxz0vxgWv0+wfjHmdTiEoS17jsp9SCQRVstDvsEanIsxHvbPetkOGL8C3XwA5ZCtwnV3Cfa8OZgvAyF8PwilCfePkaC36VAWvQQBetozpc8UNNel+o6+/IJ5dg9wHHdzW1kLy9Vo0NIYzJFWsLY/BPpj4gTuoYMh4O07fEIexVzq3yxcEuDW/B7o933MA47ZQ1BQKWs0G8GecuRkhqLvurDS1sLaTeXAdc0joNOy9D0XirDHURf3p0hYxLmocLznQ+F1U6f6cn/nekoQYhzxbAiPQ/9eKZOf7Gfugr7WGKi2GKiycOTo6ITFBbPAVLLzMmTpvnGmO+dw6XW7PNC+iUyc1VHmJX8tuYn9Jc7XAmYBhKMebd6U2QuGihMSMLSB+WXX9pmy07m7SGBLaQNDzNTj8dI2brTcFiUyZvxtsjHrYWlX5xEJOPC8pPm+KYNiOsjmYyJ7KgAx+cg6CFl3Ss/618kmJH1oG/cUkivky7pVFbxo62cTfwJ7lBTkpUty8jCZd3yNdG/zrkSNHyUDuw4X+52Is9oyEQyPl3SKqSdME3ExS23vBnJXqzdLjS9h+Pnnn2Xz5s3FghETLtSuXVti68RKCBIxuLm5gkEzSa5VAJybwhRaUnB48IBmEWqBpvtVI2hh10HbtRIuKwOgYaYVp8JiIk26FUwBU3o06YS0aRIuP2HzorsGGa8OcM256t3JcGuCBG0q6nVTHcZP1ve5MQxsESX+z10DN4xaYHKc0f8aUhsbRSdsEBvgdnYUWuLaYN6KCyww3HRH3tFJbYTXxIXLKrhCrYT7YCtoCT++vQPcogrBMIbKsj1JsvvgcdkOlwW64yj1X3FFig9VblHfw0JFNwa6M3Fj69ogFK4iJ+S7fzbIUlgmBsRFwMpVjqYO3B43elraGkO4IlN2DcagD9yp1sJ9ghrhJ2GFij92ChadreKEDfKre7ooZo9MP4UVus/NBcM8Hn9DsMnTxUThCy4jrPMbaAy9XLBuAH66qwxBNsFD0E7OBJNIF5DHYcXLhrtGLupj7MFPD4HJAB7aAa+Epyu0xNthifgZG/4y9ImuLOX2yYSnS31JTexhMCYUYvwwjnS55BjTHWsYmP3ZEIqTYfGhWyfnQXnFTIMUb8j0/A7G6DSE5Lv7NZMv7rbQlSPc3yhs3gUtunViEtZhtXyrJs33CUUh6v4v6uwJoaIP/tgPe9AJOaA7RkxXLnykOyo2OKoKNozfXR3ryOvIpMfzz9pE1pJFmAupsB68CcHoUcQCUqBoCGtNB7jKcUyPg7FWloVisUOBA2VAoXANGP94X0X/dI1joTZ9CWJZNiHxyja8HwkrUrnrAuinUYiPfAcaVFkt0Q/OlV7Dpsg84J5B5R3hFjoTSovp6/dLHdDcV5gLFOLZpzhkU+uEOfgrrKAPgnkkE81CHFL4vAvW5f/CoknNPAvR8R8oPqaBQdx1IEUJw7eB+c2A0E+LE11eJzzRFxYFL8u8xjutiScw3dvhWsX5Xp7ApxqpRv9x/OlSuAcuwz0hQEeD7ijU0ILENWEq1vVbIThWpphp0BC66KJYE7h9C5ach7o3lFzg8NZ2dZQw/SUsJ4ruzJXjRql7/N10n9OMbqHf3tdVubV2xpqs1k6sKzsgvH6FZBrs0w1IEFFc8D4Vf29AUdAPggXJ1Rdr1Q3Dp0E4zJK/IHgzs2oNPMO5+QgEJrpiq7XQBkC0kLN+v2evlo6gRx8omngURhTofB7WXc4NZmWtDQtrWYKyqhZryaPAy8uwqCvcIAmGD9aSF2HZ/AFC5T0Q9BlbRIF8H+bMDVifP4a1kzigciUU+9M1H0yVkRBgaLX0pUVIlRpqnXoH85aJYyhY0uWZcUjhmHMU/E6jkjugcGwW6qdccpmd8RaMdXCRkMw1jTwB98S26NNW0Ajdi4Mp/Few1hXjXV9oDFwiDFRNOMKOYMulbtn+cZKdn35eupCT9K2sThsp1/VaI9cV1bh/5zBJEEs6gxy33jLseotGJefELJmYEA/LzqMyK3Cs9Oo6u8hSlC2rVw5BhrtUWbv4O4npdT9c7iw2pMzkCfIn3mkacQZcOGwUl+LrrOHy3Zbm8kijV+QTJH5gjNLmjf+VHcVPWi6Kn1dP0LZVVMz8KK+LvvP5/EKL6Wniyu+kZd/75e64IJm8c6/cXRdt4Y+lIG2BTLuIViNvl0AZ3H44NjYX1b75vxkzpsu8efPULS7gTNkdGhYKi1EMsv6FiYeHR5Uy05nrJtN1CBqsebAQ+WJjbQPmJwNMFwWbPthg10HrO2lNvFwL4aiqhczmLggK3MioZfbGYs24Cgr3obCGMM3ucQgwZ1vIBFADdwy+7vS7ZsY1XpM5TQUzxA2whCIBu1koNjsyrFnYSMhY1AWTROEohkHI2OjIcDKYlfELu8G4MejVrB01w8pNkwwkhYoDEFDYNtuzpxYf5RjcQcp616iHOGIMFGOGiHcyCRQge0IgWQsGbxv6xTGnj/pRbNaMOYlGzBXTSPNdMhmdoe2eCyZ9DTbfh7qx7SJiByx9YBWh5YlxKNwP8U9t4oZrBZngQrTLPrBQu94MAlMOvtPqdwwxOWQ2HEAnfDkFQlRFfVIVVZP/aNVjTEMq+jIQjLQfhOhTEGYYp1AXbitbwUBT4LsWQizppdIF6ODz20nfGAMK1BwP3iNdUGiww33i/GwKqlACwtWwPJIGUyDAcczo5gTCVZ+M++AcYKHQS8kgCu5huRCKmTCC8ysYY38CAlAE7mdjnPkOLSOu+C0zI1fRLK1J4JZKgUlavKpRqLL27AHTegJtF+A50hw6ifgHzuVSr5W8AQREg+EknLQW8AUKJg3DfGQJ4kj2wnrcBQqFtbAaFGblSVu4/3gDNj7LugPhFti0tq/MAqO/FVp3usqyED8UFgdg/jNmj8oS4hpgwXpgmUd8jkJ+HuoyGFyOEWMMaSG19ClPua3SUsqXT6o+VdQp1lw9CnE0kW5h6GMf0AoN5elYG5iF0RnryrztCcpNKwzeAOx7ZQvrpTvbAcwbD7jlMSaSzDfph2tcPaxBHKDK11iyZY5HfQjNrO9g0dpJ4UdRM+g4FbRJBh5gqEJBwAXjTcaecLAogR105eHsKLXQV7VvYZ3imo4NTCk92GdlZVRvlPyP6z+VV2r/gEsg10heu8HVmoJOGuiRax0oq+SLRd/UXbRH+ubeYcz93qCvFwHrYeyrVP65OXmAvqERRl+7YB9knYyV5drbADgIhPBCZRX3kAB3f0vt+C3Qx0NZteklUQjFJdvjGsB2jKHMwXUW6jLGlvNM9QnrBfdExkJRIHJBn7gmcO0L8QFWbcx3m53UNzUGLhEGinn5yrTviPieEsweXioozJP5u3+tzOuVfGaV/Dynrczw6iNBUGIcPzlDEihLOD6KhAzZMn12R1nj0kX8CuJlX3p8UZ2pMnVpT1nk3kWC7bJgQsZZIkZr6Z/L2+N/lVCvJljAN0lCFnzhURYv7SiLi54p63rHzrvlyf0NJcrFDYsW6rTBu5jfHTWxZVGNeO9A0SU+kg+c+Z5saleyPocr3edFD/4pW/a2lkiXECB1l+w4ufVMBRf4ysneFSm7R4iXs2XjNze3bt06+eOPP9QtZqZjyu6g4KASKburmpnOXD83iCVwcTkCtzcHMBnXfTpDbUjUVJGBYHzQAiRJoAsAN6CqFG6ASYhLw26gtMZmbRUXc9tbTuVa4AZDZu11uDT9Aq1cBhZ91sd6eW0P1wNbhZussbHweVqxWMhsGfDwd1qheMPYdNRDVv9RgGRA7EfT1isNON/nHzcsMrCWmq1esvGV71i344HNjCUVmzUBPgJLUiE2OgZEs+9G4ZVr0bPJ2AQZP8KfWacBABlao8/Ge2V9sk8MbP4YboGbDx1DPRYGiBtyVfpUVv0X+z6FPrpJEinztiVKq9fHK6sM11FqhsGhqKx1tJhWpRDvdPvigcgUShg8TRoyivV4Gvcr+0k3ot2ISRuGOCfG7lBQYfVkJtkQ9eO2Ssl2mbSEz1mCvY3nOQd4nzWWfN54wvLJ9hjr9yVcTw9jfTgNnJGOMqGEIPNpG4KSdfCbec4RFr7nDoaWuKdLGNcHMpJkHknfxQVtcZyoeQdXqFyTDNcs9Qx+Aw9pwQ2BraDgcfX8CFhAR8MKm4Q2i/vEmKoq9KmCpi7Kz1wHjoIJnrvtkIqd/Bhxhl/P367GlKoOKjiyEUvK9fu+ToiRw9pQ2UK8nwBjz7WMrrrMiGamFfN1Zes0P8d9ZzYUcsPhqkvrPYePfyr+jeNQBnEVt1tEG8aDpDEWflhovuiLulv6P8v+lidvwEr1K1xgmTSCNbD+DAhFHhDQywChVGV8x9K6pQ902bNDH5jsgUJegEe+HKMSEBW6UQg3Fe4/7qD5RAhHRxHjaaZvts+6Vf1GA6Z3rS+p6GR7r8Ct+w+cY8VkR+Y++UABp4vGwOWCAdNOUDHItqxGaw7NkJPZRyt+uYpPJEMossT6FL2ILHZOcDRjzFHayYVnhB9TvWnptu+DxZMEvHNWJXdr2dnpzqrCsl/KyVolO87ekFF2xeX8gggEuaf1u8goVqfUU/Hx8TJ69CjFXDCmgCm7A2vVUskXIiMjxcfHB2mZDTN8qdcrdYMCDFMak2ugRvgkLANqHcZ/XKjtwHgzU9Zy+HbfgOQAZNIqW7h5UwvMHYuxEeYNj9dc/K2LUbvxafxeQimAF7kRvAb/9G+mrJcucDu4H77dAXCTYvaxJxBke7JIu2i8f74/ubmvg9Xhji9nKZw8Bdc0BrtSQ/fTkh3yC/zOK1ts4cKIJXEjE4m+0kWiBjbcPGr8TMjhJbWWvMkNnZYSJchUtnHTc45wwVix74jcieBpMhjsUxyCk5nJ79tF2+RPnhF0GRVlFQVTz6xSFPLBs0DJYpngpD26tWTi5nwwaXTB5IGKVSnU6NIamgD6pka3JH3bou4zQ2caQjUPzO9y3qQhacMD382XlbDc3tGjIQ5bxvEHcI1cD5p7AbE55verAnNln6X1lIH3j38zT6IRx/Mm3KqYgY8Nvzp+laxDTEdli7lvxjtMHEK6ZiwR6/TG3OV3JfwZD+GT/VRWTtC1D+i7CsuPqRbLJcf7y7lb5OlvFyBpi7+8jRgRuiiRsX4ZMYqbGCh/GRVaCZZjHPZDiHbAupMHd9pjeRY3ZVp7aQGhFYku07fDtdCy4laScoATN4wNrdZUatHKYaboEuuxFc44RuU9y2Q022AF5DrDBBBcZ+iuSVr4ackuZJnF2llJMK2aVl8r8yrn2BsTV8uoyeukA/aPIYhxYzY37h+PY/9QNGerchv3rOkb6FLuq472jsqqSZdPZqZkn6zrpVWK1k16OxgZAm00UeEthW8A8grm5vdQbHWBi94DsJT7I/Mp3YbZp3OZOxUCoB/QGDjPGKi0cMQkDLaC7eft+uk8g1RGdVnj5MtleyXxIgsPZUBzxdy+oemz0jCoU6n+pKamyiefDJecHLoxWVJ2+/v7S1RUlErb7e/vJ2eTmc7cEJlHmvIZl+AEJu+vR3tJQwRy5xWtohQAhiJb1Q9YbCet2w/hKNL8utoA+Qw3GluF9dPNh6vyRvjzc9Pg87x/PL3AYmExvYrbigGiBjkRcRLcVLiZcDOlFtMofIVWremw2jAzEH24W8Idhy5htAbweaUdR1tlgGZUddaftLDwUNFTcAu6pVdjMI9tJRfaZ56pspDMOPpMvJg1gbYaY19OQVNJlFOwKYDLH6/XggkmNx+BQNvTEIgYcEvh5wBij1IhwDKQ3JIU4bRsSYQ1Fu/Wg6tYZfuLJlRRMOJdftJatnB7omSCJu5CvMtryNaXCysc+zQTyQtUnzBIFfWpqOpL/kF8UjCiS10HuByNebCHshSy76Q10lC/j6bJQbgsMqU6A8BZzLghvdpSCPAZJ4wP6XsL4neYsvpGMCRk7hkXQBedQlwbhc8bwtRJMCu0ODGNL4XdTEyMdNCAUTg/mHVqFRQSoXC7+fTOTkp7zyQshJsQ0jWUNHghCptgP2ZwfoFxexq08GhvnF1G6wrKhwiY52QmnKSbigrplTSjaAyfSdCQs38UWGvDpe802mqEdQcTXqXFZywX+8aqmfRkD8aH8zy2lpea4xW1x9+NMSSMHEO6FHG+TIcLLen4vwhkH4KsaIxbKoDL0ntQsrBPVApUpk+VgeFCP8M+KsUW3N8eur6pSpphnL/lAMF9TXyyXD9ihlrf6SJrOdzVwIxFwcT+WvK+lYSWlOuF9YYuvzwPjZnoiH8V5wY6PIE2iS9j9HGpFDgk0EwI9hTKmECAKdjT8Z3PGoVWUVqzjgOma3E2HuNquM47YYy5pnL9N2iFVu/zXUiLjLVjCm87WFPexTrHBEQFaJcuaIrPwjXhrJC8QUtcvx2AE7p2uiJzHI+NKMRc8YK7nR9jmVAJ08SzMh6RQMGS/eP+lgKPgCTsWb5QDoTDvY5CaGWKgRXOE9I39zu6385BnxwxZsOgzGiH8664dh2AVcqg6Ur1qTIA6Gc0Bi4wBiq9uzk6ldZqbk1aIolpuy8wiEb18bIjaaJNi5HxhP6sGga6RN8qnWNuKfUSBSIKRidOnMCidiZld1TUuaXstm6IzCMDkZOheWyOYFZmRvNFTEYtbGr8Y6D2tdBY22HTWgAm8xC08GQ2+MeSDWZjIzYCMj9Y60sVLszMUuWMuIeZ0F6+jcw8+7AhbsGZDa8i69YRCEDYiYrfI/PILFvcSBnAykx5TEXL7FbMLISGzzyLa1o6yOgw8JbnP9BH/udleySZrjqAhwHj2XBFswFacT3ncuGMzY0wMQXxbvh302KzFtrnSYgVAnenNisyJcbGZKst9jkJfaR7B8+y4JkW78GVaiZcqRgz0B9B1nTPiEY2puvBvKfh99dhMWOsBpn7H5AOdwKybfkjFolnmjAAuaLCzZljz5ICi8k6uLUkYWPlJq4OHgRMe2Et3It4Go7xKuB3KgLm2SeOGQXq8vpUUfsX43eOOd2KeHYX6YkB6hRkyLCRtnmWUD3grB/OQ4HTvnIlBCkpWlFuOajgRFaOSuxBhtOahsiMEFf9MT+ADPkKbloMwKb7KZUN7yJjViHowaxhp2sSlQ+nwSwOh2sXzwVjZrt34VpEvJIWjMLxIeNDS+5ajA+Z0gQwOczySIElKwfxThCK6XJzIYqiEQh/LBvhXpkCBo4JDaaCtvmd85ZzmTEa5dICaGb+9iT5FJZUJhXhevHcn8vlECwH9WGRao4YIsb/9UDcUWOsP8sx50fM3KxirDgvmI1uB+ZUN8R0tcIaZa15t9V3wkMmkBIS5yYVDadyctW6ResR6YEJW1LACDP2YzLcLjdjrWCfmKGPcSLmcbPVxqW+xz7ygG4mD+CxA9cg9oqWD2Pt9gXTzzOzGiNe64SyniaqOc/3jL5x/HZT8LRRuHazPs6bPNDgK0jtT2GCyidm9xuDBBnm9ZhkSLfrQCQDSAGdMpMc14nVSKzwDuibNGueQ0720AsD3xwfJrCh+95GxExOo/AKuk+GhZe/XahCRRCFE85RnhHFvYPxfL9g/6ALHOcVz71jbKcZbjM86j7qYUbFKVAe8vgLZr98E67e0DDKtUgYROsdXQVvQ6IGDz83+QVrxO/IhpcOetyB+UvvhxwoC27G70ykYEsRY26T1xb6tqQT5x7HdYTuw8w6SQsUY+zWAZfsE/dmup1TucgkLzuAa863svpk3Zb+rjFwqTBQKcuRHRYSO7vSj56XQ18vVc//5e02COwoA5s+XQoLZLpGjfpSDhw4gAUMmzwWcG8vL5WyOyY6RoKCghFM7Yp95QwjVaqSSt4g06eYLWi5eHAlF3IyYUbJgmDBBA3B0IAdAoM2e8thdb4LNVxMDLAJAss170+RMTgfh2mwFeOCulTcCyrhgs3DQ/8PlpWPkdnodZzJMAyfBWi3JzT5YbCGHGA676JCy8/NrWNkDBj+HQiSv2rYZHEBgxYCd54GwT6y6igO2UOdZAfpp81MPW8i/e5/vl8oH8C6lY+NrjHcZR5ARqBv/tkoN302U9biXI2mSDCgrCyAjdo988agfNxx35rpUq5puG/t5mPASrcgCn4RcDtbsTlBmr8yVh1qSY3qIzhLKREMySRkFPICnD8gox0TUdgq1BTGQKtIJqXta39LDTAGOdAmYqeDu0lzYWpiPsOznp5HqmgG2f4OYXEc0nA7w90tDQykD5iS96ApZIAymQxuniruyUa/CAM3YFraqGGcgI1zAhid55HhjBrc3kjg8CkYqiWwGsQNHauC9+nixT59gj79jRgUpk7+6t6uZfbJVj8v9j0KGjyEVKXwhmtiXwhBHFMjMJ/wAMVIWBEu34CRY1Yvni8SgYQdjZDhzwMC/VK4tHV/b5KsevUGpXW3pgnOnxvAAI2HxWjmyj1y3+ezEBOIlPewRPRBAhNXaI2NaAQyj2TMByPj2mwkIpiD51tDELDD/VbIlhUARcRRzAXCx7+6FNwQBzUJB/T2RTaraNAIDw2mANwd9+dh/O/8ap4sxZk0dIcthg20Yi4qCQLowNxvzh/O81wwSbaEK/5OGroFDNukNThzDCnt+cl4IAqEzAbHdPWv4GwmCptMu63aMTdsXAMeHkL7HVLKv4ZzxvKAiAIIVMTv0GtbqIxjnIN0aRx2Uzt5CK6Er2CdeB9CEWHLhABQBwLU26BNauV5SKkBf74N+BWeAWM7tDkbDOtQpDF/FdZvpvUf0DxS9WkqGNjPIbwyHTXnEN25HruqkbyDPr3w6xIJwLy4G+tZmX0y+nYJP+lSNwcHhR5CoH8khEoejk0aODOeTOziqNb1TRBo/0DCljuxXjJ+i4c9TwP9vA3crIHiY+x/eiutAGmCyQ7O1CHyRG8ceYDshGuRWbDPsKMqKYIz9onO9YJkH5Q5HAsWrt1Upj0A9+Z3/lohw6Hs+RJCA/ezq4F3as9YP5/nWtsLiT5iYDndCAtS69fGqaQxKaDvx5BRkckJJi3eocbmR5xPZYx3LvYjM2ysG5uNZDqiXgMQ1K+eAc2b9zLcLi5c/0hvNyGz2xsQvJ8cs0idSca9gYeCP4Azir5FHOm938yTmf+9BlkfA4oT1hRXggvVJBR0TO5y5+i5cGsELLB0QqMkLRqFqPTgxAuPgWBSkdcHtQU9LpM7sS95gcYoeOVDeOmB9eNJWGY5RznvyoMfj6g51xrr90Sk2b9z5CwJwpo1/4VrVWKIQdg/34tfKf+HtOHvg8ZzgLM4jPc9GJcfsc6xT7OQ4ZWHtFvveea+6WuNgUuNAbtXX331NWsgqNnJzYVpOh2ZYjzcEWtCZhg7uakcTN0mU7eONN3Rl5cLBoI9Y+XhjiPBnJW2Bv7222+ydOmSYsGIKbsjIiKkbr26+MQZLeeQmc6MH5AYNsICpZ1rhMXzPhyux/ggLr5G4SWzONEXOgQpRyOQoYhpeZ3AUHRC+l0u8DwHh1rdIBw6yGxxXmCWuuLsFGbh4WLPOnhaeiTOanABk8qzUm7E4ZEvD2ghv2LDToWL0WCkQg1EFiJuIjw0k6eLF0BI8EaMRVswOe/jrAqmVA0EQ9WNAgmEM246bZH2NxTpmanppxWHKWHfurE1Mr2FKia1HtrsiU3YEPooRHTF+9zMFLMIHFAADETdrDcadamNqWgjD4ew0R33mdrXvCkTP8QTrQ9MpZ0PWF3QfhAyaz0D/3mebVEHbXsDF+2hvW0CAcfMnPJ9Wt8OQtjgOTJkMH98sIfyT6fI2wrvPAm3n//A7YcY5MbP9nkC+gD4x/sCD25gcoir3rBcvHNLW5WyWAlErBzwM4NRKCwlhJ+pXM3wExa62MRh0/cD3psh415n9CMG1ilmc+vKPgE+FyhlyPDwTKUhXRooBt0XbbZH5qpGSAdt3Sc2XV0K8assXJAVaN25Gpp1Mh7mQo8dug3lQ5CiMNIMqeuV5RT3qBTwxmczjB0VB5wHZLbCIaQQp0zBy/4r6xGse5541h3MKLMwPoHU0gPRJi1JzKQ1GMI6n6OQWzfQG3j3l9NoMwDa/avx3Ftw66EWuz4YKKYY5zyk649SWMB9kkKVBwSTQW1j1Lwh3TuirTgoAjpjHrKvhC0CdffA3GN2QtInaYcMcx2MFecB5x5uK4aV9wkHLTaMhzAzl8QR+8b5Qxqhzt/RwYKjNzG/KKDxQE/SFVPX81w0a403XX2WIB5mLoTOzujTR7d2kHTASMG6MxQjb0DY6QfBlAyp0R5dj/oAly6gc1fgi1nAbmxfF2fVtFdzVik4MIZkigl/EzDXxBGFADP8pPVWYB45VqGAsQUEB65RZIjro09NgTecsatw3gCC8JvAP9M6+2MuUPHDPjGDn3WfFKDV5D/SB7P3Mc7ydiRbaIE+mee4AWYQ5q84OUok1jZ6BtCi1hJjGobvYehrO2S6bIF06cQphVRedweumAGQ6zHnBzNe2oOOuQ/wwOphOF/LC9+nIYNgfaRWJ+5IV2y/Pc6JC/LzVOe3cY7cj7X9PxA8KRQzhTvXdir2SOOkPVqjSd+0eD3Vp5k8DOUB9w4PrEOEjYot0iIVbbQcdkMWPq7nqE7FQmXiPoVvdS4f6mGhQisPdNIBmeF47pP1vOczhJVxTmGgMbV/gN461wtR+0cv9N8Nc5OW5e71Q5V7IeeTUcifEV+/w4IWD8vNK4NaKxwwGQIzid4IIfRduFmHYV8xzscjLbUDbtph7XQBbqnQoIByP3DzJhRTvpjn7CeXKL6Tg/Y64tlO+FNWUKNxfHK+0yroj3kXA1fHlhhX4pUCM9sI5p7IGGX0iWP5Fupn9lPOK+59xCEVAsShLhoDlxoDnE95eVBcg3/09fUtBqcGzqMoRaJ8+NSpU5KYeFjCQjlREbdhVX5Y+bysT5hldVd/re4Y8HTyl6e6/YiNOqgUqPPmzZUxY8ao+/bQSLlDEOJZRo0aNlRJGLy9vc85AYO5UbKKXKS50VJLysXZVuEiSxefPGjKmfGI73HBdgLDRFql6xrjBBiDoeKETM+xPj5P5pAbErXt1F6mIvC1zevjJB6xB8tfv1FtgoYmi4yVheErwAJPf2rLhkAYKAAYz3Ej4cbKuA3eo2aZn3zeGdfcFKkJZUBxWbARLrZHJs0Sw0OIGeJg6bO5PcsvJf83w0q3BuKFTAbhYtYiwkNGjjgwF25kSxCr0ueDKYoJpOZPpaMFvISVsLNt6xHhfcLGei19ti++NtdfGfgVjOg7gWP/Dfcxc58c0SdaYUr0yWp8ze1Wp2vF9IDWyJiQvq1xSVhJv6RHjg8FSmMOcHyU2ybuM0UwmSEDpxxPs0XRGBPiiDTO83yW4Hyw7u9NVoLKsqEDFQPP31iIdwoudIEknbIu3rOeh6yXcLBevkq3PM4/WhFJt4TJ0I7zYEi6ClnDxr5Z18u+0gpEyzTfN+BSwFn9Z8DKemllYZuE1xn1co5at2e8znbfhzX3pTGL5DYwyN/DAsAB4POcp5yT5vlmvGesK1RaoPsK53zHGBc+Vxn4+S5h55rBds1jy/uWtahAHajJ68r0yYCxunyyH1xjCDtxZKsQn6QxRStYW0iBCq/KG8WSAIPv8h7HjNjlXDHTBOcR13XSCq9dIRgNn75env5uoUqP/9OQHsXPG3inMMM6qLTiOkX6JM1zPSYMLBwb1sexZpyosb6ruYf3jH6VBRvnB2FW9ao5aqmX9M77bN9I+235peT/BqyWtfS0okte4zVFd6zf1vzgmkHl3EDEcy2A8P/Tk31hlauLLKk4/Q0vs6+cs2aaNVpm3zgmrJfXam0F/s34Vv3C/CwPfvaRuOWnsQ4Q7nL7BDrgnLceXwM2/akxcCkwwPmUmZkpp9IzwefGKHomHKV95aygsxVrdCwjQTYkzLF6Un+t7hhwsHNWZxnZEow2bdqkDnplH5iy2wWuc8FBTNkdI+HhtcULrnXnkrLbFm64SXGRrqiojbdo8yVjwkIteH7OGRce3iezYzA8xnN8lu2oDRifWMvVtXkz4DPmYtmsiAdLnfxNNV8Eg/EsNwOjXj6r4Cz60bwplgcbBRD+WRdzn61/M383w0omPKfooFxujvxjMePC/K75mvhgm8QPhVDizFZRGybGjHVyIyxr/CoDvxlGtmXAae4TN/j8s+yTLfgv5j1qYBnQX14hY8HkCdbFTMvGb2XhtHhMihDI50ibZRXinY+CRyqmPVvjaNAEx5l/jPlhyYfbnnnu8R6ZfyndDZv0QdDo0lOZYsBKJs6w8vA9MlhVKWR0OT/YZ6Mftt431hX2lzi0BWdl4Oe7ZY2XuU+8NkpV+2S8d6k+CbsZfltwEJ/p2WfWaT5D3FjTS1m45vOcR/lcczAmXA9UpkH+YKMYeFc0i9/VGODTllsxaYLoJ02Q1o112HrulQUb37FVL+msonlP0IthxXWp/aOK9E2cEB4WW3NZ/YD/VN9oiwUuuc7bOkxb9auCdYt9tNVOcZ9Qf6k+VXLOG7DqT42BS4mBcoUje2h3mKXOuqRkHJIuMbda39bfLyEGDqftkl3Jq8qEgBqbu1q9JeE+DUs9k5BwSL788gswD8zSA02fVcpumhqZspsS9uVc1NaB/4xuKM0aFnnLllK6Z0V7TekfrO4Y9VrdvqhfKwurGSjCTRwoPBT9UNl6LkafKwuLuU//5mszvjg+ZCrNY2vGTVXGz1yvuY6LdW2BVf1fpSYpeIJjLGYa+XJl+1LZ56oEkOnhs+2TqYp/3aV5TGyNrRkh5mfN921dV+VZW++f6z0LLVS9luL9q2hqVKUfVXm26pBVfp6dTd36HY2Bi4GBcoUjnmNjq9Sr1Vb4p0v1wcDSfePKFY4GNH5cmoZ0LwVwWlqaDB8+XLKycAAcBCNH+IcbKbujoqIkIMD/nFN2l2r0kt84rdw0GL/ANKiMkSiLibzkoF4gABhYHo2YoM/v7qxiPpTbSdEme4Ga1NVeJAyQlsMRb/D53Z1UbJhygStTBXCRgLrIzdDKdBVjN+BOxxTzQMm/DAMXGeEXsTmObZd6ofLJkG4qmcy/btmCZENl55N9msig1lFIhsGEP2cskBdxKHRTGgNXLAbKjTliSueAgIArtvNXUscoHP25/m2bXWofeb3c0vzlUr8x6cawYe/J3r17lWDkgKBvWonq1ImVhg0aSCjizdzd3eF2AL+DK7CQaWTPmC5aaSKvwD6W1yUjpoRaxIrcY8qrR/9W/TBQPLYAzXAXqn5QXliIGFthxMTQVVOXKwcDjDdjHBLPBmJ80b+xsP/EAwWjf5ty79843rrPFwYDZxVzlJp6XDHLdjzPRZfLEgN1A9rIoGbPl4KdwsDXX3+tBCNqoZiy2wuZ6SKRmS42JlaCgoPFzc3tihWMiJB/K9NoEAN9yw2ffOOe/rwyMKDHtiguMfffyThfGVRcdi8oDFxuMVpl9+bsftHWorPDm35LY6AyGCjXJEAGOjMjvTL16GeqIQYCPSLlvrbvQ7tU2nty7Nixsnr1KmWep2DEFN1hYWESGxuDT6TXhcVIC8XVcFA1SBoDGgMaAxoDGgMaAxoDGgMXDAOluWarpgqRKSol5aikn8rAIYHJ6uyjAphx/3V+vlZ4uZRfKcQ0RHrt8oqbo7c82P5TpPUsnYZ90aJF8s8/U9XrdJlzhYUoOCQE7nR1VOru83WWUXnw6d80BjQGNAY0BjQGNAY0BjQGNAaqGwYqFI7oj5eH2JSjR5Nk48ZNsmvXLjl58iR8fXUA4KUazC5dupYrHNnXxMGP7YbjQM3QUiBu27ZNfvzxB3WfKbtd3YpSdsNixENeeZbR+U7ZXQoIfUNjQGNAY0BjQGNAY0BjQGNAY6AaYqBSwpGzs7PKYEbmOTs7W5zwnSfKVjovajXs+OUMEpMklFdub/maRPk1LfVIUlKSfP75SCXYMjOdk7OTBPj7S3R0tERGRqr4sishZXepjusbGgMaAxoDGgMaAxoDGgMaAxoDlcBAhcIR62DsCV2tateura6DU4MkNzfvX5nhqxI4veCPMItcWaVfg0ekRVifUj+np59Cyu6PJSMjo0TKbgpG0dFI2Q0hiULw5X6WUamO6xsaAxoDGgMaAxoDGgMaAxoDGgOVxEClhCPWRYuCn58fDgh1kRxYj3hg6L8x/XEl8XpBH/Px8bVZf6vaV0uf+oNL/Zafny+ffvoZXCOPqgQMDg72wjOsaAmMiYmWWrUCxQXjqgWjUqjTNzQGNAY0BjQGNAY0BjQGNAb+RRiotHBExpkCEuNRCmFF0uXSYYBujdYl3KehtIkYYH1bff/uu28RK7azWDDy8vKSiPDw4pTd7u5uOjOdTczpmxoDGgMaAxoDGgMaAxoDGgP/JgxUWjgiUigg8e9KPRT0chl4JlKwLmHe9a1vqe8TJ06QZcuWKcHIzq6mOtTVnLLbE4KuTtltE3X6psaAxoDGgMaAxoDGgMaAxsC/DAPlnnP0L8PFFdfd5cuXy4QJE1S/zCm7Y2JiVPyYJw59tbevknx8xeFId0hjQGNAY0BjQGNAY0BjQGNAY8DAgBaODExcYZ9Muf7tt9+oXtHS5OLqIsFBQSrGKCIiQsUc6ZTdV9ig6+5oDGgMaAxoDGgMaAxoDGgMnBMGtHB0Tuirni8n47DeTz/9VJiIwTplN7PT+fn5qvgxnYCheo6fhkpjQGNAY0BjQGNAY0BjQGPg0mBAC0eXBu8XrNXMzEyVspupuykYOTo5qvOLoqKidMruC4Z1XbHGgMaAxoDGgMaAxoDGgMbAlYABHXByJYxiUR8KCgpk5MjPJDExUSVgsLe3E29vb6TsjoA7XYwEBgaplN3VPaEGcn7ggGH1z+bo1GTmRHuLXJ+TV8BHVbFHwgkH/OUXFEoe/nTRGKhuGCBpY3KWS992NUnfdlKA4xJy88/QMe/xt9z8AvxmUH1166GGR2NAY0BjQGNAY+DyxoAWji7D8aMQxD/rLHM//viDbNu2rVgwYsKFcBzcGxsbIyGhIchUV/1TdtPVr/C0hfGzM10bw8R7h09myk+Ld4ibs4Pc06meuDnZw0pWQzYePCZT1uyTHk1qS7voQMkHc6lL9cQAhkuNGYfaGO/qCen5g4q0zbPh2GfIOFIDnxZKP9MGBfz18SkyefVeiQ31kZtax6gfia/pmw7I6n3Jclu7WIn099AC0hm0VbsrrkccM9I2x1sXjQGNAY0BjYHLBwNaOLp8xqoY0oKCfEk7mSoZGZmSk5snQUi0sHjRIlmEP2zJEJqYsttDwmqHKcGodliYXA4pu+3BMX48Y5Ms3n4Y6eJryH/7x0m7mMASViDeT4Jw9OaENRLg5SKDwDx6QEgiM/LJzI3yx6R1sqJ7A5n05NXF+NIX1QsDFBKycvPleHo2BFsH8XZzuuIPlKYwdDwjW/77x3I5mZEjtbzd5IOb24orBHsz80zL53oI+e/huW5tY5VwRNrOhoX06d+Wyb5thyUHVqNhN7aW9Jz86jWwGhqFAdL3icwcSc/OEx93J3F1dLji6VsPvcaAxoDGwJWEAS0cXcajmZeXKzt37JC/x/4lhxISxKEoLbeLq6sEhwSrQ17DcdgrD32t7im7KfQkn8qRL+ZukcTDqVCpn5YQXzfpVCe4hHDE4SKz6Aym0sXRXmlnjSHs2yRc4g+fkP5xkbiv1bUGXqrbpxNcIv/ZcFgeGjVb7uzZWEbc3kEycvKqG5jnFR66xC3cmSR/Lt4JcwIsmvh+c+to6dUoTHLgJmcu9jXhMgqh0dnhzHlmdCO9FcLSAndn6VYvqIS7nfldfX3pMeCKden18avlmxkb5IuHr5JBraKUcHvpIdMQaAxoDGgMaAxUBgNaOKoMlqrhM4wbcnR0VJnnQkJClGbyZFqaFMLdztfXV1mMLqeU3Y7QmC/dnSSJyWnSqE6QHDx2SuZuPaysRL6wLBSY1es2xoMxRnQ3uqVtjND1jpp2c6FGnn8UmejaRIbUCQwqtbyMWzJcu3iPgpp1XAeZUzKtjAExu+tRUONvrIeF/7Nu65gQo33CybbYjnL6K4KF3aNLFfFQDKMpnkpVXsZ/Rt2sl7DnF5yWPMBQkXhI2J3AgFvjg30gnLbitvibA2CnlU/Vr+C39MkM3hl8ARd40OhXHujTEcwjcXjyVLbkoB07fHfEfXN8jblPjLPJQyUck8u1sL//bDggNUErrWJDZOXWBJm0Pl56Nw6rsEtwzFJ09frAlpJ/XQsBtUk2cGGhOAvNGfFIHBPGKpEGjLE1zwUKXKRV3uO4G8W4b54L/I24J63ySbbHV0jfxnzhMyzmeUO6MuZaIaxchvBn0ASfJz7M4817tgrbNPrGNglPDucg6KaiwvnKNvlsPuAgPlhYp605yt+M+cxPFq47pDsTqtR9M774KPvLNohTO7STDmGfFkIWRe9FMPC7dZ/YVi5/r0Sf+L4uGgMaAxoDGgMXFgNaOLqw+L1gtZPBcXFxkUC41PG8osDAWnLs2HHJzc21JGGIjBB/fz9xcnIqZtwvGDDnoWIyPlPALILDkP/Bne7bhTtkwYZ4WbXvKCxBEVJgJexYN0kGYx1iNdbHH5MGod7SOjJAMSt8jgzSWtxfvDNRUsGQt4iuJT0bhoBZPShp2bnSFzFKPq4W167ZWw/JoeMZ0hECWlSAJa6DzM8iaP33HE2T1lEBUj/YWwk/ZL5O5eTKxPUJsvXgccUwhiMW5CpYA8J83IqFCwXbAQtscRH+EgR3wD9X7pHUtGxpFO4n/ZuFizssBZsTjss/Gw9INtylmkfVkt6NQjF2FobUur/8TiaLAtUGuGHNhyvisbQs8YJloRXaIPxs15qJNerhbynAxZxtCeLp4ijd6wMfGw/KeuDbx8NFOtcNlhYRfooRNb/D6/nbE4DrY8ptqG6wFywZIRKIPhnMLuFasD1R9qWckg6AI8TLVeYArxSqWoT7y8R18fLLElhQAPuupBPyw7ytEgYrYfvYQBhVwFzi/jrgaz7qSD2VJd7oE8ezfZ1A9LnsPhlwVrdPCqyJJ7JkxuaDEgL6GHpdSxm0P1lmbzkkKXAt9HR2LHOcjL5QOJkFgYq02Q54iimiTY4jy2z8tgp15mOeXAWBq06gl0xfeRAuXfbSB98dMAfyMLf+AO4p9PZpHKrGnUw/BfkJa/djLuRJzwYhEoDxJ91w3iSkZsrMzYdk/9GTismvG+QNaxfehSsrhQGjzML4HsazXeoFyynMqUlopwDtkA67oU5CScvZIrgF1sD4dgO9tcM8NCsajLqMT/aNwsYc9G0F6DIL8NXydpUuoM3GYb7lChMUorYlpsqqvclSDzTKOTtmyX45kJIm4QGeclXDMAn3cyumWbZJAecU2pgKqybnIudWE7TTDX1ydrAI9HyOQszfEHQz4Rp6ddPacBEtkOV7jkgscO7j5igzYB1cgPkocKebvyNRKV9aYE7WCfRUChHS+CyMPde2LMz1QLhYdq0fLA1DfMrtE9vWRWNAY0BjQGPgwmNAC0cXHscXrAW6yjGWyMXZWXxgLQpDGu+8vHwITc7igfvOuG9YNC4YEOehYjIyZKzIQNeq5QlGPVQSwAQuQFA6maxrIBxVVMjYTASD996vS+XeAc3hjhck+WA8yBT+vGyX/PeXpXICdUJiIBckj/ZpAmHsgMQnnpBlbw4SfzDgVNx+OG2jzF+7T0b/31VSN8gL95D4AinRR8/bJn/P3yrv3NdFmob5Sa4UyF4wWv/3w0JZtOmQpV4CiUoiEEj/7eDu0gFMLBlRwjZu9T756M8VMrB7Q0k6kSHLwRypBsF0PdinqQxsESm3fzFLTpzIJPel3Kpevr6VvDigRbGQZQsHn83eLK//vUoyEc9CVy08LDXBED94VWN576a2sCTZFq7s7WrIbgh7g7+ZJ3XAOHYBs/rtnK1oG3EsgNnHz0M+vKODssaRqSajmgF8vjhupXw3l88BRuISzzZGXNjnd3eWNmB2qWUnzX0+Z4tMXrZTngcMK/cclbmr9kqn5pEy8q5O8uB3CyQLghk4TlkAxnsBfhvUrQEYxBAVizQc7khvjV8j2YjbMPpkB+Hx/zBmbyPWhoz2GbbcFlaq1z0nO7rUJcrx5FPSG/Fw3cAINwazvAbCwnLgpn/T8GLrii3IlUCIHg+fvlFmY058/nBPqV9EmxQeXp+4RoZP2yCFtFSABj6esVEe6tFQPgdtUNDp+uoNykXvFMbm0Z8WSXpWrqx89UYw8qR5WEZgtXvurxUSD0F1xv+ulWAIs4Wnayjh9LEfF8puCP6cM4pegfi2EI5+erCHhEBQoRDFOj5C+/MhXD+EMRq/Zr8chTBFRYc9Ym4+vqMj5OCa8viYRVIAGoLUJB9DIBj9QFcZ1DLaZt9JQ3S1fA5zZsyC7eodCtMgMPEAfMNu6yD3dqpb5tygJWvapoMy9MdFcm3nelBi5Mu8dfstfQAF1YeS49sh3aQ5hHU1RwEf58N/flosC6GgUFqJosG4pk20fHJ7R+CFQqNIFubYM78vk2QoI96/pZ2MmLlJ4vcelZfv7ChNoex4DHNKwYq15+tZm+RrtD18SHclaB3BO8/i3V8X7bC4Vxb1yRPKlI/gXnpH+zpl9skWbeh7GgMaAxoDGgPnHwNaODr/OL2oNTJjHf/oYkdBqRDuKnS5473LQTAisig8LNmVJEeOpMmNYGRCfFylM7S1Tp4uMheWjcMQGAI8LIxcechVWnTURbc6Flp29sJN7/k/VsgJMOPXd6kPt7toycjOl5+W7pLDx9IV02d52lIzBTUyNoZG3nLX4l5kvk9mbw0yhy2BJvw2MPaDu9ZXWu7hszbLVFhFXhu/SiY+0Q/ad0vtqj4wmOzP/V3qyfP9myuG+TMwst/M2yILdxyW/4NAQwGDQtu3iL36FHUxzoQWLLOWnjCxixRW/lixGwkNHGXEvZ2lMTTPK8CkvTJ2pYwCU9azYagMiCPjbdsFiXU4AqYDR0/JDu+T8t1D3VUc128r9sik5bvkf2BMKeDV9nVXuBw5Z7N89896iYPW/flr4sQf7o5/Q+j7Ekz7I2BCZ/63v3i7OioXJLrdIdBNfly0E3XayQAwfa1RF8dx9L1d5HfA/Q/a6QzB9y78VtvPXWnNqbn/ffkeCcDYv3F/V6XxX7L7iLz290r5DO1chT7RFc2wUhnjU50/6Uo4lVZRILxf0whxh1B4NQSiNcg+Nxn3aTmsTLGmTQoAtDR+NGWdsuo8NLCVdIeVhjT/HZjvfAgS9lgHzIV0S4sIRqdEMeoumjrKLDkDwsV+zh8kjrgG8B5Jy5Q3kAhlBawmw0G3wyGgULBi4VxjoZXpKQj7tNb8smy3/L10pwz9a6VEQwAfDuEhGELRVwu2ySwIeR/+s0H6wWrL+Q8Zq0ThHN4Py+N4ZJ9si7XgRdCbLxQYf0OQHjFtvbwEGqeQGQ66sXZhNSqyzDl7uOcmyAAI5n881U/SsvIguG+W9bDsvDR2lYx/vDdgh9sm1s1nkPBiIQSoG7tiPmOtoIXoUwiYUzCfvWBZHn1PZ6NqBXMNSEofoA9Bns7SvHN9aRzqJ3EQtkZCMTIS8287LLr3I6auLQSxVpjXdHfk2EyE8qUDBMznr45T84VW5JGg7RfRJyoIKHSW1adiAPSFxoDGgMaAxsAFw4AWji4Yai9uxRSIqvv5RWVhhH79ZBJpD7gWzDLdTujO0gTa9dVgYlbsPQLLShQYBgsjVlY91vdpHZkKRu4YtNjtUe93D3SD+5ol7XdrMCvd35kox+DWdDaFFhJae0JeuFZaRvqLl4sTBNIacC9zlUVgxjYlpMrR9CwJh7tYcYGQ0gPMz0e3tAfjdVp6gclfBnecZYCR7mdvD2oLy1+BchuisLTzwDHZkXRSuevkW/WdzCSz9P04pAc02fnSCm5nZKjaoZ4tcAn6esp6WQ5BiTBCRV0MgvUF63F1cZCvwPjVK3IX7NO4tvSBQLoK1i1a7p7t2wwucmkyev42cfZ0lS+VlQgad/SnQ2yQcjecCaZ1HBjZh2EZY9yKKoCLuPkGFgJ3HEbM8aWl4S5o/HcdOSn/wP2oPqxsQyAUZsFKRA2+N5jQX2AZ4TVdkVSfIFRtAi5+RDZCCn+0tOSW0yfrPl7K7xQ6DqVmKLe3gFoe0hXJFPKBNwp578GqMwc4TqbrIOinLBdIW/DTmpQLmvgDjDWkX7kPOPwElge6qVHgpVvnbSNn4amSUgeFImvBiPWb7/MNMvLPXd1M+gLX3SGEUNHigLnD2K9bIawy3TjdyijYFNvxMGZMrf/8Nc3RxwKJq+0PweSQpIKWHuxWXx7u0RgxkYXK5a8t5vVO0Pbx9BwITBAGSIimwn5wDZj8ZF+hq2oEhCB2hW6Z86Bg2AB3ue2w+kbDRa7cdQH1NK3tJ6NA3y6w0nI8WkcHSI93J8kizLH1oCu6kE6DkDkbf/VpBYV10wdCPvvcCDB0PHRc/lq+W/4P1riWoEkW4isP/R8MS+AzEAYpHNKKRxnxASg/xkP42w4cXQUh6DYI/xmw1tHiFAfL0pSnr1YKDyodWJoBPgpwdM3dgT6F4365fVJv6f80BjQGNAY0Bi4UBizqvgtVu65XY6ACDJBZOQgLznwwPL7+ntIMzMcJMBJkFMlAghuTSWvji/mvCqor8TMZ691gwFg6xAQpYYIMXQb+AmGZ8ECsjfKTKfFW5b9QA98DmnoGt2+ClnhxUVwSXfloAaGQQCa2uOAyGFYxqsmzITjwl1gwdywRYIiYRIGCDt+PAENI2I6CcS7W5qsnz/zH/jGWgn+7IWysgiVrGWAoAAPLchx4tLaAnXnbckU814I1xxPMIHHDFNs8N6o7tPXEPYWzmujnXriEHUMK9Ugw+BH+7pKZU6AsUsRB+9ha6lnGCWE4zxQA3gPMYYA73JHApBJeNCe5qNcIPue9QrRJYYiFTDljLxgzQwFK9WnXEYvggHePoU+Xi0WU/WEyAcadnExJV/E3FGiPw/0tCuNeJ8RXDsKVawn6x/ieKhXgmfRFAQMvq7geChSkRcaxhPm4q8QAxPfZFL7nA8sgBaNECDcbMLZLEQN25GSWsrYyPoljaNAmk0bQskplQC5omIIALWTBXlAOwHpFeLIxzqQxWgVdMfcoQKVAOCprPCkwdYLg4gGXym3IYLlsT5KK02HsGghKTsIKZLRfZh9RB8+EoqKEc45zn98bQugpwPsU+plAYT36dxp9Ykwhx4h45PP+cAtsEuoruRDetyETpmEhA9mKPeZJH8QXOgMe0jfnEumZ7xqCLi2cFKJ4n4UfFMbcMGbboEBZCkFzzf4URSd4SFm2KuxTmZ3VP2gMaAxoDGgMnA8MaMvR+cCiruOsMUDN82K41CUj5sgOzEb/j6cphocMUwaYFaY0phUlAdp3Bv1XpZBBOYKkB6yQDL/BsLAOXlvYlarUeOZZBtmTyf0Abma/Qqucg6BsMjVkfjIRK2EPLbWtgmaL22X7hvBSxDtZXsEPys0J36iNLquQUWMg/UeAYRO0zjXBALIoNzowfGY5paw6eJ8tWLfDBBEsJxjLBBiOAo+FYPqYPt2Amb+zDZ7jwpIMxpltEw8Kav6ICyUUqScq/o9uX2Ohdf8I7krbDqNPNekWxoxnEJ6q0KeKW7o4TzAr2lS4ScLXEwkYEiTulb+LcM2EGBA00C9aTQc2j6gSQEQthRMKzxRKmHjBTENmWq9SxUUPU+jdBivGO5PWwqpysFjoVe6daKi0Y57lxZLtWrLLcfzM90lryu0Sr1jTnQEr5z8FtuEApAAAQABJREFUZcZPjYIbHIUyzjnSFQV4xlYRB5UpbOPMNLJk/uP5Wox9SknPVURMAZDCiToewKgUjREOuoVSUZCEeCHCUFzwG63clV1LVJ/QxgdwCxyNuL0U1FfD6BME2qr0qRgGfaExoDGgMaAxcN4xYJuDO+/N6Ao1BmxjgIwzXbeoCWa8imI0yAGBDXIGU+IALe4hWC2oYb0JgdFkRipbyMQzexQ5IzKpVnxNucyVdStkbIoLLhkTMXTcKvkRsQK9kD58MOIU/GGBoZvQwz8skBOIa7qQhamxmZ3snlFzVAzJi0jzTDc0MsnfLdwuP4KprGxh18zd43s5TMyA4k7rGhDHsakBhpQWnjOMJkcJfCNwyysvWBpoAcmGoHg2hVYWpnO/b/RcxZAOvb61cjlyhaA5GskwfkX8x+VUKOAegFV0AYT7GmDGaUkxLGRk85klMBsKgPmIW6MQ7wsrRVUKBUlmWUw4faooEcaZt0vQ65nb6opjZqZvUraJupXwexIWuge+XSDrYPV6oHdjFbPjDXhp5XjmlyUl3req/rx85VlYo+Ztl+eQ8KQerDmfIF5JWVMB+AtjV6hkFpVtyBYuaL2ENkG8MCbsjA/mLuncGB+jbuJJxbfB+sUjBaqw/BhVFH+yT58iM+MLPy6WhrC2jri7k4rno/D2HA79paugLhoDGgMaAxoDlx4DWji69GPwr4WAzCODrpeAAXMG8z32P72lgSmdLd3LGHj9zdT1EKD2y6DWUSWYODJ0tDyZLRlmZLL+aLjqkaNhumsKYhQqGJtFrT3dX8xSAR5XsQbUINNSRWadmnLWc5yxSUUcJD/IPNISwIxrzArXQsX8FKr4EsJDhoewWQsdZvjO5ZrprumOlXk8XW7t3UReRHroXFisHCFQMn6CEgy13CU03TYaJOOYlkkXKZwDgzrzcXgu8bQK8RJQ7ysXpNP4LRKudJ4QNOPhHnYc1iQ/N091Ngvtb4yvoutUA7j3VbYYzDlxxbN/7PJqKDzTNTEbuL8F8S7/G9BCciA8OEHgm7Bun+oTx6KiPlUWhgv9HGltHmJrTkJA6twsQn55pIfQ3sG+ky5Owa2r9wdTkBAjDdbRRLkZwj+LGTekIVsKAT7j5FBTxa5sRia8NUitPqh1jHKp5Bk8TKddqIRWVaWqk8IUhdwToP1EuEg2hzBNYSAd401YDCGCON6JzHXrIXyHhnjLh7e2V6nm7TEf6C5H2uIhy4TtQhTOL8I1G8kdqDR5HPQ9uGcjyaUlGYUKAMJAy2lZc189yP+AaMYVKjqD9Y4WqwRYiXYcOcHDmSCcuKmz4ZjMhN+3gJZ55hDHju+mYZ7vRsxiDRd7qYNMmrRmVaYYY0gYiSdaPilkMcaMsD+FOL77EZ+XCyUK66TFqtJ9qgwA+hmNAY0BjQGNgbPGwIXZ3c4aHP3ivwkDZEDIFKYgg1MLnOvTHOfqeIBB8YKGmn++0IozjbcdruladxCpuCnYkHljoXCzGgycwfxY445MPpMeuCDeYSaSHryKTFvbwfStjU+WlyaslqN0pSmqi++SeWyI+AJykj8jmx0zgTFbF1P1LoNFA40XN0GGxwVMKAWvBewDki/w3KAfFu+SY0WHPzLYO7PI3a74xfN4QVdBAK3ijbZC+EuHa85yCEyT4AYFjkwSIWTwbKbyhAlawI6AUR46bjXwkqLww9TQs4EvFySXuAaZ1Bh7wRiZQW1i5BSE2ZeROpwuV+zvV0hxPhFZ5wLBRN/YOhrxJhUzj2TCjRibo8iAtgJulUxaQFgU4ws8M9ZpOwLhGSOyBMz/VDLKsCAxxTszfpXXp/OI4rOuihTKg1rV2V1ghns3CZNQ4JPWIkXfONsoElkI++GcHEgcMgVnetFqyveUyxku6LbJs3DMB74aAFH4Zra6a5GFjTTwNdy0RsEqQdzwDJ23kZDjNJhxQ+Dhe8QthQDG1nwIyyLnDmN53py0Ro6CBsyCBs/1oXIiFZbQpaApCgn7UPcvyGJI5UFGdoFsPGRROBgwnc9PwuJC+sZcJJyHQXeMc2L2uk1IOMK5uBMCDt0KzXCXgoFrDOjng+kbLDFsqOup35bKYdAvzxhrgYQhWYif69EgVOKQjGElYh+ZgY4ZMg/gIOo3Jq6WXbCW9USSklawYFlblkq1hxuER8UmAXbCuAwJZYg/rluGEMRxTYTQzHPWmMhkC+KZuBZtT0pVCTrK7ZOtRvU9jQGNAY0BjYHzhgHsPrpoDFwaDJDp+w0pnaFWlZ4I3HdD7AoDto1C4acNhKZQaGwPIEvZLDDIDyJtNhMCUIhZC4Hphg//kR9wJhGzZCn3FzBQdKEjk0lGphkYoCf6NpX3wOS8B9eV95H2mMzdNbBChYM53Q/hwSjU4FJ7//PSHbIHzEv/96fAIFJTYsFQMmvVClivWCe1whRM7kHa8aG/L5enkcZ6GOJ+CsCMtsVBpQ9Dy/3F5HVyx8iZsubtm5VrmDVsRpuEFdJHKaZLWbVw30hcYDxvfNKVrReCwWOQdW81Ml01f2UsDpd1Vfh7pl9TGQ5mdyqyy3nBneunB3tAcLJo3Y33jU8G8cfizJwkPN/h9fGKQVPn5cAi9ky/OGkEPLPPZPaYengXhJbxi3fIBMQF0bKWA618AJJJfHBLW4lCoDuTBJCxM+C3xUzSEtImOlBckKVsEtI9T0LWuucGtVEWuD5I7TwSDOtypJGOe+UvJItwVeP5NPr0PmCcgPOTvAHbt/d3K7NPRt8u5ScFbWZTmw4hExyx9IFwlA36MMfeMFKrT+NwGY2ztZjqmy54kThfqmltX/FGdrblyPTWc9hRWfvGIJWVzcCpQRO0RgyEcDSxXR2ZgjOlHhkNF0u0BfTLda1ixAVuYEZkHWQpZQ0ZAmsFLZ4LkYK9HejGDvc7Y+7VAu0cgfBDhQL/eMbXtcgQORYumv0/nCq1MVeYKOWejnWld8somYk4u7u+micrX7leMfwKNtCYAZuBexUfhPus0yi84jynpdOMD/PvFOpuR78m48yk76GcmAB4KVjQ8vUMrC5MD/4GzgtiHOIQuLSqdowKzJ+gXSZA+B0C/BsQ6lVWPPTDBzT7KlxRmSWQc5BCK88sehhncL39xzJ5f+o6GHJOSz4E1EbIlsjztZh4gZZkA/58G/ATz05QTHRCQpPZEHjfQDr8N+B+OwFZ94jP25G57h+M9Vc4F+ovwEQhNACpwJ/FGvUqrOSvQHBj9j6uZ2X2ydw/fa0xoDGgMaAxcN4xYPfqq6++Zl0rN6bc3FxJTz+Fw0Qt6Uatn9HfNQbOBQNk4Jjx7CiCkuOQDvpuMAMeSClN5sIovGQwtB/ON4mEgBQJho2uW044P6drvRDxB4ND4acbMsYx+xwFkFpIYdwVQoORlpqsTFcwKvWQGcwDMR08Q+T2znUVo//Tkl3QjGcjHW9DlYKbjA8Pg+0OLXJNCD/+SLXcBXUPA9PEDFe14aLXDYwkU/CSCWwLwSQaMDmTaQNz1QsM8Bs3tMb5KyHiA2azMQQqnjvjCgGFQkIg3usG2OrgHcUsAgfMLFcbmdm64uwguq4pZhHIUUILhLJuyNjHs2GsmUjymoyB4FlGhNUblogoMNRMo3wvcNkA/SUuOqLvDZEu28ycEr/UYtMS9zPOoSF+x0CAYsyUCxjAdoD5WZzDNARnNxnt8pNnvVyH1OBBYJT9cB2G9vq3ipK3b26HzIJhZ1J4A362F4WxIvxhdF0yDaz6DXXw3KNg1EGNfBfgnP03+lQDgjL7FB3gLi8MaCF3daiLrHw+EgQcdkQGtQa4tu6TQTfV4ZP4pWumGxjlayFM8Gwm0ry5MKlgLdCtPeijcZiPohdvjCkPbu2IOVELfW0N5QDpiWmoSZ8U1EmDiibwnRa4/rA+UUD1Bn0ztTXHjve+x1lHHsAhz+Aiw65oCrTGNPbM0BYKuhoIa9/riO2isM/U+ZxLtGwx4QIzDfogdTtjpQJAI3d2rCf/6x+n6N4dcPNMrvYYQ/aVioU6EKQ53kxnz+Hm3ONnI1VvKMbWWQkWyhyE+60gILNvrN9EHgpFHFsKaKQRO8x3ZpZshjTeb0GIvg7JK2pjPkZz3uB9ChNm+mIFtOzyfKy5EFA6gLZG4CBaLA9SC/3oAWv0Gze1kV4NQLNUTqCwvRjgrh8spV6An1ZrZk28BQqQ93DOUyzaorudZRABPEpzjA3b97RatwgLaZrZCCNreUk7WKT4nBcEO2ZhbBUToPpEgYzuuG/d2AbnkUVIKOZCDPrMNYeKDus+qUb1fxoDGgMaAxoD5w0DlHfy8vIg8+SJry88h4pKjQIj769xB598+NSpU5KYeFhCgoOwcVk2A9Mj+lJj4JwxQF6R2mC6SFFLWhazyxgKZs/iuTqGixEZMjJ8ykoB1zUe4siAZ1ozzM8ZQLIOkjEZHF6nQiPc5vVxEo900ctfv1GdhWJYOdgWXZvIODkilobaZranYgdgGTGeI/yEgXCT8aSbk7IQ4T7bIGzUkPP9smDjO3RfYoC4Yr6KADb6TI28tTbe6BM/adFhmmLCymu2qeA2cIH+sg4rvlwx1YxZ6oOYl2gInvNxXhMZ9Szgku6OqMZi/TE3hmvWT9jIqLPP1KYTbmsYDfhpSTLwZVWVgsEB+GVbPDfKwJ0Z/+yTUtZwLNAWhQFb42tdd3X4Thqi4ExLGenb1irKvrlCAcCU70zjbswB0hr7y0Ia4hps4NSaJlgHfyOe+Rzd55Ygdqv7sMlQBrjJsqEDlWXEYLaJQ3VOErK1kf74Hj85tmYY+F3hW9XLjOGMnbFYBmnxYFuGpbcs2AiLdb2kRVcIY9hpFF4MuNhX62LAynYJI+cSaa2s9oz32e77/8/eeQBWUWx9/JCekAQChJLQQ+8dRKQ3sSC2Z29PfaifvcvTZ0Xx2Xt59t5REKk2QKQj0jspBAgppPd8///cbNhbEhJCKDdnIPfe3Z3629ndOXvOnIF2ZsqHC+VivPx4Dwuzstw8tJl1Zx6e+qW5r6Acy+sirwWWbZ0X5s98zH0LfNh+T/XHIVNf9l8GO1e2ibmwz1v3j6LSNlFT7Xp+TQb6oQSUgBJQAkedAJ+f2dnZkpGZLTExMea5xkLUrO6oo9YMK0uAg0VrcFVRGg4WMJIxUTgwYeBgJZvub0sD93NwbQ2wrXjWcZMHNjho4W8OaDwNVhmfAyeMW0xcDowc+zCwKq2D2YEPpmdepqzSfK1j9nbxeHl1Y/5WGVZaftvbbN/v+psCCt+Is12st9Wm8spzTc/4/CMPByOHZz/XeNY241ltY7us39Zx67sy9bfX0UrHbzt/5zZRgHLuB/Z0J9pvCpCZMI2sKFDAyLL1YysuB+6ug/fymDIPCl88HwyMZ51Xqz84jjg+y64RJHCcc8/n0eoT9nyZAwWULJiU2UN5dfPUP1gnT22252f9ttfVfp2UV56VzvWb14lxbIHGVGSuZu4rNpbZOA+ugfX31C57PCAqZevor/ZjTm2y3VOMswvbtj2N/lYCSkAJKIFjR0CFo2PHWks6AQhw0EJBgoGDSnw4Njx8VnDIKbbJofxsnOLW1EZl6+paPhkYDqUHqpJPTTe5KnVxbVdt3HY9H0e1fx9noEfSFxzXpcO0z6p+ZfNxZWmlP5rfla3L0SxT81ICSkAJKIHDE1Dh6PCMNIbXEeBcDV8zl4hv9qMwN8duNuN1zfXQILrubot5P29fMxzzUvzNnBYdrHkAdRLuYl9uBccOb109zMwl4nph5etJT8IGVqLK1DCOwzyvhjeOwXyhcGhGHRrSSiTVKEpACSgBJVDLCeico1reAWpz8zmHgVokzi+wa09qCxNrTgmFIrvJUm1pvze3U8+twyU6569RWHQ1UfTmc69tUwJKQAkogcoR0DlHleOksWoRgdouEFhzSmrRKa81TdVzi7lrEIoKi93n/NSaTqANVQJKQAkogSMicGhVyyNKromUgBJQAkpACSgBJaAElIASUALeQUCFI+84j9oKJaAElIASUAJKQAkoASWgBKpJQIWjagLU5EpACSgBJaAElIASUAJKQAl4BwEVjrzjPGorlIASUAJKQAkoASWgBJSAEqgmARWOqglQkysBJaAElIASUAJKQAkoASXgHQRUOPKO86itUAJKQAkoASWgBJSAElACSqCaBFQ4qiZATa4ElIASUAJKQAkoASWgBJSAdxBQ4cg7zqO2QgkoASWgBJSAElACSkAJKIFqElDhqJoANbkSUAJKQAkoASWgBJSAElAC3kFAhSPvOI/aCiWgBJSAElACSkAJKAEloASqSUCFo2oC1ORKQAkoASWgBJSAElACSkAJeAcBFY684zxqK5SAElACSkAJKAEloASUgBKoJgEVjqoJUJMrASWgBI4mgTp16oivTx3xwbc9WPud99pj6G8loASUgBJQAkqgugRUOKouQU2vBJSAEqgkgUA/Xwn095UAP8+3XspDmbn5smN/uuxLzy7LlQJRdn6B7E7OlGIpKduvP5SAElACSkAJKIGjS8DzE/rolqG5KQEloARqNQEKN0XFJfLj2lj5ctl2mbc+QUpKIOS4qIGC/P3kp7XxcsqUr+Suz5YYZtQYMe0/3/1N+mP/J39uk+AA31rN80RvvJ+vjxGCXbV/J3q9tX5KQAkoASUg4qcQlIASUAJKoGYJ+GOwvDo2SS59fb7k5hZIWGiQLHpgorRrWk8Ki4qdCi8oLpYsaI9y8ovMfiNYQY46kJ4r2Tl5kpqdD5nKRapyykE3jicBagc/X7pNfv07Vq4a2VUGtGksBS7n+HjWT8tWAkpACSiBigmo5qhiPnpUCSgBJVBtAj6YQzR3Xbzk5uRLWN0gyUjPkR8xeA6A0OQajNgDbZE15agEZnSBMMN779rhMuO+s+W60zpKTkGhUzLG5Twl/lnpqLVw1Vx42seMqJ1yjWsVwP1W3uXFYZk8xrrzz4rP/Vbgb0/7rePlfVvp/ErnYdmyLC+J2c94pk6lCax2lNcGKzNrbpedpXXM+mYe9nz4m/VkoNnkH1v2yvuz/5YdSRnmHLvW2WoTyzBpHUn1UwkoASWgBE4AAu5P5hOgUloFJaAElIC3EOBgOwPaou9X75K60BjdNaGn1MGgePbaOMwjKiwbVFfU3mKY4DWpFyKD2zcVf2gmaJFnBWqlaHaXkJotsZiTZKz1MBrPzCuQLMxTsocs7ON+5mcPrIfrfg7aKbylo+47MQcqPiVLsiGUUTPiOtjPhZaLbWS+bG98apbsPpABrViJ+Pn44K8OjonEpWSaY/zNfYcLnJvFtu1Jy5Zt+9KhNcsTCprM83CB2hrWPa+gWMgoDYLpzqR0OQitHM3e7MIN82JtWF5eYZGpI8vMR/09zQ8jV/Ji4HEKq/mFxab9+yD47sUfbB+NxohcqA20AuMXsk1gtB1cq9ImKw/9VgJKQAkogZojoGZ1NcdWc1YCSkAJmIH5sh37ZUPsATm1U5RccWoHefOXDbJ02z7Zuu+gdI6KcDOts2OjPoZOGO7EHKRf18fLE/8YJOf1bWMG8Rz0L9+ZJFO+Xiardh+QfAg5Y3q0kMkjusj9Xy2ThhDGvrxxtIQF+xvh5cwXZsNkr0C+wL6YxuFGYMnFwP6SNxZAsMqQd/85XPq2jpRiDN6zkNfzs9fKx4u3mIG8Lwb17ZHmWuR9/bDOqKJDwGLcO79YIos27ZUHz+kjCzbskS8wL4rCT/+2jeXly081DG74YJH8sXWvBPj7yPDO0fLcxadIi4i6RlCwt9f6zbbNx9ysaTNXy5/gVwRhp17dQBnTtbn855y+0iYyvFxuQdDevPPnVpn23Uq5ALxbR4bJ49+tkAMZOdIsIlQuGdxe7oGQGuDr6xDoWCiEuncXbZE3562TDXvTjBDWPaqB3HZ6D5nUpw2EtGIj+GWC3z9em2/yev2q02TWX7Eya8VOuX5Md4lpEi5X/+8XSToI4SjAz5yDx79dIY9cMEAuG9QOQlKJzPk7Xp5Gm5btSjJtqo9zNK5bc3kIbWrVIAw8DglSFgv9VgJKQAkogWNHQIWjY8daS1ICSqAWEqCCZM66OCmG5mIkBvatG4XJKHx/NHetzMTAumeLhuUO8u244qF12ZWQImnQnmAcb7QnNNu6GPOY9iSmSXSzCOnXNdpoI+79aqls3ZMqTeuHlg3+qdXZgkF/FupBLQc1PFQzYbwu26FR2Y1jnOdkdDKo9NQZq+Slb5dLTLsmct3ILrL3YLbMWLVL7vxwkYQG+suVEDryi4qMiBQPjdXOvany9E9/mXpN6NVSFkEQWggHFDd8AM0NtE0ZqPc4CG6/bdojs5ZskXohAfK/q4ahHjAcdMhZZc2lZmhtXLJc+Oo81KlQJvVrYwS9+RAOv/p1g9EkfXvzWAmBAOKqBWMm1AolZ+aZNk1fuVPyIFj1btVIMpHXwk2JMu2bZabMRyb1A4siow2bhro/9PkSCQsLlvP6tzXnZAa0fVdBEMqC0Hj1ELS3VDtEjc+BjGx58JvlshB18kP9M8A1GEJZm0bhkltQJOlZedIAbWwIDRLrSW3V0p37IFjNM/mcizZFQNibi77x+c/rjbbp65vGQKaiZtAFSBkZ/aEElIASUAI1TUCFo5omrPkrASVQawlQADmIQfMPa3aLX2iwTIBwwME8NQUfYUA85+84uXVMNzMX53DjYc5PQcTSOSqYqwIp5uM/oNVJSJUB3ZvLx9ePkqiIEGPK9fgPq+TZXQfMgNwO35i4IQ/k5BSo5anD/ZSXcISD8zN6tjR1f2hiX2kODQ/DEzNWy6Of/SHfrtghF0MT4phlVIJqoTIwX+sW3UDevPI0CQn0k5+hQZr04mxZsjFBbhjfU566YKAZ+H+9fLtcCU3VXLQ9JStX6ocEokxnYaAI5beCEHnN0E4yIKaxXAhhhWVsghA49r8zZfHmRFkHQXFwu6ZGuDGVc/kwZnNoE4WrryFIdW/e0LD/cPFmufWDhfK/3zfKlRB4YqCB2gTB8IXZf0kotDjf3TZOTkW+JDELpo8XvTzXCIpjIHg2g2kjg79vHcnPgRkhfn97xwSJrl8XZo/B0iA0UGbecbpcgDS/QjC8/6w+ctGAtuacZOUVoixHm4Z0aCbnQvvHc7ouPkXGoU2/b9wjGyDQ9msTKQWFzjxMofqhBJSAElACx4TA4Q23j0k1tBAloASUgPcR4JydlTB32xKHgXyHptK7ZUMj3NA0LKpJfVkOc7HNGPBXZg6NEx0IMTnQTvwB0zwKTFcN6egwk4MaKBhaiom9W4svBJQj1UBwng8H8G9fPQyaEJp6YS4R/g2EoAKPA5KI+Ti5EDooTDEY4QYCw1gIffWgKeFcI5rURTcMg4rLF8JgC6GbcpqmDe8UbeZeZUG4SMrIdWiwHNmUfbLedVHOMxcNkstPaW+YUcPDunRoWh+CWKEkYA4U5cUKAzRGp2KeVi9wL0HZjH/xoPbSpWUjScGcHwpYgeC1cEuipED7NbxLtJyCehdAI8Y2jMJ2H2zH4hytgrBJUz8GCrI+0BI9dHYfOadva+nWooHRbPEYBSeLC4VOzjGikEyhOCwowJgTXjIwxtSFmqi2EM7aoS8UgyfnIflaiZmZBiWgBJSAEjjmBFRzdMyRa4FKQAnUGgIYjM+B9qGEzhEgzDwxY43RIrD9ARhcF8It9w8wreM8n6q4e6ZMUABhIS41Exn5SrP6ITBxcywPyzlAPG7M5ljQEQSOzynIzIPJ2I+o314M2um0IQWmcRSFUIR7QCLIBUKtj+NwCczvHI8YCiUUDihUMG/OCcrD3B0KeOXJAhQsdh/IlC/gFnsjhJgDWfnGOQM1LRQIPdbBvVZm7hOFPdaJQhfzpQbob5RNIY+VppkcpCGzn9xKTObQiOF3k/BggXpKdkF4Mto75oM/H9QhJMAfQiIFKcc8IbaFbbSCo0xri9WuA6cQGWjTdtmENiXj/LNuG6ExMm3S6UaHYOkvJaAElMBxIqDC0XECr8UqASXg3QRo1pWKeSdc+BWTbmQlzMtWYn5JWYBGheqDeTAvu2tcdzcTuLJ4FfywBuIYkzsF2/jc437X+PZIHODT8O4/01fIczPXSL2wIBnSsSkEMJrWMaXDmM6exvp9uHKteNZ3efWghoYat0sx3ycW86EGQPvTFs4gGH/jHmhvyivIytj27TEqM8KBkhJHDUplIZO/LanTTwpWrnlVRTPHNtExx2WvL4Dnv0wZ1L4JHEWEmzKMRzzXzJ1K1w0loASUgBI4VgRUODpWpLUcJaAEahUBDoZXwJPcDswJag4vZndg3g3N7DgGpgCSjrlIj01fKashBKxPSIP2qJEbH8bzFJgH86K3t13xqXCWkGNMvmh6RqGM6ewDd0eZdcx6SRmQBLKhNYFcZubMUJtB7YUVOLdn2740eXX+OgnHHJr5954pXeBRj44CfoaAt2A9NGH4V07VrGyO+Jv5sg1v/7JRYuHh764LB8ojk/qXllciZ70wR/ZCYKps+eTA/KhXo1aIWh6620aDoCkKokrLCF4AKPvhzc46PxQCqe1Kysw12rlWDeHcwsapMg1kHXkuHN91jJfC+PhkuR+e+h48uy+PooximfDsT7IfmqnKtqkyZWscJaAElIASODICOufoyLhpKiWgBJTAYQnMhqaoCKZop3dvKbeP7yH/Gt5ZJpf+3TmuB+b1NJVCDL5n/LXbCDccHB8SUyjgeC6CA37OLaKzApqDffzHVnhwyzILkNIV9E9r46UIZmt207pAuK1uCTfW3D8bAg6FIGoslm7fJ3swMPehUwUEao2SUSeu9xMc5C/REMCCofnyhTC2HoIeTcw4qC+naiaP6n7QxPBAJgQY1KkpNFYh8PoWBPPBA/BAt33/QRTvEDIPWw7qvBjzsjbD4QIXZ6VJ3fRVO2U9hK5wmMt1iY6QPLTnNGimwtHOXyH8rYlNNvOd6FRiMTzurYG2J6pxPePtriqmj6wbGZlziBNLM8gDFLTQJroTD0abgtGm/Zh3RW+BlKJqkulhWWkEJaAElIASMARUc6QdQQkoASVwlAlQU8GB8IzVuzHBJkDG92whefBWRoHDChRuzujZSuYt34EFYWPlbghPdGZg5rhAaFkGoeXSN+fLC5ecin0hRotBLYclMHFuz+WndJB3f98si2CaN2raDOnXujHm6aTLfsxlCUReVmAaDvbP6N1SlkMAmAZzuTV0MIB6bsRaS0GoC11Rc3BeBE0G10Cit7hde9LkMniWG4p1iXZhAL8TC7s2hSnYdsyRuQNur5+HBoRuuqlhsdfNKrdsv7Wj9Jv7y9PCsA6BaH//No3h8nubPDdrjcSi3Ppwe70QbsBp3sd6PTNrtTQKC5TRXZo7cXUpytTvfLgE7wOX6Rk4Bws2xGOuV4FcgXWJ2jepJ/nQolFIuml0N3ny66Vy7kuz5fQeLY2GaSbOXw6EyScvOkWoOaIDBYby6k8MXCS3ST2YIELAexZ155ypKWf1llPgAa8f2jRv2Q6sc7RKdoA7159auHmvNG9QVxKw/RT2R0BbNxzrYVELqEEJKAEloASOPQHVHB175lqiElACXk6Aa9qshYe6bAgp3eCaeQDdM5dO2reaTk3CyM5R0qJ5A+MYYAsGxw4vcU1lMgQlCh1Ltu4za+bQNIuCU0NoO+jMgAIEzcM6NK0nn00eJT0wfyUWE/0/g2tvP6R7BCZbdaAlsZvWMf71w7rI5RACgnDsR6xZRAHs/jN6SVfUoQHmFtEUkHXg4rEvXz5EusHL2y9YiPVhLDK7eNteeer8AfLIeQMgqARAw3LAxKW2y7VubCP3cx0f1pkmgFZgW5h/o/CgMgcH1jHrm0LIv7DY7OVju0saHDG8hMVon/5xjZwCDc/7146Q0+D9LhZOFBLTcqCIYUnlBLT5VKzTdMOIrsZt+my4VOeaQzee1UsePKsPGDrmEbG8eyf0kmeuGmoYvA+B8xNo4xqCyZv/Gin/HNpR8iBEMbD+Deo66k9NlGtgjreP7y7D+7Q2DiUWwe14WqnjhZtGdZWL8ZcCbdELWFfpmVl/QRBqZto0GJ7xdqIP7MN6UpbjB9e8dVsJKAEloARqnkCdoiI8HVwCTTEyMjIkMXGPRDVr6vSAdYmqm0pACSgBJeBCgEPmPAy4+fafghIFGk+B8bj+DTURNPuicGLNGUqHxoLCTV0M5nlP5sKiFHCYF/O0AtNkwTSM2hUO8inorMO8lqFTf5AoaFmWPHiOhEOwYhkcdFO7sTs5wyyS2qpRqDTGoqdci4nHjflc6YCf+XL/LghdPBYDLUs4zOwoPGXC+x4DBQ0Gep0r8lA3erijhohaMmvAzwdONtpMIYLp2V5PwdrPutL0jB7mWjYINVFzwZWuxF1ZWPkwXy5IO+XDhXIJhKx3rxshsTAdpHc6rtnENYnIge2yAhn7o+1paHNcqWe65iiPbaZga8Xkdw7PWQX15/mhlpBrLDFYXOn9ju3eBS98nMsUBS+DLWBiRwM8nl/+ldcmk5F+KAEloASUwFEjwPt+dna2ZGRmS0xMTJm8o2Z1Rw2xZqQElIAScBDgAJqmYRzo8rddg2NnxGOhGHwzWAN1ftfBgTCs82Pfz/kpdcSxdhHTWYEDd5bVCU4TKGZQ1qBGxFOgYMM4rWEyx/V1uM30XFOI+606MC33h2J/T2iPGLjWEfcxcD9LsNoVUk7dPOXLcthm1/KYrz0YDtjBunKhVpoRcj4VA9cSCoDAx/I9t9REMx88TqEyGoIIBSPmw3a7BuaVD25sGwVMBsaji3R7YL3rHqb+LI9apXCYVDJYXFk207fBYrDtYLro1CacQzq9qEybTKb6oQSUgBJQAjVCQIWjGsGqmSoBJVDbCdiFh4pYWANnexxPaTGuhiDgPqhnOh7jgJyBGh8OsAuhRbKEGXOg9IM5cNBfZMurvAE561bsQdByrXN5dSsv3/L22+vJ357qavbjQHksrDyMAATtjcWF24dLw7TltdnKl9+VqX+5TJDelb8jz8O3ifE0KAEloASUQM0SUOGoZvlq7kpACSiBY0qAA3ea0Y3s1lwiMbfHF1qWyggFx7SSNVwYNTKtYTI4pFcr6d6igREeKWhpUAJKQAkoASVwOAI65+hwhPS4ElACSuAkJGBpd6y5OydhE6pVZWpuOC+Is7NoV65BCSgBJaAElICdgM45stPQ30pACSgBLydQ5gChlqpMKA/58cOY4Hn5ydbmKQEloASUwFEjoGZ1Rw2lZqQElIASOHEIUHNS24MyqO09QNuvBJSAEqg6gUP+YKueVlMoASWgBJSAElACSkAJKAEloAS8hoAKR15zKrUhSkAJKAEloASUgBJQAkpACVSHgApH1aGnaZWAElACSkAJKAEloASUgBLwGgIqHHnNqdSGKAEloASUgBJQAkpACSgBJVAdAiocVYeeplUCSkAJKAEloASUgBJQAkrAawiocOQ1p1IbogSUgBJQAkpACSgBJaAElEB1CKhwVB16mlYJKAEloASUgBJQAkpACSgBryGgwpHXnEptiBJQAkpACSgBJaAElIASUALVIaDCUXXoaVoloASUgBJQAkpACSgBJaAEvIaACkdecyq1IUpACSgBJaAElIASUAJKQAlUh4AKR9Whp2mVgBJQAkpACSgBJaAElIAS8BoCKhx5zanUhigBJeANBOrUqSN+vj7i61PHqTk+3O/jI857naLohhJQAkpACSgBJVBNAn7VTK/JlYASUAJKoBIEKNQE+PkKZBwpKRHJKyxyS8Vj6Tl5sjctW+oG+UtU/bomDtMezMmXpIwcadUoTHwZUYMSUAJKQAkoASVw1Amo5uioI9UMlYASUALOBCjKFBaXyDcrd8oHi7fIjL92SzElJBcZJ8jfT35aGy+D//213PP5nyYTaoyY9up3fpUB//5KPvpjqwQH+DoXoFsnFAE/aP0oCPPcaVACSkAJKIGTi4Bqjk6u86W1VQJK4CQk4A8zuZW798vVb/0s+XkFElI3SBZNmSgdm9WXwqJipxZRaMovKJJ8237KUdl5hVKCfTkFhZCpdNDtBO0E2giEUPTxH1tk/prdcv3Y7nJKTBOnc3kCVVWrogSUgBJQAh4IqHDkAYruUgJKQAkcTQI+0CTM+TvOCEb1w0MkDWZzP66Nle7NG7gJR6ZcyD6W+FMiJeLv5yPvXTtcdh/IkF4tG0pOfqFT9aihcExRqiNFkKRK8GdpLYyGqjS2p308ZO1nOshhToFznzgPigeYlz0/K6JJzyjQcLHivnVglIDvYmxb8ZmHwxywpLSOVuqKv5m3aRu+WT/mh/+HDawy07JKTGe1w+SBneVl4SgPiRGDaa362ws07cUO6xi3TY6IH+jvK8t27JfPf9kgY/u2kWEdm0lBcbFTnR1lIIMqtsleB/2tBJSAElACNUNAzepqhqvmqgSUgBIwBCgUcL7Q99AkhIYFyz1n9pI60CTNXhsnWdAGGcHjMKw4oK8XHCDdIEwxvn1gT61ULuYv7UjKkK370mCCV2wEq9TsPFOuFZcCRRr2cb81qLeKZf1Ss/KM+Z61jwId8z6QmSsbE1Jk2/6Dkp6bL9SMoApOISO3QFIyHelZDuNu3pMqudBy0bkE/wqKimTbvoOyfX86BMIS41zCKRMPGyzLtA1C4fr4FNl7MNvEYr0qCqxeLrRvB1CnbGjqGH9/hqMdSfhm2ywBx8qHbaIpXCbis/47UWYWhNAACKb25pKn4QWO/B2AvNPRfpZHISguNUsSUlFPnK+c0jrkFTjOCcsybcJ+ni9Hm3KQv8MJB49rUAJKQAkogeNLQDVHx5e/lq4ElICXE+DAfMn2ZNkUe0CGdm0ulw1qL6/NX2+0C5shzHSLpvaIw2zPgQNn6B3kzs+XyC/QPj158WC5sH9b49CBeS/eulce+HqZrIlNlgIM5kd0ay43jeoq9321VBqFBst3N4+VsGB/oQAz4fnZEMgK5Nv/GyvtmtYzmh2a6V38xgKjlfro+pHSv02kFEFlkg6B6ekf18gnmON0AJouSDMSExku1wzvLDcjf0tAYtw7P/9Dft+UKA+d01fmrYuXr5dth6bGR/oir1evOM0IJ9e/95ss27Zf/AN8ZGjHKHnxslOlTcMwI8x5ajk9883E3KynZqyWFbuSBJWSuiGBMrJLtDx6bn/piPoX2EwP7XlQe/MBTNumfrNC/jGkgzRvGCpTp6+AAJcrTeDk4uJT2ssDZ/WWYMzxoqDItlCoex3anjfnr5PNEOIohHaNipDbTu8h/+gfYyJwHzme98o8OQDnGG9dNVSmr94lszGX7MZxPQzTy9/8WdIgaEKqkvu/XCqPfLVMpl40SK44tYMUQIj9HvGnoU2r0B/YptC6gTIa/eLRc/tJTON6njWJ9sbpbyWgBJSAEqhRAioc1ShezVwJKIHaToA6DprUleQWyigMgls0CpXREGDen/2XzFwTK31aNqrUgHgfBJQEaDQyob3hYJ7amK370uVSCDb7oY1p06KhDGzb2Gg9HvhmmezEAD83v8gx+EcdKATQLC8L6SlUWNoQCgVxKZkSm5RutDTcT83KkzNXyyvfLpcunaPl0sHtJRFam2+X75Apn/5htFjXDu2EuTQOj3v0rpeA9M/OXithQQFy4aB28tvmRFm2IUFu+OB3mJr5CTmcN7CtLMC+Bcu3yyOhgfLeP4eXCSY4XBYoGK2NTzZtK4DgeAmEmYZhQTIXHGcs3iz70nPkh1vHSd1AfzctGDOhVigtO18S0V4KIzSPG9YpSjLB4+f18fLC9yuN8DP1/P6SX1gigb6+8viMVfIYhJkGDULlqtM6GU3XdxB6rgXfHKS7fhjaW1hsyosHr6T0bJkCzn+incHgRdZh8DDYE+dhbVyypEIQi44IkcaYX1YvJED8UKc/dx8wbSL8Swd3kIi6AaZvTF+4SZIQfzoEWbKiplCDElACSkAJHB8CKhwdH+5aqhJQArWAgBmkwzX3DJjU+WNwP6F7C6OtGQsh6f0F68zA+PZx3Y2J2eEGxBRYILWYQT21SdzkxP/9ew/K4J4t5ZPJo6RJeDCUEcXyBDQTT323wm2tJM67MXNvXNibfTiGLI2pGOtyLubLUIh64Mw+0qx+iClvavOG8tDHi+X7VTvlCgzuHSaBnM8D0QemY31aR8qbV54mQdDc/AZN0lnPz5IVEB5uPrO3PHnBQPFHGd+t2iWXQvOyYH2CpEDDEgFtkOsMIM6bagst1f+N7ib9IfBN6tPaCDzbRnaVUdNmQAO1T9bB1O/U9s0gsLi7RGfzjNmcLzz9oQ3TbxkvnaPqG+3QJ39ulRvf/U3eg0ByzdCO0r5JPdkAE8CX5v4t9dDO6beNh5AZaQhdBCHv/BfnyFMzV8l4CLTREQ7X6vRGl59TIEHQDs2650xpVi9EGsFksn6Iv3x3yzg57+U58stfsXLPGb3lkgExRujMhFavA8q6eUw3Gdy+qZzdq5Wp46bhaTIabVqyZa+sRz0GoL0FENg0KAEloASUwPEhULHh9vGpk5aqBJSAEvAKAjR7W7HrgGzDfJkhmJhPrQIH7WMgHDVvUl9W7twvGzEg5mC7SgHRaQ735/Z9xtyNJlstoPGgMOMPLciEHi3FN5AaiCrlWhaZpnID4WXt1cuHSPMGdY0AQg1O71YNOWkGc39yzHwiarAYjHADQWRU5ygJgcBADUuvVo0kGmZzqJCMhimcPwQo1u/Udk2lLrRGWTBPS0p3zP9x5HLok8JZMPKZev4A+QeEC2p+2F4KIe0gYEB6kD2Y13NYbChvcLsm0jna4RWQ5onn92srXeHUIg2asPUQsKipWQjB5CDmCg2Dlqwv2sg1qPLQhqEdmkmfNo0lARq6VdD68HwysD4+aNcUmOaNh8DbAV4H60M7RNz2OjG2tc02hUDT9RSERNbB0aYiI3C1hTldMYSnRLRJ17AiYQ1KQAkogeNHQDVHx4+9lqwElEAtIDCbJnUY+KZiDs8UmKk5XHdDg4OBdhG0DzNgWjcAA3AKDpUNlEkKMHiPx4CewkfTesFl6S1nCw6tTmVzdI7HtKzPTGi8qPWiSV822kBHBEYU8iR0IQ0FAZbvOFwidSHgWMHsxwEKVJwTlEsnBuVofZiGAuNmaMU+XbJVNkK4TIaZHLViGxPT4A7PxwgXVt4VfVPYoNc8Bgoo1JI1gZAFm0Aj5EEakR0wV8SJMZo3tp1e9+j2goJsJDR+kPZkd0qWSWuV5YM6BNFhBJwrWO7Y2TY7Gv62b7NNrD/btDkhtbRNJUZIY5tQPQ1KQAkoASVwnAkcenId54po8UpACSgBbyLAgTXNxn6EeRV8ccsamJetwXybsoCBNQfm89bFyd2Y9E+Nz5GGyo6prXgUrsoLFA4oGPz7m+Xyyk9/SWNojjhfp1WjMElIy5J1cPxQXrDyL++46/7y6kENzVK4w77ktXlGmzIUGimavzH+7uRMSatqQa4Fc9sU7qhBCaWawwZL6DsUsSrCDL3eLYLzjMtem2/mTA2HNq19k3AjPO3EfK10eNbToASUgBJQAsefgApHx/8caA2UgBLwQgIc4C+H2dwuaApaNasn92HeDfdxQE0Ny0FojR78eqms2Z0s6+JTjZc4VwzlaX8oG9CFNE3pdkKrkpiWY9ZCojc0CmUc61NLYgX+Yl50I50BrQhdVDMezcyoSaEZnRW4vSUxXd6C57YIaKTmYU5Nh6b1jUvrnzfukZ+gSaI+hGXURGC2rNs7v22SRGhX7rv4FHn4nH5skBEkzoTHvT3Gm1ypfHOYSnD+EttEHmSQB40YnUtQYG2G9mHRJXiJC6eHCwgt2aYMR9u4RlIJXIDnELa0homgndNhijWHmY9D2MQmEL/960bZl3hQHrpsMEzy+pi+wPqd/uws2QvnEY5yK5OzxlECSkAJKIGaIqBzjmqKrOarBJRArSbAofxPMKkrhina6d1bymQ4E7gSTgyuxPwgOjO4aWQXOQ3zkIrgpeyHNbuM9zm7vEFxhWZkngIH+pyTMwjzaeALWz6EBzd6ovPHAJ/zZb5fvVuKYLZmF64oGLWCFoimfDP/jjWKEwprC6HRSjiQCV8PjscB68C1kLguUQDM3xqGBhnzMTqEWI15NzQxY6iqoGASVfKDJn0pWbmQknzg0S1IAjHPiXWhULMF7s8Fi8yyfM90bIWwfdDW0PMdNXNs25dwM74B2q/6MK3r2jxC8jB/aRjmFtWHu+9fodmjQBsS4A++vvLLpj2yGhqsFhAO+2AOlWU+Zyuhwp+sI89hCQpmm7iWFCXjCDANwPwjmhcmwDRyK4Q9SkaMf0hMrTBrPagElIASUAI1REA1RzUEVrNVAkqg9hKg5uMAFhudATfSGAHL+B4tJA/rC3GSvxUo3JzRs5XM/nO7zP4rTu6Z0EsisHAo5w9xHtGfGNRf8Opcef2KodgXYrQYnGhjaYQ4kL4cLq7fW7hZ/sTaQiOemgFnAo0kFkJSBsoJQl7WUBuylJn/MxFe3+he+79Yv2jljiS4lxbZmZwlIUF+chBzejgw5/wcOj3gmjvb4JL6HzBtOw3rEu06kC774UI7Gse2QqNz8yeL5TU4bKBAZub0mLpZrXN8s46OOrvvL08QYB0CYYJ2CgS/WX9uk2d/XG0Wj60Pr3ZLtiZKG3ixi4P25Sm43m4Axw7ju4FtBXOX6O77H68vkG4QcOjK+3cIPMUQHK85vSfWbaon+Zgz1BEOFW4d210e+eJPORfe6cbAMx3Xnpq9NtYcvx9avxbGMYXj/LHunupPzpyHFBURaoTWaXCH/tHiLfIINF+nQgCjMDtv2Q6sc7RKNsERB92e/wnPe+SdCHfsj3+/Qupz3SOY3FXUJmeauqUElIASUAJHk4Bqjo4mTc1LCSgBJQACXIOIpnIYQUvfDk2NyRy9vdkDTeBGYC5POyyUehDuvrdBe8AB96lw83zbGb2wNk6gbEAedFVNc6tG0DY0g3aDg30OwguhkaA52Bc3jJIBGEynQHCZCTfZDeHO+zEsxkoNhV0NQc3FP4d1lusgFEQgj98gJG2Byd/DiNsTay1FYU0eCiU082qAAToXb+2LwfyK7fuNgLIBAtF/Lxwkj58/UJrBpfV2eHCjUIRSpBHKZN1CbB7yuJ+CXjMIFXTtbbWe2qwouMymFzyaBnoKFCKvx2Kz10JgpOe7d7g468/rZSwEofeuGS5jereWVLQ3BfN06rCd5QW0+RS4xr5zbE949tsviyAYcb2kOyb1Ewo81ASxXizjTizi+vK1wyFwBWE9p50yE4It51m9f8Nos4BrHoQoBtafrs2t+lvtMgfxwRzvGN9dxg2KMfX7GwJmJgTjwuIiuRHaw6vH98CaSIXy9s8b5G206wy4YX/3mmEyAt/JbBM0ZhW2ySpIv5WAElACSqBGCNQpKnJ5YqMY3vwzMjIkMXGPRDVrWvamskZqoJkqASWgBLyQAAfeFHY434XCkqdAoScP6wNRG0TvdfRmxvsvPazROxw1PwE0B0M8CjcURpgX87QCTePo9S0BC5NykN+pWYT8FXtAhj75A4SQurLkwXMkHFokzp+x5iPRlIsmXi0g0HCdoaw8R1nMi3EY+JuD+jg4QECx0NiEGTfdzCeHggL20ckAg1U3k95WN9aHbbDny/gU+ChUWG3jPtfAejCrBLi3TsrMgSe5ECNUsfxCVIgaH1cWVh50J/40nElM+XChXDyii7x/3QjZA497+2CWFwXBjqaCZMm8rMBW+6M9mWCRUOqZjnFDYF7HdtiD1S4KdzxfroGL2FJ4tbQ/Vvvt/A/AnJIaQbonN23Co5hcXBm65q3bSkAJKAElcHQI8P6dnZ0tGZnZEhMTUybvqFnd0eGruSgBJaAEnAhw4I45/ybYxuBOcbg/0N8hYFhxKCgV4s91v9GyID8rnpURBRM/3OC5aCqlKOZG4cFTMMIADnExUzpzoPDG9K5lMS33U+PTKSrCZMW5M9zHQA0Tg1WX8urmKV+m41wbBiu92XD5YF3ZDGq0qKXhtlU+Sw+C0FJRent2TBcJgcixSC74lrbDHofEKPSwbfSMR+mPWjRXwYhpymsXjzFQMKLIRH4MVj3L4884FASr0iam0aAElIASUAJHn4AKR0efqeaoBJSAEjAErEFxRTjKi+O634g75sM9N+52CEQOLY0RsKCF8DSwZ2oKRQ7djSMv17Icex2Deo+ChEs9yqtbRflaZRzu27WujF9eefa8mA7SVJkgRMHEg6GEPYn5zToXljhrilwjldcue7yK6nikbbLnr7+VgBJQAkqgZgiocFQzXDVXJaAElMBxIUAhgPOVJmBeTkN4eqMGy3LMcFwqdBwKpfDRDvOxRg2Ikd6tGxnNjRFWjkNdtEgloASUgBI4uQjonKOT63xpbZWAElACSkAJKAEloASUgBKoJoHy5hw5DMermbkmVwJKQAkogROLAOe8uLsKOLHqWNO1qe3tr2m+mr8SUAJKwBsJqFmdN55VbZMSUAK1noCakZXOTar1PUEBKAEloASUQFUIqOaoKrQ0rhJQAkpACSgBJaAElIASUAJeS0A1R15wav38/MXP3x+emIqkID/PC1qkTVACSkAJKAEloASUgBJQAseegApHx575USnRx8dXgoKDsXCkX9kihHTfS+GIQhKDDxYi9LRA4VGpgGaiBJSAElACSkAJKAEloAS8jICa1Z2kJ9TX11eoMbILP/zt5x8gycnJcjA9XfLz8+HCVmcenKSnWKutBJSAElACSkAJKAElcIwJqHB0jIHXdHEhIXUlJTVNduzYIampqVJQUFDTRWr+SkAJKAEloASUgBJQAkrAKwiocOQVp9G5EZ07d5bt27ZLfEKCZGZllZnZOcfSLSWgBJSAElACSkAJKAEloATsBFQ4stPwkt9hYeHSrXt32b17tyQfOCB5eXlqXucl51aboQSUgBJQAkpACSgBJVBzBFQ4qjm2xzXngQMHmUU+EhL2SDrmHxUWFh7X+mjhSkAJKAEloASUgBJQAkrgRCegwtGJfoaOsH70VDd23HiJi4uTffv2S3Z2jhQXFx9hbppMCSgBJaAElIASUAJKQAl4PwEVjrz4HEdHR0vbmBgjIKWkphjvdV7cXG2aElACSkAJKAEloASUgBKoFgEVjqqF78RPPHLkKOPWO3FPomRmZqpzhhP/lGkNlYASUAJKQAkoASWgBI4TARWOjhP4mig2MX27FJc4m84FBgbKsKHDjPYoKSlJcnJy1DlDTcDXPJWAElACSkAJKAEloAROegIqHJ30p/BQAxLSNsvCHV8c2lH6q0vXrhJer57Ex8dLWlqarn3kRkh3KAEloASUgBJQAkpACSgBERWOvKwXzNrwmqTl7Hdr1Tg4Z0jcu1f24k/XPnLDozuUgBJQAkpACSgBJaAElIAKR97WB/IKs+XbtU+7Nat+/frSu3cfiYX3upTkZF37yI2Q7lACSkAJKAEloASUgBKo7QRUc+SFPWDtnl9kfeLvbi075ZTBUlRYDPO6BLP2UVFRkVsc3aEElIASUAJKQAkoASWgBGorARWOvPTMf/3XNMkrzHFqHdc+GjdunJl7xLWPsrKyde0jJ0K6oQSUgBJQAkpACSgBJVCbCahw5KVnPzVnr/y08Q231jVv0UJatW5jBKTU1FR1zuBGSHcoASWgBJSAElACSkAJ1FYCKhx58Zn/fftnknBwi1sLR48eJalpB2XPnj2SkZGhax+5EdIdSkAJKAEloASUgBJQArWRgApHXnzWi0uK5MvVT3hY+yhIhg49zWiPdO0jL+4A2jQloASUgBJQAkpACSiBKhHwqyh2w4YNJTi4rpTgn4YTiwDnD1Um7E5dJ3/s/FqGtL3QKXq3bt1l/bp1Ep+QIPWwBhIXiw0ICHCKoxtKQLCuxrgAAEAASURBVAkoASWgBJSAElACSsAbCdSpU8djs8oVjvz8/CQ8PNxjIt15chGYuf5V6R41QuoFRTpVfCzWPvroow8lPCxc/P0DJCwsTHx9fZ3i6IYSUAJKQAkoASWgBJSAEvA2ApSNCj14bi5XOAoODvY2BrW2PbmFmfLd2mfkqgHTnBhERERI167dZO3ataZzNGnSRIKCgqQ8SdopsW4oASWgBJSAElACSkAJKIGTmEBxUbEEucg85QpHOkA+ic+0h6qvSZgvG/Yuli5NT3U6OmLECNm1c4cU5OdLWGhdoSkltYYalIASUAJKQAkoASWgBJSA1xKA6ignO1syMrOdmli5iStOSXTjZCXw9V9PSr6HtY/GjD209lE2OklxcfHJ2kSttxJQAkpACSgBJaAElIASOCwBzzOORKqkIvhs1aOSW5B52MI0wvEhwLWNKgop2Ykye9Nbcna3W52itWzZUlq2ai1xcXFmnhmdM/BPgxJQAkpACSgBJaAElIASqE0EyhWOqD1w9YhWXFwof+1ZUJv4eF1bf932ifRrMUGi6rV3atuoUaPkvffelcTERAmFeR1N69Q5gxMi3VACSkAJKAEloASUgBLwcgLlmtXlYw6Ka+jVfIzrLt0+yQiYtY/WPCElJc7u2emAY8iQ04z2iGsf5ebmusU5yZqq1VUCSkAJKAEloASUgBJQAlUiUK5wVFBQ4JZRx8aDJNg/1G2/7ji5COxK+RtrH33jVukePXpI3bqhZu2jtLQ08dQH3BLpDiWgBJSAElACSkAJKAEl4CUEyhWOqFlw1R75+fhLt2bDvaTptbsZMze8LBm5yW4Qxo0fb0zrEvfulSx1zuDGR3coASWgBJSAElACSkAJeC+BcoUjNjk9Pd2t5b2j1bTODcpJuCMHjjW+xdpHrqFBgwbSo0cvY16XkpwseXl5al7nCkm3lYASUAJKQAkoASWgBLySQIXCUWZmhlujOzYeCNO6MLf9uuPkI7A6Ya5s2rfEreKnnnoq1j0qkPj4BCMgF3lYPdgtke5QAkpACSgBJaAElIASUAInOYEKhSNqDVwHxr4wreuupnUn+Wk/VP2v1mDto6LcQzvwi17quPYRXXvv27dfdO0jJzy6oQSUgBJQAkpACSgBJeClBCoUjtjmgvw8t6b3UtM6NyYn647k7ASZu+l/btVv1aqVtMD6R/Hx8ZKSkqrOGdwI6Q4loASUgBJQAkpACSgBbyNwWOGosLDQrc0dGw9Q0zo3Kifvjp+3fiSJ6dvdGjB69BhJSU01DhoyMzPdtIhuCXSHElACSkAJKAEloASUgBI4iQkcVjgqKSnGoNhZQKJpXY+oESdxs7XqdgLFJYXy5Zqpbo4XuPYR5x/RvE7XPrIT099KQAkoASWgBJSAElAC3kjgsMIRG+3q0pv71LSOFLwn7ExeI0t2fefWoJ49e0lISIjEwbxO1z5yw6M7lIASUAJKQAkoASWgBLyIQKWEo0IPC8J2iBwgIf7hRxdFwE0yddJKmdyyi1O+A/v/Ji+c+Y5EOu2t/kZky3fkhYkfmnyHDF4szw65qfqZnsQ5zFj/kmTkpbi1YNz408vWPsrOzpHi4mK3OLpDCSgBJaAElIASUAJKQAmc7AQqJRx5Nq3zk+41YFrnC6J+PnWduPr7+MGFmtOuo7MB80ApJYBftT7kFGTI9LXPuXFo2LChdO/eQ+Lj4iU5+YCufeRGSHcoASWgBJSAElACSkAJeAOBSglHbGh+Xr5be4/HgrCBodfJXROWygvQML0waYFcFN3f1Gtg35kype91ZXUc2Hc6tq8w2+EN7pV7y9L8JpM7XeiI50EB0qfHdJk26rlDWqrgm2TKmbPljHoRZXl784+V8T/J5v1L3Zo4ZMhpRijStY/c0OgOJaAElIASUAJKQAkoAS8hUGnhqLCwwK3J7SP7S0hAPbf9NbcjQiYNnizNsubKi7Mny6z4Ahk04BkZCK1SSGCkRAaHlhUdEtgM2w2x3UUuGXahNMv5RV6fN1k+25IgnTrfKmODy6I6/VifuEMCw0+VAaVZdWx7ukT6Z8iGg6lO8bx54ys4Zygocnbhbq19RNfe1tpHJSUl3oxB26YElIASUAJKQAkoASVQywhUWjgypnUubr19Ye7WM2rkUUVWVGFuzSQ0ABFgdhcg22Tu8ovl9SXPyQ6TplCKxK7dsrYTZdnaj+X13++TzTnbJD55O+KVH/KSpssu8ZNercYhUoT0b9FM8vbMlZ3lJ/G6Iwey4mXe5nfc2tW6dWuJim5u1j5KTU3z6KjDLZHuUAJKQAkoASWgBJSAElACJwmBSgtHbE9+gV34cLTwqHqtgwao/KlF/hCINsj3q+dJVv1hcsP4+TCrmymnN20ueR6knUN6Lmh8gnrLNWfDDO/s+XL3KRNQRqEcOu56pn6XJfGZEtlihATKWdIFGqbVW792jeT12wu2fCB7091FwjFjxkhySgocNOwRXfvI67uBNlAJKAEloASUgBJQArWKQJWEo0IPwlH7yH5SN6D+0YGW87ckIacgVwmJ2zl75IC0kgY5s+Sh7/rKEz8/KrO275bWba6Rs5u2cpRfNocoQlqHB4lwu96DckWHrrJz7aPy0A995bbv3pA8aIYqcsCwdPsSkeD+MqnHWRIim2VhSu0xqXOAFCnC2kdfrXnCbe0juvUePPhUiYVzBl37yKKl30pACSgBJaAElIASUALeQKBKwhHnmBS5mNb51PHFgrBHy7Rut8RniTTv8ZiMbeAQeDrGvCHnNwmS1ORVEGpayTnDnpcpXSdK0sHvZe762ZKOswAxCKZ2fuJbv7tE42dk9KPSDxofzpoJDKAjhUKJ2/e9pBdFyNj+50EjVBrKa33KN7KpoL4MimkrqbGzJcGKX8u+tyevlqW7f3Brde/evSUoMMisfXTw4EEp8ODq3S2R7lACSkAJKAEloASUgBJQAic4AfjIrlqgaV2wn3Myeq1bsuvbqmXkMfZu+fzXadJ09L0yYdi3MqE0TnbKPHlt5Zdma96WHdAEPSQv4I+hKP03+WnvbsnInyljhp0jd8OLnUimpEIyCsEvziFalzNMxoxZKWO4nb5DkgoiZcKod6BNwo5SbZOzmd1yWRybKJ1iImXNtg8RqfaGH9a/KN2aDZXQQGdvfeNPP10+//xToZvvkJC64oc+4eNTnrRZe/lpy5WAElACSkAJKAEloAROHgJ1ioqKSlyrW6dOHcnIyDDzSqKaNXUyreKxsHBnM7rikiJ5cNZYycpPc83qiLfDQ4dKs4BgycxZJgk5zmZtgTB5ax0cBcloq2w+uOFQGb5dpE1oXUk+uNxolA4dEImuN04CijbJzszdmNjUSiJ90yUp3zlfe/yOPWbLDc23ykOzbnbLyx6vNvzu3+IMubTfo25N/eWXnyUuNla69+guUc2aSVBQkLB/aFACSkAJKAEloASUgBJQAicyAY5Zs7OzJSMzW2JiYsrknSq/6qdpXaEH07qe0aOOavvTM3+XzSlz3AQjFpKXsxzHvncWjHigaIPs9CAY8VDCwTkOwcjE212+YBRwoUweNlNugNZo07rXa71gRFzL436UrUnL+dMpDB06THLz8mRPwh4jTEPQdjquG+UTUCGyfDZ6pGYIHI8+dzzKrBl6mmttJFCd/ludtLWRtbZZCZxIBKosHLHyBR4cMxyPBWFrBGTRQcnMTZEV66fJG7E2rVSNFHbyZPol1j4qLHL2Vsi1j0aPHiOx0B5x7aOcnJwyqdtTyxj/cH+e0nnTPrbf378idyDe1Nra15aK+vexpMGBmauZK/cd6wHbsS7vWDKuzWXxvLKve9P5DQwIMObh9vNa2fYFBgYaHhWlJS/G06AElMCJT+CIhCNPXutiGvXBGkTO81JO/OZ7qGHRHPl46RXy8RbHHCcPMWrlrqTMWJm35T23trdt21aaRUUfdu0jahwTExMlLi4Of/Hmbw+2uaisY1+c+U2tZGUfSG6VOcF3cF7W5i1b5J5775N78bdt2za3B+oJ3gStXgUE2Mf3708yjkqsPu74jpO9iXsrfHFQQbZVPhSAQd5vv/0uH338iRHEeT0VFxfLa6+9Lps2bXYbAFa5gEok4EBw165d8uKLLxlLA2+9piuBwiuj0AnP3r17vcoZzwcffiTLli0rmz+blpYmTz41zbz0K6//cj9ZvPHmW7J5s+PaYt+Pw3PtmWeeLbvmuW/r1q3yKq5Bu+UN0/O5oEEJKIETi8ARXZWWaZ39oqbXOprWLd5Z+9YEOrFOac3VZj6Eo77Nx0vjsFLX6aVFjR07Vt5//z0zRy0Uc77YL/gwsAIfADS5e/GlVyQhIcEcYx/iw7VRo4bCwVxxcQneqgXIIw//R5ph/pI3muiRw/Tp30tkZKSMGztGmjZtagatFif9PnkJWIOku+6+G4sjF5j5d1Zr2JdbtGgh/55yv9nPvl+TgRojvnDYuGlTmfaIZa5Z85f07NnzmLx8IA96sly5alXZALEm26x5HzsC1H7MmTNHpj45TR7+z4Myfvx4yYN59ckceEUm7NkjjRs3NtcMr5fc3FxZunSZFN5QWGHT+OIhLjYO6/5llV1bnLO9bNkKYb6chcvrISsry8Rj3txmYBkUqrp37162zxzQDyWgBI4rgSMSjljjgvx8tzceXBBWhaPjej5rtPCi4gKhed3/nfamUzlc+2jQoEGyCgOh+vXrG9MB7rMeAHwYUFj6z0P/NgMl7qcJ3lVXXyP33XuvdOzYoextGgUlSzDiII9xmZ4PINdgHeN+e1n235aQxvTMh+Fw+VY2jsnM5cPK216ePUpqaqqceupgGTBggHlYemoX49vbZqW3t8vax2+rTP4ur1ymZbyK4piD+nHEBMg+PT1DHnnkP9KpUyenZQ/In33b6oMsxDpv5fVvqyJWvPLOLePZzy9/s9/bX14xDs05rbw8XReMYwV7fpUt1zUey/JkQsr9jKvh5CPAfkFNya/QTPbt20fmzVsA0+rR5TakMv2oMnGsflvRtWLFYWWsZ4i9YvZyXPOhqHLvPXebfpmPsQ2vD8bnNcvAvBlc03GbwuKjjz5s0pINrztH2kPm09QW8cUEl8Fg3ZiO8aidegHa1f+9/ZYpg/uZ1irL/LB98BjjaFACSqBmCRyRWR2rVFjoPP+E+2haFxbYkD+PKES2/lRemPSpWauo/AwipHvr22Vg6LEx4QsMvVDOiLnw0NpI5VfM45ERQ1bKC8Nu93Csi0yeuFJua93fw7ETd9e2Aytk2e4ZbhXs06eveUjEQzPEN8Z20wErMh8i9Ghn/fEB5LqPN3/+cVDFfGLxBpxv3PiQsh4aVn5868aHVgDi8jcfTIzDb5bPY3v2OEz3+EBhecw3PT3dzJPi2z3XwZtVNoWYXTALSk5ONnGsh6NVtus3j/Nhl5KSYkwq+CbVnjcHgyyPD0a2h/mynuUFtsf1Icg28cFtD+TC/Hbv3m3MFll/a+BrxWM9WC7fjO7bt88wco1jxdXv6hFgPwhCPw+29XP2d/ZzK/AcmfOGN83U8LCf8xxxvz1YfYp9kfHYJ6zBmj0e+x37Cs1W9+AcM5TXX3neCwuLTH779+9HmT5u/cUPcRiYF8tln7P3ZXMQH1a51ADHxyeYPuYpnhWf30yTmZlZYd+3x9ffJxYB9qvdpXNM77zjdnPf4b3H0/3Euu+wH/Hew8Dzbw+Mw/sg+w/7EfO352VdK5m4x/FZUN61wuuC91fWhfc45uGLvKxg5cm67N4dK9k52W7XEl/Yebons868x3JubXnl09uVp2eeVT6/eZzxeK2yXbye+bzg9ZWRkWmOMR6fHZ7yYpps1FGDElACNU/A+U5VhfJ4gfMCtt/sfPCg7Rk1ShbtPLL5Okn7PpDPlokcqLAe4TKs92UStPpbWZpZvivuCrOoysEG58iYHiILt39pFpWtSlLGXbdhmmTLOg/JsNrtSRq+X/eCdG16mtQNdHbpTvOKL774XCIiIszaR+HhYU6DNPtg3/rNb+uPOPgAYL965533ZNXq1aZ/FRYWmLeT5517Dt7OOQwV+AB5YupTcs45Z8vcufNk185dcv3118ppp51mTNdoqlAXJn7LYdrAB2uzpk3k/vvvM6ZF3//wg3nYMY9LLr5IzjjjjLKHEevCsv9YsgQDQj/zoOrdq5dcddWVaFOIm8DCOvOBzgEf7c5pV87Ah/E5EyfC5GSc2d61a7e88uqrsnr1GvMAX7LkT5n8r+ulS5cuZWUzItvPh/Sjjz0ut992qzRp0sS8kaTJ4axZs82ckTvvvN08WHntzZ49W7759jvUwRcP2TyYJEbJDZP/hW+HyR7jrFq1Wt7/4AOUwzeWxWZtqptuvBF5NzYDWlNB/TgmBHB6Tfjyy69kwc+/oJ/4mHPAN8pXXXmF6Tfsg+xT2dk58vbbb8uWrZyb5tC2TJx4Nkwyx5b1GT8/X8xd2y4vv/yKEfp9cb75Rt8f3z5WYaUtY5/cv3+fTJ06VXZC8KfA3Dy6udx22y3SoEED088YZxcGmK+++pqZPxWAfse6sP+fAu2wNWhjv+Kcuddff1PSM9JNfwwPC5cbb7wBfbqzR5YUEmfN+kl+/32h3HPPXWZwyrZqOHkIUJj5Gf22W7du0qFDB4lpFyMLFy4yLnDZn6zA/rHmr79wL33X9OPc3BxjTnzzzf8nbVq3LhWk/czcuM8+/wJCSb6J17ZNG7nllv+DuXWjMiHicxz/5ddfIexAsEcZ/fv1lcsvv6zsWuE18B3ugT+ib7FcelBt27aNXH/dtSYf3lPpMOill182L6VYR76s+seFF8qIEcNNOQEB/vLyK69Kzx498KwZVXZfZH68Z9McOu1gGvYXm+vgmmuuMuUzL14T1P5MwNp/vXv38viM4HW1c+dO3Ic/hCniQ+ZlyWeffS4zZs40wtqDDz4kLVu1lPvvvUcWLVoky5Yvl7vvuqusHnwWLV++QubOm280XHrdkLwGJVBzBI5YOGKVCjAY483DHnpFjz5i4Si83ggZ3UFkR8IcadtruowP3SvJgd2lXXiQFGUtl7cWTJb6vd6Udiyw96dybfF18neDqTI6BG+UwgdLi/R35d4//paLhjwggzCvgyE1aZ78b9F9kiBd5LIRj0ghJkZ36TxYwnEsMfYNmbbybRMvPPJBuX3wORKBl015WWvk24X/lI0NXpYpfTua4/8Z+7I8NfdmSTJb/OgiV419Xfy23CX/27Vc2sS8I5M7hssXcy6QVUURct6wr6VZ4tPyR9AFcppPkCxNgee70OvkrqHXSvNAP9RrjdCS2RKRPJW/9AR9ScT1rCggXdL3YYIoC5GRjTEw6mrsquvVq4cHQIDREvHhVNnAhy+FDGptaM/O+Tl8qDzxxJNGQzRp0kQIAQXmAbRu3TrYdJfI0CFD5Kwzz5SWLVuYh14K3rTP+mm2PPzwQ3L5ZZdJHt7McXLsbbffISNHjJSHHvy3Mf9btGix/Bf7O3XqjId7WzMI/OWXX+W333+Tp56cagQTvoV8770PZMeOnTCL6FE2OHRtD/MJCQmWqU88LuHh4bJx4yZ59rnnJDg4WEaOHGEEkTvwpnXatKdNPnyQhoWFlT387Pnxwb0Fjhv4RtFixwEqtU18e8nffNjyNx+2d915p/Tq1dMIgZ9+8qkxbzz77LNMvB07dqCNz8h1115rzPn4ZvTjjz+FGchjqN8zQg9NLE/D0SPA8+Z4+2sNFh1aS54zf/8A+RYDudmYs/HA/fdLKwyIkpKSzMTvd999zwgXPEc87y+++KIUQ3h44vFHTZ/asGGDPIX+UxeLLg8dOgR9sUgOpqXLQ/95WEaPGinnnXeuUJhZv249nC+8gXlOzZ0axQW8/4BQfgUGlu2wnkMaNFZv/+8deezxJ+TZZ/5ryuQA9733P5D2GPg+MOUBlBUi8+cvkP/+9xl56803jBDFTPnG++FHHpUzzzxDzpgwwdSTA9SnEe+1V182fdteeFBQIF5izMe19L48+OAU0x5L0LLH098nLgH2Sb64WbZsuVx11RV8k2P63eeffykX4yUTj3PQzn5ORztPPDFVrrziChk+fJi5Hj766GN57rkX5Lln/2ueC2vWrDEvjG65+WYj0FOj/+qrr8trr78BE+wHjbbyiy+/xEuEnyEQ3GOuFWo7pz75lOlv/7r+OnPv2oqXB59+/rmZr0qBjdqdDz/6SP7+e50RdEj0rbfeMi+FmC/rt2LFCvkZ9/pBgwaaezTrTq1Ti+bNzX2T10Ed3GfZzzdh7t4dd9xm5iPxnjsVL+UoTF177T+Npolt5n2WL8gsBq5n0WJnvTzjPYIv5ejQiE4f7oFJH68RXu/cR0GNVg9RUY75t6zzjz/+JM2bR5uXCry/aFACSqDmCBzSOx9BGQV4o+8a2jbqLeGBjVx3V2o7MKilRNaPkgDE9g+MkIjI/lI37Wv5cNl0Sa/bX67pd51s3DlHqC9Kiv9BFiQlmniRTQZLFNY++n3339Kn72MQjERmLbpdXlzypfhGjpELYvqb8kOD28qgzl1kw8pp8v32HdKs5bUyMRSHQm+XKUPOgR3Jl/L6zy/KTp9ecvGodyRs74eyIDaRpcnPa7+yCUbMboOkFoRKt1ZDuCFdmneDMNBWukTS3G+MdGtQX9JSl0m90JbSPJSmhv3l/0ZNluaFq+XrRS/Kdv92Egn6ZqpnOeVHM+MTNCyLnSHbDqxyqx3XPsrJyTVrH/FhYX+b6BbZZQcfAHz40GPQPXffZSaxcx8nq06GNmT6998b8wM+aBhKMKifBO3MOedMNMIBhRI+qIqLiyAAd5YRw4ebB2wDaLI4IKRpxygMIqmNYR5j8IaQc0NWQ0PFcih0UMPDh1NMuw5mm84hHnjgPrwp7epRMKIwt+avtUYgvO3WW40wx7wGDOgvV155pXz11ddmQEGzqubRUUb7xLf0nKDPN+msr6fAlw5WO63jllDEbWoS6NyCbe6HN6ksMxzC1g03TJYJE043D22m/+abb02bz8AglqYnoaGhiPMvPISLzRtKvnXVcHQIkHdRUaE88+zzcuedd8vd99xr/iiUz5kz15jb8Zr49rvvTP/u3LmTOW8tW7Y023OgAaWgxD61ceNGoxG6+647zaCM/YHz+i679FL5EgNGClDsU/Pmzzd97rrrrjMCSQCEryF4WUDtUQHeaNsD+9rQIaeZt9s+6C+cfH7H7bcJzfY4UGUfYqBW8dp/XiO8bljGGWdMMHE3oE6Mw370E14+tEQf5suHunXrShj6Fd/m//vfD5gXZnaBm3n8Du3CW2//zxzn9ayCkf3MnBy/ee4piOTBHKwX5s/kQlDq16+f0Rxu2bIV593Rf9h/v/rqK9Nfzz13krnP0ZqAWkVqKXmdsC9SqJqI+zfvyexTvC/fd989uFdfbo5zPs7MmT+aPmpdK61atTIalXnz5peZz8XFxZm0PaD14T2SZfFeTKGM/YyCBO/9Q08bInxpx3accsopcv999zrdg7mf6a1QAisF9t0JEP55jfIYnxf3QrvDa5Uvq6z4nu7XVj7WN9ttvUxm+xs2bGCc8pAXX2TweuTzkm1s07qNLIH1AuOzjKSkA7IdAtgIaLqq8ky1ytZvJaAEqkbAWe1TtbQw2zh0I6liUs/Rix0PczOrwhdVS58Fzc7zJm7IvvEyCQ/+9JRvZV8xzOqSZsjOnFSJZrysefLAb/eZeNEyXb6PnSO/JG2QwOCmDs2M9QIX8yMT198nn8diQdNYaAJi3pA2TfrLwAbnSGDBGnlm+TQjAG1e1ExeGHOudA1YLn8mpciE5jCr2/u7hNcbJ+2C65lysjKXyopY3Kx6QBiE4NM+zE9YTKvGA0RyBkmExMnypFSJal+I/fkSHv1PaeeTKV9D+7UIERf9clBaTXrI5DWwcznlB8ODzgmqPTIVL+cjNS3VDBL5kKIAwAE5HwyHC3w47YR5HPsV32rzD0/J0gdQiRk4HjhwwDyomFcwNDWRjRqWvqU/NBDErCUJg0kfB2h8CHEgSSGiaZOm5sFoPVyKcJzmdszTMbAtwsCxp3z/w/fyyScfmwFAI+RPJxNWGtc2sM7bYEpHEzWWwTerDHwgd+rYQciCmqwm5sHnqA/rxfxYtyMN1Bq0b9/BvK18BSZQFPQaNmxozEj4MGX+bPdmDFrOPHMCtAnrygakfBjXr1df1q79G6Yg41EF95ccR1qv2pyO55PmjRdecL60gVmP1WcoxJuBD75p3kNzuby8fFm/fr2jD+DaKMS54kCO8zmio6OhOdwmIXVDzDwiS5CgQMNBJONkZmRh4BYk2/GShwNHHx+Hu27yZ3z22UTM4bAHP9wr60fUN5pXKx5NRdu1aycbNmw0g1mmpUkm+zHngLCeNMVkn8rEvAjrOnGU29nU3y4ItUdeVn1ZBjVlS/78U/4D7daTU58wk9I510LDyUeAA3VqEQcMHGAEcWo/+KKne/duMI/7zXzXqYOnHfbv2hUrp+Pewr7A64LXAvtQu5i2+F1s7lvUyl9wwXkmPuMwLoWRNm1aGzgpKakQ3B2mbOtwrSAj0//Yf4oQly+y2FfZ/19/40158823YFY9xNwHeS9kX2Xf5DOoZ4+eOP628R4XHRVlrkeWZV2jpkC3D4dwRA+svJcysG3U5tAigO66KeAcaWDdrGvH4sO8WO9Ro0fKTzCjpjaY3Gna17BBBNi0cbq+jrRsTacElEDFBKolHHGQ5Rp2HFgt6XkVzxpyTeNpmzkX5R16uB8qCa6iTYK65tPEy4wryyIjP0AG9P9IJgaW7ZJtpT+ZDs/60pAlubAmCoKg4u+DgbV/L5kyaaV1EN+YNIxPkw1kQH536/6oTIwsRZb0sdy28g8p6nEONFVwb+27Q+ZsFJkQPUQGFsE2MH2pbEaaKPwxBPqHwNB5m2y2BDVZI8ksH8cqKt8kPgE/BrQ8S9rBAYdrmDVrljGD41vARtBs1K9P87pAM6hzjeu6zYdnVla2mXj7CczDnB5ckCO6QOvn2udohuApuAoefOA4gnN8mk5YcfkA5NvHe+CO+ZtvvzV27H6w9e7fv59cfdVVpmwrrlUmt1PxhjMYg0x74H6+UacWjQ9zlu+a1h6/qr/5UOWD+dFHHpZPPv1MHofZIQfIrVu3lhuhPaLNPh/kKSnJmCPwq6xetcZoi1gOhUdqFVrhbaj1cK5q+RrfMwGe544QijtDc2kJCex5FMR5/jlvgeZDn8EMiI4P7L2xM95KU5hgHllZGbJj+0758MOPMc/ikOBPQasHBnp1oDlk/pzv07x5tNt5LK+vue7nNUfnETQfYrkciC3EnIevv/7GDCo514GX2K5du8wxxmG/Ss84aF56uOZntZl0KCjSJJbmVDExMfLnn0uNAOaZnO49kQkY4RhaTwq66AIQyrdLMYQcH/TDuLh4I/hcfc3VxvSZ/YPCtescTfYVvtRhXiYO5iF5isP7PvshHSyYa+Wzzxz3TwsQ8mF/ooBShPyo3X8UHiIdc5N+M/l36tRR/oU5nfXwwor39Wuuuco8izif1KrbRRddKMOHObRLVtaevu19nL998ZKB9Us/mI56HeUXxKgAryFaHnyMdcp43fF+8gtMAIehrizX6bnoqcK6TwkogWoTqJZw5IcHuWtYnTDPdVcNbVuzdZB92f2pi1wy+EJpkDxd/rsMa+rkh8u1E7+V0LKZPc5VsRrv7wsRJes3eWLuY5IXEA7HC42lV1QviS8TpBzpfllyoax0WA5IXtFujHi6yNaCi2RIt+Himz5X5mLXqM4TZHxwqMRv+c25MG75NBS+Z3LMW2oloag3hz2VLZ9ZnAihbkB9mdjtNreq8E3gjBkz8NDEXAhofWgixAcc3y7yjffhAgfqnLfTGQ822oaXPZTwQOJAi2YbnGxbkw8H1mHw4FMwiBtoHqI7MLjjfKWQ4BA8YK82GiF7OzhY5Fv67du223ebhzk9HHHgyb+ytjjF8rzBwYMnoYVl2QPj8K0/51BxsJGI+XRvYQL/8y+8iHkqjxktGd+gXnnF5eZha739ZB4UMvkQpmZAw9ElQK7Wnz1n01dg1hMZ2UimPHC/08CQx3hOqHHkuawbEmpMRR977GFsO95aOwZm8MIFoYrx2E9oSslrjGaW9uDaV6xjrvvZhzhYtExNaX70/PMvyO0wtxvQv78pg+Xe/8AU0yb+Zj3Dw+uVzbGw8ua36+CN5d0GxyKRENYnT75RunbtKmPGjHa7jux56O8TjwD7HDWdNFm+4/bbjYCErmD6B+8rzz33POb4/C0DB8ByAoFafXpmc+1v7B/sc3weULhxjcP4LIv9LDQs1Fwr//73FBOf+xgYx7pW+JKH2+xXjz76CF5E5WGuTgIclLxqNEn3wQSO1yK1R5dddqlcfNE/5CBeTixe/IdZoLg5tLS8h5YXeMd1bQNNZ+kkqF69cI/36fLyqux+8mmM+bsdYBmwZMlSowmLT4iXm266sUyDVdm8NJ4SUAJHRsD5iVqFPDhY5U3MHjiP4a89C+y7auQ3XhZJvfr9PObthxalY65PQj5M7qJvlc7Y9guoeA7Uln2Qaur2lQGQXNLzd0uvLo/Jxb3PkybU8hhCftKATYVAxOP8y+MxzDtavS9TwjE4Ttm/BOZ0SySxOFQi/DNlbdzvjFAWkqBRw1KQclaniWZfmw5wzIBfFI4qLL8shxPnx8Tut7t5qmPtPvyQHtEcA7kjqS2FnpiYtsacLhGTUfkAZPDDdwrM036B6Ybrg+pIyikvDfPm/Ius0oc6NV79MUCcNOkc+RtmaRyMugbWuUOH9rIPXsAsN6+Mx7SbN2+R+ph7RuGQD7zKBA4AmJZtP3DgkBtxempi/pamgXWl8MX68jevxXbwHHU5BgAUUjno4ACEE5SXYg6XxZJ14O+FCxfBG9l+j22qTD01TtUJsA84hBAf8+bdemHA/kJhZ+68eWYgxwFoh04dzKR2mhXZ53LQXTcHdjzf1BTSsQLnAhVjfoRjn8OlfDI0Qa59jgNJu2t69gP2k63btkmXrl3MgJSLWfJt/ikDB5Xlx5bSxMkXLydYV/7FtI2R9XAQwd/2cjnh3Brwsh3UatEDGc0Kb7nlZnnppZeNZpiDZA0nDwGe59mYN8f5bMOGDZWBAweaF0gDYWI3cuQI6d2nt/wCDTUD+3XrVq0hTG0wwrK9j2yGoxn2dZpa08x5A8w5eb+z4tDkjvdN3lcb4cUOBShu268VauLnY64d4/DeRzfYvDdSkKGmk/OCroTDCHpTpGDEeyrvdYyPBOZlFudCtW7d2jjaYf/1GBA3B2VRe8XyWUfWlS8Q+EKB80b5IrCiwLxZx8MF6xqy4vHa5UuEpcuWyqLFi6Hlb1XmgdSKo99KQAnUHAH30V4ly7IPtqwk2zFBPzMvxdo8su/SMaTrEPvQ9gZZFp8kEW1uNWsEHdrP4jbI8p1xEtlhKtZLWil39+sgO1MypXnXJ2Us5u8cMk5xVI3bhdAqJWy/SebtK5Qxw+abdBe3CZMVy+4QuhvIy6WJYEe54cwPPa6/tDEOXuiQy7bEv/H9u2xIhj19wUZZXTpXqKx+mc/L+xs3S/POD5kybu0cg/hIWVxx+SbSCfTRrhGEyJZnutXojz/+wINuAx5QeKsHTz6c+EpPc/TIVt5AyHpwWZnx4cUHDhdJferpp82EdMf6EnHy1FNPy8qVq5zyck1v5cMHi3kQWjtKvz3F58PYGkSynnSgcN9995vBK8veDbOGX3/9zcw/suLZs+VbU7p/5SRavnHnOhp8k8+V1emZ6yK4i+UD1XrryXp5yseeJx/EHHy8+eZbZp0ZTuJfvmKlMWnhgJiB198K7Lvxpv8Dl5WmTM6d+mn2HOOemSZ9LOf8884z8wG++w5OTfCQZ92+//4HeIR63QwcKvPgttdNf1dMwFMfs1KwD3BQeAHmJD2LN+1/wZEH+xgHbi+/8goW1JxvBA2aHtHErlPnTsY7XVxcvInHwd7jT0w1ngw5UKNGaTQGUCnJKcbD4wFMEOc5pvBE9+2MYw+cO7QY1+lqOF9gP2BffeaZ54wJJifYc2FvenxMSzuIAdkis6YKze3oujkNQvh+zJfiIJRtPP30cWZtmg/gLZFxmN8PM2bKlCkPmoEjy2Z7GZd9ntowDqo5+f7xx6eWmZra66e/T0wCPJcUqum0Y9jQ04xww/se/3heKeyMGzdW+Azgyxqec/ZxvpShQxj2Gf59CvPfJ3DumY73HZq1fQcX2XQqwn7LtLwv0VMb7118hkw8+2xowl/AtfJX2bXy0suvGJfWrBfvlb/ipdktt94ma+GdjvdKXk8z0RcpJPE4hakH0C/fhxfGJNwjec3RPHDv3n1Ga8T5Swyu92beaSkE0ZkKzUOZt/EYCe9yXKLBvPRCH7fSWvd4brNuNKmmswjyYXut68EkKP3gfjLk2ku8f1uBDHv27G7S0lvqiBHDKyVkWen1WwkogeoRqIMbgvUyuiwnXrB82CUm7pEoTHi0X/RWpNDQcNgbO79x+WrNk7J459dWlBr9Dg9ohflD0OB4KCUweKi0DsiRXQeXm+ORwa0kPcdzXHvy8NCh0sw3RxKRLt1+wLcVnC6kS3oR/eRVL5i6QVDblfK7W93LLb96RR611L4+/nLPyM+lSVhrpzz5sOEaQuwz1HDQ3ICmClwRnK6KXR0ysH/xgXX/Aw/Aq9BtmGTaukyY4TE+pDjX4g9466mLSem5eMj0698X68BcWSYc8YHz4EMPya233GIEKqZhoCDCNSm4jgvXCWI8Pqj44H1q2n/lzlKXrHz4Uhii2+KQ4CC55JJL8NDGXIr0DHn33fdlxcoVxpyBA9CuXTtjzYzrjEDi6Vpg/mRAYWbjps2mDtSgnX/+eTIWg1cOdhkY70W8Oe8Oz3djxowp10SC8ciSA2i6iK0H5wltWvPNYTNjqngXPJixXXyAUuihRyc6oGC6iIgGcsvNNxnBlEy43s2atX/L22+9jXkveNOKf4FwGUt7/E4dO5o8TOX0o1oE2G95Tu6/f4pZp4UeD60+6ZoxzxM9L/744yyjpWE6av3+df315mUC+ybjcGBGV9t0SUxzU14HwzFIuugfF5os2RfZh3fs2GlMKbOyMo35UHesQRPZOFL2wsyS2hoORtlXaB5Kj3ccGFIwYp/lywheJ3SeYl0T8xcswDyhT8zglALVyJEjYeYTibr8D336fDn7rDNNXHrPevXV18ygkfVl37r++mvh1KS3qR897nE+3L/hEpzCvHXd/+c/jxghiRP2WTcNJzYB9jEKJ1yXh6Zr1HLY74P283rppRdLnz59zHFq23lPpLMRzg2ladtNN95gtNm8NpjvYmhFPsC9nvPv6GqeZsC3YC2kKDhNYH9k3t9Nny6zfvzJXCu5eblwRNPerBHH5wrrwXSff/aFzF/wMxzNwGMpcDZr2syYoXHOK/NgX+QSERTSIupHQCOUA8cpF5h+yGuDrrmnPf1f4Zp248aNM/2SZuHPPPucnDtpkpmDxwVYKcRRyLfWJOOZY/ppeJnH5STYdm5Te0q39syDSy107NjB1OF/77xrTJ5ZJ4vb88+/iLXMtsggvBDjfdliS15cP4n396+/+sJo0axjJ3aP0dopgZOHAK9DXq8ZmdlmLqN1jR2RcESTulAs+GcPxSVF8tCscZIJczYN3klgfKfrZXznf7k17r333sXCjr8bL3NBEDS4VgTd9fKBwLdrfAh6CuyUVke0H+d+puHgjQ8XDtw4r4cDKXv8itIzP3tcbnuKz30MVlwO8vjwp5OFVLwRZ7lsAx94VhyTwOXDSseHLwUseq/jW0vXwZ+nOrhkZTaZH//4FpR5NG3a1GxzwGDVg3lx0ElO+xCPc5tovsTjjGcFsuQ28+K3lRfbpOHoEqjM+WUcnhO+IOA5oZaPg0IOGO3nzepTHJBRO8M49Ijoeh2wvzJY55emewzsB1Zf4TbLZZ4sh+Z5IVgviU49WKa9XJom0TEK86Pml3GQlUnH/JgPg1Uu33hTwGuKcmkCa+9XrjwcdYBDkIJCUxeTkX6c8AR43nm+7f3EXmmeV/6xb/GbwfW+w37JPOz9g/cv9mfev3iMXj0ZmI8VGIfXCj09hoa6Xyssj3EycN9NOpCE68kxV8ner1kXtoEmx1z3juXQZM9+f2Y+9uuF5XMf68XBU1LSAXMtcJ4fTVTtcV3TcpvXGtvK31aoKJ5VnhWXwtEb8MKXjhdld915h9EwWcf0WwkogaNDgNfkUROOAoOC8XacftYOhS1Jy+S1RTcc2qG/vIpAJNZrunfkF3jD5+xYYSveeE2dOtW8NeagqiEmXtMkqFv3btA6NjNvC+0Ph6pAYTo+YPiQsz+IqpLHkcY90rKZjn/lDSKqWh+2n6Gi/Ky6klFF8SqTV1Xrp/GPnEBlz5sV73DXQVXOLwd8FfUXq8yK4lgtZ7mMbx/QWsf0WwlUpl8eLk5l+mNl4lh99XDXkutZs/KuajrXfCq7zRdrdPzwr8k3wWrhWjhH6QcNmWpZK8tP4ymByhLgte1JOPL8Sv8wufItjWtYEz/PdZduexGBC3thcUcXwYhvxd5//33TSj506M6aGpMWmLfQsEFDY17GjnekgQOz4zXgOtKymY5/RytUJOxYZVS2rpXJy8pTv2ueQGXPW2XjVeX8Hu66qmyZpFSVcmueqpZwohGoTP84XJzK9MfKxDlcOeWxq0ze5aWt6n6Or36A19fZmD/aAGsb9ezZw21B56rmqfGVgBKoGoEqC0ecZ0SzOnugSd1fe36279LfXkSgf4szpH1kf7cW/fTTT2buAhdtpROGhjA/40riNK/hXCHrbaBbQt2hBJSAElACSkAJuBGgAMc5u5MmhcARUI8KzRndEusOJaAEjgqBKgtHXKTQNWxLWilZ+Wmuu3XbCwiE+IcLXXe7Bs5HmDHjB7Oba6zQDrsZJtFy3Qh6GaKNtwYloASUgBJQAkqg8gT+v73zgI+q2ML4IQnpCalAKIEQpAQBsVEVUewFULCBigUVEGxUEWmigA0QEfWJEIpIU7CDCNilqEBAULpABEJNCJhQ3vlmuXGzdzcJEkKyfPN+m92dnTvlfxfffHvOnAOrLoLl1Emqbc7m/VdrV8FHZEsSIAFXArljvbp+6ua9O5e6wkr8Ghv/roxslSyxOm6LZstlZHP7ptx5SrHxyTntnev5uvAIQBiFBkTaOpw0KdkcZoXVKFAPtsZoNKsq6k6H8N04SHo67nS2wVhBAiRAAiRAAucIAbisI0E3hdE5csO5zGJH4JR+3vfkUreysFzqNFS0I+mqSMqa4ZIpKfkDO2V5l3+XbOEgkBjdQHMa3WzD8ZOGAk7RMK0I3YsgDIjoFq8hgePiKpjIWzjszUICJEACJEACJEACJEACJY3AKYkjdy51f+5eWngudf9GH9Zw0O3kMp9A+VlzynZoMUiOas6OpNpNNN+QSOrWcTJ8+TsurK+Vh655TuIz5srQHz6W65q8Ki3KwQaF9uNl5PI3bHmFXDrgWycCvqX8pN0F/WwWoMzMQ5rvYqppiTNFCEMcp2GmK2n47sjICBO+2qkbviQBEiABEiABEiABEiCBEkPglOwu7lzqftv+1RlZbBkNHV0pNNr0HRpUTRrVTpI1y4fLnA0bJS7+IWkVenLY49kqepLkoRtekPP9N8h7PwyXmMRBKoxE5ix+VN5cMl/Kxj8gnasmnZF5emunV9XoKOXDE2zLmzFjhkmEB3c6JBON0dDdSCSJKHXIG0F3OhsyVpAACZAACZAACZAACZQQAgW2HLlzqTt2/OgZjFJ3VI5JlgOjetulru4j07YuFdm6SeonjpOEcpfIDwj771NRHrjqPanqs1pGfXKvbNKquiFh+re0BKt317rtfWTY4h8l9HCqoy/+zZdATEglubrmA7Z269evl0WLFhl3Oj8/X5OQsqIGYKhYqaJJFkl3OhsyVpAACZAACZAACZAACZQgAgW2HHlyqcvMOnDGlwsFp2cTT5ZDcgTudyaBNtRRrFQN1xa+4RJ58qjLqrXjZe2hQLm62TgZ2Wa5dKt7vUTKPqsDPudDoJ3mNCrtG5CrFSLoTJw4wdRZOY3Kly8n8VXiCyWnUa7B+IYESIAESIAESIAESIAEzgKB0xJHhRWl7lTX/a+5S01K8pe8++kzss2nsrRv7IhuFx50QL789iZ54tNHJfnXz+SfiEvkjgZdT3WYc7L9RZWul5plG9rW/sUXX8i2bdscQRg0p1FUZKQ5Z4ScRsHBQcxpZCPGChIgARIgARIgARIggZJGoEDiCO5Srgk94VK3asfCwl1vgWbjMuTxg/J31pcy8dffxDe2g3SIjZSL6r4gj7cYLOFZS+WXzf0l5aDIv4LK5Xq+zSEQVDpMWtd7Kue99SItbbfMnTvHvIU7XVhoqFRQd7rKGoQBOY3cnUWzruUzCZAACZAACZAACZAACZQUAgXSDH5uEr/+sXuJZGar6ijMAne5kxHr4DBnlaP6wnmieC9yyPy1/uze3EN+SvxKGl3ysnz3/XQ5eOXtMlhd6hxlt3z2tSPCmtWez3YCt5z/uIQFRNk+SE5OlqysLHEEYQiU2LJlNXR3JeY0spFiBQmQAAmQAAmQAAmQQEkmUErPkpxwXQAijqWnp0tq6g6pEFdeQkLDbZaj938ZJD9vmet6aTF6X0USompJqByWLXu/kUKWccVonYUzlYSo+tL98ndt0eaWLFkib7451rjT+as7HYRRnaQkqVOnjuDMUUBA7rNJhTMb9kICJEACJEACJEACJEACZ44A9E5mZqakZ2RKYmKinDjhkETOBhm3ozui1OX2dzum4bNXFrZLndvRT6dyi2zau+V0OjhnrvXRnEa3N3CX0yhTpk6dYjjArTI4OETFchxzGp0z3wwulARIgARIgARIgATOLQK5VY+btZf2Q9CD3GXdriVyODs9dyXflVgCV553r8SFJ9rmP2vWTDlw4MBJdzrkNIo2wgg5jYKDg21WJlsHrCABEiABEiABEiABEiCBEkQgX3Hk7rzRb9vnl6Alcqp5EYgOrijX1HrQ1mTDhg2ycOHCXDmNKmkAhkqa0yg8PFyY08iGjBUkQAIkQAIkQAIkQAIlnECe4igoyB6iGS51q1ILOUpdCYdYkqff9oI+4u8bmGsJVk4j+F7CnS5QvwewFlXSIAzR0THmnBH8NFlIgARIgARIgARIgARIwJsI5CmOwsLCbGtdt+tndanLsNWzouQRaFDxGqldrolt4vPmzZO//vorJ6dRdFSUVK5cWeLKl2dOIxstVpAACZAACZAACZAACXgLgTzFUWioXRydrcSv3gK8uKwjqHSotKn3tG06aWlp8tFHH5p6X18fR06jChVMTqOIiAjmNLIRYwUJkAAJkAAJkAAJkIC3EPAojnCmxDW551F1qUtJXeQtaz+n13FTne4SHhhjYzB58qScnEZwp0PobliNYmNjJTAwkEEYbMRYQQIkQAIkQAIkQAIk4C0EPIojV2GEBa/b+SNd6rzgzleNqitNqt5qW8myZUtlxYoVDne60n4CS1FlDcIQp+G7Q0NDGYTBRowVJEACJEACJEACJEAC3kTAozjy87OnQKJLXcm/9T6lfOX2C+w5jQ4fPixTpuTOaYQzRohQFxUVabMilnwSXAEJkAAJkAAJkAAJkAAJ5CZgV0AnP0eUMtfi61Na6le4yrWa74sJgX2H/5at+1bnOZsW1TtIhTLn2drMmjVL9u/fnyunEdzprJxG7r4Ptk5YQQIkQAIkQAIkQAIkQAIlmIBHceRuTXdd+Jy7atYVEwLLtn4mk5f39zibqOA4ubZWJ9vnmzZtkq+/XpArp1FFzWfEnEY2VKwgARIgARIgARIgARLwYgJ285AXL/ZcX1rb+n3F3y8oF4bjx4/LhAnviWtOI1iNoqKjmdMoFy2+IQESIAESIAESIAES8GYCHsURNsss3kPggootJal8U9uC5s+fL1u3bnWb0ygkONgkgbVdxAoSIAESIAESIAESIAES8EICHsXRoUOHvHC55+aSAvxCNKdRD9vi9+zZIx9+ONvUI6dRaEiIVNCcRpUqVpQyZcowCIONGCtIgARIgARIgARIgAS8mYDHM0dZWVmyZctmDd/sJwcOHJAjR44IXLBYigeBaHV5q1atWoEmc3Odx6RMYKyt7ZQpk+Wff/4xQRhccxoFaY6jUqVK2a5hBQmQAAmQAAmQAAmQAAl4KwGP4gjRyXbt2iWZakFauXKlbNq0WTIy0lUg0d2uOHwZGjVqVCBxFB9ZR5oktLVN+Zdflsuvv/6aE4TBOadRWFhYkeQ0QqJhfM/gwgnhfSriG9fhepRjx455vNZqhzHQzpO7qPNcPLWDWEQ7POfXnw34yYqCjIOmBW3nmJOP+Xfpys+ar4jrv9l/5+9pnla9xQ/v8+JstS/qZ6zR399fjh49auZX0PEDAgJO+ZqC9s12JEACJEACJEACJZdAnuIoMDBQwsNC5eDBqpKVnS1paWlyVJ9Zzj6BkJDgfCeBnEZ3NHjWWIacG8MKOHnyZFOFzW9ISKggp5EJwlAEOY2w8UfZuXOn7NbvVIB/gCaaLW9c+bL1++VJwJiL9A82w3AJ3L59uxERyMUUHh4uuNa5IJHxnj17JTV1hwQGBun6KhlXQWzyrWIJiF27d5v5hKswrKhuheDiLDaQ9wvc1q/fIIcPZ5rxqlSpYsZ37s/q1/UZ45TWxLqpqX/rOLtMoIsqVeJ1XoFmk261z5mP/jCBduFlwo2bo+t80B7rgyjYtm27BOv5MLhCWuzQD3JX7d23z1HnpI/0IzNuVFSUNaztGddjzfg3//fff5vP4+Mr6xgRAqtycSiY44GDB+WtcW/LTTfdKHXrnp+Lpbs54hp8T0a89LJc1qyZXH75ZbbvjXUd2oJxQb6T1jV8JgESIAESIAESKNkEPIojLAsbg8jICElISDCvsSHNPpr/5rVkIykZs6+gG/j8SvPEu6VimRq2ZrNnz5Z9umn2KeUjAYEBEhMTbZK9FkVOI2y4U1NT5c0335LNW7aoCBG1XjmsR9ffcJ20ve22HMuMbeJage/kZ599LmPeGCv/qFg5dvyYREfHSN8+veSiiy7K2eii3bx582XU6Nd1w5ytVoXjUqtWTen/7LMSGxuTY2WA6Jj2wXSZMGGiGQ79Nbz0UunTu5cRHBBIfn6+sm7dHzL0hRdkx45UMwe4I9avX0+e6dtXx4/KJaTczRvjJCdPluRJDlEKgVGtWoLOp5/59wWRg4IN+dSp7+e0O65CrnGTxtKrZw+BqyPmg76wvt9//13eHPeW/PTTz9L+7rvkiSceNwIO/UBALlq0WIY8/7yEhYVrv6h19J+RccgIiRHDhxlxZwkqRwtHG9SNf2+CfKBsjisTzC9c++nevZtcddWVOZyta87GM1jhO7AyZZVhhPfuCuqtpNZYB9YGNvGV4w1LT9dkZGTIggVfS8uWV+kPCCE5wtNde9aRAAmQAAmQAAl4B4E8xRE2FXA/wWYyODhIf4munLOp9I7ll9xVRERE5jn5iKDycl3tR2xtNm/eLF99Nd+40yEIg7GUVHLkNDrT7nTYoP61bZv07NFLGjZqKF27dlErTQXd0P8jq1atNEJmy+Yt0qtXLyNoXCcPQfCLugL2HzBAOt53n7Rp3cqIgeEjXpbnBgySKZOTVQjAJdBH1q5dK4MGD5G777pTbr21jRGDAwcNlheHDZdXXn7JiBD0991338urr70mTz/5pLRocYX89ddf8ky//vLG2DdV+PQxVpKjR4/J80NfMHMaN/YNiVTr2ibl2EPXMW7cOBkw4Lk8rSn+/g5B9+prI1XE9ZbLLrtMLVpp8mz/ATqfETLm9VFGpGA+ixcZBD4SAAAX30lEQVR/IyNHva6MnpLmzS/Xc39bzHzGvfW2EUiwYqSnpxvhMmfuXGnWtKkRtzgX6CwO8Bqb+6CgYBkyZJAEBgTK8ROOM4P9+j1rhBb+bbta28Ac8xg//j0Zqwx69HhamjRuZEQZRNtTT/eUd94eJ5deeknOtbAEWtZAiDdL6Fn3D/3BuoY5We3QxrLMQeyh3nUuqMM1aItnfH/wGu3xQPuyZcvKVD07B8HjfD0+R3tcByELAYn1X6wCGgXiEf0b0aTX4n/Z2Q7hhM8xZwSlGTlqtDRt2kR/JIo0/eAzFhIgARIgARIgAe8lkKc4wrKxyYDrDzYTERG6hdCNBMvZJ+CvG9u8Srv6vSXATU6jiRMnmHvo6+MrQeqKVa58OeNOFx0Tc8ZzGmEzPHbsOGmim80+vXvqhnWJvP3OOxKjwSXatWsro0eNlEce7SzffPONXHHF5So4crvJ4bsHS8pdd94pjzzcyWxgsYnt9NAD8lCnR2SzCqsLLqhvNsSwLlWJj5dHH33EbILj9XWPHj3kySefko0bN0j16tXN5nz27A+laZMmcs89HYzAgWtht8e6ysiRo+TB+ztKrG6+d6vLHRLlPvXUE3K+um5lZmZKhThNqHvNNfLbit+MQMNG29O/DVit8HmXzo/KnXfeYTb4VatWMQLv+aFDjetanPYHATFLrXrNm18m7dvfbTbjmHfXLp2NWIMghJUPFtz169fLC0Ofl2ZNmkqHe+8zm3vX7wPYQDwk1aolCLjhp3NYsWqVusntlH7P9HVtbt7j3zvc6Capheuxx7rIfffeo+s7rEx9dP1Pmv8WoF9rrXi9Y8cOFbcpZl3nn19H4G5oCRW0W6MWrrKxscbNb4WeX4QFqkGDCyQ0NNTcT6wH7pXn6T2BmEGx5gEhmJiYaBhv1HuANnv37jUMzjvvPNN+vQphRFmEayXGg+BBn8uX/2Isi4czD8vE5EmCuV3YoEHOGLAIrl27TnD+Lk6vv/iiC/Xa0mZ8rGnhwkXmO/HbihWyf/9+c8bPmp9pxD8kQAIkQAIkQAJeRyBfcYQVY0OAzR1L8SHgp1EEPZV6FVpInbjLbR8vWPCVCojNjiAMev4lSi0glfW8Ds4bIafRmbzHOG+zevUa+eOPP9QC8rTZuPbu01euv/46I2rwC/3wYS9K61atZdq0aeYsiOsCYDVooJvbiy++2GzEsQG3vpt4tjauaAcLU716dY3gw9kbCI/qusmGtWTNmt+lZs2axjKQsjpFOrRvb4QSrkOpXbuWZOo1W9SKVLZcWd10hxlOGzZsNJ/jh4J/1C0O1qPqidVNn5YYMA1c/mDsli1bmvnBioGCOmzOS6kYQcHcIbrA6MEH7zfzQRucc0pKqm3muk2tbhBHEB8QkhABWdlZORYY09HJPxinsVp8aqkwwhjmnJDOe/r0Gcadr379+oah8zV4DbGzKiVFDmUekpZXtTSCBvPQGZvxIJAs6xDafv31Qhkx4iUJCQ1RQeNrLHSPqUWwVatbzBpxbR+9z3Xq1DFRL/fu3WfOikHwjBj+op41i9MzU9ukW/cnJHnie8bFENeAx9AXXlThHCMvvjhU/vzzT+ncuas8cP/9MmfOHCOCJkwYr/MqpYK6iwwZPNC4+yFgzLp16wTWsVI6n2g9VwVBhnv8xBPdDU+wAPtVKhS/XrjQzHnjxk1y3bXXSv/+/YxVDRY8WOvw3Xn55VfVhbK+PK8WOGdhCF4sJEACJEACJEAC3kXA8w7bu9Z5zqwmwC9Ybq3Xy7ZenDHCWSMUuJ2F6a/2FeI0p5GKo6LIaYSQ8NiAQmjEqJUKblsIRY6zNHAJgzUAm+Lq1atp7qUPzYYV87Jcr6wF4b1zHTbRX3wxz1hyIBrQBx779u2XCHWFOnHSlQzXhOoGHsIGVgoIwYMH09U6k2Vcpqw+8YzzJaadWoyw+S5d2l/d6oYYa9KTTz1thNI6FXnly5WTxx/vZsbD/GDtwHWO6HClTL0lmjAnq2DOEC+ffvaZ1FXREKtWFVg8DmpwAYidSHWZtOaDegTMgBDanbbbiAbUwb5i9W316/yMNuAHdzCIPqx3+/Yd6lK5QJ7Us0lBQYEqFBxCzfk6rGHXrt36/QgzZ67Qj1Xw2hoT7WBdGaZuih3uaW/EB+o++eRTeeWVV43ArFGjhhkbXcDyMmTwIGPJ2rJlq1qluqnV8H/mzBWEE0Q65tZFrWQo2zTYBoQiXCDBAswwNtweB2s/EPawFO3ff8Cwwee4V7jf72i/5VTwj3l9tBGuc+d+LMOGD1f3ytZSXutR4EJ3SMXoSyOGq0U8Qr6cN0969+ojrdu0kosuvFDatr3NiNCnnu4hb781Ti1TcYahMw/TEf+QAAmQAAmQAAl4FQHHz9ZetaRzezE3JnWViKCyNgjIaQQrhCMIQ6BxF4MLGTbmRZXTCL/Cw3KDX9/3qBjChhOiAYICc8EmODg4xMwdv+47Nry2peRUYN4ffTRHps+YIV3VFQ7BQ6wNPMQH3Mico1hj844tNM6SoO8j/xxxCAe1IjgXWEBQDh3K1HaOT/x1zkHqXgp3tjVr1uhZoK0SpkLP9KmNsKbVWt+rdx/p07ef9OzZSyZMnGjGcV4HXmO9EAZLly5XkdD1pKASOYwAE3q+KbcF74S+d/wzdczHMaF/JYtjfu7+gqdlDYO4+vLLLw3/Fi2usLksWteD30EVq35q6fPxObl460OnZ6zhhx9/El/t99Y2bcwnGAuWQLhqzpv/lWHiuOSENGrYyAhY3JfExGpyl54F++H7H4wwhhi9+uqWxo0N1jP0/e033xoRDasZ+oXAwhrgfnnJJRcbUQ/2rgVtU9UtEMIsRH8AwPerZs0aRozC1c75Gpw/ss4SwbUS0fs2btxk2uB+BgT4m/sXqEFL8L1lIQESIAESIAES8H4C9t2F96/Za1dYMaKGNKt2u219yGe0fPlyFQY41O5rfimvpNHucE7jTAdhsCaDTTfCUmeq4DiiG2RYeRABDht4nCv5asECI2xgRYIiQSABXOOuQGBgw/rJp58a16vuGkHtxhuuN65juAaba4Q6N65k2hYF12DjfFw/tyxSocZCVFqy1HpkFUc7Peuk7SLU8oKzNjiD8/AjnY2la8b0DzTS3lj5YNpUcxYJAQqM6NSNOjb2yAeGoBJwudulobidC/rGBn+8RoF7Tx9D1BXsIj3nAosI5g1rHtwPzbxzLnTMG28xH/A61YJxwXj2hx/J9dddZwSxp36AC4IBc3KX08wSg7geVhxYXbAmvLfuV2xMrGzdujVnmhgfD8t6hvuACH/pGjDCcnm84ormKmpS5Q91n8PnEFcttA7nkqx+LX7gY/WVM8jJFxA0DS9tKD+qcEvB+aqdf8vHas1CABNYSa11oy9Ymqz3GAORG7P0u4mC99a4zq/Nh/xDAiRAAiRAAiTgtQToVudFtzYuvLptNfilfvLkSaYeG1vnnEbYBOMX8qIo2PDWqlnLuDJh43xrm9YaeOFbefChThpV7ZCeNakqV2vIZBx+R7ACWIEwd9eCTS3mPO2DGcZ964nHuxsrBPq3CtYJ1z3kLnJsgh3iCG5rEDLl1bKBzTU23sgPhIALlrXGR/u33Ntiy8aajX9KymqTc+iWW24xQ2BecNG75Zab1fLT3eQuQlhuWCKmvT/FmobZeFubeEtUjBnzhrw/7QNzjgbrhVsfCjbgEKqwhu3enZZj4cB1EIwQK5b7Xc4ABXwBsbhw0SKTx6lVq5tzrEnuLodYgOUnPT1DxUu6uQ+WgMBcEAEPVhQ8gnWulrBz7gt1iOjnXHCtVXBPjip/iCrUg1HVqlWlZo0asuCrr41LH6L0Pduvr22ulmCx+sr9fELbHzNntlasWCkPPNjJuPHpcDJwQH8j+py/J7mvdbyzvi/uPrPqrLVYXKx6PpMACZAACZAACZR8Av/uWEr+WrgCNwRwfgfneeBO56+/quMXe7iwIacRrCvWRs/NpYVahQ1wQkJVaa5JN0ePet1s9Me+Mca4ZOEA/5DBg2XlylWam2ie3N+xo1vLADaueCAnEcJMD9VzQA880NGsAeGysdlGwXOzZk1lyZKl5uwSoi1CBC1bttx8Xq9uXdM/NviNGjXS8NnfGmuN2fRr2+9/+FEP8kdLgm7YsZkGp2PHjpqocmgDcYaoZkjSWlrHhbXCsi5AGFgPSxhhzqh76eVXzDmjNzUc+E033qDXiLkWwgzXY54NGzbU+Sw245r56HjfffeD2eQjaay1IbfcviB80D/6KK3JdAP0ves9xdgzps804bcRpS8vgYCzOPXr1TPicubMWcYKhzEwNwgjiEGc4fFTBgj2AGGJIAv4HA9Yzzar1QyMLSGDOaft2a3z8zf94f6krFqt38FyRhDic6znGo3+t3TZUu1/rolQl5CQ4PZ7YG6i2z8ODggSkZiYIO+Nf1fPFA3TEO+TNMDH5afYl0OwYhis3/pugXWmJgG2XDPdToOVJEACJEACJEACJZYALUcl9tblP/GtW7fI/Pnz1HkIm0YfKaMH2CtWcuQ0wmF2y1qSf0+F0wKb8vvv7ygDBg7Wg/ePSfsOd5vQ2HBlQoS6mbNmyd2azLR27VourmWO8bGBhovUoMHP64H5WyVDrRsTJzqsYhAi8SoemjRubDbBiDw2a+Zs6avnf9AnXONGvz5Gbr75JuNOCMGAjW7b22410c6eGzBQbr7pRlmrrn4IFoGw23AZg5WonooFRMnr3/85jZj2qNnUI3ra62oFuumGG0zENUu0uCOFjfX//veuCRSAaGsIC448TChIOpuUlJQjJtq1bSudu3SVgQMHyQ3aN8JgJycnazS3x0wAAsuaBgGwa9cuI4R27typaxF5f+pU47KIHERVlQVCiIPZr7/9JkuWLpVRI1+zCSfX+WIdOHvTWUOgD3l+qDJO1/xPLQyHKVOmGjc1uAIe0fNjjTRXVZ06SRoZrp88/HAnIxiTJ00ywuqaa67OuYcQksuX/SJT339fBWeCLFu+zJwTQwJcWJ8Q+Q/fDQhanMWaMXOmdO/W3VinYOlDgdDCPbMEl/O8Ue/Mf4VaH7FeWA8hFPGoHF9Zzz01NNZCXOt6jWsdxoGgRgLhL7+c57hHGv0Q4/TTPFgQgSNfe9UIQndzcp4fX5MACZAACZAACZQcAr4DBuiu0KVg0wi//gx1qwkLC3X5lG+LAwFjKdAoap4KNnGjR482lhPkNArW8zUQRnBdqqDnjXAI3tXC4KmvwqrHJhLWkCuvbGHc6xBMYf78Bca9Dr/Ed+vWVcMxX5WzqXYdF2tet3ad7FShg+AEcMFDWG48VqxcoQEYHBYjbHwh/nBw/6efl2jo57myRiOfQfxg028VMIL1AvlvFqnb2dyPP1arxxa5p0P7XK56mDMSoUKEfKR9zdfzMAhJ3qZ1a5NHCQIkrw0y/j1hw47oaGnqMuc8b1jLkAMI+Zkwb0RTg+CA+Pn4k49lqwZ+6NjxPrnjjtvN59bcJ6pgQh6etcoD7oEQQmCACG+w6MDNz5FfyUcWLVxsRBLWhbnkVyA0a9euLTVq1pBvvv1WPv/8cw2+8KMJpDBw4ABj1YGYgehDuPANGzfKBx/MMAlsK1eqrOLhGWOhBBMwnqEWqJYacAFibvz4CbJ+wwYVUw9JK03ia1mx0Bb3DGG4//xzvfTu3UuFR4DhijnjfqMe350yZRz5jFAPZqvV7RHzQIAPdaCUg+kH1QqZYiIW7tAIfZvVRe9DPW+F80xXqtDDdQhXjlDviYnVzBwxzxRTV8/UYV6IGgj3P0Tgw/smTRqb+SxatNhcAwFoWZTyY8rPSYAESIAESIAEihcBax+RlZVtfhi2ZldKN0K2U+9ojAPcqak7NMJU+Tw3flZHfC5aAggvHXQyspu7kZHTaPLkybpV1Oho6vaFTXddFQHY9CIxKFyFzlbB98sICt2Q7tfzNBAf+JUeG1Rrs+xpbhB0nixeuN5yZcP1aIf2OEOEMeD2hc20q5CxNrhoh3kgMl22boad26EvPBBAAEIOG3kwxHwxbn7Fmou7dpizcx/WfA7ofEL0HiNIA+btXNAGHN0V1/7QDu0xV+c1ubvWuQ73COXAwQPme4Q1uzIGX/QNlzt8hjYYHw+MizFvv+NOade2nXTq9KBxw7Pc9JzvBfrBeav+/QeYSIYjX3sl15rRFxiiX9c1YHzUo4+NGzdJj5495Y0xYyQhoaqph8slzrd16dpNrYnTTWAG9If5unJ3rrO4gQHqrTVZc8C4rnNBWxYSIAESIAESIIHiTwD/Pw9PkPSMTPPDr/X/6XSrK/737pRniJwyM9U1CQXudIiCVlEj0yFaF1zFrE3vKXdcSBfgy2dFZMPcoM6t9/kN4bx5za8tNrF4wErmPKbrdZYgsyKjZbkIEbS3+sKGGAzz6s+1f+fr3X3mWmfNx7BRVq7CCO2tNq7XunuPubrrw11b5zrrmlDNs4RivXdug/uBewfxieLuPmKu4Jet7SCAXNtB1OA7C+vUosWL5Jm+fW3CD2vwtGarHv1kHMow+ZyWLFlixJQ11s96/gw/ECD8OvrCfFyL1Y9V744b6iDSUPCahQRIgARIgARIwLsIUBx51/00q5k6dUrunEbqtlXUOY0KihWhtc90wQa+IKUg7bAhLqpNcUHmU5B1nW6bgswjLybVEqqZSHGe2EFwwk1x2LARckXz5tK0aRO3Qiy/dUC8JalltEuXzjJFz1/N1mAkcLNzCORgGfBcfxMOHRHtTqfktdbT6ZfXkgAJkAAJkAAJnH0CdKs7+/fgP83Ak1sdzraM1IP3cKeDO1asutBhw1hHXeri9JdzuJaxkEBREkC4cj8/h1uip3GNZU5FLAI04PV/FSAwkcMyChfJtLQ0tTYhZHuIcSWFZcnVOuRpPqwnARIgARIgARLwbgJ0q/Oy+4sNZHY2Np2lc1yQEPVtkkYLQ8FGEEEYymvAAViNoiKjzuo5Iy/Dz+WcAgEEVkDJS/DAVQ0WpNMVLxgDrn1w30OiYfyH7wTOC+mjIBawU1gWm5IACZAACZAACXghAbrVldCbelxDQGdoVC6c1UhL0zxGerYIkb727NEEoidzGsVER0t8fLzJaRQcHFTk0elKKFpOu5AJ5CWKnIcqaDvnazy9Rl/4AYGFBEiABEiABEiABE6FAMXRqdAqZm3xq3gptRDt27dHwziv0oPo200SUP25XMMdl9GQ3RWkoj4QQQy/yrOQAAmQAAmQAAmQAAmQAAl4JsAds2c2xf4TiCOEnY5WC1EVtRDhjFH6wXTjvoQEmHAritZnRBJDWxYSIAESIAESIAESIAESIAHPBCiOPLMp9p9A8CDAQtmy5fQ8UYDExcWZg+jZRx1JUCtpstdQPXdkhR4u9gviBEmABEiABEiABEiABEjgLBKgODqL8AtjaLjLIRpXUFCgWpCizGF0HGr3U4tSiCY0Pds5jQpjjeyDBEiABEiABEiABEiABIqCAMVRUVA+w2PAMoQHhFCwCiLrYDsi1tGd7gzDZ/ckQAIkQAIkQAIkQAJeQ4DiyGtupaa7VDc7iiEvuqFcCgmQAAmQAAmQAAmQQJES8CnS0TgYCZAACZAACZAACZAACZAACRRTAhRHxfTGcFokQAIkQAIkQAIkQAIkQAJFS4DiqGh5czQSIAESIAESIAESIAESIIFiSoDiqJjeGE6LBEiABEiABEiABEiABEigaAlQHBUtb45GAiRAAiRAAiRAAiRAAiRQTAlQHBXTG8NpkQAJkAAJkAAJkAAJkAAJFC0BiqOi5c3RSIAESIAESIAESIAESIAEiimBfPMcMW9OMb1znBYJkAAJkAAJkAAJkAAJkMB/IuApP2ie4ujYsWOSmZkpJ078pzF5EQmQAAmQAAmQAAmQAAmQAAkUOwKlSokcOXJEdU5uoeNRHPn5+Ym/f4AcTD9U7BbDCZEACZAACZAACZAACZAACZDA6RCAMAoODs7VRSm1DuWWS04f06XOCQZfkgAJkAAJkAAJkAAJkAAJeB0BZ+uRR8sRVu3c0OsocEEkQAIkQAIkQAIkQAIkQAIk4ESA0eqcYPAlCZAACZAACZAACZAACZDAuUuA4ujcvfdcOQmQAAmQAAmQAAmQAAmQgBMBiiMnGHxJAiRAAiRAAiRAAiRAAiRw7hL4P+w3SgygRzOSAAAAAElFTkSuQmCC"

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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MAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowBY8AYMAaMAWPAGDAGjAFjwBgwBowB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"

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/42dd41cf026e752ccc7f13055e3ed072.png";

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/971f365c6149d0b85b3f9a031225bd1e.png";

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(113),
  /* template */
  __webpack_require__(152),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d05f720c", Component.options)
  } else {
    hotAPI.reload("data-v-d05f720c", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(172)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(114),
  /* template */
  __webpack_require__(139),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/accordion/accordion.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] accordion.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6987d002", Component.options)
  } else {
    hotAPI.reload("data-v-6987d002", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(188),
  /* template */
  __webpack_require__(153),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/back/back.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] back.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d80c2766", Component.options)
  } else {
    hotAPI.reload("data-v-d80c2766", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(169)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(189),
  /* template */
  __webpack_require__(136),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/bigcrumbs/bigcrumbs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] bigcrumbs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5dee31c2", Component.options)
  } else {
    hotAPI.reload("data-v-5dee31c2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(158)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(190),
  /* template */
  __webpack_require__(125),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/breadcrumbs/breadcrumbs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] breadcrumbs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-15555dcf", Component.options)
  } else {
    hotAPI.reload("data-v-15555dcf", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(160)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(191),
  /* template */
  __webpack_require__(127),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/checkLink/checkLink.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] checkLink.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2e59d533", Component.options)
  } else {
    hotAPI.reload("data-v-2e59d533", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(177)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(192),
  /* template */
  __webpack_require__(144),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/externalLink/externalLink.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] externalLink.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7eb3350d", Component.options)
  } else {
    hotAPI.reload("data-v-7eb3350d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(173)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(193),
  /* template */
  __webpack_require__(140),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/footer/footer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] footer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70f8cccd", Component.options)
  } else {
    hotAPI.reload("data-v-70f8cccd", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(161)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(194),
  /* template */
  __webpack_require__(128),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/hero/hero.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] hero.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-310ff02d", Component.options)
  } else {
    hotAPI.reload("data-v-310ff02d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(165)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(195),
  /* template */
  __webpack_require__(132),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/leftnav/leftnav.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] leftnav.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-40a96227", Component.options)
  } else {
    hotAPI.reload("data-v-40a96227", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(176)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(115),
  /* template */
  __webpack_require__(143),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/lists/groupedLists.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] groupedLists.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c5783c3", Component.options)
  } else {
    hotAPI.reload("data-v-7c5783c3", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(164)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(197),
  /* template */
  __webpack_require__(131),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/overlay/overlay.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] overlay.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-357a5962", Component.options)
  } else {
    hotAPI.reload("data-v-357a5962", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(170)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(117),
  /* template */
  __webpack_require__(137),
  /* scopeId */
  "data-v-632f642d",
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/search/search.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] search.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-632f642d", Component.options)
  } else {
    hotAPI.reload("data-v-632f642d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(178)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(198),
  /* template */
  __webpack_require__(145),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/smallcrumbs/smallcrumbs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] smallcrumbs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-81636c26", Component.options)
  } else {
    hotAPI.reload("data-v-81636c26", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(181)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(118),
  /* template */
  __webpack_require__(148),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/tabs/tabs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] tabs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-99af7aa6", Component.options)
  } else {
    hotAPI.reload("data-v-99af7aa6", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(162)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(119),
  /* template */
  __webpack_require__(129),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/text/headings.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] headings.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-315c3f91", Component.options)
  } else {
    hotAPI.reload("data-v-315c3f91", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(163)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(120),
  /* template */
  __webpack_require__(130),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/text/smallheadings.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] smallheadings.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-31a0e988", Component.options)
  } else {
    hotAPI.reload("data-v-31a0e988", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(179)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(121),
  /* template */
  __webpack_require__(146),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/components/text/subheadings.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] subheadings.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-830d997e", Component.options)
  } else {
    hotAPI.reload("data-v-830d997e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(155)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(200),
  /* template */
  __webpack_require__(122),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/accessibility/accessibility.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] accessibility.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-07800f1b", Component.options)
  } else {
    hotAPI.reload("data-v-07800f1b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(168)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(201),
  /* template */
  __webpack_require__(135),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/analytics/analytics.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] analytics.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5d23530b", Component.options)
  } else {
    hotAPI.reload("data-v-5d23530b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(180)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(202),
  /* template */
  __webpack_require__(147),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/authentication/authentication.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] authentication.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-832a9586", Component.options)
  } else {
    hotAPI.reload("data-v-832a9586", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(156)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(203),
  /* template */
  __webpack_require__(123),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/design-standards/design-standards.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] design-standards.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-08646f46", Component.options)
  } else {
    hotAPI.reload("data-v-08646f46", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(157)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(204),
  /* template */
  __webpack_require__(124),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/feedback/feedback.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] feedback.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0872aa1d", Component.options)
  } else {
    hotAPI.reload("data-v-0872aa1d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(171)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(205),
  /* template */
  __webpack_require__(138),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/hosting/hosting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] hosting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6550a333", Component.options)
  } else {
    hotAPI.reload("data-v-6550a333", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(175)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(206),
  /* template */
  __webpack_require__(142),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/landing/landing.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] landing.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-78938a26", Component.options)
  } else {
    hotAPI.reload("data-v-78938a26", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(184)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(207),
  /* template */
  __webpack_require__(151),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/masthead-footer/masthead-footer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] masthead-footer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c1207236", Component.options)
  } else {
    hotAPI.reload("data-v-c1207236", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(174)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(208),
  /* template */
  __webpack_require__(141),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/search-optimization/search-optimization.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] search-optimization.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74e67523", Component.options)
  } else {
    hotAPI.reload("data-v-74e67523", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(183)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(209),
  /* template */
  __webpack_require__(150),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/site-building/site-building.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] site-building.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bdbcdf1a", Component.options)
  } else {
    hotAPI.reload("data-v-bdbcdf1a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(159)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(210),
  /* template */
  __webpack_require__(126),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/support/support.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] support.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2636565d", Component.options)
  } else {
    hotAPI.reload("data-v-2636565d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(167)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(211),
  /* template */
  __webpack_require__(134),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/urls/urls.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] urls.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5a9dc87d", Component.options)
  } else {
    hotAPI.reload("data-v-5a9dc87d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(182)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(212),
  /* template */
  __webpack_require__(149),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/alicialippert/Sites/ecosystem-guidance/src/pages/usability/usability.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] usability.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(0)
  hotAPI.install(__webpack_require__(1), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a86cefd2", Component.options)
  } else {
    hotAPI.reload("data-v-a86cefd2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_masthead_masthead_vue__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_masthead_masthead_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_masthead_masthead_vue__);


/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'app',
    components:{
      masthead: __WEBPACK_IMPORTED_MODULE_0__components_masthead_masthead_vue___default.a
    },
});


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "accordion",
  props: ['items']
});


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/* harmony default export */ __webpack_exports__["default"] = ({
	name: 'groupedLists',
	props: {
		lists: Array
	},
	methods: {
	},
	data: function () {
		return {
		}
	}
});



/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

	/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'masthead'
	});


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'search',
  props: ['callback'],
  methods: {
    keyMonitor(event) {
      if (event && event.key === "Enter") {
        this.search();
      }
    },
    search() {
      this.callback(this.searchText);
    }
  },
  data() {
    return {
      searchText: ''
    }
  }
});


/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'tabs',
  props: ['tabs']
});


/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

	/* harmony default export */ __webpack_exports__["default"] = ({
	  name: 'pageHeading',
	  props: {
	    heading: String
	  },
	  methods: {
	  },
	  data: function () {
	    return {
	    }
	  }
});



/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

	/* harmony default export */ __webpack_exports__["default"] = ({
	  name: 'smallHeading',
	  props: {
	    heading: String
	  },
	  methods: {
	  },
	  data: function () {
	    return {
	    }
	  }
});



/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

	/* harmony default export */ __webpack_exports__["default"] = ({
	  name: 'subHeading',
	  props: {
	    heading: String
	  },
	  methods: {
	  },
	  data: function () {
	    return {
	    }
	  }
});



/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Accessibility standards"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n                It is every product teamâ€™s responsibility to ensure that their site meets applicable accessibility guidelines. IBM "), _c('a', {
    attrs: {
      "href": "https://w3-03.ibm.com/ibm/documents/corpdocweb.nsf/ContentDocsByTitle/Corporate+Instruction+CHS+162",
      "target": "_blank"
    }
  }, [_vm._v("Corporate Instruction 162")]), _vm._v(" requires that all information technology be made accessible to people with disabilities (e.g., visual, auditory, motor and cognitive disabilities).\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                In addition to compliance with the corporate instruction (and, in some cases, the law), ensuring that your site is usable by people with disabilities will also make your site or application better for those without disabilities.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Every Agile team member has a role to play in developing accessible products â€“ you should begin by reviewing the "), _c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/able/devtest/quick/",
      "target": "_blank"
    }
  }, [_vm._v("Accessibility Quick Guide")]), _vm._v(" and "), _c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/able/",
      "target": "_blank"
    }
  }, [_vm._v("Accessibility Research Center")]), _vm._v(".\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Generally speaking, IBM internal sites and applications should be compliant with at least WCAG 2.0 AA guidelines (if you do not know what this means, you definitely should review the sites linked above).\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Additionally, IBM Team Able is an all-IBM group of volunteers, each with some type of disability, who are willing to share their experiences using IBM products & services. Contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=C-M7N5897",
      "target": "_blank"
    }
  }, [_vm._v("PWD Global Inclusion")]), _vm._v(" to learn more, or if you have an IBM offering youâ€™d like to have reviewed.\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-07800f1b", module.exports)
  }
}

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Internal design standards and guidelines"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n                If you are deploying a site with an IBM-internal audience (i.e., a page on w3), we recommend that you utilize the "), _c('a', {
    attrs: {
      "href": "https://pages.github.ibm.com/w3/w3ds/",
      "target": "_blank"
    }
  }, [_vm._v("w3 Design System")]), _vm._v(" (w3DS).\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                The v17 Standards (Atlas) are no longer being actively supported. We are not mandating that sites move from v17, but it is very likely that teams will begin experiencing problems with elements becoming out of date (e.g., entries in the masthead and footer). There is currently no plan to eliminate the centrally hosted files required for v17, but if you are planning to update an existing site, we "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("strongly recommend")]), _vm._v(" moving from v17 to w3DS (or another design system).\n              ")]), _vm._v(" "), _c('h2', [_vm._v("What is the w3 Design System?")]), _vm._v(" "), _c('p', [_vm._v("\n                A design system provides the basic components designers and developers use to create web sites and applications. For the web, that typically means CSS and JavaScript code that drives the look and feel of the elements or components with which users interact â€“ buttons, tabs, accordions, dropdown lists, etc.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                In addition to basic UI components, w3DS includes a responsive grid and breakpoints to help teams design sites that display and behave correctly on many devices. Generally speaking, any new site deployed internally should be usable on a mobile device, and using modern design systems like w3DS make building such sites more straight-forward, as well as cutting down on the workload.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                The w3 Design System provides the code library (one CSS and a few different JavaScript libraries, specifically) and a documentation site that details the best ways to use the components. We have also provided a Sketch file for designers that includes all of the w3DS components as symbols â€“ this allows designers to rapidly design and iterate on mockups and enhances designer and developer communication by ensuring that all team members are working from the same â€œtoolbox.â€\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Visit the "), _c('a', {
    attrs: {
      "href": "https://pages.github.ibm.com/w3/w3ds/",
      "target": "_blank"
    }
  }, [_vm._v("w3 Design System documentation site")]), _vm._v(" for more details.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Is the w3 Design System "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("required")]), _vm._v(" for internal sites?")]), _vm._v(" "), _c('p', [_vm._v("\n                No. Unlike previous versions of the intranet standards, use of w3DS is not required to deploy a site internally. w3DS provides a simple and powerful UI framework that enables teams of developers and designers to quickly build sites with thoroughly tested components and ensures a level of consistency across internal sites, but if the needs of your users require that you utilize a different approach, you may do so.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Keep in mind that if you use a different design system (or worse, no design system) the burden on your team for testing the site will be greater.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Does my existing site need to update to w3DS?")]), _vm._v(" "), _c('p', [_vm._v("\n                Technically you are "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("not")]), _vm._v(" required to upgrade to w3DS. However, if you are on v17 or earlier standards, they are no longer being actively supported. Some elements of your site may have problems or become out of date if you do not take steps to move off of the older standards systems. \n              ")]), _vm._v(" "), _c('h2', [_vm._v("Can I use part of the w3 Design System without using all of it?")]), _vm._v(" "), _c('p', [_vm._v("\n                Yes â€“ one of the advantages of w3DS is its flexibility. You can choose to use what is useful for your project and refrain from using the parts that are not. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                You may also choose to develop custom components for your site if your team deems it necessary (consider feeding your new components back to the w3DS team in GitHub so we can determine whether the component should be integrated into the design system).\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-08646f46", module.exports)
  }
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Feedback"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', {
    staticClass: "ds-text-small"
  }, [_vm._v("\n                This is where the content goes for talking about feedback mechanisms\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-0872aa1d", module.exports)
  }
}

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-cf-xs"
  }, [_c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-md-8 ds-offset-md-2 ds-col-lg-8 ds-offset-lg-2 ds-align-text-left"
  }, [_c('ul', {
    staticClass: "ds-padding-0"
  }, [_c('li', {
    staticClass: "ds-hide-xs ds-display-sm-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": {
        name: 'overview'
      }
    }
  }, [_vm._v("Home")])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-hide-xs ds-display-sm-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": _vm.parentLink
    }
  }, [_vm._v(_vm._s(_vm.parent))])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-blue-dull-4 ds-text-small ds-font-weight-normal"
  }, [_vm._v(_vm._s(_vm.child))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-15555dcf", module.exports)
  }
}

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "End user support for your site"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n                If you need to provide support documentation for how to use your site or application, it should be hosted on the "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/help/",
      "target": "_blank"
    }
  }, [_vm._v("Help@IBM")]), _vm._v(" support site. Having all support documentation on Help@IBM ensures that users have a central location for all things they need help with and that the support content is tailored to end user consumption.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                If you have support content or need to have support content created, work with the Help@IBM team and get started by sending an email to the "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=C-JBBV897",
      "target": "_bl"
    }
  }, [_vm._v("Help Team")]), _vm._v(".\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-2636565d", module.exports)
  }
}

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "ah-article ah-article--left"
  }, [_c('span', {
    staticClass: "ds-icon-check-box ah-article__box"
  }), _vm._v(" "), _c('router-link', {
    staticClass: "link",
    attrs: {
      "to": _vm.link
    }
  }, [_c('span', {
    staticClass: "link-text"
  }, [_vm._v(_vm._s(_vm.linkTitle))])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-2e59d533", module.exports)
  }
}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-row ds-padding-top-4 ds-padding-top-2 ds-margin-bottom-2 ds-bg-dark",
    attrs: {
      "id": _vm.id
    }
  }, [_c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-lg-8 ds-offset-lg-2 ds-col-xl-6 ds-offset-xl ds-align-text-left ds-margin-bottom-3"
  }, [_c('h4', {
    staticClass: "ds-heading-4"
  }, [_vm._v("\n            w3 Intranet Guidance\n        ")]), _vm._v(" "), _c('h1', {
    staticClass: "ds-heading-2"
  }, [_vm._v("\n            " + _vm._s(_vm.title) + "\n        ")]), _vm._v(" "), _c('p', [_vm._v("\n            " + _vm._s(_vm.subtext) + "\n        ")])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-310ff02d", module.exports)
  }
}

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', {
    staticClass: "ds-heading-xs-2 ds-heading-sm-2 ds-heading-md-2 ds-heading-lg-1 ds-heading-xl-1 ds-margin-bottom-2"
  }, [_vm._v(_vm._s(_vm.heading))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-315c3f91", module.exports)
  }
}

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h4', {
    staticClass: "ds-heading-xs-4 ds-heading-sm-4 ds-heading-md-4 ds-heading-lg-4 ds-heading-xl-4 ds-font-weight-bold"
  }, [_vm._v(_vm._s(_vm.heading))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-31a0e988", module.exports)
  }
}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "overlay"
    }
  }, [_vm._l((_vm.overlay), function(overlay) {
    return _c('button', {
      staticClass: "ds-button",
      class: overlay.buttonClass,
      attrs: {
        "id": "overlay-default-demo-open"
      },
      on: {
        "click": _vm.openOverlay
      }
    }, [_vm._v(_vm._s(overlay.buttonText))])
  }), _vm._v(" "), _c('div', {
    staticClass: "ds-overlay",
    attrs: {
      "id": "overlay-default-demo"
    }
  }, [_c('div', {
    staticClass: "ds-overlay-box ds-col-xs-10 ds-offset-xs-1 ds-col-md-8 ds-offset-md-2 ds-col-lg-8 ds-offset-lg-2 ds-align-text-left"
  }, [_c('button', {
    staticClass: "ds-close ds-button ds-flat ds-margin-1 ds-padding-1",
    on: {
      "click": _vm.closeOverlay
    }
  }, [_c('span', {
    staticClass: "ds-icon-x"
  })]), _vm._v(" "), _c('div', {
    staticClass: "ds-row ds-overlay-content"
  }, _vm._l((_vm.overlay), function(overlay) {
    return _c('div', {
      staticClass: "ds-col-10 ds-offset-1",
      domProps: {
        "innerHTML": _vm._s(overlay.content)
      }
    }, [_vm._v("\n                    " + _vm._s(overlay.content) + "\n                ")])
  }))])])], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-357a5962", module.exports)
  }
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-3 ds-col-lg-3 ds-align-text-left"
  }, [_c('div', {
    staticClass: "ds-input-container ds-margin-bottom-2 desktop-nav"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-2"
  }, [_c('div', {
    staticClass: "ds-side-nav ds-col-xs-12 ds-no-gutter ds-margin-bottom-2 ds-padding-top-0_5 ds-padding-bottom-0_5",
    staticStyle: {
      "position": "relative!important"
    }
  }, [_c('div', {
    staticClass: "ds-nav-item nav-home nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'home'
      }
    }
  }, [_vm._v("HOME")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("DESIGN")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'design-standards'
      }
    }
  }, [_vm._v("Design Standards")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'site-building'
      }
    }
  }, [_vm._v("Site building options")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("BUILD")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'hosting'
      }
    }
  }, [_vm._v("Hosting")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'masthead-footer'
      }
    }
  }, [_vm._v("Masthead & Footer")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'urls'
      }
    }
  }, [_vm._v("URLs and Vanity URLs")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("MEASURE")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'analytics'
      }
    }
  }, [_vm._v("Analytics")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'usability'
      }
    }
  }, [_vm._v("Usability metrics")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("ADVANCED")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'accessibility'
      }
    }
  }, [_vm._v("Accessibility standards")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'authentication'
      }
    }
  }, [_vm._v("SSO Authentication")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'search-optimization'
      }
    }
  }, [_vm._v("Search Optimization (SEO)")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'support'
      }
    }
  }, [_vm._v("End-user Support")])], 1)])])]), _vm._v(" "), _c('div', {
    staticClass: "ds-input-container mobile-nav"
  }, [_c('div', {
    staticClass: "ds-row"
  }, [_c('div', {
    staticClass: "mobile-nav-chooser",
    on: {
      "click": _vm.toggleItem
    }
  }, [_vm._v("\n                Choose a page...            \n                "), _c('span', {
    staticClass: "ds-icon-size-default ds-icon-list-unordered ds-float-right"
  })]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.toggled),
      expression: "toggled"
    }],
    staticClass: "ds-side-nav ds-col-xs-12 ds-no-gutter ds-margin-bottom-2 ds-padding-top-0_5 ds-padding-bottom-0_5",
    staticStyle: {
      "position": "relative!important"
    }
  }, [_c('div', {
    staticClass: "ds-nav-item nav-home nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'home'
      }
    }
  }, [_vm._v("HOME")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("DESIGN")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'design-standards'
      }
    }
  }, [_vm._v("Design Standards")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'site-building'
      }
    }
  }, [_vm._v("Site building options")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("BUILD")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'hosting'
      }
    }
  }, [_vm._v("Hosting")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'masthead-footer'
      }
    }
  }, [_vm._v("Masthead & Footer")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'urls'
      }
    }
  }, [_vm._v("URLs and Vanity URLs")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("MEASURE")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'analytics'
      }
    }
  }, [_vm._v("Analytics")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'usability'
      }
    }
  }, [_vm._v("Usability metrics")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-sub"
  }, [_vm._v("ADVANCED")]), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'accessibility'
      }
    }
  }, [_vm._v("Accessibility standards")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'authentication'
      }
    }
  }, [_vm._v("SSO Authentication")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'search-optimization'
      }
    }
  }, [_vm._v("Search Optimization (SEO)")])], 1), _vm._v(" "), _c('div', {
    staticClass: "ds-nav-item nav-indent nav-link"
  }, [_c('router-link', {
    attrs: {
      "to": {
        name: 'support'
      }
    }
  }, [_vm._v("End-user Support")])], 1)]), _vm._v(" "), _c('hr', {
    staticClass: "ds-margin-top-2"
  })])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-40a96227", module.exports)
  }
}

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-row"
  }, [_c('div', {
    staticClass: "ds-col-2 ds-padding-top-1"
  }, [_c('div', {
    staticClass: "ds-padding-left-1"
  })]), _vm._v(" "), _c('div', {
    staticClass: "ds-col-9 ds-padding-top-0_5 ds-no-gutter"
  }), _vm._v(" "), _c('div', {
    staticClass: "ds-col-1 ds-padding-top-1"
  }, [_vm._v("Â ")])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-50bf6e0d", module.exports)
  }
}

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "URLs and vanity URLs"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Background")]), _vm._v(" "), _c('p', [_vm._v("\n                A URL is the unique identifier or â€œaddressâ€ (e.g., â€œw3.ibm.com/help) for your site that enables web browsers to find and load your page. If users know the URL of a page, they can type it into the address bar of their browser and load that page.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Unfortunately, URLs are frequently too complex for users to remember or type, as they contain all the information needed to locate the page. This issue can be addressed by providing a â€œredirectâ€ from a short, memorable URL to the actual, complex one. This approach allows multiple different URLâ€™s to resolve to one â€œtrueâ€ URL. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                The short, memorable URL is called a â€œvanity URL.â€ For an intranet site dedicated to helping IBMers sell to textile companies, a vanity URL might be something like â€œw3.ibm.com/textilesâ€ which users might remember and be able to type into the browserâ€™s address bar. Additionally, users can feel more confident that the page is â€œofficial.â€\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Keep in mind that multiple sites might want the same vanity URL (e.g., different organizations might have a page about travel and want to claim â€œw3.ibm.com/travelâ€ as their own). Because of this, requests for a vanity URL must be approved to claim a vanity URL. Also, to make vanity URLs more usable, there are rules that govern them (e.g., if your content is specific to a certain country, it is helpful to the user if the country specification is always in the same place in the URL).\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Requesting a URL")]), _vm._v(" "), _c('p', [_vm._v("\n                First, review the "), _c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/transform/sas/as-web.nsf/ContentDocsByTitle/Internal+URL+Naming+Policy",
      "target": "_blank"
    }
  }, [_vm._v("internal URL naming policy")]), _vm._v(". Violating policy will cause requests to be rejected.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Second, once you understand the policies and have a plan, you can go to the "), _c('a', {
    attrs: {
      "href": "https://cwt01.webmaster.ibm.com/urt/entry.php",
      "target": "_blank"
    }
  }, [_vm._v("URT (URL Redirect Tool)")]), _vm._v(" to make the request. You can use the â€œSubmit URL naming requestâ€ feature to request a specific URL for your site, or the â€œSubmit redirect/proxy requestâ€ to set up a redirect request.\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-5a9dc87d", module.exports)
  }
}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Monitoring usage analytics for your intranet site"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Background")]), _vm._v(" "), _c('p', [_vm._v("\n                Usage metrics focus on how users are employing your site and pages. They include such things as:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Page loads")]), _vm._v(" "), _c('li', [_vm._v("Visits")]), _vm._v(" "), _c('li', [_vm._v("Unique visitors")]), _vm._v(" "), _c('li', [_vm._v("The page users came from and where they go next")])]), _vm._v(" "), _c('p', [_vm._v("\n                One can also specifically tag events within a site to collect more advanced metrics, such as:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Abandonment rate")]), _vm._v(" "), _c('li', [_vm._v("How often a particular feature is used")]), _vm._v(" "), _c('li', [_vm._v("Success rates on target tasks")]), _vm._v(" "), _c('li', [_vm._v("Time (page load, time on page, time to complete a task)")])]), _vm._v(" "), _c('p', [_vm._v("\n                Usage metrics can be a powerful tool in improving the user experience for you pages, and are critical in performing A/B tests. For the intranet, "), _c('a', {
    attrs: {
      "href": "https://welcome.coremetrics.com/analyticswebapp/jsp/login.jsp",
      "target": "_blank"
    }
  }, [_vm._v("IBM Digital Analytics")]), _vm._v(" (also known as a part of "), _c('a', {
    attrs: {
      "href": "https://www.ibm.com/customer-engagement/coremetrics-software",
      "target": "_blank"
    }
  }, [_vm._v("IBM Customer Experience Analytics")]), _vm._v(") is used for the collection of usage metrics. The "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/We6e730887362_487c_b478_73c9d49cb9ee/page/Introduction",
      "target": "_blank"
    }
  }, [_vm._v("IBM Digital Analytics Community")]), _vm._v(" is a good resource for the tool. Please note that this does have a focus on external IBM pages, but many of the same concepts apply. More complete metrics guidance is under development, and you can contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=L07412897",
      "target": "_blank"
    }
  }, [_vm._v("Mark Malatesta")]), _vm._v(" for questions and details.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Begin using IBM Digital Analytics")]), _vm._v(" "), _c('p', [_vm._v("\n                First, you want to ensure that IBM Digital Analytics is collecting data for your pages. The easiest method to ensure this is by including the "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/w3-masthead",
      "target": "_blank"
    }
  }, [_vm._v("w3 Masthead")]), _vm._v(" ribbon on all your pages. In addition to providing your users access to core intranet features (e.g., search, links), this feature also contains a line of code that will enable Digital Analytics to record basic metrics for your site.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                If you wish to enable Digital Analytics on your site but not use the w3 Masthead ribbon, please contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=L07412897",
      "target": "_blank"
    }
  }, [_vm._v("Mark Malatesta")]), _vm._v(" for details. Either including the Masthead ribbon or manually adding the Digital Analytics code is highly recommended as this improves the quality of the cross-w3 metrics.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                In order to view reports of the metrics, youâ€™ll need to "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/We6e730887362_487c_b478_73c9d49cb9ee/page/Beginner",
      "target": "_blank"
    }
  }, [_vm._v("complete training")]), _vm._v(" and "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/We6e730887362_487c_b478_73c9d49cb9ee/page/Getting%20Access",
      "target": "_blank"
    }
  }, [_vm._v("get access")]), _vm._v(" to the Digital Analytics tool.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Advanced metrics")]), _vm._v(" "), _c('p', [_vm._v("\n                More advanced metrics can be collected by adding Digital Analytics tags to elements of your page. For example, if you wanted to know how often a specific button on one of your pages was clicked by users, you may need to add a Digital Analytics tag to that control in your code. Using tags, you can create very advanced recording and reporting, including completion rates on critical user tasks.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                This does require some expertise, and education and resources are available "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/We6e730887362_487c_b478_73c9d49cb9ee/page/Introduction",
      "target": "_blank"
    }
  }, [_vm._v("in the community")]), _vm._v(". Better guidance, specific to the intranet, is under development (contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=L07412897",
      "target": "_blank"
    }
  }, [_vm._v("Mark Malatesta")]), _vm._v(" for more information). \n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-5d23530b", module.exports)
  }
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-cf-xs"
  }, [_c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-md-8 ds-offset-md-2 ds-col-lg-8 ds-offset-lg-2 ds-align-text-left"
  }, [_c('ul', {
    staticClass: "ds-padding-0"
  }, [_c('li', {
    staticClass: "ds-hide-xs ds-display-sm-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": {
        name: 'overview'
      }
    }
  }, [_vm._v("Home")])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-hide-xs ds-display-sm-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": _vm.grandparentLink
    }
  }, [_vm._v(_vm._s(_vm.grandparent))])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-hide-xs ds-display-sm-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": _vm.parentLink
    }
  }, [_vm._v(_vm._s(_vm.parent))])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-blue-dull-4 ds-text-small ds-font-weight-normal"
  }, [_vm._v(_vm._s(_vm.child))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-5dee31c2", module.exports)
  }
}

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "search-container ds-input-container ds-margin-bottom-0 ds-padding-bottom-0"
  }, [_c('label', {
    staticClass: "ds-margin-right-1",
    attrs: {
      "for": "text"
    }
  }, [_vm._v("Accessibility Advisor Search:")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.searchText),
      expression: "searchText"
    }],
    staticClass: "ds-input",
    attrs: {
      "type": "text",
      "id": "text",
      "placeholder": "Search a11y central"
    },
    domProps: {
      "value": (_vm.searchText)
    },
    on: {
      "keyup": _vm.keyMonitor,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.searchText = $event.target.value
      }
    }
  }), _vm._v(" "), _c('i', {
    staticClass: "ds-icon-search-m ds-text-neutral-3",
    on: {
      "click": _vm.search
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-632f642d", module.exports)
  }
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Hosting"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Cloud@IBM Bluemix")]), _vm._v(" "), _c('p', [_vm._v("\n                For internal deployment, Cloud@IBM Bluemix is a great option for running applications of all kinds. Leveraging Cloud Foundry, Cloud@IBM Bluemix enables developers to quickly build and deploy applications, while tapping a growing ecosystem of available services and runtime frameworks. Best of all, IBMers get a small amount of space for free. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                More information on Cloud@IBM Bluemix can be found in the "), _c('a', {
    attrs: {
      "href": "https://apps.na.collabserv.com/wikis/home?lang=en-us#!/wiki/W6ab3b281829c_452f_b906_9472b2b3195e/page/Welcome%20to%20Cloud%40IBM%20Bluemix%20Community",
      "target": "_blank"
    }
  }, [_vm._v("Cloud@IBM Bluemix Community")]), _vm._v(", which includes an FAQ.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Do you have other hosting questions?")]), _vm._v(" "), _c('p', [_vm._v("Visit the w3 webmaster's "), _c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/transform/sas/as-web.nsf/contentdocsbytitle/IBM+Hosting+Standard",
      "target": "_blank"
    }
  }, [_vm._v("hosting guidance site.")])]), _vm._v(" "), _c('h2', [_vm._v("Are you looking for the owner of a space?")]), _vm._v(" "), _c('p', [_vm._v("A list of the domain owners within w3 can be found on the "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/W89a3c30bd530_49f6_b9e1_0264696622a9/page/w3%20Contacts?section=intranet",
      "target": "_blank"
    }
  }, [_vm._v("w3 Contacts Connections page")]), _vm._v(".")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-6550a333", module.exports)
  }
}

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "ds-accordion",
    attrs: {
      "id": "accordion"
    }
  }, _vm._l((_vm.items), function(item) {
    return _c('li', {
      staticClass: "ds-row"
    }, [_c('div', {
      staticClass: "ds-accordion-control"
    }, [_c('div', {
      staticClass: "ds-accordion-title"
    }, [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c('div', {
      staticClass: "ds-accordion-slidedown"
    }, [_vm._v("\n  \t\t\t\t\t" + _vm._s(item.content) + "\n  \t\t\t\t")])])])
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-6987d002", module.exports)
  }
}

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "footer"
  }, [_c('div', {
    staticClass: "ds-row"
  }, [_c('div', {
    staticClass: "ds-col-12 ds-no-gutter ds-bg-neutral-warm-2 ds-padding-top-xs-1 ds-padding-top-md-2 no-more-space"
  }, [_c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-md-12 ds-col-lg-10 ds-offset-lg-2 ds-col-xl-6 ds-offset-xl-3 footer-inner"
  }, [_c('div', {
    staticClass: "ds-row"
  }, [_c('div', {
    staticClass: "ds-col-4 ds-margin-bottom-1"
  }, [_c('ul', {
    staticClass: "ds-list-unstyled"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "https://ibm-studios.slack.com/messages/C0VB6RQMU",
      "target": "_blank"
    }
  }, [_vm._v("#accessibility on Slack")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/communities/service/html/communityview?communityUuid=3a5f75da-4e1b-4551-be80-1c660d47897c",
      "target": "_blank"
    }
  }, [_vm._v("Accessibility Central")])])])]), _vm._v(" "), _c('div', {
    staticClass: "ds-col-4 ds-margin-bottom-1"
  }, [_c('ul', {
    staticClass: "ds-list-unstyled"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/communities/service/html/communityview?communityUuid=3a5f75da-4e1b-4551-be80-1c660d47897c#fullpageWidgetId=We483c1a87e69_4064_b480_dac4c7769d16&show=forums",
      "target": "_blank"
    }
  }, [_vm._v("Forums")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "http://www-03.ibm.com/able/guidelines/ci162/accessibility_checklist.html",
      "target": "_blank"
    }
  }, [_vm._v("Accessibility Checklist 7.0")])])])]), _vm._v(" "), _c('div', {
    staticClass: "ds-col-4 ds-margin-bottom-1"
  }, [_c('ul', {
    staticClass: "ds-list-unstyled"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "https://www.w3.org/TR/WCAG20/",
      "target": "_blank"
    }
  }, [_c('span', {
    staticClass: "ds-icon-link-external"
  }), _vm._v(" WCAG 2.0")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "ds-hr"
  }), _vm._v(" "), _c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-lg-8 ds-offset-lg-2 ds-col-xl-6 ds-offset-xl-3"
  }, [_c('div', {
    staticClass: "ds-row"
  }, [_c('div', {
    staticClass: "ds-col-12"
  }, [_c('h5', {
    staticClass: "ds-heading-5 ds-display-xs-block ds-display-md-inline-block ds-margin-right-md-2 ds-margin-top-1 ds-margin-bottom-1"
  }, [_vm._v("Terms of use")]), _vm._v(" "), _c('h5', {
    staticClass: "ds-heading-5 ds-display-xs-block ds-display-md-inline-block ds-margin-right-md-2 ds-margin-top-1 ds-margin-bottom-1"
  }, [_vm._v("Business Conduct Guidelines")]), _vm._v(" "), _c('h5', {
    staticClass: "ds-heading-5 ds-display-xs-block ds-display-md-inline-block ds-margin-right-md-2 ds-margin-top-1 ds-margin-bottom-1"
  }, [_vm._v("Feedback")]), _vm._v(" "), _c('h5', {
    staticClass: "ds-heading-5 ds-display-xs-block ds-display-md-inline-block ds-margin-right-md-2 ds-margin-top-1 ds-margin-bottom-1"
  }, [_vm._v("Accessibility")])]), _vm._v(" "), _c('div', {
    staticClass: "ds-col-12 ds-padding-top-xs-1 ds-padding-top-md-0"
  }, [_c('p', {
    staticClass: "ds-text-small"
  }, [_vm._v("Â© 2008-2017 Copyright.")])])])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-70f8cccd", module.exports)
  }
}

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Making your intranet site findable with w3 Search"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Background")]), _vm._v(" "), _c('p', [_vm._v("\n                When creating a great user experience, making a great tool is only part of the battle. You must also make your tool easily findable and accessible to the people who are going to use it. After all, if users cannot get to your site, it does not deliver value. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                It is likely you already have techniques in mind for raising awareness of your sites (e.g., Communities, promotion during meetings, etc.). That being said, knowing the most common ways your site will be looked for by users allows you as a site owner to put together an informed strategy for findability. Here are the most common ways IBMers find pages, tools and resources:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("The "), _c('a', {
    attrs: {
      "href": "http://w3.ibm.com/",
      "target": "_blank"
    }
  }, [_vm._v("w3 Home Page")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "http://w3.ibm.com/search",
      "target": "_blank"
    }
  }, [_vm._v("w3 Search with Watson")])]), _vm._v(" "), _c('li', [_vm._v("w3 News")])]), _vm._v(" "), _c('h2', [_vm._v("Searching with the w3 Home Page and w3 Search with Watson")]), _vm._v(" "), _c('p', [_vm._v("\n                The most common way to find intranet pages and tools when the user is not already aware of them is via search. The majority of searches originate on the w3 Home Page:\n              ")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(80),
      "alt": "â€â€"
    }
  }), _vm._v(" "), _c('p', [_vm._v("\n                Users get immediate â€œbest betâ€ searches as they type (known as rapid results). These are personalized to the user when the user is signed in. If the user presses the Enter key after they type their search, they are taken to full search results on w3 Search with Watson:\n              ")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(81),
      "alt": "â€â€"
    }
  }), _vm._v(" "), _c('p', [_vm._v("\n                There are a few ways to make sure your site is findable using these systems:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Provided the meta tags on your pages (e.g., Robots) are configured correctly, the w3 Watson Search crawlers will find and index your pages. Your pages will become findable in search automatically, given time. More information about how to correctly configure your meta tags can be found on the "), _c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/transform/sas/as-web.nsf/ContentDocsByTitle/Title+Tag",
      "target": "_blank"
    }
  }, [_vm._v("w3 Standards")]), _vm._v(" site.")]), _vm._v(" "), _c('li', [_vm._v("If your pages are not appearing, you can also "), _c('a', {
    attrs: {
      "href": "https://w3-connections.ibm.com/wikis/home?lang=en-us#!/wiki/W8644fca6586b_47c6_a2be_61020dbb24ae/page/FAQ?section=As%20a%20content%20owner%2C%20how%20do%20I%20get%20my%20content%20in%20w3%20Search",
      "target": "_blank"
    }
  }, [_vm._v("reach out to the search team")]), _vm._v(" and they will help you get your content into search.")]), _vm._v(" "), _c('li', [_vm._v("If your site is the authoritative site on a certain topic, you may want to make sure your site appears near the top of certain queries. You can do so by "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/help/#/article/w3search_top_page/overview",
      "target": "_blank"
    }
  }, [_vm._v("requesting a suggested match")]), _vm._v(". Being granted a suggested match not only puts your result at the top of w3 Search with Watson, but also causes it to appear in the rapid results on the w3 Home Page as the user types the query.")])]), _vm._v(" "), _c('h2', [_vm._v("Links on the w3 Home Page")]), _vm._v(" "), _c('p', [_vm._v("\n                The w3 Home Page provides additional ways to access tools and sites beyond search. The links in the Places card are perhaps the most obvious example, but there are also links in the masthead, cards dedicated to tools, etc. However, not every site should become a link on the w3 homepage and the addition of a link is evaluated by the homepage team on a case-by-case basis. Often teams think becoming a link on the w3 Home Page would be a great way to promote their site, but keep in mind:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Endlessly adding links for promotional purposes would create an overabundance of links for our users, and each link would become less prominent.")]), _vm._v(" "), _c('li', [_vm._v("We have found that adding a link alone does little to increase traffic to a given site.")]), _vm._v(" "), _c('li', [_vm._v("The w3 Home Page team adds links based upon user need (e.g., the most used sites), vs. site owners looking for promotion.")])]), _vm._v(" "), _c('p', [_vm._v("\n                Occasionally, a new site is deemed appropriate for being included as a link on the home page, but this is rare because the expectation is that the new site will be used by the majority of IBMers on a regular basis. If you feel there needs to be an action taken around the links on the home page, contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=7A8622897",
      "target": "_blank"
    }
  }, [_vm._v("Tom Hawkins")]), _vm._v(".\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Time-based site promotion")]), _vm._v(" "), _c('p', [_vm._v("\n                If you are announcing a new site, especially one tied to an event, you may want to consider one of these methods of promotion:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("A w3 News article: If your site solves a known problem for all or a targeted group of IBMers, or is tied to an event/initiative, you may want to have a w3 article about it.")]), _vm._v(" "), _c('li', [_vm._v("A home page banner: Reserved only for big events of interest to most IBMers, a banner appears at the top of the home page for a limited period of time.")]), _vm._v(" "), _c('li', [_vm._v("A Whatâ€™s New card: Reserved for new tools and technology from the CIO.")])]), _vm._v(" "), _c('p', [_vm._v("\n                If you have interest in any of these, contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?email=wsimonds@us.ibm.com",
      "target": "_blank"
    }
  }, [_vm._v("Will Simonds")]), _vm._v(".\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-74e67523", module.exports)
  }
}

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Welcome to the IBM Intranet Guidance site",
      "subtext": "This site is intended to provide answers to common questions from teams who need to publish (or update) a site on the IBM intranet, referred to as â€œw3â€"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n\t\t\t\t\t\tThe guidance here is for:\n\t\t\t\t\t")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('p', [_vm._v("\n\t\t\t\t\t\tThe content on this site will get you started on common tasks such as:\n\t\t\t\t\t")]), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('p', [_vm._v("\n\t\t\t\t\t\tMany different teams are responsible for the rules and processes around these activities, and we know from experience that it can be difficult to find a starting point (or even to know that you need to find it). If you have questions or issues that are not covered here, please provide feedback through the "), _c('a', {
    attrs: {
      "href": "#",
      "id": "usbl-integrated-button"
    },
    on: {
      "click": _vm.usabilla
    }
  }, [_vm._v("w3 Intranet Guidance feedback form")]), _vm._v(".\n\t\t\t\t\t")])])])])], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_c('span', {
    staticClass: "ds-label"
  }, [_vm._v("Internally facing pages.")]), _vm._v(" If you are working on a site that has an externally-facing presence (e.g., on www.ibm.com), much of this guidance is not applicable. Visit "), _c('a', {
    attrs: {
      "href": "https://www.ibm.com/standards/web/",
      "target": "_blank"
    }
  }, [_vm._v("the Northstar web standards site")]), _vm._v(" for guidance.")]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "ds-label"
  }, [_vm._v("Websites and web applications.")]), _vm._v(" If you are creating a native or hybrid mobile app, this guidance might not be applicable.\n\t    \t\t\t\t")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("\n\t    \t\t\t\t\tFinding a hosting environment and creating vanity URLâ€™s")]), _vm._v(" "), _c('li', [_vm._v("\n\t    \t\t\t\t\tCreating the user interface using the w3 Design System\n\t    \t\t\t\t")]), _vm._v(" "), _c('li', [_vm._v("\n\t    \t\t\t\t\tEnsuring that your site is accessible to people with disabilities\n\t    \t\t\t\t")]), _vm._v(" "), _c('li', [_vm._v("\n\t    \t\t\t\t\tInstrumenting your site for traffic and other usage metrics\n\t    \t\t\t\t")]), _vm._v(" "), _c('li', [_vm._v("\n\t    \t\t\t\t\tInstituting real-time monitoring of uptime and performance\n\t    \t\t\t\t")]), _vm._v(" "), _c('li', [_vm._v("\n\t    \t\t\t\t\tCollecting end-user feedback on the usability and effectiveness of your site\n\t    \t\t\t\t")])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-78938a26", module.exports)
  }
}

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', _vm._l((_vm.lists), function(list) {
    return _c('p', {
      staticClass: "ds-bg-neutral-warm-2 accommodations"
    }, [_c('span', {
      staticClass: "ds-font-weight-bold"
    }, [_vm._v(_vm._s(list.label) + ":")]), _vm._v(" "), _c('ul', {
      staticClass: "ds-list-unstyled"
    }, _vm._l((list.items), function(item) {
      return _c('li', [_c('a', {
        attrs: {
          "href": item.url,
          "target": "_blank"
        }
      }, [_vm._v(_vm._s(item.label))])])
    }))])
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-7c5783c3", module.exports)
  }
}

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "ah-article ah-article--left"
  }, [_c('span', {
    staticClass: "ds-icon-link-external ah-article__box"
  }), _vm._v(" "), _c('a', {
    staticClass: "link",
    attrs: {
      "href": _vm.link,
      "target": "_blank"
    }
  }, [_c('span', {
    staticClass: "link-text"
  }, [_vm._v(_vm._s(_vm.linkTitle))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-7eb3350d", module.exports)
  }
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-cf-xs"
  }, [_c('div', {
    staticClass: "ds-col-xs-10 ds-offset-xs-1 ds-col-md-8 ds-offset-md-2 ds-col-lg-8 ds-offset-lg-2 ds-align-text-left"
  }, [_c('ul', {
    staticClass: "ds-padding-0"
  }, [_c('li', {
    staticClass: "ds-display-inline-block"
  }, [_c('router-link', {
    staticClass: "ds-text-neutral-cool-4 ds-text-small",
    attrs: {
      "to": {
        name: 'overview'
      }
    }
  }, [_vm._v("Home")])], 1), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-neutral-cool-4 ds-text-small"
  }, [_vm._v(">")]), _vm._v(" "), _c('li', {
    staticClass: "ds-display-inline-block ds-text-blue-dull-4 ds-text-small ds-font-weight-normal"
  }, [_vm._v(_vm._s(_vm.child))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-81636c26", module.exports)
  }
}

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h2', {
    staticClass: "ds-heading-xs-3 ds-heading-sm-3 ds-heading-md-3 ds-heading-lg-2 ds-heading-xl-2"
  }, [_vm._v(_vm._s(_vm.heading))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-830d997e", module.exports)
  }
}

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Single Sign On (SSO) Authentication"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n                There are two SSO services that can be used by IBM applications:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_c('span', {
    staticClass: "ds-label"
  }, [_vm._v("w3id")]), _vm._v(" (for authenticating IBM employees and contractors)\n                ")]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "ds-label"
  }, [_vm._v("IBMid")]), _vm._v(" (for authenticating IBM customers, business partners, as well as IBM employees and contractors)\n                ")])]), _vm._v(" "), _c('p', [_vm._v("\n                If your application is purely for IBM employees or contractors, always choose w3id. SSO boarding into either IBMid or w3id is self-service and free, and allows you to control your development, test, and production timelines.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                If you have questions about boarding, you can visit the "), _c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-forum",
      "target": "_blank"
    }
  }, [_vm._v("w3id Forum")]), _vm._v(". Additionally, there is a Q&A conference call (twice a week) to discuss issues - see "), _c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-forum",
      "target": "_blank"
    }
  }, [_vm._v("w3id Forum")]), _vm._v(" for more details.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("w3id Technical Details")]), _vm._v(" "), _c('p', [_vm._v("\n                w3id is a cloud-hosted authentication service for authenticating IBM employees and contractors. It is directly accessible from the internet so it can support external mobile devices and cloud services off the VPN. In addition to basic authentication, the new, responsive design of the w3id authentication page:\n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("\n                  Inspects your device,\n                ")]), _vm._v(" "), _c('li', [_vm._v("\n                  Provides "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("multi-factor")]), _vm._v(" authentication, and  \n                ")]), _vm._v(" "), _c('li', [_vm._v("\n                  Fingerprints your device so that users can be recognized upon returning to the application without having to sign-in every time. \n                ")])]), _vm._v(" "), _c('p', [_vm._v("\n                w3id supports the SAML and OIDC SSO protocols for integrating with applications. For third-party applications (not hosted in an IBM data center), it's recommended to use the SAML protocol due to web application firewall rate limiting for unknown IP addresses.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("w3id SSO Protocols")]), _vm._v(" "), _c('p', [_vm._v("\n                An \"SSO protocol\" is the contract on how security data flows between the application and the identity provider. To determine which w3id SSO protocol to use with your application - either SAML or OpenID Connect (OIDC) visit "), _c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-boarding",
      "target": "_blank"
    }
  }, [_vm._v("w3id Boarding Guidance")]), _vm._v(" for guidance on how to integrate your application with either SSO protocol. A general rule of thumb is that Cloud applications (not hosted in IBM data centers) should use SAML while internal IBM applications will benefit more from OIDC. OIDC provides a secure token that can be passed from web applications to REST APIs to authenticate users. \n              ")]), _vm._v(" "), _c('h2', [_vm._v("w3id SSO Providers")]), _vm._v(" "), _c('p', [_vm._v("\n                A \"provider\" is really a \"provider environment\" that refers to which w3id environment you are interested in boarding into. To determine which w3id SSO provider to use with your application (w3id Test, Stage, or Production), see guidance for "), _c('a', {
    attrs: {
      "href": "https://ibm.biz/choosing_a_sso_provider",
      "target": "_blank"
    }
  }, [_vm._v("choosing an SSO provider")]), _vm._v(". \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                The provider choices include Test, Staging, and Production. You may want to test in w3id Test or w3id Staging, depending on your needs. w3id Test uses a test Bluepages LDAP, so you can use your own test ID and create other test IDs for various different scenarios. Every IBM'r has an ID already on test Bluepages, but it's not necessarily the same password you normally use on production Bluepages, i.e., when logging into test LDAP the first time, you have to set your w3id password (either the same as or different from your ID on production Bluepages). w3id Staging uses production Bluepages LDAP. Therefore, all IBM'rs can login to w3id Staging just like they would login to w3id Production, which obviously also uses production Bluepages.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Another difference between providers is the ability to make boarding changes quickly in w3id Test/Staging (within 1 hour), while it takes 24 hours to make a boarding change in w3id Production (please note that changes are activated at 05:00am GMT daily). It's best to use w3id Test or w3id Staging to get you setup correctly and to learn what settings should be used prior to trying to board into w3id Production. w3id Production should be used once your app is ready to deploy to production.")]), _vm._v(" "), _c('p', [_vm._v("\n                To start your self-service SSO boarding, go to the "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/tools/sso",
      "target": "_blank"
    }
  }, [_vm._v("Provisioner Tool")]), _vm._v(".\n              ")]), _vm._v(" "), _c('h2', [_vm._v("IBMid")]), _vm._v(" "), _c('p', [_vm._v("\n                IBMid is a cloud-hosted authentication service for authenticating IBM customers and business partners. Anyone can request an IBMid so ensure you use the proper authorization if the content is not for the world to see. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                IBMid is federated with w3id, so IBMers can authenticate with their w3id through the IBMid service. For more information about IBMid, see the "), _c('a', {
    attrs: {
      "href": "https://ibm.biz/blueid-info",
      "target": "_blank"
    }
  }, [_vm._v("IBMid Community")]), _vm._v(".\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Note: IBMid only supports OIDC at this time.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Other helpful links")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unstyled"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "https://w3.ibm.com/tools/sso",
      "target": "_blank"
    }
  }, [_vm._v("SSO Boarding")])]), _c('br'), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "http://ibm.biz/w3id-info",
      "target": "_blank"
    }
  }, [_vm._v("w3ID Wiki")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-faq",
      "target": "_blank"
    }
  }, [_vm._v("w3ID FAQ")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-forum",
      "target": "_blank"
    }
  }, [_vm._v("w3ID Forum")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-wall",
      "target": "_blank"
    }
  }, [_vm._v("w3ID Features")])]), _c('br'), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/blueid-info",
      "target": "_blank"
    }
  }, [_vm._v("IBMid Wiki")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-faq",
      "target": "_blank"
    }
  }, [_vm._v("IBMid FAQ")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/w3id-faq",
      "target": "_blank"
    }
  }, [_vm._v("IBMid Forum")])]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://ibm.biz/blueid-wall",
      "target": "_blank"
    }
  }, [_vm._v("IBMid Features")])])])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-832a9586", module.exports)
  }
}

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-tabs"
  }, [_c('div', {
    staticClass: "ds-tab-controls ds-scrollable ds-col-12 ds-padding-top-0 ds-padding-bottom-0 ds-margin-bottom-0"
  }, _vm._l((_vm.tabs), function(tab) {
    return _c('router-link', {
      key: tab.label,
      staticClass: "ds-button ds-primary",
      class: {
        'ds-selected': tab.selected
      },
      attrs: {
        "to": {
          path: tab.url
        }
      }
    }, [_vm._v(_vm._s(tab.label))])
  }))])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-99af7aa6", module.exports)
  }
}

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Measuring user experience metrics"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('p', [_vm._v("\n                In addition to measuring traffic metrics, clicks, etc., it is vital to determine whether a site is successful from a userâ€™s perspective. Site development should be following a user-centered design process within which there are multiple activities that measure user sentiment. Additionally (and even for sites that have not followed this approach), sites and applications should be measuring sentiment on a regular basis.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Net Promoter ScoreÂ® (NPS)")]), _vm._v(" "), _c('p', [_vm._v("\n                The primary measure utilized today to assess success or failure from an end user perspective is the Net Promoter ScoreÂ® (NPS), which is an industry-accepted measurement of customer or user loyalty to a product or service.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                NPS is assessed by asking users to rate their likelihood to recommend an application to colleagues. Respondents provide a rating on an 11-point scale with 0 being â€œNot at all likelyâ€ and 10 being â€œExtremely likely.â€\n              ")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(78),
      "alt": "â€â€"
    }
  }), _vm._v(" "), _c('p', [_vm._v("\n                Note:\n              ")]), _vm._v(" "), _c('ol', {
    staticClass: "ds-list-ordered"
  }, [_c('li', [_vm._v("You "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("must")]), _vm._v(" use the standard wording shown above.")]), _vm._v(" "), _c('li', [_vm._v("You "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("must not")]), _vm._v(" color code or label the points on the survey shown to end users.")])]), _vm._v(" "), _c('p', [_vm._v("\n                We understand that this question can seem odd in the context of applications for which users do not have a choice in using - many of our internal sites fall into this category - but research has shown that users can still answer this question meaningfully.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                In order to convert these ratings into a Net Promoter ScoreÂ®, a three step process is followed:\n              ")]), _vm._v(" "), _c('h3', [_vm._v("Step 1: Responses are classified into categories")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Detractors: 0 to 6")]), _vm._v(" "), _c('li', [_vm._v("Passives or Neutrals: 7 or 8")]), _vm._v(" "), _c('li', [_vm._v("Promoters: 9 or 10")])]), _vm._v(" "), _c('p', [_vm._v("\n                A key element of Net Promoter ScoreÂ® is that â€œPassiveâ€ responses are ignored in its calculation â€“ those not familiar with NPS would assume that a 7 or 8 on an 11-point scale would be a â€œpositiveâ€ response, but NPS treats them as â€œneutral.â€ Further, a response of 6, which is above the midpoint of the scale, is treated as a "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("negative")]), _vm._v(" response. In other words, NPS is an intentionally skewed score â€“ it is important that this skewing is not conveyed to the respondent (the respondent may in fact believe that 6-8 is a positive score).\n              ")]), _vm._v(" "), _c('h3', [_vm._v("Step 2: The percentage of responses for each category is calculated")]), _vm._v(" "), _c('p', [_vm._v("\n                For example, the percentage of Promoters is calculated by dividing the number of responses in the Promoters category by the total number of responses to the question.\n              ")]), _vm._v(" "), _c('h3', [_vm._v("Step 3: Subtract the percentage of Detractors from the percentage of Promoters")]), _vm._v(" "), _c('p', [_vm._v("\n                The percentage of â€œDetractorâ€ responses is subtracted from the percentage of â€œPromoterâ€™ responses, yielding a number than can range from -100 (all responses are Detractors) to +100 (all responses are Promoters). \n              ")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(79),
      "alt": "â€â€"
    }
  }), _vm._v(" "), _c('h3', [_vm._v("Evaluating the NPS Score")]), _vm._v(" "), _c('p', [_vm._v("\n                One of the compelling values of NPS is that it allows us to compare the value across sites (as long as sites are asking the question in the same way). Based on industry bookmarks, a â€œgradeâ€ can be applied to the following numerical scores:\n              ")]), _vm._v(" "), _c('div', {
    staticClass: "ds-table-container ds-margin-bottom-1"
  }, [_c('table', {
    staticClass: "ds-table ds-striped guidance-table"
  }, [_c('thead', [_c('tr', [_c('th', [_vm._v("NPS")]), _vm._v(" "), _c('th', [_vm._v("Grade")])])]), _vm._v(" "), _c('tbody', [_c('tr', [_c('td', [_vm._v("+41 to +100")]), _vm._v(" "), _c('td', [_vm._v("Excellent")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("+26 to +40")]), _vm._v(" "), _c('td', [_vm._v("Above average")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("+9 to +25")]), _vm._v(" "), _c('td', [_vm._v("Average")])]), _vm._v(" "), _c('tr', [_c('td', [_c('span', {
    staticClass: "ds-text-contextual-red-4"
  }, [_vm._v("-26")]), _vm._v(" to +8")]), _vm._v(" "), _c('td', [_vm._v("Below average")])]), _vm._v(" "), _c('tr', [_c('td', [_c('span', {
    staticClass: "ds-text-contextual-red-4"
  }, [_vm._v("-100")]), _vm._v(" to "), _c('span', {
    staticClass: "ds-text-contextual-red-4"
  }, [_vm._v("-27")])]), _vm._v(" "), _c('td', [_vm._v("Failing")])])])])]), _vm._v(" "), _c('p', [_vm._v("\n                Additional NPS information can be found "), _c('a', {
    attrs: {
      "href": "https://ibm.box.com/s/synzu4p5wlbqn8dmyhsj0kqdbnqt42sk",
      "target": "_blank"
    }
  }, [_vm._v("here")]), _vm._v(".\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Collecting Feedback Ratings")]), _vm._v(" "), _c('p', [_vm._v("\n                We are currently evaluating two tools, Usabilla and Medallia, as the strategic approach for collecting user feedback on internal web sites. Both tools provide the ability to add a feedback mechanism to the site and capability to conduct a â€œcampaignâ€ where a portion of users are specifically prompted to provide feedback.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                This page will be updated when the decision is made on the strategic tool to be used (planned by the end of 1Q2018). In the meantime, you can contact "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/bluepages/profile.html?uid=986894897",
      "target": "_blank"
    }
  }, [_vm._v("Claude Elie")]), _vm._v(" for assistance.\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Additional Sentiment Metrics and Ad Hoc Feedback")]), _vm._v(" "), _c('p', [_vm._v("\n                Your deployed site should include a method for users to provide ad hoc feedback (e.g., by clicking a Feedback link, button, etc.). However, that feedback mechanism should not include NPS. NPS should, instead, be collected via an interrupt survey or through a separate campaign/survey where a random selection of users can be contacted.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Although NPS is the primary metric that should be collected on a deployed site, you should consider whether "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("additional")]), _vm._v(" metrics are beneficial for your site or application. For example, you may want to collect separate satisfaction ratings for content, design or performance. As with NPS this information is best collected from a random sample of users (e.g. interrupt survey or email campaign). Our advice is to be selective in what you ask, as long surveys are less likely to be completed by respondents.\n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                Free text feedback can also be extremely valuable to understand where users may be having problems with your site. If a user indicates that they are dissatisfied with the content on the page, that input can be difficult to act on if there is not description of the cause for the dissatisfaction.\n              ")]), _vm._v(" "), _c('p', {
    staticClass: "ds-text-small"
  }, [_vm._v("\n                Â®Net Promoter, Net Promoter system and NPS are registered trademarks of Bain & Company, Inc., Satmetrix Systems, Inc. and Fred Reichheld\n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-a86cefd2", module.exports)
  }
}

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Approaches to getting a site on the w3 Intranet"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Background")]), _vm._v(" "), _c('p', [_vm._v("\n              You want to publish a page or site to the intranet, to inform or make our employees more productive. There are several options for you to get content on the intranet, and your choice will be primarily driven by the type of site you need to build and the resources you have available to you. \n            ")]), _vm._v(" "), _c('p', [_vm._v("\n              The table below summarizes some of the major options, and the characteristics of each.\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "ds-table-container"
  }, [_c('table', {
    staticClass: "ds-table ds-striped guidance-table"
  }, [_vm._m(0), _vm._v(" "), _c('tbody', [_c('tr', [_c('td', [_vm._v("Custom w3DS-based Site")]), _vm._v(" "), _c('td', [_vm._v("Any site with advanced interation, interfaces with back-end systems, or those needing new UI components")]), _vm._v(" "), _c('td', [_vm._v("A scrum team (product owner, interation manager, designers, and developers")]), _vm._v(" "), _c('td', [_vm._v("Greatest flexibility, highest cost. "), _c('router-link', {
    attrs: {
      "to": 'hosting'
    }
  }, [_vm._v("Requires hosting - see technical guidance here.")])], 1)]), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._m(3)])])]), _vm._v(" "), _c('h2', [_vm._v("Decision tree")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(76),
      "alt": "â€â€"
    }
  })])])])], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('tr', [_c('th', [_vm._v("Method")]), _vm._v(" "), _c('th', [_vm._v("Best for...")]), _vm._v(" "), _c('th', [_vm._v("Resources needed")]), _vm._v(" "), _c('th', [_vm._v("Notes")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "https://w3.ibm.com/w3publisher",
      "target": "_blank"
    }
  }, [_vm._v("w3 Publisher")]), _vm._v(" â€“ a simple, â€œwhat you see is what you getâ€ content publisher that uses w3DS components")]), _vm._v(" "), _c('td', [_vm._v("Content sites requiring little collaboration and no interaction with back-end systems")]), _vm._v(" "), _c('td', [_vm._v("One or more people open to trying the tool")]), _vm._v(" "), _c('td', [_vm._v("Available starting January 15th, 2018, in pilot")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', [_c('td', [_c('a', {
    attrs: {
      "href": "https://w3.ibm.com/connections",
      "target": "_blank"
    }
  }, [_vm._v("IBM Connections")]), _vm._v(" â€“ provides communities and wikis that can be used to post content")]), _vm._v(" "), _c('td', [_vm._v("Sites focused on collaboration, such as forums, blogs looking for responses, and wikis seeking company-wide editing")]), _vm._v(" "), _c('td', [_vm._v("Experience with Connections")]), _vm._v(" "), _c('td', [_vm._v("Limited options for customizing design. (Other options available for posting content â€“ e.g., Box)")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('tr', [_c('td', [_vm._v("Custom site that does not use w3DS")]), _vm._v(" "), _c('td', [_vm._v("Sites that cannot use w3DS for user experience reasons")]), _vm._v(" "), _c('td', [_vm._v("A scrum team (product owner, interation manager designers, and developers)")]), _vm._v(" "), _c('td', [_vm._v("You assume full responsibility for creating a good site, including user experience, accessibility, legal, hosting/architecture standards, and et al.")])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-bdbcdf1a", module.exports)
  }
}

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('dsHero', {
    staticClass: "landing-hero",
    attrs: {
      "title": "Masthead and footer page elements"
    }
  }), _vm._v(" "), _c('div', [_c('dsLeftnav'), _vm._v(" "), _vm._m(0)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ds-col-md-8 ds-col-lg-8 ds-align-text-left ds-padding-bottom-2"
  }, [_c('div', {
    staticClass: "ds-row ds-margin-bottom-1"
  }, [_c('div', {
    staticClass: "ds-offset-1 ds-col-11 ds-padding-top-1"
  }, [_c('h2', [_vm._v("Masthead")]), _vm._v(" "), _c('p', [_vm._v("\n                A website masthead typically provides a site title and navigational elements (menus, search field, etc.) for a site. Traditionally, we have required intranet sites to have a separate â€œw3 mastheadâ€ that included links to other intranet resources. In some cases, this resulted in a â€œstacked mastheadâ€ on sites where both a site masthead and a w3 masthead was included. \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                We have made two changes to intranet guidelines to allow teams more flexibility and to provide a simpler experience for end users. \n              ")]), _vm._v(" "), _c('ol', {
    staticClass: "ds-list-ordered"
  }, [_c('li', [_vm._v("We have created a more compact component - a masthead ribbon - with enhanced functionality. ")]), _vm._v(" "), _c('li', [_vm._v("We are "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("not requiring")]), _vm._v(" the use of the new masthead ribbon, though we "), _c('span', {
    staticClass: "ds-font-weight-bold"
  }, [_vm._v("strongly recommend including it")]), _vm._v(" due to the benefits it provides to your users and your team. ")])]), _vm._v(" "), _c('h3', [_vm._v("Benefits to end users")]), _vm._v(" "), _c('p', [_vm._v("\n                Including the masthead ribbon on your site provides significant benefits to your users through very little effort on the part of your team: \n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("Visually ties your site to w3 (users will understand they are on an intranet page) ")]), _vm._v(" "), _c('li', [_vm._v("Allows users quick access to BluePages and w3 Search ")]), _vm._v(" "), _c('li', [_vm._v("Includes a version of the â€œPlacesâ€ icons from the w3 home page so that users can access the most used intranet sites with one click")])]), _vm._v(" "), _c('h3', [_vm._v("Benefits to your team")]), _vm._v(" "), _c('p', [_vm._v("\n                The masthead ribbon was developed to have the simplest possible installation so that using it would provide significant value with minimal effort: \n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_vm._v("It is controlled remotely so your team will never need to replace it with a new version â€“ it will automatically update with bugs fixes and new features ")]), _vm._v(" "), _c('li', [_vm._v("Usage metrics (page loads, visitors, etc.) are automatically collected for any page that includes the ribbon (via CoreMetrics)")])]), _vm._v(" "), _c('h3', [_vm._v("Usage and installation")]), _vm._v(" "), _c('p', [_vm._v("\n                For instructions on installing and using the masthead ribbon, visit the "), _c('a', {
    attrs: {
      "href": "https://w3.ibm.com/w3-masthead",
      "target": "_blank"
    }
  }, [_vm._v("w3 Masthead Installation page")]), _vm._v(".\n              ")]), _vm._v(" "), _c('h2', [_vm._v("Footer")]), _vm._v(" "), _c('h3', [_vm._v("Background")]), _vm._v(" "), _c('p', [_vm._v("\n                A footer is a common element that appears at the bottom of web pages and include related or supporting links.  \n              ")]), _vm._v(" "), _c('p', [_vm._v("\n                We recommend that you include a footer on your pages that provides a few standard links to intranet resources and other links that are relevant to your site. \n              ")]), _vm._v(" "), _c('h3', [_vm._v("Footer look and feel")]), _vm._v(" "), _c('p', [_vm._v("\n                The w3DS Documentation site provides a "), _c('a', {
    attrs: {
      "href": "https://pages.github.ibm.com/w3/w3ds/documentation/footer",
      "target": "_blank"
    }
  }, [_vm._v("description and code elements for implementing a footer")]), _vm._v(". The typical instance of a footer has site- or page-specific links near the top, and links common to most intranet pages below a divider. We do provide standard pages for these intranet-wide links (see below). \n              ")]), _vm._v(" "), _c('img', {
    staticClass: "ds-img-responsive ds-border-neutral-warm-2 eco-img",
    attrs: {
      "src": __webpack_require__(77),
      "alt": "â€â€"
    }
  }), _vm._v(" "), _c('h3', [_vm._v("Standard w3 intranet-wide links")]), _vm._v(" "), _c('p', [_vm._v("\n                The following links should be included in your footer: \n              ")]), _vm._v(" "), _c('ul', {
    staticClass: "ds-list-unordered"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": "http://w3-03.ibm.com/w3/info_terms_of_use.html",
      "target": "_blank"
    }
  }, [_vm._v("Terms of use")]), _vm._v(". We recommend including this link to help meet legal compliance. ")]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://prdghouwasvip.w3-969.ibm.com/workplace/was/feedback/feedback.jsp",
      "target": "_blank"
    }
  }, [_vm._v("Feedback")]), _vm._v(". The feedback page enables users to raise issues or compliments on any intranet page. This feedback is either responded to by a central team or routed to an appropriate person based on the site. ")]), _vm._v(" "), _c('li', [_c('a', {
    attrs: {
      "href": "https://w3.ibm.com/w3/access-stmt.html",
      "target": "_blank"
    }
  }, [_vm._v("Accessibility")]), _vm._v(". Intranet pages have features useful to users employing assistive technology â€“ those features are described on this page. ")])]), _vm._v(" "), _c('p', [_vm._v("\n                Please note that these pages are currently being reviewed for content and will be updated using w3DS but the URLs will remain the same. \n              ")])])])])
}]}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-c1207236", module.exports)
  }
}

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "app"
    }
  }, [_c('router-view')], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-d05f720c", module.exports)
  }
}

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('button', {
    staticClass: "ds-button ds-basic ds-width-auto ds-icon-caret-left ds-icon-button-neutral ds-margin-top-4",
    on: {
      "click": _vm.back
    }
  }, [_vm._v("\n\tGo Back\n")])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(0).rerender("data-v-d80c2766", module.exports)
  }
}

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.8.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.8.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("3be0cc9e", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(34, function() {
     var newContent = __webpack_require__(34);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("45dc32c4", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(35, function() {
     var newContent = __webpack_require__(35);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(36);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("18e3d384", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(36, function() {
     var newContent = __webpack_require__(36);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("05349d14", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(37, function() {
     var newContent = __webpack_require__(37);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("1ce24ffa", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(38, function() {
     var newContent = __webpack_require__(38);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("cd53b408", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(39, function() {
     var newContent = __webpack_require__(39);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("9a5dd20c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(40, function() {
     var newContent = __webpack_require__(40);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(41);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("3583f188", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(41, function() {
     var newContent = __webpack_require__(41);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("2f1c4619", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(42, function() {
     var newContent = __webpack_require__(42);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("568e8c8c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(43, function() {
     var newContent = __webpack_require__(43);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("dd17baee", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(44, function() {
     var newContent = __webpack_require__(44);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("17b3fe66", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(45, function() {
     var newContent = __webpack_require__(45);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("f96a938c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(46, function() {
     var newContent = __webpack_require__(46);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("7cc7177a", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(47, function() {
     var newContent = __webpack_require__(47);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("5d441674", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(48, function() {
     var newContent = __webpack_require__(48);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("8c986638", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(49, function() {
     var newContent = __webpack_require__(49);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("0afce783", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(50, function() {
     var newContent = __webpack_require__(50);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("12a86418", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(51, function() {
     var newContent = __webpack_require__(51);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("6f3df257", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(52, function() {
     var newContent = __webpack_require__(52);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("7332f83c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(53, function() {
     var newContent = __webpack_require__(53);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("dda5b2c8", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(54, function() {
     var newContent = __webpack_require__(54);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("33481b94", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(55, function() {
     var newContent = __webpack_require__(55);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("eea58038", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(56, function() {
     var newContent = __webpack_require__(56);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("600ee310", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(57, function() {
     var newContent = __webpack_require__(57);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("523d789c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(58, function() {
     var newContent = __webpack_require__(58);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("de09a6fa", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(59, function() {
     var newContent = __webpack_require__(59);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("b9cc4708", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(60, function() {
     var newContent = __webpack_require__(60);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("a8169388", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(61, function() {
     var newContent = __webpack_require__(61);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("d0529f28", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(62, function() {
     var newContent = __webpack_require__(62);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("1c072b1a", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(63, function() {
     var newContent = __webpack_require__(63);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 185 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export Store */
/* unused harmony export install */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v2.5.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.5.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),
/* 187 */,
/* 188 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'back',
  props: {

  },
  methods: {
    back: function (ev) {
      window.history.back();
    },
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'bigcrumbs',
  props: {
    grandparent: String,
    grandparentLink: String,
    parent: String,
    parentLink: String,
    child: String
  },
  methods: {
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'breadcrumbs',
  props: {
    parent: String,
    parentLink: String,
    child: String
  },
  methods: {
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'checkLink',
  props: {
    linkTitle: String,
    link: String
  },
  methods: {

  },
  data: function () {
    return {
    }
  }
});

/***/ }),
/* 192 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'externalLink',
  props: {
    linkTitle: String,
    link: String
  },
  methods: {

  },
  data: function () {
    return {
    }
  }
});

/***/ }),
/* 193 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'footing',
  props: {

  },
  methods: {
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 194 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'hero',
  props: {
  	heading: String,
    title: String,
    image: String,
    overview: String,
    subtext: String,
    button: String,
    id: String
  },
  methods: {
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 195 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'leftnav',
  props: {

  },
  methods: {
  	toggleItem: function() {
  		this.toggled = !this.toggled;
  	}
  },
  data: function () {
    return {
    	toggled: false
    }
  }
});


/***/ }),
/* 196 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__accordion_accordion_vue__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__accordion_accordion_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__accordion_accordion_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__back_back_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__back_back_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__back_back_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bigcrumbs_bigcrumbs_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bigcrumbs_bigcrumbs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__bigcrumbs_bigcrumbs_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__breadcrumbs_breadcrumbs_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__breadcrumbs_breadcrumbs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__breadcrumbs_breadcrumbs_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__checkLink_checkLink_vue__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__checkLink_checkLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__checkLink_checkLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__externalLink_externalLink_vue__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__externalLink_externalLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__externalLink_externalLink_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__footer_footer_vue__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__footer_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__footer_footer_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__hero_hero_vue__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__hero_hero_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__hero_hero_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__leftnav_leftnav_vue__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__leftnav_leftnav_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__leftnav_leftnav_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__masthead_masthead_vue__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__masthead_masthead_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__masthead_masthead_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__overlay_overlay_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__overlay_overlay_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__overlay_overlay_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__smallcrumbs_smallcrumbs_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__smallcrumbs_smallcrumbs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__smallcrumbs_smallcrumbs_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__tabs_tabs_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__tabs_tabs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__tabs_tabs_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__text_headings_vue__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__text_headings_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__text_headings_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__text_subheadings_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__text_subheadings_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__text_subheadings_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__text_smallheadings_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__text_smallheadings_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__text_smallheadings_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__lists_groupedLists_vue__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__lists_groupedLists_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__lists_groupedLists_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__search_search_vue__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__search_search_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__search_search_vue__);



















const COMPONENT_PREFIX = 'ds';

const components = [
	__WEBPACK_IMPORTED_MODULE_0__accordion_accordion_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__back_back_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_2__bigcrumbs_bigcrumbs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_3__breadcrumbs_breadcrumbs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_4__checkLink_checkLink_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_5__externalLink_externalLink_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_6__footer_footer_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_16__lists_groupedLists_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_7__hero_hero_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_8__leftnav_leftnav_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_9__masthead_masthead_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_10__overlay_overlay_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_13__text_headings_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_11__smallcrumbs_smallcrumbs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_15__text_smallheadings_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_14__text_subheadings_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_12__tabs_tabs_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_17__search_search_vue___default.a
];

const capitalize = function (str) {
  try {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } catch (er) {
    throw 'Invalid string provided:' + str;
  }
};

function install(Vue, options) {
  components.forEach(function (c) {
    Vue.component(COMPONENT_PREFIX + capitalize(c.name), c);
  });
}

var w3dsComponents = {
  install: install
}

/* harmony default export */ __webpack_exports__["a"] = (w3dsComponents);


/***/ }),
/* 197 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
    name: "overlay",
    props: ["overlay"],
    components: {},
    methods: {
      openOverlay: function (ev) {
        var overlay = document.querySelector('.ds-overlay');
        var isOpen = overlay.classList.contains('.ds-open');

        if (isOpen === false ) {
          overlay.classList.add('ds-open');
        }
      },
      closeOverlay: function (ev) {
        var overlay = document.querySelector('.ds-overlay');
        var body = document.querySelector('body');
        overlay.classList.remove('ds-open');
        body.removeAttribute("style");
      }
    },
    data () {
      return {

      }
    }
});

/***/ }),
/* 198 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'smallcrumbs',
  props: {
    child: String
  },
  methods: {
  },
  data: function () {
    return {
    }
  }
});


/***/ }),
/* 199 */
/***/ (function(module, exports) {

/** This file is separated from client.js so it can be loaded independently during unit testing.
 -----------------------------------------------------------------------------*/

/**
 * Global Local Storage prefix
 * @global
 */
window.LOCAL_STORAGE_PREFIX = 'w3dev-';

/**
 * App parent <div> selector
 * @global
 */
window.APP_PARENT_SELECTOR = '#app-anchor';

/**
 * Page parent <div> selector
 * @global
 */
window.PAGE_PARENT_SELECTOR = '#page-anchor';

/** Virtual namespaces
 -----------------------------------------------------------------------------*/

/**
 * Top-level namespace
 * @name w3dev
 * @namespace
 */

/**
 * Pages sub-namespace
 * @name w3dev.pages
 * @namespace
 */

/**
 * Components sub-namespace
 * @name w3dev.components
 * @namespace
 */

/**
 * Models sub-namespace
 * @name w3dev.models
 * @namespace
 */

/** Vendor docs
 -----------------------------------------------------------------------------*/

/**
 * XHR Library
 * @external Axios
 * @see {@link https://github.com/mzabriskie/axios}
 */

/**
 * Console log library
 * @external Debug
 * @see {@link https://github.com/visionmedia/debug}
 */

/**
 * Lodash documentation
 * @external Lodash
 * @see {@link https://lodash.com/}
 */

/**
 * Vue documentation
 * @external Vue
 * @see {@link https://vuejs.org/v2/api/}
 */

/**
 * Router documentation <br/>
 * {@link http://router.vuejs.org/en/}
 * @function Router
 * @memberof external:Vue
 */


/***/ }),
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Accessibility
 * @name Accessibility
 * @memberof pages
 * @constructs pages.Accessibility
 */
const accessibility = {

  data() {
    return {

    };
  },
};

/* harmony default export */ __webpack_exports__["default"] = (accessibility);


/***/ }),
/* 201 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

/**
 * Analytics
 * @name Analytics
 * @memberof pages
 * @constructs pages.Analytics
 */
const analytics = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (analytics);


/***/ }),
/* 202 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Authentication
 * @name Authentication
 * @memberof pages
 * @constructs pages.Authentication
 */
const authentication = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (authentication);


/***/ }),
/* 203 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * DesignStandards
 * @name DesignStandards
 * @memberof pages
 * @constructs pages.DesignStandards
 */
const design_standards = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (design_standards);


/***/ }),
/* 204 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Feedback
 * @name Feedback
 * @memberof pages
 * @constructs pages.Feedback
 */
const feedback = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (feedback);


/***/ }),
/* 205 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Hosting
 * @name Hosting
 * @memberof pages
 * @constructs pages.Hosting
 */
const hosting = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (hosting);


/***/ }),
/* 206 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Landing
 * @name Landing
 * @memberof pages
 * @constructs pages.Landing
 */
const landing = {

  /**
   * Variable instances for view
   * @memberof page.Landing
   */
  data() {
    return {

    };
  },
  methods: {
    usabilla: function(){
      window.usabilla_live("click");
    }
  },
};

/* harmony default export */ __webpack_exports__["default"] = (landing);


/***/ }),
/* 207 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Masthead_Footer
 * @name Masthead_Footer
 * @memberof pages
 * @constructs pages.Masthead_Footer
 */
const masthead_footer = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (masthead_footer);


/***/ }),
/* 208 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Search_optimization
 * @name Search_optimization
 * @memberof pages
 * @constructs pages.Search_optimization
 */
const search_optimization = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (search_optimization);


/***/ }),
/* 209 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * SiteBuilding
 * @name SiteBuilding
 * @memberof pages
 * @constructs pages.SiteBuilding
 */
const site_building = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (site_building);


/***/ }),
/* 210 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Support
 * @name Support
 * @memberof pages
 * @constructs pages.Support
 */
const support = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (support);


/***/ }),
/* 211 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Urls
 * @name Urls
 * @memberof pages
 * @constructs pages.Urls
 */
const urls = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (urls);


/***/ }),
/* 212 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Usability
 * @name Usability
 * @memberof pages
 * @constructs pages.Usability
 */
const usability = {

  data() {
    return {

    };
  },

};

/* harmony default export */ __webpack_exports__["default"] = (usability);


/***/ }),
/* 213 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_landing_landing_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_landing_landing_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__pages_landing_landing_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_masthead_footer_masthead_footer_vue__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_masthead_footer_masthead_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__pages_masthead_footer_masthead_footer_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_analytics_analytics_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_analytics_analytics_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__pages_analytics_analytics_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_accessibility_accessibility_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_accessibility_accessibility_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__pages_accessibility_accessibility_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_site_building_site_building_vue__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_site_building_site_building_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__pages_site_building_site_building_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_hosting_hosting_vue__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_hosting_hosting_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__pages_hosting_hosting_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_authentication_authentication_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_authentication_authentication_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__pages_authentication_authentication_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_support_support_vue__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_support_support_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__pages_support_support_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_usability_usability_vue__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_usability_usability_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__pages_usability_usability_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_feedback_feedback_vue__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_feedback_feedback_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__pages_feedback_feedback_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_urls_urls_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_urls_urls_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__pages_urls_urls_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_design_standards_design_standards_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_design_standards_design_standards_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__pages_design_standards_design_standards_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_search_optimization_search_optimization_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_search_optimization_search_optimization_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__pages_search_optimization_search_optimization_vue__);
// Imports
















/////// new page import dropzone ///////

// Use Vue's suggested router for now
__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

/**
 * Available routes
 * @memberof Router
 */
const routes = [
  { path: '/', name: 'home', component: __WEBPACK_IMPORTED_MODULE_2__pages_landing_landing_vue___default.a },
  { path: '/masthead-footer', name: 'masthead-footer', component: __WEBPACK_IMPORTED_MODULE_3__pages_masthead_footer_masthead_footer_vue___default.a },
  { path: '/analytics', name: 'analytics', component: __WEBPACK_IMPORTED_MODULE_4__pages_analytics_analytics_vue___default.a },
  { path: '/accessibility', name: 'accessibility', component: __WEBPACK_IMPORTED_MODULE_5__pages_accessibility_accessibility_vue___default.a },
  { path: '/site-building', name: 'site-building', component: __WEBPACK_IMPORTED_MODULE_6__pages_site_building_site_building_vue___default.a },
  { path: '/hosting', name: 'hosting', component: __WEBPACK_IMPORTED_MODULE_7__pages_hosting_hosting_vue___default.a },
  { path: '/authentication', name: 'authentication', component: __WEBPACK_IMPORTED_MODULE_8__pages_authentication_authentication_vue___default.a },
  { path: '/support', name: 'support', component: __WEBPACK_IMPORTED_MODULE_9__pages_support_support_vue___default.a },
  { path: '/usability', name: 'usability', component: __WEBPACK_IMPORTED_MODULE_10__pages_usability_usability_vue___default.a },
  { path: '/feedback', name: 'feedback', component: __WEBPACK_IMPORTED_MODULE_11__pages_feedback_feedback_vue___default.a },
  { path: '/urls', name: 'urls', component: __WEBPACK_IMPORTED_MODULE_12__pages_urls_urls_vue___default.a },
  { path: '/design-standards', name: 'design-standards', component: __WEBPACK_IMPORTED_MODULE_13__pages_design_standards_design_standards_vue___default.a },
  { path: '/search-optimization', name: 'search-optimization', component: __WEBPACK_IMPORTED_MODULE_14__pages_search_optimization_search_optimization_vue___default.a },
  /////// new page route dropzone ///////
  { path: '*', redirect: '/' },
];

/**
 * Router
 * @class
 * @name Router
 * @extends external:Vue.Router
 */
const router = new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
    routes,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 }
    }
  });

const scrollHistory = [];

router.beforeEach(function (to, from, next) {
  if (scrollHistory.length > 0 && scrollHistory[0].fullPath === to.fullPath) {
    let pos = scrollHistory.shift();
    window.scrollTo(pos.x, pos.y);
  } else {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

    var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

    scrollHistory.unshift({
      fullPath: from.fullPath,
      x: x,
      y: y
    })
    window.scrollTo(0, 0);
  }
  next();
}.bind(this ))

/* harmony default export */ __webpack_exports__["a"] = (router);


/***/ }),
/* 214 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_debug___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_debug__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);



const actions = {
  search(context, searchTerm) {
    const url = '//testpcrwbluetap09.w3-969.ibm.com/myw3/unified-profile/v1/search/'
      + `user?searchConfig=optimized_search&rows=24&timeout=2000&query=${searchTerm}`;

    __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get(url)
      .then((response) => {
        __WEBPACK_IMPORTED_MODULE_0_debug___default.a.log('search action success');
        context.commit('populatePeopleSearchResults', response.data.results);
      });
  },
};

/* harmony default export */ __webpack_exports__["a"] = (actions);


/***/ }),
/* 215 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getters = {
  peopleSearchResults(state) {
    return state.peopleSearchResults;
  },
};

/* harmony default export */ __webpack_exports__["a"] = (getters);


/***/ }),
/* 216 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const mutations = {
  populatePeopleSearchResults(state, results) {
    const st = state;
    st.peopleSearchResults = results;
    return st;
  },
};

/* harmony default export */ __webpack_exports__["a"] = (mutations);


/***/ }),
/* 217 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getters__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mutations__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions__ = __webpack_require__(214);






__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */]);

const store = new __WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */].Store({
  // strict disallows state changes outside of Mutation functions
  strict: "development" === 'development',

  state: {
    peopleSearchResults: [],
  },

  getters: __WEBPACK_IMPORTED_MODULE_2__getters__["a" /* default */],
  mutations: __WEBPACK_IMPORTED_MODULE_3__mutations__["a" /* default */],
  actions: __WEBPACK_IMPORTED_MODULE_4__actions__["a" /* default */],
});

/* harmony default export */ __webpack_exports__["a"] = (store);


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(70);


/***/ })
/******/ ]);