import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async (ctx) => {
	const cfg = await viteConfig(ctx)
	// Not sure why this is required, as the defines are the same vite uses for app builds. -- susnux
	cfg.define = {}
	return cfg
})
