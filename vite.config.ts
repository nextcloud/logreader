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
			alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' }],
		},
	} as UserConfig,
})

export default config
