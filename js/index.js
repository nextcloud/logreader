'use strict';

import {App} from './App';
import React from 'react';
import ReactDom from 'react-dom';
import {LogProvider} from "./Providers/LogProvider";
import {LogSearch} from "./Search";

// Enable React devtools
window.React = React;

const logProvider = new LogProvider(50);

if (OCA.Search) {
	OCA.Search.logreader = new LogSearch(logProvider);
}

function render (App, rootElement) {
	ReactDom.render(<App logProvider={logProvider}/>, rootElement);
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
