export class ExceptionParser {
	isException (logMessage) {
		return logMessage.substr(0, 12) === 'Exception: {';
	}

	parse (logMessage) {
		let data = JSON.parse(logMessage.substr(10));
		let traceLines = data.Trace.split('\n');
		data.Trace = traceLines.map(this.parseTraceLine);
		return data;
	}

	parseTraceLine (line) {
		let parts = line.split(' ');
		let number = parts.shift();
		let traceData = parts.join(' ');
		parts = traceData.split(':');

		if (parts.length > 1) {
			let file, lineNumber;
			let fileAndLine = parts.shift();
			let call = parts.join(' ');
			if (fileAndLine[0] === '[') {
				lineNumber = false;
				file = fileAndLine;
			} else {
				let filePaths = fileAndLine.split('(', 2);
				file = filePaths[0];
				lineNumber = filePaths[1].substr(0, filePaths[1].length - 1);
			}
			return {
				call: call,
				number: number,
				file: file,
				lineNumber: lineNumber
			};
		} else {
			return {
				call: traceData,
				number: number,
				file: false,
				lineNumber: false
			};
		}
	}
}
