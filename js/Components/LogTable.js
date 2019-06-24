import {Component} from 'react';
import {LogEntry} from './LogEntry.js';
import {LogLevel} from './LogLevel.js';
import MediaQuery from 'react-responsive';
import {convertDateFormat} from '../DateFormatConverter.js'
import {Settings} from './Settings';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {copyTextToClipboard} from '../Providers/ClipboardProvider';
import {ExceptionParser} from '../ExceptionParser';

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

	formatDate(entry, relative) {
		const time = new Date(entry.time);
		if (relative) {
			return OC.Util.relativeModifiedDate(time);
		} else {
			return OC.Util.formatDate(time, convertDateFormat(this.props.dateFormat));
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
[${entry.app}] ${LogLevel.levels[entry.level]}: ${exceptionParser.format(entry.message)}\n\n` +
					((entry.method) ? `${entry.method} ${entry.url}\n` : '') +
					((entry.remoteAddr) ? `from ${entry.remoteAddr} ` : '') +
					((entry.user !== '--') ? `by ${entry.user} ` : '') +
						`at ${entry.time}\n`;
				copyTextToClipboard(text.trim());
				this.setState({copyActive: null});
			};

			return (
				<tr className={className + (this.state.copyActive === entry.id ? ' ' + style.active : '')}
					key={entry.id}
					onClick={this.highlightRequest.bind(this, entry.reqId)}>
					<td className={style.level}><LogLevel level={entry.level}/>
					</td>
					<td className={style.app}>{entry.app}</td>
					<td className={style.message}><LogEntry
						message={entry.message}/></td>
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
							message={entry.message}/></div>
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

		const levelSettingsHeader = (
			<span onClick={this.toggleLevelSettings}>
				Level
				<span className={style['log-settings-toggle'] + ' icon-more'}/>
			</span>
		);
		const levelHeader = this.props.inlineSettings ? (levelSettingsHeader) : t('logreader', 'Level');

		return (
			<div>
				<MediaQuery minWidth={750}>
					<table className={style.logs}>
						<thead>
						<tr>
							<th className={style.level + ' ' + (this.state.showLevelSettings ? style.active : '')}>
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
										<div className="hidden"/>
								}
							</th>
							<th className={style.app}>{t('logreader', 'App')}</th>
							<th className={style.message}>{t('logreader', 'Message')}</th>
							<th className={style.copy}></th>
							<th className={timeClass}
								onClick={this.toggleRelativeTime}>{t('logreader', 'Time')}
							</th>
						</tr>
						</thead>
						<ReactCSSTransitionGroup
							transitionName="highlight"
							transitionEnterTimeout={1500}
							transitionLeaveTimeout={1500}
							component="tbody"
						>
							{rows}
						</ReactCSSTransitionGroup>
					</table>
				</MediaQuery>
				<MediaQuery maxWidth={768}>
					<div className={style.smallHeader}>
						{levelHeader}
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
			</div>
		);
	}
}
