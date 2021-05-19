import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
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
        map((items: HelpArticle[]) => this.filterRoles(items)),
        shareReplay(1)
      );

    this.moduleArticles$ = this.state.page$
      .pipe(
        switchMap(({module}) => (
          module ?
            this.dbService.getDocumentsSimple('help', 'order', {key: 'module', operator: '==', value: module.id}) :
            of([])
        ) as Observable<HelpArticle[]>),
        map(items => this.filterRoles(items)),
        shareReplay(1)
      );
  }

  dbService: any;
  state: {
    page$: Observable<{module?: {id: string, name: string}}>,
    role: string;
  };
  open$ = new BehaviorSubject(false);

  generalArticles$: Observable<HelpArticle[]>;
  moduleArticles$: Observable<HelpArticle[]>;

  toggle() {
    this.open$.next(!this.open$.getValue())
  }

  filterRoles(items: HelpArticle[]) {
    return items.filter(it =>
      !it.roles || it.roles.includes(this.state.role)
    )
  }
}
