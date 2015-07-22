import React, {Component} from 'react/addons';
import {decorate} from 'react-mixin';
import ReactScrolla from 'react-scrolla';

import {LogProvider} from './Providers/LogProvider.js';
import {LogTable} from './Components/LogTable.js';
import {SideBar} from './Components/SideBar.js';

export class App extends Component {
	state = {
		'entries': [],
		'loading': false
	};

	constructor () {
		super();
		this.logProvider = new LogProvider(25);
		this.logProvider.on('entries', entries => {
			this.setState({entries});
		});
		this.logProvider.load();
	}

	fetchNextPage = async() => {
		this.setState({loading: true});
		this.logProvider.limit += 25;
		await this.logProvider.load();
		this.setState({loading: false});
	};

	render () {
		return (
			<div id="content" role="main" className={"app-" + this.props.appId}>
				<SideBar>
					<p>Dummy 1</p>

					<p>Dummy 2</p>
				</SideBar>

				<ReactScrolla
					id="app-content"
					percentage={85}
					onPercentage={this.fetchNextPage}
					isLoading={this.state.loading}>
					<LogTable entries={this.state.entries}/>
				</ReactScrolla>
			</div>
		);
	}
}
