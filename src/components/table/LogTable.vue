<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div ref="table" class="log-table" @scroll="debouncedHandleScrollPosition">
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
			<tbody ref="tableBody">
				<tr v-if="sortedByTime === 'ascending'">
					<td colspan="5" class="log-table__load-more">
						<IntersectionObserver v-if="logStore.hasRemainingEntries" @intersection="loadMore">
							{{ t('logreader', 'Loading older log entries') }}
						</IntersectionObserver>
						<span v-else>
							{{ t('logreader', 'No older log entries available') }}
						</span>
					</td>
				</tr>

				<template v-for="(row, rowNumber) in sortedRows">
					<tr v-if="row.showDummy" :key="rowNumber" class="log-table__dummy-row" />
					<LogTableRow v-else
						:key="rowNumber"
						:row="row"
						@show-details="showDetailsForRow" />
				</template>
			</tbody>
			<tfoot>
				<tr v-if="sortedByTime !== 'ascending'">
					<td colspan="5" class="log-table__load-more">
						<IntersectionObserver v-if="logStore.hasRemainingEntries" @intersection="loadMore">
							{{ t('logreader', 'Loading older log entries') }}
						</IntersectionObserver>
						<span v-else>
							{{ t('logreader', 'No older log entries available') }}
						</span>
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</template>

<script setup lang="ts">
import type { ILogEntry, ISortingOptions } from '../../interfaces'

import { computed, nextTick, ref, watch } from 'vue'
import { translate as t } from '@nextcloud/l10n'
import { useSettingsStore } from '../../store/settings'
import { useLogStore } from '../../store/logging'
import { debounce } from '../../utils/debounce'

import IntersectionObserver from '../IntersectionObserver.vue'
import LogDetailsModal from '../LogDetailsModal.vue'
import LogTableHeader from './LogTableHeader.vue'
import LogTableRow from './LogTableRow.vue'
import LogSearch from '../LogSearch.vue'

const settingsStore = useSettingsStore()
const logStore = useLogStore()

const sortedByLevel = ref<ISortingOptions>('')
const sortedByApp = ref<ISortingOptions>('')
const sortedByTime = ref<ISortingOptions>('descending')

const props = defineProps<{
	/** Log entries to display */
	rows: ILogEntry[]
}>()

/**
 * Filtered rows by configured levels
 */
const filteredRows = computed(() => {
	return props.rows.filter(row => (settingsStore.shownLevels as number[]).includes(row.level))
})

/**
 * Should the details modal be shown
 */
const isModalOpen = ref(false)

/**
 * The log entry to show in the modal
 */
const currentRow = ref<ILogEntry>(props.rows[0])

/**
 * Display details for a given log entry
 *
 * @param row The log entry to display
 */
const showDetailsForRow = (row: ILogEntry) => {
	currentRow.value = row
	isModalOpen.value = true
}

/**
 * Reference to the table container, used to track current scroll position
 */
const table = ref<HTMLElement>()
/**
 * Reference to the table body, used for keeping scroll position on loading more entries
 */
const tableBody = ref<HTMLElement>()

/**
 * Get index of the first visible row, to define visible scope around it
 * Rest entries should be rendered as dummy nodes, to reduce load while render
 */
const firstVisibleRowIndex = ref(0)

const handleScrollPosition = () => {
	firstVisibleRowIndex.value = Math.floor((table.value?.scrollTop ?? 0) / 42)
}

const debouncedHandleScrollPosition = debounce(handleScrollPosition, 100)

/**
 * Load older log entries and ensure that the view sticks at the previous top element
 */
const loadMore = async () => {
	const sizeBefore = logStore.entries.length
	await logStore.loadMore()
	// Ensure that the view sticks at the previous top element
	nextTick(() => {
		if (sortedByTime.value === 'ascending') {
			const positionOfPreviousElement = logStore.entries.length - sizeBefore + 1 // ensure the loading row is not inside view
			const previousTopElement = tableBody.value?.querySelector(`tr:nth-of-type(${positionOfPreviousElement})`)
			if (previousTopElement) previousTopElement.scrollIntoView({ block: 'start' })
		}
	})
}

type SortLogFunction = (a: ILogEntry, b: ILogEntry) => number

/**
 * Rows sorted (table headers)
 */
const sortedRows = computed(() => {
	const sorted = [...filteredRows.value]
	const byLevel: SortLogFunction = (a: ILogEntry, b: ILogEntry) => a.level - b.level
	const byApp: SortLogFunction = (a: ILogEntry, b: ILogEntry) => a.app.localeCompare(b.app)
	const byTime: SortLogFunction = (a: ILogEntry, b: ILogEntry) => a.time.localeCompare(b.time, 'en')

	const order = (fn: SortLogFunction, type: string, a: ILogEntry, b: ILogEntry) => type === 'ascending' ? fn(a, b) : (type === 'descending' ? fn(b, a) : 0)

	sorted.sort((a, b) => order(byLevel, sortedByLevel.value, a, b) || order(byApp, sortedByApp.value, a, b) || order(byTime, sortedByTime.value, a, b))
	return sorted.map((row, index) => ({
		...row,
		showDummy: index > firstVisibleRowIndex.value + 50 || index < firstVisibleRowIndex.value - 50,
	}))
})

/**
 * Recalculate the visible scope of log entries on list update
 */
watch(sortedRows, () => {
	handleScrollPosition()
})
</script>

<style lang="scss" scoped>
.log-table {
	width: 100%;
	height: 100%;
	overflow: scroll;

	&__table {
		width: calc(100% - 12px);
		margin-inline: 6px;
		table-layout: fixed;
	}

	&__dummy-row {
		height: 42px;
	}

	&__load-more {
		text-align: center;
		padding-block: 4px;
	}

	th, td {
		// level column
		&:nth-child(1) {
			width: 108px;
		}
		// app column
		&:nth-child(2) {
			width: 168px;
		}
		// message column
		&:nth-child(3) {
			width: 418px;
		}
		// time column
		&:nth-child(4) {
			width: 168px;
		}
		// actions column
		&:last-child {
			width: 62px; // 44px button + 18px padding
		}
	}

	thead {
		min-height: 44px;

		:deep(th) {
			position: sticky;
			top: 0;
			z-index: 99;
			background-color: var(--color-main-background);
			border-bottom: 2px solid var(--color-border-dark);
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
