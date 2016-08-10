import React, {Component} from 'react';
import ReactScrolla from 'react-scrolla';

import {LogProvider} from './Providers/LogProvider.js';
import {LogTable} from './Components/LogTable.js';
import {ToggleEntry} from './Components/ToggleEntry.js';
import {LogUploader} from './Components/LogUploader.js';
import {
	App as AppContainer,
	Entry,
	SideBar,
	Content,
	Separator
} from 'oc-react-components';

import {LogSearch} from './Search.js';
import {LogFile} from './Providers/LogFile.js'

import styles from '../css/app.css';

export class App extends Component {
	state = {
		'entries': [],
		'loading': false,
		'levels': [false, false, false, false, false],
		provider: null
	};

	constructor () {
		super();
		this.logProvider = new LogProvider(50);
		this.logProvider.on('entries', entries => {
			if (this.state.provider === this.logProvider) {
				this.setState({entries});
			}
		});
		OCA.Search.logreader = new LogSearch(this.logProvider);
		this.saveLevels = _.debounce(this.logProvider.setLevels, 100);
	}

	async componentDidMount () {
		const levels = await this.logProvider.getLevels();
		this.setState({levels, provider: this.logProvider});
		this.logProvider.load();
	}

	fetchNextPage = _.throttle(async () => {
		if (this.state.provider.hasMore) {
			this.setState({loading: true});
			this.state.provider.limit += 25;
			await this.state.provider.load();
			this.setState({loading: false});
		}
	}, 100);

	setLevel (level, newState) {
		let levels = this.state.levels;
		levels[level] = newState;
		const entries = this.state.entries.filter(entry=> {
			return this.state.levels[entry.level];
		});
		if (entries.length < 50) {
			this.fetchNextPage();
		}
		this.setState({levels});
		this.saveLevels(levels);
	}

	onLogFile = (content) => {
		const logFile = new LogFile(content);
		logFile.on('entries', entries => {
			if (this.state.provider === logFile) {
				this.setState({entries});
			}
		});
		this.setState({provider: logFile, entries: []});
		logFile.load();
	};

	render () {
		let entries = this.state.entries.filter(entry=> {
			if (!entry.level && entry.level !== 0) {
				return true;
			}
			return this.state.levels[entry.level];
		});

		let filters = this.state.levels.map((status, level)=> {
			return (
				<ToggleEntry key={level} active={status}
							 onChange={this.setLevel.bind(this, level)}>
					{LogProvider.levels[level]}
				</ToggleEntry>
			);
		});

		return (
			<AppContainer appId="logreader">
				<SideBar><LogUploader
						onLogFile={this.onLogFile}/>
					<Separator/>
					{filters}
				</SideBar>

				<ReactScrolla
					id="app-content"
					percentage={85}
					onPercentage={this.fetchNextPage}
					isLoading={this.state.loading}>
					<div className={styles.content}>
						<LogTable entries={entries}/>
					</div>
				</ReactScrolla>
			</AppContainer>
		);
	}
}
