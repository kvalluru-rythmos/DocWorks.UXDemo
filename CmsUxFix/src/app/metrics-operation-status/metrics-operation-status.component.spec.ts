import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsOperationStatusComponent } from './metrics-operation-status.component';

describe('MetricsOperationStatusComponent', () => {
  let component: MetricsOperationStatusComponent;
  let fixture: ComponentFixture<MetricsOperationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsOperationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsOperationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
