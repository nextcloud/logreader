<!--
	SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
	SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		<NcNoteCard v-if="!settingsStore.enabled" type="info">
			{{ t('logreader', 'Polling is disabled because server is not configured to log to file') }}
		</NcNoteCard>
		<NcCheckboxRadioSwitch :checked.sync="liveLog" :disabled="!settingsStore.enabled">
			{{
				t('logreader', 'Polling (live view)')
			}}
		</NcCheckboxRadioSwitch>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { logger } from '../../utils/logger'
import { useSettingsStore } from '../../store/settings.js'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'
import NcNoteCard from '@nextcloud/vue/dist/Components/NcNoteCard.js'

const settingsStore = useSettingsStore()
const liveLog = computed({
	get: () => settingsStore.enabled ? settingsStore.liveLog : false,
	set: (v: boolean) =>
		settingsStore
			.setSetting('liveLog', v)
			.catch((e) => {
				logger.debug(e)
				showError(t('logreader', 'Could not change live view setting.'))
			}),
})
</script>
