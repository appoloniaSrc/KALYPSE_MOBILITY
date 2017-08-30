

function removeStrings(where, whats) {
	//console.log("removeStrings() - where="+where+" - what="+whats);
	for (var key in whats) {
		//console.log("key="+whats[key]);
		where = where.replace(whats[key], "");
	}
	return where;
}


export var SoapTools = {

	/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
	parseXml: function (xml, tab, removeText) {
		//function xml2json(xml, tab) {
		//console.log("parseXml");
		var X = {
			toObj: function (xml) {
				//console.log("toObj");	    	  
				var o = {};
				//console.log(" -- toObj xml.nodeType="+xml.nodeType);
				//console.log(" -- <"+xml.nodeName+"> ");
				//console.log("> toObj xml.nodeValue="+xml.nodeValue);
				if (xml.nodeType == 1) {   // element node ..
					if (xml.attributes.length)   // element with attributes  ..
						for (var i = 0; i < xml.attributes.length; i++) {
							//console.log("toObj xml.attributes[i].nodeName"+xml.attributes[i].nodeName);
							o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
						}
					if (xml.firstChild) { // element has child nodes ..
						//console.log("   -- toObj xml.firstChild ");
						var textChild = 0, cdataChild = 0, hasElementChild = false;
						for (var n = xml.firstChild; n; n = n.nextSibling) {
							//console.log("   -- n.nodeType="+n.nodeType);	            	   
							if (n.nodeType == 1) hasElementChild = true;
							else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
							else if (n.nodeType == 4) cdataChild++; // cdata section node
						}
						if (hasElementChild) {
							//console.log("   -- toObj hasElementChild");
							if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
								X.removeWhite(xml);
								//console.log("     -- toObj hasElementChild A");
								for (var n = xml.firstChild; n; n = n.nextSibling) {
									//console.log("       -- toObj n.nodeValue="+n.nodeValue);
									if (n.nodeType == 3) { // text node
										o["#text"] = X.escape(n.nodeValue);
									}
									else if (n.nodeType == 4)  // cdata node
										o["#cdata"] = X.escape(n.nodeValue);
									else if (o[n.nodeName]) {  // multiple occurence of element ..
										//console.log("toObj hasElementChild C");
										if (o[n.nodeName] instanceof Array) {
											o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
											//console.log("toObj hasElementChild D");
										}
										else {
											//console.log("toObj hasElementChild E");
											o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
										}
									}
									else  // first occurence of element..
									{
										//console.log("       -- toObj hasElementChild F nodeName="+n.nodeName);
										//console.log("to remove = "+removeText);
										var nn = removeStrings(n.nodeName, removeText);
										if (o[nn]) {// si ça existe
											//console.log("EXISTE DEJA : o["+nn+"]");
											if (!Array.isArray(o[nn])) {	// si c'est pas encore un tableau 
												o[nn] = new Array(o[nn]);	// créé un tableau
											}
											o[nn].push(X.toObj(n));			// ajoute au tableau
										} else {
											//console.log("EXISTE pas : o["+nn+"]");
											o[nn] = X.toObj(n);				// créé l'élément et parse le sous élément
										}

									}
								}
							}
							else { // mixed content
								//console.log("toObj hasElementChild B");
								if (!xml.attributes.length)
									o = X.escape(X.innerXml(xml));
								else
									o["#text"] = X.escape(X.innerXml(xml));
							}
						}
						else if (textChild) { // pure text
							if (!xml.attributes.length)
								o = X.escape(X.innerXml(xml));
							else
								o["#text"] = X.escape(X.innerXml(xml));
						}
						else if (cdataChild) { // cdata
							if (cdataChild > 1)
								o = X.escape(X.innerXml(xml));
							else
								for (var n = xml.firstChild; n; n = n.nextSibling)
									o["#cdata"] = X.escape(n.nodeValue);
						}
					}
					if (!xml.attributes.length && !xml.firstChild) o = null;
				}
				else if (xml.nodeType == 9) { // document.node
					o = X.toObj(xml.documentElement);
				}
				else
					alert("unhandled node type: " + xml.nodeType);
				return o;
			},
			toJson: function (o, name, ind) {
				//console.log("toJson");	
				var json = name ? ("\"" + name + "\"") : "";
				if (o instanceof Array) {
					for (var i = 0, n = o.length; i < n; i++)
						o[i] = X.toJson(o[i], "", ind + "\t");
					json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
				}
				else if (o == null)
					json += (name && ":") + "null";
				else if (typeof (o) == "object") {
					var arr = [];
					for (var m in o)
						arr[arr.length] = X.toJson(o[m], m, ind + "\t");
					json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
				}
				else if (typeof (o) == "string")
					json += (name && ":") + "\"" + o.toString() + "\"";
				else
					json += (name && ":") + o.toString();
				return json;
			},
			innerXml: function (node) {
				//console.log("innerXml");	
				var s = ""
				if ("innerHTML" in node) {
					//console.log("innerXml node.innerHTML="+node.innerHTML);
					s = node.innerHTML;
				}
				else {
					var asXml = function (n) {
						var s = "";
						if (n.nodeType == 1) {
							s += "<" + n.nodeName;
							for (var i = 0; i < n.attributes.length; i++)
								s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
							if (n.firstChild) {
								s += ">";
								for (var c = n.firstChild; c; c = c.nextSibling)
									s += asXml(c);
								s += "</" + n.nodeName + ">";
							}
							else
								s += "/>";
						}
						else if (n.nodeType == 3)
							s += n.nodeValue;
						else if (n.nodeType == 4)
							s += "<![CDATA[" + n.nodeValue + "]]>";
						return s;
					};
					for (var c = node.firstChild; c; c = c.nextSibling)
						s += asXml(c);
				}
				return s;
			},
			escape: function (txt) {
				return txt.replace(/[\\]/g, "\\\\")
					.replace(/[\"]/g, '\\"')
					.replace(/[\n]/g, '\\n')
					.replace(/[\r]/g, '\\r');
			},
			removeWhite: function (e) {
				e.normalize();
				for (var n = e.firstChild; n;) {
					if (n.nodeType == 3) {  // text node
						if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
							var nxt = n.nextSibling;
							e.removeChild(n);
							n = nxt;
						}
						else
							n = n.nextSibling;
					}
					else if (n.nodeType == 1) {  // element node
						X.removeWhite(n);
						n = n.nextSibling;
					}
					else                      // any other node
						n = n.nextSibling;
				}
				return e;
			}
		};
		if (xml.nodeType == 9) // document node
			xml = xml.documentElement;
		var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
		return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
	},

	// aardwulf systems
	// This work is licensed under a Creative Commons License.
	// http://www.aardwulf.com/tutor/base64/
	encode64: function (input) {
		var keyStr = "ABCDEFGHIJKLMNOP" +
			"QRSTUVWXYZabcdef" +
			"ghijklmnopqrstuv" +
			"wxyz0123456789+/" +
			"=";

		var output = "";
		var chr1: number, chr2: number, chr3: number;
		var enc1: number, enc2: number, enc3: number, enc4: number;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				keyStr.charAt(enc1) +
				keyStr.charAt(enc2) +
				keyStr.charAt(enc3) +
				keyStr.charAt(enc4);

		} while (i < input.length);

		return output;
	},

	isodatetime: function () {
		var today = new Date();
		var year = today.getFullYear();
		if (year < 2000) // Y2K Fix, Isaac Powell
			year = year + 1900; // http://onyx.idbsu.edu/~ipowell
		var month = today.getMonth() + 1;
		var day = today.getDate();
		var hour = today.getHours();
		var hourUTC = today.getUTCHours();
		var diff = hour - hourUTC;
		var hourdifference = Math.abs(diff);
		var minute = today.getMinutes();
		var minuteUTC = today.getUTCMinutes();
		var minutedifference;
		var second = today.getSeconds();
		var timezone;
		if (minute != minuteUTC && minuteUTC < 30 && diff < 0) {
			hourdifference--;
		}
		if (minute != minuteUTC && minuteUTC > 30 && diff > 0) {
			hourdifference--;
		}
		if (minute != minuteUTC) {
			minutedifference = ":30";
		} else {
			minutedifference = ":00";
		}
		if (hourdifference < 10) {
			timezone = "0" + hourdifference + minutedifference;
		} else {
			timezone = "" + hourdifference + minutedifference;
		}
		if (diff < 0) {
			timezone = "-" + timezone;
		} else {
			timezone = "+" + timezone;
		}

		var _two_digits = function (n: number) {
			return n <= 9 ? "0" + n.toString() : n.toString();
		}
		var month_str = _two_digits(month);
		var day_str = _two_digits(day);
		var hour_str = _two_digits(hour);
		var minute_str = _two_digits(minute);
		var second_str = _two_digits(second);

		var time = year + "-" + month_str + "-" + day_str + "T" + hour_str + ":" + minute_str + ":"
			+ second_str + timezone;
		return time;
	},



	/**
	 * 
	 * Base64 encode / decode http://www.webtoolkit.info/
	 * 
	 */
	Base64: {

		// private property
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// public method for encoding
		encode: function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = SoapTools.Base64._utf8_encode(input);

			while (i < input.length) {

				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
					this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
					this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

			}

			return output;
		},

		// public method for decoding
		decode: function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {

				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}

			//output = Base64._utf8_decode(output);

			return output;

		},

		// private method for UTF-8 encoding
		_utf8_encode: function (string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode: function (utftext) {
			var string = "";
			var i = 0;
			var c = 0, c2 = 0, c3 = 0;

			while (i < utftext.length) {

				c = utftext.charCodeAt(i);

				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}

			}

			return string;
		}

	},//end Base64

	/**
	 * 
	 * sha1 encryption
	 * 
	 */
	sha1: function (str) :string {
		// discuss at: http://phpjs.org/functions/sha1/
		// original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// improved by: Michael White (http://getsprink.com)
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// input by: Brett Zamir (http://brett-zamir.me)
		// depends on: utf8_encode
		// example 1: sha1('Kevin van Zonneveld');
		// returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

		var rotate_left = function (n, s) {
			var t4 = (n << s) | (n >>> (32 - s));
			return t4;
		};

		/*
		 * var lsb_hex = function (val) { // Not in use; needed? var str=""; var i; var vh; var vl;
		 * 
		 * for ( i=0; i<=6; i+=2 ) { vh = (val>>>(i*4+4))&0x0f; vl = (val>>>(i*4))&0x0f; str += vh.toString(16) + vl.toString(16); } return str; };
		 */

		var cvt_hex = function (val) {
			var str = '';
			var i;
			var v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}
			return str;
		};

		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xEFCDAB89;
		var H2 = 0x98BADCFE;
		var H3 = 0x10325476;
		var H4 = 0xC3D2E1F0;
		var A, B, C, D, E;
		var temp;

		str = SoapTools.Base64._utf8_encode(str);
		var str_len = str.length;

		var word_array = [];
		for (i = 0; i < str_len - 3; i += 4) {
			j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (str_len % 4) {
			case 0:
				i = 0x080000000;
				break;
			case 1:
				i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
				break;
			case 2:
				i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
				break;
			case 3:
				i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
				break;
		}

		word_array.push(i);

		while ((word_array.length % 16) != 14) {
			word_array.push(0);
		}

		word_array.push(str_len >>> 29);
		word_array.push((str_len << 3) & 0x0ffffffff);

		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
			for (i = 0; i < 16; i++) {
				W[i] = word_array[blockstart + i];
			}
			for (i = 16; i <= 79; i++) {
				W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
			}

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

			for (i = 0; i <= 19; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 20; i <= 39; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 40; i <= 59; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 60; i <= 79; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;
		}

		temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
		return temp.toLowerCase();
	}

}
