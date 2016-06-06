import {LogProvider} from './LogProvider.js'

export class LogFile extends LogProvider {
	constructor (content, limit) {
		super(limit);
		this.content = content;
		this.lines = this.content.split('\n');
	}

	async loadEntries (offset, count = 50) {
		const start = this.lines.length - offset;
		const end = Math.max(start - count - 2, 0);
		const entries = this.lines.slice(end, start).reverse().map(JSON.parse);
		return {data: entries};
	}
}
