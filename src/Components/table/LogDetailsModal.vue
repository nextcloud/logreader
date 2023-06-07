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
				<figure class="log-details__raw">
					<figcaption>{{ t('logreader', 'Raw log entry') }}</figcaption>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<pre><code class="hljs language-json" v-html="code" /></pre>
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

<script lang="ts" setup>
import type { LogEntry } from '../../types'

import { translate as t } from '@nextcloud/l10n'
import { computed } from 'vue'
import { useLogFormatting } from '../../utils/format'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from '../../constants'

import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcModal from '@nextcloud/vue/dist/Components/NcModal.js'
import IconContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/base16/material-darker.css'
import { copyToCipboard } from '../../utils/clipboard'

hljs.registerLanguage('json', json)

const props = defineProps<{
	open: boolean
	currentEntry: LogEntry
	logEntries: readonly LogEntry[]
}>()

const { formatTime, formatLogEntry } = useLogFormatting()

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

	&__raw {
		padding-top: 12px;
	}

	&__info {
		padding-right: 50px;
		padding-top: 13px;
		display: flex;
		justify-content: space-between;
		border-bottom: 4px solid;
		padding-bottom: 4px;

		dt {
			font-weight: bold;
		}

		&--debug {
			border-bottom-color: var(--color-text-maxcontrast);
		}
		&--info {
			border-bottom-color: var(--color-info);
		}
		&--warning {
			border-bottom-color: var(--color-warning);
		}
		&--error {
			border-bottom-color: var(--color-error);
		}
	}
}
.hljs {
	background-color: var(--color-main-background);
}
</style>
