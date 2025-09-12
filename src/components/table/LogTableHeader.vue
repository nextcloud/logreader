<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<th :aria-sort="ariaSort">
		<div class="log-table-header__wrapper">
			<NcButton
				v-if="sortable"
				:variant="props.sorted ? 'secondary' : 'tertiary-no-background'"
				:aria-label="name"
				:aria-pressed="!!props.sorted"
				:wide="true"
				@click.stop="changeSortMode">
				<template #icon>
					<component :is="sortIcon" :size="20" />
				</template>
				{{ name }}
			</NcButton>
			<span v-else :title="name" class="log-table-header__text">
				{{ name }}
			</span>
			<!-- Allow to add content -->
			<slot />
		</div>
	</th>
</template>

<script setup lang="ts">
import type { ISortingOptions } from '../../interfaces'

import { computed } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import IconSort from 'vue-material-design-icons/Sort.vue'
import IconSortAscending from 'vue-material-design-icons/SortAscending.vue'
import IconSortDescending from 'vue-material-design-icons/SortDescending.vue'

interface Props {
	/**
	 * Whether the column is sortable
	 *
	 * @default true
	 */
	sortable?: boolean
	/**
	 * Current sorting
	 *
	 * @default ''
	 */
	sorted?: ISortingOptions
	/**
	 * Name of the column
	 */
	name: string
}

interface Emits {
	(e: 'update:sorted', value: ISortingOptions): void
}

const props = withDefaults(defineProps<Props>(), {
	sorted: '',
	sortable: true,
})

const emit = defineEmits<Emits>()

/**
 * Set the `aria-sort` property to the current sorting (or undefined if not = remove property)
 */
const ariaSort = computed(() => props.sorted || undefined)

/**
 * Icon for current sorting order
 */
const sortIcon = computed(() => {
	if (props.sorted === 'ascending') {
		return IconSortAscending
	} else if (props.sorted === 'descending') {
		return IconSortDescending
	} else {
		return IconSort
	}
})

/**
 * Switch through the sort modes
 */
function changeSortMode() {
	switch (props.sorted) {
		case 'ascending': {
			emit('update:sorted', 'descending')
			break
		}
		case 'descending': {
			emit('update:sorted', '')
			break
		}
		case '': {
			emit('update:sorted', 'ascending')
			break
		}
	}
}

</script>

<style lang="scss" scoped>
.log-table-header {
	&__wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__text {
		// Fake a button icon style
		padding-inline-start: 12px;
	}
}

th {
	:deep() {
		.button-vue__wrapper {
			justify-content: left;
		}
	}

	&> * {
		padding-inline: 6px 2px;
	}
}
</style>
