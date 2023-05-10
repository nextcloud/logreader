import splitter from "json-string-splitter";

export function parseLog(raw: string): any[] {
	try {
		const lines = raw.split('\n');
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
