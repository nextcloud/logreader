'use strict';

import {App} from './App';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';
import {LogProvider} from "./Providers/LogProvider";
import {LogSearch} from "./Search";

// Enable React devtools
window.React = React;

const logProvider = new LogProvider(50);
OCA.Search.logreader = new LogSearch(logProvider);

function render (App, rootElement) {
	ReactDom.render(
		<AppContainer>
			<App
				logProvider={logProvider}
				inlineSettings={rootElement.dataset.inlineSettings === 'true'}/>
		</AppContainer>, rootElement);
}

$(document).ready(() => {
	const rootElement = document.getElementById('logreader-root');
	render(App, rootElement);

	if (module.hot) {
		module.hot.accept('./App', () => {
			const {App: NextApp} = require('./App');
			render(NextApp, rootElement);
		});
	}
});
