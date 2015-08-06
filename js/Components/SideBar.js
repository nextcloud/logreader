import {Component} from 'react/addons';

export class SideBar extends Component {

	render () {
		var entries = this.props.children.map((child, i) => {
			return <li key={i}>{child}</li>
		});
		return (
			<ul id="app-navigation">
				{this.props.children}
			</ul>
		);
	}
}

export class Entry extends Component {
	render () {
		return (
			<li>{this.props.children}</li>
		);
	}
}

export class Separator extends Component {
	render () {
		return (
			<li className="app-navigation-separator"/>
		);
	}
}
