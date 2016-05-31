import resolveRelativeModule from 'babel-resolve-relative-module';
import browserify from 'browserify';
import gulp from 'gulp';
import babel from 'gulp-babel';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify';
import {
  resolve,
} from 'path';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const babelPreset = ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

const ROOT = resolve(__dirname);
const buildPath = `${ROOT}/build`;
const buildSrcPath = `${ROOT}/build/src`;
const modulePath = `${ROOT}/node_modules`;
const srcPath = `${ROOT}/src`;

gulp.task('server', ['client-replace-apikey'], () => {
  gulp.src(['!build/src/client.jsx', 'build/src/**/*.+(js|json|jsx)'])
    .pipe(babel({
      presets: babelPreset,
      resolveModuleSource: resolveRelativeModule(buildSrcPath),
    }))
    .pipe(gulp.dest(`${ROOT}/build/dist`));
});

gulp.task('client-dev', ['client-replace-apikey'], () => {
  return browserify({
    debug: true,
    entries: [
      `${buildSrcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, buildSrcPath],
  })
  .transform('babelify', {
    plugins: ['transform-runtime'],
    presets: babelPreset,
  })
  .bundle()
  .pipe(source('client.js'))
  .pipe(buffer())
  .pipe(gulp.dest(`${buildPath}/public`));
});

gulp.task('client', ['client-replace-apikey'], () => {
  return browserify({
    entries: [
      `${buildSrcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, buildSrcPath],
  })
  .transform('babelify', {
    plugins: ['transform-runtime'],
    presets: babelPreset,
  })
  .bundle()
  .pipe(source('client.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(`${buildPath}/public`));
});

gulp.task('client-replace-apikey', ['client-pre-build'], () => {
  const slackAPIkey = process.env.GONI_SLACK_CLIENT || 'null';
  return gulp.src([`${buildSrcPath}/constants/auth/index.js`])
    .pipe(replace('process.env.GONI_SLACK_CLIENT', slackAPIkey))
    .pipe(gulp.dest(`${buildSrcPath}/constants/auth/`));
});

gulp.task('client-pre-build', () => {
  return gulp.src([`${srcPath}/**/*`])
    .pipe(gulp.dest(`${buildSrcPath}`));
});

gulp.task('dev-css', () => {
  return gulp.src([`${srcPath}/style.css`])
    .pipe(gulp.dest(`${buildPath}`));
});

gulp.task('production', () => {
  process.env.NODE_ENV = 'production';
});

gulp.task('build-dev', ['dev-css', 'client-pre-build', 'client-replace-apikey', 'client-dev', 'server']);

gulp.task('build', ['production', 'dev-css', 'client-pre-build', 'client-replace-apikey', 'client', 'server']);
