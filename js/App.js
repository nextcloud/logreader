import {Component} from 'react/addons';

import {LogProvider} from './Providers/LogProvider.js';
import {LogTable} from './Components/LogTable.js';
import {SideBar} from './Components/SideBar.js';

export class App extends Component {
	state = {
		'entries': []
	};

	constructor () {
		super();
		this.logProvider = new LogProvider();
		this.logProvider.on('entries', entries => {
			this.setState({entries});
		});
		this.logProvider.load();
	}

	render () {
		return (
			<div id="content" role="main" className={"app-" + this.props.appId}>
				<SideBar>
					<p>test1</p>

					<p>test2</p>
				</SideBar>

				<div id="app-content">
					<LogTable entries={this.state.entries}/>
				</div>
			</div>
		);
	}
}
