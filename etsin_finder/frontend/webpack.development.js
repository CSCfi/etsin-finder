var path = require('path');
const { insertBeforeStyled } = require('./helpers')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: [path.join(__dirname, '/js/index.jsx')],
    output: {
        path: path.join(__dirname, '/build'),
        publicPath: '/build/',
        filename: 'bundle.[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
      },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
          {
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|png)$/,
            use: {
              loader: 'file-loader',
            },
          },
          {
            test: /\.css$/i,
            use: [
              { loader: 'style-loader', options: { insert: insertBeforeStyled }, },
              'css-loader'
            ],
          },
        ],
    },
    // Required
    devServer: {
        publicPath: "/", // Required
        writeToDisk: true, // Required
        compress: true, // Not required, but provides faster load times
        port: 8080 // Required, this 8080 port is also made available in the file ./Dockerfile
    },
    plugins: [
      // Required
      new HtmlWebpackPlugin({
        chunksSortMode: 'none',
        filename: 'index.html',
        template: 'static/index.template.ejs',
        favicon: 'static/images/favicon.png'
      })
    ],
};
