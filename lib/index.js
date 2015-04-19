/**
 * confirge | lib/index.js
 * file version: 0.00.004
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
        $result = Confirge.read($source);
    }

    return $result;
};

/**
 * Read file and return object.
 *
 * @param {string} $file - File path to read.
 * @return {object|boolean}
 */
Confirge.read = function($file)
{
    var $result = false;
    if (_.isFunction($file))
    {
        $result = Confirge.read($file());
    }
    else
    {
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
 * Replace vars in obj values.
 *
 * @param {object|array} $source - Object/Array where values are replaced.
 * @param {object} $vars - Vars to replace, { varName: value }.
 * @return {object}
 */
Confirge.replace = function($source, $vars)
{
    $source = Confirge($source);
    $vars   = Utils.prepareVars($vars);

    if (_.isArray($source))
    {
        $source = Utils.replaceHandleArray($source, $vars);
    }
    else if (_.isObject($source))
    {
        $source = Utils.replaceHandleObject($source, $vars);
    }

    return $source;
};

// copy of deep-extend
Confirge.extend = DeepExtend;

/*
    Confirge
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
