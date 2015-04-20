# confirge

  [![NPM Version][npm-img]][npm-url]
  [![Linux Build][travis-img]][travis-url]
  [![Windows Build][appveyor-img]][appveyor-url]
  [![Test Coverage][coveralls-img]][coveralls-url]
  [![Dependency Status][david-img]][david-url]

**Flexible configuration!**

## Installation
```sh
npm install --save confirge
```

## How to use
```js
var confirge = require('confirge'),
    config;

// basic usage, load from a file
config = confirge('config.yml');

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

#### `source`
> Type: `string`, `function` or `object`


### confirge.read(file)
Read file and return object. Returns `false` on failure.
When a function is passed, it is assumed this function returns the path to a file wich should be read.

#### `file`
> Type: `string` or `function`


### confirge.replace(source, vars)
Loops through all source values and replaces any used variables wich are defined in the vars object.

#### `source`
> Type: `object` or `array`

#### `vars`
> Type: `object`


### confirge.extend(source...)
Extend a base object with the given sources. These sources are handled by the main `confirge` function and are only used if objects are returned.

#### `source`
> Type: `string`, `function` or `object`


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

[api-confirge]: #confirge2
[api-confirge-read]: #1
[api-confirge-replace]: #2
[api-confirge-extend]: #3
