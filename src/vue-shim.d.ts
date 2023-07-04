/*
* SPDX-FileCopyrightText: Ferdinand Thiessen <opensource@fthiessen.de>
* SPDX-License-Identifier: AGPL-3.0-or-later
*/

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@nextcloud/vue/dist/Components/*.js' {
  import Vue from 'vue'
  export default Vue
}

declare module 'json-string-splitter' {
	export default function splitter(input: string): { jsons: string[], remainder: string }
}
