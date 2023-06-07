<template>
	<div>
		<NcCheckboxRadioSwitch :checked.sync="liveLog">
			{{
				t('logreader', 'Live view log (polling)')
			}}
		</NcCheckboxRadioSwitch>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { useSettingsStore } from '../../store/settings.js'

import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

const settingsStore = useSettingsStore()
const liveLog = computed({
	get: () => settingsStore.liveLog,
	set: (v: boolean) =>
		settingsStore
			.setSetting('liveLog', v)
			.catch((e) =>
				showError(t('logreader', 'Could not change live view setting.')),
			),
})
</script>
