<template>
	<div>
		<NcButton :href="settingsStore.enabled ? downloadURL : null" :disabled="!settingsStore.enabled" download="nextcloud.log">
			<template #icon>
				<IconDownload :size="20" />
			</template>
			{{ t('logreader', 'Download logs') }}
		</NcButton>
		<NcButton @click="fileinput?.click()">
			<template #icon>
				<IconUpload :size="20" />
			</template>
			{{ t('logreader', 'Show local log file') }}
		</NcButton>
		<label class="hidden-visually">
			{{ t('logreader', 'Upload local log file to be displayed') }}
			<input ref="fileinput"
				type="file"
				name="logfile"
				accept=".log,.json,.txt,application/json,text/plain"
				@change.stop="onFileSelected">
		</label>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { useLogStore } from '../../store/logging'
import { useSettingsStore } from '../../store/settings.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import IconDownload from 'vue-material-design-icons/Download.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import { logger } from '../../utils/logger'
import { showError } from '@nextcloud/dialogs'

const settingsStore = useSettingsStore()
const logStore = useLogStore()

/**
 * Logfile download URL
 */
const downloadURL = generateUrl('/settings/admin/log/download')

/**
 * The file input used for loading local log files
 */
const fileinput = ref<HTMLInputElement>()

/**
 * Called when an user selected a local file
 */
const onFileSelected = async () => {
	const file = fileinput.value?.files?.item?.(0)
	if (file) {
		try {
			settingsStore.localFile = file
			// enforce parsing the file
			await logStore.loadFile()
		} catch (error) {
			settingsStore.localFile = undefined
			showError(t('logreader', 'Could not parse local log file'))
			logger.debug(error as Error)
		}
	}
}
</script>

<style lang="scss" scoped>
div {
	display: flex;
	gap: 12px;
}
</style>
