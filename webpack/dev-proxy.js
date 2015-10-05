var httpProxy = require('http-proxy');
var config = require('./dev.config');
var host = 'localhost';
var port = parseInt(process.env.PORT) || 3000;
var url = require('url');

var app = require('express')();


var ocRoot = url.parse(config.ocRoot);
var proxyRoot = ocRoot;
proxyRoot.path = '';

var proxy = httpProxy.createProxyServer({
	target: proxyRoot
});

var webPackProxy = httpProxy.createProxyServer({
	target: 'http://localhost:' + config.webPackPort
});

proxy.on('proxyRes', function (proxyRes, req, res, options) {
	if (proxyRes.headers['content-security-policy']) {
		// allow the webpack sockets and javascript
		var post = 'localhost:' + config.webPackPort + ' ';
		proxyRes.headers['content-security-policy'] = proxyRes.headers['content-security-policy']
			.replace('style-src ', 'style-src blob: ')
			.replace('connect-src ', 'connect-src * blob: ')
			.replace('script-src ', 'script-src blob: ' + post);
	}
});

var pathTest = new RegExp(config.appId + '(/build/.*.js)');
// block the production css
var ignoreTest = new RegExp(config.appId + '(/build/.*.css)');

app.use('/', function (req, res) {
	var path = req.path.substr(ocRoot.pathname.length);
	if (ignoreTest.test(path)) {
		res.end();
		return;
	}
	var matches = path.match(pathTest);
	if (matches) {
		req.url = matches[1];
		webPackProxy.web(req, res);
	} else {
		proxy.web(req, res);
	}
});

app.listen(port, function () {
	console.info('==> 🚧  Webpack proxy server listening on %s:%s', host, port);
	// print this last
	setTimeout(function () {
		console.info('----------\n==> 💻  Open http://localhost:%s%s in a browser.', port, ocRoot.pathname);
	}, 500);
});
