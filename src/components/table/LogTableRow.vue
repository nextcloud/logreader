<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<tr ref="tableRowElement" :class="{ expanded: isExpanded }">
		<td :class="cssLevelClass">
			<span>{{ levelString }}</span>
		</td>
		<td :title="row.app">
			<span>{{ row.app }}</span>
		</td>
		<td class="row-message" @click="isExpanded = !isExpanded">
			<div class="row-message__container" :class="{ 'row-message__container--expanded': isExpanded }">
				<div class="row-message__text">
					<LogException v-if="row.exception" :exception="row.exception" />
					<div v-if="showLogMessage" class="row-message__text_message" :title="row.message">
						{{ row.message }}
					</div>
				</div>
				<div class="row-message__action">
					<NcButton
						variant="tertiary-no-background"
						:aria-label="
							isExpanded
								? t('logreader', 'Collapse row')
								: t('logreader', 'Expand row')
						"
						@click.stop="isExpanded = !isExpanded">
						<template #icon>
							<IconChevronUp v-if="isExpanded" :size="20" />
							<IconChevronDown v-else :size="20" />
						</template>
					</NcButton>
				</div>
			</div>
		</td>
		<td>
			<span v-if="isRawDate">{{ row.time }}</span>
			<NcDateTime
				v-else
				:key="settingsStore.dateTimeFormat"
				:timestamp="timestamp"
				:relative-time="isRelativeDate && 'long'"
				:format="dateTimeFormat" />
		</td>
		<td>
			<NcActions placement="left-start">
				<NcActionButton close-after-click @click="emit('showDetails', row)">
					<template #icon>
						<IconViewList />
					</template>
					{{ t('logreader', 'Show details') }}
				</NcActionButton>
				<NcActionButton close-after-click @click="copyRaw">
					<template #icon>
						<IconContentCopy />
					</template>
					{{ t('logreader', 'Copy raw entry') }}
				</NcActionButton>
				<NcActionButton close-after-click @click="copyFormatted">
					<template #icon>
						<IconContentCopy />
					</template>
					{{ t('logreader', 'Copy formatted entry') }}
				</NcActionButton>
			</NcActions>
		</td>
	</tr>
</template>

<script setup lang="ts">
import type { ILogEntry } from '../../interfaces'

import { showSuccess } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { computed, nextTick, onUpdated, ref, watch } from 'vue'
import NcActionButton from '@nextcloud/vue/components/NcActionButton'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcDateTime from '@nextcloud/vue/components/NcDateTime'
import IconChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import IconChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import IconContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import IconViewList from 'vue-material-design-icons/ViewList.vue'
import LogException from '../exception/LogException.vue'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from '../../constants'
import { useSettingsStore } from '../../store/settings'
import { copyToCipboard } from '../../utils/clipboard'
import { useLogFormatting } from '../../utils/format'

const props = withDefaults(
	defineProps<{
		row: ILogEntry
		timeFormat?: 'local' | 'raw' | 'utc'
	}>(),
	{
		timeFormat: 'local',
	},
)

const emit = defineEmits<{
	(event: 'showDetails', value: ILogEntry): void
}>()

const settingsStore = useSettingsStore()
const isRawDate = computed(() => settingsStore.dateTimeFormat === 'raw')
const isRelativeDate = computed(() => settingsStore.dateTimeFormat === 'relative')
const dateTimeFormat = computed(() => ({
	dateStyle: 'medium',
	timeStyle: 'medium',
	timeZone: settingsStore.dateTimeFormat === 'utc' ? 'UTC' : undefined,
}))

const { formatLogEntry } = useLogFormatting()

const timestamp = computed(() => Date.parse(props.row.time))

/**
 * Whether the row is expanded to show an overflowing log message
 */
const isExpanded = ref(false)

/**
 * Show log message if either there is no exception or a custom message was added (at expanded view)
 */
const showLogMessage = computed(() => {
	return !props.row.exception || (props.row.message !== props.row.exception.Message && isExpanded.value)
})

/**
 * Human readable and localized level name
 */
const levelString = computed(() => LOGGING_LEVEL_NAMES[props.row.level])

/**
 * CSS classes for row logging level (used for left border color)
 */
const cssLevelClass = computed(() => [
	'logging-level',
	`logging-level--${LOGGING_LEVEL[props.row.level]}`,
])

/**
 * Reference to the current table row element (`tr`)
 */
const tableRowElement = ref<HTMLTableRowElement>()

/**
 * Copy the raw log entry as json
 */
async function copyRaw() {
	if (await copyToCipboard(JSON.stringify(props.row))) {
		showSuccess(t('logreader', 'Log entry successfully copied'))
	}
}

/**
 * Copy the log entry formatted to be human readable
 */
async function copyFormatted() {
	if (await copyToCipboard(formatLogEntry(props.row))) {
		showSuccess(t('logreader', 'Log entry successfully copied'))
	}
}

/**
 * If expanded set a fixed height to show the full log message,
 * if not remove the height style to reset the height to one text line with hidden overflow
 */
function resizeTabeRow() {
	if (isExpanded.value) {
		nextTick(() => {
			const height = tableRowElement.value?.scrollHeight || 0
			if (tableRowElement.value) {
				tableRowElement.value.style.height = `${height}px`
			}
		})
	} else if (tableRowElement.value !== undefined) {
		tableRowElement.value.style.height = ''
	}
}

// Handle the expand resizing of the table row
onUpdated(() => resizeTabeRow)
watch(isExpanded, () => resizeTabeRow)
</script>

<style lang="scss" scoped>
td {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	min-height: 42px;
	padding-block-start: 4px;
	padding-inline: 18px 0;
}

.row-message {
	&__container {
		display: flex;
		justify-content: space-between;
		justify-items: start;

		&--expanded {
			margin-block-end: 0.5rem;
		}
	}

	// The text container (exception / message)
	&__text {
		display: flex;
		flex-direction: column;
		width: calc(100% - 48px); // 100% - 44px action - 2*4px action padding

		// The real message
		&_message {
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;
		}
	}

	&__action {
		// Ensure outline is show when focus-visible
		padding: 2px;
	}
}

tr {
	display: flex;
	&.expanded {
		white-space: normal;

		.row-message--text {
			white-space: normal;
		}
	}
}

.logging-level {
	border-inline-start: 4px solid;

	&--debug {
		border-inline-start-color: var(--color-border-maxcontrast);
	}
	&--info {
		border-inline-start-color: var(--color-element-info, var(--color-info));
	}
	&--warning {
		border-inline-start-color: var(--color-element-warning, var(--color-warning));
	}
	&--error, &--fatal {
		border-inline-start-color: var(--color-element-error, var(--color-error));
	}
}
</style>
