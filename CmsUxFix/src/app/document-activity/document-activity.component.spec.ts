import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentActivityComponent } from './document-activity.component';

describe('DocumentActivityComponent', () => {
  let component: DocumentActivityComponent;
  let fixture: ComponentFixture<DocumentActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
