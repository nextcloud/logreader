<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="log-table">
		<LogDetailsModal
			v-if="currentRow"
			v-model:open="isModalOpen"
			v-model:current-entry="currentRow"
			:log-entries="sortedRows" />
		<table ref="tableRoot" class="log-table__table">
			<thead role="rowgroup" class="log-table__header">
				<tr>
					<LogTableHeader
						v-model:sorted="sortedByLevel"
						:name="t('logreader', 'Level')" />
					<LogTableHeader
						v-model:sorted="sortedByApp"
						:name="t('logreader', 'Application')" />
					<LogTableHeader :name="t('logreader', 'Message')" :sortable="false">
						<LogSearch />
					</LogTableHeader>
					<LogTableHeader
						v-model:sorted="sortedByTime"
						:name="t('logreader', 'Time')" />
					<th><span class="hidden-visually">{{ t('logreader', 'Log entry actions') }}</span></th>
				</tr>
			</thead>
			<tbody ref="tableBody" :style="tbodyStyle" class="log-table__body">
				<tr v-if="sortedByTime === 'ascending'" class="log-table__load-more">
					<td>
						<IntersectionObserver v-if="logStore.hasRemainingEntries" @intersection="loadMore">
							{{ t('logreader', 'Loading older log entries') }}
						</IntersectionObserver>
						<span v-else>
							{{ t('logreader', 'No older log entries available') }}
						</span>
					</td>
				</tr>

				<LogTableRow
					v-for="row in renderedItems"
					:key="row.id"
					:row="row"
					class="log-table__row"
					@show-details="showDetailsForRow" />
			</tbody>
			<tfoot role="rowgroup" class="log-table__footer">
				<tr v-if="sortedByTime !== 'ascending'" class="log-table__load-more">
					<td>
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

import { translate as t } from '@nextcloud/l10n'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import IntersectionObserver from '../IntersectionObserver.vue'
import LogDetailsModal from '../LogDetailsModal.vue'
import LogSearch from '../LogSearch.vue'
import LogTableHeader from './LogTableHeader.vue'
import LogTableRow from './LogTableRow.vue'
import { useLogStore } from '../../store/logging'
import { useSettingsStore } from '../../store/settings'
import { debounce } from '../../utils/debounce'
import { logger } from '../../utils/logger'

const props = defineProps<{
	/** Log entries to display */
	rows: ILogEntry[]
}>()

// Items to render before and after the visible area
const bufferItems = 3

const settingsStore = useSettingsStore()
const logStore = useLogStore()

const sortedByLevel = ref<ISortingOptions>('')
const sortedByApp = ref<ISortingOptions>('')
const sortedByTime = ref<ISortingOptions>('descending')

/**
 * Filtered rows by configured levels
 */
const filteredRows = computed(() => {
	return props.rows.filter((row) => (settingsStore.shownLevels as number[]).includes(row.level))
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
function showDetailsForRow(row: ILogEntry) {
	currentRow.value = row
	isModalOpen.value = true
}

/**
 * Reference to the table elements, used for keeping scroll position on loading more entries
 */
const tableRoot = ref<HTMLElement>()
const tableBody = ref<HTMLElement>()

/**
 * Load older log entries and ensure that the view sticks at the previous top element
 */
async function loadMore() {
	const sizeBefore = logStore.entries.length
	await logStore.loadMore()
	// Ensure that the view sticks at the previous top element
	nextTick(() => {
		if (sortedByTime.value === 'ascending') {
			const positionOfPreviousElement = logStore.entries.length - sizeBefore + 1 // ensure the loading row is not inside view
			const previousTopElement = tableBody.value?.querySelector(`tr:nth-of-type(${positionOfPreviousElement})`)
			if (previousTopElement) {
				previousTopElement.scrollIntoView({ block: 'start' })
			}
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
	return sorted
})

/**
 * Virtual scrolling logic
 */
const resizeObserver = ref<ResizeObserver | null>(null)

const firstVisibleRowIndex = ref(0)
const startIndex = computed(() => Math.max(0, firstVisibleRowIndex.value - bufferItems))

const tableRootHeight = ref(0)
const tableHeadHeight = ref(44)
const tableRowHeight = ref(42)
const itemsInViewport = computed(() => Math.ceil((tableRootHeight.value - tableHeadHeight.value) / tableRowHeight.value) + bufferItems * 2)

const renderedItems = computed(() => sortedRows.value.slice(startIndex.value, startIndex.value + itemsInViewport.value))

const tbodyStyle = computed(() => {
	const isOverScrolled = startIndex.value + itemsInViewport.value > sortedRows.value.length
	const lastIndex = sortedRows.value.length - startIndex.value - itemsInViewport.value
	const hiddenAfterItems = Math.min(sortedRows.value.length - startIndex.value, lastIndex)

	return {
		paddingTop: `${startIndex.value * tableRowHeight.value}px`,
		paddingBottom: isOverScrolled ? 0 : `${hiddenAfterItems * tableRowHeight.value}px`,
	}
})

onMounted(() => {
	resizeObserver.value = new ResizeObserver(debounce(() => {
		tableRootHeight.value = tableRoot.value?.clientHeight ?? 0
		tableHeadHeight.value = tableRoot.value?.querySelector('thead.log-table__header')?.clientHeight ?? 44
		tableRowHeight.value = tableRoot.value?.querySelector('tr.log-table__row:not(.expanded)')?.clientHeight ?? 42
		logger.debug('ResizeObserver for virtual list updated', { rendered: renderedItems.value.length, total: filteredRows.value.length })
		onScroll()
	}, 100))

	resizeObserver.value.observe(tableRoot.value!)
	tableRoot.value!.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
	if (resizeObserver.value) {
		resizeObserver.value.disconnect()
	}
})

/**
 * Update the first visible row index on scroll (max 0 to prevent negative index)
 */
function onScroll() {
	firstVisibleRowIndex.value = Math.max(0, Math.round(tableRoot.value!.scrollTop / tableRowHeight.value))
}
</script>

<style lang="scss" scoped>
.log-table {
	width: 100%;
	height: 100%;
	overflow: hidden;

	&__table {
		width: calc(100% - 12px);
		margin-inline: 6px;
		table-layout: fixed;

		// Necessary for virtual scroll optimized rendering
		display: block;
		overflow: auto;
		height: 100%;
		will-change: scroll-position;
	}

	&__load-more {
		display: flex;

		:deep(td) {
			flex-basis: 100%;
			text-align: center;
			padding-block: 4px;
		}
	}

	&__header,
	&__body,
	&__footer {
		display: flex;
		flex-direction: column;
		width: 100%;

		:deep(tr) {
			display: flex;
		}

		:deep(th),
		:deep(td) {
			flex-shrink: 0;

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
				flex-grow: 1;
			}
			// time column
			&:nth-child(4) {
				width: 25ch; // "Mar 10, 2025, 12:00:00 PM" length
			}
			// actions column
			&:last-child {
				width: 62px; // 44px button + 18px padding
			}
		}
	}

	&__header {
		position: sticky;
		top: 0;
		z-index: 1;
		min-height: 44px;

		:deep(th) {
			position: sticky;
			top: 0;
			z-index: 99;
			background-color: var(--color-main-background);
			border-bottom: 2px solid var(--color-border-dark);
		}
	}

	&__body {
		// Some spacing for first row
		&:before {
			content: '\200c';
			display: block;
			line-height: 6px;
			text-indent: -99999px;
		}
	}

	&__row {
		min-height: 42px;
	}
}
</style>
