import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsAccessExecutionComponent } from './metrics-access-execution.component';

describe('MetricsAccessExecutionComponent', () => {
  let component: MetricsAccessExecutionComponent;
  let fixture: ComponentFixture<MetricsAccessExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsAccessExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsAccessExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
