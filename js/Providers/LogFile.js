import {LogProvider} from './LogProvider.js'

export class LogFile extends LogProvider {
	constructor (content, limit) {
		super(limit);

		// newlines that aren't proceeded by a '}' are either invalid or cary no meaning
		content = content.replace(/([^}])\s*([\n\r]+)/g, "$1");

		this.content = content;
		this.lines = this.content.split('\n');
	}

	async loadEntries (offset, count = 50) {
		const start = this.lines.length - offset;
		const end = Math.max(start - count - 2, 0);
		const entries = this.lines.slice(end, start).reverse().map(this.tryParseJSON);
		return {data: entries};
	}

	tryParseJSON (json) {
		try {
			return JSON.parse(json);
		} catch (e) {
			// fix unescaped message json
			const startPos = json.indexOf('"message":"') + ('"message":"').length;
			const endPos = json.lastIndexOf('","level":');
			const start = json.substr(0, startPos);
			const end = json.substr(endPos);
			const message = json.substr(startPos, endPos - startPos);

			const escapedMessage = message.replace(/([^\\]|^)["]/g, '$1\\"');
			json = start + escapedMessage + end;

			try {
				return JSON.parse(json);
			} catch (e) {
				console.log('Error while parsing log message:');
				console.log(json);
				console.error(e);
			}
		}
	}
}
