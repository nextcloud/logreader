<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="logreader-container">
		<div class="logreader-container__header">
			<h2>{{ t('logreader', 'Log reader') }}</h2>
			<!-- Setting toggle -->
			<NcButton
				:aria-label="t('logreader', 'Open log reader settings')"
				class="settings-toggle"
				variant="tertiary"
				@click="areSettingsShown = true">
				<template #icon>
					<IconCog :size="20" />
				</template>
				{{ t('logreader', 'Log reader settings') }}
			</NcButton>
		</div>
		<!-- Show information / warning message -->
		<NcNoteCard v-if="settingsStore.localFile" type="info" class="info-note">
			<div class="info-note__content">
				<p>{{ t('logreader', 'Currently the log file {file} is shown', { file: settingsStore.localFileName }) }}</p>
				<NcButton variant="secondary" @click="onShowServerLog">
					{{ t('logreader', 'Show server log') }}
				</NcButton>
			</div>
		</NcNoteCard>
		<NcNoteCard v-else-if="!settingsStore.liveLog" type="info" class="info-note">
			<p>{{ t('logreader', 'Live view is disabled') }}</p>
		</NcNoteCard>
		<!-- Show the log file table -->
		<LogTable v-if="settingsStore.enabled" :rows="entries" />
		<NcEmptyContent v-else :name="t('logreader', 'No log file')">
			<template #icon>
				<IconFormatList :size="20" />
			</template>
			<template #description>
				{{ t('logreader', 'File-based logging must be enabled to access logs from the Web UI.') }}
				<br>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<span v-html="noLogDescription" />
			</template>
		</NcEmptyContent>
		<!-- App settings dialog will be mounted on page body -->
		<AppSettingsDialog v-model:open="areSettingsShown" />
	</div>
</template>

<script lang="ts" setup>
import { translate as t } from '@nextcloud/l10n'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import NcNoteCard from '@nextcloud/vue/components/NcNoteCard'
import IconCog from 'vue-material-design-icons/CogOutline.vue'
import IconFormatList from 'vue-material-design-icons/FormatListBulletedSquare.vue'
import AppSettingsDialog from './components/settings/AppSettingsDialog.vue'
import LogTable from './components/table/LogTable.vue'
import { useLogStore } from './store/logging'
import { useSettingsStore } from './store/settings'

import '@nextcloud/dialogs/style.css'

/** If currently showing the settings modal */
const areSettingsShown = ref(false)

/** Store with app settings */
const settingsStore = useSettingsStore()

/** Store handling all log retrieval */
const loggingStore = useLogStore()

const entries = computed(() => loggingStore.entries)

/**
 *
 */
function onShowServerLog() {
	settingsStore.localFile = undefined
	// remove local entries
	loggingStore.allEntries = []
	loggingStore.loadMore()
}

/**
 * Handle paste events with log entries
 *
 * @param event The keyboard event
 */
function onHandlePaste(event: ClipboardEvent) {
	event.preventDefault()

	if (event.clipboardData) {
		const paste = event.clipboardData.getData('text')
		loggingStore.loadText(paste)
	}
}
// Add / remove event listeners
onMounted(() => window.addEventListener('paste', onHandlePaste))
onUnmounted(() => window.removeEventListener('paste', onHandlePaste))

/**
 * Toggle polling if live log is dis- / enabled
 */
watchEffect(() => {
	if (settingsStore.liveLog && settingsStore.isEnabled) {
		loggingStore.startPolling()
	} else {
		loggingStore.stopPolling()
	}
})

onMounted(() => {
	loggingStore.loadMore()
})

onUnmounted(() => {
	loggingStore.stopPolling()
})

/** Translated description what to check in case no log can be loaded */
const noLogDescription = t(
	'logreader',
	'If you feel this is an error, please verify {setting} in your {config} and check the Nextcloud Administration Manual.',
	{
		setting: '<code>log_type</code>',
		config: '<code>config.php</code>',
	},
	0,
	{
		sanitize: false,
		escape: false,
	},
)
</script>

<style lang="scss" scoped>
legend {
	font-weight: bold;
}

.logreader-container {
	// Ensure max 100% is used and the table itself will be scrollable
	display: flex;
	flex-direction: column;
	height: 100%;

	.info-note {
		margin-block: 4px;
		margin-inline: 1rem;

		&__content {
			display: flex;
			gap: 12px;
			align-items: center;
			justify-content: space-between;
		}
	}

	&__header {
		padding-inline-start: 1rem; // Align with info note
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		h2 {
			// Handled by container
			margin: 0;
			padding: 0;
		}

		.settings-toggle {
			// 2px to show outline when focus-visible
			margin: 2px;
		}
	}
}

:deep(.empty-content) {
	text-align: center;
}

@media only screen and (max-width: 1023px) {
	.logreader-container__header {
		padding-inline-start: 48px; // app sidebar toggle
	}
}
</style>
