import {Component} from 'react';

export class LogLevel extends Component {
	static levels = [t('logreader', 'Debug'), t('logreader', 'Info'), t('logreader', 'Warning'), t('logreader', 'Error'), t('logreader', 'Fatal')];

	render () {
		var levelText = LogLevel.levels[this.props.level];
		return (
			<span
				className={'loglevel, loglevel_'+this.props.level}>{levelText}</span>
		);
	}
}
