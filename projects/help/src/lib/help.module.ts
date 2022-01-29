import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SanitizeModule } from '@jaspero/ng-helpers';
import { TranslocoModule } from '@ngneat/transloco';
import { HelpFlyoutComponent } from './components/help-flyout/help-flyout.component';
import { HelpToggleComponent } from './components/help-toggle/help-toggle.component';
import { configWrapper, helpConfig } from './help.config';
import { HelpService } from './help.service';
import { HelpConfig } from './interfaces/help-config.interface';

@NgModule({
  declarations: [HelpFlyoutComponent, HelpToggleComponent],
  exports: [HelpToggleComponent],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,

    SanitizeModule,

    TranslocoModule
  ]
})
export class JMSPHelpModule {
  static forRoot(config: HelpConfig = {}): ModuleWithProviders<JMSPHelpModule> {

    const factory = configWrapper(config);

    return {
      ngModule: JMSPHelpModule,
      providers: [
        HelpService,
        {
          provide: helpConfig,
          useFactory: factory
        }
      ]
    };
  }
}
