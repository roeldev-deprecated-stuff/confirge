# confirge

  [![NPM Version][npm-img]][npm-url]
  [![Linux Build][travis-img]][travis-url]
  [![Windows Build][appveyor-img]][appveyor-url]
  [![Test Coverage][coveralls-img]][coveralls-url]
  [![Dependency Status][david-img]][david-url]

[npm-img]: https://badge.fury.io/js/confirge.svg
[npm-url]: https://www.npmjs.com/package/confirge
[travis-img]: https://img.shields.io/travis/roeldev/confirge/master.svg?label=linux
[travis-url]: https://travis-ci.org/roeldev/confirge
[appveyor-img]: https://img.shields.io/appveyor/ci/roeldev/confirge/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/roeldev/confirge
[coveralls-img]: https://img.shields.io/coveralls/roeldev/confirge/master.svg
[coveralls-url]: https://coveralls.io/r/roeldev/confirge?branch=master
[david-img]: https://david-dm.org/roeldev/confirge.svg
[david-url]: https://david-dm.org/roeldev/confirge

**Flexible configuration!**

Confirge aims to make configuration of modules easy and flexible. It supports different ways of creating config objects or reading config files. To make things even more flexible you can make use of a simple 'variable template system' to replace often used strings (eg. directories/names) in your config objects.



## Installation
```sh
npm install --save confirge
```

## How to use
```js
var confirge = require('confirge');

// basic usage, load from a file (YAML or JSON)
var config = confirge('config.yml');

// load from a file, returned by a function
config = confirge(function()
{
    return 'config.json';
});

// extend objects
config = confirge.extend(config,
{
    'example': '%var1% and %var2%'
});

// will replace vars inside the config obj, eg. %var1%, %var2%
// this will result in { 'example': 'value1 and value2' }
config = confirge.replace(config,
{
    'var1': 'value1',
    'var2': 'value2'
});
```

## API
- [confirge()][api-confirge]
- [confirge.read()][api-confirge-read]
- [confirge.replace()][api-confirge-replace]
- [confirge.extend()][api-confirge-extend]


### confirge(source)
Handles a string (file path), function, or object source and returns an object.

- <h4>source</h4>
<table>
<tr><td>Type</td><td><code>string</code>, <code>function</code> or <code>object</code></td></tr>
</table>
When passing a string, it is assumed it is the path to a file. When not absolute, the path will be used relative from `process.cwd()`.
A function will be executed and it's result will be used. This result can be one of the accepted values, `string`, `function` or `object`.
Objects are just returned the same as they came in.


### confirge.read(file)
Read file and return object. Returns `false` on failure.
When a function is passed, it is assumed it returns the path to a file wich should be read.

- <h4>file</h4>
<table>
<tr><td>Type</td><td><code>string</code> or <code>function</code></td></tr>
</table>
When passing a string, it is assumed it is the path to a file. When not absolute, the path will be used relative from `process.cwd()`.
A function will be executed and it's result will be used. This result can be one of the accepted values, `string` or `function`.


### confirge.replace(source, vars)
Loops through all (nested) source values and replaces any found variables.

- <h4>source</h4>
<table>
<tr><td>Type</td><td><code>object</code> or <code>array</code></td></tr>
</table>
The function will loop through the values of the object or array and replace any found vars (eg. `%dir%`) for their values. Multilevel objects and arrays are supported.

- <h4>vars</h4>
<table>
<tr><td>Type</td><td><code>object</code></td></tr>
</table>
An object with variables wich should be used on the source object or array. Multilevel objects are supported, variables can be used with dot notation.

```js
var source =
{
    'config-option':   '%some-var%',
    'other-option':    true,
    'supported-types': ['object', '%types.a%']
};

var vars =
{
    'some-var': 'some-value',    // %some-var%
    'types':    { 'a': 'array' } // %types.a%
};

var result = confirge.replace(source, vars);

// the result will be:
result =
{
    'config-option':   'some-value',
    'other-option':    true,
    'supported-types': ['object', 'array']
};
```


### confirge.extend(source...)
Extend a base object with the given sources. These sources are handled by the main `confirge` function and are only used if objects are returned.

- <h4>source</h4>
<table>
<tr><td>Type</td><td><code>string</code>, <code>function</code> or <code>object</code></td></tr>
</table>


[api-confirge]: #confirgesource
[api-confirge-read]: #confirgereadfile
[api-confirge-replace]: #confirgereplacesource-vars
[api-confirge-extend]: #confirgeextendsource
