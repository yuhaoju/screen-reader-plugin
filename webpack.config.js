const htmlPlugin = require('html-webpack-plugin');
const mode = process.env.MODE;

module.exports = {
  entry: './src/ui/popup.js',
  output: {
    filename: 'popup.js',
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