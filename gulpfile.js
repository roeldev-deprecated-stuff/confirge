/**
 * confirge | gulpfile.js
 * file version: 0.00.001
 */
'use strict';

var Gulp        = require('gulp'),
    GulpJsHint  = require('gulp-jshint'),
    GulpMocha   = require('gulp-mocha'),
    GulpPlumber = require('gulp-plumber'),
    RunSequence = require('run-sequence');

//------------------------------------------------------------------------------

var JS_SRC = [__filename, './*.js', 'test/*.js'];

////////////////////////////////////////////////////////////////////////////////

Gulp.task('lint', function()
{
    return Gulp.src(JS_SRC)
        .pipe( GulpPlumber() )
        .pipe( GulpJsHint() )
        .pipe( GulpJsHint.reporter('jshint-stylish') );
});

Gulp.task('test', function()
{
    return Gulp.src('test/*.js', { 'read': false })
        .pipe( GulpPlumber() )
        .pipe( GulpMocha() );
});

Gulp.task('dev', function()
{
    for(var $i = 0; $i < 30; $i++)
    {
        console.log('');
    }

    RunSequence('lint', 'test');
});

Gulp.task('watch', function()
{
    Gulp.watch(JS_SRC, ['dev']);
});
