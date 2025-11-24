<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<fieldset>
			<legend>{{ t('logreader', 'Filter logging levels') }}</legend>
			<NcCheckboxRadioSwitch
				v-for="(levelName, levelId) in LOGGING_LEVEL_NAMES"
				:key="levelId"
				:model-value="shownLevels[levelId]"
				@update:model-value="setShowLevels(levelId)">
				{{ levelName }}
			</NcCheckboxRadioSwitch>
		</fieldset>
	</div>
</template>

<script setup lang="ts">
import type { IAppSettings } from '../../interfaces'

import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import { LOGGING_LEVEL_NAMES } from '../../constants'
import { useSettingsStore } from '../../store/settings'
import { debounce } from '../../utils/debounce'

const settingsStore = useSettingsStore()

/**
 * Get shown logging levels (to allow filter levels)
 */
const shownLevels = computed(() => {
	return Object.fromEntries(Object.keys(LOGGING_LEVEL_NAMES).map((level) => {
		return [level, settingsStore.shownLevels.includes(parseInt(level))]
	}))
})

const setShowLevels = debounce((level: number) => {
	const newShownLevels = {
		...shownLevels.value,
		[level]: !shownLevels.value[level],
	}

	const numericLevels = Object.keys(newShownLevels)
		.filter((level) => newShownLevels[level])
		.map((level) => parseInt(level)) as IAppSettings['shownLevels']

	settingsStore.setSetting('shownLevels', numericLevels)
		.catch(() => showError(t('logreader', 'Could not set logging levels to show')))
}, 200)
</script>

<style scoped>
fieldset {
	padding: 6px;
}
</style>
