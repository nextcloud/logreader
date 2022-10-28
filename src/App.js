import React, {Component} from 'react';
import ReactScrolla from 'react-scrolla';

import {LogTable} from './Components/LogTable';

import {LogFile} from './Providers/LogFile'

import styles from './App.css';

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

	constructor (props) {
		super(props);
		this.logProvider = this.props.logProvider;
		this.logProvider.on('entries', entries => {
			if (this.state.provider === this.logProvider) {
				this.setState({entries, loading: false});
			}
		});
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

	async setLevel (level, newState) {
		let levels = this.state.levels;
		levels[level] = newState;
		this.setState({levels, entries: [], loading: true});
		await this.logProvider.setLevels(levels);
		this.state.provider.reset();
		await this.state.provider.load();
		this.setState({loading: false});
	}

	onLogFile = async (content) => {
		this.setState({loading: true});

		const logFile = new LogFile(content);
		logFile.on('entries', entries => {
			if (this.state.provider === logFile) {
				this.setState({entries, loading: false});
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

	getFilteredEntries () {
		return this.state.entries.filter(entry => {
			if (!entry.level && entry.level !== 0) {
				return true;
			}
			return this.state.levels[entry.level];
		});
	}

	render () {
		let entries = this.getFilteredEntries();

		if (this.state.loading && entries.length < 1) {
			return <div className="loading log-loading"/>
		} else {
			return <ReactScrolla
				className={styles.scrollContainer + ' ' + styles.content}
				percentage={85}
				onPercentage={this.fetchNextPage}
				isLoading={this.state.loading}>
				<LogTable
					levels={this.state.levels}
					setRelative={this.setRelative}
					setLevel={this.setLevel.bind(this)}
					entries={entries}
					relative={this.state.relative}
					dateFormat={this.state.dateFormat}
					hidden={this.state.entries.length - entries.length}
					live={this.state.live}
					setLive={this.setLive.bind(this)}
					onLogFile={this.onLogFile}
				/>
			</ReactScrolla>
		}
	}
}
