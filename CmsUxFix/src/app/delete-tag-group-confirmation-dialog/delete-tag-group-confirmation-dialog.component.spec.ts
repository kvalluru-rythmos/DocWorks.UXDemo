import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTagGroupConfirmationDialogComponent } from './delete-tag-group-confirmation-dialog.component';

describe('DeleteTagGroupConfirmationDialogComponent', () => {
  let component: DeleteTagGroupConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteTagGroupConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTagGroupConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTagGroupConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
