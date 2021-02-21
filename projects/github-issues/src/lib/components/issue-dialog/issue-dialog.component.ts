import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilderData, SegmentType} from '@jaspero/form-builder';
import {of} from 'rxjs';

@Component({
  selector: 'jmsp-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<IssueDialogComponent>
  ) { }

  data: FormBuilderData = {
    schema: {
      properties: {
        title: {type: 'string'},
        description: {type: 'string'},
        label: {type: 'string'},
        captureScreen: {type: 'boolean'}
      }
    },
    definitions: {
      title: {label: 'GITHUB_ISSUES_PLUGIN.ISSUE_TITLE'},
      description: {
        label: 'GITHUB_ISSUES_PLUGIN.ISSUE_DESCRIPTION',
        component: {
          type: 'tinymce'
        }
      },
      captureScreen: {
        label: 'GITHUB_ISSUES_PLUGIN.CAPTURE_SCREEN'
      },
      label: {
        label: 'GITHUB_ISSUES_PLUGIN.ISSUE_LABEL',
        component: {
          type: 'select',
          configuration: {
            dataSet: [
              {name: 'Kritična greška', value: 'critical'},
              {name: 'Greška', value: 'error'},
              {name: 'Loš performans (usporen rad modula)', value: 'perf'},
              {name: 'Promijena funkcionalnosti', value: 'change'}
            ]
          }
        }
      }
    },
    segments: [{
      type: SegmentType.Empty,
      fields: [
        '/title',
        '/label',
        '/captureScreen',
        '/description'
      ]
    }]
  };

  ngOnInit() {

  }

  save() {
    return () => {

      this.dialogRef.close();

      return of(true);
    }
  }
}
