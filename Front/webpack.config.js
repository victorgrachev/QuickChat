const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, 'src', 'entry', 'main.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[hash].js',
  },
  resolve: {
    alias: {
      '@module': path.join(__dirname, 'src', 'module'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    new CleanWebpackPlugin(),
  ],
};
