/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { createTestingPinia } from '@pinia/testing'
import { expect, describe, it, vi, beforeAll, afterEach, afterAll } from 'vitest'

import type { ILogEntry } from '../interfaces'
import { useSettingsStore } from '../store/settings'
import { useLogStore } from './logging'

const mocks = vi.hoisted(() => {
	return {
		parseLogFile: vi.fn(),
		logger: {
			debug: vi.fn(),
		},
		getLog: vi.fn(),
	}
})

describe('store:logging', () => {
	afterEach(() => {
		vi.restoreAllMocks()
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
	})

	it('not searches on server when local file is loaded', async () => {
		vi.mock('../api.ts', () => {
			return {
				getLog: mocks.getLog,
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
})
