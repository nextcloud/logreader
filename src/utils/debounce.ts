/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Debounce a function call for specified amount of time
 *
 * @param func The function to debounce
 * @param timeout Amount of time (ms) to wait
 */
export function debounce(func: Function, timeout = 300) {
	let timer: number
	return (...args: unknown[]) => {
		clearTimeout(timer)
		timer = window.setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}
