import {Component} from 'react';
import {TraceLine} from './TraceLine.js';

import style from './Exception.css';

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
		const expanded = this.state.expanded || this.props.expanded;
		return (
			<span
				className={[style.exceptionRow, (this.props.isPrevious ? style.previous : 'icon-caret-dark')].join(' ')}
				onClick={this.clickHandler}>
				<span className={style.exception}>
					{this.props.isPrevious ? t('logreader', 'Cased by ') : ''}
					{this.props.Exception}
				</span>:&nbsp;
				<span className={style.message}>{this.props.Message}</span>
				<StackTrace trace={this.props.Trace}
							expanded={expanded}/>
				{expanded && this.props.Previous ? [
					<Exception expanded={true} {...this.props.Previous}
							   isPrevious={true}/>
				] : []}
			</span>
		);
	}
}

function StackTrace ({trace, expanded}) {
	if (expanded) {
		return (
			<ol className={style.trace} start="0">
				{trace.map((trace, i) => {
					return (
						<TraceLine key={i} {...trace}/>
					);
				})}
			</ol>
		)
	} else {
		return [];
	}
}
