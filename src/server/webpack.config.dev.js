'use strict'

var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  entry: ['webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server', './client/entry'],
  output: {
    path: __dirname + '/public/'
    filename: 'app.js',
    publicPath: 'http://localhost:8080/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ["node_modules"]
  },
  externals: {
    'supersonic': 'supersonic'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin()
  ]
}
