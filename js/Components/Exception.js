import {Component} from 'react/addons';
import {TraceLine} from './TraceLine.js';

export class Exception extends Component {
	state = {
		expanded: false
	};

	clickHandler = () => {
		this.setState({
			expanded: !this.state.expanded
		});
	};

	render () {
		var trace = this.props.Trace.split('\n');
		var traceElements;
		if (this.state.expanded) {
			traceElements = trace.map(line => {
				return (
					<TraceLine line={line}/>
				);
			});
			traceElements = (
				<ol className="trace" start="0">
					{traceElements}
				</ol>
			)
		} else {
			traceElements = [];
		}
		return (
			<span className="exceptionRow" onClick={this.clickHandler}>
				<span className="exception">{this.props.Exception}</span>:&nbsp;
				<span className="message">{this.props.Message}</span>
				&nbsp;{this.state.expanded ? '▲' : '▼'}
				{traceElements}
			</span>
		);
	}
}
