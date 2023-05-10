import {LogProvider} from './LogProvider.js'
import {parseLog} from "../LogParser";

export class LogFile extends LogProvider {
	private readonly logEntries;

	constructor (content: string, limit: number) {
		super(limit);

		let id = 1;

		this.logEntries = parseLog(content).map(entry => {
			if (!entry.id) {
				entry.id = id;
				id++;
			}
			return entry;
		}).reverse();
	}

	async loadEntries (offset: number, count: number = 50) {
		const start = this.logEntries.length - offset;
		const end = Math.max(start - count - 2, 0);
		const entries = this.logEntries.slice(end, start);
		return {data: entries};
	}
}
