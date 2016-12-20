var config = require('./dev.config');
var port = parseInt(process.env.PORT) || 3000;
var url = require('url');
var host = process.env.HOST || 'localhost';
var targetUrl = process.env.PROXY_URL || 'http://localhost:' + port + '/';
var path = require('path');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('./dev.config');

var app = express();
var compiler = webpack(config);

app.use(devMiddleware(compiler, {
	quiet: true,
	info: false,
	publicPath: config.output.publicPath,
	historyApiFallback: true,
}));

app.use(hotMiddleware(compiler));

app.listen(port, host, function (err) {
	if (err) {
		return console.error(err);
	}
	console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
	console.info('----------');
	console.info('== > 💻  Open ' + targetUrl + '/ in a browser')
});

