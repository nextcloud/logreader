/**
 * SPDX-FileCopyrightText: 2025 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Copied from Densaugeo/JSON-String-Splitter
 *
 * Split concatenated JSON strings
 * Accepts a string consisting of one or more valid JSON substrings and splits it. Any remaining string after the end of the last complete JSON substring is returned in the 'remainder' field.
 * Passing in invalid JSON can result in garbage output
 *
 * @param string The string to look for JSON in
 *
 * @example
 * const pieces = splitter('{"foo":"bar"}{"more":"json"}{"partial":"json"')
 *
 * console.log(pieces.jsons[0]); // '{"foo":"bar"}'
 * console.log(pieces.jsons[1]); // '{"more":"json"}'
 * console.log(pieces.remainder); // '{"partial":"json"'
 */
export function splitter(string: string): { jsons: string[], remainder: string } {
	const START = 0, JSON = 1, STRING = 2, ESCAPE = 3

	let state = START
	let nestingLevel = 0
	let jsonStart = null
	const bounds = []

	for (let i = 0; i < string.length; ++i) {
		switch (state) {
			case START: {
				switch (string[i]) {
					case '{': {
						++nestingLevel
						state = JSON
						jsonStart = i
						break
					}
				}
				break
			}
			case JSON: {
				switch (string[i]) {
					case '{': {
						++nestingLevel
						break
					}
					case '}': {
						--nestingLevel
						if (nestingLevel === 0) {
							state = START
							bounds.push({ start: jsonStart, end: i + 1 })
						}
						break
					}
					case '"': {
						state = STRING
						break
					}
				}
				break
			}
			case STRING: {
				switch (string[i]) {
					case '"': {
						state = JSON
						break
					}
					case '\\': {
						state = ESCAPE
						break
					}
				}
				break
			}
			case ESCAPE: {
				state = STRING
				break
			}
		}
	}

	const result = {
		jsons: [],
		remainder: string.substring(bounds[bounds.length - 1].end),
	}

	bounds.forEach(function(v) {
		result.jsons.push(string.substring(v.start, v.end))
	})

	return result
}
