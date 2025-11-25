/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ILogEntry, IRawLogEntry } from '../interfaces'

import { parseException } from './exception'
import { logger } from './logger'
import { splitter } from './splitter'

/**
 * Parse a given log file
 *
 * @param file The log file
 */
export async function parseLogFile(file: File): Promise<ILogEntry[]> {
	return parseLogString(await file.text())
}

/**
 * Parse a given log file as string
 *
 * @param raw The raw log file content
 */
export async function parseLogString(raw: string): Promise<ILogEntry[]> {
	let entries: IRawLogEntry[]
	try {
		const lines = raw.split('\n')
		entries = lines.map(tryParseJSON)
	} catch (e) {
		logger.debug('falling back to json splitter')

		// the input might have had its data reformatted, breaking the original newline separated json
		const lines = splitter(raw).jsons
		entries = lines.map(tryParseJSON)
	}
	return entries.map(parseRawLogEntry)
}

/**
 * Parse a raw (unknown type of) log entry into a modern log entry
 *
 * @param entry The raw log entry
 */
export function parseRawLogEntry(entry: IRawLogEntry): ILogEntry {
	return {
		...entry,
		exception: parseException((entry as ILogEntry).exception || entry.message),
	} as ILogEntry
}

/**
 * Try to parse a single log entry
 *
 * @param json raw log entry
 */
function tryParseJSON(json: string): IRawLogEntry {
	try {
		return JSON.parse(json)
	} catch (e) {
		logger.debug('Could not simply parse log entry', { error: e, json })

		// Handle quoted log entries
		if (json.startsWith('"') && json.endsWith('"')) {
			let inner = json.substring(1, json.length - 1)

			// csv escaped quotes
			if (inner.match(/^\{\s*""/)) {
				inner = inner.replace(/""/g, '"')
			}
			return JSON.parse(inner)
		}

		// fix unescaped message json
		const startPos = json.indexOf('"message":"') + 11
		const endPos = json.lastIndexOf('","level":')
		const start = json.substring(0, startPos)
		const end = json.substring(endPos)
		const message = json.slice(startPos, endPos)

		const escapedMessage = message.replace(/([^\\]|^)["]/g, '$1\\"')
		json = start + escapedMessage + end

		return JSON.parse(json)
	}
}
