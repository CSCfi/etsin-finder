var path = require('path');
const { insertBeforeStyled } = require('./helpers')
const DotenvPlugin = require('dotenv-webpack')
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
    devServer: {
        publicPath: "/",
        writeToDisk: true,
        contentBase: path.join(__dirname, '/'),
        compress: true,
        port: 8080
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunksSortMode: 'none',
        filename: 'index.html',
        template: 'static/index.template.ejs',
        favicon: 'static/images/favicon.png'
      }),
      new DotenvPlugin(),
    ],
};
