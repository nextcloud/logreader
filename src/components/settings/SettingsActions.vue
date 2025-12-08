<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div>
		<NcNoteCard type="info" class="info-note">
			<!-- eslint-disable-next-line vue/no-v-html -->
			<p v-html="t('logreader', 'You can also show log entries copied from your clipboard by pasting them on the log view using: {keyboardShortcut}', { keyboardShortcut: keyboardShortcutText }, undefined, { escape: false })" />
		</NcNoteCard>
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
			<input
				ref="fileinput"
				type="file"
				name="logfile"
				accept=".log,.json,.txt,application/json,text/plain"
				@change.stop="onFileSelected">
		</label>
	</div>
</template>

<script setup lang="ts">
import { showError } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'
import { ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import IconDownload from 'vue-material-design-icons/TrayArrowDown.vue'
import IconUpload from 'vue-material-design-icons/TrayArrowUp.vue'
import { useLogStore } from '../../store/logging'
import { useSettingsStore } from '../../store/settings'
import { logger } from '../../utils/logger'

const settingsStore = useSettingsStore()
const logStore = useLogStore()

// TRANSLATORS The control key abbreviation
const keyboardShortcutText = `<kbd>${t('logreader', 'Ctrl')}</kbd> + <kbd>v</kbd>`

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
async function onFileSelected() {
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
	flex-wrap: wrap;
	gap: 12px;
	padding-inline-end: 12px;
}
.info-note {
	justify-self: stretch;
}
</style>
