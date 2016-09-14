import {EventEmitter} from 'events';

export class LogProvider extends EventEmitter {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	cachedSettings = null;
	fromFile = false;
	cachedEntries = [];
	hasMore = true;

	constructor (limit = 50) {
		super();
		this.baseLimit = limit;
		this.loading = false;
		this.limit = limit;
		this.searchQuery = '';
	}

	reset () {
		this.limit = this.baseLimit;
		this.cachedEntries = [];
		this.loading = false;
	}

	get entries () {
		return cachedEntries;
	}

	set query (newQuery) {
		if (newQuery !== this.searchQuery) {
			this.searchQuery = newQuery;
			this.reset();
			this.load();
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
		var newData = await this.loadEntries(this.cachedEntries.length, this.limit - this.cachedEntries.length);
		if (newData.data.length === 0) {
			this.hasMore = false;
		}
		this.cachedEntries = this.cachedEntries.concat(newData.data);
		this.loading = false;
		this.emit('entries', this.cachedEntries);
	}

	loadEntries (offset, count = 50) {
		if (this.searchQuery) {
			return $.get(OC.generateUrl('/apps/logreader/search'), {
				offset,
				count,
				query: this.query
			});
		} else {
			return $.get(OC.generateUrl('/apps/logreader/get'), {
				offset,
				count
			});
		}
	}

	async getSettings () {
		if (this.cachedSettings) {
			return this.cachedSettings;
		}
		this.cachedSettings = await $.get(OC.generateUrl('/apps/logreader/settings'));
		return this.cachedSettings;
	}

	async getLevels () {
		const {levels} = await this.getSettings();
		return levels.split('').map(level => level > 0);
	}

	setLevels (levels) {
		const levelsString = levels.map(level => level ? 1 : 0).join('');
		return $.ajax({
			type: 'PUT',
			url: OC.generateUrl('/apps/logreader/levels'),
			data: {levels: levelsString}
		});
	}

	async getRelative () {
		const {relativedates} = await this.getSettings();
		return relativedates;
	}

	async getDateFormat(){
		const {dateformat} = await this.getSettings();
		return dateformat;
	}

	setRelative (relative) {
		return $.ajax({
			type: 'PUT',
			url: OC.generateUrl('/apps/logreader/relative'),
			data: {relative}
		});
	}
}
