import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertAssetComponent } from './insert-asset.component';

describe('InsertAssetComponent', () => {
  let component: InsertAssetComponent;
  let fixture: ComponentFixture<InsertAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
