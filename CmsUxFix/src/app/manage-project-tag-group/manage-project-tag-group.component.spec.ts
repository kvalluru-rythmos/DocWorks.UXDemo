import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagGroupsProjectLevelComponent } from './manage-tag-groups-project-level.component';

describe('ManageTagGroupsProjectLevelComponent', () => {
  let component: ManageTagGroupsProjectLevelComponent;
  let fixture: ComponentFixture<ManageTagGroupsProjectLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagGroupsProjectLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagGroupsProjectLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
