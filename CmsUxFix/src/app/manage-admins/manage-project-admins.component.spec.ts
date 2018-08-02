import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectAdminsComponent } from './manage-project-admins.component';

describe('ManageProjectAdminsComponent', () => {
  let component: ManageProjectAdminsComponent;
  let fixture: ComponentFixture<ManageProjectAdminsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProjectAdminsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
