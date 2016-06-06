import {Component} from 'react';

import {ExceptionParser} from '../ExceptionParser';
import {Exception} from './Exception';
import {BackgroundException} from './BackgroundException';

export class LogEntry extends Component {
	constructor () {
		super();
		this.exceptionParser = new ExceptionParser();
	}

	render () {
		if (this.isBackgroundJobException()) {
			return this.renderBackgroundException();
		}else if (this.isException()) {
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

	renderBackgroundException () {
		var exceptionData = this.exceptionParser.parse(this.props.message);
		return (
			<BackgroundException {...exceptionData}/>
		);
	}

	isBackgroundJobException () {
		return this.exceptionParser.isBackgroundJobException(this.props.message);
	}

	isException () {
		return this.exceptionParser.isException(this.props.message);
	}
}
