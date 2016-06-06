import unserialize from './unserialize';

window.unserialize = unserialize;

export class ExceptionParser {
	isException (logMessage) {
		return this.isRegularException(logMessage) || this.isBackgroundJobException(logMessage);
	}

	isRegularException (logMessage) {
		return logMessage.substr(0, 12) === 'Exception: {';
	}

	isBackgroundJobException (logMessage) {
		return logMessage.substr(0, 34) === 'Error while running background job' && logMessage.indexOf('{"Exception":') !== -1;
	}

	parse (logMessage) {
		let data;
		if (this.isRegularException(logMessage)) {
			data = JSON.parse(logMessage.substr(10));
		} else {
			data = JSON.parse(logMessage.substr(logMessage.indexOf('{"Exception":')));
			const messageHead = logMessage.substr(0, logMessage.indexOf('{"Exception":'));
			const jobDataString = messageHead.split('(', 2)[1];
			const jobDataParts = jobDataString.split(',', 2).map(part=>part.trim());
			data.jobClass = jobDataParts[0].split(':', 2)[1].trim();
			data.jobArguments = jobDataParts[1].substr(10).trim();
			window.s = jobDataParts[1].substr(10).trim();
			if (data.jobClass === 'OC\\Command\\CommandJob') {
				try {
					[data.jobClass, data.jobArguments] = this.parseCommandJob(data.jobArguments);
				} catch (e) {
					
				}
			}
		}
		let traceLines = data.Trace.split('\n');
		data.Trace = traceLines.map(this.parseTraceLine);
		return data;
	}

	parseCommandJob (data) {
		const parsed = unserialize(data);
		return [parsed['class'], parsed.properties];
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
