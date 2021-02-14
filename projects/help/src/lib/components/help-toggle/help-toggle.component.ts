import {ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HelpService} from '../../help.service';

@Component({
  selector: 'jmsp-help-toggle',
  templateUrl: './help-toggle.component.html',
  styleUrls: ['./help-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpToggleComponent implements OnInit, OnDestroy {
  constructor(
    private service: HelpService,
  ) { }

  @HostBinding('class.active')
  active: boolean;

  private sub: Subscription;

  ngOnInit() {
    this.sub = this.service.open$
      .subscribe(value => {
        this.active = value;
      })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggle() {
    this.service.toggle();
  }
}
