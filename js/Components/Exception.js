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
		var traceElements;
		if (this.state.expanded) {
			traceElements = this.props.Trace.map((trace, i) => {
				return (
					<TraceLine key={i} {...trace}/>
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
			<span
				className={"exceptionRow " + (this.state.expanded ? 'expanded':'retracted')}
				onClick={this.clickHandler}>
				<span className="exception">{this.props.Exception}</span>:&nbsp;
				<span className="message">{this.props.Message}</span>
				{traceElements}
			</span>
		);
	}
}
