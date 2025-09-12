/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { getAppSettings, getLog, pollLog, setAppSetting } from './api'

const mocks = vi.hoisted(() => {
	return {
		get: vi.fn(),
		put: vi.fn(),
	}
})

vi.mock('@nextcloud/axios', () => {
	return {
		default: {
			get: mocks.get,
			put: mocks.put,
		},
	}
})

vi.mock('@nextcloud/router', () => ({
	generateUrl: (path: string) => `/index.php/${path}`,
}))

describe('api', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('getLog', async () => {
		const data = { count: 1 }

		await getLog(data)

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/log', { params: data })
	})

	it('getLog with config', async () => {
		const data = { count: 1 }
		const config = { headers: { Accept: 'application/json' } }

		await getLog(data, config)

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/log', { ...config, params: data })
	})

	it('pollLog', async () => {
		const data = { lastReqId: '1234' }

		await pollLog(data)

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/poll', { params: data })
	})

	it('pollLog with config', async () => {
		const data = { lastReqId: '1234' }
		const config = { headers: { Accept: 'application/json' } }

		await pollLog(data, config)

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/poll', { ...config, params: data })
	})

	it('getAppSettings', async () => {
		await getAppSettings()

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/settings', {})
	})

	it('getAppSettings with config', async () => {
		const config = { headers: { Accept: 'application/json' } }

		await getAppSettings(undefined, config)

		expect(mocks.get).toBeCalled()
		expect(mocks.get).toBeCalledWith('/index.php/apps/logreader/api/settings', { ...config, params: undefined })
	})

	it('setAppSetting', async () => {
		const data = { settingsKey: 'liveLog' as const, settingsValue: true }

		await setAppSetting<'liveLog'>(data)

		expect(mocks.put).toBeCalled()
		expect(mocks.put).toBeCalledWith('/index.php/apps/logreader/api/settings', data, {})
	})

	it('setAppSetting with config', async () => {
		const data = { settingsKey: 'liveLog' as const, settingsValue: true }
		const config = { headers: { Accept: 'application/json' } }

		await setAppSetting<'liveLog'>(data, config)

		expect(mocks.put).toBeCalled()
		expect(mocks.put).toBeCalledWith('/index.php/apps/logreader/api/settings', data, config)
	})
})
