import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishConfigurationComponent } from './publish-configuration.component';

describe('PublishConfigurationComponent', () => {
  let component: PublishConfigurationComponent;
  let fixture: ComponentFixture<PublishConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
