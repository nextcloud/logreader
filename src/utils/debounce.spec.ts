/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { debounce } from './debounce'
import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'

describe('utils/debounce', () => {
	afterAll(() => {
		vi.useRealTimers()
	})
	beforeAll(() => {
		vi.useFakeTimers()
	})

	it('waits for the timeout', () => {
		const callback = vi.fn()
		const debounced = debounce(callback)

		debounced()
		expect(callback).not.toBeCalled()
		vi.advanceTimersByTime(300)
		expect(callback).toBeCalled()
	})

	it('passes arguments', () => {
		const callback = vi.fn()
		const debounced = debounce(callback, 50)

		debounced(1, 'two', { three: 3 })
		expect(callback).not.toBeCalled()
		vi.advanceTimersByTime(50)
		expect(callback).toBeCalledWith(1, 'two', { three: 3 })
	})

	it('dismisses calls before timeout', () => {
		const callback = vi.fn()
		const debounced = debounce(callback, 50)

		debounced()
		debounced()
		expect(callback).not.toBeCalled()

		vi.advanceTimersByTime(50)
		expect(callback).toBeCalledTimes(1)
	})
})
