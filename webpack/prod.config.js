// Webpack config for creating the production bundle.

const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const strip = require('strip-loader');

const relativeAssetsPath = '../build';
const assetsPath = path.join(__dirname, relativeAssetsPath);

module.exports = {
	devtool: 'source-map',
	mode: 'production',
	context: path.resolve(__dirname, '..'),
	entry: [
		'./js/index.js'
	],
	output: {
		path: assetsPath,
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				loader: 'url-loader',
				options: {limit: 10240}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [strip.loader('debug'), 'babel-loader']
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true
							}
						},
						'postcss-loader'
					]
				})
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new ExtractTextPlugin("[name].css"),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: false,
			__DEVTOOLS__: false
		}),

		// ignore dev config
		new webpack.IgnorePlugin(/\.\/dev/, /\/config$/)
	]
};
