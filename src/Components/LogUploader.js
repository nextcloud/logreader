import {Component} from 'react';

import style from './LogUploader.css';

export class LogUploader extends Component {
	state = {
		message: t('logreader', 'Load log file')
	};

	isLog (content) {
		return (content[0] === '{' && content[content.length - 1] === '}') ||
			content.substring(content.length - 2) === '}"'; // csv wrapped
	}

	onDrop = (files) => {
		const file = files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target.result.trim();
			if (!this.isLog(content)) {
				this.setState({message: t('logreader', 'Invalid log file')});
				return;
			}
			this.props.onLogFile(content);
		};
		reader.readAsText(file);
	};

	render () {
		return (
			<input type="file" multiple={false} onChange={e => {
				this.onDrop(e.target.files);
			}}/>
		);
	}
}
