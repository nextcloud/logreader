import {Component} from 'react';

import style from './ToggleChoice.css';

export class ToggleChoice extends Component {
	static idCounter = 0;
	_id = null;

	state = {
		active: false
	};

	constructor (props) {
		super();
		this.state.active = props.active || false;
	}

	getRadioId = ()=> {
		if (!this._id) {
			this._id = this.props.id || '__radio_' + (++ToggleChoice.idCounter);
		}
		return this._id;
	};

	onClick = (e) => {
		e.preventDefault();
		const active = !this.state.active;
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
			<li className={style.toggleChoice}>
				<a className={style['radio-holder']} onClick={this.onClick}>
					<input id={this.getRadioId()} type="radio"
						   checked={this.state.active}
						   name={this.props.name}
						   className="radio"
						   readOnly/>
					<label htmlFor={this.getRadioId()}>{this.props.children}</label>
				</a>
			</li>
		);
	}
}