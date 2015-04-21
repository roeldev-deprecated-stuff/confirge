/**
 * confirge | test/main.js
 * file version: 0.00.005
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
var EXPECTED_VARS =
{
    'var1':
    {
        'regexp':  new RegExp('%var1%', 'g'),
        'replace': 'value1'
    }
};

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

//------------------------------------------------------------------------------

describe('Confirge()', function()
{
    it('should return the same object', function()
    {
        Assert.equal(Confirge(OBJ_PLAIN), OBJ_PLAIN);
    });

    it('should read the file and return an object', function()
    {
        var $actual = Confirge(getFixtureFile('success.json'));

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
            return Confirge.read(getFixtureFile('success.yml'));
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

describe('Confirge.read()', function()
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

        Assert.equal($actual, false);
    });

    it('should fail reading the json file', function()
    {
        var $actual = Confirge.read( getFixtureFile('failure.json') );

        Assert.equal($actual, false);
    });

    it('should fail reading the unexisting file', function()
    {
        var $actual = Confirge.read( getFixtureFile('does-not.exists') );

        Assert.equal($actual, false);
    });
});

describe('Confirge.replace()', function()
{
    it('should replace a string var', function()
    {
        var $input = { 'str': '%var1%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS),
        {
            'str': 'value1'
        });
    });

    it('should replace a string var, twice', function()
    {
        var $input = { 'str': '%var1% is equal to %var1%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS),
        {
            'str': 'value1 is equal to value1'
        });
    });

    it('should replace a string var and keep the other', function()
    {
        var $input = { 'str': '%var1% is not equal to %var2%' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS),
        {
            'str': 'value1 is not equal to %var2%'
        });
    });

    it('should return the same object [1]', function()
    {
        var $input = { 'str': 'do %not% replace %anything%!' };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS), $input);
    });

    it('should return the same object [2]', function()
    {
        var $input =
        [
            'test',
            '123',

            function()
            {
                return false;
            }
        ];

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS), $input);
    });

    it('should replace the vars deep inside the object', function()
    {
        var $input =
        {
            'key1':
            {
                'key1-2': 'replace me! %var1%'
            },

            'key2':
            {
                'key2-2':
                [
                    'replace me too! %var1%',
                    'skip me! %var2%',

                    [
                        'down the rabbit hole',
                        'last %var1% replacement'
                    ]
                ]
            }
        };

        Assert.deepEqual(Confirge.replace($input, INPUT_VARS),
        {
            'key1':
            {
                'key1-2': 'replace me! value1'
            },

            'key2':
            {
                'key2-2':
                [
                    'replace me too! value1',
                    'skip me! %var2%',

                    [
                        'down the rabbit hole',
                        'last value1 replacement'
                    ]
                ]
            }
        });
    });
});

describe('Confirge.extend()', function()
{
    // remove prototype added by Utils.replaceHandleObject() testcase
    // otherwise, it will cause this test to fail
    delete Object.prototype.confirgeTest;

    it('should extend the object and return an object [1]', function()
    {
        var $actual = Confirge.extend(OBJ_PLAIN, INPUT_VARS);

        Assert.deepEqual($actual,
        {
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

        Assert.deepEqual($actual,
        {
            'title':   'test obj',
            'success': true,
            'var1':    'value1'
        });
    });

    it('should return the same object [1]', function()
    {
        Assert.deepEqual(Confirge.extend(OBJ_PLAIN), OBJ_PLAIN);
    });

    it('should return the same object [2]', function()
    {
        Assert.deepEqual(Confirge.extend(OBJ_PLAIN, false), OBJ_PLAIN);
    });
});

//------------------------------------------------------------------------------

describe('Utils.noop()', function()
{
    it('is only here to get 100% code coverage', function()
    {
        Assert.equal(Utils.noop(), null);
    });
});

describe('Utils.findReplacements()', function()
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
        Assert.equal(Utils.findReplacements('%test %test'), false);
    });

    it('no replacements found [2]', function()
    {
        Assert.equal(Utils.findReplacements('test% test%'), false);
    });

    it('no replacements found [3]', function()
    {
        Assert.equal(Utils.findReplacements('% test % test'), false);
    });
});

describe('Utils.prepareVar()', function()
{
    it('should return an object with regexp and replace value', function()
    {
        var $actual = Utils.prepareVar({}, INPUT_VARS, 'var1');

        Assert.deepEqual($actual, EXPECTED_VARS);
    });

    it('should replace the replacement var', function()
    {
        var $input =
        {
            'var1': 'value1 %var2%',
            'var2': 'value2'
        };

        Assert.deepEqual(Utils.prepareVar({}, $input, 'var1'),
        {
            'var1':
            {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 value2'
            },

            'var2':
            {
                'regexp':  new RegExp('%var2%', 'g'),
                'replace': 'value2'
            }
        });
    });

    it('should not replace the replacement var', function()
    {
        var $input = { 'var1': 'value1 %var2%' };

        Assert.deepEqual(Utils.prepareVar({}, $input, 'var1'),
        {
            'var1':
            {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 %var2%'
            },

            'var2': false
        });
    });
});

describe('Utils.prepareVars()', function()
{
    it('it should flatten a multilevel vars object', function()
    {
        var $input =
        {
            'level1':
            {
                'level2': INPUT_VARS
            }
        };

        Assert.deepEqual(Utils.prepareVars({}, $input),
        {
            'level1.level2.var1':
            {
                'regexp':  new RegExp('%level1.level2.var1%', 'g'),
                'replace': 'value1'
            }
        });
    });
});

describe('Utils.prepareHandleVars()', function()
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
        var $input =
        {
            'var1': 'value1 %var3%',
            'var2': 'value2',
            'var3': 'value3 %var2%'
        };

        Assert.deepEqual(Utils.prepareHandleVars($input),
        {
            'var2':
            {
                'regexp':  new RegExp('%var2%', 'g'),
                'replace': 'value2'
            },

            'var3':
            {
                'regexp':  new RegExp('%var3%', 'g'),
                'replace': 'value3 value2'
            },

            'var1':
            {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1 value3 value2'
            }
        });
    });

    it('should flatten and return an object with prepared vars', function()
    {
        var $input =
        {
            'var1': 'value1',
            'var2':
            {
                'a': 'value2a',
                'b': 'value2b'
            }
        };

        Assert.deepEqual(Utils.prepareHandleVars($input),
        {
            'var1':
            {
                'regexp':  new RegExp('%var1%', 'g'),
                'replace': 'value1'
            },

            'var2.a':
            {
                'regexp':  new RegExp('%var2.a%', 'g'),
                'replace': 'value2a'
            },

            'var2.b':
            {
                'regexp':  new RegExp('%var2.b%', 'g'),
                'replace': 'value2b'
            }
        });
    });

    it('should return false [1]', function()
    {
        Assert.equal(Utils.prepareHandleVars([]), false);
    });

    it('should return false [2]', function()
    {
        Assert.equal(Utils.prepareHandleVars(''), false);
    });
});

describe('Utils.replaceVars()', function()
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

        Assert.equal($actual, $input);
    });

    it('should return the exact string [2]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, false);

        Assert.equal($actual, $input);
    });

    it('should return the exact string [3]', function()
    {
        var $input  = 'the value is %var2%';
        var $actual = Utils.replaceVars($input, {});

        Assert.equal($actual, $input);
    });
});

describe('Utils.replaceHandleItem()', function()
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

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars),
        [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });

    it('should handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);
        var $input =
        {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars),
        {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });

    it('should return the exact input value [1]', function()
    {
        var $input = true;

        Assert.equal(Utils.replaceHandleItem($input, {}), $input);
    });

    it('should return the exact input value [2]', function()
    {
        var $input = Utils.noop;

        Assert.equal(Utils.replaceHandleItem($input, {}), $input);
    });

    it('should return the exact input value [3]', function()
    {
        var $input = 123;

        Assert.equal(Utils.replaceHandleItem($input, {}), $input);
    });
});

describe('Utils.replaceHandleArray()', function()
{
    it('should handle the array', function()
    {
        var $input = ['test 1 = %var1%', 'test 2 = %var2%'];
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars),
        [
            'test 1 = value1',
            'test 2 = %var2%'
        ]);
    });
});

describe('Utils.replaceHandleObject()', function()
{
    it('should handle the object', function()
    {
        var $vars  = Utils.prepareHandleVars(INPUT_VARS);
        var $input =
        {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars),
        {
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
        var $input =
        {
            'test1': 'test 1 = %var1%',
            'test2': 'test 2 = %var2%'
        };

        Assert.deepEqual(Utils.replaceHandleItem($input, $vars),
        {
            'test1': 'test 1 = value1',
            'test2': 'test 2 = %var2%'
        });
    });
});
