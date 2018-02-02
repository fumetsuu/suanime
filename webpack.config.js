const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WatchIgnorePlugin = require('watch-ignore-webpack-plugin')

module.exports = {
	devtool: 'source-map', //for chrome devtools

	watch: true, //watch project folder

	target: 'electron',

	entry: './app/src/entry.js', //this is what webpack looks for to bundle into bundle.js (this file will call a lot of other components)

	output: {
		//location and filename for bundled js
		path: __dirname + '/app/build',
		publicPath: './',
		filename: 'bundle.js'
	},
	node: {
		__dirname: false,
		__filename: false
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['react']
				}
			},
			{
				test: /\.(sa|c)ss$/,
				use: ExtractTextPlugin.extract({
					//extract css to separate file in build path named bundle.css, see config below
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: "file-loader",
				options: {
					name: 'img/[name].[ext]'
				}
			},
			{ test: /\.html$/, use: ['html-loader'] }
		]
	},

	plugins: [
		new ExtractTextPlugin({
			filename: 'bundle.css'
		}),
		new HtmlWebpackPlugin({
			template: 'app/index.html'
		})
		// new WatchIgnorePlugin([
		// 	path.resolve(__dirname, './node_modules/'),
		// 	path.resolve(__dirname, './downloads/')
		// ])
	]
}
