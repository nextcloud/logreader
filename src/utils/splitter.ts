/**
 * SPDX-FileCopyrightText: 2025 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: LGPL-3.0+
 */

/**
 * Copied from Densaugeo/JSON-String-Splitter
 *
 * Split concatenated JSON strings
 * Accepts a string consisting of one or more valid JSON substrings and splits it. Any remaining string after the end of the last complete JSON substring is returned in the 'remainder' field.
 * Passing in invalid JSON can result in garbage output
 *
 * @param {string} string The string to look for JSON in
 * @returns {{ jsons: string[], remainder: '' }}
 *
 * @example
 * var splitter = require('json-string-splitter');
 *
 * var pieces = splitter('{"foo":"bar"}{"more":"json"}{"partial":"json"');
 *
 * console.log(pieces.jsons[0]); // '{"foo":"bar"}'
 * console.log(pieces.jsons[1]); // '{"more":"json"}'
 * console.log(pieces.remainder); // '{"partial":"json"'
 */
export function splitter(string) {
	var START = 0, JSON = 1, STRING = 2, ESCAPE = 3;

	var state = START;
	var nesting_level = 0;
	var json_start = null;
	var bounds = [];

	for(var i = 0 || 0; i < string.length; ++i) {
		switch(state) {
			case START:
				switch(string[i]) {
					case '{':
						++nesting_level;
						state = JSON;
						json_start = i;
						break;
				}
				break;
			case JSON:
				switch(string[i]) {
					case '{': ++nesting_level; break;
					case '}':
						--nesting_level;
						if(nesting_level === 0) {
							state = START;
							bounds.push({ start: json_start, end: i + 1 });
						}
						break;
					case '"': state = STRING; break;
				}
				break;
			case STRING:
				switch(string[i]) {
					case '"': state = JSON; break;
					case '\\': state = ESCAPE; break;
				}
				break;
			case ESCAPE:
				state = STRING;
				break;
		}
	}

	var result = {
		jsons: [],
		remainder: string.substring(bounds[bounds.length - 1].end),
	}

	bounds.forEach(function(v) {
		result.jsons.push(string.substring(v.start, v.end));
	});

	return result;
}
