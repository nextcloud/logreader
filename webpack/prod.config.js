// Webpack config for creating the production bundle.

const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const relativeAssetsPath = '../js';
const assetsPath = path.join(__dirname, relativeAssetsPath);

module.exports = {
	devtool: 'source-map',
	mode: 'production',
	context: path.resolve(__dirname, '..'),
	entry: {
		'logreader-main': [
			'./src/index.js'
		]
	},
	output: {
		path: assetsPath,
		filename: '[name].js',
		chunkFilename: '[name]-[chunkhash].js',
		publicPath: '/js/'
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
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
						}
					},
					'postcss-loader',
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({filename: "[name].css"}),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: false,
			__DEVTOOLS__: false
		}),

		// ignore dev config
		new webpack.IgnorePlugin({resourceRegExp: /\.\/dev/, contextRegExp: /\/config$/})
	]
};
