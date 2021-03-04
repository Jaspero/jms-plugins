import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
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
    private fb: FormBuilder
  ) {
  }

  @Input()
  id: string;

  module$: Observable<any>;
  id$: Observable<string>;
  notes$: Observable<Note[]>;

  user: any;
  afs: AngularFirestore;
  form: FormGroup;

  ngOnInit() {
    /**
     * TODO:
     * Currently it's only possible to use notes
     * with firebase
     */
    this.afs = this.injector.get<any>(<any> 'dbService').afs;

    this.user = this.injector.get<any>(<any> 'stateService').user;
    this.module$ = this.injector.get<Observable<any>>(<any> 'module');
    this.id$ = this.module$
      .pipe(
        map(({id}) =>
          [id, this.id, 'notes'].join('/')
        )
      );

    this.notes$ = this.id$
      .pipe(
        switchMap((id) =>
          this.afs
            .collection<Note>(id, ref =>
              ref.orderBy('createdOn', 'desc')
            )
            .valueChanges({idField: 'id'})
        )
      );

    this.form = this.fb.group({
      note: ['', Validators.required]
    });
  }

  submit() {
    return () =>
      this.id$
        .pipe(
          take(1),
          switchMap(id =>
            this.afs
              .collection(id)
              .doc(this.afs.createId())
              .set({
                ...this.form.getRawValue(),
                createdOn: Date.now(),
                userId: this.user.id,
                userName: this.user.name || this.user.email
              })
          ),
          tap(() => {
            this.form.reset();
          })
        );
  }

  remove(id: string) {
    return () =>
      this.id$
        .pipe(
          take(1),
          switchMap(moduleId =>
            this.afs
              .collection(moduleId)
              .doc(id)
              .delete()
          )
        );
  }
}
