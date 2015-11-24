/**
 * confirge | test/index_tests.js
 *
 * Tests for main functions.
 */
'use strict';

var Assert   = require('assert');
var Confirge = require('../lib/index.js');
var Path     = require('path');
var Test     = require('./_common.js');

// -----------------------------------------------------------------------------

function getFixtureFilePath($file, $relative)
{
    $file = Path.resolve(__dirname, './fixtures/' + $file);
    if ($relative === true)
    {
        $file = Path.relative(process.cwd(), $file);
    }

    return $file;
}

// // // // // // // // // // // // // // // // // // // // // // // // // // //

describe('Confirge()', function confirgeTests()
{
    it('return the exact same object', function()
    {
        Assert.strictEqual(Confirge(Test.OBJ_PLAIN), Test.OBJ_PLAIN);
    });

    it('read the relative file path and return an object', function()
    {
        var $file   = getFixtureFilePath('success.json', true);
        var $actual = Confirge($file);

        Assert.deepEqual($actual, Test.EXPECTED_JSON);
    });

    it('execute the function, read the file, and return an object', function()
    {
        var $actual = Confirge(function()
        {
            return getFixtureFilePath('success.yml');
        });

        Assert.deepEqual($actual, Test.EXPECTED_YAML);
    });

    it('execute the function and return an object', function()
    {
        var $actual = Confirge(function()
        {
            return Confirge.read(getFixtureFilePath('success.yml'));
        });

        Assert.deepEqual($actual, Test.EXPECTED_YAML);
    });

    it('execute the function and return the same object', function()
    {
        var $actual = Confirge(function()
        {
            return Test.OBJ_PLAIN;
        });

        Assert.equal($actual, Test.OBJ_PLAIN);
    });
});

describe('Confirge.read()', function confirgeReadTests()
{
    it('read the yaml file and return an object [1]', function()
    {
        var $file   = getFixtureFilePath('success.yml');
        var $actual = Confirge.read($file);

        Assert.deepEqual($actual, Test.EXPECTED_YAML);
    });

    it('read the yaml file and return an object [2]', function()
    {
        var $file   = getFixtureFilePath('success');
        var $actual = Confirge.read($file, ['yml', 'json']);

        Assert.deepEqual($actual, Test.EXPECTED_YAML);
    });

    it('read the json file and return an object [1]', function()
    {
        var $file   = getFixtureFilePath('success.json');
        var $actual = Confirge.read($file);

        Assert.deepEqual($actual, Test.EXPECTED_JSON);
    });

    it('read the json file and return an object [2]', function()
    {
        var $file   = getFixtureFilePath('success');
        var $actual = Confirge.read($file, ['json', 'yml']);

        Assert.deepEqual($actual, Test.EXPECTED_JSON);
    });

    it('read the file from the function, and return an object', function()
    {
        var $input = function()
        {
            return getFixtureFilePath('success.json');
        };

        Assert.deepEqual(Confirge.read($input), Test.EXPECTED_JSON);
    });

    it('read the file with fallback yml extension [1]', function()
    {
        var $file   = getFixtureFilePath('fallback1.json');
        var $actual = Confirge.read($file, ['yml']);

        Assert.deepEqual($actual, Test.FALLBACK1);
    });

    it('read the file with fallback yml extension [2]', function()
    {
        var $file   = getFixtureFilePath('fallback1.json');
        var $actual = Confirge.read($file, ['json', 'txt', 'yml']);

        Assert.deepEqual($actual, Test.FALLBACK1);
    });

    it('read the file with fallback json extension [1]', function()
    {
        var $file   = getFixtureFilePath('fallback2.yml');
        var $actual = Confirge.read($file, ['json']);

        Assert.deepEqual($actual, Test.FALLBACK2);
    });

    it('read the file with fallback json extension [2]', function()
    {
        var $file   = getFixtureFilePath('fallback2');
        var $actual = Confirge.read($file, ['yml', 'json', 'txt']);

        Assert.deepEqual($actual, Test.FALLBACK2);
    });

    it('fail reading the yaml file', function()
    {
        var $file   = getFixtureFilePath('failure.yml');
        var $actual = Confirge.read($file);

        Assert.strictEqual($actual, false);
    });

    it('fail reading the json file', function()
    {
        var $file   = getFixtureFilePath('failure.json');
        var $actual = Confirge.read($file);

        Assert.strictEqual($actual, false);
    });

    it('fail reading the unexisting file', function()
    {
        var $file   = getFixtureFilePath('does-not.exists');
        var $actual = Confirge.read($file);

        Assert.strictEqual($actual, false);
    });

    it('fail reading an undefined path', function()
    {
        Assert.strictEqual(Confirge.read(undefined), false);
    });

    it('fail when passing an invald path [1]', function()
    {
        Assert.strictEqual(Confirge.read(true), false);
    });

    it('fail when passing an invald path [2]', function()
    {
        var $input = function()
        {
            return {};
        };

        Assert.strictEqual(Confirge.read($input), false);
    });
});

