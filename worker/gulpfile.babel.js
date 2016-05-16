/* eslint react/jsx-first-prop-new-line: 0, import/no-unresolved: 0 */
import gulp from 'gulp';
import babel from 'gulp-babel';
import {
  resolve,
} from 'path';
import resolveRelativeModule from 'babel-resolve-relative-module';

const babelPreset = ['es2015', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

const ROOT = resolve(__dirname);
const distPath = `${ROOT}/build/dist`;
const srcPath = `${ROOT}/src`;

gulp.task('goniplus', () => {
  gulp.src(['src/*.js'])
    .pipe(babel({
      plugins: ['transform-runtime'],
      presets: babelPreset,
      resolveModuleSource: resolveRelativeModule(srcPath),
    }))
    .pipe(gulp.dest(distPath));
});

gulp.task('build', ['goniplus']);
