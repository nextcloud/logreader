<template>
	<div>
		<fieldset>
			<legend>{{ t('logreader', 'Filter logging levels') }}</legend>
			<NcCheckboxRadioSwitch v-for="levelName, levelId in LOGGING_LEVEL_NAMES"
				:key="levelId"
				:checked="shownLevels"
				:value="`${levelId}`"
				name="logging_level"
				@update:checked="setShowLevels">
				{{ levelName }}
			</NcCheckboxRadioSwitch>
		</fieldset>
	</div>
</template>

<script lang="ts" setup>
import type { AppSettings } from '../../types'
import { computed } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { debounce } from '../../utils/debounce'
import { useSettingsStore } from '../../store/settings'
import { LOGGING_LEVEL_NAMES } from '../../constants'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

const settingsStore = useSettingsStore()

/**
 * Get shown logging levels (to allow filter levels)
 */
const shownLevels = computed(() => settingsStore.shownLevels.map(l => `${l}`))

const setShowLevels = debounce((levels: string[]) => {
	const numericLevels = levels.map(level => parseInt(level)) as AppSettings['shownLevels']

	settingsStore.setSetting('shownLevels', numericLevels)
		.catch(() => showError(t('logreader', 'Could not set logging levels to show')))
}, 200)
</script>

<style scoped>
fieldset {
	padding: 6px;
}
</style>
