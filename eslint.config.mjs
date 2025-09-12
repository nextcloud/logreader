/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { recommendedVue2 } from '@nextcloud/eslint-config'

export default [
	...recommendedVue2,
	{
		name: 'logreader/disabled-during-migration',
		rules: {
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'import-extensions/extensions': 'off',
			'vue/no-boolean-default': 'off',
			'vue/no-required-prop-with-default': 'off',
			'vue/no-unused-properties': 'off',
		},
	},
]
