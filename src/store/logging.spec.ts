/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { createTestingPinia } from '@pinia/testing'
import { expect, describe, it, vi, beforeAll, afterEach, afterAll } from 'vitest'

import type { ILogEntry } from '../interfaces'
import { useSettingsStore } from '../store/settings'
import { useLogStore } from './logging'
import { POLLING_INTERVAL } from '../constants'

// We need to declare the mocks here to access the mocked functions from the tests as mocks are hoisted -> moved to the top of the file
const mocks = vi.hoisted(() => {
	return {
		parseLogFile: vi.fn(),
		logger: {
			debug: vi.fn(),
			warn: vi.fn(),
		},
		getLog: vi.fn(),
		pollLog: vi.fn(),
		showError: vi.fn(),
	}
})

class ServerError extends Error {

	public status = 500

}

describe('store:logging', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.clearAllTimers()
	})

	afterAll(() => {
		vi.useRealTimers()
	})
	beforeAll(() => {
		vi.useFakeTimers()
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
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
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.getLog).mockImplementation(async ({ query }: { query: string}) => {
			await (new Promise(resolve => setTimeout(resolve, 50)))
			// Fake an axios response
			return {
				data: {
					data: [{ message: query }, { message: `${query}${query}` }],
					remain: false,
				},
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
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
		vi.mock('../utils/logfile.ts', () => {
			return {
				parseLogFile: mocks.parseLogFile,
				parseRawLogEntry: vi.fn((v) => v),
			}
		})

		vi.mocked(mocks.parseLogFile).mockImplementation(async () => {
			return [{ message: 'hello' }]
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
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
		vi.mock('../utils/logfile.ts', () => {
			return {
				parseLogFile: mocks.parseLogFile,
				parseRawLogEntry: vi.fn((v) => v),
			}
		})

		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		const settings = useSettingsStore()
		settings.localFile = undefined

		await store.loadFile()
		// logs the error but does not call parseLogFile
		expect(mocks.logger.debug).toBeCalled()
		expect(mocks.parseLogFile).not.toBeCalled()
	})

	it('loads more from server', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.getLog).mockImplementationOnce(() => ({
			data: {
				data: [{ message: 'hello' }],
				remain: false,
			},
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = []
		expect(store.entries).toEqual([])

		await store.loadMore()
		expect(mocks.getLog).toBeCalled()
		expect(store.entries).toEqual([{ message: 'hello' }])
	})

	it('loads more newer entries from server', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ message: 'hello' }],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = []
		expect(store.entries).toEqual([])

		await store.loadMore(false)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '' })
		expect(store.entries).toEqual([{ message: 'hello' }])
	})

	it('loads more newer entries from server with last request ID', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ message: 'hello' }],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = [{ reqId: '1234' }, { reqId: '5678' }] as ILogEntry[]

		await store.loadMore(false)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '1234' })
		expect(store.allEntries).toEqual([{ message: 'hello' }, { reqId: '1234' }, { reqId: '5678' }])
	})

	it('does not loads more from server when local file is used', async () => {
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

		const store = useLogStore()
		const settings = useSettingsStore()
		settings.localFile = new File([], 'log')

		await store.loadMore()
		expect(mocks.getLog).not.toBeCalled()
	})

	it('does not load more with pending request', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.getLog).mockImplementationOnce(async () => {
			await new Promise((resolve) => window.setTimeout(resolve, 100))

			return {
				data: {
					data: [{ message: 'hello' }],
					remain: false,
				},
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
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
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = []
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(1)
		expect(mocks.pollLog).toBeCalledWith({ lastReqId: '' })
	})

	it('can poll for new entries with old available', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

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
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ reqId: '123' }],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = []
		store.startPolling()
		expect(mocks.pollLog).not.toBeCalled()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		store.stopPolling()
		vi.advanceTimersByTime(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalledTimes(1)
	})

	it('only starts one polling timer', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => ({
			data: [{ reqId: '123' }],
		}))

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.allEntries = []
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
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})
		vi.mock('@nextcloud/dialogs', () => {
			return {
				showError: mocks.showError,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => { throw Error() })

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalled()
		expect(mocks.logger.warn).toBeCalled()
		expect(mocks.showError).toBeCalledWith('Could not fetch new entries')
	})

	it('handles server errors while polling', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
				pollLog: mocks.pollLog,
			}
		})
		vi.mock('../utils/logger.ts', () => {
			return {
				logger: mocks.logger,
			}
		})
		vi.mock('@nextcloud/dialogs', () => {
			return {
				showError: mocks.showError,
			}
		})
		vi.mocked(mocks.pollLog).mockImplementationOnce(() => { throw new ServerError() })

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useLogStore()
		store.startPolling()
		await vi.advanceTimersByTimeAsync(POLLING_INTERVAL)
		expect(mocks.pollLog).toBeCalled()
		expect(mocks.logger.warn).toBeCalled()
		expect(mocks.showError).toBeCalledWith('Could not fetch new log entries (server unavailable)')
	})
})
