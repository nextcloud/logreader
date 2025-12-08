<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<NcNoteCard v-if="!settingsStore.enabled" type="info">
			{{ t('logreader', 'Polling is disabled because server is not configured to log to file') }}
		</NcNoteCard>
		<NcCheckboxRadioSwitch v-model="liveLog" :disabled="!settingsStore.enabled">
			{{
				t('logreader', 'Polling (live view)')
			}}
		</NcCheckboxRadioSwitch>
	</div>
</template>

<script setup lang="ts">
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'
import NcCheckboxRadioSwitch from '@nextcloud/vue/components/NcCheckboxRadioSwitch'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import { useSettingsStore } from '../../store/settings'
import { logger } from '../../utils/logger'

const settingsStore = useSettingsStore()
const liveLog = computed({
	get: () => settingsStore.enabled ? settingsStore.liveLog : false,
	set: (v: boolean) => settingsStore
		.setSetting('liveLog', v)
		.catch((e) => {
			logger.debug(e)
			showError(t('logreader', 'Could not change live view setting.'))
		}),
})
</script>
