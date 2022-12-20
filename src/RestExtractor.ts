import { Extractor } from 'proc-that';
import { Observable, Observer } from 'rxjs';
import { fetch } from 'undici';

export class RestExtractor implements Extractor {
  constructor(
    private url: string,
    private resultSelector: (obj: any) => any = (o) => o,
    private init: Parameters<typeof fetch>[1] = {}
  ) {}

  public read(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      fetch(this.url, this.init)
        .then(async (response) => {
          try {
            if (!response.ok) {
              return observer.error(`Request failed with status ${response.status}: ${await response.text()}`);
            }

            const data = this.resultSelector(await response.json());
            if (data instanceof Array || data.constructor === Array) {
              data.forEach((element) => observer.next(element));
            } else {
              observer.next(data);
            }
          } catch (e) {
            observer.error(e);
          } finally {
            observer.complete();
          }
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
