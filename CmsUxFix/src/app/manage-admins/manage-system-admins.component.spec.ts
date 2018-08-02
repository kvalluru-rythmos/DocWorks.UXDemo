import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSystemAdminsComponent } from './manage-system-admins.component';

describe('ManageSystemAdminsComponent', () => {
  let component: ManageSystemAdminsComponent;
  let fixture: ComponentFixture<ManageSystemAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSystemAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSystemAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
