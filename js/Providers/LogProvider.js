import {EventEmitter} from 'events';

export class LogProvider extends EventEmitter {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	cachedEntries = [];

	_limit = 0;

	constructor (limit = 50) {
		super();
		this.loading = false;
		this.limit = limit;
	}

	get entries () {
		return cachedEntries;
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
		return $.get(OC.generateUrl('/settings/admin/log/entries'), {
			offset,
			count
		});
	}
}
