<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcModal
		:show="open"
		size="large"
		:hasPrevious="index > 0"
		:hasNext="index < logEntries.length - 1"
		@next="emit('update:currentEntry', logEntries[index + 1])"
		@previous="emit('update:currentEntry', logEntries[index - 1])"
		@update:show="emit('update:open', false)">
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
				<div class="log-details__actions">
					<NcButton :aria-label="t('logreader', 'Copy raw entry')" variant="tertiary" @click="copyRaw">
						<template #icon>
							<IconContentCopy />
						</template>
						{{ t('logreader', 'Copy raw entry') }}
					</NcButton>
					<NcButton :aria-label="t('logreader', 'Copy formatted entry')" variant="tertiary" @click="copyFormatted">
						<template #icon>
							<IconContentCopy />
						</template>
						{{ t('logreader', 'Copy formatted entry') }}
					</NcButton>
					<NcButton
						v-if="currentEntry.exception"
						class="log-details__btn"
						@click="isExceptionExpanded = !isExceptionExpanded">
						{{ isExceptionExpanded ? t('logreader', 'Hide exception details') : t('logreader', 'View exception details') }}
					</NcButton>
				</div>
				<template v-if="currentEntry.exception">
					<LogException :exception="currentEntry.exception" class="log-details__exception" :isExpanded="isExceptionExpanded" />
					<hr>
				</template>
				<figure class="log-details__raw">
					<figcaption>{{ t('logreader', 'Raw log entry') }}</figcaption>
					<NcRichText class="log-details__raw-text" :text useExtendedMarkdown />
				</figure>
			</div>
		</template>
	</NcModal>
</template>

<script setup lang="ts">
import type { ILogEntry } from '../interfaces'

import { showSuccess } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'
import { computed, ref, watchEffect } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcModal from '@nextcloud/vue/components/NcModal'
import NcRichText from '@nextcloud/vue/components/NcRichText'
import IconContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import LogException from './exception/LogException.vue'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from '../constants'
import { copyToCipboard } from '../utils/clipboard'
import { useLogFormatting } from '../utils/format'

const props = defineProps<{
	open: boolean
	currentEntry: ILogEntry
	logEntries: readonly ILogEntry[]
}>()

const emit = defineEmits<{
	(event: 'update:currentEntry', value: ILogEntry): void
	(event: 'update:open', value: false): void
}>()

const { formatTime, formatLogEntry } = useLogFormatting()

/**
 * Whether to show the full exception
 */
const isExceptionExpanded = ref(!!props.currentEntry.exception)

/**
 * Hide exception is current entry is changes
 */
watchEffect(() => {
	isExceptionExpanded.value = !!props.currentEntry.exception
})

/**
 * Index of the current entry within all entries
 */
const index = computed(() => props.logEntries.findIndex((entry) => entry === props.currentEntry))

/**
 * Formatted data of the entry
 */
const text = computed(() => '```json\n' + JSON.stringify(props.currentEntry, null, 2) + '\n```')

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

/**
 * Copy the raw log entry as json
 */
async function copyRaw() {
	if (await copyToCipboard(JSON.stringify(props.currentEntry))) {
		showSuccess(t('logreader', 'Log entry successfully copied'))
	}
}

/**
 * Copy the log entry formatted to be human readable
 */
async function copyFormatted() {
	if (await copyToCipboard(formatLogEntry(props.currentEntry))) {
		showSuccess(t('logreader', 'Log entry successfully copied'))
	}
}
</script>

<style lang="scss" scoped>
.log-details {
	padding: 12px;

	&__raw, &__exception {
		padding-block-start: 12px;
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
			border-block-end-color: var(--color-border-maxcontrast);
		}
		&--info {
			border-block-end-color: var(--color-element-info, var(--color-info));
		}
		&--warning {
			border-block-end-color: var(--color-element-warning, var(--color-warning));
		}
		&--error, &--fatal {
			border-block-end-color: var(--color-element-error, var(--color-error));
		}
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: end;
		gap: 9px;
		margin-block: 9px;
	}

	hr {
		color: var(--color-border-dark);
	}

	&__raw-text {
		:deep(code.hljs.language-json) {
			// Overriding NcRichText styles with different theme colors
			// Source: 'highlight.js/styles/base16/material-darker.css'
			display: block;
			overflow-x: auto;
			padding: 1em;
			color: #EEFFFF;
			background: #212121;
			border-radius: var(--border-radius-large);

			&::selection,
			& ::selection {
				background-color: #353535;
				color: #EEFFFF;
			}
			.hljs-comment {
				color: #4A4A4A;
			}
			.hljs-tag {
				color: #B2CCD6;
			}
			.hljs-subst,
			.hljs-punctuation,
			.hljs-operator {
				color: #EEFFFF;
			}
			.hljs-operator {
				opacity: 0.7
			}
			.hljs-bullet,
			.hljs-variable,
			.hljs-template-variable,
			.hljs-selector-tag,
			.hljs-name,
			.hljs-deletion {
				color: #F07178;
			}
			.hljs-symbol,
			.hljs-number,
			.hljs-link,
			.hljs-attr,
			.hljs-variable.constant_,
			.hljs-literal {
				color: #F78C6C;
			}
			.hljs-title,
			.hljs-class .hljs-title,
			.hljs-title.class_ {
				color: #FFCB6B;
			}
			.hljs-strong {
				font-weight: bold;
				color: #FFCB6B;
			}
			.hljs-code,
			.hljs-addition,
			.hljs-title.class_.inherited__,
			.hljs-string {
				color: #C3E88D;
			}
			.hljs-built_in,
			.hljs-doctag,
			.hljs-quote,
			.hljs-keyword.hljs-atrule,
			.hljs-regexp {
				color: #89DDFF;
			}
			.hljs-function .hljs-title,
			.hljs-attribute,
			.ruby .hljs-property,
			.hljs-title.function_,
			.hljs-section {
				color: #82AAFF;
			}
			.hljs-type,
			.hljs-template-tag,
			.diff .hljs-meta,
			.hljs-keyword {
				color: #C792EA;
			}
			.hljs-emphasis {
				color: #C792EA;
				font-style: italic;
			}
			.hljs-meta,
			.hljs-meta .hljs-keyword,
			.hljs-meta .hljs-string {
				color: #FF5370;
			}
			.hljs-meta .hljs-keyword,
			.hljs-meta-keyword {
				font-weight: bold;
			}
		}

		// Overriding NcRichText styles to hide 'Copy to clipboard' button
		// Feature is implemented locally.
		:deep(.rich-text__code-block) {
			padding: 0 !important;

			.rich-text__code-block-button {
				display: none;
			}
		}
	}
}

// For mobile we need to show the details as a vertical list
@media only screen and (max-width: 399px) {
	.log-details {
		&__info {
			display: block;
		}
		dd {
			margin-inline-start: 12px;
		}
	}
}
</style>
