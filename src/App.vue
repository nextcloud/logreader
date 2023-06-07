<!--
    SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
    SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="logreader-container">
		<AppSettingsDialog :open.sync="areSettingsShown" />
		<!-- Setting toggle -->
		<NcButton :aria-label="t('logreader', 'Open settings')"
			class="settings-toggle"
			type="tertiary"
			@click="areSettingsShown = !areSettingsShown">
			<template #icon>
				<IconCog :size="20" />
			</template>
		</NcButton>
		<!-- Show information / warning message -->
		<NcNoteCard v-if="settingsStore.localFile" type="info" class="info-note">
			<p>{{ t('logreader', 'Currently the logfile {file} is shown', { file: settingsStore.localFileName }) }}</p>
			<NcButton type="secondary">
				{{ t('logreader', 'Show server log') }}
			</NcButton>
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
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { translate as t } from '@nextcloud/l10n'
import { useLogStore } from './store/logging'
import { useSettingsStore } from './store/settings.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcNoteCard from '@nextcloud/vue/dist/Components/NcNoteCard.js'
import IconCog from 'vue-material-design-icons/Cog.vue'
import IconFormatList from 'vue-material-design-icons/FormatListBulletedSquare.vue'
import AppSettingsDialog from './Components/AppSettingsDialog.vue'
import LogTable from './Components/table/LogTable.vue'

import '@nextcloud/dialogs/dist/index.css'

/** If currently showing the settings modal */
const areSettingsShown = ref(false)

/** Store with app settings */
const settingsStore = useSettingsStore()

/** Store handling all log retrieval */
const loggingStore = useLogStore()

const entries = computed(() => loggingStore.entries)

/**
 * Set query string from unified search event
 *
 * @param param0 See unified search
 * @param param0.query The query string from the unified search
 */
const searchLogs = ({ query }: { query: string }) => loggingStore.searchLogs(query)
/**
 * Reset query string
 */
const resetSearch = () => loggingStore.searchLogs('')

onMounted(() => {
	loggingStore.loadMore()
	subscribe('nextcloud:unified-search.search', searchLogs)
	subscribe('nextcloud:unified-search.reset', resetSearch)
})

onUnmounted(() => {
	loggingStore.stopPolling()
	unsubscribe('nextcloud:unified-search.search', searchLogs)
	unsubscribe('nextcloud:unified-search.reset', resetSearch)
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
	height: 100%;

	.info-note {
		margin: 1rem;
		margin-bottom: 0; // table header padding
		margin-right: 56px; // 44px + 2x `right` of settings toggle
	}

	.settings-toggle {
		position: absolute;
		top: 0px;
		right: 0px;
		// Make sure to be clickable even if overlaying a table header
		z-index: 999;
	}
}

:deep(.empty-content) {
	text-align: center;
}
</style>
