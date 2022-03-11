import {ChangeDetectionStrategy, Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilderComponent} from '@jaspero/form-builder';
import {safeEval} from '@jaspero/utils';
import {Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {QuickEditDialogComponent} from '../quick-edit-dialog/quick-edit-dialog.component';

@Component({
  selector: 'jmsp-quick-edit',
  templateUrl: './quick-edit.component.html',
  styleUrls: ['./quick-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickEditComponent implements OnInit {
  constructor(
    private injector: Injector,
    private dialog: MatDialog,
    private el: ElementRef
  ) { }

  id: string;
  icon: string;
  panelClass: string;
  dbService: any;

  @ViewChild(FormBuilderComponent, {static: false})
  formBuilderComponent: FormBuilderComponent;

  module$: Observable<any>;

  ngOnInit() {

    const {dataset} = this.el.nativeElement;

    this.icon = dataset.icon || 'edit';
    this.panelClass = dataset.panelClass || '';
    this.id = dataset.id || '';

    this.dbService = this.injector.get<any>('dbService' as any);
    this.module$ = this.injector.get<Observable<any>>('module' as any);
  }

  open() {
    this.module$
      .pipe(
        switchMap(module =>
          this.dbService.getDocument(module.id, this.id)
            .pipe(
              map(value => ({value, module}))
            )
        ),
        take(1)
      )
      .subscribe(({module, value}) => {
        if (module.layout.instance) {
          if (module.layout.instance.formatOnLoad) {
            const method = safeEval(module.layout.instance.formatOnLoad);

            if (method) {
              value = method(value);
            }
          }
        }

        const segments = module.metadata?.quickEditSegments || module.layout?.instance?.segments;

        this.dialog.open(
          QuickEditDialogComponent,
          {
            ...this.panelClass && {panelClass: this.panelClass},
            data: {
              form: {
                schema: module.schema,
                definitions: module.definitions,
                value,
                ...segments && {segments}
              },
              module,
              id: this.id,
              dbService: this.dbService
            }
          }
        )
      })
  }
}
