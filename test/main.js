/**
 * confirge | test/main.js
 * file version: 0.00.002
 */
'use strict';

var Assert   = require('assert'),
    Confirge = require('../lib/index.js'),
    Path     = require('path'),
    Utils    = require('../lib/utils.js');

var OBJ_PLAIN   = { 'title': 'test obj', 'success': true },
    RESULT_YAML = { 'title': 'test yaml', 'success': true },
    RESULT_JSON = { 'title': 'test json', 'success': true },

    RESULT_VARS =
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
    return Path.resolve(__dirname, './fixtures/'+ $file);
}

//------------------------------------------------------------------------------

describe('Confirge()', function()
{
    it('should return the same object', function()
    {
        Assert.equal(OBJ_PLAIN, Confirge(OBJ_PLAIN));
    });

    it('should execute the function, read the file, and return an object', function()
    {
        Assert.deepEqual(RESULT_YAML, Confirge(function()
        {
            return getFixtureFile('success.yml');
        }) );
    });

    it('should execute the function and return an object', function()
    {
        Assert.deepEqual(RESULT_YAML, Confirge(function()
        {
            return Confirge.readFile(getFixtureFile('success.yml'));
        }) );
    });

    it('should execute the function and return the same object', function()
    {
        Assert.equal(OBJ_PLAIN, Confirge(function()
        {
            return OBJ_PLAIN;
        }) );
    });
});

describe('Confirge.readFile()', function()
{
    it('should read the yaml file and return an object', function()
    {
        var $result = Confirge.readFile( getFixtureFile('success.yml') );
        Assert.deepEqual(RESULT_YAML, $result);
    });

    it('should read the json file and return an object', function()
    {
        var $result = Confirge.readFile( getFixtureFile('success.json') );
        Assert.deepEqual(RESULT_JSON, $result);
    });

    it('should fail reading the yaml file', function()
    {
        var $result = Confirge.readFile( getFixtureFile('failure.yml') );
        Assert.equal(false, $result);
    });

    it('should fail reading the json file', function()
    {
        var $result = Confirge.readFile( getFixtureFile('failure.json') );
        Assert.equal(false, $result);
    });

    it('should fail reading the unexisting file', function()
    {
        var $result = Confirge.readFile( getFixtureFile('does-not.exists') );
        Assert.equal(false, $result);
    });
});

/*describe('Confirge.replaceVars()', function()
{
    it('should replace a string var', function()
    {
        var $input  = { 'str': '%var1%' },
            $output = { 'str': 'value1' },
            $vars   = { 'var1': 'value1' };

        Assert.deepEqual($output, Confirge.replaceVars($input, $vars))
    });

    it('should replace a string var, twice', function()
    {
        var $input  = { 'str': '%var1% is equal to %var1%' },
            $output = { 'str': 'value1 is equal to value1' },
            $vars   = { 'var1': 'value1' };

        Assert.deepEqual($output, Confirge.replaceVars($input, $vars))
    });
});*/

describe('Utils.needsReplacement()', function()
{
    it('has a var and should be replaced [1]', function()
    {
        var $result = Utils.needsReplacement('%test%!');
        Assert($result, 'test');
    });

    it('has a var and should be replaced [2]', function()
    {
        var $result = Utils.needsReplacement('bla bla.. %test-test%');
        Assert.equal($result, 'test-test');
    });

    it('has a var and should be replaced [3]', function()
    {
        var $result = Utils.needsReplacement('jada, %test_test% na na!');
        Assert.equal($result, 'test_test');
    });

    it('does not have a var and should not be replaced [1]', function()
    {
        Assert(!Utils.needsReplacement('%test %test'));
    });

    it('does not have a var and should not be replaced [2]', function()
    {
        Assert(!Utils.needsReplacement('test% test%'));
    });

    it('does not have a var and should not be replaced [3]', function()
    {
        Assert(!Utils.needsReplacement('% test % test'));
    });
});

describe('Utils.prepareVar()', function()
{
    it('should return an object with regexp and replace value', function()
    {
        Assert.deepEqual(Utils.prepareVar({}, {}, 'var1', 'value1'), RESULT_VARS);
    });
});

describe('Utils.prepareVars()', function()
{
    it('should return an object with regexp and replace value', function()
    {
        Assert.deepEqual(Utils.prepareVars({ 'var1': 'value1' }), RESULT_VARS);
    });

    it('should return an object with regexp and prepared replace values', function()
    {
        var $input =
        {
            'var1': 'value1 %var3%',
            'var2': 'value2',
            'var3': 'value3 %var2%'
        },

        $result =
        {
            'var2': { 'regexp': new RegExp('%var2%', 'g'), 'replace': 'value2' },
            'var3': { 'regexp': new RegExp('%var3%', 'g'), 'replace': 'value3 value2' },
            'var1': { 'regexp': new RegExp('%var1%', 'g'), 'replace': 'value1 value3 value2' }
        };

        //Assert.deepEqual(Utils.prepareVars($input), $result);
    });
});

