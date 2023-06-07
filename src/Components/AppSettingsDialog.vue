<!--
    SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <rpm@fthiessen.de>
    SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<NcAppSettingsDialog :open="props.open"
		:show-navigation="true"
		name="Logreader settings"
		@update:open="emit('update:open', true)">
		<NcAppSettingsSection id="logreader-settings-levels" :name="t('logreader', 'Filter log levels')">
			<SettingsLogLevels />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-time" :name="t('logreader', 'Time format')">
			<SettingsDatetimeFormat />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-live-view" :name="t('logreader', 'Live view')">
			<SettingsLiveView />
		</NcAppSettingsSection>
		<NcAppSettingsSection id="logreader-settings-actions" :name="t('logreader', 'Download / Upload logs')">
			<SettingsActions />
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script lang="ts" setup>
import { translate as t } from '@nextcloud/l10n'
import SettingsActions from './settings/SettingsActions.vue'
import SettingsLiveView from './settings/SettingsLiveView.vue'
import SettingsLogLevels from './settings/SettingsLogLevels.vue'
import SettingsDatetimeFormat from './settings/SettingsDatetimeFormat.vue'

import NcAppSettingsDialog from '@nextcloud/vue/dist/Components/NcAppSettingsDialog.js'
import NcAppSettingsSection from '@nextcloud/vue/dist/Components/NcAppSettingsSection.js'

const props = defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
	(e: 'update:open', state: boolean): void
}>()

</script>
