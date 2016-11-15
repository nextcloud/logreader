import {Component} from 'react';
import {TraceLine} from './TraceLine.js';

import style from './Exception.less';

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
				<ol className={style.trace} start="0">
					{traceElements}
				</ol>
			)
		} else {
			traceElements = [];
		}
		return (
			<span
				className={style.exceptionRow + ' icon-caret-dark'}
				onClick={this.clickHandler}>
				<span className={style.exception}>{this.props.Exception}</span>:&nbsp;
				<span className={style.messsage}>{this.props.Message}</span>
				{traceElements}
			</span>
		);
	}
}
