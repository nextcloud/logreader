import type { AxiosError } from 'axios'
import type { LogEntry } from '../types'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLog, pollLog } from '../api'
import { POLLING_INTERVAL } from '../constants'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { debounce } from '../utils/debounce'

/**
 * Store for handling log entries
 */
export const useLogStore = defineStore('logreader-logs', () => {
	/**
	 * List of all log entries
	 */
	const allEntries = ref<LogEntry[]>([])

	/**
	 * The current query to filter logs
	 */
	const query = ref<string>('')

	/**
	 * List of filtered log entries (search query)
	 */
	const entries = computed(() => query.value ? allEntries.value.filter(entry => JSON.stringify(entry).includes(query.value)) : allEntries.value)

	/**
	 * Last entry in the log ("newest")
	 */
	const lastEntry = computed(() => entries.value.length > 0 ? entries.value.slice(-1)[0] : null)
	/**
	 * Whether polling service is currently running
	 */
	const _polling = ref(false)

	/**
	 * Load more entries from server
	 *
	 * @param older Load older entries (default: true)
	 */
	async function loadMore(older = true) {
		if (older) {
			const { data } = await getLog({ offset: allEntries.value.length })
			allEntries.value.splice(0, 0, ...data.data)
		} else {
			const { data } = await pollLog({ lastReqId: lastEntry.value?.reqId || '' })
			allEntries.value.push(...data.data)
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
	 *
	 * Note: Do not await this, as it will only terminate after `stopPolling` is called
	 */
	async function startPolling() {
		if (_polling.value) {
			// Already polling, nothing to do
			return
		}

		const doPolling = async () => {
			try {
				const { data } = await pollLog({ lastReqId: lastEntry.value?.reqId || '' })
				allEntries.value.push(...data.data)
			} catch (e) {
				console.warn('Unexpected error while polling for new log entries', { exception: e })
				const error = e as AxiosError
				if ((error.status || 0) >= 500) showError(t('logreader', 'Could not fetch new log entries (server unavailable)'))
				else showError(t('logreader', 'Could not fetch new entries'))
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
	function searchLogs(search = '') {
		query.value = search
		if (search !== '') {
			// Actual server side search
			debounce(() => loadMore(), 500)
		}
	}

	return { allEntries, lastEntry, entries, query, startPolling, stopPolling, loadMore, searchLogs }
})
