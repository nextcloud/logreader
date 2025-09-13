/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Pinia } from 'pinia'
import type { ILogEntry } from '../interfaces'

import { getCanonicalLocale, translate as t } from '@nextcloud/l10n'
import { LOGGING_LEVEL_NAMES } from '../constants'
import { useSettingsStore } from '../store/settings'

/**
 *
 * @param pinia Pinia instance
 */
export function useLogFormatting(pinia?: Pinia) {
	const settingsStore = useSettingsStore(pinia)

	const formatTime = (time: string) => {
		const dateFormat = Intl.DateTimeFormat(getCanonicalLocale(), {
			dateStyle: 'medium',
			timeStyle: 'medium',
			timeZone: settingsStore.dateTimeFormat === 'utc' ? 'UTC' : undefined,
		})
		return dateFormat.format(new Date(time))
	}
	/**
	 * Format a log entry into a human readable text
	 *
	 * @param entry The log entry to format
	 */
	const formatLogEntry = (entry: ILogEntry) => {
		return (
			`[${entry.app}] ${LOGGING_LEVEL_NAMES[entry.level]}: ${entry.message}\n`
			+ (entry.method ? `\t${entry.method} ${entry.url}\n` : '')
			+ t('logreader', '\tfrom {address} by {user} at {time}\n', {
				address: entry.remoteAddr || '?',
				user: entry.user || '?',
				time: formatTime(entry.time),
			})
		)
	}
	return {
		formatTime,
		formatLogEntry,
	}
}
