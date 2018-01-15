const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');

// cleans index files in root dir and dist folder
gulp.task('clean', () => {
  return del(['index.*', 'dist']);
});

// copies custom declaration types to dist folder
gulp.task('copy-types', () => {
  return gulp.src('src/@types/**', { base: 'src' }).pipe(gulp.dest('dist'));
});

// compiles ts files to dist folder
gulp.task('build', ['copy-types'], () => {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp.src('src/**/*.ts').pipe(tsProject()).pipe(gulp.dest('dist'));
});
