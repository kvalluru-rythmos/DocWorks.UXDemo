import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GDocErrorLogComponent } from './gdoc-error-log.component';

describe('GDocErrorLogComponent', () => {
  let component: GDocErrorLogComponent;
  let fixture: ComponentFixture<GDocErrorLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GDocErrorLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GDocErrorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
