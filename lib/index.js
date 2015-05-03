/**
 * confirge | lib/index.js
 * file version: 0.00.009
 */
'use strict';

var _          = require('underscore');
var DeepExtend = require('deep-extend');
var FileSystem = require('graceful-fs');
var Path       = require('path');
var Utils      = require('./utils.js');
var Yaml       = require('js-yaml');

////////////////////////////////////////////////////////////////////////////////

/**
 * Handles a string (file path), function, or object source and returns an
 * object.
 *
 * @param {string|function|object} $source
 * @return {object|boolean} Returns `false` on failure.
 */
function Confirge($source)
{
    var $result = false;

    // assume the string is a file path, read the file
    if (_.isString($source))
    {
        $result = Confirge.read($source);
    }
    // execute function and return result
    else if (_.isFunction($source))
    {
        $result = Confirge($source());
    }
    // when is object, no reason to do anything!
    else if (_.isObject($source))
    {
        $result = $source;
    }

    return $result;
}

/**
 * Read file and return object. Returns `false` on failure.
 * When a function is passed, it is assumed this function returns the path to a
 * file wich should be read.
 *
 * @param {string|function} $file - File path to read.
 * @return {object|boolean} Returns `false` on failure.
 */
Confirge.read = function confirgeRead($file)
{
    var $result = false;

    if (_.isFunction($file))
    {
        $result = Confirge.read($file());
    }
    else if (_.isString($file) && !_.isEmpty($file))
    {
        if (!Path.isAbsolute($file))
        {
            $file = Path.resolve(process.cwd(), $file);
        }

        try
        {
            $file   = FileSystem.readFileSync($file, 'utf8');
            $result = Yaml.safeLoad($file);
        }
        catch ($e)
        {
        }
    }

    return $result;
};

/**
 * Loops through all source values and replaces any used variables wich are
 * defined in the vars object.
 *
 * @param {object|array} $source - Object/Array where values are replaced.
 * @param {object} $vars - Vars to replace, { varName: value }.
 * @return {object}
 */
Confirge.replace = function confirgeReplace($source, $vars)
{
    var $isArray  = _.isArray($source);
    var $isObject = _.isObject($source);

    if ($isArray || $isObject)
    {
        $vars = Utils.prepareHandleVars($vars);

        if ($isArray)
        {
            $source = Utils.replaceHandleArray($source, $vars);
        }
        else if ($isObject)
        {
            $source = Utils.replaceHandleObject($source, $vars);
        }
    }

    return $source;
};

/**
 * Extend a base object with the given sources. These sources are handled by
 * the main `confirge` function and are only used if objects are returned.
 *
 * @param {string|function|object} $source
 * @return {object|boolean} Returns `false` on failure.
 */
Confirge.extend = function confirgeExtend($source)
{
    var $result  = false;
    var $sources = [];

    for (var $i = 0, $iL = arguments.length; $i < $iL; $i++)
    {
        $source = Confirge(arguments[$i]);

        if ($source !== false)
        {
            $sources.push($source);
        }
    }

    if ($sources.length === 1)
    {
        $result = $sources[0];
    }
    else if ($sources.length >= 2)
    {
        $result = DeepExtend.apply($sources[0], $sources);
    }

    return $result;
};

/*
    confirge
    Copyright (c) 2015 Roel Schut (roelschut.nl)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
module.exports = Confirge;
