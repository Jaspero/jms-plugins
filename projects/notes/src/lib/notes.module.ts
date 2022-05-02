import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilderContextService } from '@jaspero/form-builder';
import { LoadClickModule } from '@jaspero/ng-helpers';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { NoteElementComponent } from './components/note-element/note-element.component';
import { NoteViewComponent } from './components/note-view/note-view.component';
import { NotesComponent } from './components/notes/notes.component';

let notesRegistered = false;

export function translationsLoader(langs: string[] = ['en'], path: string = 'src/lib/i18n') {
  const loader = langs.reduce((acc: any, lang: string) => {
    acc[lang] = () => import(`${path}${lang}.json`);
    return acc;
  }, {});

  return {scope: 'notes', loader};
}

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
    MatAutocompleteModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,

    LoadClickModule,
    TranslocoModule,
  ],
  providers: [
    MatCalendar,
    MatAccordion,
    MatRadioGroup,
    {
      provide: TRANSLOCO_SCOPE,
      useFactory: translationsLoader,
      deps: ['TRASNLATION_LANGUAGES', 'TRANSLATION_PATH']
    },
  ]
})
export class JMSPNotesModule {
  constructor(
    private injector: Injector,
    private ctx: FormBuilderContextService
  ) {
    if (!notesRegistered) {
      const element = createCustomElement(NoteElementComponent, {injector});
      customElements.define(injector.get<string>(<any> 'elementsPrefix') + 'notes', element);

      this.ctx.registerComponent(
        'note-view',
        NoteViewComponent
      );

      notesRegistered = true;
    }
  }
}
