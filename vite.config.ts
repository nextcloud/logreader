/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { UserConfig } from 'vitest/config'

import { createAppConfig } from '@nextcloud/vite-config'

const config = createAppConfig({
	main: 'src/index.ts',
}, {
	// Build the css/logreader-style.css instead of inlineing the styles in the js bundle
	inlineCSS: false,
	assetFileNames: (info) => info.name === 'index.css' ? 'css/logreader-main.css' : undefined,
	// Configuration for vitest unit tests
	config: {
		test: {
			coverage: {
				include: ['src/**'],
				provider: 'istanbul',
				reporter: ['lcov', 'text'],
			},
			environment: 'happy-dom',
		},
	} as UserConfig,
})

export default config
