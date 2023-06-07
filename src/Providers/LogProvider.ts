/// <reference types="@nextcloud/typings" />

import { generateUrl } from '@nextcloud/router'
import { EventEmitter } from 'events'
import axios from '@nextcloud/axios'

declare global {
	interface Window {
		// TODO: Update when router is fixed nextcloud/nextcloud-router#485
		OC: Nextcloud.v16.OC | Nextcloud.v17.OC | Nextcloud.v18.OC | Nextcloud.v19.OC | Nextcloud.v20.OC
	}
}

interface Settings {
	levels: string,
	dateformat: string,
	timezone: string,
	relativedates: boolean,
	live: boolean,
}

export class LogProvider extends EventEmitter {

	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal']
	baseLimit: number
	loading: boolean
	limit: number
	searchQuery: string

	cachedSettings: Settings = null
	fromFile = false
	cachedEntries: Array<any> = []
	hasMore = true
	poll = false
	pollActive = false

	constructor(limit = 50) {
		super()
		this.baseLimit = limit
		this.loading = false
		this.limit = limit
		this.searchQuery = ''
	}

	reset() {
		this.hasMore = true
		this.limit = this.baseLimit
		this.cachedEntries = []
		this.loading = false
	}

	get entries() {
		return this.cachedEntries
	}

	set query(newQuery) {
		if (newQuery !== this.searchQuery) {
			if (newQuery) {
				this.stopPolling()
			}
			this.searchQuery = newQuery
			this.reset()
			this.load().then(async () => {
				// wait with resuming polling until we've re-loaded the list
				if (!newQuery && await this.getLive()) {
					this.startPolling()
				}
			})
		}
	}

	get query() {
		return this.searchQuery
	}

	async load() {
		this.loading = true
		if (this.cachedEntries.length >= this.limit || this.fromFile || !this.hasMore) {
			return
		}
		const newData = await this.loadEntries(this.cachedEntries.length, this.limit - this.cachedEntries.length)
		if (newData.data.length === 0) {
			this.hasMore = false
		}
		this.cachedEntries = this.cachedEntries.concat(newData.data)
		this.loading = false
		this.emit('entries', this.cachedEntries)
	}

	loadEntries(offset: number, count = 50) {
		return this.getSettings().then(({ levels }) => {
			if (this.searchQuery) {
				return axios.get(generateUrl('/apps/logreader/search'), {
					params: {
						offset,
						count,
						query: this.query,
						levels,
					},
				}).then(res => res.data)
			} else {
				return axios.get(generateUrl('/apps/logreader/get'), {
					params: {
						offset,
						count,
						levels,
					},
				}).then(res => res.data)
			}
		})
	}

	async getSettings(): Promise<Settings> {
		if (this.cachedSettings) {
			return this.cachedSettings
		}
		this.cachedSettings = await axios.get(generateUrl('/apps/logreader/settings')).then(resp => resp.data)
		return this.cachedSettings
	}

	async getLevels() {
		const { levels } = await this.getSettings()
		return levels.split('').map(level => Number.parseInt(level) > 0)
	}

	setLevels(levels: Array<number|string>) {
		const levelsString = levels.map(level => level ? 1 : 0).join('')
		if (this.cachedSettings) {
			this.cachedSettings.levels = levelsString
		}
		return fetch(generateUrl('/apps/logreader/levels'), {
			method: 'PUT',
			body: JSON.stringify({ levels: levelsString }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	async getRelative() {
		const { relativedates } = await this.getSettings()
		return relativedates
	}

	async getDateFormat() {
		const { dateformat } = await this.getSettings()
		return dateformat
	}

	async getLive() {
		const { live } = await this.getSettings()
		return live
	}

	setRelative(relative: boolean) {
		return fetch(generateUrl('/apps/logreader/relative'), {
			method: 'PUT',
			body: JSON.stringify({ relative }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	setLive(live: boolean) {
		return fetch(generateUrl('/apps/logreader/live'), {
			method: 'PUT',
			body: JSON.stringify({ live }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	async startPolling() {
		if (this.cachedEntries.length === 0 || this.poll || this.pollActive) {
			return
		}

		this.pollActive = true
		this.poll = true

		while (this.poll) {
			const lastReqId = this.cachedEntries[0].reqId || '0'

			const newData = (await axios.get(generateUrl('/apps/logreader/poll'), {
				params: {
					lastReqId,
				},
			})).data

			if (this.poll) {
				this.cachedEntries = newData.concat(this.cachedEntries)
				this.emit('entries', this.cachedEntries)
			}
		}

		this.pollActive = false
	}

	stopPolling() {
		this.poll = false
	}

}
