import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {RestExtractor} from './RestExtractor';

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

describe('RestExtractor', () => {

    let extractor:RestExtractor;

    beforeEach(() => {
        extractor = new RestExtractor();
    });

    
});
