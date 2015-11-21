/**
 * confirge | gulpfile.js
 */
'use strict';

const Gulp            = require('gulp');
const GulpJsHint      = require('gulp-jshint');
const GulpJsCs        = require('gulp-jscs');
const GulpJsCsStylish = require('gulp-jscs-stylish');
const GulpMocha       = require('gulp-mocha');
const RunSequence     = require('run-sequence');

// -----------------------------------------------------------------------------

const JS_SRC = ['gulpfile.js', 'lib/**/*.js', 'test/*.js'];

function noop()
{
}

// -----------------------------------------------------------------------------

Gulp.task('lint', function()
{
    return Gulp.src(JS_SRC)
        .pipe( GulpJsHint() )
        .pipe( GulpJsCs() ).on('error', noop)
        .pipe( GulpJsCsStylish.combineWithHintResults() )
        .pipe( GulpJsHint.reporter('jshint-stylish') );
});

Gulp.task('test', function()
{
    return Gulp.src('test/*.js', { 'read': false })
        .pipe( GulpMocha({ 'reporter': 'spec' }) );
});

Gulp.task('dev', function()
{
    process.stdout.write('\u001b[2J');
    RunSequence('test', 'lint');
});

Gulp.task('watch', function()
{
    Gulp.watch(JS_SRC, ['dev']);
});

Gulp.task('watch:lint', function()
{
    Gulp.watch(JS_SRC, ['lint']);
});
