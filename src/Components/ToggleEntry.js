import {Component} from 'react';

import style from './ToggleEntry.css';

export class ToggleEntry extends Component {
	static idCounter = 0;
	_id = null;

	state = {
		active: false
	};

	constructor (props) {
		super();
		this.state.active = props.active || false;
	}

	getCheckBoxId = ()=> {
		if (!this._id) {
			this._id = this.props.id || '__checkbox_' + (++ToggleEntry.idCounter);
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
			<li className={style.toggleEntry}>
				<a className={style['checkbox-holder']} onClick={this.onClick}>
					<input id={this.getCheckBoxId()} type="checkbox"
						   checked={this.state.active}
						   className="checkbox"
						   readOnly/>
					<label
						htmlFor={this.getCheckBoxId()}>{this.props.children}</label>
				</a>
			</li>
		);
	}
}
