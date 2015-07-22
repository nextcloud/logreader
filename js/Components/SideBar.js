import {Component} from 'react/addons';

export class SideBar extends Component {

	render () {
		var entries = this.props.children.map((child, i) => {
			return <li key={i}>{child}</li>
		});
		return (
			<div id="app-navigation">
				<ul>
					{entries}
				</ul>
			</div>
		);
	}
}
