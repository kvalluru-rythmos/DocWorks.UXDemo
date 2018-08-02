import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGlossaryComponent } from './add-glossary.component';

describe('AddGlossaryComponent', () => {
  let component: AddGlossaryComponent;
  let fixture: ComponentFixture<AddGlossaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGlossaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
