import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { routingComponents } from '../app.routing.module';
import { AppModules } from '../app.module';
import { customProviders } from '../app.providers';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../common/notification.service';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy, ProjectServiceSpy } from '../app.mock-services';
import { ProjectListComponent } from '../project/projectList.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, ProjectListComponent],
      imports: [AppModules],
      providers: [customProviders,
        { provide: NotificationService, useClass: NotificationServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
