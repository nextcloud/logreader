import {Component} from 'react';
import {ToggleEntry} from './ToggleEntry';
import {LogProvider} from '../Providers/LogProvider.js';

import style from './LevelSettings.css';
import {LogUploader} from "./LogUploader";
import React from "react";
import {ToggleChoice} from './ToggleChoice.js';

export class Settings extends Component {
	render () {
		return (
			<div className={style.settings + ' popovermenu bubble open menu'}>
				<h4>{t('logreader', 'Log levels')}</h4>
				{LogProvider.levels.map((name, level) => {
					return <ToggleEntry key={level}
										active={this.props.levels[level]}
										onChange={this.props.setLevel.bind(this, level)}>
						{name}
					</ToggleEntry>
				})}
				<h4>{t('logreader', 'Log content')}</h4>
				<ToggleEntry active={this.props.live} onChange={this.props.setLive}>
					{t('logreader', 'Live update')}
				</ToggleEntry>
				<h4>{t('logreader', 'Log files')}</h4>
				{Object.keys(this.props.availableLogFiles).map((logFile) => {
					return <ToggleChoice key={logFile}
										name="logFile"
										active={logFile === this.props.logFile}
										onChange={this.props.setLogFile.bind(this, logFile)}>
						{logFile}
					</ToggleChoice>
				})}
				<LogUploader
					onCustomLogFile={this.props.onCustomLogFile}/>
				<a href={OC.generateUrl('/apps/logreader/download')}
					className="button">{t('logreader', 'Download logs')}</a>
			</div>
		);
	}
}
