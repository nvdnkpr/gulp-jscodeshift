const gulp = require('gulp');
const copy = require('gulp-copy');
const del = require('del');
const jscodeshift = require('./');
const nodeunit = require('gulp-nodeunit');

gulp.task('clean', () => del(['tmp/**']));

gulp.task('copy', ['clean'], () => gulp.src('tests/fixtures/code.js', { base: 'tests/fixtures/' }).pipe(gulp.dest('tmp')));

gulp.task('jscodeshift', ['copy'], () => gulp.src('tmp/*.js').pipe(jscodeshift('tests/transforms/reverse-transform.js')));

gulp.task('nodeunit', ['jscodeshift'], () => gulp.src('tests/**/*.spec.js').pipe(nodeunit({ reporterOptions: { output: 'test' } })));

gulp.task('test', ['nodeunit', 'clean']);