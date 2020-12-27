import {ChangeDetectionStrategy, Component, Injector, Input, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Note} from '../../interfaces/note.interface';

@Component({
  selector: 'jmsp-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {
  constructor(
    private injector: Injector
  ) { }

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
    this.afs = this.injector.get<any>(<any>'dbService').afs;

    this.user = this.injector.get<any>(<any>'stateService').user;
    this.module$ = this.injector.get<Observable<any>>(<any>'module');
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
      )
  }

  submit() {
    return () =>
      this.id$
        .pipe(
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
        )
  }

  remove(id: string) {
    return () =>
      this.id$
        .pipe(
          switchMap(moduleId =>
            this.afs
              .collection(moduleId)
              .doc(id)
              .delete()
          )
        );
  }
}