describe('Confirge.replace()', function confirgeReplaceTests()
{
    it('replace a string var', function()
    {
        var $input = { 'str': '%var1%' };

        Assert.deepEqual(Confirge.replace($input, Test.INPUT_VARS), {
            'str': 'value1'
        });
    });

    it('replace a string var, twice', function()
    {
        var $input = { 'str': '%var1% is equal to %var1%' };

        Assert.deepEqual(Confirge.replace($input, Test.INPUT_VARS), {
            'str': 'value1 is equal to value1'
        });
    });

    it('replace a string var and keep the other', function()
    {
        var $input = { 'str': '%var1% is not equal to %var2%' };

        Assert.deepEqual(Confirge.replace($input, Test.INPUT_VARS), {
            'str': 'value1 is not equal to %var2%'
        });
    });

    it('return the exact same object [1]', function()
    {
        var $input = { 'str': 'do %not% replace %anything%!' };
        Assert.strictEqual(Confirge.replace($input, Test.INPUT_VARS), $input);
    });

    it('return the exact same object [2]', function()
    {
        var $input = [
            'test',
            '123',

            function()
            {
                return false;
            }
        ];

        Assert.strictEqual(Confirge.replace($input, Test.INPUT_VARS), $input);
    });

    it('replace the vars deep inside the object', function()
    {
        var $input = {
            'key1': {
                'key1-2': 'replace me! %var1%'
            },

            'key2': {
                'key2-2': [
                    'replace me too! %var1%',
                    'skip me! %var2%',
                    ['down the rabbit hole', 'last %var1% replacement']
                ]
            }
        };

        Assert.deepEqual(Confirge.replace($input, Test.INPUT_VARS),
        {
            'key1': {
                'key1-2': 'replace me! value1'
            },

            'key2': {
                'key2-2': [
                    'replace me too! value1',
                    'skip me! %var2%',
                    ['down the rabbit hole', 'last value1 replacement']
                ]
            }
        });
    });
});

describe('Confirge.extend()', function confirgeExtendTests()
{
    // remove prototype added by Utils.replaceHandleObject() testcase
    // otherwise, it will cause this test to fail
    delete Object.prototype.confirgeTest;

    it('extend the object and return an object [1]', function()
    {
        var $actual = Confirge.extend(Test.OBJ_PLAIN, Test.INPUT_VARS);

        Assert.deepEqual($actual, {
            'title':   'test obj',
            'success': true,
            'var1':    'value1'
        });
    });

    it('extend the object and return an object [2]', function()
    {
        var $actual = Confirge.extend(Test.OBJ_PLAIN, function()
        {
            return Test.INPUT_VARS;
        });

        Assert.deepEqual($actual, {
            'title':   'test obj',
            'success': true,
            'var1':    'value1'
        });
    });

    it('return the exact same object [1]', function()
    {
        Assert.strictEqual(Confirge.extend(Test.OBJ_PLAIN), Test.OBJ_PLAIN);
    });

    it('return the exact same object [2]', function()
    {
        var $actual = Confirge.extend(Test.OBJ_PLAIN, false);
        Assert.strictEqual($actual, Test.OBJ_PLAIN);
    });
});
