import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDistributionComponent } from './create-distribution.component';

describe('CreateDistributionComponent', () => {
  let component: CreateDistributionComponent;
  let fixture: ComponentFixture<CreateDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
