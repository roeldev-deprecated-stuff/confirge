/**
 * confirge | test/main.js
 * file version: 0.00.007
 */
'use strict';

var Assert   = require('assert');
var Confirge = require('../lib/index.js');
var Path     = require('path');
var Utils    = require('../lib/utils.js');

//------------------------------------------------------------------------------

var OBJ_PLAIN     = { 'title': 'test obj', 'success': true };
var EXPECTED_YAML = { 'title': 'test yaml', 'success': true };
var EXPECTED_JSON = { 'title': 'test json', 'success': true };
var INPUT_VARS    = { 'var1': 'value1' };
var EXPECTED_VARS = {
    'var1': {
        'regexp':  new RegExp('%var1%', 'g'),
        'replace': 'value1'
    }
};

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file, $relative)
{
    $file = Path.resolve(__dirname, './fixtures/' + $file);
    if ($relative === true)
    {
        $file = Path.relative(process.cwd(), $file);
    }

    return $file;
}

//------------------------------------------------------------------------------

describe('Confirge()', function confirgeTests()
{
    it('should return the exact same object', function()
    {
        Assert.strictEqual(Confirge(OBJ_PLAIN), OBJ_PLAIN);
    });

    it('should read the relative file path and return an object', function()
    {
        var $actual = Confirge( getFixtureFile('success.json', true) );

        Assert.deepEqual($actual, EXPECTED_JSON);
    });

    it('should exec the function, read the file, and return an obj', function()
    {
        var $actual = Confirge(function()
        {
            return getFixtureFile('success.yml');
        });

        Assert.deepEqual($actual, EXPECTED_YAML);
    });

    it('should execute the function and return an object', function()
    {
        var $actual = Confirge(function()
        {
            return Confirge.read( getFixtureFile('success.yml') );
        });

        Assert.deepEqual($actual, EXPECTED_YAML);
    });

    it('should execute the function and return the same object', function()
    {
        var $actual = Confirge(function()
        {
            return OBJ_PLAIN;
        });

        Assert.equal($actual, OBJ_PLAIN);
    });
});

