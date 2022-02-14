import {Component} from 'react';
import {TraceLine} from './TraceLine.js';

import style from './Exception.css';

export class BackgroundException extends Component {
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
		let jobArguments;
		if (this.state.expanded) {
			traceElements = this.props.Trace.map((trace, i) => {
				return (
					<TraceLine key={i} {...trace}/>
				);
			});
			if (this.props.jobArguments.substr) {
				jobArguments = this.props.jobArguments;
			} else {
				jobArguments = '{\n' + Object.keys(this.props.jobArguments).map(key => {
						return `\t${key}: ${JSON.stringify(this.props.jobArguments[key])}`;
					}).join(',\n') + '\n}';
			}
			traceElements = (
				<span>
					<pre>
						<span
							className={style.exception}>{this.props.jobClass}</span> {jobArguments}
					</pre>
					<ol className={style.trace} start="0">
						{traceElements}
					</ol>
				</span>
			)
		} else {
			traceElements = [];
		}
		return (
			<span
				className={style.exceptionRow + ' ' + (this.state.expanded ? style.expanded:style.retracted)}
				onClick={this.clickHandler}>
				Error while running background job&nbsp;
				<span
					className={style.exception}>({this.props.Exception})</span>:
				<span className={style.messsage}> {this.props.Message}</span>
				{traceElements}
			</span>
		);
	}
}
