import {ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'jmsp-note-element',
  templateUrl: './note-element.component.html',
  styleUrls: ['./note-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteElementComponent {
  constructor(
    private dialog: MatDialog,
    private el: ElementRef
  ) { }

  @ViewChild('notesDialog', {static: true})
  notesDialogTemplate: TemplateRef<any>;

  id: string;

  open() {
    const {
      id
    } = this.el.nativeElement.dataset;

    this.id = id;

    this.dialog.open(this.notesDialogTemplate, {
      width: '800px'
    });
  }
}
