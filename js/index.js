'use strict';

import {App} from './App.js';
import React from 'react';
import ReactDom from 'react-dom';

// Enable React devtools
window.React = React;

$(document).ready(() => {
	ReactDom.render(<App />, document.getElementById('content-wrapper'));
});
