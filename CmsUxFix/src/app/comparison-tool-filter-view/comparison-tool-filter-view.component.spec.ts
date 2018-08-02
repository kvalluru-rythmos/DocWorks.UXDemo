import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonToolFilterViewComponent } from './comparison-tool-filter-view.component';

describe('ComparisonToolFilterViewComponent', () => {
  let component: ComparisonToolFilterViewComponent;
  let fixture: ComponentFixture<ComparisonToolFilterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonToolFilterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonToolFilterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
