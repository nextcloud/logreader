/*!
 * php-unserialize-js JavaScript Library
 * https://github.com/bd808/php-unserialize-js
 *
 * Copyright 2013 Bryan Davis and contributors
 * Released under the MIT license
 * http://www.opensource.org/licenses/MIT
 */

export default function (phpstr) {
	var idx = 0
		, refStack = []
		, ridx = 0
		, parseNext // forward declaraton for "use strict"

		, readLength = function () {
		var del = phpstr.indexOf(':', idx)
			, val = phpstr.substring(idx, del);
		idx = del + 2;
		return parseInt(val, 10);
	} //end readLength

		, readInt = function () {
		var del = phpstr.indexOf(';', idx)
			, val = phpstr.substring(idx, del);
		idx = del + 1;
		return parseInt(val, 10);
	} //end readInt

		, parseAsInt = function () {
		var val = readInt();
		refStack[ridx++] = val;
		return val;
	} //end parseAsInt

		, parseAsFloat = function () {
		var del = phpstr.indexOf(';', idx)
			, val = phpstr.substring(idx, del);
		idx = del + 1;
		val = parseFloat(val);
		refStack[ridx++] = val;
		return val;
	} //end parseAsFloat

		, parseAsBoolean = function () {
		var del = phpstr.indexOf(';', idx)
			, val = phpstr.substring(idx, del);
		idx = del + 1;
		val = ("1" === val) ? true : false;
		refStack[ridx++] = val;
		return val;
	} //end parseAsBoolean

		, readString = function () {
		var len = readLength()
			, utfLen = 0
			, bytes = 0
			, ch
			, val;
		while (bytes < len) {
			ch = phpstr.charCodeAt(idx + utfLen++);
			if (ch <= 0x007F) {
				bytes++;
			} else if (ch > 0x07FF) {
				bytes += 3;
			} else {
				bytes += 2;
			}
		}
		val = phpstr.substring(idx, idx + utfLen);
		idx += utfLen + 2;
		return val;
	} //end readString

		, parseAsString = function () {
		var val = readString();
		refStack[ridx++] = val;
		return val;
	} //end parseAsString

		, readType = function () {
		var type = phpstr.charAt(idx);
		idx += 2;
		return type;
	} //end readType

		, readKey = function () {
		var type = readType();
		switch (type) {
			case 'i':
				return readInt();
			case 's':
				var key = readString();
				if (key[key.length - 2] === '"') { // missing null bytes gives invalid length
					key = key.substr(0, key.length - 2);
					idx -= 2;
				}
				return key;
			default:
				throw {
					name: "Parse Error",
					message: "Unknown key type '" + type + "' at position " +
						(idx - 2)
				};
		} //end switch
	}

		, parseAsArray = function () {
		var len = readLength()
			, resultArray = []
			, resultHash = {}
			, keep = resultArray
			, lref = ridx++
			, key
			, val
			, i
			, j
			, alen;

		refStack[lref] = keep;
		for (i = 0; i < len; i++) {
			key = readKey();
			val = parseNext();
			if (keep === resultArray && parseInt(key, 10) === i) {
				// store in array version
				resultArray.push(val);

			} else {
				if (keep !== resultHash) {
					// found first non-sequential numeric key
					// convert existing data to hash
					for (j = 0, alen = resultArray.length; j < alen; j++) {
						resultHash[j] = resultArray[j];
					}
					keep = resultHash;
					refStack[lref] = keep;
				}
				resultHash[key] = val;
			} //end if
		} //end for

		idx++;
		return keep;
	} //end parseAsArray

		, fixPropertyName = function (parsedName, baseClassName) {
		var class_name
			, prop_name
			, pos;
		if ("\u0000" === parsedName.charAt(0)) {
			// "<NUL>*<NUL>property"
			// "<NUL>class<NUL>property"
			pos = parsedName.indexOf("\u0000", 1);
			if (pos > 0) {
				class_name = parsedName.substring(1, pos);
				prop_name = parsedName.substr(pos + 1);

				if ("*" === class_name) {
					// protected
					return prop_name;
				} else if (baseClassName === class_name) {
					// own private
					return prop_name;
				} else {
					// private of a descendant
					return class_name + "::" + prop_name;

					// On the one hand, we need to prefix property name with
					// class name, because parent and child classes both may
					// have private property with same name. We don't want
					// just to overwrite it and lose something.
					//
					// On the other hand, property name can be "foo::bar"
					//
					//     $obj = new stdClass();
					//     $obj->{"foo::bar"} = 42;
					//     // any user-defined class can do this by default
					//
					// and such property also can overwrite something.
					//
					// So, we can to lose something in any way.
				}
			}
		} else if (parsedName.substr(0, baseClassName.length) === baseClassName) { // private property with missing null bytes
			return baseClassName + '::' + parsedName.substr(baseClassName.length);
		} else {
			// public "property"
			return parsedName;
		}
	}

		, parseAsObject = function () {
		var len
			, obj = {}
			, lref = ridx++
			// HACK last char after closing quote is ':',
			// but not ';' as for normal string
			, clazzname = readString()
			, key
			, val
			, i;

		refStack[lref] = obj;
		len = readLength();
		for (i = 0; i < len; i++) {
			key = fixPropertyName(readKey(), clazzname);
			val = parseNext();
			obj[key] = val;
		}
		idx++;
		return {'class': clazzname, 'properties': obj};
	} //end parseAsObject

		, parseAsCustom = function () {
		var clazzname = readString()
			, content = readString();
		return {
			"__PHP_Incomplete_Class_Name": clazzname,
			"serialized": content
		};
	} //end parseAsCustom

		, parseAsRefValue = function () {
		var ref = readInt()
			// php's ref counter is 1-based; our stack is 0-based.
			, val = refStack[ref - 1];
		refStack[ridx++] = val;
		return val;
	} //end parseAsRefValue

		, parseAsRef = function () {
		var ref = readInt();
		// php's ref counter is 1-based; our stack is 0-based.
		return refStack[ref - 1];
	} //end parseAsRef

		, parseAsNull = function () {
		var val = null;
		refStack[ridx++] = val;
		return val;
	}; //end parseAsNull

	parseNext = function () {
		var type = readType();
		switch (type) {
			case 'i':
				return parseAsInt();
			case 'd':
				return parseAsFloat();
			case 'b':
				return parseAsBoolean();
			case 's':
				return parseAsString();
			case 'a':
				return parseAsArray();
			case 'O':
				return parseAsObject();
			case 'C':
				return parseAsCustom();

			// link to object, which is a value - affects refStack
			case 'r':
				return parseAsRefValue();

			// PHP's reference - DOES NOT affect refStack
			case 'R':
				return parseAsRef();

			case 'N':
				return parseAsNull();
			default:
				throw {
					name: "Parse Error",
					message: "Unknown type '" + type + "' at position " + (idx - 2)
				};
		} //end switch
	}; //end parseNext

	return parseNext();
}
