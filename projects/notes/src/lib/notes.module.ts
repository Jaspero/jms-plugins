import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NotesComponent} from './notes.component';

@NgModule({
  declarations: [NotesComponent],
  exports: [NotesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class NotesModule { }
