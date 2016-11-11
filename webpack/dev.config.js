var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../build');
var host = 'localhost';
var port = parseInt(process.env.PORT) + 1 || 3001;

module.exports = {
	ocRoot: 'http://localhost/owncloud/',
	appId: 'logreader',

	webPackPort: port,
	devtool: 'inline-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': [
			'babel-polyfill',
			'webpack-dev-server/client?http://' + host + ':' + port,
			'webpack/hot/only-dev-server',
			'./js/index.js'
		]
	},
	output: {
		path: assetsPath,
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: 'http://' + host + ':' + port + '/build/'
	},
	module: {
		loaders: [
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				loader: 'url',
				query: {limit: 10240}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['react-hot-loader/webpack', 'babel-loader']
			},
			{test: /\.json$/, loader: 'json-loader'},
			{
				test: /\.css$/,
				loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!'
			},
			{
				test: /\.less$/,
				loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less'
			}
		]
	},
	progress: true,
	resolve: {
		modulesDirectories: [
			'src',
			'node_modules'
		],
		extensions: ['', '.json', '.js']
	},
	plugins: [
		// hot reload
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/\.json$/),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: true,
			__DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
		})
	]
};
