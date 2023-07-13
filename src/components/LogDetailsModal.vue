<template>
	<NcModal :show="open"
		size="large"
		:name="t('logreader', 'Log entry details')"
		:has-previous="index > 0"
		:has-next="index < logEntries.length - 1"
		@next="$emit('update:currentEntry', logEntries[index + 1])"
		@previous="$emit('update:currentEntry', logEntries[index - 1])"
		@update:show="$emit('update:open', false)">
		<template #default>
			<div class="log-details">
				<dl :class="cssLevelClass">
					<dt>{{ t('logreader', 'Level') }}</dt>
					<dd>{{ levelString }}</dd>
					<dt>{{ t('logreader', 'App') }}</dt>
					<dd>
						{{ currentEntry?.app || t('logreader', 'No app in context') }}
					</dd>
					<dt>{{ t('logreader', 'Time') }}</dt>
					<dd>{{ timeString }}</dd>
				</dl>
				<template v-if="currentEntry.exception">
					<NcButton class="log-details__btn"
						@click="isExceptionExpanded = !isExceptionExpanded">
						{{ isExceptionExpanded ? t('logreader', 'Hide exception details') : t('logreader', 'View exception details') }}
					</NcButton>
					<LogException :exception="currentEntry.exception" class="log-details__exception" :is-expanded="isExceptionExpanded" />
					<hr>
				</template>
				<NcButton class="log-details__btn"
					@click="isRawExpanded = !isRawExpanded">
					{{ isRawExpanded ? t('logreader', 'Hide raw log entry') : t('logreader', 'View raw log entry') }}
				</NcButton>
				<figure class="log-details__raw">
					<figcaption>{{ t('logreader', 'Raw log entry') }}</figcaption>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<pre><code v-show="isRawExpanded" class="hljs language-json" v-html="code" /></pre>
				</figure>
			</div>
		</template>
		<template #actions>
			<NcActionButton close-after-click @click="copyRaw">
				<template #icon>
					<IconContentCopy />
				</template>
				{{ t('logreader', 'Copy raw entry') }}
			</NcActionButton>
			<NcActionButton close-after-click @click="copyFormatted">
				<template #icon>
					<IconContentCopy />
				</template>
				{{ t('logreader', 'Copy formatted entry') }}
			</NcActionButton>
		</template>
	</NcModal>
</template>

<script setup lang="ts">
import type { ILogEntry } from '../interfaces'

import { translate as t } from '@nextcloud/l10n'
import { computed, ref, watchEffect } from 'vue'
import { copyToCipboard } from '../utils/clipboard'
import { useLogFormatting } from '../utils/format'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from '../constants'

import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcModal from '@nextcloud/vue/dist/Components/NcModal.js'
import IconContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

import 'highlight.js/styles/base16/material-darker.css'
import LogException from './exception/LogException.vue'

hljs.registerLanguage('json', json)

const props = defineProps<{
	open: boolean
	currentEntry: ILogEntry
	logEntries: readonly ILogEntry[]
}>()

const { formatTime, formatLogEntry } = useLogFormatting()

/**
 * Whether to show the full exception
 */
const isExceptionExpanded = ref(!!props.currentEntry.exception)

/**
 * Whether to show the raw log entry
 */
const isRawExpanded = ref(!props.currentEntry.exception)

/**
 * Hide exception is current entry is changes
 */
watchEffect(() => {
	isExceptionExpanded.value = !!props.currentEntry.exception
	isRawExpanded.value = !props.currentEntry.exception
})

/**
 * Index of the current entry within all entries
 */
const index = computed(() =>
	props.logEntries.findIndex((entry) => entry === props.currentEntry),
)

/**
 * Formatted data of the entry
 */
const code = computed(
	() =>
		hljs.highlight(JSON.stringify(props.currentEntry, null, 2), { language: 'json' })
			.value,
)

/**
 * Level as translated human readable string
 */
const levelString = computed(() => LOGGING_LEVEL_NAMES[props.currentEntry.level])

/**
 * Time as localized string
 */
const timeString = computed(() => formatTime(props.currentEntry.time))

/**
 * css classes to assign logging level as border color
 */
const cssLevelClass = computed(() => [
	'log-details__info',
	`log-details__info--${LOGGING_LEVEL[props.currentEntry.level]}`,
])

const copyRaw = () => copyToCipboard(JSON.stringify(props.currentEntry))
const copyFormatted = () => copyToCipboard(formatLogEntry(props.currentEntry))
</script>

<style lang="scss" scoped>
.log-details {
	padding: 12px;

	&__raw, &__exception {
		padding-block-start: 12px;
	}

	&__btn {
		margin-inline-start: auto;
	}

	&__info {
		display: flex;
		justify-content: space-between;
		border-block-end: 4px solid;
		padding-inline-end: 50px;
		padding-block: 13px 4px;
		margin-block-end: 13px;

		dt, dd {
			padding: 0;
		}

		dt {
			font-weight: bold;
			&::after {
				content: ':';
			}
		}

		&--debug {
			border-block-end-color: var(--color-text-maxcontrast);
		}
		&--info {
			border-block-end-color: var(--color-info);
		}
		&--warning {
			border-block-end-color: var(--color-warning);
		}
		&--error {
			border-block-end-color: var(--color-error);
		}
	}
}
.hljs {
	background-color: var(--color-main-background);
}
</style>
