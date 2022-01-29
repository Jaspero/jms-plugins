import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { random } from '@jaspero/utils';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Note } from '../../interfaces/note.interface';

@Component({
  selector: 'jmsp-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  constructor(
    private injector: Injector,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
  }

  @Input() id: string;
  @Input() notesCollection = 'notes';

  module: any;
  collection: string;
  notes: Note[];

  user: any;
  db: any;
  form: FormGroup;

  ngOnInit() {
    this.db = this.injector.get<any>(<any> 'dbService').afs;
    this.user = this.injector.get<any>(<any> 'stateService').user;

    this.injector.get<Observable<any>>(<any> 'module')
      .pipe(
        take(1),
        switchMap(module => {
          this.module = module;
          this.collection = [module.id, this.id, this.notesCollection].join('/');

          return this.db.getDocumentsSimple(this.collection, {active: 'createdOn', direction: 'desc'})
        })
      )
      .subscribe((notes: any[]) => {
        this.notes = notes;
        this.cdr.markForCheck();
      });

    this.form = this.fb.group({
      note: ['', Validators.required]
    });
  }

  submit() {
    return () => {

      const docIdPrefix = this.module.metadata?.docIdPrefix || this.module.id.slice(0, 2);
      const docIdSize = this.module.metadata?.docIdSize || 12;
      const id = `${docIdPrefix}-${this.collection.slice(0, 2)}-${random.string(docIdSize)}`;
      const data = {
        ...this.form.getRawValue(),
        createdOn: Date.now(),
        userId: this.user.id,
        userName: this.user.name || this.user.email
      };

      return this.db.setDocument(this.collection, id, data)
        .pipe(
          tap(() => {
            this.form.reset();
            this.notes.push({
              id,
              ...data
            });
            this.cdr.markForCheck();
          })
        );
    }
  }

  remove(id: string, index: number) {
    return () =>
      this.db.removeDocument(this.collection, id)
        .pipe(
          tap(() => {
            this.notes.splice(index, 1);
            this.cdr.markForCheck();
          })
        )
  }
}
