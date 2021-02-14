import {CommonModule} from '@angular/common';
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {SanitizeModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {HelpFlyoutComponent} from './components/help-flyout/help-flyout.component';
import {HelpToggleComponent} from './components/help-toggle/help-toggle.component';
import {HelpService} from './help.service';
import {HelpConfig} from './interfaces/help-config.interface';

export const helpConfig = new InjectionToken<HelpConfig>('helpConfig');

export function configWrapper(config: HelpConfig) {
  return () => ({
    width: 300,
    height: 500,
    top: 20,
    left: 20,
    ...config
  })
}

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
