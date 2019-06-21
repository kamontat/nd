const path = require('path');

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ClosurePlugin = require('closure-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    banner(commentsFile) {
      return `My custom banner about license information ${commentsFile}`;
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
      "__COMPILE_DATE__": JSON.stringify(+new Date()),
      "__VERSION__": JSON.stringify(pjson.version)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
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
    whitelist: [/nd-.*/]
  })]
};