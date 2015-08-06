import {Component} from 'react/addons';

import {ExceptionParser} from '../ExceptionParser.js';
import {Exception} from './Exception.js';

export class LogEntry extends Component {
	constructor () {
		super();
		this.exceptionParser = new ExceptionParser();
	}

	render () {
		if (this.isException()) {
			return this.renderException();
		} else {
			return this.renderBasic();
		}
	}

	renderBasic () {
		return (
			<span>{this.props.message}</span>
		);
	}

	renderException () {
		var exceptionData = this.exceptionParser.parse(this.props.message);
		return (
			<Exception {...exceptionData}/>
		);
	}

	isException () {
		return this.exceptionParser.isException(this.props.message);
	}
}
