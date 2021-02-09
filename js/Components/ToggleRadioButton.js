import {Component} from 'react';

import style from './ToggleRadioButton.css';

export class ToggleRadioButton extends Component {
	static idCounter = 0;
	_id = null;

	state = {
		active: false,
		key: '',
	};

	constructor (props) {
		super();
		this.state.active = props.active || false;
		this.state.key = props.key || '';
	}

	getRadioId = ()=> {
		if (!this._id) {
			this._id = this.props.id || '__radio_' + (++ToggleRadioButton.idCounter);
		}
		return this._id;
	};

	onClick = (e) => {
		e.preventDefault();
		let active = !this.state.active;
		this.setState({active});
		if (this.props.onChange) {
			this.props.onChange(active);
		}
	};

	componentWillReceiveProps = (props) => {
		if(props.active != this.state.active) {
			this.setState({active: props.active});
		}
	};

	render () {
		return (
			<li className={style.toggleRadioButton}>
				<a className={style['radio-holder']} onClick={this.onClick}>
					<input id={this.getRadioId()} type="radio"
						   checked={this.state.active}
						   className="radio" />
					<label
						htmlFor={this.getRadioId()}>{this.props.children}</label>
				</a>
			</li>
		);
	}
}
