import * as React from "react";
import {Component, MouseEvent} from 'react';

import style from './ToggleEntry.css';

export interface ToggleEntryProps {
	id?: string,
	active: boolean,
	onChange: (active: boolean) => void,
	children: any
}

export class ToggleEntry extends Component<ToggleEntryProps, {}> {
	static idCounter = 0;
	id: string = "";

	getCheckBoxId = () => {
		if (!this.id) {
			this.id = this.props.id || '__checkbox_' + (++ToggleEntry.idCounter);
		}
		return this.id;
	};

	onClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		let active = !this.props.active;
		if (this.props.onChange) {
			this.props.onChange(active);
		}
	};

	render () {
		return (
			<li className={style.toggleEntry}>
				<a onClick={this.onClick}>
					<input id={this.getCheckBoxId()} type="checkbox"
						   checked={this.props.active}
						   className="checkbox"
						   readOnly={true}/>
					<label
						htmlFor={this.getCheckBoxId()}>{this.props.children}</label>
				</a>
			</li>
		);
	}
}
