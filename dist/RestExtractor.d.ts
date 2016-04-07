import {IExtract} from 'proc-that/dist/interfaces/IExtract';
import {Observable} from 'rxjs';
export declare enum RestExtractorMethod {
    Get = 0,
    Post = 1,
    Put = 2,
}
export declare class RestExtractor implements IExtract {
    private url;
    private method;
    private resultSelector;
    private rest;

    constructor(url:string, method?:RestExtractorMethod, resultSelector?:(obj:any) => any);

    read():Observable<any>;
    private getUrlMethod();
}
