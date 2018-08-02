import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagGroupDashboardComponent } from './tag-group-dashboard.component';

describe('TagGroupDashboardComponent', () => {
  let component: TagGroupDashboardComponent;
  let fixture: ComponentFixture<TagGroupDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagGroupDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagGroupDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
