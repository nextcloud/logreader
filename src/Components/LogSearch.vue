<!--
    SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
    SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcActions :force-menu="true"
		:open.sync="isOpen"
		:aria-label="t('logreader', 'Search log entries')"
		type="tertiary-no-background">
		<template #icon>
			<NcIconSvgWrapper :svg="TextSearchSvg" />
		</template>
		<template #default>
			<NcActionInput :value="currentQuery"
				:label="t('logreader', 'Search log entries')"
				:show-trailing-button="false"
				@submit="isOpen = false"
				@input="onSearchInput">
				{{ t('logreader', 'Search log entries') }}
				<template #icon>
					<NcIconSvgWrapper :svg="MagnifySvg" />
				</template>
			</NcActionInput>
		</template>
	</NcActions>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { translate as t } from '@nextcloud/l10n'

import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionInput from '@nextcloud/vue/dist/Components/NcActionInput.js'
import NcIconSvgWrapper from '@nextcloud/vue/dist/Components/NcIconSvgWrapper.js'
import TextSearchSvg from '@mdi/svg/svg/text-search.svg?raw'
import MagnifySvg from '@mdi/svg/svg/magnify.svg?raw'
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
 * Current active search query
 */
const currentQuery = computed(() => logStore.query)

/**
 * Handle changes of the search query
 *
 * @param param0 The InputEvent
 * @param param0.target The input element
 */
const onSearchInput = ({ target }: InputEvent) => {
	logStore.searchLogs((target as HTMLInputElement).value)
}

/**
 * Listen for common search shortcut, open menu if requested and stop the event to prevent unified search from opening
 *
 * @param event The keydown event
 */
const keyboardListener = (event: KeyboardEvent) => {
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
