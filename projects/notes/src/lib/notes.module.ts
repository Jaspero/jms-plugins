import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FormBuilderContextService} from '@jaspero/form-builder';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {NoteElementComponent} from './components/note-element/note-element.component';
import {NoteViewComponent} from './components/note-view/note-view.component';
import {NotesComponent} from './components/notes/notes.component';

let notesRegistered = false;

@NgModule({
  declarations: [
    NoteElementComponent,
    NoteViewComponent,
    NotesComponent
  ],
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
    private ctx: FormBuilderContextService
  ) {
    if (!notesRegistered) {
      const element = createCustomElement(NoteElementComponent, {injector});
      customElements.define(injector.get<string>(<any>'elementsPrefix') + 'notes', element);

      this.ctx.registerComponent(
        'note-view',
        NoteViewComponent
      );

      notesRegistered = true;
    }
  }
}
