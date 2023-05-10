import splitter from "json-string-splitter";

export function parseLog(raw: string): any[] {
	try {
		const lines = raw.split('\n')
			.filter(line => !line.startsWith("@")); // csv headers
		return lines.map(tryParseJSON).map(fixUpLogJson);
	} catch (e) {
		console.log("falling back to json splitter")
		// the input might have had its data reformatted, breaking the original newline separated json
		const lines = splitter(raw).jsons;
		return lines.map(tryParseJSON).map(fixUpLogJson);
	}
}

function tryParseJSON(json: string): any {
	try {
		return JSON.parse(json);
	} catch (e) {
		if (json.startsWith('"') && json.endsWith('"')) {
			try {
				let inner = json.substring(1, json.length - 1);

				// csv escaped quotes
				if (inner.startsWith('{""')) {
					inner = inner.replace(/""/g, '"');
				}
				return JSON.parse(inner);
			} catch (e) {
				console.log(e);
			}
		}
		// fix unescaped message json
		const startPos = json.indexOf('"message":"') + ('"message":"').length;
		const endPos = json.lastIndexOf('","level":');
		const start = json.substring(0, startPos);
		const end = json.substring(endPos);
		const message = json.substring(startPos, endPos - startPos);

		const escapedMessage = message.replace(/([^\\]|^)["]/g, '$1\\"');
		json = start + escapedMessage + end;

		try {
			return JSON.parse(json);
		} catch (e) {
			console.error('Error while parsing log message:');
			throw e;
			// console.log(json);
			// console.error(e);
		}
	}
}

/**
 * attempt to fixup some mangling done by log aggregators to our json
 * to increase the number of times we can just copy-paste logs directly from users.
 */
function fixUpLogJson(message: any): any {
	if (message.content?.message && message.content?.attributes && message.id && !message.reqId) {
		return {
			message: message.content.message,
			...message.content.attributes
		}
	}

	return message;
}
