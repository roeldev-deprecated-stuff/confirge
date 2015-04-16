/**
 * confirge | lib/utils.js
 * file version: 0.00.001
 */
'use strict';

var _ = require('underscore');

////////////////////////////////////////////////////////////////////////////////

var Utils =
{
    'needsReplacement': function($str)
    {
        var $result = /\%([0-9a-zA-Z\-_]+)\%/g.exec($str);
        return (!_.isNull($result) ? $result[1] : false);
    },

    'prepareVar': function($result, $vars, $search, $replace)
    {
        $result[$search] =
        {
            'regexp':  new RegExp('%'+ $search +'%', 'g'),
            'replace': $replace
        };

        return $result;
    },

    'prepareVars': function($vars)
    {
        var $result = {},
            $regexp;

        for(var $search in $vars)
        {
            if ($vars.hasOwnProperty($search) &&
                _.isUndefined($result[$search]))
            {
                $result = Utils.prepareVar($result,
                                           $vars,
                                           $search,
                                           $vars[$search]);
            }
        }

        return $result;
    },

    'replaceVars': function($str, $vars)
    {
        var $regexp,
            $replace;

        for(var $search in $vars)
        {
            if ($vars.hasOwnProperty($search))
            {
                $regexp  = new RegExp('%'+ $search +'%', 'g');
                $replace = $vars[$search];
                $str     = $str.replace($regexp, $replace);
            }
        }

        return $str;
    }
}

module.exports = Utils;
