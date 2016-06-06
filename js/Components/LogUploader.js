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
			padding: '10px 15px',
			cursor: 'pointer',
			opacity: .57
		};
		return (
			<Dropzone multiple={false} accept="text/*" style={dropStyle}
					  onDrop={this.onDrop}>
				{this.state.message}
			</Dropzone>
		);
	}
}
