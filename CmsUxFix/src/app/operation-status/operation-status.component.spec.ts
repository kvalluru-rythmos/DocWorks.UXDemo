import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationStatusComponent } from './operation-status.component';

describe('OperationStatusComponent', () => {
  let component: OperationStatusComponent;
  let fixture: ComponentFixture<OperationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
