/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { LogEntry } from '../types'

/**
 * Parse a given data string to an array of Nextcloud log entries
 *
 * @param data The data to parse, expects a valid Nextcloud log
 */
export const parseLogfile = (data: string) =>
	(JSON.parse(`[${data.replaceAll('}\n', '},\n')}]`) as any[]).map((v) => ({
		...v,
		data: v.data === '--' ? {} : JSON.parse(v.data),
	})) as LogEntry[]
