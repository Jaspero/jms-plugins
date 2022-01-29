import {InjectionToken} from '@angular/core';
import {HelpConfig} from './interfaces/help-config.interface';

export const helpConfig = new InjectionToken<HelpConfig>('helpConfig');

export function configWrapper(config: HelpConfig) {
  return () => ({
    width: 300,
    height: 500,
    top: 20,
    left: 20,
    canEdit: ['admin'],
    ...config
  })
}
