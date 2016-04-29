import {IExtract} from 'proc-that';
import {Observable, Observer} from 'rxjs';

export enum RestExtractorMethod {
    Get,
    Post,
    Put
}

/**
 *
 */
export class RestExtractor implements IExtract {
    private rest:any = require('restler');

    /**
     *
     * @param url
     * @param method
     * @param resultSelector
     */
    constructor(private url:string, private method:RestExtractorMethod = RestExtractorMethod.Get, private resultSelector:(obj:any) => any = o => o) {
    }

    public read():Observable<any> {
        return Observable.create((observer:Observer<any>) => {
            this.rest
                .request(this.url, {
                    method: this.getUrlMethod()
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