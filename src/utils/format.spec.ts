/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ILogEntry } from '../interfaces'

import { createTestingPinia } from '@pinia/testing'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { useLogFormatting } from './format'

describe('utils:format', () => {
	beforeAll(() => {
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
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
