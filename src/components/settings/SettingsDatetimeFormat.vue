<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<fieldset>
		<legend>{{ fieldsetLegend }}</legend>
		<NcCheckboxRadioSwitch
			:checked="dateTimeFormat"
			value="raw"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'Raw data') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch
			:checked="dateTimeFormat"
			:disabled="isLocalLogfile"
			value="local"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'Local time') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch
			:checked="dateTimeFormat"
			:disabled="isLocalLogfile"
			value="utc"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'UTC time') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch
			:checked="dateTimeFormat"
			:disabled="isLocalLogfile"
			value="relative"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'Relative') }}
		</NcCheckboxRadioSwitch>
	</fieldset>
</template>

<script setup lang="ts">
import type { IAppSettings } from '../../interfaces'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'
import { computed } from 'vue'
import { useSettingsStore } from '../../store/settings'
import { logger } from '../../utils/logger'

const settingsStore = useSettingsStore()

/**
 * Text describing the datetime formatting options fieldset
 */
const fieldsetLegend = computed(() => {
	let message = t('logreader', 'Time format used for displaying the timestamp')
	if (settingsStore.localFile) {
		// We do not know the datetime format of the logfile so we can only display the raw format
		message += ' ' + t('logreader', '(Local log files only support the "raw" time format)')
	}
	return message
})

/**
 * Check if a local log file is displayed
 */
const isLocalLogfile = computed(() => settingsStore.localFile !== undefined)

/**
 * The date and time format to be used for displaying timestamps
 */
const dateTimeFormat = computed(() => settingsStore.dateTimeFormat)

/**
 *
 * @param v - How the log time should be displayed ('local' | 'raw' | 'utc' | 'relative')
 */
function setDateTimeFormat(v: IAppSettings['dateTimeFormat']) {
	return settingsStore
		.setSetting('dateTimeFormat', v)
		.catch((e) => {
			logger.debug(e)
			showError(t('logreader', 'Could not change date time format.'))
		})
}
</script>

<style scoped>
fieldset {
	padding: 6px;
}
</style>
