"use strict";
var rxjs_1 = require('rxjs');
(function (RestExtractorMethod) {
    RestExtractorMethod[RestExtractorMethod["Get"] = 0] = "Get";
    RestExtractorMethod[RestExtractorMethod["Post"] = 1] = "Post";
    RestExtractorMethod[RestExtractorMethod["Put"] = 2] = "Put";
})(exports.RestExtractorMethod || (exports.RestExtractorMethod = {}));
var RestExtractorMethod = exports.RestExtractorMethod;
var RestExtractor = (function () {
    function RestExtractor(url, method, resultSelector) {
        if (method === void 0) {
            method = RestExtractorMethod.Get;
        }
        if (resultSelector === void 0) {
            resultSelector = function (o) {
                return o;
            };
        }
        this.url = url;
        this.method = method;
        this.resultSelector = resultSelector;
        this.rest = require('restler');
    }

    RestExtractor.prototype.read = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            _this.rest
                .request(_this.url, {
                    method: _this.getUrlMethod()
                })
                .on('error', function (err) {
                    observer.error(err);
                })
                .on('complete', function (result) {
                    try {
                        var json = typeof result === 'string' ? JSON.parse(result) : result;
                        json = _this.resultSelector(json);
                        if (json instanceof Array || json.constructor === Array) {
                            json.forEach(function (element) {
                                return observer.next(element);
                            });
                        }
                        else {
                            observer.next(json);
                        }
                    }
                    catch (e) {
                        observer.error(e);
                    }
                    finally {
                        observer.complete();
                    }
                });
        });
    };
    RestExtractor.prototype.getUrlMethod = function () {
        switch (this.method) {
            case RestExtractorMethod.Post:
                return 'post';
            case RestExtractorMethod.Put:
                return 'put';
            default:
                return 'get';
        }
    };
    return RestExtractor;
}());
exports.RestExtractor = RestExtractor;
//# sourceMappingURL=RestExtractor.js.map