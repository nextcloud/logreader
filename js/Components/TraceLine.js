import {Component} from 'react/addons';

export class TraceLine extends Component {
	render () {
		return (
			<li>
				<span className="file">{this.props.file}</span>
				<span
					className="line">{this.props.lineNumber ? ' - line ' + this.props.lineNumber + ': ' : ''}
				</span>
				<span className="call">{this.props.call}</span>
			</li>
		);
	}
}
