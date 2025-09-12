<!--
	SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
	SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<NcAppSettingsDialog
		:open="props.open"
		:show-navigation="true"
		:name="t('logreader', 'Log reader settings')"
		@update:open="onUpdateOpen">
		<NcAppSettingsSection id="logreader-settings-levels" :name="t('logreader', 'Filter log levels')">
			<SettingsLogLevels />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-set-level" :name="t('logreader', 'Set log level')">
			<SettingsSetLogLevel />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-time" :name="t('logreader', 'Time format')">
			<SettingsDatetimeFormat />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-live-view" :name="t('logreader', 'Live view')">
			<SettingsLiveView />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-actions" :name="t('logreader', 'Download/Upload logs')">
			<SettingsActions />
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script setup lang="ts">
import { translate as t } from '@nextcloud/l10n'
import NcAppSettingsDialog from '@nextcloud/vue/components/NcAppSettingsDialog'
import NcAppSettingsSection from '@nextcloud/vue/components/NcAppSettingsSection'
import SettingsActions from './SettingsActions.vue'
import SettingsDatetimeFormat from './SettingsDatetimeFormat.vue'
import SettingsLiveView from './SettingsLiveView.vue'
import SettingsLogLevels from './SettingsLogLevels.vue'
import SettingsSetLogLevel from './SettingsSetLogLevel.vue'

const props = defineProps<{
	open: boolean
}>()

const emit = defineEmits<{
	(e: 'update:open', state: boolean): void
}>()

const onUpdateOpen = (open: boolean) => emit('update:open', open)

</script>
