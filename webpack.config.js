var fs = require('fs');
var path = require('path');

module.exports = {
  entry: {
    index: './main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'

  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.(vs|fs|txt)$/,
        use: 'raw-loader',
        include: path.resolve(__dirname, "examples")
      },
    ]
  },
  resolve: {
    extensions: [
      '.js',
      ".json",
      ".jsx",
      ".css",
    ]
  }
}