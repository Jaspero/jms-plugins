import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickEditDialogComponent } from './quick-edit-dialog.component';

describe('QuickEditDialogComponent', () => {
  let component: QuickEditDialogComponent;
  let fixture: ComponentFixture<QuickEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
