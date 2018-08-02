import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamDragAndDropComponent } from './dam-drag-and-drop.component';

describe('DamDragAndDropComponent', () => {
  let component: DamDragAndDropComponent;
  let fixture: ComponentFixture<DamDragAndDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamDragAndDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
