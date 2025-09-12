/*
* SPDX-FileCopyrightText: Ferdinand Thiessen <opensource@fthiessen.de>
* SPDX-License-Identifier: AGPL-3.0-or-later
*/

declare module 'vue-material-design-icons/*.vue' {
	import type { DefineComponent } from 'vue'

	const IconVue: DefineComponent<{
		/** @default 24 */
		size?: number
		/** @default 'currentColor' */
		fillColor?: string
		title?: string
	}>

	export default IconVue
}

declare module '@nextcloud/vue/dist/Components/*.js' {
	import Vue from 'vue'
	export default Vue
}

declare module 'json-string-splitter' {
	function splitter(input: string): { jsons: string[], remainder: string }
	export = splitter
}
