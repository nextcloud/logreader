import {Component} from 'react/addons';

export class TraceLine extends Component {
	render () {
		var parts = this.props.line.split(' ');
		var number = parts.shift();
		var line = parts.join(' ');
		parts = line.split(':');

		console.log(line);
		if (parts.length > 1) {
			var fileAndLine = parts.shift();
			line = parts.join(' ');
			if (fileAndLine[0] === '[') {
				lineNumber = false;
				file = fileAndLine;
			} else {
				var [file, lineNumber]=fileAndLine.split('(', 2);
				lineNumber = lineNumber.substr(0, lineNumber.length - 1);
			}
		} else {
			file = false;
		}

		return (
			<li>
				<span className="file">{file}</span>
				<span
					className="line">{lineNumber ? ' - line ' + lineNumber + ': ' : ''}
				</span>
				<span className="call">{line}</span>
			</li>
		);
	}
}
