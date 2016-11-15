import {Component} from 'react';
import {ToggleEntry} from './ToggleEntry.js';
import {LogProvider} from '../Providers/LogProvider.js';

import style from './LevelSettings.less';

export class LevelSettings extends Component {
	render () {
		return (
			<div className={style.settings + ' popovermenu bubble open menu'}>
				{LogProvider.levels.map((name, level) => {
					return <ToggleEntry key={level} active={this.props.levels[level]}
								 onChange={this.props.setLevel.bind(this, level)}>
						{name}
					</ToggleEntry>
				})}
				<a href={OC.generateUrl('settings/admin/log/download')} className="button">{t('settings', 'Download logs')}</a>
			</div>
		);
	}
}
