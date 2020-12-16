import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {NotesComponent} from './notes.component';

let notesRegistered = false;

@NgModule({
  declarations: [NotesComponent],
  exports: [NotesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    /**
     * Material
     */
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,

    LoadClickModule,
    TranslocoModule,
  ]
})
export class JMSPNotesModule {
  constructor(
    private injector: Injector,
  ) {
    if (!notesRegistered) {
      const element = createCustomElement(NotesComponent, {injector});
      customElements.define(injector.get<string>(<any>'elementsPrefix') + 'notes', element);
      notesRegistered = true;
    }
  }
}
