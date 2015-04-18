/**
 * confirge | lib/utils.js
 * file version: 0.00.002
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
            $regexp = /\%([0-9a-zA-Z\-_]+)\%/g,
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
     * @return {object} Returns the result object so it can be passed down.
     */
    'prepareVar': function($result, $vars, $search)
    {
        var $replace = $vars[$search];
        if (_.isUndefined($replace))
        {
            $result[$search] = false;
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

        $result[$search] =
        {
            'regexp':  new RegExp('%'+ $search +'%', 'g'),
            'replace': $replace
        };

        return $result;
    },

    /**
     * Prepare all given vars. If the value of a var contains another var, it
     * will be processed first. The function will return an object where all
     * vars will have a regexp to replace it's value and ofcourse the value
     * itself.
     *
     * @param {object|function} $vars - Object with vars, { varName: value }
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

            for(var $search in $vars)
            {
                if ($vars.hasOwnProperty($search) &&
                    _.isUndefined($result[$search]))
                {
                    $result = Utils.prepareVar($result,
                                               $vars,
                                               $search);
                }
            }
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
        if (!_.isObject($vars) || _.isArray($vars) || _.isFunction($vars))
        {
            return $str;
        }

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
    }
};

module.exports = Utils;
