/*
* SPDX-FileCopyrightText: Ferdinand Thiessen <opensource@fthiessen.de>
* SPDX-License-Identifier: AGPL-3.0-or-later
*/

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()

createApp(App)
	.use(pinia)
	.mount('#app-content')
