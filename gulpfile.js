const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const watchify = require("watchify");
const tsify = require("tsify");
const fancyLog = require("fancy-log");
const uglify = require('gulp-uglify-es').default;
const buffer = require('vinyl-buffer');

const isDev = process.env.NODE_ENV === "development"

const config = {
  entries: ["index.ts"],
  bundle: 'nd.min.js',
  bundleDev: 'nd.js',
  dist: "dist",
  browserify: {
    basedir: '.',
    debug: isDev,
    entries: ["index.ts"],
    cache: {},
    packageCache: {}
  },
  transform: {
    presets: ['@babel/preset-env'],
    extensions: ['.ts']
  },
  uglify: {
    module: true,
    toplevel: true,
    compress: {
      arguments: true,
      hoist_funs: true,
      hoist_vars: true,
      keep_fargs: false
    },
    mangle: {
      toplevel: true,
    }
  }
}

const defaultTask = () => {
  return browserify(config.browserify).plugin(tsify).bundle().pipe(source(config.bundleDev)).pipe(gulp.dest(config.dist));
}
const watchedBrowserify = watchify(browserify(config.browserify).plugin(tsify))
const watchTask = () => {
  return watchedBrowserify.bundle().pipe(source(config.bundleDev)).pipe(gulp.dest(config.dist));
}
const prodTask = () => {
  return browserify(config.browserify)
    .plugin(tsify)
    .transform("babelify", config.transform)
    .bundle()
    .pipe(source(config.bundle))
    .pipe(buffer())
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest(config.dist));
}

gulp.task("default", defaultTask)

gulp.task("watch", watchTask);

gulp.task("prod", prodTask);

watchedBrowserify.on("update", watchTask);
watchedBrowserify.on("log", fancyLog);