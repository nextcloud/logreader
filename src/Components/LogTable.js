import {Component} from 'react';
import {LogEntry} from './LogEntry.js';
import {LogLevel} from './LogLevel.js';
import MediaQuery from 'react-responsive';
import {convertDateFormat} from '../DateFormatConverter.js'
import {Settings} from './Settings';
import ReactTransitionGroup from 'react-transition-group/TransitionGroup';
import ReactCSSTransition from 'react-transition-group/CSSTransition';
import {copyTextToClipboard} from '../Providers/ClipboardProvider';
import {ExceptionParser} from '../ExceptionParser';
import moment from '@nextcloud/moment';

const exceptionParser = new ExceptionParser();

import style from './LogTable.css';

export class LogTable extends Component {
	state = {
		showLevelSettings: false,
		highlightedRequest: null,
		copyActive: null
	};

	toggleLevelSettings = () => {
		this.setState({showLevelSettings: !this.state.showLevelSettings});
	};

	toggleRelativeTime = () => {
		this.props.setRelative(!this.props.relative);
	};

	highlightRequest (highlightedRequest) {
		this.setState({highlightedRequest});
	};

	formatDate (entry, relative) {
		const time = new Date(entry.time);
		if (relative) {
			return moment(time).fromNow();
		} else {
			return moment(time).format(convertDateFormat(this.props.dateFormat));
		}
	};

	render () {
		const timeClass = style.time + ((this.props.relative) ? (' ' + style.relative) : '');

		let rows = this.props.entries.map((entry, i) => {
			let className = style['level_' + entry.level];
			if (entry.reqId === this.state.highlightedRequest) {
				className += ' ' + style.highlight;
			}

			const copyEntry = (raw) => {
				const text = (raw) ?
					JSON.stringify(entry) :
					`
[${entry.app}] ${LogLevel.levels[entry.level]}: ${exceptionParser.format(entry.exception || entry.message)}\n\n` +
					((entry.method) ? `${entry.method} ${entry.url}\n` : '') +
					((entry.remoteAddr) ? `from ${entry.remoteAddr} ` : '') +
					((entry.user !== '--') ? `by ${entry.user} ` : '') +
					`at ${entry.time}\n`;
				copyTextToClipboard(text.trim());
				this.setState({copyActive: null});
			};

			return (
				<ReactCSSTransition
					key={i}
					classNames="highlight"
					timeout={{ enter: 15000, exit: 1500 }}
				>
				<tr className={className + (this.state.copyActive === entry.id ? ' ' + style.active : '')}
					key={entry.id}
					onClick={this.highlightRequest.bind(this, entry.reqId)}>
					<td className={style.level}><LogLevel level={entry.level}/>
					</td>
					<td className={style.app}>{entry.app}</td>
					<td className={style.message}><LogEntry
						message={entry.message} exception={entry.exception}/></td>
					<td className={style.copy}>
						<button title={t('logreader', 'Copy')}
								className="icon icon-clippy" onClick={() => {
							this.setState({copyActive: this.state.copyActive === entry.id ? null : entry.id})
						}}></button>
						{
							(this.state.copyActive === entry.id) ?
								<div
									className={style.copyMenu + ' popovermenu bubble open menu'}>
									<ul>
										<li>
											<a className="menuitem icon icon-clippy"
											   onClick={() => copyEntry(true)}>
												{t('logreader', 'Copy raw')}
											</a>
										</li>
										<li>
											<a className="menuitem icon icon-clippy"
											   onClick={() => copyEntry(false)}>
												{t('logreader', 'Copy formatted')}
											</a>
										</li>
									</ul>
								</div> :
								[]
						}
					</td>
					<td className={timeClass}
						title={this.formatDate(entry, !this.props.relative)}>{this.formatDate(entry, this.props.relative)}</td>
				</tr>
				</ReactCSSTransition>
			)
		});

		const smallRows = this.props.entries.map((entry, i) => {
			return (
				<div className={style['level_' + entry.level] + ' ' + style.row}
					 key={i}>
					<div className={style.level + ' ' + style.column}><LogLevel
						level={entry.level}/>
					</div>
					<div
						className={style.app + ' ' + style.column}>{entry.app}</div>

					<div
						className={timeClass + ' ' + style.column}>{this.formatDate(entry, this.props.relative)}</div>
					<div className={style.message + ' ' + style.column}>
						<LogEntry
							message={entry.message} exception={entry.exception}/></div>
				</div>
			)
		});

		if (rows.length === 0) {
			rows = <tr className={style.empty}>
				<td colSpan="4">
					<div className="emptycontent">
						<div className="icon-filetype-text"/>
						<h2>{t('logreader', 'No server logs')}</h2>
						<p>{(this.props.hidden > 0) ? t('logreader', 'One or more entries are hidden by the log level filter') : t('logreader', 'Everything is working fine')}</p>
					</div>
				</td>
			</tr>
		}

		const levelHeader = (
			<>{t('logreader', 'Level')}
				<span className={style['log-settings-toggle'] + ' icon-more'}>
				</span>
			</>
		);

		return (
			<>
				<MediaQuery minWidth={750}>
					<table className={style.logs}>
						<thead>
						<tr>
							<th className={style.level + ' ' + (this.state.showLevelSettings ? style.active : '')}
								onClick={this.toggleLevelSettings}>
								{levelHeader}
								{
									this.state.showLevelSettings ?
										<Settings
											setLevel={this.props.setLevel}
											levels={this.props.levels}
											live={this.props.live}
											setLive={this.props.setLive}
											onLogFile={this.props.onLogFile}
										/> :
										<></>
								}
							</th>
							<th className={style.app}>{t('logreader', 'App')}</th>
							<th className={style.message}>{t('logreader', 'Message')}</th>
							<th className={style.copy}></th>
							<th className={timeClass}
								onClick={this.toggleRelativeTime}>
									<span>{t('logreader', 'Time')}
									</span>
							</th>
						</tr>
						</thead>
						<ReactTransitionGroup component="tbody">
							{rows}
						</ReactTransitionGroup>
					</table>
				</MediaQuery>
				<MediaQuery maxWidth={768}>
					<div className={style.smallHeader}>
						<span onClick={this.toggleLevelSettings}>
							{levelHeader}
						</span>
						{
							this.state.showLevelSettings ?
								<Settings
									setLevel={this.props.setLevel}
									levels={this.props.levels}
								/> :
								<div className="hidden"/>
						}
					</div>
					<div className={style.logs}>
						{smallRows}
					</div>
				</MediaQuery>
			</>
		);
	}
}
