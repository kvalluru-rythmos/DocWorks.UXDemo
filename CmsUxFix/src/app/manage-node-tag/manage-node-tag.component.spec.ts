import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagGroupsNodeLevelComponent } from './manage-tag-groups-node-level.component';

describe('ManageTagGroupsNodeLevelComponent', () => {
  let component: ManageTagGroupsNodeLevelComponent;
  let fixture: ComponentFixture<ManageTagGroupsNodeLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagGroupsNodeLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagGroupsNodeLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
