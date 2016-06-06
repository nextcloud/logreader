import {Component} from 'react';

import style from './TraceLine.less';

export class TraceLine extends Component {
	render () {
		return (
			<li className={style.line}>
				<span className={style.file}>{this.props.file}</span>
				<span
					className={style.line}>{this.props.lineNumber ? ' - line ' + this.props.lineNumber + ': ' : ''}
				</span>
				<span className={style.call}>{this.props.call}</span>
			</li>
		);
	}
}
