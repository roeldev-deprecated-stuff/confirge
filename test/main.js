/**
 * confirge | test/main.js
 * file version: 0.00.001
 */
'use strict';

var Assert   = require('assert'),
    Confirge = require('../lib/index.js'),
    Path     = require('path');

var OBJ_PLAIN = { 'title': 'test js obj', 'success': true },
    OBJ_YAML  = { 'title': 'test yaml', 'success': true },
    OBJ_JSON  = { 'title': 'test json', 'success': true };

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
        Assert.deepEqual(OBJ_YAML, Confirge(function()
        {
            return getFixtureFile('success.yml');
        }) );
    });

    it('should execute the function and return an object', function()
    {
        Assert.deepEqual(OBJ_YAML, Confirge(function()
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
        Assert.deepEqual(OBJ_YAML, $result);
    });

    it('should read the json file and return an object', function()
    {
        var $result = Confirge.readFile( getFixtureFile('success.json') );
        Assert.deepEqual(OBJ_JSON, $result);
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
