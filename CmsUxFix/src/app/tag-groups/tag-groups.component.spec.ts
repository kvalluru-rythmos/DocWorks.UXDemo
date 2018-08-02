import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagGroupsComponent } from './tag-groups.component';

describe('TagGroupsComponent', () => {
  let component: TagGroupsComponent;
  let fixture: ComponentFixture<TagGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
