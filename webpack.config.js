import path from 'path'
import * as url from 'url'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const production = process.argv[process.argv.indexOf('--mode') + 1] !== 'development'

// noinspection JSUnusedGlobalSymbols
export default {
  entry: path.resolve(__dirname, './src/app.tsx'),
  target: 'web',
  mode: production ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({ PRODUCTION: JSON.stringify(production) })
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    port: 80,
    devMiddleware: { index: false },
    proxy: [
      {
        context: ['/login', '/logout', '/auth', '/api'],
        target: 'http://localhost:8080'
      },
      {
        context: ['/dev'],
        target: 'ws://localhost:8080',
        pathRewrite: { '^/dev': '' },
        ws: true
      }
    ]
  },
  infrastructureLogging: { level: 'warn' },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|@remix-run[\\/]router)[\\/]/,
          name: 'react-vendors',
          chunks: 'all'
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -1,
          reuseExistingChunk: true
        }
      }
    }
  }
}
