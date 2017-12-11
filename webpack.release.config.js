var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser'],
    yandex: path.resolve(__dirname, 'yandex.js')
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [
    definePlugin,
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'/* chunkName= */,
      filename: 'scripts/vendor.bundle.js'/* filename= */
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
      inject: false,
      hash: true
    }),
    new CopyWebpackPlugin([
      {from: 'index.html'},
      {from: 'nerds.html'},
      {from: 'fonts.css'},
      {from: 'robots.txt'},
      {from: 'assets/fonts', to: './assets/fonts'},
      {from: 'assets/images/loader-bar.png', to: './assets/images/loader-bar.png'},
      {from: 'assets/images/loader-bg.png', to: './assets/images/loader-bg.png'}
    ])
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
      {
        test: /\.png|\.woff|\.woff2|\.svg|.eot|\.ttf|\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'assets/' }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'assets': path.join(__dirname, './assets')
    }
  }
}
