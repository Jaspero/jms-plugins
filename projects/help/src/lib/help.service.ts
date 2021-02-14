import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {HelpArticle} from './interfaces/help-article.interface';

@Injectable()
export class HelpService {
  constructor(
    private injector: Injector
  ) {
    this.state = this.injector.get('stateService' as any);
    this.dbService = this.injector.get('dbService' as any);

    this.generalArticles$ =  this.dbService
      .getDocumentsSimple('help', 'order', {key: 'module', operator: '==', value: 'general'})
      .pipe(
        shareReplay(1)
      );

    this.moduleArticles$ = this.state.page$
      .pipe(
        tap(console.log),
        switchMap(({module}) => (
          module ?
            this.dbService.getDocumentsSimple('help', 'order', {key: 'module', operator: '==', value: module.id}) :
            of([])
        ) as Observable<HelpArticle[]>),
        shareReplay(1)
      );
  }

  dbService: any;
  state: {page$: Observable<{module?: {id: string, name: string}}>};
  open$ = new BehaviorSubject(false);

  generalArticles$: Observable<HelpArticle[]>;
  moduleArticles$: Observable<HelpArticle[]>;

  toggle() {
    this.open$.next(!this.open$.getValue())
  }
}
