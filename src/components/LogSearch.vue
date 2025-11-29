<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcActions
		v-model:open="isOpen"
		:force-menu="true"
		:aria-label="t('logreader', 'Search log entries')"
		:type="buttonType">
		<template #icon>
			<IconTextSearch :size="20" />
		</template>
		<template #default>
			<NcActionInput
				:model-value="currentQuery"
				:label="t('logreader', 'Search log entries')"
				:show-trailing-button="false"
				@submit="isOpen = false"
				@input="onSearchInput">
				{{ t('logreader', 'Search log entries') }}
				<template #icon>
					<IconMagnify :size="20" />
				</template>
			</NcActionInput>
		</template>
	</NcActions>
</template>

<script setup lang="ts">
import { translate as t } from '@nextcloud/l10n'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import NcActionInput from '@nextcloud/vue/components/NcActionInput'
import NcActions from '@nextcloud/vue/components/NcActions'
import IconMagnify from 'vue-material-design-icons/Magnify.vue'
import IconTextSearch from 'vue-material-design-icons/TextSearch.vue'
import { useLogStore } from '../store/logging'

declare global {
	interface Window {
		OCP: Nextcloud.v27.OCP
	}
}

const logStore = useLogStore()

/**
 * State of the search input popover
 */
const isOpen = ref(false)

/**
 * The button type, forced to `primary` when filter is active
 */
const buttonType = computed(() => logStore.query ? 'primary' : 'tertiary-no-background')

/**
 * Current active search query
 */
const currentQuery = computed(() => logStore.query)

/**
 * Handle changes of the search query
 *
 * @param param0 The InputEvent
 * @param param0.target The input element
 */
function onSearchInput({ target }: InputEvent) {
	logStore.searchLogs((target as HTMLInputElement).value)
}

/**
 * Listen for common search shortcut, open menu if requested and stop the event to prevent unified search from opening
 *
 * @param event The keydown event
 */
function keyboardListener(event: KeyboardEvent) {
	if (event.ctrlKey && event.key === 'f') {
		isOpen.value = true
		event.preventDefault()
		event.stopPropagation()
	}
}

/**
 * Intercept search requestes to filter log entries
 *
 * Notice the `true` so we intercept keydown on the bubble in -> intercept before unified search can handle it.
 */
onMounted(() => {
	if (!window.OCP.Accessibility.disableKeyboardShortcuts()) {
		document.addEventListener('keydown', keyboardListener, true)
	}
})

onUnmounted(() => {
	document.removeEventListener('keydown', keyboardListener, true)
})
</script>
