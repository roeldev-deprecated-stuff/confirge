/**
 * confirge | test/_common.js
 *
 * Shared test values for all unit tests.
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

    'FALLBACK1': {
        'title':   'fallback yaml',
        'success': true
    },

    'FALLBACK2': {
        'title':   'fallback json',
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
