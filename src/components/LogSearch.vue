<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcTextField
		ref="searchField"
		class="log-search__input"
		:modelValue="currentQuery"
		labelOutside
		:aria-label="t('logreader', 'Search log entries')"
		:placeholder="t('logreader', 'Search log entries')"
		:showTrailingButton="!!currentQuery"
		trailingButtonIcon="close"
		@update:modelValue="onSearchInput"
		@trailingButtonClick="onSearchInput('')">
		<template #icon>
			<IconMagnify :size="20" />
		</template>
	</NcTextField>
</template>

<script setup lang="ts">
import { translate as t } from '@nextcloud/l10n'
import { useHotKey } from '@nextcloud/vue/composables/useHotKey'
import { computed, ref } from 'vue'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import IconMagnify from 'vue-material-design-icons/Magnify.vue'
import { useLogStore } from '../store/logging'

const logStore = useLogStore()

/**
 * Reference to the search input, used for focusing it on the search shortcut
 */
const searchField = ref<InstanceType<typeof NcTextField>>()

/**
 * Current active search query
 */
const currentQuery = computed(() => logStore.query)

/**
 * Handle changes of the search query
 *
 * @param value The new search query
 */
function onSearchInput(value: string | number) {
	logStore.searchLogs(String(value))
}

/**
 * Focus and select the search input on the common search shortcut
 */
useHotKey('f', () => {
	searchField.value?.focus()
	searchField.value?.select()
}, { ctrl: true, prevent: true })
</script>

<style lang="scss" scoped>
.log-search__input {
	flex: 1 1 auto;
	min-width: 0;
	max-width: 300px;
}
</style>
