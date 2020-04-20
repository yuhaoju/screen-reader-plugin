const htmlPlugin = require('html-webpack-plugin');
const mode = process.env.MODE;

module.exports = {
  entry: {
    reader: './src/reader.js',
    popup: './src/ui/popup.js',
  },
  output: {
    filename: '[name].js',
  },
  mode: mode === 'DEV' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [new htmlPlugin({ filename: 'popup.html' })],
  devServer: {
    publicPath: '/dist/',
    port: 3000,
  },
};