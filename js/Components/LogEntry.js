import {Component} from 'react/addons';

import {Exception} from './Exception.js';

export class LogEntry extends Component {
	render () {
		if (this.isException()) {
			return this.renderExcetion();
		} else {
			return this.renderBasic();
		}
	}

	renderBasic () {
		return (
			<span>{this.props.message}</span>
		);
	}

	renderExcetion () {
		var exceptionData = JSON.parse(this.props.message.substr(10));
		return (
			<Exception {...exceptionData}/>
		);
	}

	isException () {
		return this.props.message.substr(0, 12) === 'Exception: {';
	}
}
