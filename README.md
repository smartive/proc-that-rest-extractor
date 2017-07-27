# RestExtractor

[![Greenkeeper badge](https://badges.greenkeeper.io/smartive/proc-that-rest-extractor.svg)](https://greenkeeper.io/)
Modular extractor for `proc-that`. Loads items from REST APIs via http requests.
Uses [restler](https://github.com/danwrong/restler) for downloading resources.

##### A bunch of badges

[![Build Status](https://travis-ci.org/smartive/proc-that-rest-extractor.svg?maxAge=3600)](https://travis-ci.org/smartive/proc-that-rest-extractor) [![npm](https://img.shields.io/npm/v/proc-that-rest-extractor.svg?maxAge=3600)](https://www.npmjs.com/package/proc-that-rest-extractor) [![Coverage status](https://img.shields.io/coveralls/smartive/proc-that-rest-extractor.svg?maxAge=3600)](https://coveralls.io/github/smartive/proc-that-rest-extractor) [![license](https://img.shields.io/github/license/smartive/proc-that-rest-extractor.svg?maxAge=2592000)](https://github.com/smartive/proc-that-rest-extractor)

## Installation

```bash
npm install --save proc-that-rest-extractor
```

## Usage

```typescript
import {Etl} from 'proc-that';
import {RestExtractor} from 'proc-that-rest-extractor';

let extractor = new RestExtractor('http://my-rest-url.com/posts');

new Etl().addExtractor(extractor).start().subscribe(/*...*/);
```

### Custom result set

If the called API delivers a masked result (i.e. a JSON object with a `data` property)
you can pass a function into the constructor that is called on the result.

```typescript
import {Etl} from 'proc-that';
import {RestExtractor, RestExtractorMethod} from 'proc-that-rest-extractor';

let extractor = new RestExtractor('http://my-rest-url.com/posts', RestExtractorMethod.Get, result => result.data);

new Etl().addExtractor(extractor).start().subscribe(/*...*/);
```
