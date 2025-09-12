<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div ref="observable">
		<!-- Allow custom content for the observer e.g. "load more" text -->
		<slot />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
	/**
	 * Optional options used to initialize the IntersectionObserver
	 */
	options?: IntersectionObserverInit
}>()

const emit = defineEmits<{
	/**
	 * Emitted when an intersection is observed
	 */
	(event: 'intersection'): void
}>()

/**
 * The observed element
 */
const observable = ref<HTMLDivElement>()

/**
 * The intersection observer
 */
const observer = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		emit('intersection')
	}
}, props.options)

/**
 * Start observing when mounted
 */
onMounted(() => {
	if (observable.value) {
		observer.observe(observable.value)
	}
})

/**
 * Stop observing on unmount
 */
onUnmounted(() => observer.disconnect())
</script>
