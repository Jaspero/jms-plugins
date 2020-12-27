import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CUSTOM_COMPONENT_DATA, CustomComponentData} from '@jaspero/form-builder';

@Component({
  selector: 'jmsp-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteViewComponent {
  constructor(
    @Inject(CUSTOM_COMPONENT_DATA)
    public data: CustomComponentData,
  ) {}
}
