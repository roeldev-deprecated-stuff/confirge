# Confirge
[![NPM version][npm-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Dependency Status][david-img]][david-url]

**Flexible configuration!**

## Installation
```sh
npm install --save confirge
```

## Usage
```js
var confirge = require('confirge'),
    config;

// basic usage, load from a file
config = confirge('config.yml');

// load from a file, returned by a function
config = confirge(function()
{
    return 'config.json'
});

// extend objects
config = confirge.extend(config,
{
    'example': '%var1% and %var2%'
});

// will replace vars inside the config obj, eg. %var1%, %var2%
config = confirge.replace(config,
{
    'var1': 'value1',
    'var2': 'value2'
});
```

[npm-img]: https://badge.fury.io/js/confirge.svg
[npm-url]: https://www.npmjs.com/package/confirge
[travis-img]: https://travis-ci.org/roeldev/confirge.svg?branch=master
[travis-url]: https://travis-ci.org/roeldev/confirge
[david-img]: https://david-dm.org/roeldev/confirge.svg
[david-url]: https://david-dm.org/roeldev/confirge
