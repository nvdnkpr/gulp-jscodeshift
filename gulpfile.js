const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del(['index.js', 'index.js.map', 'lib']));
