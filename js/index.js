'use strict';

import {App} from './App';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDom from 'react-dom';

// Enable React devtools
window.React = React;


$(document).ready(() => {
	const rootElement = document.getElementById('logreader-root');
	ReactDom.render(
		<AppContainer>
			<App inlineSettings={rootElement.dataset.inlineSettings === 'true'}/>
		</AppContainer>, rootElement);

	if (module.hot) {
		module.hot.accept('./App', () => {
			const {App: NextApp} = require('./App');
			ReactDom.render(
				<AppContainer>
					<NextApp
						inlineSettings={rootElement.dataset.inlineSettings === 'true'}/>
				</AppContainer>,
				rootElement
			);
		});
	}
});
