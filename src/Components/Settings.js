import {Component} from 'react';
import {ToggleEntry} from './ToggleEntry';
import {LogProvider} from '../Providers/LogProvider.js';

import style from './LevelSettings.css';
import {LogUploader} from "./LogUploader";
import React from "react";

export function Settings(props) {
	return (
		<div className={style.settings + ' popovermenu bubble open menu ' + props.class}>
			<h4>{t('logreader', 'Log levels')}</h4>
			{LogProvider.levels.map((name, level) => {
				return <ToggleEntry key={level}
									active={props.levels[level]}
									onChange={props.setLevel.bind(this, level)}>
					{name}
				</ToggleEntry>
			})}
			<h4>{t('logreader', 'Log content')}</h4>
			<ToggleEntry active={props.live} onChange={props.setLive}>
				{t('logreader', 'Live update')}
			</ToggleEntry>
			<LogUploader
				onLogFile={props.onLogFile}/>
			<a href={OC.generateUrl('settings/admin/log/download')}
			   className="button">{t('logreader', 'Download logs')}</a>
		</div>
	);
}
