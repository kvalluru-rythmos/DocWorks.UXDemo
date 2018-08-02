import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsToMultipleNodesComponent } from './manage-tags-to-multiple-nodes.component';

describe('ManageTagsToMultipleNodesComponent', () => {
  let component: ManageTagsToMultipleNodesComponent;
  let fixture: ComponentFixture<ManageTagsToMultipleNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsToMultipleNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsToMultipleNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
