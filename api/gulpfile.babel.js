import browserify from 'browserify';
import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import {
  resolve,
} from 'path';
import resolveRelativeModule from 'babel-resolve-relative-module';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const babelPreset = ['es2015', 'react', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

const ROOT = resolve(__dirname);
const buildPath = `${ROOT}/build`;
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
      `${srcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, srcPath],
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
      `${srcPath}/client.jsx`,
    ],
    extensions: ['', '.js', '.json', '.jsx'],
    paths: [modulePath, srcPath],
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

gulp.task('build-dev', ['client-dev', 'server']);
gulp.task('build', ['client', 'server']);
