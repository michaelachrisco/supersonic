var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    '.src/client/entry'
  ],
  output: {
    path: __dirname + '/build',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}

