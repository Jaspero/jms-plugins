import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {fromEvent, Observable} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {helpConfig} from '../../help.module';
import {HelpService} from '../../help.service';
import {HelpArticle} from '../../interfaces/help-article.interface';
import {HelpConfig} from '../../interfaces/help-config.interface';

@Component({
  selector: 'jmsp-help-flyout',
  templateUrl: './help-flyout.component.html',
  styleUrls: ['./help-flyout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpFlyoutComponent implements OnInit {
  constructor(
    @Inject(helpConfig)
    private config: HelpConfig,
    private service: HelpService,
    private injector: Injector,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  @HostBinding('style.height.px') height: number;
  @HostBinding('style.width.px') width: number;
  @HostBinding('style.top.px') top: number;
  @HostBinding('style.left.px') left: number;

  @ViewChild('articleDialog', {static: true})
  articleDialogTemp: TemplateRef<any>;

  module$: Observable<string>;
  moduleArticles$: Observable<HelpArticle[]>;
  generalArticles$: Observable<HelpArticle[]>;

  article: HelpArticle;

  private stateService: {role: string, page$: Observable<{module?: {id: string, name: string}}>};

  get canEdit() {
    return this.config.canEdit.includes(this.stateService.role);
  }

  ngOnInit() {
    this.height = this.config.height;
    this.width = this.config.width;
    this.top = this.config.top;
    this.left = this.config.left;

    this.stateService = this.injector.get('stateService' as any);
    this.module$ = this.stateService.page$
      .pipe(
        map(({module}) => module?.name)
      );

    this.moduleArticles$ = this.service.moduleArticles$;
    this.generalArticles$ = this.service.generalArticles$;
  }

  startDrag() {

    fromEvent(document, 'mousemove')
      .pipe(
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((e: MouseEvent) => {
        this.top += e.movementY;
        this.left += e.movementX;
        this.cdr.markForCheck();
      });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.service.toggle();
  }

  back() {
    this.article = null;
    this.cdr.markForCheck();
  }

  edit() {
   this.router.navigate(['/m/help/overview']);
   this.onEscape();
  }

  readMore(article: HelpArticle) {
    if (article.short) {
      this.article = article;
      this.cdr.markForCheck();
    } else {
      this.readFull(article);
    }
  }

  readFull(article: HelpArticle) {
    this.article = article;

    this.dialog.open(this.articleDialogTemp, {
      width: '900px'
    })
  }
}
