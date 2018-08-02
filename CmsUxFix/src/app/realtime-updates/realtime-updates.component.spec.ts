import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeUpdatesComponent } from './realtime-updates.component';

describe('RealtimeUpdatesComponent', () => {
  let component: RealtimeUpdatesComponent;
  let fixture: ComponentFixture<RealtimeUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
