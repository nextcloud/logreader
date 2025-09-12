/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IAppSettings } from '../interfaces'

import { createTestingPinia } from '@pinia/testing'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../store/settings'

const mocks = vi.hoisted(() => {
	// api mocks
	return {
		setAppSetting: vi.fn(() => Promise.resolve()),
		getAppSettings: vi.fn(),
	}
})

function mockInitialState(state: IAppSettings) {
	const input = document.createElement('input')
	input.setAttribute('type', 'hidden')
	input.setAttribute('id', 'initial-state-logreader-settings')
	input.setAttribute('value', btoa(JSON.stringify(state)))
	return document.body.appendChild(input)
}

describe('store:settings', () => {
	let initialState: HTMLInputElement

	afterAll(() => {
		document.body.removeChild(initialState)
	})
	afterEach(() => {
		vi.restoreAllMocks()
	})

	beforeAll(() => {
		initialState = mockInitialState({
			dateTimeFormat: 'local',
			enabled: true,
			liveLog: true,
			shownLevels: [2, 4],
		})
	})
	beforeEach(() => {
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
		})
	})

	it('loads state from inital-state', () => {
		const store = useSettingsStore()
		expect(store.enabled).toBe(true)
		expect(store.liveLog).toBe(true)
		expect(store.shownLevels).toEqual([2, 4])
		expect(store.dateTimeFormat).toBe('local')
	})

	it('sets datetuneFornat to raw when loading a local file', () => {
		const store = useSettingsStore()
		expect(store.dateTimeFormat).toBe('local')
		store.localFile = new File([], 'logfile')
		expect(store.dateTimeFormat).toBe('raw')
	})

	it('provides the local file name', () => {
		const store = useSettingsStore()
		store.localFile = new File([], 'logfile')
		expect(store.localFileName).toBe('logfile')
	})

	it('only enable server logs if available', () => {
		const store = useSettingsStore()
		// should be enabled currently
		expect(store.isEnabled).toBeTruthy()
		// server is configured to not use file logs -> enabled=false -> it is disabled
		store.enabled = false
		expect(store.isEnabled).toBeFalsy()
		// If a local file is used it is disabled too
		store.localFile = new File([], 'log')
		expect(store.isEnabled).toBeFalsy()
		// Also if enabled but a local log file is used we should not fetch from server
		store.enabled = true
		expect(store.isEnabled).toBeFalsy()
	})

	it('sets the state when settings are changed', async () => {
		// Mock the API
		vi.mock('../api.ts', () => {
			return {
				setAppSetting: mocks.setAppSetting,
				getAppSettings: mocks.getAppSettings,
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		const store = useSettingsStore()
		expect(store.dateTimeFormat).not.toBe('utc')
		await store.setSetting('dateTimeFormat', 'utc')
		expect(mocks.setAppSetting).toBeCalledWith({ settingsKey: 'dateTimeFormat', settingsValue: 'utc' })
		expect(store.dateTimeFormat).toBe('utc')
	})

	it('sets the state when settings are loaded', async () => {
		// Mock the API
		vi.mock('../api.ts', () => {
			return {
				setAppSetting: mocks.setAppSetting,
				getAppSettings: mocks.getAppSettings,
			}
		})

		// clean pinia
		createTestingPinia({
			fakeApp: true,
			createSpy: vi.fn,
			stubActions: false,
		})

		vi.mocked(mocks.getAppSettings).mockImplementation(async () => {
			return {
				data: {
					dateTimeFormat: 'utc',
					enabled: false,
					liveLog: false,
					shownLevels: [1, 3],
				},
			}
		})

		const store = useSettingsStore()
		expect(store.dateTimeFormat).not.toBe('utc')
		const settings = await store.getSettings()
		expect(mocks.getAppSettings).toBeCalled()
		expect(settings).toEqual({
			dateTimeFormat: 'utc',
			enabled: false,
			liveLog: false,
			shownLevels: [1, 3],
		})
		expect(store.dateTimeFormat).toBe('utc')
		expect(store.enabled).toBe(false)
		expect(store.liveLog).toBe(false)
		expect(store.shownLevels).toEqual([1, 3])
	})
})
