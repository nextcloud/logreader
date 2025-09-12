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
			'@nextcloud/vue/no-deprecated-exports': 'off',
			'@nextcloud/vue/no-deprecated-props': 'off',
			'@stylistic/arrow-parens': 'off',
			'@stylistic/function-paren-newline': 'off',
			'@stylistic/implicit-arrow-linebreak': 'off',
			'@stylistic/indent': 'off',
			'@stylistic/indent-binary-ops': 'off',
			'@stylistic/max-statements-per-line': 'off',
			'@stylistic/member-delimiter-style': 'off',
			'@stylistic/object-curly-spacing': 'off',
			'@stylistic/padded-blocks': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'antfu/top-level-function': 'off',
			'curly': 'off',
			'jsdoc/tag-lines': 'off',
			'import-extensions/extensions': 'off',
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-named-exports': 'off',
			'perfectionist/sort-named-imports': 'off',
			'vue/first-attribute-linebreak': 'off',
			'vue/define-macros-order': 'off',
			'vue/no-boolean-default': 'off',
			'vue/no-required-prop-with-default': 'off',
			'vue/no-unused-properties': 'off',
			'vue/padding-line-between-blocks': 'off',
		},
	},
]
