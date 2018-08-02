import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalUpdatesComponent } from './personal-updates.component';

describe('PersonalUpdatesComponent', () => {
  let component: PersonalUpdatesComponent;
  let fixture: ComponentFixture<PersonalUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
