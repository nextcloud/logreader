import {Component} from 'react';

import style from './TraceLine.css';

export class TraceLine extends Component {
	render () {
		return (
			<li className={style.line}>
				<p>
					<span className={style.file}>{this.props.file || '<<closure>>'}</span>
					<span className={style.line}>
						{this.props.line ? ' - line ' + this.props.line + ': ' : ''}
					</span>
				</p>
				<p className={style.call}>
					{this.props.class}{this.props.type}{this.props.function}({
					this.props.args ?
						this.props.args
							.map((arg, i) => [
								<Argument key={i} data={arg}/>,
								(i < this.props.args.length - 1) ? ', ' : ''
							]) :
						[]
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
		const baseFormatted = formatArgument(this.props.data);
		const fancyFormatted = formatArgument(this.props.data, 4);
		const showInline = baseFormatted.length < 32;

		return (
			<span className={style.argument}
				  title={showInline ? null : fancyFormatted}>
				{showInline ? baseFormatted : `${baseFormatted.substr(0, 12)} ... ${baseFormatted.substr(baseFormatted.length - 2, 2)}`}
			</span>
		)
	}
}

export function formatArgument (data, whitespace, depth = 0) {
	const leadingSpace = ' '.repeat(whitespace * depth);
	if (data && data.__class__) {
		const {'__class__': className, ...copy} = data;
		return `${leadingSpace}${className} ${formatArgument(copy, whitespace, depth).trim()}`;
	} else if (Array.isArray(data)) {
		if (data.length === 0) {
			return `${leadingSpace}[]`;
		}
		return `${leadingSpace}[\n${
			data.map(value =>
				formatArgument(value, whitespace, depth + 1)
			).join(whitespace ? ',\n' : ',')
			}${whitespace ? '\n' : ''}${leadingSpace}]`;
	} else if (data !== null && typeof data === 'object') {
		if (Object.keys(data).length === 0) {
			return `${leadingSpace}{}`;
		}
		const keyWhitespace = ' '.repeat(whitespace * (depth + 1));
		return `${leadingSpace}{\n${
			Object.keys(data).map((key) =>
				`${keyWhitespace}${key}: ${formatArgument(data[key], whitespace, depth + 1).trim()}`
			).join(whitespace ? ',\n' : ',')
			}${whitespace ? '\n' : ''}${leadingSpace}}`;
	} else {
		return leadingSpace + JSON.stringify(data, null, whitespace);
	}
}
