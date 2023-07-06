/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IAppSettings } from '../interfaces'

import { setAppSetting } from '../api'
import { loadState } from '@nextcloud/initial-state'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface SettingsState extends IAppSettings {
	/**
	 * Local logging file if loaded
	 */
	localFile?: File,
}

/**
 * Store for handling app settings
 */
export const useSettingsStore = defineStore('logreader-settings', () => {
	const loadedSettings = loadState<SettingsState>('logreader', 'settings') as SettingsState
	const shownLevels = ref(loadedSettings.shownLevels)
	const dateTimeFormat = ref(loadedSettings.dateTimeFormat)
	const enabled = ref(loadedSettings.enabled)
	const liveLog = ref(loadedSettings.liveLog)

	const localFile = ref<File>()

	const localFileName = computed((state) => state.localFile?.name)

	/**
	 * Set app config setting through store
	 *
	 * @param setting The setting to change
	 * @param value New value of setting
	 */
	async function setSetting<T extends keyof IAppSettings>(this: SettingsState, setting: T, value: IAppSettings[T]) {
		await setAppSetting({ settingsKey: setting, settingsValue: value });

		// set setting in state
		(this as SettingsState)[setting] = value
	}

	return { shownLevels, dateTimeFormat, enabled, liveLog, localFile, localFileName, setSetting }
})
