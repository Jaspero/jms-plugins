import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilderContextService, FormBuilderModule} from '@jaspero/form-builder';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule, TRANSLOCO_SCOPE} from '@ngneat/transloco';
import {QuickEditDialogComponent} from './components/quick-edit-dialog/quick-edit-dialog.component';
import {QuickEditComponent} from './components/quick-edit/quick-edit.component';

let qeRegistered = false;

@NgModule({
  declarations: [
    QuickEditComponent,
    QuickEditDialogComponent
  ],
  imports: [
    CommonModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,

    FormBuilderModule,

    LoadClickModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'jmsp-qe'
    }
  ]
})
export class JMSPQuickEditModule {
  constructor(
    private injector: Injector,
    private ctx: FormBuilderContextService
  ) {
    if (!qeRegistered) {
      const element = createCustomElement(QuickEditComponent, {injector});

      customElements.define(injector.get<string>(<any>'elementsPrefix') + 'quick-edit', element);

      this.ctx.registerComponent(
        'quick-edit',
        QuickEditComponent
      );

      qeRegistered = true;
    }
  }
}
