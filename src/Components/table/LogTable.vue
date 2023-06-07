<!--
    SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
    SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div class="log-table">
		<LogDetailsModal v-if="currentRow"
			:open.sync="isModalOpen"
			:current-entry.sync="currentRow"
			:log-entries="sortedRows" />
		<table class="log-table__table">
			<thead>
				<tr>
					<LogTableHeader :name="t('logreader', 'Level')"
						:sorted.sync="sortedByLevel" />
					<LogTableHeader :name="t('logreader', 'Application')"
						:sorted.sync="sortedByApp" />
					<LogTableHeader :name="t('logreader', 'Message')" :sortable="false">
						<LogSearch />
					</LogTableHeader>
					<LogTableHeader :name="t('logreader', 'Time')"
						:sorted.sync="sortedByTime" />
					<th><span class="hidden-visually">{{ t('logreader', 'Log entry actions') }}</span></th>
				</tr>
			</thead>
			<tbody ref="scrollContainer">
				<LogTableRow v-for="row, rowNumber in sortedRows"
					:key="rowNumber"
					:row="row"
					@show-details="showDetailsForRow" />
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
import type { LogEntry, SortingOptions } from '../../types'

import { computed, ref } from 'vue'
import { translate as t } from '@nextcloud/l10n'
import { useSettingsStore } from '../../store/settings'

import LogTableHeader from './LogTableHeader.vue'
import LogTableRow from './LogTableRow.vue'
import LogDetailsModal from './LogDetailsModal.vue'
import LogSearch from '../LogSearch.vue'

const { shownLevels } = useSettingsStore()

const sortedByLevel = ref<SortingOptions>('')
const sortedByApp = ref<SortingOptions>('')
const sortedByTime = ref<SortingOptions>('descending')

const props = defineProps<{
	/** Log entries to display */
	rows: LogEntry[]
}>()

/**
 * Filtered rows by configured levels
 */
const filteredRows = computed(() => {
	return props.rows.filter(row => (shownLevels as number[]).includes(row.level))
})

/**
 * Should the details modal be shown
 */
const isModalOpen = ref(false)

/**
 * The log entry to show in the modal
 */
const currentRow = ref<LogEntry>(props.rows[0])

/**
 * Display details for a given log entry
 *
 * @param row The log entry to display
 */
const showDetailsForRow = (row: LogEntry) => {
	currentRow.value = row
	isModalOpen.value = true
}

/**
 * Rows sorted (table headers)
 */
const sortedRows = computed(() => {
	const sorted = [...filteredRows.value]
	const byLevel = (a: LogEntry, b: LogEntry) => a.level - b.level
	const byApp = (a: LogEntry, b: LogEntry) => a.app.localeCompare(b.app)
	const byTime = (a: LogEntry, b: LogEntry) => a.time.localeCompare(b.time, 'en')

	const order = (fn: any, type: string, a: LogEntry, b: LogEntry) => type === 'ascending' ? fn(a, b) : (type === 'descending' ? fn(b, a) : 0)

	sorted.sort((a, b) => order(byLevel, sortedByLevel.value, a, b) || order(byApp, sortedByApp.value, a, b) || order(byTime, sortedByTime.value, a, b))
	return sorted
})
</script>

<style lang="scss" scoped>
.log-table {
	width: 100%;
	height: 100%;
	overflow: scroll;

	&__table {
		width: calc(100% - 12px);
		margin: 6px;
		table-layout: fixed;
	}

	th, td {
		// level column
		&:nth-child(1) {
			width: 90px;
		}
		// app column
		&:nth-child(2) {
			width: 150px;
		}
		// message column
		&:nth-child(3) {
			width: 400px;
		}
		// time column
		&:nth-child(4) {
			width: 150px;
		}
		// actions column
		&:last-child {
			width: 44px;
		}
	}

	thead {
		min-height: 44px;

		:deep(th) {
			position: sticky;
			top: 0;
			z-index: 99;
			padding-top: 1rem;
			background-color: var(--color-main-background);
			border-bottom: 2px solid var(--color-text-maxcontrast);
		}
	}

	tbody {
		// Some spacing for first row
		&:before {
			content: '\200c';
			display: block;
			line-height: 6px;
			text-indent: -99999px;
		}
	}

}
</style>
