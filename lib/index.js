/**
 * confirge | lib/index.js
 * file version: 0.00.002
 */
'use strict';

var _          = require('underscore'),
    DeepExtend = require('deep-extend'),
    FileSystem = require('graceful-fs'),
    Utils      = require('./utils.js'),
    Yaml       = require('js-yaml');

////////////////////////////////////////////////////////////////////////////////

var Confirge = function($source)
{
    var $result = false;

    // execute function and return result
    if (_.isFunction($source))
    {
        $result = Confirge($source());
    }
    // when is object, no reason to do anything!
    else if (_.isObject($source))
    {
        $result = $source;
    }
    else if (_.isString($source))
    {
        $result = Confirge.readFile($source);
    }

    return $result;
};

/**
 * Read file and return object.
 *
 * @param {string} $file - File path to read.
 * @return {object|boolean}
 */
Confirge.readFile = function($file)
{
    var $result = false;

    try
    {
        $file   = FileSystem.readFileSync($file, 'utf8');
        $result = Yaml.safeLoad($file);
    }
    catch ($e)
    {
    }

    return $result;
};

/**
 * Replace vars in obj values.
 *
 * @param {object} $obj - Obj where values are checked and replaced.
 * @param {object} $vars - Vars to replace, key: value.
 * @return {object}
 */
Confirge.replaceVars = function($obj, $vars)
{
    var $key,
        $value;

    $obj  = Confirge($obj);
    $vars = Utils.prepareVars($vars);

    for($key in $obj)
    {
        if (!$obj.hasOwnProperty($key))
        {
            continue;
        }

        $value = $obj[$key];
        if (!_.isString($value))
        {
            continue;
        }

        $obj[$key] = Utils.replaceVars($value, $vars);
    }

    console.log($obj);

    return $obj;
};

// copy of deep-extend
Confirge.extend = DeepExtend;

/*
    Confirge - Flexible configuration!
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
