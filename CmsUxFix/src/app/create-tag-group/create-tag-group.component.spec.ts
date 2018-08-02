import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTagGroupComponent } from './create-tag-group.component';

describe('CreateTagGroupComponent', () => {
  let component: CreateTagGroupComponent;
  let fixture: ComponentFixture<CreateTagGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTagGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTagGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
