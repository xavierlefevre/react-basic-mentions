var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'testArea/public');
var APP_DIR = path.resolve(__dirname, 'testArea/app');
var PACKAGE_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: [
    // Set up an ES6-ish environment
    'babel-polyfill',
    // Add your application's scripts below
    APP_DIR + '/index.jsx',
  ],
  module : {
    loaders : [
      {
        loader: "babel-loader",
        test : /\.jsx?/,
        include : [APP_DIR, PACKAGE_DIR],
        query : {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react'],
        }
      },
      {
        test: /\.css$/,
        loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ]
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  }
};

module.exports = config;
