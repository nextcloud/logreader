<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li>
		<div class="trace__position">
			<span class="trace__file">{{ line.file }}</span>
			<span v-if="line.line" class="trace__line">{{
				t('logreader', 'Line {line}', { line: line.line })
			}}</span>
		</div>
		<pre class="trace__function"><code class="trace__function_name" v-text="functionText" /><code class="trace__function_arguments" v-text="argumentText" /></pre>
	</li>
</template>

<script setup lang="ts">
import type { ITraceLine } from '../../interfaces'

import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'

const props = defineProps<{
	line: ITraceLine
}>()

/**
 * The fully qualified function name (including the class name)
 */
const functionText = computed(() => `${props.line.class}${props.line.type}${props.line.function}`)

/**
 * The arguments of the function
 */
const argumentText = computed(() => (props.line.args || []).length === 0
	? '()'
	: (
			'(\n'
			+ (props.line.args || [])
				// stringify the arguments and add indention
				.map((argument) => JSON.stringify(argument, undefined, 2).split('\n').map((code) => `  ${code}`).join('\n'))
				.join(',\n')
				+ '\n)'
		))
</script>

<style lang="scss" scoped>
.trace {
	&__position {
		display: flex;
	}

	&__file {
		font-style: italic;
	}

	&__line {
		&::before {
			content: '-';
			padding-inline: 6px;
		}
		&::after {
			content: ':';
		}
	}
}
</style>
