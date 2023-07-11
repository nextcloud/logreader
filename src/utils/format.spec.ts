/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { createTestingPinia } from '@pinia/testing'
import { expect, describe, it, vi, beforeAll } from 'vitest'

import type { ILogEntry } from '../interfaces'
import { useLogFormatting } from './format'
import { useSettingsStore } from '../store/settings'

describe('utils:format', () => {
	beforeAll(() => {
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
		})
	})

	describe('formatTime', () => {
		it('formats a datetime to raw', () => {
			const { formatTime } = useLogFormatting()
			const a = formatTime('2023-07-11T19:08:02.102Z')
			expect(a).to.be.eq('2023-07-11T19:08:02.102Z')
		})

		it('formats a datetime to utc', () => {
			const store = useSettingsStore()
			store.dateTimeFormat = 'utc'

			const { formatTime } = useLogFormatting()
			const a = formatTime('2023-07-11T19:08:02.102Z')
			expect(a).toBe('Jul 11, 2023, 7:08:02 PM')
		})

		it('formats a datetime to local', () => {
			// It is importent for this test that we run it with a different timezone than UTC to check that it is not the same as `dateTimeFormat = utc`. In this case 'Etc/GMT+1' (-01:00)
			const store = useSettingsStore()
			store.dateTimeFormat = 'local'

			const { formatTime } = useLogFormatting()
			const a = formatTime('2023-07-11T19:08:02.102Z')
			expect(a).toBe('Jul 11, 2023, 6:08:02 PM')
		})
	})

	describe('formatLogEntry', () => {
		it('formats a log entry', () => {
			const { formatLogEntry } = useLogFormatting()
			const entry = { app: 'app', level: 1, message: 'msg', time: '2023-07-11T19:08:02.102Z' }
			expect(formatLogEntry(entry as ILogEntry)).toBe('[app] Info: msg\n\tfrom ? by ? at Jul 11, 2023, 6:08:02 PM\n')
		})

		it('formats a log entry with user and remoteAddr', () => {
			const { formatLogEntry } = useLogFormatting()
			const entry = { app: 'app', level: 1, message: 'msg', time: '2023-07-11T19:08:02.102Z', user: 'user1', remoteAddr: '0.0.0.0' }
			expect(formatLogEntry(entry as ILogEntry)).toBe('[app] Info: msg\n\tfrom 0.0.0.0 by user1 at Jul 11, 2023, 6:08:02 PM\n')
		})

		it('formats a log entry with url', () => {
			const { formatLogEntry } = useLogFormatting()
			const entry = { app: 'app', level: 1, message: 'msg', time: '2023-07-11T19:08:02.102Z', method: 'GET', url: 'foo/bar' }
			expect(formatLogEntry(entry as ILogEntry)).toBe('[app] Info: msg\n\tGET foo/bar\n\tfrom ? by ? at Jul 11, 2023, 6:08:02 PM\n')
		})
	})
})
