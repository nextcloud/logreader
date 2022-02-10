import {Component} from 'react';
import {ToggleEntry} from './ToggleEntry.js';
import {LogProvider} from '../Providers/LogProvider.js';

import style from './LevelSettings.css';
import {LogUploader} from "./LogUploader";
import React from "react";

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
				<LogUploader
					onLogFile={this.props.onLogFile}/>
				<a href={OC.generateUrl('settings/admin/log/download')}
				   className="button">{t('logreader', 'Download logs')}</a>
			</div>
		);
	}
}
