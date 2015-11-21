/**
 * confirge | test/utils_tests.js
 */
'use strict';

const Assert = require('assert');
const Utils  = require('../lib/utils.js');
const Test   = require('./_common.js');

// -----------------------------------------------------------------------------

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
    it('return an object with regexp and replace value', function()
    {
        var $actual = Utils.prepareVar({}, Test.INPUT_VARS, 'var1');
        Assert.deepEqual($actual, Test.EXPECTED_VARS);
    });

    it('replace the replacement var', function()
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

    it('not replace the replacement var', function()
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
            'level1': { 'level2': Test.INPUT_VARS }
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
    it('return an object with regexp and replace value [1]', function()
    {
        var $actual = Utils.prepareHandleVars(Test.INPUT_VARS);
        Assert.deepEqual($actual, Test.EXPECTED_VARS);
    });

    it('return an object with regexp and replace value [2]', function()
    {
        var $actual = Utils.prepareHandleVars(function()
        {
            return Test.INPUT_VARS;
        });

        Assert.deepEqual($actual, Test.EXPECTED_VARS);
    });

    it('return an object with prepared vars', function()
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

    it('flatten and return an object with prepared vars', function()
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

    it('return false [1]', function()
    {
        Assert.strictEqual(Utils.prepareHandleVars([]), false);
    });

    it('return false [2]', function()
    {
        Assert.strictEqual(Utils.prepareHandleVars(''), false);
    });
});

describe('Utils.replaceVars()', function utilsReplaceVarsTests()
{
    it('replace the var [1]', function()
    {
        var $vars   = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $actual = Utils.replaceVars('the value is %var1%', $vars);

        Assert.equal($actual, 'the value is value1');
    });

    it('replace the var [2]', function()
    {
        var $vars   = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $actual = Utils.replaceVars('%var1% is not %var2%', $vars);

        Assert.equal($actual, 'value1 is not %var2%');
    });

    it('replace the var, twice', function()
    {
        var $vars   = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $actual = Utils.replaceVars('%var1% equals %var1%', $vars);

        Assert.equal($actual, 'value1 equals value1');
    });

    it('replace both vars [1]', function()
    {
        var $input  = { 'var1': 'value1', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1% is not %var2%', $vars);

        Assert.equal($actual, 'value1 is not value2');
    });

    it('replace both vars [2]', function()
    {
        var $input  = { 'var1': 'value1', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1%%var2%', $vars);

        Assert.equal($actual, 'value1value2');
    });

    it('replace the replaced var', function()
    {
        var $input  = { 'var1': 'value1 %var2%', 'var2': 'value2' };
        var $vars   = Utils.prepareHandleVars($input);
        var $actual = Utils.replaceVars('%var1% also has %var2%', $vars);

        Assert.equal($actual, 'value1 value2 also has value2');
    });

    it('return the exact string [1]', function()
    {
        var $input  = 'the value is %var2%';
        var $vars   = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $actual = Utils.replaceVars($input, $vars);

        Assert.strictEqual($actual, $input);
    });

    it('return the exact string [2]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, false);

        Assert.strictEqual($actual, $input);
    });

    it('return the exact string [3]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, {});

        Assert.strictEqual($actual, $input);
    });
});

describe('Utils.replaceHandleItem()', function utilsReplaceHandleTests()
{
    it('replace the var and return a string', function()
    {
        var $input  = 'the value is %var1%';
        var $vars   = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $actual = Utils.replaceHandleItem($input, $vars);

        Assert.equal($actual, 'the value is value1');
    });

    it('handle the array', function()
    {
        var $input = ['test 1 = %var1%', 'test 2 = %var2%'];
        var $vars  = Utils.prepareHandleVars(Test.INPUT_VARS);

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });

    it('handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $input = {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });

    it('return the exact input value [1]', function()
    {
        var $input = true;
        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });

    it('return the exact input value [2]', function()
    {
        var $input = Test.noop;
        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });

    it('return the exact input value [3]', function()
    {
        var $input = 123;
        Assert.strictEqual(Utils.replaceHandleItem($input, {}), $input);
    });
});

describe('Utils.replaceHandleArray()', function utilsReplaceHandleArrayTests()
{
    it('handle the array', function()
    {
        var $input = ['test 1 = %var1%', 'test 2 = %var2%'];
        var $vars  = Utils.prepareHandleVars(Test.INPUT_VARS);

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });
});

describe('Utils.replaceHandleObjext()', function utilsReplaceHandleObjectTests()
{
    it('handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(Test.INPUT_VARS);
        var $input = {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars), {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });

    it('only handle the objects own property', function()
    {
        /* jshint ignore:start */
        Object.prototype.confirgeTest = true;
        /* jshint ignore:end */

        var $vars  = Utils.prepareHandleVars(Test.INPUT_VARS);
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
