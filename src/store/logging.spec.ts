/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IAppSettings, ILogEntry } from '../interfaces'

import { createTestingPinia } from '@pinia/testing'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { POLLING_INTERVAL } from '../constants'
import { useSettingsStore } from '../store/settings'
import { useLogStore } from './logging'

// We need to declare the mocks here to access the mocked functions from the tests as mocks are hoisted -> moved to the top of the file
const mocks = vi.hoisted(() => {
	return {
		parseLogFile: vi.fn(),
		parseLogString: vi.fn(),
		logger: {
			debug: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		},
		getLog: vi.fn(),
		pollLog: vi.fn(),
		showError: vi.fn(),
	}
})

vi.mock('@nextcloud/dialogs', () => ({
	showError: mocks.showError,
}))

vi.mock('../utils/logfile.ts', () => {
	return {
		parseLogFile: mocks.parseLogFile,
		parseLogString: mocks.parseLogString,
		parseRawLogEntry: vi.fn((v) => v),
	}
})

class ServerError extends Error {
	public status = 500
}

function mockInitialState(state: IAppSettings) {
	const input = document.createElement('input')
	input.setAttribute('type', 'hidden')
	input.setAttribute('id', 'initial-state-logreader-settings')
	input.setAttribute('value', btoa(JSON.stringify(state)))
	return document.body.appendChild(input)
}

