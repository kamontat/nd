const path = require("path");

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ClosurePlugin = require("closure-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Visualizer = require("webpack-visualizer-plugin");

const pjson = require("./package.json");

const DIST_FOLDER = process.env.DIST_FOLDER || "dist";
const REPORT_FOLDER = process.env.REPORT_FOLDER || "docs/reports";

const DEV_STATISTIC_HTML = process.env.DEV_STATISTIC_HTML || "statistic-dev.html";
const STATISTIC_HTML = process.env.STATISTIC_HTML || "statistics.html";

let NODE_ENV = process.env.NODE_ENV || "development";
if (!["development", "testing", "production"].includes(NODE_ENV)) NODE_ENV = "development";

const isDev = NODE_ENV === "development";

const appName = pjson.name;
const appFile = `./${pjson.main}`;

const adminName = pjson.admin.name;
const adminFile = `./${pjson.admin.main}`;

const minimizer = [
  new ClosurePlugin(
    {
      mode: "STANDARD",
      childCompilations: true,
    },
    {
      formatting: "PRETTY_PRINT",
      debug: isDev,
      renaming: !isDev,
    },
  ),
];
if (!isDev)
  minimizer.push(
    new UglifyJsPlugin({
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
      },
    }),
  );

const entry = {};
entry[appName] = appFile;
entry[adminName] = adminFile;

module.exports = {
  mode: NODE_ENV,
  entry,
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader",
            options: {
              typeCheck: false,
              fix: false,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              allowTsInNodeModules: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: ["to-string-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(html|mustache)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              minifyCSS: false,
              minifyJS: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    nodeEnv: NODE_ENV,
    mangleWasmImports: true,
    moduleIds: isDev ? "named" : "hashed",
    minimize: !isDev,
    minimizer,
    splitChunks: {
      minSize: 0,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify(NODE_ENV),
      __COMPILE_DATE__: JSON.stringify(+new Date()),
      __VERSION__: JSON.stringify(pjson.version),
      __FIREBASE_API_KEY__: JSON.stringify("AIzaSyArv4QISPsrR56iE24ZCvDzSkaRj5qnfRM"),
      __FIREBASE_AUTH_DOMAIN__: JSON.stringify("nd-cli.firebaseapp.com"),
      __FIREBASE_DATABASE_URL__: JSON.stringify("https://nd-cli.firebaseio.com"),
      __FIREBASE_PROJECT_ID__: JSON.stringify("nd-cli"),
      __FIREBASE_STORAGE_BUCKET__: JSON.stringify(""),
      __FIREBASE_MESSAGING_SENDER_ID__: JSON.stringify("90199072961"),
      __FIREBASE_APP_ID__: JSON.stringify("1:90199072961:web:f0a0d74c9ee27481"),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Visualizer({
      filename: `../${REPORT_FOLDER}/${isDev ? DEV_STATISTIC_HTML : STATISTIC_HTML}`,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: isDev ? "[name].js" : "[name].min.js",
    path: path.resolve(__dirname, DIST_FOLDER),
  },
  target: "node",
  externals: [
    nodeExternals({
      whitelist: [
        /nd-.*/,
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
        "safer-buffer",
        "firebase/app",
        "firebase/database",
      ],
    }),
  ],
};
