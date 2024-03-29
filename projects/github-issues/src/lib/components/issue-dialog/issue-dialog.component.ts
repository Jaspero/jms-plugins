import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormBuilderData } from '@jaspero/form-builder';
import { tap } from 'rxjs/operators';
import { GithubIssuesOptions } from '../../interfaces/github-issues-options.interface';
import { OPTIONS } from '../../options';

@Component({
  selector: 'jmsp-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDialogComponent {
  constructor(
    @Inject(OPTIONS)
    private options: GithubIssuesOptions,
    private dialogRef: MatDialogRef<IssueDialogComponent>,
    private injector: Injector
  ) {
    this.dbService = this.injector.get<any>(<any> 'dbService');
  }

  dbService: any;

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
            dataSet: this.options.labels
          }
        }
      }
    },
    segments: [{
      type: 'empty',
      fields: [
        '/title',
        ...this.options.labels.length && ['/label'],
        '/captureScreen',
        '/description'
      ]
    }]
  };

  save(form: FormBuilderComponent) {
    return () => {
      return this.dbService.setDocument(
        this.options.collection || 'github-issues',
        Date.now().toString() + Math.random(),
        {
          ...form.form.getRawValue(),
          createdOn: Date.now(),
          device: {
            userAgent: navigator.userAgent || '',
            language: navigator.language || '',
            platform: navigator.platform || ''
          }
        }
      )
        .pipe(
          tap(() => {
            this.dialogRef.close();
          })
        );
    }
  }
}
