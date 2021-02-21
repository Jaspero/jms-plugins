import {CommonModule} from '@angular/common';
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TinymceModule} from '@jaspero/fb-tinymce';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DbService, FormBuilderContextService, FormBuilderModule} from '@jaspero/form-builder';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {IssueDialogComponent} from './components/issue-dialog/issue-dialog.component';
import {IssueToggleComponent} from './components/issue-toggle/issue-toggle.component';
import {GithubIssuesOptions} from './interfaces/github-issues-options.interface';


export const OPTIONS = new InjectionToken<GithubIssuesOptions>('GH_ISSUES_OPTIONS');

@NgModule({
  declarations: [IssueToggleComponent, IssueDialogComponent],
  imports: [
    CommonModule,

    FormBuilderModule,
    TinymceModule,

    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,

    TranslocoModule,

    LoadClickModule
  ],
  exports: [IssueToggleComponent]
})
export class JMSPGithubIssuesModule {
  static forRoot(
    options: GithubIssuesOptions = {
      labels: []
    }
  ): ModuleWithProviders<JMSPGithubIssuesModule> {

    return {
      ngModule: JMSPGithubIssuesModule,
      providers: [
        FormBuilderContextService,
        {
          provide: DbService,
          useExisting: 'dbService'
        },
        {
          provide: OPTIONS,
          useValue: options
        }
      ]
    }
  }
}
