import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAddComponent } from './project-add.component';
import { routingComponents } from '../app.routing.module';
import { AppModules } from '../app.module';
import { customProviders } from '../app.providers';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../common/notification.service';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy, ProjectServiceSpy } from '../app.mock-services';
import { ProjectService } from '../project/project.service';

describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let fixture: ComponentFixture<ProjectAddComponent>;
  // tslint:disable-next-line:prefer-const
  let notificationServiceSpy: NotificationServiceSpy;
  let projectServiceSpy: ProjectServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAddComponent],
      imports: [AppModules],
      providers: [customProviders,
        { provide: ProjectService, useClass: ProjectServiceSpy },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useClass: NotificationServiceSpy }]
    });

    fixture = TestBed.createComponent(ProjectAddComponent);
    component = fixture.componentInstance;
    notificationServiceSpy = TestBed.get(NotificationService);
    projectServiceSpy = TestBed.get(ProjectService);
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('on init of add project component subscribe topic', () => {
    fixture.detectChanges();
    expect(notificationServiceSpy.subscribeTopic.calls.count()).toBe(1, 'topic subscribed');
  });

  it('on unsubscribe topic', () => {
    fixture.detectChanges();
    expect(notificationServiceSpy.unsubscribeTopic.calls.count()).toBe(0, 'topic unsubscribed');
  });
});
