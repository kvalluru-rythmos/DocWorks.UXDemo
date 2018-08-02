import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDistributionConfirmationDialogComponent } from './delete-distribution-confirmation-dialog.component';

describe('DeleteDistributionConfirmationDialogComponent', () => {
  let component: DeleteDistributionConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteDistributionConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDistributionConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDistributionConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
