import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryHomeComponent } from './glossary-home.component';

describe('GlossaryHomeComponent', () => {
  let component: GlossaryHomeComponent;
  let fixture: ComponentFixture<GlossaryHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlossaryHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
