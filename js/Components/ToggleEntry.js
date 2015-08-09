import {Component} from 'react/addons';

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

	get id () {
		if (!this._id) {
			this._id = this.props.id || '__checkbox_' + (++ToggleEntry.idCounter);
		}
		return this._id;
	}

	onChange = (event)=> {

	};

	onClick = () => {
		let active = !this.state.active;
		this.setState({active});
		if (this.props.onChange) {
			this.props.onChange(active);
		}
	};

	render () {
		return (
			<li>
				<a className="checkbox-holder" onClick={this.onClick}>
					<input id={this.id} type="checkbox"
						   checked={this.state.active}
						   readOnly/>
					<label htmlFor={this.id}>{this.props.children}</label>
				</a>
			</li>
		);
	}
}
