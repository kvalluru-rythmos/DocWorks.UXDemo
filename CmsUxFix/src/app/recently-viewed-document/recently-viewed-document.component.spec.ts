import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyViewedDocumentComponent } from './recently-viewed-document.component';

describe('RecentlyViewedDocumentComponent', () => {
  let component: RecentlyViewedDocumentComponent;
  let fixture: ComponentFixture<RecentlyViewedDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentlyViewedDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
