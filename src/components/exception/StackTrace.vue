<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<ol class="stack-trace">
		<TraceLine v-for="line, idx in props.trace" :key="idx" :line="line" />
	</ol>
</template>

<script setup lang="ts">
import type { ITraceLine } from '../../interfaces'

import TraceLine from './TraceLine.vue'

const props = defineProps<{
	trace: readonly ITraceLine[]
}>()

</script>

<style lang="scss" scoped>
.stack-trace {
	li:not(:last-child) {
		margin-block-end: 0.5rem;
	}
}
</style>
