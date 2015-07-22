import {EventEmitter} from 'events';

export class LogProvider extends EventEmitter {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	cachedEntries = [];

	_limit = 0;

	constructor (limit = 25) {
		super();
		this._limit = limit;
	}

	get limit () {
		return this._limit;
	}

	set limit (newLimit) {
		this._limit = newLimit;
		this.load();
	}

	get entries () {
		return cachedEntries;
	}

	async load () {
		if (this.cachedEntries.length >= this.limit) {
			return;
		}
		var newData = await this.loadEntries(this.cachedEntries.length, this.limit - this.cachedEntries.length);
		this.cachedEntries = this.cachedEntries.concat(newData.data);
		this.emit('entries', this.cachedEntries);
	}

	loadEntries (offset, count = 25) {
		return $.get(OC.generateUrl('/settings/admin/log/entries'), {
			offset,
			count
		});
	}
}
