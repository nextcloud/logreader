const path = require('path');
const assetsPath = path.resolve(__dirname, '../build');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	context: path.resolve(__dirname, '..'),
	entry: {
		'main': [
			'react-hot-loader/patch',
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
							modules: true
						}
					},
					'postcss-loader'
				]
			}
		]
	}
};
