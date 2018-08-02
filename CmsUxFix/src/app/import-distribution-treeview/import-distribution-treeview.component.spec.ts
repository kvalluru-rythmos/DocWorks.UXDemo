import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDistributionTreeviewComponent } from './import-distribution-treeview.component';

describe('ImportDistributionTreeviewComponent', () => {
  let component: ImportDistributionTreeviewComponent;
  let fixture: ComponentFixture<ImportDistributionTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDistributionTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDistributionTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
