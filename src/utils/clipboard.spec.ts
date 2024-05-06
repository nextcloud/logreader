/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { expect, describe, it, vi } from 'vitest'
import { copyToCipboard } from './clipboard'

describe('utils:clipboard', () => {
	it('writes to clipboard', () => {
		const spy = vi.spyOn(window.navigator.clipboard, 'writeText')
		const prompt = vi.spyOn(window, 'prompt').mockImplementation(() => '')
		copyToCipboard('foo bar')
		expect(spy).toBeCalledWith('foo bar')
		expect(prompt).not.toBeCalled()
	})

	it('opens promp if not supported clipboard', () => {
		window.navigator.clipboard.writeText = vi.fn(() => { throw Error('no secure context') })
		const prompt = vi.spyOn(window, 'prompt').mockImplementation(() => '')
		copyToCipboard('foo bar')
		expect(window.navigator.clipboard.writeText).toBeCalledWith('foo bar')
		expect(prompt).toBeCalled()
	})
})
