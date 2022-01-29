import {ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilderComponent, State} from '@jaspero/form-builder';
import {safeEval} from '@jaspero/utils';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'jmsp-quick-edit-dialog',
  templateUrl: './quick-edit-dialog.component.html',
  styleUrls: ['./quick-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickEditDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<QuickEditDialogComponent>
  ) { }

  @ViewChild(FormBuilderComponent, {static: true})
  formBuilderComponent: FormBuilderComponent;

  state = State.Edit;

  save() {
    return () => {
      this.formBuilderComponent.process();

      return this.formBuilderComponent.save(this.data.module.id, this.data.id)
        .pipe(
          switchMap(() => {
            let data = this.formBuilderComponent.form.getRawValue();

            if (this.data.module.layout?.instance?.formatOnEdit) {

              const method = safeEval(this.data.module.layout.instance.formatOnEdit);

              if (method) {
                data = method(data);
              }
            }

            if (this.data.module.layout?.instance?.formatOnSave) {
              const method = safeEval(this.data.module.layout.instance.formatOnEdit);

              if (method) {
                data = method(data);
              }
            }

            delete data.id;

            return this.data.dbService.setDocument(this.data.module.id, this.data.id, data);
          }),
          tap(() => {
            this.dialogRef.close();
          })
        );
    }
  }
}
