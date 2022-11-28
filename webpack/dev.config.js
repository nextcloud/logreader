const path = require('path');
const assetsPath = path.resolve(__dirname, '../js');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
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
				options: {
					limit: 10240
				}
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					"@teamsupercell/typings-for-css-modules-loader",
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
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		fallback: { "assert": false },
	},
};