describe('store:logging', () => {
	beforeEach(() => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.clearAllMocks()
		vi.clearAllTimers()
	})

	afterAll(() => {
		vi.useRealTimers()
	})
	beforeAll(() => {
		vi.useFakeTimers()

		// Mock server settings
		mockInitialState({
			dateTimeFormat: 'local',
			enabled: true,
			liveLog: true,
			shownLevels: [2, 4],
		})
	})

	it('without a query all entries are shown', () => {
		const store = useLogStore()
		expect(store.entries).toEqual([])
		expect(store.allEntries).toEqual([])

		const entries = [{ message: 'hello 123' }, { message: 'hello 456' }] as ILogEntry[]
		store.allEntries = entries
		expect(store.allEntries).toEqual(entries)
		expect(store.entries).toEqual(entries)
	})

	it('filters entries with query', () => {
		const store = useLogStore()
		const entries = [{ message: 'hello 123' }, { message: 'hello 456' }] as ILogEntry[]
		store.allEntries = entries
		expect(store.entries).toEqual(entries)

		store.query = '123'
		// only the first entry is shown
		expect(store.entries).toEqual([entries[0]])
	})

	it('searches on server with query', async () => {
		vi.mocked(mocks.getLog).mockImplementation(async ({ query }: { query: string }) => {
			await (new Promise((resolve) => setTimeout(resolve, 50)))
			// Fake an axios response
			return {
				data: {
					data: [{ message: query }, { message: `${query}${query}` }],
					remain: false,
				},
			}
		})

		const store = useLogStore()
		const entries = [{ message: 'hello 123' }] as ILogEntry[]
		store.allEntries = entries

		const promise = store.searchLogs('bye')
		expect(store.query).toBe('bye')
		expect(store.entries).toEqual([])

		// Now let our mock return the results
		vi.advanceTimersByTime(50)
		await promise
		expect(mocks.getLog).toBeCalled()
		// Now the entries should have been updated
		expect(store.allEntries).toEqual([{ message: 'bye' }, { message: 'byebye' }])
		expect(store.entries).toEqual([{ message: 'bye' }, { message: 'byebye' }])
		expect(store.hasRemainingEntries).toBe(false)

		// No parameter should reset the search query
		store.searchLogs()
		expect(store.query).toBe('')
		vi.advanceTimersByTime(50)
	})

	it('not searches on server when local file is loaded', async () => {
		const store = useLogStore()
		const entries = [{ message: 'hello 123' }] as ILogEntry[]
		store.allEntries = entries
		const settings = useSettingsStore()
		settings.localFile = new File([], 'logfile')

		await store.searchLogs('bye')
		expect(store.query).toBe('bye')
		expect(store.entries).toEqual([])
		expect(mocks.getLog).not.toBeCalled()
	})

	it('loads entries from file', async () => {
		vi.mocked(mocks.parseLogFile).mockImplementation(async () => {
			return [{ message: 'hello' }]
		})

		const store = useLogStore()
		const settings = useSettingsStore()
		const file = new File([], 'logfile')

		store.hasRemainingEntries = true
		expect(store.hasRemainingEntries).toBe(true)

		settings.localFile = file
		await store.loadFile()

		// File parsed, so there are no remaining entries
		expect(store.hasRemainingEntries).toBe(false)
		expect(mocks.parseLogFile).toBeCalledWith(file)
		expect(store.allEntries).toEqual([{ message: 'hello' }])
	})

	it('does not load file if no file was selected', async () => {
		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})

		const store = useLogStore()
		const settings = useSettingsStore()
		settings.localFile = undefined

		await store.loadFile()
		// logs the error but does not call parseLogFile
		expect(mocks.logger.debug).toBeCalled()
		expect(mocks.parseLogFile).not.toBeCalled()
	})

	it('loads entries from clipboard', async () => {
		mocks.parseLogString.mockImplementationOnce(() => [{ message: 'hello' }])

		const clipboard = '{message: "hello"}'

		const store = useLogStore()
		const settings = useSettingsStore()

		store.hasRemainingEntries = true
		expect(store.hasRemainingEntries).toBe(true)

		await store.loadText(clipboard)

		// File parsed, so there are no remaining entries
		expect(store.hasRemainingEntries).toBe(false)
		expect(settings.localFileName).toBe('Clipboard')
		expect(mocks.parseLogString).toBeCalledWith(clipboard)
		expect(store.allEntries).toEqual([{ message: 'hello' }])
	})

	it('handles empty clipboard paste', async () => {
		const store = useLogStore()
		const settings = useSettingsStore()

		store.hasRemainingEntries = true
		expect(store.hasRemainingEntries).toBe(true)

		await store.loadText('')

		// File parsed, so there are no remaining entries
		expect(store.hasRemainingEntries).toBe(true)
		expect(settings.localFile).toBe(undefined)
		expect(settings.localFileName).toBe('')
	})

	it('handles invalid clipboard paste', async () => {
		// throw an error
		mocks.parseLogString.mockImplementationOnce(() => {
			throw new Error()
		})

		const store = useLogStore()
		const settings = useSettingsStore()

		store.hasRemainingEntries = true
		expect(store.hasRemainingEntries).toBe(true)

		await store.loadText('invalid')

		// File parsed, so there are no remaining entries
		expect(store.hasRemainingEntries).toBe(true)
		expect(mocks.showError).toBeCalled()
		expect(settings.localFile).toBe(undefined)
		expect(settings.localFileName).toBe('')
	})

	it('loads more from server', async () => {
		vi.mocked(mocks.getLog).mockImplementationOnce(() => ({
			data: {
				data: [{ message: 'hello' }],
				remain: false,
			},
		}))

		const store = useLogStore()
		store.allEntries = []
		expect(store.entries).toEqual([])

		await store.loadMore()
		expect(mocks.getLog).toBeCalled()
		expect(store.entries).toEqual([{ message: 'hello' }])
	})

	it('loads more newer entries from server (with pollLog)', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ reqId: '456', message: 'hello' }],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '123', message: 'hello' }]

		await store.loadMore(false)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '123' })
		expect(store.entries).toEqual([{ reqId: '456', message: 'hello' }, { reqId: '123', message: 'hello' }])
	})

	it('loads more newer entries from server (with getLog)', async () => {
		vi.mocked(mocks.getLog).mockImplementationOnce(() => ({
			data: {
				data: [{ message: 'hello' }],
				remain: false,
			},
		}))

		const store = useLogStore()
		store.allEntries = []
		expect(store.entries).toEqual([])

		await store.loadMore(false)
		expect(mocks.pollLog).not.toBeCalled()
		expect(mocks.getLog).toBeCalledWith({ offset: 0, query: '' })
		expect(store.entries).toEqual([{ message: 'hello' }])
	})

	it('loads more newer entries from server with last request ID', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ message: 'hello' }],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '1234' }, { reqId: '5678' }] as ILogEntry[]

		await store.loadMore(false)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '1234' })
		expect(store.allEntries).toEqual([{ message: 'hello' }, { reqId: '1234' }, { reqId: '5678' }])
	})

	it('does not loads more from server when local file is used', async () => {
		const store = useLogStore()
		const settings = useSettingsStore()
		settings.localFile = new File([], 'log')

		await store.loadMore()
		expect(mocks.getLog).not.toBeCalled()
	})

	it('does not load more with pending request', async () => {
		vi.mocked(mocks.getLog).mockImplementationOnce(async () => {
			await new Promise((resolve) => window.setTimeout(resolve, 100))

			return {
				data: {
					data: [{ message: 'hello' }],
					remain: false,
				},
			}
		})

		const store = useLogStore()
		// Start first request
		const initialRequest = store.loadMore()
		// Start second request which should be skipped
		await store.loadMore()
		// advance timer and await first request
		vi.advanceTimersByTime(100)
		await initialRequest
		expect(mocks.getLog).toBeCalledTimes(1)
	})

	it('can poll for new entries', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }]
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(1)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '123' })
	})

	it('can poll for new entries with old available', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }, { reqId: '456' }] as ILogEntry[]
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(1)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '123' })
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(2)
	})

	it('can stop polling for new entries', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ reqId: '456' }],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }]
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		store.stopPolling()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(1)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '123' })
	})

	it('only starts one polling timer', async () => {
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ reqId: '456' }],
		}))

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }]
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL / 2)
		expect(mocks.pollLog).not.toBeCalled()

		// Start again
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL + 1)
		expect(mocks.pollLog).toBeCalledTimes(1)
	})

	it('does not poll when searching', async () => {
		const store = useLogStore()
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL / 2)
		store.query = 'search'
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL / 2 + 1)
		expect(mocks.pollLog).not.toBeCalled()
		// But still active polling timer
		expect(vi.getTimerCount()).toBe(1)
	})

	it('does not poll when local file is loaded', async () => {
		const store = useLogStore()
		const settings = useSettingsStore()
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL / 2)
		settings.localFile = new File([], 'log')
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL / 2 + 1)
		expect(mocks.pollLog).not.toBeCalled()
		// But still active polling timer
		expect(vi.getTimerCount()).toBe(1)
	})

	it('handles errors while polling', async () => {
		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => {
			throw Error()
		})

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }]
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalled()
		expect(mocks.logger.warn).toBeCalled()
		expect(mocks.showError).toBeCalledWith('Could not fetch new entries')
	})

	it('handles server errors while polling', async () => {
		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => {
			throw new ServerError()
		})

		const store = useLogStore()
		store.allEntries = [{ reqId: '123' }]
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalled()
		expect(mocks.logger.warn).toBeCalled()
		expect(mocks.showError).toBeCalledWith('Could not fetch new log entries (server unavailable)')
	})
})
