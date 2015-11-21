/**
 * confirge | lib/index.js
 */
'use strict';

const _          = require('underscore');
const DeepExtend = require('deep-extend');
const FileSystem = require('fs');
const Path       = require('path');
const Utils      = require('./utils');
const Yaml       = require('js-yaml');

/**
 * Handles a string (file path), function, or object source and returns an
 * object.
 *
 * @param {string|function|object} $source
 * @return {object|boolean} Returns `false` on failure.
 */
function Confirge($source)
{
    let $result = false;

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
 * @param {array} $extension - Optional alternative file extensions to read.
 * @return {object|boolean} Returns `false` on failure.
 */
Confirge.read = function confirgeRead($file, $extensions)
{
    let $result = false;

    if (_.isFunction($file))
    {
        $result = Confirge.read($file(), $extensions);
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
    let $isArray  = Array.isArray($source);
    let $isObject = _.isObject($source);

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
    let $result  = false;
    let $sources = [];

    for (let $i = 0, $iL = arguments.length; $i < $iL; $i++)
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
