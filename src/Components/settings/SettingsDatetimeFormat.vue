<template>
	<fieldset>
		<legend>{{ t('logreader', 'Time format') }}</legend>
		<NcCheckboxRadioSwitch :checked.sync="dateTimeFormat"
			value="raw"
			name="timestamp_format"
			type="radio">
			{{ t('logreader', 'Raw data') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="dateTimeFormat"
			value="local"
			name="timestamp_format"
			type="radio">
			{{ t('logreader', 'Local time') }}
		</NcCheckboxRadioSwitch>
		<NcCheckboxRadioSwitch :checked.sync="dateTimeFormat"
			value="utc"
			name="timestamp_format"
			type="radio">
			{{ t('logreader', 'UTC time') }}
		</NcCheckboxRadioSwitch>
	</fieldset>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { debounce } from '../../utils/debounce'
import { useSettingsStore } from '../../store/settings'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'
import type { AppSettings } from '../../types'

const settingsStore = useSettingsStore()

/**
 * The date and time format to be used for displaying timestamps
 */
const dateTimeFormat = computed({
	get: () => settingsStore.dateTimeFormat,
	set: (v: AppSettings['dateTimeFormat']) =>
		debounce(
			() =>
				settingsStore
					.setSetting('dateTimeFormat', v)
					.catch((e) =>
						// TODO: Maybe log e to console
						showError(t('logreader', 'Could not change date time format.')),
					),
			200,
		),
})
</script>

<style scoped>
fieldset {
	padding: 6px;
}
</style>
