<template>
	<fieldset>
		<legend>{{ t('logreader', 'Time format') }}</legend>
		<NcCheckboxRadioSwitch :checked="dateTimeFormat"
			value="raw"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'Raw data') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked="dateTimeFormat"
			value="local"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'Local time') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked="dateTimeFormat"
			value="utc"
			name="timestamp_format"
			type="radio"
			@update:checked="setDateTimeFormat">
			{{ t('logreader', 'UTC time') }}
		</NcCheckboxRadioSwitch>
	</fieldset>
</template>

<script lang="ts" setup>
import type { IAppSettings } from '../../interfaces'

import { computed } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { useSettingsStore } from '../../store/settings'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

const settingsStore = useSettingsStore()

/**
 * The date and time format to be used for displaying timestamps
 */
const dateTimeFormat = computed(() => settingsStore.dateTimeFormat)

const setDateTimeFormat = (v: IAppSettings['dateTimeFormat']) =>
	settingsStore
		.setSetting('dateTimeFormat', v)
		.catch((e) => {
			console.debug(e)
			showError(t('logreader', 'Could not change date time format.'))
		})
</script>

<style scoped>
fieldset {
	padding: 6px;
}
</style>
