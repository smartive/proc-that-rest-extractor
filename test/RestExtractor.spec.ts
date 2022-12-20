import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { RestExtractor } from '../src';

const arrayMock = [{ objId: 1 }, { objId: 2 }, { objId: 3 }, { objId: 4 }, { objId: 5 }];

const objectMock = { objId: 5 };

const errorMock = new Error('test');

const stringMock = '{"objId":5}';

const stringErrorMock = '{objId:5}';

const selectorMock = {
  data: [{ objId: 5 }],
};

describe('RestExtractor', () => {
  let extractor: RestExtractor;
  let agent: MockAgent;
  let mockPool: Interceptable;

  beforeEach(() => {
    extractor = new RestExtractor('https://my.example.com');

    agent = new MockAgent();
    agent.disableNetConnect();

    setGlobalDispatcher(agent);
    mockPool = agent.get('https://my.example.com');
  });

  it('should get an array of objects', (done) => {
    const spy = jest.fn();
    mockPool.intercept({ path: '/' }).reply(200, arrayMock);

    extractor.read().subscribe({
      next: spy,
      error: (err) => {
        done(err);
      },
      complete: () => {
        try {
          expect(spy.mock.calls.length).toBe(5);
          expect(spy.mock.calls[0][0]).toMatchSnapshot();
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });

  it('should get single object', (done) => {
    const spy = jest.fn();
    mockPool.intercept({ path: '/' }).reply(200, objectMock);

    extractor.read().subscribe({
      next: spy,
      error: (err) => {
        done(err);
      },
      complete: () => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toMatchSnapshot();
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });

  it('should call error', (done) => {
    mockPool.intercept({ path: '/' }).replyWithError(errorMock);

    extractor.read().subscribe({
      error: () => {
        done();
      },
      complete: () => {
        done(new Error('did not throw'));
      },
    });
  });

  it('should call error on 500 status code', (done) => {
    mockPool.intercept({ path: '/' }).reply(500, 'server error');

    extractor.read().subscribe({
      error: () => {
        done();
      },
      complete: () => {
        done(new Error('did not throw'));
      },
    });
  });

  it('should call error on 404 not found', (done) => {
    mockPool.intercept({ path: '/' }).reply(404, 'not found');

    extractor.read().subscribe({
      error: () => {
        done();
      },
      complete: () => {
        done(new Error('did not throw'));
      },
    });
  });

  it('should parse string to an object', (done) => {
    const spy = jest.fn();
    mockPool.intercept({ path: '/' }).reply(200, stringMock);

    extractor.read().subscribe({
      next: spy,
      error: (err) => {
        done(err);
      },
      complete: () => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toMatchSnapshot();
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });

  it('should call error on an invalid parse', (done) => {
    mockPool.intercept({ path: '/' }).reply(200, stringErrorMock);

    extractor.read().subscribe({
      error: () => {
        done();
      },
      complete: () => {
        done(new Error('did not throw'));
      },
    });
  });

  it('should use resultSelector correctly', (done) => {
    const spy = jest.fn();
    extractor = new RestExtractor('https://my.example.com/url', (o) => o.data);
    mockPool.intercept({ path: '/url' }).reply(200, selectorMock);

    extractor.read().subscribe({
      next: spy,
      error: (err) => {
        done(err);
      },
      complete: () => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toMatchSnapshot();
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });

  it('should set request options', (done) => {
    const spy = jest.fn();
    extractor = new RestExtractor('https://my.example.com/url', undefined, {
      headers: {
        'x-test': 'test',
        authorization: 'Bearer 123',
      },
    });
    mockPool.intercept({ path: '/url' }).reply(200, (req) => {
      expect(req.headers).toMatchSnapshot();
      return selectorMock;
    });

    extractor.read().subscribe({
      next: spy,
      error: (err) => {
        done(err);
      },
      complete: () => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toMatchSnapshot();
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });
});
