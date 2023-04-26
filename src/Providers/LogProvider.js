import {EventEmitter} from 'events';

const fetch = function (input, init) {
	init = init || {};
	init.headers = init.headers || {};
	init.headers["requesttoken"] = OC.requestToken;
	if (init.params) {
		input += '?' + new URLSearchParams(init.params).toString();
	}
	return window.fetch(input, init);
}

export class LogProvider extends EventEmitter {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	cachedSettings = null;
	fromFile = false;
	cachedEntries = [];
	hasMore = true;
	poll = false;
	pollActive = false;

	constructor (limit = 50) {
		super();
		this.baseLimit = limit;
		this.loading = false;
		this.limit = limit;
		this.searchQuery = '';
	}

	reset () {
		this.hasMore = true;
		this.limit = this.baseLimit;
		this.cachedEntries = [];
		this.loading = false;
	}

	get entries () {
		return this.cachedEntries;
	}

	set query (newQuery) {
		if (newQuery !== this.searchQuery) {
			if (newQuery) {
				this.stopPolling();
			}
			this.searchQuery = newQuery;
			this.reset();
			this.load().then(async () => {
				// wait with resuming polling until we've re-loaded the list
				if (!newQuery && await this.getLive()) {
					this.startPolling();
				}
			});
		}
	}

	get query () {
		return this.searchQuery;
	}

	async load () {
		this.loading = true;
		if (this.cachedEntries.length >= this.limit || this.fromFile || !this.hasMore) {
			return;
		}
		const newData = await this.loadEntries(this.cachedEntries.length, this.limit - this.cachedEntries.length);
		if (newData.data.length === 0) {
			this.hasMore = false;
		}
		this.cachedEntries = this.cachedEntries.concat(newData.data);
		this.loading = false;
		this.emit('entries', this.cachedEntries);
	}

	loadEntries (offset, count = 50) {
		return this.getSettings().then(({levels, logfile}) => {
			if (this.searchQuery) {
				return fetch(OC.generateUrl('/apps/logreader/search'), {
					params: {
						offset,
						count,
						query: this.query,
						levels,
						logfile
					}
				}).then(res => res.json());
			} else {
				return fetch(OC.generateUrl('/apps/logreader/get'), {
					params: {
						offset,
						count,
						levels,
						logfile
					}
				}).then(res => res.json());
			}
		});
	}

	async getSettings () {
		if (this.cachedSettings) {
			return this.cachedSettings;
		}
		let response = await fetch(OC.generateUrl('/apps/logreader/settings'));
		this.cachedSettings = await response.json();
		return this.cachedSettings;
	}

	async getLevels () {
		const {levels} = await this.getSettings();
		return levels.split('').map(level => level > 0);
	}

	setLevels (levels) {
		const levelsString = levels.map(level => level ? 1 : 0).join('');
		if (this.cachedSettings) {
			this.cachedSettings.levels = levelsString;
		}
		return fetch(OC.generateUrl('/apps/logreader/levels'), {
			method: 'PUT',
			body: JSON.stringify({levels: levelsString}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async getRelative () {
		const {relativedates} = await this.getSettings();
		return relativedates;
	}

	async getDateFormat () {
		const {dateformat} = await this.getSettings();
		return dateformat;
	}

	async getLive () {
		const {live} = await this.getSettings();
		return live;
	}

	async getAvailableLogFiles () {
		const {availableLogFiles} = await this.getSettings();
		return availableLogFiles;
	}

	async getLogFile() {
		const {logfile} = await this.getSettings();
		return logfile;
	}

	setRelative (relative) {
		return fetch(OC.generateUrl('/apps/logreader/relative'), {
			method: 'PUT',
			body: JSON.stringify({relative}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	setLive (live) {
		return fetch(OC.generateUrl('/apps/logreader/live'), {
			method: 'PUT',
			body: JSON.stringify({live}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	setLogFile (logFile) {
		if (this.cachedSettings) {
			this.cachedSettings.logfile = logFile;
		}
		return $.ajax({
			type: 'PUT',
			url: OC.generateUrl('/apps/logreader/logFile'),
			data: {logFile}
		});
	}

	async startPolling () {
		if (this.cachedEntries.length === 0 || this.poll || this.pollActive) {
			return;
		}

		this.pollActive = true;
		this.poll = true;

		const { levels, logfile } = await this.getSettings();
		while (this.poll) {
			const lastReqId = this.cachedEntries[0].reqId;

			const newData = await fetch(OC.generateUrl('/apps/logreader/poll'), {
				params: {
					lastReqId,
					levels,
					logfile
				}
			}).then(res => res.json());
			if (this.poll) {
				this.cachedEntries = newData.concat(this.cachedEntries);
				this.emit('entries', this.cachedEntries);
			}
		}

		this.pollActive = false;
	}

	stopPolling () {
		this.poll = false;
	}
}
