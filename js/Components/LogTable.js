import {Component} from 'react/addons';
import {LogEntry} from './LogEntry.js';
import {LogLevel} from './LogLevel.js';
import Timestamp from 'react-time';

export class LogTable extends Component {
	render () {
		var rows = this.props.entries.map((entry, i) => {
			var time = new Date(entry.time);
			return (
				<tr className={"level_" + entry.level} key={i}>
					<td className="level"><LogLevel level={entry.level}/></td>
					<td className="app">{entry.app}</td>
					<td className="messsage"><LogEntry message={entry.message}/></td>
					<td className="time"><Timestamp value={time} relative/></td>
				</tr>
			)
		});
		return (
			<table className="logs grid">
				<thead>
				<tr>
					<th className="level">Level</th>
					<th className="app">App</th>
					<th className="messsage">Message</th>
					<th className="time">Time</th>
				</tr>
				</thead>
				<tbody>
				{rows}
				</tbody>
			</table>
		);
	}
}
