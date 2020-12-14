import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {from, Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import {Note} from './note.interface';

@Component({
  selector: 'jmsp-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private el: ElementRef,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public state: StateService
  ) { }

  @ViewChild('notesDialog', {static: true})
  notesDialogTemplate: TemplateRef<any>;

  notes$: Observable<Note[]>;
  form: FormGroup;
  moduleId: string;

  open() {

    const {
      id
    } = this.el.nativeElement.dataset;

    this.ic.module$.pipe(take(1)).subscribe(module => {

      this.moduleId = [module.id, id, 'notes'].join('/');

      this.notes$ = this.afs
        .collection<Note>(this.moduleId, ref =>
          ref.orderBy('createdOn', 'desc')
        )
        .valueChanges({idField: 'id'});

      this.form = this.fb.group({
        note: ['', Validators.required]
      });

      this.dialog.open(this.notesDialogTemplate, {
        width: '800px'
      });
    });
  }

  submit() {
    return () =>
      from(
        this.afs
          .collection(this.moduleId)
          .doc(this.afs.createId())
          .set({
            ...this.form.getRawValue(),
            createdOn: Date.now(),
            userId: this.state.user.id,
            userName: this.state.user.name || this.state.user.email
          })
      ).pipe(
        tap(() => {
          this.form.reset();
        })
      );
  }

  remove(id: string) {
    return () =>
      from(
        this.afs
          .collection(this.moduleId)
          .doc(id)
          .delete()
      );
  }
}
