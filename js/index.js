'use strict';

import {App} from './App.js';

var React = require('react/addons');

// Enable React devtools
window.React = React;

$(document).ready(() => {
	React.render(<App />, document.getElementById('content-wrapper'));
});
