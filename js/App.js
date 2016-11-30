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
		loading: false,
		levels: [false, false, false, false, false],
		provider: null,
		relative: true,
		dateFormat: 'Y-m-d\TH:i:sO'
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
	}

	async componentDidMount () {
		const levels = await this.logProvider.getLevels();
		const relative = await this.logProvider.getRelative();
		const dateFormat = await this.logProvider.getDateFormat();
		this.setState({
			levels,
			relative,
			dateFormat,
			provider: this.logProvider
		});
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
		const entries = this.state.entries.filter(entry => {
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

	setRelative = (relative) => {
		this.setState({relative});
		this.saveRelative(relative);
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

		if (entries.length > 0) {
			content = <ReactScrolla
				id="app-content"
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
						dateFormat={this.state.dateFormat}/>
				</div>
			</ReactScrolla>
		} else {
			content = <div className="emptycontent">
				<div className="icon-filetype-text"/>
				<h2>{t('logreader', 'No server logs')}</h2>
				<p>{t('logreader', 'Everything is working fine')}</p>
			</div>
		}

		return (

			<AppContainer appId="logreader">
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
			</AppContainer>
		);
	}
}
