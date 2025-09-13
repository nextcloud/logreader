/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from './logger'

describe('utils:logger', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('creates a logger instance', () => {
		expect(typeof logger).toBe('object')
		expect(typeof logger.warn).toBe('function')

		const consoleSpy = vi.spyOn(window.console, 'warn').mockImplementation(() => {})
		logger.warn('foo')
		expect(consoleSpy).toBeCalled()
		expect(consoleSpy.mock.calls[0][0]).toMatch('[WARN] logreader:')
	})
})
