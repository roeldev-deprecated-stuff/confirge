/**
 * confirge | lib/utils.js
 * file version: 0.00.004
 */
'use strict';

var _ = require('underscore');

////////////////////////////////////////////////////////////////////////////////

var Utils =
{
    /**
     * Search for replacements and return a array with each replacement string.
     * Returns `false` when no replacements are found.
     *
     * @param {string} $str - The String to search in.
     * @return {array|boolean}
     */
    'findReplacements': function($str)
    {
        var $result = {},
            $found  = false,
            $regexp = /\%([0-9a-zA-Z\-_\.]+)\%/g,
            $match;

        while (!!($match = $regexp.exec($str)))
        {
            $result[$match[1]] = true;
            $found = true;
        }

        return ($found ? _.keys($result) : false);
    },

    /**
     * Prepares the given var $search. If it's value contains a replacement, it
     * will be prepared first and it's value will be replaced for the current
     * var.
     *
     * @param {object} $result - Object with regexps and replaced vars
     * @param {object} $vars - Object with all available vars
     * @param {string} $search - The var to prepare
     * @param {string} $level [''] - The current level
     * @return {object} Returns the result object so it can be passed down.
     */
    'prepareVar': function($result, $vars, $search, $level)
    {
        if (!_.isString($level))
        {
            $level = '';
        }

        var $replace = $vars[$search];
        if (_.isUndefined($replace))
        {
            $result[$level + $search] = false;
            return $result;
        }

        var $replacements = Utils.findReplacements($replace),
            $replacement;

        if ($replacements !== false)
        {
            // loop through replacements and prepare them. by doing this we can
            // use the result for the current search's replace value
            for (var $i = 0, $iL = $replacements.length; $i < $iL; $i++)
            {
                $replacement = $replacements[$i];
                if (_.isUndefined($result[$replacement]))
                {
                    $result = Utils.prepareVar($result, $vars, $replacement);
                }

                // replace the found var inside the current var's replace value
                $replacement = $result[$replacement];
                if($replacement !== false)
                {
                    $replace = $replace.replace($replacement.regexp,
                                                $replacement.replace);
                }
            }
        }

        $result[$level + $search] =
        {
            'regexp':  new RegExp('%'+ $level + $search +'%', 'g'),
            'replace': $replace
        };

        return $result;
    },

    'prepareHandleObject': function($result, $vars, $level)
    {
        for (var $key in $vars)
        {
            if (!$vars.hasOwnProperty($key))
            {
                continue;
            }

            var $value = $vars[$key];

            if (_.isObject($value) && !_.isArray($value))
            {
                Utils.prepareHandleObject($result, $value, $level + $key +'.');
            }
            else if (_.isUndefined($result[$key]))
            {
                $result = Utils.prepareVar($result, $vars, $key, $level);
            }
        }

        return $result;
    },

    /**
     * Prepare all given vars. If the value of a var contains another var, it
     * will be processed first. The function will return an object where all
     * vars will have a regexp to replace it's value and ofcourse the value
     * itself.
     *
     * @param {object|function} $vars - Object with vars, { varName: value }.
     * @return {object|boolean}
     */
    'prepareVars': function($vars)
    {
        if (_.isFunction($vars))
        {
            return Utils.prepareVars($vars());
        }

        var $result = false;
        if (_.isObject($vars) && !_.isArray($vars))
        {
            $result = {};
            Utils.prepareHandleObject($result, $vars, '');
        }

        return $result;
    },

    /**
     * Replace the vars inside the string.
     *
     * @param {string} $str - String to search and replace the vars in.
     * @param {object} $vars - The prepared vars to use for the replacements.
     * @return {string}
     */
    'replaceVars': function($str, $vars)
    {
        var $replacements = Utils.findReplacements($str),
            $replacement,
            $var;

        if ($replacements !== false)
        {
            // when replacements are found... try to replace them
            for (var $i = 0, $iL = $replacements.length; $i < $iL; $i++)
            {
                $replacement = $replacements[$i];
                $var         = $vars[$replacement];

                // check if the replacement is a var inside the prepared vars
                // object, only then can we replace the value
                if (!_.isUndefined($var))
                {
                    $str = $str.replace($var.regexp, $var.replace);
                }
            }
        }


        return $str;
    },

    /**
     * Handle an item by passing it to either the `replaceVars()`,
     * `replaceHandleArray()` or `replaceHandleObject()` functions, or by
     * returning the original input value.
     *
     * @param {mixed} $value - The item value to handle.
     * @param {object} $vars - Object with prepared vars.
     * @return {mixed}
     */
    'replaceHandleItem': function($value, $vars)
    {
        if (_.isString($value))
        {
            $value = Utils.replaceVars($value, $vars);
        }
        else if (_.isArray($value))
        {
            $value = Utils.replaceHandleArray($value, $vars);
        }
        else if (_.isObject($value))
        {
            $value = Utils.replaceHandleObject($value, $vars);
        }

        return $value;
    },

    /**
     * Handle an array by looping through it's values and passing them to
     * `replaceHandleItem()`.
     *
     * @param {array} $array - The array to loop through.
     * @param {object} $vars - Object with prepared vars.
     * @return {array}
     */
    'replaceHandleArray': function($array, $vars)
    {
        for (var $i = 0, $iL = $array.length; $i < $iL; $i++)
        {
            $array[$i] = Utils.replaceHandleItem($array[$i], $vars);
        }

        return $array;
    },

    /**
     * Handle an object by looping through it's values and passing them to
     * `replaceHandleItem()`.
     *
     * @param {object} $obj - The object to loop through.
     * @param {object} $vars - Object with prepared vars.
     * @return {object}
     */
    'replaceHandleObject': function($obj, $vars)
    {
        for (var $key in $obj)
        {
            if (!$obj.hasOwnProperty($key))
            {
                continue;
            }

            $obj[$key] = Utils.replaceHandleItem($obj[$key], $vars);
        }

        return $obj;
    }
};

module.exports = Utils;
