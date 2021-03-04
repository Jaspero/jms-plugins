import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {formatFileName} from '@jaspero/form-builder';
import firebase from 'firebase/app';
import 'firebase/storage';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {Color} from '../enums/color.enum';
import {confirmation} from '../utils/confirmation';

@Component({
  selector: 'jmsp-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  routeControl: FormControl;
  displayMode$ = new BehaviorSubject<'list' | 'grid'>('list');
  data$: Observable<{
    files: any[];
    folders: any[];
  }>;
  loading$ = new BehaviorSubject(false);
  uploadProgress$ = new BehaviorSubject(0);

  @ViewChild('file')
  fileElement: ElementRef<HTMLInputElement>;

  @ViewChild('metadata')
  metadataDialogElement: TemplateRef<any>;
  metadataDialog: MatDialogRef<any>;

  @ViewChild('upload')
  uploadDialogElement: TemplateRef<any>;
  uploadDialog: MatDialogRef<any>;

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
      switchMap(response => {
        return Promise.all([
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
        ]);
      }),
      map(([files, folders]) => {
        return {
          files,
          folders
        };
      }),
      tap((data) => {
        console.log({data});
        this.loading$.next(false);
      })
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
    confirmation([
      switchMap(() => {
        return firebase.storage().ref(file.fullPath).delete();
      }),
      tap(() => {
        this.routeControl.setValue(this.routeControl.value);
      })
    ], {
      description: 'STORAGE.DELETE_FILE.DESCRIPTION',
      confirm: 'STORAGE.DELETE_FILE.CONFIRM',
      color: Color.Warn,
      variables: {
        name: file.name
      }
    });
  }

  editFileMetadata(file) {
    const keys = Object.keys(file.customMetadata);
    this.metadataDialog = this.dialog.open(this.metadataDialogElement, {
      autoFocus: false,
      data: {
        ...file,
        fb: {
          schema: {
            properties: keys.reduce((acc, key) => {
              acc[key] = {type: 'string'};
              return acc;
            }, {})
          },
          value: file.customMetadata || {a: '123'}
        }
      },
      width: '600px'
    });
  }

  openUploadDialog() {
    const form = this.fb.group({
      route: [this.routeControl.value],
      file: [null, Validators.required]
    });

    this.uploadDialog = this.dialog.open(this.uploadDialogElement, {
      autoFocus: false,
      width: '600px',
      data: {
        form
      }
    });
  }

  openFileUpload() {
    this.fileElement.nativeElement.click();
  }

  async fileChange(event) {
    const el = event.target as HTMLInputElement;
    const file = Array.from(el.files as FileList)[0] as File;

    Object.defineProperty(file, 'name', {
      writable: true,
      value: formatFileName(file.name)
    });

    el.value = '';

    let route = this.routeControl.value;

    if (!route.endsWith('/')) {
      route += '/';
    }

    try {
      const ref = firebase.storage().ref(route + file.name);
      await ref.getDownloadURL();

      const [extension, ...name] = file.name.split('.').reverse();

      const copyFile = name.reverse().join('.') + ' (' + (Date.now() + '').slice(-4) + ')' + '.' + extension;
      route += copyFile;
    } catch (error) {
      route += file.name;
    }

    const uploadTask = firebase.storage().ref(route).put(file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        this.uploadProgress$.next(progress);

        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log({error});
      },
      () => {
        this.uploadDialog.close();
        this.routeControl.setValue(this.routeControl.value);
      }
    );
  }
}
