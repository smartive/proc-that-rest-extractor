import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {RestExtractor} from './RestExtractor';
import {EventEmitter} from 'events';

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

abstract class Mock {
    public request(url:string, opt:any):EventEmitter {
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

    protected abstract data():any;
}

class ArrayMock extends Mock {
    protected data():any {
        return [
            {objId: 1},
            {objId: 2},
            {objId: 3},
            {objId: 4},
            {objId: 5}
        ];
    }
}

class ObjectMock extends Mock {
    protected data():any {
        return {objId: 5};
    }
}

class ErrorMock extends Mock {
    protected data():any {
        throw new Error('test');
    }
}

describe('RestExtractor', () => {

    let extractor:RestExtractor;

    beforeEach(() => {
        extractor = new RestExtractor('url');
    });

    it('should get an array of objects', done => {
        let spy = sinon.spy();
        (extractor as any).rest = new ArrayMock();

        extractor
            .read()
            .subscribe(spy, err => {
                done(err);
            }, () => {
                try {
                    spy.should.have.callCount(5);
                    spy.firstCall.should.be.calledWithExactly({objId: 1});
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

});
