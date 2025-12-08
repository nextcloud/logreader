/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosError } from '@nextcloud/axios'
import type { ILogEntry } from '../interfaces'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLog, pollLog } from '../api'
import { POLLING_INTERVAL } from '../constants'
import { parseLogFile, parseLogString, parseRawLogEntry } from '../utils/logfile'
import { logger } from '../utils/logger'
import { useSettingsStore } from './settings'

/**
 * Store for handling log entries
 */
export const useLogStore = defineStore('logreader-logs', () => {
	const _settings = useSettingsStore()

	/**
	 * List of all log entries
	 */
	const allEntries = ref<ILogEntry[]>([])

	/**
	 * The current query to filter logs
	 */
	const query = ref<string>('')

	/**
	 * List of filtered log entries (search query)
	 */
	const entries = computed(() => {
		if (query.value) {
			const text = query.value.toLowerCase()
			return allEntries.value.filter((entry) => JSON.stringify(entry).toLowerCase().includes(text))
		}
		return allEntries.value
	})

	/**
	 * Whether there are more remaining (older) log entries on the server
	 */
	const hasRemainingEntries = ref(true)

	/**
	 * Whether polling service is currently running
	 */
	const _polling = ref(false)

	/**
	 * Whether we are currently loading, used to prevent multiple loading requests at the same time
	 */
	const _loading = ref(false)

	/**
	 * Load more entries from server
	 *
	 * @param older Load older entries (default: true)
	 */
	async function loadMore(older = true) {
		// Nothing to do if server logging is disabled
		if (!_settings.isEnabled) {
			return
		}

		// Only load any entries if there is no previous unfinished request
		if (!(_loading.value = !_loading.value)) {
			return
		}

		try {
			if (older || !allEntries.value.length) {
				const { data } = await getLog({ offset: allEntries.value.length, query: query.value })
				allEntries.value.push(...data.data.map(parseRawLogEntry))
				hasRemainingEntries.value = data.remain
			} else {
				const { data } = await pollLog({ lastReqId: allEntries.value[0]!.reqId })
				allEntries.value.splice(0, 0, ...data.map(parseRawLogEntry))
			}
		} catch (e) {
			logger.debug(e as Error)
			showError(t('logreader', 'Could not load log entries'))
		} finally {
			// Handle any error to prevent a dead lock of the _loading property
			_loading.value = false
		}
	}

	/**
	 * Load entries from log file
	 */
	async function loadFile() {
		if (!_settings.localFile) {
			logger.debug('Can not read file, no file was uploaded')
			return
		}

		allEntries.value = await parseLogFile(_settings.localFile)
		hasRemainingEntries.value = false
	}

	/**
	 * Load entries from string
	 *
	 * @param text clipboard text content
	 */
	async function loadText(text: string) {
		// Skip if aborted
		if (text === '') {
			return
		}

		try {
			allEntries.value = await parseLogString(text)
			// TRANSLATORS The clipboard used to paste stuff
			_settings.localFile = new File([], t('logreader', 'Clipboard'))
			// From clipboard so no more entries
			hasRemainingEntries.value = false
		} catch (e) {
			// TRANSLATORS Error when the pasted content from the clipboard could not be parsed
			showError(t('logreader', 'Could not parse clipboard content'))
			logger.error(e as Error)
		}
	}

	/**
	 * Stop polling entries
	 */
	function stopPolling() {
		_polling.value = false
	}

	/**
	 * Start polling new entries from server
	 */
	function startPolling() {
		if (_polling.value) {
			// Already polling, nothing to do
			return
		}

		const doPolling = async () => {
			try {
				// Only poll if not using a local file and store already has some known entries
				if (_settings.isEnabled && query.value === '' && allEntries.value.length) {
					const { data } = await pollLog({ lastReqId: allEntries.value[0]!.reqId })
					allEntries.value.splice(0, 0, ...data.map(parseRawLogEntry))
				}
			} catch (e) {
				logger.warn('Unexpected error while polling for new log entries', { error: e })
				const error = e as AxiosError
				if ((error.status || 0) >= 500) {
					showError(t('logreader', 'Could not fetch new log entries (server unavailable)'))
				} else {
					showError(t('logreader', 'Could not fetch new entries'))
				}
			} finally {
				if (_polling.value) {
					window.setTimeout(doPolling, POLLING_INTERVAL)
				}
			}
		}

		_polling.value = true
		window.setTimeout(doPolling, POLLING_INTERVAL)
	}

	/**
	 * Search the logs for a string
	 *
	 * First it sets the query string so the filtered entries are updated,
	 * then it searched on the server for other logs
	 *
	 * @param search The query string
	 */
	async function searchLogs(search = '') {
		const oldQuery = query.value
		query.value = search

		// if query changed and server logging is enabled, request new entries
		if (search !== oldQuery && _settings.isEnabled) {
			_loading.value = true

			try {
				const { data } = await getLog({ offset: 0, query: search })
				allEntries.value = [...data.data.map(parseRawLogEntry)]
				hasRemainingEntries.value = data.remain
			} finally {
				_loading.value = false
			}
		}
	}

	return { allEntries, entries, hasRemainingEntries, query, loadMore, loadText, loadFile, startPolling, stopPolling, searchLogs }
})
