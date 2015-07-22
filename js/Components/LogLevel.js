import {Component} from 'react/addons';

export class LogLevel extends Component {
	static levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	render () {
		var levelText = LogLevel.levels[this.props.level];
		return (
			<span
				className={'loglevel, loglevel_'+this.props.level}>{levelText}</span>
		);
	}
}
