import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDraftFromSnapshotComponent } from './create-draft-from-snapshot.component';

describe('CreateDraftFromSnapshotComponent', () => {
  let component: CreateDraftFromSnapshotComponent;
  let fixture: ComponentFixture<CreateDraftFromSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDraftFromSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDraftFromSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
