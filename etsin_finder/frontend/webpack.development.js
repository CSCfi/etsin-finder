var path = require('path');
var fs = require('fs');
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
    devServer: { // Required
        proxy: { // Proxy for requests to the Flask backend

           // List of endpoint calls that should be routed from Webpack to Flask
           context: [
             "/*", // <- This line includes all paths directly below root but excludes the root path itself
             "/qvain/**",
             "/login/**",
             "/datasets/**",
             "/api/**",
             "/es/**"
            ],
            target: {
              host: "flask", // Name of the backend container
              protocol: 'http:', // Protocol to be used
              port: 5000, // Flask target port for endpoint calls, required
            },
            ignorePath: false,
            changeOrigin: true,
            secure: false,
          // }
        },
        // If https is enabled without key/cert/ca items, it will generate its own certificate
        https: true,
        key: fs.readFileSync('/etc/nginx/ssl_certs/fd-test.csc.fi.key.pem'),
        cert: fs.readFileSync('/etc/nginx/ssl_certs/fd-test.csc.fi.crt.pem'),
        // ca: fs.readFileSync('/etc/nginx/ssl_certs/fd-test.csc.fi.crt.pem'),
        disableHostCheck: true, // Enabled in order to allow for websocket connection
        publicPath: "/", // Required
        writeToDisk: true, // Required
        contentBase: "/build",
        hot: true,
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
