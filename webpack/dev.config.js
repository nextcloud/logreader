var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../build');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client',
			'babel-polyfill',
			'./js/index.js'
		]
	},
	output: {
		path: assetsPath,
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/build/'
	},
	module: {
		rules: [
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				loader: 'url-loader',
				options: {
					limit: 10240
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localIdentName: '[path][name]__[local]'
						}
					},
					'postcss-loader'
				]
			}
		]
	},
	plugins: [
		// hot reload
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/\.json$/),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: true,
			__DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
		})
	]
};
