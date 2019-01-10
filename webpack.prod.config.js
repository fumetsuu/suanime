const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.config.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const prod = {
	devtool: 'none', //for chrome devtools

	watch: false, //watch project folder

	plugins: [
		new webpack.DefinePlugin({ // <-- key to reducing React's size
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new UglifyJSPlugin()
	]
}

module.exports = merge([common, prod])