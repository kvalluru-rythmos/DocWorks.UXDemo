import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchMergeToolComponent } from './batch-merge-tool.component';

describe('BatchMergeToolComponent', () => {
  let component: BatchMergeToolComponent;
  let fixture: ComponentFixture<BatchMergeToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchMergeToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchMergeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
