var config = require('./dev.config');
var port = parseInt(process.env.PORT) || 3000;
var url = require('url');
var host = process.env.HOST || 'localhost';
var targetUrl = process.env.PROXY_URL || 'http://localhost:' + port + '/';

var WebpackDevServer = require('webpack-dev-server'),
	webpack = require('webpack'),
	serverOptions = {
		contentBase: config.ocRoot + '/' + config.appId + '/',
		quiet: true,
		noInfo: true,
		hot: true,
		inline: true,
		lazy: false,
		publicPath: config.output.publicPath,
		headers: {"Access-Control-Allow-Origin": "*"},
		stats: {colors: true}
	},
	compiler = webpack(config, function (err, stats) {
		var json = stats.toJson();
		if (json.errors.length)
			console.error(json.errors[0])
	}),
	webpackDevServer = new WebpackDevServer(compiler, serverOptions);

webpackDevServer.listen(port, host, function () {
	console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
	console.info('----------');
	console.info('== > 💻  Open ' + targetUrl + ' in a browser')
});

