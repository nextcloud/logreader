import {Component} from 'react';
import Dropzone from 'react-dropzone';

import style from './LogUploader.css';

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
			display: 'inline-block',
			margin: '5px'
		};

		return (
			<Dropzone multiple={false} accept="text/*" className={"button"} style={dropStyle}
					  onDrop={this.onDrop}>
				{({getRootProps, getInputProps}) => <button {...getRootProps()}>{this.state.message}<input {...getInputProps()}/></button>}
			</Dropzone>
		);
	}
}
