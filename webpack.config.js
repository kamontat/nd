const path = require('path');

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ClosurePlugin = require('closure-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const pjson = require("./package.json")

const isDev = process.env.NODE_ENV === "development"

const minimizer = [new ClosurePlugin({
  mode: 'STANDARD',
  childCompilations: true
}, {
  formatting: 'PRETTY_PRINT',
  debug: isDev,
  renaming: !isDev
})]
if (!isDev) minimizer.push(new UglifyJsPlugin({
  extractComments: {
    condition: true,
    banner() {
      return `----------------------------------------

01001100 01001001 01000011 01000101 01001110 01010011
01000101 01100010 01111001 01001011 01000011 01000000
00110010 00110000 00110001 00111001 00101110 01010100
01101000 01101001 01110011 01100010 01100001 01101110
01101110 01100101 01110010 01101001 01110011 01100001
01110000 01110010 01101111 01101111 01100110 01100101
01110110 01101001 01100100 01100101 01101110 01100011
01100101 00101110 01111001 01101111 01110101 01101110
01101111 01110100 01100001 01101100 01101100 01101111
01110111 01110100 01101111 01101101 01101111 01100100
01101001 01100110 01111001 00101100 01100011 01101111
01110000 01111001 01101111 01110010 01110011 01100101
01101100 01101100 01110100 01101000 01100101 01100011
01101111 01101101 01101101 01100001 01101110 01100100

----------------------------------------`;
    },
  }
}))

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    nd: "./index.ts",
    "nd-admin": "./admin.ts"
  },
  module: {
    rules: [{
        test: /\.ts$/,
        enforce: "pre",
        use: [{
          loader: "tslint-loader",
          options: {
            typeCheck: false,
            fix: true
          }
        }]
      },
      {
        test: /\.ts?$/,
        use: [{
          loader: "ts-loader",
          options: {
            allowTsInNodeModules: true
          }
        }]
      }
    ]
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV,
    mangleWasmImports: true,
    moduleIds: isDev ? 'named' : 'hashed',
    minimize: !isDev,
    minimizer,
    splitChunks: {
      minSize: 0
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "__NODE_ENV__": JSON.stringify(process.env.NODE_ENV),
      "__COMPILE_DATE__": JSON.stringify(+new Date()),
      "__VERSION__": JSON.stringify(pjson.version)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Visualizer({
      filename: '../reports/statistics.html'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: isDev ? '[name].js' : '[name].min.js',
    chunkFilename: '[name]-[id].js',
    path: path.resolve(__dirname, 'dist')
  },
  target: "node",
  externals: [nodeExternals({
    whitelist: [/nd-.*/,
      "table",
      "jsonwebtoken",
      "chalk",
      "debug",
      "bcryptjs",
      "supports-color",
      "ansi-styles",
      "escape-string-regexp",
      "iconv-lite",
      "async",
      "safer-buffer"
    ]
  })]
};