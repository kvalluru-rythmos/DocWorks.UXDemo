import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTagConfirmationDialogComponent } from './delete-tag-confirmation-dialog.component';

describe('DeleteTagConfirmationDialogComponent', () => {
  let component: DeleteTagConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteTagConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTagConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTagConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
