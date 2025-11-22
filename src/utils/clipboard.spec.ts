/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { copyToCipboard } from './clipboard'

describe('utils:clipboard', () => {
	let originalWindowPrompt: window.prompt

	beforeEach(() => {
		window.prompt = vi.fn(() => '')
	})

	afterEach(() => {
		window.prompt = originalWindowPrompt
	})

	it('writes to clipboard', () => {
		const spy = vi.spyOn(window.navigator.clipboard, 'writeText')
		copyToCipboard('foo bar')
		expect(spy).toBeCalledWith('foo bar')
		expect(window.prompt).not.toBeCalled()
	})

	it('opens promp if not supported clipboard', () => {
		window.navigator.clipboard.writeText = vi.fn(() => {
			throw Error('no secure context')
		})
		copyToCipboard('foo bar')
		expect(window.navigator.clipboard.writeText).toBeCalledWith('foo bar')
		expect(window.prompt).toBeCalled()
	})
})
