import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationBaseComponent } from './operation-base.component';

describe('OperationBaseComponent', () => {
  let component: OperationBaseComponent;
  let fixture: ComponentFixture<OperationBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
