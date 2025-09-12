<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<span class="exception_wrapper">
		<div class="exception">
			<span class="exception__title">
				{{ exceptionTitleText }}
			</span>
			<span class="exception__message">{{ exceptionMessage }}</span>
		</div>
		<StackTrace v-if="props.isExpanded" :trace="props.exception.Trace" class="exception__trace" />
		<LogException v-if="props.isExpanded && props.exception.Previous" :is-previous="true" :exception="props.exception.Previous" />
	</span>
</template>

<script setup lang="ts">
import type { IException } from '../../interfaces'

import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'
import StackTrace from './StackTrace.vue'

const props = withDefaults(defineProps<{
	isPrevious: boolean
	isExpanded: boolean
	exception: IException
}>(), {
	isExpanded: false,
	isPrevious: false,
})

/**
 * The name of the exception class, e.g. 'GenericFileException'
 */
const exceptionName = computed(() => props.exception.Exception.split('\\').pop() || '?')

const exceptionMessage = computed(() => props.exception.Message && props.exception.Message !== '--' ? props.exception.Message : props.exception.CustomMessage)

/**
 * Text to show on the title, handle also nested exceptions
 */
const exceptionTitleText = computed(() => {
	if (props.isPrevious) {
		return t('logreader', 'Caused by {exception}', { exception: exceptionName.value })
	}
	return exceptionName.value
})

</script>

<style lang="scss" scoped>
.exception {
	display: flex;
	align-items: start;

	&__title {
		font-weight: bold;
		white-space: normal;
	}

	&__message {
		margin-inline-start: 6px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__trace {
		margin-inline-start: 2em;
	}
}
</style>
