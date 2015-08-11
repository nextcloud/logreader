import {Component} from 'react/addons';
import {LogEntry} from './LogEntry.js';
import {LogLevel} from './LogLevel.js';
import Timestamp from 'react-time';

import style from './LogTable.less';

export class LogTable extends Component {
	render () {
		var rows = this.props.entries.map((entry, i) => {
			var time = new Date(entry.time);
			return (
				<tr className={style['level_' + entry.level]} key={i}>
					<td className={style.level}><LogLevel level={entry.level}/></td>
					<td className={style.app}>{entry.app}</td>
					<td className={style.message}><LogEntry message={entry.message}/></td>
					<td className={style.time}><Timestamp value={time} relative/></td>
				</tr>
			)
		});
		return (
			<table className={style.logs}>
				<thead>
				<tr>
					<th className={style.level}>Level</th>
					<th className={style.app}>App</th>
					<th className={style.message}>Message</th>
					<th className={style.time}>Time</th>
				</tr>
				</thead>
				<tbody>
				{rows}
				</tbody>
			</table>
		);
	}
}
