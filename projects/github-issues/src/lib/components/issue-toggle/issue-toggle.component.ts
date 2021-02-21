import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {IssueDialogComponent} from '../issue-dialog/issue-dialog.component';

@Component({
  selector: 'jmsp-issue-toggle',
  templateUrl: './issue-toggle.component.html',
  styleUrls: ['./issue-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueToggleComponent implements OnInit {
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  toggle() {
    this.dialog.open(IssueDialogComponent, {
      width: '700px'
    })
  }
}