describe('Confirge.read()', function confirgeReadTests()
{
    it('should read the yaml file and return an object', function()
    {
        var $actual = Confirge.read( getFixtureFile('success.yml') );

        Assert.deepEqual($actual, EXPECTED_YAML);
    });

    it('should read the json file and return an object', function()
    {
        var $actual = Confirge.read( getFixtureFile('success.json') );

        Assert.deepEqual($actual, EXPECTED_JSON);
    });

    it('should read the file from the function, and return an obj', function()
    {
        var $input = function()
        {
            return getFixtureFile('success.json');
        };

        Assert.deepEqual(Confirge.read($input), EXPECTED_JSON);
    });

    it('should fail reading the yaml file', function()
    {
        var $actual = Confirge.read( getFixtureFile('failure.yml') );

        Assert.strictEqual($actual, false);
    });

    it('should fail reading the json file', function()
    {
        var $actual = Confirge.read( getFixtureFile('failure.json') );

        Assert.strictEqual($actual, false);
    });

    it('should fail reading the unexisting file', function()
    {
        var $actual = Confirge.read( getFixtureFile('does-not.exists') );

        Assert.strictEqual($actual, false);
    });

    it('should fail reading an undefined path', function()
    {
        Assert.strictEqual(Confirge.read(undefined), false);
    });

    it('should fail when passing an invald path [1]', function()
    {
        Assert.strictEqual(Confirge.read(true), false);
    });

    it('should fail when passing an invald path [2]', function()
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
    it('should replace a string var', function()
    {
        var $input = { 'str': '%var1%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS), {
            'str': 'value1'
        });
    });

    it('should replace a string var, twice', function()
    {
        var $input = { 'str': '%var1% is equal to %var1%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS), {
            'str': 'value1 is equal to value1'
        });
    });

    it('should replace a string var and keep the other', function()
    {
        var $input = { 'str': '%var1% is not equal to %var2%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS), {
            'str': 'value1 is not equal to %var2%'
        });
    });

    it('should return the exact same object [1]', function()
    {
        var $input = { 'str': 'do %not% replace %anything%!' };

        Assert.strictEqual(Confirge.replace($input, INPUT_VARS), $input);
    });

    it('should return the exact same object [2]', function()
    {
        var $input = [
            'test',
            '123',

            function()
            {
                return false;
            }
        ];

        Assert.strictEqual(Confirge.replace($input, INPUT_VARS), $input);
    });

    it('should replace the vars deep inside the object', function()
    {
        var $input = {
            'key1': {
                'key1-2': 'replace me! %var1%'
            },

            'key2': {
                'key2-2': [
                    'replace me too! %var1%',
                    'skip me! %var2%',
                    [ 'down the rabbit hole', 'last %var1% replacement' ]
                ]
            }
        };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS),
        {
            'key1': {
                'key1-2': 'replace me! value1'
            },

            'key2': {
                'key2-2': [
                    'replace me too! value1',
                    'skip me! %var2%',
                    [ 'down the rabbit hole', 'last value1 replacement' ]
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

    it('should extend the object and return an object [1]', function()
    {
        var $actual = Confirge.extend(OBJ_PLAIN, INPUT_VARS);

        Assert.deepEqual($actual, {
            'title':   'test obj',
            'success': true,
            'var1':    'value1'
        });
    });

    it('should extend the object and return an object [2]', function()
    {
        var $actual = Confirge.extend(OBJ_PLAIN, function()
        {
            return INPUT_VARS;
        });

        Assert.deepEqual($actual, {
            'title':   'test obj',
            'success': true,
            'var1':    'value1'
        });
    });

    it('should return the exact same object [1]', function()
    {
        Assert.strictEqual(Confirge.extend(OBJ_PLAIN), OBJ_PLAIN);
    });

    it('should return the exact same object [2]', function()
    {
        Assert.strictEqual(Confirge.extend(OBJ_PLAIN, false), OBJ_PLAIN);
    });
});

//------------------------------------------------------------------------------

describe('Utils.noop()', function utilsNoopTests()
{
    it('is only here to get 100% code coverage :P', function()
    {
        Assert.equal(Utils.noop(), null);
    });
});

describe('Utils.findReplacements()', function utilsFindReplacementsTests()
{
    it('found replacement [1]', function()
    {
        var $actual = Utils.findReplacements('%test%!');

        Assert($actual, ['test']);
    });

    it('found replacement [2]', function()
    {
        var $actual = Utils.findReplacements('bla bla.. %test-test%');

        Assert.deepEqual($actual, ['test-test']);
    });

    it('found multiple replacements [1]', function()
    {
        var $actual = Utils.findReplacements('%test.me%, %test_test% na na!');

        Assert.deepEqual($actual, ['test.me', 'test_test']);
    });

    it('found multiple replacements [2]', function()
    {
        var $actual = Utils.findReplacements('yada, %test% %na% %na%!');

        Assert.deepEqual($actual, ['test', 'na']);
    });

    it('no replacements found [1]', function()
    {
        Assert.strictEqual(Utils.findReplacements('%test %test'), false);
    });

    it('no replacements found [2]', function()
    {
        Assert.strictEqual(Utils.findReplacements('test% test%'), false);
    });

    it('no replacements found [3]', function()
    {
        Assert.strictEqual(Utils.findReplacements('% test % test'), false);
    });
});

describe('Utils.prepareVar()', function utilsPrepareVarTests()
{
    it('should return an object with regexp and replace value', function()
    {
        var $actual = Utils.prepareVar({}, INPUT_VARS, 'var1');

        Assert.deepEqual($actual, EXPECTED_VARS);
    });

    it('should replace the replacement var', function()
    {
        var $input = {
            'var1': 'value1 %var2%',
            'var2': 'value2'
        };

        Assert.deepEqual(Utils.prepareVar({}, $input, 'var1'), {
            'var1': {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 value2'
            },

            'var2': {
                'regexp':  new RegExp('%var2%', 'g'),
                'replace': 'value2'
            }
        });
    });

    it('should not replace the replacement var', function()
    {
        var $input = { 'var1': 'value1 %var2%' };

        Assert.deepEqual(Utils.prepareVar({}, $input, 'var1'), {
            'var1': {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 %var2%'
            },

            'var2': false
        });
    });
});

describe('Utils.prepareVars()', function utilsPrepareVarsTests()
{
    it('it should flatten a multilevel vars object', function()
    {
        var $input = {
            'level1': {
                'level2': INPUT_VARS
            }
        };

        Assert.deepEqual(Utils.prepareVars({}, $input),
        {
            'level1.level2.var1': {
                'regexp':  new RegExp('%level1.level2.var1%', 'g'),
                'replace': 'value1'
            }
        });
    });
});

describe('Utils.prepareHandleVars()', function utilsPrepareHandleVarsTests()
{
    it('should return an object with regexp and replace value [1]', function()
    {
        var $actual = Utils.prepareHandleVars(INPUT_VARS);

        Assert.deepEqual($actual, EXPECTED_VARS);
    });

    it('should return an object with regexp and replace value [2]', function()
    {
        var $actual = Utils.prepareHandleVars(function()
        {
            return INPUT_VARS;
        });

        Assert.deepEqual($actual, EXPECTED_VARS);
    });

    it('should return an object with prepared vars', function()
    {
        var $input = {
            'var1': 'value1 %var3%',
            'var2': 'value2',
            'var3': 'value3 %var2%'
        };

        Assert.deepEqual(Utils.prepareHandleVars($input),
        {
            'var2': {
                'regexp':  new RegExp('%var2%', 'g'),
                'replace': 'value2'
            },

            'var3': {
                'regexp':  new RegExp('%var3%', 'g'),
                'replace': 'value3 value2'
            },

            'var1': {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 value3 value2'
            }
        });
    });

    it('should flatten and return an object with prepared vars', function()
    {
        var $input = {
            'var1': 'value1',
            'var2': {
                'a': 'value2a',
                'b': 'value2b'
            }
        };

        Assert.deepEqual(Utils.prepareHandleVars($input),
        {
            'var1': {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1'
            },

            'var2.a': {
                'regexp':  new RegExp('%var2.a%', 'g'),
                'replace': 'value2a'
            },

            'var2.b': {
                'regexp':  new RegExp('%var2.b%', 'g'),
                'replace': 'value2b'
            }
        });
    });

    it('should return false [1]', function()
    {
        Assert.strictEqual(Utils.prepareHandleVars([]), false);
    });

    it('should return false [2]', function()
    {
        Assert.strictEqual(Utils.prepareHandleVars(''), false);
    });
});

describe('Utils.replaceVars()', function utilsReplaceVarsTests()
{
    it('should replace the var [1]', function()
    {
        var $vars   = Utils.prepareHandleVars(INPUT_VARS);
        var $actual = Utils.replaceVars('the value is %var1%', $vars);

        Assert.equal($actual, 'the value is value1');
    });

    it('should replace the var [2]', function()
    {
        var $vars   = Utils.prepareHandleVars(INPUT_VARS);
        var $actual = Utils.replaceVars('%var1% is not %var2%', $vars);

        Assert.equal($actual, 'value1 is not %var2%');
    });

    it('should replace the var, twice', function()
    {
        var $vars   = Utils.prepareHandleVars(INPUT_VARS);
        var $actual = Utils.replaceVars('%var1% equals %var1%', $vars);

        Assert.equal($actual, 'value1 equals value1');
    });

    it('should replace both vars [1]', function()
    {
        var $input  = { 'var1': 'value1', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1% is not %var2%', $vars);

        Assert.equal($actual, 'value1 is not value2');
    });

    it('should replace both vars [2]', function()
    {
        var $input  = { 'var1': 'value1', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1%%var2%', $vars);

        Assert.equal($actual, 'value1value2');
    });

    it('should replace the replaced var', function()
    {
        var $input  = { 'var1': 'value1 %var2%', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1% also has %var2%', $vars);

        Assert.equal($actual, 'value1 value2 also has value2');
    });

    it('should return the exact string [1]', function()
    {
        var $input  = 'the value is %var2%';
        var $vars   = Utils.prepareHandleVars(INPUT_VARS);
        var $actual = Utils.replaceVars($input, $vars);

        Assert.strictEqual($actual, $input);
    });

    it('should return the exact string [2]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, false);

        Assert.strictEqual($actual, $input);
    });

    it('should return the exact string [3]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, {});

        Assert.strictEqual($actual, $input);
    });
});

describe('Utils.replaceHandleItem()', function utilsReplaceHandleItemTests()
{
    it('should replace the var and return a string', function()
    {
        var $input  = 'the value is %var1%';
        var $vars   = Utils.prepareHandleVars(INPUT_VARS);
        var $actual = Utils.replaceHandleItem($input, $vars);

        Assert.equal($actual, 'the value is value1');
    });

    it('should handle the array', function()
    {
        var $input = ['test 1 = %var1%', 'test 2 = %var2%'];
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });

    it('should handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);
        var $input = {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });

    it('should return the exact input value [1]', function()
    {
        var $input = true;

        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });

    it('should return the exact input value [2]', function()
    {
        var $input = Utils.noop;

        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });

    it('should return the exact input value [3]', function()
    {
        var $input = 123;

        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });
});

describe('Utils.replaceHandleArray()', function utilsReplaceHandleArrayTests()
{
    it('should handle the array', function()
    {
        var $input = ['test 1 = %var1%', 'test 2 = %var2%'];
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });
});

describe('Utils.replaceHandleObject()', function utilsReplaceHandleObjectTests()
{
    it('should handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);
        var $input = {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });

    it('should only handle the objects own property', function()
    {
        /* jshint ignore:start */
        Object.prototype.confirgeTest = true;
        /* jshint ignore:end */

        var $vars  = Utils.prepareHandleVars(INPUT_VARS);
        var $input = {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });
});

describe('readme examples', function readmeExamples()
{
    it('should succeed the `How to use` example', function()
    {
        // extend objects
        var $config = Confirge.extend({}, {
            'example': '%var1% and %var2%'
        });

        // will replace vars inside the config obj, eg. %var1%, %var2%
        // this will result in { 'example': 'value1 and value2' }
        $config = Confirge.replace($config, {
            'var1': 'value1',
            'var2': 'value2'
        });

        Assert.deepEqual($config, { 'example': 'value1 and value2' });
    });

    it('should succeed the `confirge.replace API` example', function()
    {
        var $source = {
            'config-option':   '%some-var%',
            'config-option2':  '%another.var%',
            'other-option':    true,
            'supported-types': ['object', '%types.a%']
        };

        var $vars = {
            'some-var':    'some-value',    // %some-var%
            'another.var': 'another value', // %another.var%
            'types':       { 'a': 'array' } // %types.a%
        };

        Assert.deepEqual(Confirge.replace($source, $vars), {
            'config-option':   'some-value',
            'config-option2':  'another value',
            'other-option':    true,
            'supported-types': ['object', 'array']
        });
    });
});
