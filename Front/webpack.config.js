const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin()];
  }

  return config;
};

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
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'favicon.ico'),
          to: path.resolve(__dirname, 'public'),
        },
        {
          from: path.join(__dirname, 'src', 'inMessage.mp3'),
          to: path.resolve(__dirname, 'public'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
  devtool: isDev ? 'source-map' : '',
  optimization: optimization(),
};
