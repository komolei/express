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
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
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
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b9645ca335479e14cf0a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
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
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
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
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
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
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
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
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
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
/******/ 	__webpack_require__.p = "./app/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);
__webpack_require__(2);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var blogEditBtn = document.querySelector('button');
blogEditBtn.addEventListener('click', function () {
    // let url='/blogEdit';
    // use Request and configuration parameter
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var content = document.getElementById('content').value;
    var data = new Object({
        title: title,
        author: author,
        content: content
    });
    data = JSON.stringify(data);
    // 设置post相关参数
    var hearders1 = {
        'Content-type': 'application/json'
    };

    var url = new Request('/blogEdit', {
        method: 'Post', headers: { //fuck I spell error this is headers and isn't hearders
            'Content-Type': 'application/json'
        }, body: data
    });

    fetch(url).then(function (response) {
        console.log("response:", response);
        return response.json();
    }).then(function (json) {
        console.log("this is response:", json);
    }).catch(function (error) {
        return console.log(error);
    });

    // fetch("/blogEdit",{
    //     method:'POST',
    //     headers:{
    //        'Content-Type': 'application/json'
    //     },
    //     body:JSON.stringify({
    //       name:'john',
    //       pass:'xioayuan'
    //     })
    //   })
    //   .then((response)=>response.json())
    //   .then((responseJsonData)=>{
    //     alert("请求成功");
    //     console.log(responseJsonData);
    //   })
    //   .catch((error)=>{
    //     alert(error);
    //   })
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//load aniamte
// let loadAniamte = () => {
//     let loadAniamte = document.getElementsByClassName('spinner')[0];
//     loadAniamte.classList.remove('hide');
// }
// let missAniamte = () => {
//     let loadAniamte = document.getElementsByClassName('spinner')[0];
//     loadAniamte.classList.add('hide');
// }
// //signIn
// let signInDialog = document.getElementById('signInDialog');
// signInDialog.addEventListener('click', () => {
//     document.getElementsByClassName('signInDialog')[0].classList.toggle('changeDialog');
// })
// let signInBtn = document.getElementById('signInBtn');
// console.log("signInBtn:", signInBtn);
var isLockUp = false;
signInBtn.addEventListener('click', function () {
    // loadAniamte();
    var loadAniamte = document.getElementsByClassName('spinner')[0];
    var email = document.getElementById('inputEmail').value;
    var username = document.getElementById('inputName').value;
    var password = document.getElementById('inputPassword').value;
    // empty password
    document.getElementById('inputPassword').value = '';
    console.log("username:", username, password);
    var xhr = new XMLHttpRequest(),
        method = 'POST',
        url = '/signIn';
    if (isLockUp) return;
    isLockUp = true;
    xhr.onreadystatechange = function (username, password) {
        // the data loaded,the loadAniamte miss
        // missAniamte();
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("gg", xhr.responseText);
            var text = xhr.responseText;
            document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'><span class='glyphicon glyphicon-user'></span>" + JSON.parse(text).username + "</a><span data-toggle='modal' data-target='#signOut'>Sign Out?</span>";
            // hide Dialog
            // document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
            var signIn = document.getElementById('signIn');
            // signIn.innerHTML=""
            signIn.parentNode.removeChild(signIn); //think it's error
            signIn.style.display = 'none';
            alert('sign In');
            return isLockUp = false;
        } else {
            //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
            //alert('sorry! Can"t find user');
            return isLockUp = false;
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send('email=' + email + '&username=' + username + '&password=' + password);
    //md. 一样的写法，现在就行了，idiot 🙄
});
//signUp
var changeSignUp = document.getElementById('changeSignUp');
changeSignUp.addEventListener('click', function () {
    console.log("fafadf");
    document.getElementById('signIn').classList.remove('in');
    // document.getElementById('signUpDialog').classList.add('show');
    // document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
});
// can't turn right road
// let changeSignIn = document.getElementById('changeSignIn');
// changeSignIn.addEventListener('click', () => {

//     document.getElementById('signUp').classList.remove('in');
//     // document.getElementById('signIn').setAttribute('style','display:block!important');
//     // document.getElementById('signIn').style.opacity = '33';

//     // document.getElementById('signUpDialog').classList.add('show');
//     // document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
// })
var signUpBtn = document.getElementById('signUpBtn');
signUpBtn.addEventListener('click', function () {
    var email = document.getElementById('inputEmail1').value;
    // regex 
    var one = void 0,
        two = void 0,
        three = void 0;

    var username = document.getElementById('inputName1').value;
    var password = document.getElementById('inputPassword1').value;
    var surePassword = document.getElementById('inputSurePassword1').value;
    // document.getElementById('inputEmail1').value;
    // document.getElementById('inputName1').value;
    /\w{3,10}@?\w{2,}[.]\w{2,4}/.test(email) ? one = true : console.log("email format error");
    /\w{6,}/.test(username) ? two = true : console.log("username error");
    /\S{6,12}/.test(password) ? three = true : console.log("password error");
    document.getElementById('inputPassword1').value = '';
    document.getElementById('inputSurePassword1').value = '';
    // loadAniamte();
    if (one && two && three && password === surePassword) {
        var xhr = new XMLHttpRequest(),
            method = 'POST',
            url = '/signUp';
        if (isLockUp) return;
        isLockUp = true;
        xhr.onreadystatechange = function (username, password) {
            missAniamte();
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log("gg", xhr.responseText);
                var text = xhr.responseText;
                document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'>welcome " + JSON.parse(text).username + "</a>";
                // hide Dialog
                // document.getElementsByClassName('signInDialog')[0].classList.remove('changeDialog');
                // document.getElementById('signUpDialog').classList.remove('show');
                alert("sign up");
                return isLockUp = false;
            } else {
                //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
                //alert('sorry! Can"t find user');
                console.log("the password is not same");
                return isLockUp = false;
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send('email=' + email + '&username=' + username + '&password=' + password);
        //md. 一样的写法，现在就行了，idiot 🙄
    }
});

// signOUt function

var signOutBtn = document.getElementById('signOutBtn');
signOutBtn.addEventListener('click', function () {
    var xhr = new XMLHttpRequest(),
        method = 'Get',
        url = '/signOut';
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
});

//img load 

// let img = () => {
//     let imgLoad = document.getElementById('imgLoad');
//     let imgBox = document.getElementById('imgBox');
//     console.log(imgLoad.complete, imgBox);
//     let imgLoadSrc = imgLoad.getAttribute("data-src");
//     let img = new Image();
//     // let img=document.createElement("img");
//     img.src = imgLoadSrc;
//     // img.setAttribute('src', imgLoadSrc); //all right
//     // console.log(img.complete, img);

//     let load = () => {
//         console.log("complete", img.complete, img);
//         // let a=new Date();
//         if (img.complete) {
//             // imgBox.innerHTML = '<img src="http://s.amazeui.org/media/i/demos/bing-1.jpg">';
//             // imgBox.innerHTML=img; //error
//             // imgBox.appendChild(img);
//             imgBox.replaceChild(img, imgLoad);
//             clearInterval(clearTime);
//         }
//     }
//     let clearTime = setInterval(load, 1000);
//     // if (img.complete) {
//     //     imgBox.replaceChild(img, imgLoad);
//     // }

//     console.log("img:", img);
//     // img.onload = function (img) {
//     //     console.log("addImg",img);
//     //     let imgBox = document.getElementById('imgBox');
//     //     imgBox.innerHTML = img
//     // }


// }

// img();

//wrap img function

// let wrapImg = (toWrapImg, wrapElement) => {
//     let imgLoadSrc = toWrapImg.getAttribute("data-src");
//     let img = new Image();
//     img.src = imgLoadSrc;
//     let load = () => {
//         if (img.complete) {
//             wrapElement.replaceChild(img, toWrapImg);
//             clearInterval(clearTime);

//         }
//         // img.onload=()=>{
//         //       wrapElement.replaceElement(img,toWrapImg);
//         // }
//     }
//     let clearTime = setInterval(load, 1000);

// }
// wrapImg(
//     document.getElementById('imgLoad'),
//     document.getElementById('imgBox')
// );

// carousel imgLoad function 

// let carousel = document.querySelectorAll(".carousel-inner .item") //css style in Writing
// let carouselImg = document.querySelectorAll('.carousel-inner .item>img')
// Array.prototype.slice.call(carouselImg).map((element, index) => {
//     // console.log("element:", element, carousel);
//     wrapImg(element, carousel[index]);
// })

// array img load 

var arrayImgLoad = function arrayImgLoad(wrappedElements, wrappedElementArea) {
    var wrapImg = function wrapImg(WrappedImg, wrappedElement) {
        var imgLoadSrc = WrappedImg.getAttribute("data-src");
        var img = new Image();
        img.src = imgLoadSrc;
        var load = function load() {
            if (img.complete) {
                img.classList.add('center-block');
                wrappedElement.replaceChild(img, WrappedImg);
                clearInterval(clearTime);
            }
            // img.onload=()=>{
            //       wrapElement.replaceElement(img,toWrapImg);
            // }
        };
        var clearTime = setInterval(load, 1000);
    };
    Array.prototype.slice.call(wrappedElements).map(function (element, index) {
        // console.log("element:", element, carousel);
        wrapImg(element, wrappedElementArea[index]);
    });
};

arrayImgLoad(document.querySelectorAll(".carousel-inner .item>img"), document.querySelectorAll('.carousel-inner .item'));
arrayImgLoad(document.querySelectorAll("#imgBox>img"), document.querySelectorAll('#imgBox'));

// monitor img loading situation //监视img加载情况
var imgLoad = function imgLoad() {
    // let img_arr = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];
    var imgArray = document.querySelectorAll("img");
    var imgSrcArray = [];
    Array.prototype.slice.call(imgArray).map(function (Element, index) {
        // let imgSrcArray=[];
        imgSrcArray.push(Element.getAttribute('data-src'));
        //duplication array //数组去重
        // click for more information 
        //https://www.toobug.net/article/array_unique_in_javascript.html
        // imgSrcArray = new Set(imgSrcArray)
        // console.log("set ",set);
        return imgSrcArray;
    });
    // console.log("imgArray:", imgArray, "imgSrcArray", imgSrcArray); 
    // need change set type to array type ,use Array.from();
    imgSrcArray = Array.from(new Set(imgSrcArray));
    console.log("imgArray:", imgArray, "imgSrcArray", imgSrcArray);

    if (imgSrcArray.length != 0) {
        (function () {
            var img_arr = imgSrcArray;
            // console.log("img_arr:", img_arr);
            var nums = img_arr.length;
            var start = 0;

            var _loop = function _loop(i) {
                var img = document.createElement('img');
                img.src = img_arr[i];
                (function (j) {
                    img.onload = function () {
                        start++;
                        if (start == nums) {
                            console.log('全部加载完成');
                        }
                        // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
                        // combine bootstrap
                        var targetNode = document.getElementById('progressBar');
                        // let longShow = (start / nums) * 100 +'%';
                        var longShow = Math.floor(start / nums * 100) + '%';
                        console.log("longShow", longShow);
                        targetNode.style.width = longShow;
                        targetNode.innerText = longShow;
                    };
                    img.onerror = function () {
                        start;
                        console.log(start, j, img_arr[j] + '失败');
                        // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
                        // combine bootstrap
                        // document.getElementById('progressBar').style.width = (start / nums) * 100 + '%';
                        var targetNode = document.getElementById('progressBar');
                        // let longShow = (start / nums) * 100 + '%';
                        // longShow = Math.floor(longShow)
                        var longShow = Math.floor(start / nums * 100) + '%';
                        targetNode.style.width = longShow;
                        targetNode.innerText = longShow;
                    };
                })(i);
            };

            for (var i in img_arr) {
                _loop(i);
            }
        })();
    }
};

imgLoad();

// --------------------------------------------

// let login = document.getElementById('loginone');
// console.log("login:", login);
// let isLockUp = false;
// login.addEventListener('click', () => {
//     let username = document.getElementById('username1').value;
//     let password = document.getElementById('password1').value;
//     // empty password
//     document.getElementById('password1').value = '';
//     console.log("username:", username, password);
//     let xhr = new XMLHttpRequest(),
//         method = 'POST',
//         url = '/login';
//     if (isLockUp) return;
//     isLockUp = true;
//     xhr.onreadystatechange = (username, password) => {
//         if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             console.log("gg", xhr.responseText);
//             let text = xhr.responseText;
//             document.getElementById('loginDiv').innerHTML = "<p>welcome " + JSON.parse(text).username + " back🐵</p>"
//             return isLockUp = false;
//         }
//         else {
//             //document.getElementById('loginDiv').innerHTML = "<p>sorry can't find user</p>"
//             alert('sorry! Can"t find user');
//             return isLockUp = false;
//         }
//     }
//     xhr.open(method, url, true);
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhr.send('username=' + username + '&password=' + password);
//     //md. 一样的写法，现在就行了，idiot 🙄
// })

// to complete a function that is monitor resource loading finish situation
// useless function
// let resourceLoading = () => {
//     // let img_arr = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];
//     let ResourceArray = document.querySelectorAll("script") //design javascript
//     // let ResourceArray = document.querySelectorAll("link") // for css
//     console.log("resourceArray:", ResourceArray);
//     let srcArray = [];
//     Array.prototype.slice.call(ResourceArray).map((Element, index) => {
//         // let srcArray=[];
//         srcArray.push(Element.getAttribute('data-src'));
//         // srcArray.push(Element.getAttribute('data-href'));
//         //duplication array //数组去重
//         // click for more information 
//         //https://www.toobug.net/article/array_unique_in_javascript.html
//         // srcArray = new Set(srcArray)
//         // console.log("set ",set);
//         return srcArray;
//     })
//     // console.log("ResourceArray:", ResourceArray, "srcArray", srcArray); 
//     // need change set type to array type ,use Array.from();
//     srcArray = Array.from(new Set(srcArray));
//     console.log("ResourceArray:", ResourceArray, "srcArray", srcArray);

//     if (srcArray.length != 0) {
//         let img_arr = srcArray;
//         // console.log("img_arr:", img_arr);
//         let nums = img_arr.length;
//         let start = 0;
//         for (let i in img_arr) {
//             let img = document.createElement('script');
//             // let img = document.createElement('link');
//             img.src = img_arr[i]; //js
//             // img.href = img_arr[i];
//             document.body.appendChild(img); //script
//             (function (j) {

//                 // document.head.appendChild(img);
//                 img.onload = function () {
//                     start++;
//                     if (start == nums) {
//                         console.log('全部加载完成');
//                     }
//                     // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
//                     // combine bootstrap
//                     let targetNode = document.getElementById('progressBar');
//                     // let longShow = (start / nums) * 100 +'%';
//                     let longShow = Math.floor((start / nums) * 100) + '%';
//                     console.log("longShow", longShow);
//                     targetNode.style.width = longShow;
//                     targetNode.innerText = longShow;
//                 };
//                 img.onerror = function () {
//                     start;
//                     console.log(start, j, img_arr[j] + '失败');
//                     // document.getElementById('loading').style.width = (start / nums) * 100 + '%';
//                     // combine bootstrap
//                     // document.getElementById('progressBar').style.width = (start / nums) * 100 + '%';
//                     let targetNode = document.getElementById('progressBar');
//                     // let longShow = (start / nums) * 100 + '%';
//                     // longShow = Math.floor(longShow)
//                     let longShow = Math.floor((start / nums) * 100) + '%';
//                     targetNode.style.width = longShow;
//                     targetNode.innerText = longShow;
//                 }
//             })(i);
//         }

//     }
// }

// resourceLoading();

// --------------------------------------------
// don't forget this api  
window.onload = function () {
    var firstLoad = document.getElementsByClassName('firstLoad')[0];
    var wrappedBox = document.getElementsByClassName('wrappedBox')[0];
    var indexLoad = document.getElementById('indexLoad');
    var progress = document.getElementsByClassName('progress')[0];
    // indexLoad.classList.add('hide'); 
    // progress.classList.add('hide');
    // indexLoad.style.display = 'none';
    wrappedBox.classList.remove('hide');
    firstLoad.classList.add('hide');
};

// lazy load function
var lazyLoad = function lazyLoad() {
    function show($node) {
        var url = $node.attr('data-src');
        $node.attr('src', url);
        $node.addClass('showMe');
    }
    function isVisible($node) {
        var windowH = $(window).height();
        var st = $(window).scrollTop();
        var ot = $node.offset().top;
        var nodeH = $node.outerHeight();
        if (ot < windowH + st && st < ot + nodeH) {
            return true;
            // show($(this));
        } else {
            return false;
        }
    }
    check();
    function check() {
        $('img').not('showMe').each(function () {
            if (isVisible($(this))) {
                show($(this));
            }
        });
    }
    $(window).on('scroll', check);
};
lazyLoad();

//monitor node show situation


var nodeLazyLoad = function nodeLazyLoad() {
    function show($node) {
        // var url = $node.attr('data-src');
        // $node.attr('src', url);
        // $node.removeClass('nodeHide');
        // $node.
        // $node.addClass('nodeShow');
        $node.removeClass('nodeHide');
        $node.addClass('animated fadeInUp');
    }
    function isVisible($node) {
        var windowH = $(window).height();
        var st = $(window).scrollTop();
        var ot = $node.offset().top;
        var nodeH = $node.outerHeight();
        if (ot < windowH + st && st < ot + nodeH) {
            return true;
            // show($(this));
        } else {
            return false;
        }
    }
    check();
    function check() {
        // console.log("fuck:", $('div#node').not('nodeshow').length,document.querySelectorAll('#node').length);
        // let node=document.querySelectorAll('#node');

        // pit is jquery==>ID:selector should be used by this way $('div#node'),
        // if use this way like $('#node'),just select one result
        $('div#node .row p').each(function () {
            console.log("this:", this);
            if (isVisible($(this))) {
                show($(this));
            }
        });
    }
    $(window).on('scroll', check);
};
nodeLazyLoad();

//blog js
// blog request

var blogLoadMore = document.querySelector('#blogLoadMore');
blogLoadMore.addEventListener('click', function () {
    var xhr = new XMLHttpRequest(),
        method = 'Get',
        url = '/blog?length=3';
    if (isLockUp) return;
    isLockUp = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("gg", xhr.responseText);
            var text = xhr.responseText;
            // document.getElementById('signInDialog').innerHTML = "<a href='javascript:void(0)'>welcome " + JSON.parse(text).username + "</a>"
            return isLockUp = false;
        } else {
            console.log("the password is not same");
            return isLockUp = false;
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
    //md. 一样的写法，现在就行了，idiot 🙄
});

/***/ })
/******/ ]);