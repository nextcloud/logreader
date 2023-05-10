'use strict';

import {App} from './App';
import React from 'react';
import {LogProvider} from "./Providers/LogProvider";
import {LogSearch} from "./Search";
import {createRoot} from 'react-dom/client';

// Enable React devtools
window.React = React;

const logProvider = new LogProvider(50);

if (OCA.Search) {
	OCA.Search.logreader = new LogSearch(logProvider);
}

function render (App, rootElement) {
	const root = createRoot(rootElement);
	root.render(<App logProvider={logProvider}/>);
}

function ready(callbackFunction){
	if(document.readyState !== 'loading')
		callbackFunction(event)
	else
		document.addEventListener("DOMContentLoaded", callbackFunction)
}

ready(() => {
	const rootElement = document.getElementById('logreader-root');
	render(App, rootElement);
});
