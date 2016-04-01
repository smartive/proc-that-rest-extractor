# RestExtractor [![Build Status](https://travis-ci.org/buehler/proc-that-rest-extractor.svg?branch=master)](https://travis-ci.org/buehler/proc-that-rest-extractor)
Modular extractor for `proc-that`. Loads items from REST APIs via http requests.
Uses [restler](https://github.com/danwrong/restler) for downloading resources.

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
