import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsCacheComponent } from './metrics-cache.component';

describe('MetricsCacheComponent', () => {
  let component: MetricsCacheComponent;
  let fixture: ComponentFixture<MetricsCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
