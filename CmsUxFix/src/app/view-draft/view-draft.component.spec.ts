import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDraftComponent } from './view-draft.component';

describe('ViewDraftComponent', () => {
  let component: ViewDraftComponent;
  let fixture: ComponentFixture<ViewDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
