import {Component} from 'react';

import style from './TraceLine.css';

export class TraceLine extends Component {
	render () {
		return (
			<li className={style.line}>
				<p>
					<span className={style.file}>{this.props.file}</span>
					<span className={style.line}>
						{this.props.line ? ' - line ' + this.props.line + ': ' : ''}
					</span>
				</p>
				<p className={style.call}>
					{this.props.class}{this.props.type}{this.props.function}({
					this.props.args
						.map((arg, i) => [
							<Argument key={i} data={arg}/>,
							(i < this.props.args.length - 1) ? ', ' : ''
						])
				})
				</p>
			</li>
		);
	}
}

export class Argument extends Component {
	state = {
		show: false
	};

	toggle = () => {
		this.setState({
			show: !this.state.show,
		});
	};

	render () {
		const baseFormatted = JSON.stringify(this.props.data);
		const fancyFormatted = JSON.stringify(this.props.data, null, 4);
		const showInline = baseFormatted.length < 32;

		return (
			<span className={style.argument}
				  title={showInline ? null : fancyFormatted}>
				{showInline ? baseFormatted : `${baseFormatted.substr(0, 12)} ... ${baseFormatted.substr(baseFormatted.length - 2, 2)}`}
			</span>
		)
	}
}