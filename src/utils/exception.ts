/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IException, ITraceLine } from '../interfaces/ILogEntry'

/*
Example:
```
{
	...
	"message":"Error while running background job (class: OCA\\Files_Versions\\BackgroundJob\\ExpireVersions, arguments: )",
	"exception":{
		"Exception":"OCP\\Files\\NotFoundException",
		"Message":"...",
		"Code":0,
		"Trace":[{
			"file":"/var/www/nextcloud/lib/private/Files/Node/Folder.php",
			"line":138,
			"function":"get",
			"class":"OC\\Files\\Node\\Root",
			"type":"->"
		}]
		"File":"/var/www/nextcloud/lib/private/Files/Node/Root.php",
		"Line":209,
		"CustomMessage":"Error while running background job (class: OCA\\Files_Versions\\BackgroundJob\\ExpireVersions, arguments: )"
	}
}
```
*/

/**
 * Parse the `exception` property of a Nextcloud log entry
 *
 * @param logException The JSON parsed `exception` property
 */
export function parseException(logException: IException | string): IException | undefined {
	if (typeof logException === 'object') {
		return logException
	}

	// Handle nested json exceptions
	if (isNestedJsonException(logException)) {
		return tryParseJSON(logException)
	}

	// Handle old exceptions (up to nextcloud)
	if (isOldStyleException(logException)) {
		const data = tryParseJSON(logException.slice(10))
		const traceLines = data.Trace?.split('\n')
		data.Trace = traceLines?.map(parseTraceLine)
		return data
	}

	return undefined
}

/**
 * Nested JSON exceptions are exceptions where the exception property is another exception as a JSON string
 *
 * @param logMessage message to check
 */
function isNestedJsonException(logMessage: unknown) {
	return typeof logMessage === 'string' && logMessage[0] === '{'
}

/**
 * Check if exception is an old Nextcloud 14 exception
 *
 * @param logMessage message to check
 */
function isOldStyleException(logMessage: unknown) {
	return typeof logMessage === 'string' && logMessage.slice(0, 12) === 'Exception: {'
}

/**
 * Try to parse JSON, sanitized possible unescaped parts.
 *
 * @param json The json string
 * @throws {Error} when json could not be parsed
 */
function tryParseJSON(json: string) {
	try {
		return JSON.parse(json)
	} catch (e) {
		// fix unescaped newlines
		json = json.replace(/\n/g, '\\n')
		// fix unescaped namespace delimiters
		json = json.replace(/([^\\])\\([A-Z{])/g, '$1\\\\$2')
		return JSON.parse(json)
	}
}

/**
 * Parse trace lines of old Nextcloud 14 exceptions
 *
 * @param line The trace line to parse
 */
function parseTraceLine(line: string) {
	let parts = line.split(' ')
	const number = parts.shift()
	const traceData = parts.join(' ')
	parts = traceData.split(':')

	if (parts.length > 1) {
		let file: ITraceLine['file']
		let line: ITraceLine['line']
		const fileAndLine = parts.shift() as string
		const call = parts.join(' ')
		if (fileAndLine[0] === '[') {
			file = fileAndLine
		} else {
			const filePaths = fileAndLine.split('(', 2)
			file = filePaths[0]
			const lineNumber = filePaths[1]?.slice(0, filePaths[1].length - 1)
			line = lineNumber ? parseInt(lineNumber) : undefined
		}
		return {
			function: call,
			number,
			file,
			line,
		}
	} else {
		return {
			function: traceData,
			number,
			file: false,
		}
	}
}
