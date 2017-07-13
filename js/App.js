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
	Separator,
	Settings
} from 'oc-react-components';

import {LogSearch} from './Search.js';
import {LogFile} from './Providers/LogFile.js'

import styles from '../css/app.css';

export class App extends Component {
	state = {
		entries: [],
		loading: true,
		levels: [false, false, false, false, false],
		provider: null,
		relative: true,
		dateFormat: 'Y-m-d\TH:i:sO',
		live: false
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
		this.saveRelative = _.debounce(this.logProvider.setRelative, 100);
		this.saveLive = _.debounce(this.logProvider.setLive, 100);
	}

	async componentDidMount () {
		const levels = await this.logProvider.getLevels();
		const relative = await this.logProvider.getRelative();
		const dateFormat = await this.logProvider.getDateFormat();
		const live = await this.logProvider.getLive();
		this.setState({
			levels,
			relative,
			dateFormat,
			live,
			provider: this.logProvider
		});
		await this.logProvider.load();
		if (live) {
			this.logProvider.startPolling();
		}
		this.setState({loading: false});
		document.addEventListener('paste', this.handlePaste)
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
		const entries = this.state.entries.filter(entry => {
			return this.state.levels[entry.level];
		});
		if (entries.length < 50) {
			this.fetchNextPage();
		}
		this.setState({levels});
		this.saveLevels(levels);
	}

	onLogFile = async (content) => {
		const logFile = new LogFile(content);
		logFile.on('entries', entries => {
			if (this.state.provider === logFile) {
				this.setState({entries});
			}
		});
		try {
			await logFile.loadEntries(0);
			this.setState({provider: logFile, entries: []});
			logFile.load();
		} catch (e) {
			OC.Notification.show(t('logreader', 'Error parsing log'));
		}
	};

	setRelative = (relative) => {
		this.setState({relative});
		this.saveRelative(relative);
	};

	setLive = (live) => {
		this.setState({live});
		if (live) {
			this.logProvider.startPolling();
		} else {
			this.logProvider.stopPolling();
		}
		this.saveLive(live);
	};

	handlePaste = (event) => {
		let data = event.clipboardData.getData('Text');
		if (!data) {
			data = event.clipboardData.getData('text/plain');
		}
		data = data.trim();
		if (data.indexOf('{') !== -1 && data.indexOf('}')) {
			this.onLogFile(data);
		}
	};

	render () {
		let entries = this.state.entries.filter(entry => {
			if (!entry.level && entry.level !== 0) {
				return true;
			}
			return this.state.levels[entry.level];
		});

		let filters = this.state.levels.map((status, level) => {
			return (
				<ToggleEntry key={level} active={status}
							 onChange={this.setLevel.bind(this, level)}>
					{LogProvider.levels[level]}
				</ToggleEntry>
			);
		});

		let content;

		if (this.state.loading && entries.length < 1) {
			content = <div className="loading log-loading"/>
		} else {
			content = <ReactScrolla
				className={styles.scrollContainer}
				percentage={85}
				onPercentage={this.fetchNextPage}
				isLoading={this.state.loading}>
				<div className={styles.content}>
					<LogTable
						inlineSettings={this.props.inlineSettings}
						levels={this.state.levels}
						setRelative={this.setRelative}
						setLevel={this.setLevel.bind(this)}
						entries={entries}
						relative={this.state.relative}
						dateFormat={this.state.dateFormat}
						hidden={this.state.entries.length - entries.length}
						live={this.state.live}
						setLive={this.setLive.bind(this)}
					/>
				</div>
			</ReactScrolla>
		}

		return (

			<div>
				{!this.props.inlineSettings ?
					<SideBar><LogUploader
						onLogFile={this.onLogFile}/>
						<Separator/>
						{filters}
						<Settings>
							<ToggleEntry key='relative'
										 active={this.state.relative}
										 onChange={this.setRelative}>
								Relative Dates
							</ToggleEntry>
						</Settings>
					</SideBar>
					: <div/>}

				{content}
			</div>
		);
	}
}
