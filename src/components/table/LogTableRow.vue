<!--
	SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
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
					<!-- Show log message if either there is no exception or a custom message was added -->
					<div v-if="!row.exception || row.message !== row.exception.Message" class="row-message__text_message" :title="row.message">
						{{ row.message }}
					</div>
				</div>
				<div class="row-message__action">
					<NcButton type="tertiary-no-background"
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
		<td :title="timeString">
			{{ timeString }}
		</td>
		<td>
			<NcActions placement="left-start">
				<NcActionButton close-after-click @click="$emit('show-details', row)">
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
import { computed, ref, nextTick, watch, onUpdated } from 'vue'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from '../../constants'
import { copyToCipboard } from '../../utils/clipboard'
import { useLogFormatting } from '../../utils/format'

import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import IconChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import IconChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import IconContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import IconViewList from 'vue-material-design-icons/ViewList.vue'
import LogException from '../exception/LogException.vue'

const props = withDefaults(
	defineProps<{
		row: ILogEntry
		timeFormat?: 'local' | 'raw' | 'utc'
	}>(),
	{
		timeFormat: 'local',
	},
)

const { formatTime, formatLogEntry } = useLogFormatting()

/**
 * Whether the row is expanded to show an overflowing log message
 */
const isExpanded = ref(false)

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
 * Formatted / human readable time stamp of the log entry
 */
const timeString = computed(() => formatTime(props.row.time))

/**
 * Reference to the current table row element (`tr`)
 */
const tableRowElement = ref<HTMLTableRowElement>()

/**
 * Copy the raw log entry as json
 */
const copyRaw = async () => {
	if (await copyToCipboard(JSON.stringify(props.row))) {
		showSuccess(t('logreader', 'Log entry sucessfully copied'))
	}
}

/**
 * Copy the log entry formatted to be human readable
 */
const copyFormatted = async () => {
	if (await copyToCipboard(formatLogEntry(props.row))) {
		showSuccess(t('logreader', 'Log entry sucessfully copied'))
	}
}

/**
 * If expanded set a fixed height to show the full log message,
 * if not remove the height style to reset the height to one text line with hidden overflow
 */
const resizeTabeRow = () => {
	if (isExpanded.value) {
		nextTick(() => {
			const height = tableRowElement.value?.scrollHeight || 0
			if (tableRowElement.value) tableRowElement.value.style.height = `${height}px`
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
	display: table-cell;
	overflow: hidden;
	text-overflow: ellipsis;
	vertical-align: top;
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
	display: table-row;
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
		border-inline-start-color: var(--color-text-maxcontrast);
	}
	&--info {
		border-inline-start-color: var(--color-info);
	}
	&--warning {
		border-inline-start-color: var(--color-warning);
	}
	&--error {
		border-inline-start-color: var(--color-error);
	}
}
</style>
