/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IAppSettings } from '../interfaces'

import { loadState } from '@nextcloud/initial-state'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAppSettings, setAppSetting } from '../api'

interface SettingsState extends IAppSettings {
	/**
	 * Local logging file if loaded
	 */
	localFile?: File
}

/**
 * Store for handling app settings
 */
export const useSettingsStore = defineStore('logreader-settings', () => {
	/**
	 * Saved setting loaded from server
	 */
	const _loadedSettings = loadState<SettingsState>('logreader', 'settings', { enabled: false, liveLog: false, dateTimeFormat: 'raw', shownLevels: [], logLevel: 2 })

	/**
	 * Is file logging enabled on server
	 */
	const enabled = ref(_loadedSettings.enabled)

	/**
	 * Wether we should load log entries from server
	 * This checks if file logging is enabled and if a local file is currently shown
	 */
	const isEnabled = computed(() => enabled.value && localFile.value === undefined)

	/**
	 * Is live log aka polling enabled
	 */
	const liveLog = ref(_loadedSettings.liveLog)

	/**
	 * Array of logging levels enabled to show
	 */
	const shownLevels = ref(_loadedSettings.shownLevels)

	/**
	 * The current log level set on the server
	 */
	const logLevel = ref(_loadedSettings.logLevel)

	/**
	 * The datetime format to used for displaying times
	 * This is the internal property used for the computed getter
	 */
	const _dateTimeFormat = ref(_loadedSettings.dateTimeFormat)

	/**
	 * The datetime format to use for showing times to the user
	 * Will always be 'raw' for local files
	 */
	const dateTimeFormat = computed({
		// In case of a local file we do not know the datetime format of the logfile so we can only display the raw format
		get: () => localFile.value !== undefined ? 'raw' : _dateTimeFormat.value,
		set: (v) => {
			_dateTimeFormat.value = v
		},
	})

	/**
	 * The uploaded log file to display
	 */
	const localFile = ref<File>()
	/**
	 * Filename of the uploaded local log file
	 */
	const localFileName = computed(() => localFile.value?.name || '')

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

	/**
	 * Get app config settings from server and update the current state
	 */
	async function getSettings(this: SettingsState) {
		const settings = await getAppSettings();

		// Update current state with loaded settings
		(Object.keys(settings.data) as Array<keyof IAppSettings>).forEach((key) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this[key] as any) = settings.data[key]
		})

		return settings.data
	}

	return { shownLevels, logLevel, dateTimeFormat, enabled, isEnabled, liveLog, localFile, localFileName, setSetting, getSettings }
})
