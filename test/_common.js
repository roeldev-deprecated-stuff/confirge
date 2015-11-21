/**
 * confirge | test/_common.js
 */
'use strict';

module.exports =
{
    'OBJ_PLAIN': {
        'title':   'test obj',
        'success': true
    },

    'EXPECTED_YAML': {
        'title':   'test yaml',
        'success': true
    },

    'EXPECTED_JSON': {
        'title':   'test json',
        'success': true
    },

    'INPUT_VARS': {
        'var1': 'value1'
    },

    'EXPECTED_VARS': {
        'var1': {
            'regexp':  new RegExp('%var1%', 'g'),
            'replace': 'value1'
        }
    },

    noop: function()
    {
    }
};
