<!--
	SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
	SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="logreader-container">
		<div class="logreader-container__header">
			<h2>{{ t('logreader', 'Log reader') }}</h2>
			<!-- Setting toggle -->
			<NcButton :aria-label="t('logreader', 'Open log reader settings')"
				class="settings-toggle"
				type="tertiary"
				@click="areSettingsShown = true">
				<template #icon>
					<IconCog :size="20" />
				</template>
				{{ t('logreader', 'Log reader settings') }}
			</NcButton>
		</div>
		<!-- Show information / warning message -->
		<NcNoteCard v-if="!settingsStore.isServerLogShown" type="info" class="info-note">
			<div class="info-note__content">
				<p>{{ t('logreader', 'Currently the log file {file} is shown', { file: settingsStore.localFileName }) }}</p>
				<NcButton type="secondary" @click="onShowServerLog">
					{{ t('logreader', 'Show server log') }}
				</NcButton>
			</div>
		</NcNoteCard>
		<NcNoteCard v-else-if="!settingsStore.liveLog" type="info" class="info-note">
			<p>{{ t('logreader', 'Live view is disabled') }}</p>
		</NcNoteCard>
		<!-- Show the log file table -->
		<LogTable v-if="hasEntries" :rows="entries" />
		<NcEmptyContent v-else
			:name="t('logreader', 'No log entries')"
			:description="t('logreader', 'The log is currently empty. Try to select a different logging level.')">
			<template #icon>
				<IconFormatList :size="20" />
			</template>
		</NcEmptyContent>
		<!-- App settings dialog will be mounted on page body -->
		<AppSettingsDialog :open.sync="areSettingsShown" />
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { translate as t } from '@nextcloud/l10n'
import { useLogStore } from './store/logging'
import { useSettingsStore } from './store/settings.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcNoteCard from '@nextcloud/vue/dist/Components/NcNoteCard.js'
import IconCog from 'vue-material-design-icons/Cog.vue'
import IconFormatList from 'vue-material-design-icons/FormatListBulletedSquare.vue'
import AppSettingsDialog from './components/settings/AppSettingsDialog.vue'
import LogTable from './components/table/LogTable.vue'

import '@nextcloud/dialogs/style.css'

/** If currently showing the settings modal */
const areSettingsShown = ref(false)

/** Store with app settings */
const settingsStore = useSettingsStore()

/** Store handling all log retrieval */
const loggingStore = useLogStore()

const entries = computed(() => loggingStore.entries)

const hasEntries = computed(() => loggingStore.allEntries.length > 0)

const onShowServerLog = () => {
	settingsStore.localFile = undefined
	// remove local entries
	loggingStore.allEntries = []
	loggingStore.loadMore()
}

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
