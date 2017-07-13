import {Component} from 'react';
import {LogEntry} from './LogEntry.js';
import {LogLevel} from './LogLevel.js';
import Timestamp from 'react-time';
import MediaQuery from 'react-responsive';
import {convertDateFormat} from '../DateFormatConverter.js'
import {LevelSettings} from './LevelSettings';
import Moment from 'moment'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import style from './LogTable.less';

export class LogTable extends Component {
	state = {
		showLevelSettings: false,
		highlightedRequest: null
	};

	toggleLevelSettings = () => {
		this.setState({showLevelSettings: !this.state.showLevelSettings});
	};

	toggleRelativeTime = () => {
		this.props.setRelative(!this.props.relative);
	};

	highlightRequest (highlightedRequest) {
		this.setState({highlightedRequest});
	}

	render () {
		const timeClass = style.time + ((this.props.relative) ? (' ' + style.relative) : '');

		const getTimeStamp = (entry) => {
			const time = new Date(entry.time);
			if (this.props.relative) {
				return <Timestamp value={time} relative
								  onClick={this.toggleRelativeTime}/>
			} else {
				return <Timestamp value={time} onClick={this.toggleRelativeTime}
								  format={convertDateFormat(this.props.dateFormat)}/>
			}
		};
		const getTimeTitle = (entry) => {
			const time = new Date(entry.time);
			if (this.props.relative) {
				return Moment(time).format(convertDateFormat(this.props.dateFormat));
			} else {
				return Moment(time).fromNow();
			}
		};

		let rows = this.props.entries.map((entry, i) => {
			let className = style['level_' + entry.level];
			if (entry.reqId === this.state.highlightedRequest) {
				className += ' ' + style.highlight;
			}
			return (
				<tr className={className} key={entry.id}
					onClick={this.highlightRequest.bind(this, entry.reqId)}>
					<td className={style.level}><LogLevel level={entry.level}/>
					</td>
					<td className={style.app}>{entry.app}</td>
					<td className={style.message}><LogEntry
						message={entry.message}/></td>
					<td className={timeClass}
						title={getTimeTitle(entry)}>{getTimeStamp(entry)}</td>
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
						className={timeClass + ' ' + style.column}>{getTimeStamp(entry)}</div>
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
		const levelHeader = this.props.inlineSettings ? (levelSettingsHeader) : "Level";

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
										<LevelSettings
											setLevel={this.props.setLevel}
											levels={this.props.levels}
											live={this.props.live}
											setLive={this.props.setLive}
										/> :
										<div className="hidden"/>
								}
							</th>
							<th className={style.app}>App</th>
							<th className={style.message}>Message</th>
							<th className={timeClass}
								onClick={this.toggleRelativeTime}>Time
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
								<LevelSettings
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
