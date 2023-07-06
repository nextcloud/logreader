<template>
	<div>
		<NcButton :href="downloadURL" download="">
			<template #icon>
				<IconDownload :size="20" />
			</template>
			{{ t('logreader', 'Download logs') }}
		</NcButton>
		<NcButton @click="fileinput?.click()">
			<template #icon>
				<IconUpload :size="20" />
			</template>
			{{ t('logreader', 'Show local logfile') }}
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

<script lang="ts" setup>
import { ref } from 'vue'
import { translate as t } from '@nextcloud/l10n'
import { useSettingsStore } from '../../store/settings.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import IconDownload from 'vue-material-design-icons/Download.vue'
import IconUpload from 'vue-material-design-icons/Upload.vue'
import { generateUrl } from '@nextcloud/router'

const settingsStore = useSettingsStore()

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
const onFileSelected = () => {
	const files = fileinput.value?.files
	if (files) {
		const file = files.item(0)
		if (file) {
			settingsStore.localFile = file
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
