import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'jmsp-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerComponent implements OnInit {
  constructor(
    private dialog: MatDialog
  ) {}

  title = 'GENERAL.TITLE : {value: 123}';

  routeControl: FormControl;
  displayMode$ = new BehaviorSubject<'list' | 'grid'>('list');
  data$: Observable<{
    files: any[];
    folders: any[];
  }>;
  loading$ = new BehaviorSubject(false);

  @ViewChild('metadata', {static: true})
  metadataDialogElement: TemplateRef<any>;
  metadataDialog: MatDialogRef<any>;

  ngOnInit(): void {
    this.routeControl = new FormControl('/', {
      updateOn: 'blur'
    });

    this.data$ = this.routeControl.valueChanges.pipe(
      startWith(this.routeControl.value),
      switchMap(route => {
        this.loading$.next(true);
        const ref = firebase.storage().ref();

        return ref.child(route).list({
          maxResults: 10
        });
      }),
      switchMap(response =>
        Promise.all([
          Promise.all(
            response.items.map(async (item) => {
              const metadata = await item.getMetadata();
              const downloadLink = await item.getDownloadURL();
              return {
                name: item.name,
                type: 'file',
                ...metadata,
                downloadLink,
                icon: this.typeToIcon(metadata.contentType)
              };
            })
          ),
          Promise.all(
            response.prefixes.map(async (item) => {
              return {
                name: item.name,
                type: 'folder',
                icon: 'folder'
              };
            })
          )
        ])
      ),
      map(([files, folders]) => ({files, folders})),
      tap(() => this.loading$.next(false))
    );
  }

  toggleDisplayMode() {
    const current = this.displayMode$.value;
    this.displayMode$.next(current === 'list' ? 'grid' : 'list');
  }

  typeToIcon(type = '') {
    if (type.startsWith('image/')) {
      return 'insert_photo';
    }

    if (type === 'application/pdf') {
      return 'picture_as_pdf';
    }

    if (type === 'application/zip') {
      return 'compress';
    }

    if (type.startsWith('text/')) {
      return 'article';
    }

    return 'note';
  }

  navigateBack() {
    const route = this.routeControl.value.split('/').filter(it => it);
    route.pop();

    this.routeControl.setValue('/' + route.join('/'));
  }

  appendFolder(folder: string) {
    let route: string = this.routeControl.value;
    if (!route.endsWith('/')) {
      route += '/';
    }
    route += folder;

    this.routeControl.setValue(route);
  }

  downloadFile(file) {
    const link = document.createElement('a');
    link.setAttribute('download', file.name);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.href = file.downloadLink;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  deleteFile(file) {
    firebase.storage().ref(file.fullPath).delete()
      .then(() => {
        this.routeControl.setValue(this.routeControl.value);
      });
  }

  editFileMetadata(file) {
    const keys = Object.keys(file.customMetadata || {});
    this.metadataDialog = this.dialog.open(this.metadataDialogElement, {
      autoFocus: false,
      data: {
        ...file,
        fb: {
          schema: {
            properties: keys.reduce((acc, key) => {
              acc[key] = { type: 'string' };
              return acc;
            }, {})
          },
          value: file.customMetadata || {a: '123'}
        }
      },
      width: '600px'
    });
  }
}
