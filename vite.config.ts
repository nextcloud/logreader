import { createAppConfig } from '@susnux/nextcloud-vite-config'

const config = createAppConfig({
	main: 'src/index.ts',
}, {
	// Build the css/logreader-style.css instead of inlineing the styles in the js bundle
	inlineCSS: false,
})

export default config
