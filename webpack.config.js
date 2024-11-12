import path from 'path'
import * as url from 'url'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const production = process.argv[process.argv.indexOf('--mode') + 1] !== 'development'
const isDevServer = process.env.WEBPACK_SERVE === 'true'

// noinspection JSUnusedGlobalSymbols
export default {
  entry: path.resolve(__dirname, './src/app.tsx'),
  target: 'web',
  mode: production ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: { limit: 100000 }
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: { extensions: ['*', '.ts', '.tsx', '.js'] },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(production),
      DEV_SERVER: JSON.stringify(isDevServer)
    })
  ],
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    historyApiFallback: true,
    hot: true,
    port: 80
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}
