import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DbService, FormBuilderContextService, FormBuilderModule } from '@jaspero/form-builder';
import { TranslocoModule } from '@ngneat/transloco';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { FileSizePipe } from './utils/file-size.pipe';

@NgModule({
  declarations: [
    FileManagerComponent,
    ConfirmationComponent,
    FileSizePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FormBuilderModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatProgressBarModule,
    MatAutocompleteModule,

    TranslocoModule
  ],
  providers: [
    FormBuilderContextService,
    {
      provide: DbService,
      useExisting: 'dbService'
    },
  ],
  exports: [FileManagerComponent]
})
export class JMSPFileManagerModule {
}
