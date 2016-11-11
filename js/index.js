'use strict';

import {App} from './App.js';
import React from 'react';
import ReactDom from 'react-dom';

// Enable React devtools
window.React = React;


$(document).ready(() => {
	const rootElement = document.getElementById('logreader-root');
	ReactDom.render(<App inlineSettings={rootElement.dataset.inlineSettings === 'true'}/>, rootElement);
});
