import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceAssetConfirmationComponent } from './replace-asset-confirmation.component';

describe('ReplaceAssetConfirmationComponent', () => {
  let component: ReplaceAssetConfirmationComponent;
  let fixture: ComponentFixture<ReplaceAssetConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceAssetConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceAssetConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
