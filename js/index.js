'use strict';

import {App} from './App.js';

var React = require('react/addons');

if (process.env.NODE_ENV !== 'production') {
	// Enable React devtools
	window.React = React;
}

$(document).ready(() => {
	React.render(<App />, document.getElementById('content'));
});
