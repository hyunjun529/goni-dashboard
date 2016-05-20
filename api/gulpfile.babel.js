import resolveRelativeModule from 'babel-resolve-relative-module';
import browserify from 'browserify';
import gulp from 'gulp';
import babel from 'gulp-babel';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify';
import {
  resolve,
} from 'path';
import runSequence from 'run-sequence';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const babelPreset = ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

const ROOT = resolve(__dirname);
const buildPath = `${ROOT}/build`;
const buildClientSrcPath = `${ROOT}/build/client`;
const modulePath = `${ROOT}/node_modules`;
const srcPath = `${ROOT}/src`;

gulp.task('server', () => {
  gulp.src(['!src/client.jsx', 'src/**/*.+(js|json|jsx)'])
    .pipe(babel({
      presets: babelPreset,
      resolveModuleSource: resolveRelativeModule(srcPath),
    }))
    .pipe(gulp.dest(`${ROOT}/build/dist`));
});

gulp.task('client-dev', () => {
  return browserify({
    debug: true,
    entries: [
      `${buildClientSrcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, buildClientSrcPath],
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

gulp.task('client', () => {
  return browserify({
    entries: [
      `${buildClientSrcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, buildClientSrcPath],
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

gulp.task('client-replace-apikey', () => {
  const slackAPIkey = process.env.GONI_SLACK_CLIENT || 'null';
  return gulp.src([`${buildClientSrcPath}/constants/auth/index.js`])
    .pipe(replace('process.env.GONI_SLACK_CLIENT', slackAPIkey))
    .pipe(gulp.dest(`${buildClientSrcPath}/constants/auth/`));
});

gulp.task('client-pre-build', () => {
  return gulp.src([`${srcPath}/**/*`])
           .pipe(gulp.dest(`${buildClientSrcPath}`));
});

gulp.task('production', () => {
  process.env.NODE_ENV = 'production';
});

gulp.task('build-dev',
  runSequence(
      'client-pre-build',
      'client-replace-apikey',
      ['client-dev', 'server'],
  )
);

gulp.task('build',
  runSequence(
      'production',
      'client-pre-build',
      'client-replace-apikey',
      ['client', 'server'],
  )
);
