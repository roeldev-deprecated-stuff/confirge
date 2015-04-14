/**
 * confirge | index.js
 * file version: 0.00.001
 */
'use strict';

var _          = require('underscore'),
    DeepExtend = require('deep-extend'),
    FileSystem = require('graceful-fs'),
    Yaml       = require('js-yaml');

////////////////////////////////////////////////////////////////////////////////

function varsReplace($str, $vars)
{
    var $replace;
    for(var $search in $vars)
    {
        if ($vars.hasOwnProperty($search))
        {
            $replace = $vars[$search];
            $str     = $str.replace('%'+ $search +'%', $replace);
        }
    }

    return $str;
}

//------------------------------------------------------------------------------

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
Confirge.replace = function($obj, $vars)
{
    var $key,
        $value;

    $obj = Confirge($obj);

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

        $obj[$key] = varsReplace($value, $vars);
    }

    return $obj;
};

// copy of deep-extend
Confirge.extend = DeepExtend;

module.exports = Confirge;
