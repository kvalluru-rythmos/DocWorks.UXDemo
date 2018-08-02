import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectConfirmationDialogComponent } from './delete-project-confirmation-dialog.component';

describe('DeleteProjectConfirmationDialogComponent', () => {
  let component: DeleteProjectConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteProjectConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProjectConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProjectConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
