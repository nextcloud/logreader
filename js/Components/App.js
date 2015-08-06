import {Component} from 'react/addons';

export class App extends Component {
	render () {
		return (
			<div id="content" role="main" className={"app-" + this.props.appId}>
				{this.props.children}
			</div>
		);
	}
}
