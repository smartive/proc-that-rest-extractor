import {Extractor} from 'proc-that';
import {Observable, Observer} from 'rxjs';

export enum RestExtractorMethod {
    Get,
    Post,
    Put
}

/**
 *
 */
export class RestExtractor implements Extractor {
    private rest:any = require('restler');

    /**
     *
     * @param url
     * @param method
     * @param resultSelector
     * @param {number} [timeout=120000] Request timeout in milliseconds
     */
    constructor(private url:string, private method:RestExtractorMethod = RestExtractorMethod.Get, private resultSelector:(obj:any) => any = o => o, private timeout: number = 120000) {
    }

    public read():Observable<any> {
        return Observable.create((observer:Observer<any>) => {
            this.rest
                .request(this.url, {
                    method: this.getUrlMethod(),
                    timeout: this.timeout
                })
                .on('error', err => {
                    observer.error(err);
                })
                .on('complete', result => {
                    try {
                        let json = typeof result === 'string' ? JSON.parse(result) : result;
                        json = this.resultSelector(json);
                        if (json instanceof Array || json.constructor === Array) {
                            json.forEach(element => observer.next(element));
                        } else {
                            observer.next(json)
                        }
                    } catch (e) {
                        observer.error(e);
                    } finally {
                        observer.complete();
                    }
                });
        });
    }

    private getUrlMethod():string {
        switch (this.method) {
            case RestExtractorMethod.Post:
                return 'post';
            case RestExtractorMethod.Put:
                return 'put';
            default:
                return 'get';
        }
    }
}