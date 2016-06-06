import {Component} from 'react';
import Dropzone from 'react-dropzone';

import style from './LogUploader.less';

export class LogUploader extends Component {
	state = {
		message: 'Load log file...'
	};

	isLog (content) {
		return content[0] === '{' && content[content.length - 1] === '}';
	}

	onDrop = (files) => {
		const file = files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target.result.trim();
			if (!this.isLog(content)) {
				this.setState({message: 'Invalid log file'});
				return;
			}
			this.props.onLogFile(content);
		};
		reader.readAsText(file);
	};

	render () {
		const dropStyle = {
			margin: '0 -12px',
			padding: '0 12px'
		};
		return (
			<Dropzone style={dropStyle} onDrop={this.onDrop}>
				{this.state.message}
			</Dropzone>
		);
	}
}
