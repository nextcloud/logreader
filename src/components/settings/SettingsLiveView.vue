<template>
	<div>
		<NcCheckboxRadioSwitch :checked.sync="liveLog">
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

const settingsStore = useSettingsStore()
const liveLog = computed({
	get: () => settingsStore.liveLog,
	set: (v: boolean) =>
		settingsStore
			.setSetting('liveLog', v)
			.catch((e) => {
				logger.debug(e)
				showError(t('logreader', 'Could not change live view setting.'))
			}),
})
</script>
