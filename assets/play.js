(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.play = {})));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

	var ws = null;

	if (typeof WebSocket !== 'undefined') {
	  ws = WebSocket;
	} else if (typeof MozWebSocket !== 'undefined') {
	  ws = MozWebSocket;
	} else if (typeof commonjsGlobal !== 'undefined') {
	  ws = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
	} else if (typeof window !== 'undefined') {
	  ws = window.WebSocket || window.MozWebSocket;
	} else if (typeof self !== 'undefined') {
	  ws = self.WebSocket || self.MozWebSocket;
	}

	var browser = ws;

	var bind = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	var isBuffer_1 = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	};

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}

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

	var utils = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer_1,
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

	var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};

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
	var enhanceError = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};

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
	var createError = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	var settle = function settle(resolve, reject, response) {
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
	var buildURL = function buildURL(url, params, paramsSerializer) {
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

	// Headers whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	var ignoreDuplicateOf = [
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	];

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
	var parseHeaders = function parseHeaders(headers) {
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
	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
	        return;
	      }
	      if (key === 'set-cookie') {
	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
	      } else {
	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	      }
	    }
	  });

	  return parsed;
	};

	var isURLSameOrigin = (
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

	var btoa_1 = btoa;

	var cookies = (
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

	var btoa$1 = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || btoa_1;

	var xhr = function xhrAdapter(config) {
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
	    if (!window.XMLHttpRequest &&
	        process.env.NODE_ENV !== 'test' &&
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
	      requestHeaders.Authorization = 'Basic ' + btoa$1(username + ':' + password);
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
	        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
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
	      var cookies$$1 = cookies;

	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies$$1.read(config.xsrfCookieName) :
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
	    adapter = xhr;
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = xhr;
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

	var defaults_1 = defaults;

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

	var InterceptorManager_1 = InterceptorManager;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	var transformData = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};

	var isCancel = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	var isAbsoluteURL = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	var combineURLs = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};

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
	var dispatchRequest = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }

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

	  var adapter = config.adapter || defaults_1.adapter;

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

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager_1(),
	    response: new InterceptorManager_1()
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

	  config = utils.merge(defaults_1, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();

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

	var Axios_1 = Axios;

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

	var Cancel_1 = Cancel;

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

	    token.reason = new Cancel_1(message);
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

	var CancelToken_1 = CancelToken;

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
	var spread = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios_1(defaultConfig);
	  var instance = bind(Axios_1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios_1.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios = createInstance(defaults_1);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios_1;

	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults_1, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios.Cancel = Cancel_1;
	axios.CancelToken = CancelToken_1;
	axios.isCancel = isCancel;

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = spread;

	var axios_1 = axios;

	// Allow use of default import syntax in TypeScript
	var default_1 = axios;
	axios_1.default = default_1;

	var axios$1 = axios_1;

	var eventemitter3 = createCommonjsModule(function (module) {

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Add a listener for a given event.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} once Specify if the listener is a one-time listener.
	 * @returns {EventEmitter}
	 * @private
	 */
	function addListener(emitter, event, fn, context, once) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('The listener must be a function');
	  }

	  var listener = new EE(fn, context || emitter, once)
	    , evt = prefix ? prefix + event : event;

	  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
	  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
	  else emitter._events[evt] = [emitter._events[evt], listener];

	  return emitter;
	}

	/**
	 * Clear event by name.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} evt The Event name.
	 * @private
	 */
	function clearEvent(emitter, evt) {
	  if (--emitter._eventsCount === 0) emitter._events = new Events();
	  else delete emitter._events[evt];
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Array} The registered listeners.
	 * @public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  var evt = prefix ? prefix + event : event
	    , handlers = this._events[evt];

	  if (!handlers) return [];
	  if (handlers.fn) return [handlers.fn];

	  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
	    ee[i] = handlers[i].fn;
	  }

	  return ee;
	};

	/**
	 * Return the number of listeners listening to a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Number} The number of listeners.
	 * @public
	 */
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
	  var evt = prefix ? prefix + event : event
	    , listeners = this._events[evt];

	  if (!listeners) return 0;
	  if (listeners.fn) return 1;
	  return listeners.length;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  return addListener(this, event, fn, context, false);
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  return addListener(this, event, fn, context, true);
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {*} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    clearEvent(this, evt);
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	      listeners.fn === fn &&
	      (!once || listeners.once) &&
	      (!context || listeners.context === context)
	    ) {
	      clearEvent(this, evt);
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	        listeners[i].fn !== fn ||
	        (once && !listeners[i].once) ||
	        (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else clearEvent(this, evt);
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {(String|Symbol)} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) clearEvent(this, evt);
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	{
	  module.exports = EventEmitter;
	}
	});

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

	var ms = function(val, options) {
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

	var debug = createCommonjsModule(function (module, exports) {
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
	exports.humanize = ms;

	/**
	 * Active `debug` instances.
	 */
	exports.instances = [];

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

	  var prevTime;

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms$$1 = curr - (prevTime || curr);
	    self.diff = ms$$1;
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
	  debug.destroy = destroy;

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  exports.instances.push(debug);

	  return debug;
	}

	function destroy () {
	  var index = exports.instances.indexOf(this);
	  if (index !== -1) {
	    exports.instances.splice(index, 1);
	    return true;
	  } else {
	    return false;
	  }
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

	  var i;
	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }

	  for (i = 0; i < exports.instances.length; i++) {
	    var instance = exports.instances[i];
	    instance.enabled = exports.enabled(instance.namespace);
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
	  if (name[name.length - 1] === '*') {
	    return true;
	  }
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
	});
	var debug_1 = debug.coerce;
	var debug_2 = debug.disable;
	var debug_3 = debug.enable;
	var debug_4 = debug.enabled;
	var debug_5 = debug.humanize;
	var debug_6 = debug.instances;
	var debug_7 = debug.names;
	var debug_8 = debug.skips;
	var debug_9 = debug.formatters;

	var browser$1 = createCommonjsModule(function (module, exports) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
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
	  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
	  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
	  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
	  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
	  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
	  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
	  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
	  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
	  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
	  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
	  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
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

	  // Internet Explorer and Edge do not support colors.
	  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
	    return false;
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
	  args.splice(1, 0, c, 'color: inherit');

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
	});
	var browser_1 = browser$1.log;
	var browser_2 = browser$1.formatArgs;
	var browser_3 = browser$1.save;
	var browser_4 = browser$1.load;
	var browser_5 = browser$1.useColors;
	var browser_6 = browser$1.storage;
	var browser_7 = browser$1.colors;

	/**
	 * 节点地区
	 * @readonly
	 * @enum {number}
	 */
	const Region = {
	  /** 华北节点 */
	  NorthChina: 0,
	  /** 华东节点 */
	  EastChina: 1,
	  /** 美国节点 */
	  NorthAmerica: 2,
	};

	/**
	 * 事件
	 * @readonly
	 * @enum {string}
	 */
	const Event = {
	  /** 连接成功 */
	  CONNECTED: 'connected',
	  /** 连接失败 */
	  CONNECT_FAILED: 'connectFailed',
	  /** 断开连接 */
	  DISCONNECTED: 'disconnected',
	  /** 加入到大厅 */
	  LOBBY_JOINED: 'lobbyJoined',
	  /** 离开大厅 */
	  LOBBY_LEFT: 'lobbyLeft',
	  /** 大厅房间列表变化 */
	  LOBBY_ROOM_LIST_UPDATED: 'lobbyRoomListUpdate',
	  /** 创建房间成功 */
	  ROOM_CREATED: 'roomCreated',
	  /** 创建房间失败 */
	  ROOM_CREATE_FAILED: 'roomCreateFailed',
	  /** 加入房间成功 */
	  ROOM_JOINED: 'roomJoined',
	  /** 加入房间失败 */
	  ROOM_JOIN_FAILED: 'roomJoinFailed',
	  /** 有新玩家加入房间 */
	  PLAYER_ROOM_JOINED: 'newPlayerJoinedRoom',
	  /** 有玩家离开房间 */
	  PLAYER_ROOM_LEFT: 'playerLeftRoom',
	  /** 玩家活跃属性变化 */
	  PLAYER_ACTIVITY_CHANGED: 'playerActivityChanged',
	  /** 主机变更 */
	  MASTER_SWITCHED: 'masterSwitched',
	  /** 离开房间 */
	  ROOM_LEFT: 'roomLeft',
	  /** 房间自定义属性变化 */
	  ROOM_CUSTOM_PROPERTIES_CHANGED: 'roomCustomPropertiesChanged',
	  /** 玩家自定义属性变化 */
	  PLAYER_CUSTOM_PROPERTIES_CHANGED: 'playerCustomPropertiesChanged',
	  /** 自定义事件 */
	  CUSTOM_EVENT: 'customEvent',
	  /** 错误事件 */
	  ERROR: 'error',
	};

	/**
	 * 玩家类
	 */
	class Player {
	  constructor(play) {
	    this._play = play;
	    this._userId = '';
	    this._actorId = -1;
	  }

	  static _newFromJSONObject(play, playerJSONObject) {
	    const player = new Player(play);
	    player._initWithJSONObject(playerJSONObject);
	    return player;
	  }

	  _initWithJSONObject(playerJSONObject) {
	    this._userId = playerJSONObject.pid;
	    this._actorId = playerJSONObject.actorId;
	    if (playerJSONObject.properties) {
	      this.properties = playerJSONObject.properties;
	    } else {
	      this.properties = {};
	    }
	  }

	  /**
	   * 玩家 ID
	   * @type {string}
	   * @readonly
	   */
	  get userId() {
	    return this._userId;
	  }

	  /**
	   * 房间玩家 ID
	   * @type {number}
	   * @readonly
	   */
	  get actorId() {
	    return this._actorId;
	  }

	  /**
	   * 判断是不是当前客户端玩家
	   * @return {Boolean}
	   */
	  isLocal() {
	    return (
	      this._actorId !== -1 && this._play._player._actorId === this._actorId
	    );
	  }

	  /**
	   * 判断是不是主机玩家
	   * @return {Boolean}
	   */
	  isMaster() {
	    return this._actorId !== -1 && this._play._room.masterId === this._actorId;
	  }

	  /**
	   * 判断是不是活跃状态
	   * @return {Boolean}
	   */
	  isActive() {
	    return this.active;
	  }

	  /**
	   * 设置玩家的自定义属性
	   * @param {Object} properties 自定义属性
	   * @param {Object} opts 设置选项
	   * @param {Object} opts.expectedValues 期望属性，用于 CAS 检测
	   */
	  setCustomProperties(properties, { expectedValues = null } = {}) {
	    this._play._setPlayerCustomProperties(
	      this._actorId,
	      properties,
	      expectedValues
	    );
	  }

	  /**
	   * 获取自定义属性
	   * @return {Object}
	   */
	  getCustomProperties() {
	    return this.properties;
	  }

	  // 设置活跃状态
	  _setActive(active) {
	    this.active = active;
	  }

	  _mergeProperties(changedProperties) {
	    this.properties = Object.assign(this.properties, changedProperties);
	  }
	}

	/**
	 * 大厅房间数据类
	 */
	class LobbyRoom {
	  constructor(lobbyRoomDTO) {
	    this._roomName = lobbyRoomDTO.cid;
	    this._maxPlayerCount = lobbyRoomDTO.maxMembers;
	    this._expectedUserIds = lobbyRoomDTO.expectMembers;
	    this._emptyRoomTtl = lobbyRoomDTO.emptyRoomTtl;
	    this._playerTtl = lobbyRoomDTO.playerTtl;
	    this._playerCount = lobbyRoomDTO.playerCount;
	    if (lobbyRoomDTO.attr) {
	      this._customRoomProperties = lobbyRoomDTO.attr;
	    }
	  }

	  /**
	   * 房间名称
	   * @type {string}
	   * @readonly
	   */
	  get roomName() {
	    return this._roomName;
	  }

	  /**
	   * 房间最大玩家数
	   * @type {number}
	   * @readonly
	   */
	  get maxPlayerCount() {
	    return this._maxPlayerCount;
	  }

	  /**
	   * 邀请好友 ID 数组
	   * @type {Array.<string>}
	   * @readonly
	   */
	  get expectedUserIds() {
	    return this._expectedUserIds;
	  }

	  /**
	   * 房间置空后销毁时间（秒）
	   * @type {number}
	   * @readonly
	   */
	  get emptyRoomTtl() {
	    return this._emptyRoomTtl;
	  }

	  /**
	   * 玩家离线后踢出房间时间（秒）
	   * @type {number}
	   * @readonly
	   */
	  get playerTtl() {
	    return this._playerTtl;
	  }

	  /**
	   * 当前房间玩家数量
	   * @type {number}
	   * @readonly
	   */
	  get playerCount() {
	    return this._playerCount;
	  }

	  /**
	   * 房间属性
	   * @type {Object}
	   * @readonly
	   */
	  get customRoomProperties() {
	    return this._customRoomProperties;
	  }
	}

	function handleErrorMsg(play, msg) {
	  console.error(`error: ${JSON.stringify(msg)}`);
	  play.emit(Event.ERROR, {
	    code: msg.reasonCode,
	    detail: msg.detail,
	  });
	}

	const debug$1 = browser$1('Play:MasterHandler');

	// 连接建立
	function handleMasterServerSessionOpen(play, msg) {
	  play._sessionToken = msg.st;
	  const player = new Player(play);
	  player._userId = play.userId;
	  play._player = player;
	  if (play._autoJoinLobby) {
	    play.joinLobby();
	  }
	  play.emit(Event.CONNECTED);
	}

	// 加入大厅
	function handleJoinedLobby(play, msg) {
	  if (msg.reasonCode) {
	    const { reasonCode, detail } = msg;
	    console.error(`join lobby failed: ${reasonCode} - ${detail}`);
	  } else {
	    play._inLobby = true;
	    play.emit(Event.LOBBY_JOINED);
	  }
	}

	// 离开大厅
	function handleLeftLobby(play) {
	  play._inLobby = false;
	  play.emit(Event.LOBBY_LEFT);
	}

	// 房间列表更新
	function handleRoomList(play, msg) {
	  play._lobbyRoomList = [];
	  for (let i = 0; i < msg.list.length; i += 1) {
	    const lobbyRoomDTO = msg.list[i];
	    play._lobbyRoomList[i] = new LobbyRoom(lobbyRoomDTO);
	  }
	  play.emit(Event.LOBBY_ROOM_LIST_UPDATED);
	}

	function handleGameServer(play, msg) {
	  if (play._inLobby) {
	    play._inLobby = false;
	    play.emit(Event.LOBBY_LEFT);
	  }
	  play._gameServer = msg.secureAddr;
	  if (msg.cid) {
	    play._cachedRoomMsg.cid = msg.cid;
	  }
	  play._connectToGame();
	}

	// 创建房间
	function handleCreateGameServer(play, msg) {
	  if (msg.reasonCode) {
	    play.emit(Event.ROOM_CREATE_FAILED, {
	      code: msg.reasonCode,
	      detail: msg.detail,
	    });
	  } else {
	    play._cachedRoomMsg.op = 'start';
	    handleGameServer(play, msg);
	  }
	}

	// 加入房间
	/* eslint no-param-reassign: ["error", { "props": false }] */
	function handleJoinGameServer(play, msg) {
	  if (msg.reasonCode) {
	    play.emit(Event.ROOM_JOIN_FAILED, {
	      code: msg.reasonCode,
	      detail: msg.detail,
	    });
	  } else {
	    play._cachedRoomMsg.op = 'add';
	    handleGameServer(play, msg);
	  }
	}

	// 大厅消息处理
	function handleMasterMsg(play, message) {
	  const msg = JSON.parse(message.data);
	  debug$1(`${play.userId} Lobby msg: ${msg.op} <- ${message.data}`);
	  switch (msg.cmd) {
	    case 'session':
	      switch (msg.op) {
	        case 'opened':
	          handleMasterServerSessionOpen(play, msg);
	          break;
	        default:
	          console.error(`no handler for lobby msg: ${msg.op}`);
	          break;
	      }
	      break;
	    case 'lobby':
	      switch (msg.op) {
	        case 'added':
	          handleJoinedLobby(play, msg);
	          break;
	        case 'room-list':
	          handleRoomList(play, msg);
	          break;
	        case 'remove':
	          handleLeftLobby(play);
	          break;
	        default:
	          console.error(`no handler for lobby msg: ${msg.op}`);
	          break;
	      }
	      break;
	    case 'statistic':
	      break;
	    case 'conv':
	      switch (msg.op) {
	        case 'results':
	          handleRoomList(play, msg);
	          break;
	        case 'started':
	          handleCreateGameServer(play, msg);
	          break;
	        case 'added':
	          handleJoinGameServer(play, msg);
	          break;
	        case 'random-added':
	          handleJoinGameServer(play, msg);
	          break;
	        default:
	          console.error(`no handler for lobby msg: ${msg.op}`);
	          break;
	      }
	      break;
	    case 'events':
	      // TODO

	      break;
	    case 'error':
	      handleErrorMsg(play, msg);
	      break;
	    default:
	      if (msg.cmd) {
	        console.error(`no handler for lobby msg: ${msg.cmd}`);
	      }
	      break;
	  }
	}

	/**
	 * 房间类
	 */
	class Room {
	  constructor(play) {
	    this._play = play;
	  }

	  /* eslint no-param-reassign: ["error", { "props": false }] */
	  static _newFromJSONObject(play, roomJSONObject) {
	    const room = new Room(play);
	    room._name = roomJSONObject.cid;
	    room._opened = roomJSONObject.open;
	    room._visible = roomJSONObject.visible;
	    room._maxPlayerCount = roomJSONObject.maxMembers;
	    room._masterActorId = roomJSONObject.masterActorId;
	    room._expectedUserIds = roomJSONObject.expectMembers;
	    room._players = {};
	    for (let i = 0; i < roomJSONObject.members.length; i += 1) {
	      const playerDTO = roomJSONObject.members[i];
	      const player = Player._newFromJSONObject(play, playerDTO);
	      if (player.userId === play.userId) {
	        play._player = player;
	      }
	      room._players[player.actorId] = player;
	    }
	    if (roomJSONObject.attr) {
	      room._properties = roomJSONObject.attr;
	    } else {
	      room._properties = {};
	    }
	    return room;
	  }

	  /**
	   * 房间名称
	   * @type {string}
	   * @readonly
	   */
	  get name() {
	    return this._name;
	  }

	  /**
	   * 房间是否开启
	   * @type {boolean}
	   * @readonly
	   */
	  get opened() {
	    return this._opened;
	  }

	  /**
	   * 房间是否可见
	   * @type {boolean}
	   * @readonly
	   */
	  get visible() {
	    return this._visible;
	  }

	  /**
	   * 房间允许的最大玩家数量
	   * @type {number}
	   * @readonly
	   */
	  get maxPlayerCount() {
	    return this._maxPlayerCount;
	  }

	  /**
	   * 房间主机玩家 ID
	   * @type {number}
	   * @readonly
	   */
	  get masterId() {
	    return this._masterActorId;
	  }

	  /**
	   * 邀请的好友 ID 列表
	   * @type {Array.<string>}
	   * @readonly
	   */
	  get expectedUserIds() {
	    return this._expectedUserIds;
	  }

	  /**
	   * 根据 actorId 获取 Player 对象
	   * @param {number} actorId
	   * @return {Player}
	   */
	  getPlayer(actorId) {
	    if (!(typeof actorId === 'number')) {
	      throw new TypeError(`${actorId} is not a number`);
	    }
	    const player = this._players[actorId];
	    if (player === null) {
	      throw new TypeError(`player with id:${actorId} not found`);
	    }
	    return player;
	  }

	  /**
	   * 获取房间内的玩家列表
	   * @return {Array.<Player>}
	   * @readonly
	   */
	  get playerList() {
	    return Object.values(this._players);
	  }

	  /**
	   * 设置房间的自定义属性
	   * @param {Object} properties 自定义属性
	   * @param {Object} opts 设置选项
	   * @param {Object} opts.expectedValues 期望属性，用于 CAS 检测
	   */
	  setCustomProperties(properties, { expectedValues = null } = {}) {
	    this._play._setRoomCustomProperties(properties, expectedValues);
	  }

	  /**
	   * 获取自定义属性
	   * @return {Object}
	   */
	  getCustomProperties() {
	    return this._properties;
	  }

	  _addPlayer(newPlayer) {
	    if (!(newPlayer instanceof Player)) {
	      throw new TypeError(`${newPlayer} is not a Player`);
	    }
	    this._players[newPlayer.actorId] = newPlayer;
	  }

	  _removePlayer(actorId) {
	    delete this._players[actorId];
	  }

	  _mergeProperties(changedProperties) {
	    this._properties = Object.assign(this._properties, changedProperties);
	  }
	}

	const debug$2 = browser$1('Play:GameHandler');

	// 连接建立后创建 / 加入房间
	function handleGameServerSessionOpen(play) {
	  // 根据缓存加入房间的规则
	  play._cachedRoomMsg.i = play._getMsgId();
	  play._send(play._cachedRoomMsg);
	}

	// 创建房间
	function handleCreatedRoom(play, msg) {
	  if (msg.reasonCode) {
	    play.emit(Event.ROOM_CREATE_FAILED, {
	      code: msg.reasonCode,
	      detail: msg.detail,
	    });
	  } else {
	    play._room = Room._newFromJSONObject(play, msg);
	    play.emit(Event.ROOM_CREATED);
	    play.emit(Event.ROOM_JOINED);
	  }
	}

	// 加入房间
	function handleJoinedRoom(play, msg) {
	  if (msg.reasonCode) {
	    play.emit(Event.ROOM_JOIN_FAILED, {
	      code: msg.reasonCode,
	      detail: msg.detail,
	    });
	  } else {
	    play._room = Room._newFromJSONObject(play, msg);
	    play.emit(Event.ROOM_JOINED);
	  }
	}

	// 有新玩家加入房间
	function handleNewPlayerJoinedRoom(play, msg) {
	  const newPlayer = Player._newFromJSONObject(play, msg.member);
	  play._room._addPlayer(newPlayer);
	  play.emit(Event.PLAYER_ROOM_JOINED, newPlayer);
	}

	// 有玩家离开房间
	function handlePlayerLeftRoom(play, msg) {
	  const actorId = msg.initByActor;
	  const leftPlayer = play._room.getPlayer(actorId);
	  play._room._removePlayer(actorId);
	  play.emit(Event.PLAYER_ROOM_LEFT, leftPlayer);
	}

	// 主机切换应答
	function handleMasterUpdated(msg) {
	  if (msg.reasonCode) {
	    console.error(`set master error: ${msg.reasonCode}, ${msg.detail}`);
	  }
	}

	// 主机切换
	function handleMasterChanged(play, msg) {
	  play._room._masterActorId = msg.masterActorId;
	  const newMaster = play._room.getPlayer(msg.masterActorId);
	  play.emit(Event.MASTER_SWITCHED, newMaster);
	}

	// 房间开启 / 关闭
	function handleRoomOpenedChanged(play, msg) {
	  play._room._opened = msg.toggle;
	}

	// 房间是否可见
	function handleRoomVisibleChanged(play, msg) {
	  play._room._visible = msg.toggle;
	}

	// 房间属性变更应答
	function handleRoomCustomPropertiesChangedResponse(msg) {
	  if (msg.reasonCode) {
	    console.error(
	      `set room properties error: ${msg.reasonCode}, ${msg.detail}`
	    );
	  }
	}

	// 房间属性变更
	function handleRoomCustomPropertiesChanged(play, msg) {
	  const changedProperties = msg.attr;
	  play._room._mergeProperties(changedProperties);
	  play.emit(Event.ROOM_CUSTOM_PROPERTIES_CHANGED, changedProperties);
	}

	// 玩家属性变更
	function handlePlayerCustomPropertiesChanged(play, msg) {
	  const player = play._room.getPlayer(msg.actorId);
	  player._mergeProperties(msg.attr);
	  play.emit(Event.PLAYER_CUSTOM_PROPERTIES_CHANGED, {
	    player,
	    changedProps: msg.attr,
	  });
	}

	// 玩家下线
	function handlePlayerOffline(play, msg) {
	  const player = play._room.getPlayer(msg.initByActor);
	  player._setActive(false);
	  play.emit(Event.PLAYER_ACTIVITY_CHANGED, player);
	}

	// 玩家上线
	function handlePlayerOnline(play, msg) {
	  const player = play._room.getPlayer(msg.member.actorId);
	  player._initWithJSONObject(msg.member);
	  player._setActive(true);
	  play.emit(Event.PLAYER_ACTIVITY_CHANGED, player);
	}

	// 离开房间
	/* eslint no-param-reassign: ["error", { "props": false }] */
	function handleLeaveRoom(play) {
	  // 清理工作
	  play._room = null;
	  play._player = null;
	  play.emit(Event.ROOM_LEFT);
	  play._connectToMaster();
	}

	// 自定义事件
	function handleEvent(play, msg) {
	  play.emit(Event.CUSTOM_EVENT, {
	    eventId: msg.eventId,
	    eventData: msg.msg,
	    senderId: msg.fromActorId,
	  });
	}

	function handleGameMsg(play, message) {
	  const msg = JSON.parse(message.data);
	  debug$2(`${play.userId} Game msg: ${msg.op} <- ${message.data}`);
	  switch (msg.cmd) {
	    case 'session':
	      switch (msg.op) {
	        case 'opened':
	          handleGameServerSessionOpen(play);
	          break;
	        default:
	          console.error(`no handler for op: ${msg.op}`);
	          break;
	      }
	      break;
	    case 'conv':
	      switch (msg.op) {
	        case 'started':
	          handleCreatedRoom(play, msg);
	          break;
	        case 'added':
	          handleJoinedRoom(play, msg);
	          break;
	        case 'members-joined':
	          handleNewPlayerJoinedRoom(play, msg);
	          break;
	        case 'members-left':
	          handlePlayerLeftRoom(play, msg);
	          break;
	        case 'master-client-updated':
	          handleMasterUpdated(msg);
	          break;
	        case 'master-client-changed':
	          handleMasterChanged(play, msg);
	          break;
	        case 'open':
	          handleRoomOpenedChanged(play, msg);
	          break;
	        case 'visible':
	          handleRoomVisibleChanged(play, msg);
	          break;
	        case 'updated':
	          handleRoomCustomPropertiesChangedResponse(msg);
	          break;
	        case 'updated-notify':
	          handleRoomCustomPropertiesChanged(play, msg);
	          break;
	        case 'player-prop-updated':
	          break;
	        case 'player-props':
	          handlePlayerCustomPropertiesChanged(play, msg);
	          break;
	        case 'members-offline':
	          handlePlayerOffline(play, msg);
	          break;
	        case 'members-online':
	          handlePlayerOnline(play, msg);
	          break;
	        case 'removed':
	          handleLeaveRoom(play);
	          break;
	        case 'direct':
	          handleEvent(play, msg);
	          break;
	        default:
	          console.error(`no handler for game msg: ${msg.op}`);
	          break;
	      }
	      break;
	    case 'direct':
	      handleEvent(play, msg);
	      break;
	    case 'ack':
	      // ignore
	      break;
	    case 'events':
	      // TODO

	      break;
	    case 'error':
	      handleErrorMsg(play, msg);
	      break;
	    default:
	      if (msg.cmd) {
	        console.error(`no handler for cmd: ${message.data}`);
	      }
	      break;
	  }
	}

	var version = "0.10.0";

	// SDK 版本号
	const NorthCNServerURL = 'https://game-router-cn-n1.leancloud.cn/';
	const EastCNServerURL = 'https://game-router-cn-e1.leancloud.cn/';
	const USServerURL = 'https://game-router-us-w1.leancloud.cn/';

	const debug$3 = browser$1('Play:Play');

	const MAX_PLAYER_COUNT = 10;

	function convertRoomOptions(roomOptions) {
	  const options = {};
	  if (!roomOptions.opened) options.open = roomOptions.opened;
	  if (!roomOptions.visible) options.visible = roomOptions.visible;
	  if (roomOptions.emptyRoomTtl > 0)
	    options.emptyRoomTtl = roomOptions.emptyRoomTtl;
	  if (roomOptions.playerTtl > 0) options.playerTtl = roomOptions.playerTtl;
	  if (
	    roomOptions.maxPlayerCount > 0 &&
	    roomOptions.maxPlayerCount < MAX_PLAYER_COUNT
	  )
	    options.maxMembers = roomOptions.maxPlayerCount;
	  if (roomOptions.customRoomProperties)
	    options.attr = roomOptions.customRoomProperties;
	  if (roomOptions.customRoomPropertyKeysForLobby)
	    options.lobbyAttrKeys = roomOptions.customRoomPropertyKeysForLobby;
	  if (roomOptions.flag) options.flag = roomOptions.flag;
	  return options;
	}

	/**
	 * Play 客户端类
	 */
	class Play extends eventemitter3 {
	  constructor() {
	    super();
	    /**
	     * 玩家 ID
	     * @type {string}
	     */
	    this.userId = null;
	    this._room = null;
	    this._player = null;
	  }

	  /**
	   * 初始化客户端
	   * @param {Object} opts
	   * @param {string} opts.appId APP ID
	   * @param {string} opts.appKey APP KEY
	   * @param {number} opts.region 节点地区
	   */
	  init(opts) {
	    if (!(typeof opts.appId === 'string')) {
	      throw new TypeError(`${opts.appId} is not a string`);
	    }
	    if (!(typeof opts.appKey === 'string')) {
	      throw new TypeError(`${opts.appKey} is not a string`);
	    }
	    if (!(typeof opts.region === 'number')) {
	      throw new TypeError(`${opts.region} is not a number`);
	    }
	    this._appId = opts.appId;
	    this._appKey = opts.appKey;
	    this._region = opts.region;
	    if (opts.autoJoinLobby === undefined) {
	      this._autoJoinLobby = true;
	    } else {
	      this._autoJoinLobby = opts.autoJoinLobby;
	    }
	    this._masterServer = null;
	    this._gameServer = null;
	    this._msgId = 0;
	    this._requestMsg = {};
	    // 切换服务器状态
	    this._switchingServer = false;
	    // 是否处于大厅
	    this._inLobby = false;
	    // 大厅房间列表
	    this._lobbyRoomList = null;
	    // 连接失败次数
	    this._connectFailedCount = 0;
	    // 下次允许的连接时间戳
	    this._nextConnectTimestamp = 0;
	    // 连接计时器
	    this._connectTimer = null;
	  }

	  /**
	   * 建立连接
	   * @param {Object} opts （可选）连接选项
	   * @param {string} opts.gameVersion （可选）游戏版本号，不同的游戏版本号将路由到不同的服务端，默认值为 0.0.1
	   */
	  connect({ gameVersion = '0.0.1' } = {}) {
	    // 判断是否已经在等待连接
	    if (this._connectTimer) {
	      console.warn('waiting for connect');
	      return;
	    }

	    // 判断连接时间
	    const now = new Date().getTime();
	    if (now < this._nextConnectTimestamp) {
	      const waitTime = this._nextConnectTimestamp - now;
	      debug$3(`wait time: ${waitTime}`);
	      this._connectTimer = setTimeout(() => {
	        this._connect(gameVersion);
	        clearTimeout(this._connectTimer);
	        this._connectTimer = null;
	      }, waitTime);
	    } else {
	      this._connect(gameVersion);
	    }
	  }

	  _connect(gameVersion) {
	    if (gameVersion && !(typeof gameVersion === 'string')) {
	      throw new TypeError(`${gameVersion} is not a string`);
	    }
	    this._gameVersion = gameVersion;
	    let masterURL = EastCNServerURL;
	    if (this._region === Region.NorthChina) {
	      masterURL = NorthCNServerURL;
	    } else if (this._region === Region.EastChina) {
	      masterURL = EastCNServerURL;
	    } else if (this._region === Region.NorthAmerica) {
	      masterURL = USServerURL;
	    }
	    const params = `appId=${this._appId}&secure=true&ua=${this._getUA()}`;
	    const url = `${masterURL}v1/router?${params}`;
	    axios$1
	      .get(url)
	      .then(response => {
	        debug$3(response.data);
	        // 重置下次允许的连接时间
	        this._connectFailedCount = 0;
	        this._nextConnectTimestamp = 0;
	        clearTimeout(this._connectTimer);
	        this._connectTimer = null;
	        // 主大厅服务器
	        this._primaryServer = response.data.server;
	        // 备用大厅服务器
	        this._secondaryServer = response.data.secondary;
	        // 默认服务器是 master server
	        this._masterServer = this._primaryServer;
	        // ttl
	        this._serverValidTimeStamp = Date.now() + response.data.ttl * 1000;
	        this._connectToMaster();
	      })
	      .catch(error => {
	        console.error(error);
	        // 连接失败，则增加下次连接时间间隔
	        this._connectFailedCount += 1;
	        this._nextConnectTimestamp =
	          Date.now() + 2 ** this._connectFailedCount * 1000;
	        this.emit(Event.CONNECT_FAILED, error.data);
	      });
	  }

	  /**
	   * 重新连接
	   */
	  reconnect() {
	    const now = Date.now();
	    if (now > this._serverValidTimeStamp) {
	      // 超出 ttl 后将重新请求 router 连接
	      this.connect(this._gameVersion);
	    } else {
	      this._connectToMaster();
	    }
	  }

	  /**
	   * 重新连接并自动加入房间
	   */
	  reconnectAndRejoin() {
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	      cid: this._cachedRoomMsg.cid,
	      rejoin: true,
	    };
	    this._connectToGame();
	  }

	  /**
	   * 断开连接
	   */
	  disconnect() {
	    this._stopKeepAlive();
	    if (this._websocket) {
	      this._websocket.close();
	      this._websocket = null;
	    }
	    debug$3(`${this.userId} disconnect.`);
	  }

	  /**
	   * 加入大厅，只有在 autoJoinLobby = false 时才需要调用
	   */
	  joinLobby() {
	    const msg = {
	      cmd: 'lobby',
	      op: 'add',
	      i: this._getMsgId(),
	    };
	    this._send(msg);
	  }

	  /**
	   * 离开大厅
	   */
	  leaveLobby() {
	    const msg = {
	      cmd: 'lobby',
	      op: 'remove',
	      i: this._getMsgId(),
	    };
	    this._send(msg);
	  }

	  /**
	   * 创建房间
	   * @param {Object} opts （可选）创建房间选项
	   * @param {string} opts.roomName 房间名称，在整个游戏中唯一，默认值为 null，则由服务端分配一个唯一 Id
	   * @param {Object} opts.roomOptions （可选）创建房间选项，默认值为 null
	   * @param {Array.<string>} opts.expectedUserIds （可选）邀请好友 ID 数组，默认值为 null
	   */
	  createRoom({
	    roomName = null,
	    roomOptions = null,
	    expectedUserIds = null,
	  } = {}) {
	    if (roomName !== null && !(typeof roomName === 'string')) {
	      throw new TypeError(`${roomName} is not a string`);
	    }
	    if (roomOptions !== null && !(roomOptions instanceof Object)) {
	      throw new TypeError(`${roomOptions} is not a Object`);
	    }
	    if (expectedUserIds !== null && !Array.isArray(expectedUserIds)) {
	      throw new TypeError(`${expectedUserIds} is not an Array with string`);
	    }
	    // 缓存 GameServer 创建房间的消息体
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'start',
	      i: this._getMsgId(),
	    };
	    if (roomName) {
	      this._cachedRoomMsg.cid = roomName;
	    }
	    // 拷贝房间属性（包括 系统属性和玩家定义属性）
	    if (roomOptions) {
	      const opts = convertRoomOptions(roomOptions);
	      this._cachedRoomMsg = Object.assign(this._cachedRoomMsg, opts);
	    }
	    if (expectedUserIds) {
	      this._cachedRoomMsg.expectMembers = expectedUserIds;
	    }
	    // Router 创建房间的消息体
	    const msg = this._cachedRoomMsg;
	    this._send(msg);
	  }

	  /**
	   * 加入房间
	   * @param {string} roomName 房间名称
	   * @param {*} expectedUserIds （可选）邀请好友 ID 数组，默认值为 null
	   */
	  joinRoom(roomName, { expectedUserIds = null } = {}) {
	    if (!(typeof roomName === 'string')) {
	      throw new TypeError(`${roomName} is not a string`);
	    }
	    if (expectedUserIds !== null && !Array.isArray(expectedUserIds)) {
	      throw new TypeError(`${expectedUserIds} is not an array with string`);
	    }
	    // 加入房间的消息体
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	      cid: roomName,
	    };
	    if (expectedUserIds) {
	      this._cachedRoomMsg.expectMembers = expectedUserIds;
	    }
	    const msg = this._cachedRoomMsg;
	    this._send(msg);
	  }

	  /**
	   * 重新加入房间
	   * @param {string} roomName 房间名称
	   */
	  rejoinRoom(roomName) {
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	      cid: roomName,
	      rejoin: true,
	    };
	    const msg = this._cachedRoomMsg;
	    this._send(msg);
	  }

	  /**
	   * 随机加入或创建房间
	   * @param {string} roomName 房间名称
	   * @param {Object} opts （可选）创建房间选项
	   * @param {Object} opts.roomOptions （可选）创建房间选项，默认值为 null
	   * @param {Array.<string>} opts.expectedUserIds （可选）邀请好友 ID 数组，默认值为 null
	   */
	  joinOrCreateRoom(
	    roomName,
	    { roomOptions = null, expectedUserIds = null } = {}
	  ) {
	    if (!(typeof roomName === 'string')) {
	      throw new TypeError(`${roomName} is not a string`);
	    }
	    if (roomOptions !== null && !(roomOptions instanceof Object)) {
	      throw new TypeError(`${roomOptions} is not a Object`);
	    }
	    if (expectedUserIds !== null && !Array.isArray(expectedUserIds)) {
	      throw new TypeError(`${expectedUserIds} is not an array with string`);
	    }
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	      cid: roomName,
	    };
	    // 拷贝房间参数
	    if (roomOptions != null) {
	      const opts = convertRoomOptions(roomOptions);
	      this._cachedRoomMsg = Object.assign(this._cachedRoomMsg, opts);
	    }
	    if (expectedUserIds) {
	      this._cachedRoomMsg.expectMembers = expectedUserIds;
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	      cid: roomName,
	      createOnNotFound: true,
	    };
	    if (expectedUserIds) {
	      msg.expectMembers = expectedUserIds;
	    }
	    this._send(msg);
	  }

	  /**
	   * 随机加入房间
	   * @param {Object} opts （可选）随机加入房间选项
	   * @param {Object} opts.matchProperties （可选）匹配属性，默认值为 null
	   * @param {Array.<string>} opts.expectedUserIds （可选）邀请好友 ID 数组，默认值为 null
	   */
	  joinRandomRoom({ matchProperties = null, expectedUserIds = null } = {}) {
	    if (matchProperties !== null && !(typeof matchProperties === 'object')) {
	      throw new TypeError(`${matchProperties} is not an object`);
	    }
	    if (expectedUserIds !== null && !Array.isArray(expectedUserIds)) {
	      throw new TypeError(`${expectedUserIds} is not an array with string`);
	    }
	    this._cachedRoomMsg = {
	      cmd: 'conv',
	      op: 'add',
	      i: this._getMsgId(),
	    };
	    if (matchProperties) {
	      this._cachedRoomMsg.expectAttr = matchProperties;
	    }
	    if (expectedUserIds) {
	      this._cachedRoomMsg.expectMembers = expectedUserIds;
	    }

	    const msg = {
	      cmd: 'conv',
	      op: 'add-random',
	    };
	    if (matchProperties) {
	      msg.expectAttr = matchProperties;
	    }
	    if (expectedUserIds) {
	      msg.expectMembers = expectedUserIds;
	    }
	    this._send(msg);
	  }

	  /**
	   * 设置房间开启 / 关闭
	   * @param {Boolean} opened 是否开启
	   */
	  setRoomOpened(opened) {
	    if (!(typeof opened === 'boolean')) {
	      throw new TypeError(`${opened} is not a boolean value`);
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'open',
	      i: this._getMsgId(),
	      toggle: opened,
	    };
	    this.this._send(msg);
	  }

	  /**
	   * 设置房间可见 / 不可见
	   * @param {Boolean} visible 是否可见
	   */
	  setRoomVisible(visible) {
	    if (!(typeof visible === 'boolean')) {
	      throw new TypeError(`${visible} is not a boolean value`);
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'visible',
	      i: this._getMsgId(),
	      toggle: visible,
	    };
	    this._send(msg);
	  }

	  /**
	   * 设置房主
	   * @param {number} newMasterId 新房主 ID
	   */
	  setMaster(newMasterId) {
	    if (!(typeof newMasterId === 'number')) {
	      throw new TypeError(`${newMasterId} is not a number`);
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'update-master-client',
	      i: this._getMsgId(),
	      masterActorId: newMasterId,
	    };
	    this._send(msg);
	  }

	  /**
	   * 发送自定义消息
	   * @param {number|string} eventId 事件 ID
	   * @param {Object} eventData 事件参数
	   * @param {Object} options 发送事件选项
	   * @param {ReceiverGroup} options.receiverGroup 接收组
	   * @param {Array.<number>} options.targetActorIds 接收者 Id。如果设置，将会覆盖 receiverGroup
	   */
	  sendEvent(eventId, eventData, options) {
	    if (!(typeof eventId === 'string') && !(typeof eventId === 'number')) {
	      throw new TypeError(`${eventId} is not a string or number`);
	    }
	    if (!(typeof eventData === 'object')) {
	      throw new TypeError(`${eventData} is not an object`);
	    }
	    if (!(options instanceof Object)) {
	      throw new TypeError(`${options} is not a Object`);
	    }
	    const msg = {
	      cmd: 'direct',
	      i: this._getMsgId(),
	      eventId,
	      msg: eventData,
	      receiverGroup: options.receiverGroup,
	      toActorIds: options.targetActorIds,
	    };
	    this._send(msg);
	  }

	  /**
	   * 离开房间
	   */
	  leaveRoom() {
	    const msg = {
	      cmd: 'conv',
	      op: 'remove',
	      i: this._getMsgId(),
	      cid: this.room.name,
	    };
	    this._send(msg);
	  }

	  /**
	   * 获取当前所在房间
	   * @return {Room}
	   * @readonly
	   */
	  get room() {
	    return this._room;
	  }

	  /**
	   * 获取当前玩家
	   * @return {Player}
	   * @readonly
	   */
	  get player() {
	    return this._player;
	  }

	  /**
	   * 获取房间列表
	   * @return {Array.<LobbyRoom>}
	   * @readonly
	   */
	  get lobbyRoomList() {
	    return this._lobbyRoomList;
	  }

	  // 设置房间属性
	  _setRoomCustomProperties(properties, expectedValues) {
	    if (!(typeof properties === 'object')) {
	      throw new TypeError(`${properties} is not an object`);
	    }
	    if (expectedValues && !(typeof expectedValues === 'object')) {
	      throw new TypeError(`${expectedValues} is not an object`);
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'update',
	      i: this._getMsgId(),
	      attr: properties,
	    };
	    if (expectedValues) {
	      msg.expectAttr = expectedValues;
	    }
	    this._send(msg);
	  }

	  // 设置玩家属性
	  _setPlayerCustomProperties(actorId, properties, expectedValues) {
	    if (!(typeof actorId === 'number')) {
	      throw new TypeError(`${actorId} is not a number`);
	    }
	    if (!(typeof properties === 'object')) {
	      throw new TypeError(`${properties} is not an object`);
	    }
	    if (expectedValues && !(typeof expectedValues === 'object')) {
	      throw new TypeError(`${expectedValues} is not an object`);
	    }
	    const msg = {
	      cmd: 'conv',
	      op: 'update-player-prop',
	      i: this._getMsgId(),
	      targetActorId: actorId,
	      playerProperty: properties,
	    };
	    if (expectedValues) {
	      msg.expectAttr = expectedValues;
	    }
	    this._send(msg);
	  }

	  // 开始会话，建立连接后第一条消息
	  _sessionOpen() {
	    const msg = {
	      cmd: 'session',
	      op: 'open',
	      i: this._getMsgId(),
	      appId: this._appId,
	      peerId: this.userId,
	      ua: this._getUA(),
	    };
	    this._send(msg);
	  }

	  // 发送消息
	  _send(msg) {
	    if (!(typeof msg === 'object')) {
	      throw new TypeError(`${msg} is not an object`);
	    }
	    const msgData = JSON.stringify(msg);
	    debug$3(`${this.userId} msg: ${msg.op} -> ${msgData}`);
	    this._websocket.send(msgData);
	    // 心跳包
	    this._stopKeepAlive();
	    this._keepAlive = setTimeout(() => {
	      const keepAliveMsg = {};
	      this._send(keepAliveMsg);
	    }, 10000);
	  }

	  // 连接至大厅服务器
	  _connectToMaster() {
	    this._cleanup();
	    this._switchingServer = true;
	    this._websocket = new browser(this._masterServer);
	    this._websocket.onopen = () => {
	      debug$3('Lobby websocket opened');
	      this._switchingServer = false;
	      this._sessionOpen();
	    };
	    this._websocket.onmessage = msg => {
	      handleMasterMsg(this, msg);
	    };
	    this._websocket.onclose = evt => {
	      debug$3(`Lobby websocket closed: ${evt.code}`);
	      if (evt.code === 1006) {
	        // 连接失败
	        if (this._masterServer === this._secondaryServer) {
	          this.emit(Event.CONNECT_FAILED, evt);
	        } else {
	          // 内部重连
	          this._masterServer = this._secondaryServer;
	          this._connectToMaster();
	        }
	      } else if (this._switchingServer) {
	        debug$3('swiching server');
	      } else {
	        // 断开连接
	        this.emit(Event.DISCONNECTED);
	      }
	    };
	    this._websocket.onerror = error => {
	      console.error(error);
	    };
	  }

	  // 连接至游戏服务器
	  _connectToGame() {
	    this._cleanup();
	    this._switchingServer = true;
	    this._websocket = new browser(this._gameServer);
	    this._websocket.onopen = () => {
	      debug$3('Game websocket opened');
	      this._switchingServer = false;
	      this._sessionOpen();
	    };
	    this._websocket.onmessage = msg => {
	      handleGameMsg(this, msg);
	    };
	    this._websocket.onclose = evt => {
	      debug$3('Game websocket closed');
	      if (evt.code === 1006) {
	        // 连接失败
	        this.emit(Event.CONNECT_FAILED, evt);
	      } else if (this._switchingServer) {
	        debug$3('swiching server');
	      } else {
	        // 断开连接
	        this.emit(Event.DISCONNECTED);
	      }
	      this._stopKeepAlive();
	    };
	    this._websocket.onerror = error => {
	      console.error(error);
	    };
	  }

	  _getMsgId() {
	    this._msgId += 1;
	    return this._msgId;
	  }

	  _stopKeepAlive() {
	    if (this._keepAlive) {
	      clearTimeout(this._keepAlive);
	      this._keepAlive = null;
	    }
	  }

	  _cleanup() {
	    if (this._websocket) {
	      this._websocket.onopen = null;
	      this._websocket.onconnect = null;
	      this._websocket.onmessage = null;
	      this._websocket.onclose = null;
	      this._websocket.close();
	      this._websocket = null;
	    }
	  }

	  _getUA() {
	    return `${version}_${this._gameVersion}`;
	  }
	}

	/**
	 * 接收组枚举
	 * @readonly
	 * @enum {number}
	 */
	const ReceiverGroup = {
	  /**
	   * 其他人（除了自己之外的所有人）
	   */
	  Others: 0,
	  /**
	   * 所有人（包括自己）
	   */
	  All: 1,
	  /**
	   * 主机客户端
	   */
	  MasterClient: 2,
	};

	/**
	 * 创建房间标识
	 * @readonly
	 * @enum {number}
	 */
	const CreateRoomFlag = {
	  /**
	   * Master 掉线后自动切换 Master
	   */
	  MasterAutoSwitch: 1,
	  /**
	   * 只允许 Master 设置房间属性
	   */
	  MasterUpdateRoomProperties: 2,
	  /**
	   * 只允许 Master 设置 Master
	   */
	  MasterSetMaster: 4,
	};

	const play = new Play();

	exports.play = play;
	exports.Play = Play;
	exports.Region = Region;
	exports.Room = Room;
	exports.Player = Player;
	exports.Event = Event;
	exports.ReceiverGroup = ReceiverGroup;
	exports.CreateRoomFlag = CreateRoomFlag;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=play.js.map
