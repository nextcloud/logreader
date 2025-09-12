/*
* SPDX-FileCopyrightText: Ferdinand Thiessen <opensource@fthiessen.de>
* SPDX-License-Identifier: AGPL-3.0-or-later
*/

import { translate, translatePlural } from '@nextcloud/l10n'
import {
	type Pinia,

	createPinia,
	PiniaVuePlugin,
} from 'pinia'
import Vue from 'vue'
import App from './App.vue'

Vue.use(PiniaVuePlugin)
Vue.mixin({ methods: { t: translate, n: translatePlural } })
Vue.prototype.t = translate
Vue.prototype.n = translatePlural

const pinia = createPinia()

// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options.d.ts' {
	interface ComponentOptions<V extends Vue> {
		pinia?: Pinia
	}
}

const mainApp = new Vue({
	el: '#logreader-root',
	render: (h) => h(App),
	pinia,
})
