import {EventEmitter} from 'events';

export class LogProvider extends EventEmitter {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	cachedEntries = [];

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
		console.log(newQuery);
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
		if (this.cachedEntries.length >= this.limit) {
			console.log('got ' + this.cachedEntries.length + 'entries');
			return;
		}
		var newData = await this.loadEntries(this.cachedEntries.length, this.limit - this.cachedEntries.length);
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
}
