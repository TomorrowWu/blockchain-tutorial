const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './app/scripts/index.js',
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'app.js'
	},
	plugins: [
		// Copy our app's index.html to the build folder.
		new CopyWebpackPlugin([
			{from: './app/index.html', to: 'index.html'}
		])
	],
	devtool: 'source-map',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://39.105.42.197:8545',
        changeOrigin: true, // 支持跨域
        secure: false
      }
    }
  },
  module: {
		rules: [
			{test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader']},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['env'],
					plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
				}
			}
		]
	}
};

