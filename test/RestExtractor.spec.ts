import { RestExtractor, RestExtractorMethod } from '../src';
import { EventEmitter } from 'events';

abstract class Mock {
    public request(url: string, opt: any): EventEmitter {
        let emitter = new EventEmitter();
        setTimeout(() => {
            try {
                let data = this.data();
                emitter.emit('complete', data);
            } catch (e) {
                emitter.emit('error', e);
            }
        }, 100);
        return emitter;
    }

    protected abstract data(): any;
}

class ArrayMock extends Mock {
    protected data(): any {
        return [
            { objId: 1 },
            { objId: 2 },
            { objId: 3 },
            { objId: 4 },
            { objId: 5 }
        ];
    }
}

class ObjectMock extends Mock {
    protected data(): any {
        return { objId: 5 };
    }
}

class ErrorMock extends Mock {
    protected data(): any {
        throw new Error('test');
    }
}

class StringMock extends Mock {
    protected data(): any {
        return '{"objId":5}';
    }
}

class StringErrorMock extends Mock {
    protected data(): any {
        return '{objId:5}';
    }
}

class SelectorMock extends Mock {
    protected data(): any {
        return {
            data: [{ objId: 5 }]
        };
    }
}

describe('RestExtractor', () => {

    let extractor: RestExtractor;

    beforeEach(() => {
        extractor = new RestExtractor('url');
    });

    it('should get an array of objects', done => {
        let spy = jest.fn();
        (extractor as any).rest = new ArrayMock();

        extractor
            .read()
            .subscribe(spy, err => {
                done(err);
            }, () => {
                try {
                    expect(spy.mock.calls.length).toBe(5);
                    expect(spy.mock.calls[0][0]).toMatchSnapshot();                    
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should get single object', done => {
        let spy = jest.fn();
        (extractor as any).rest = new ObjectMock();

        extractor
            .read()
            .subscribe(spy, err => {
                done(err);
            }, () => {
                try {
                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][0]).toMatchSnapshot();                    
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should call error', done => {
        (extractor as any).rest = new ErrorMock();

        extractor
            .read()
            .subscribe(null, err => {
                done();
            }, () => {
                done(new Error('did not throw'));
            });
    });

    it('should parse string to an object', done => {
        let spy = jest.fn();
        (extractor as any).rest = new StringMock();

        extractor
            .read()
            .subscribe(spy, err => {
                done(err);
            }, () => {
                try {
                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][0]).toMatchSnapshot();
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should call error on an invalid parse', done => {
        (extractor as any).rest = new StringErrorMock();

        extractor
            .read()
            .subscribe(null, err => {
                done();
            }, () => {
                done(new Error('did not throw'));
            });
    });

    it('should use resultSelector correctly', done => {
        let spy = jest.fn();
        extractor = new RestExtractor('url', RestExtractorMethod.Get, o => o.data);
        (extractor as any).rest = new SelectorMock();

        extractor
            .read()
            .subscribe(spy, err => {
                done(err);
            }, () => {
                try {
                    expect(spy.mock.calls.length).toBe(1);
                    expect(spy.mock.calls[0][0]).toMatchSnapshot();
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('should set request timeout', done => {
        extractor = new RestExtractor('url', RestExtractorMethod.Get, undefined, {
            timeout: 42
        });
        (extractor as any).rest = new SelectorMock();

        (extractor as any).rest.request = jest.fn((extractor as any).rest.request);

        extractor
            .read()
            .subscribe(() => { }, err => {
                done(err);
            }, () => {
                try {
                    expect((extractor as any).rest.request.mock.calls[0]).toMatchSnapshot();
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
