import unserialize from './unserialize';
import style from "./Components/TraceLine.css";
import {formatArgument} from "./Components/TraceLine";

window.unserialize = unserialize;

export class ExceptionParser {
	isException (logMessage) {
		return this.isNewStyleException(logMessage) || this.isOldStyleException(logMessage) || this.isBackgroundJobException(logMessage);
	}

	isNewStyleException (logMessage) {
		return logMessage.Exception;
	}

	isOldStyleException (logMessage) {
		return logMessage.substr && logMessage.substr(0, 12) === 'Exception: {';
	}

	isBackgroundJobException (logMessage) {
		return logMessage.substr && logMessage.substr(0, 34) === 'Error while running background job' && logMessage.indexOf('{"Exception":') !== -1;
	}

	parse (logMessage) {
		if (this.isNewStyleException(logMessage)) {
			return logMessage;
		}
		let data;
		if (this.isOldStyleException(logMessage)) {
			try {
				data = this.tryParseJSON(logMessage.substr(10));
			} catch (e) {
				console.log('Error while parsing exception:');
				console.log(logMessage.substr(10));
				console.error(e);
			}
		} else {
			data = this.tryParseJSON(logMessage.substr(logMessage.indexOf('{"Exception":')));
			const messageHead = logMessage.substr(0, logMessage.indexOf('{"Exception":'));
			const jobDataString = messageHead.split('(', 2)[1];
			const jobDataParts = jobDataString.split(',', 2).map(part => part.trim());
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

	tryParseJSON (json) {
		try {
			return JSON.parse(json);
		} catch (e) {
			// fix unescaped newlines
			json = json.replace(/\n/g, '\\n');
			// fix unescaped namespace delimiters
			json = json.replace(/([^\\])\\([A-Z{])/g, '$1\\\\$2');
			try {
				return JSON.parse(json);
			} catch (e) {
				console.log('Error while parsing exception:');
				console.log(json);
				console.error(e);
			}
		}
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
				'function': call,
				number: number,
				file: file,
				line: lineNumber
			};
		} else {
			return {
				'function': traceData,
				number: number,
				file: false,
				line: false
			};
		}
	}

	format (logMessage) {
		if (!this.isException(logMessage)) {
			return logMessage;
		}
		const parsed = this.parse(logMessage);

		const fileAndLine = (item) => {
			if (item.file && item.line) {
				return `${item.file} line ${item.line}`
			} else {
				return '<<closure>>';
			}
		};

		if (parsed.Exception) {
			const widestIndex = ('' + (parsed.Trace.length - 1)).length;
			let message = `${parsed.Exception}: ${parsed.Message} at ${fileAndLine(parsed)}\n\n`;
			message += parsed.Trace.map(
				(trace, i) => {
					const args = trace.args.map(arg => {
						const baseFormatted = formatArgument(arg, 0).replace(/\n/g, '');;
						const showInline = baseFormatted.length < 42;
						return showInline ? baseFormatted : `${baseFormatted.substr(0, 16)} ... ${baseFormatted.substr(baseFormatted.length - 2, 2)}`;
					});
					return `${' '.repeat(widestIndex - ('' + i).length)}${i}. ${fileAndLine(trace)}\n` +
						`${' '.repeat(widestIndex + 2)}${trace.class}${trace.type}${trace.function}(${args.join(', ')})`;
				}
			).join('\n');
			return message;
		} else {
			return parsed;
		}
	}
}
