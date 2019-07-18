require('@babel/polyfill')

const config = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|png)$/,
        use: 'file-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
}
module.exports = config
