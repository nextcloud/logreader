/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { expect, describe, it, vi, beforeAll } from 'vitest'
import { copyToCipboard } from './clipboard'

describe('utils:clipboard', () => {
	beforeAll(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		window.navigator.clipboard = {
			writeText: vi.fn(() => Promise.resolve()),
		}
	})

	it('writes to clipboard', () => {
		const prompt = vi.spyOn(window, 'prompt').mockImplementation(() => '')
		copyToCipboard('foo bar')
		expect(window.navigator.clipboard.writeText).toBeCalledWith('foo bar')
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
