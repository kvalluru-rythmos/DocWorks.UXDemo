import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DistributionComponent } from './distribution.component';
import { routingComponents } from '../app.routing.module';
import { AppModules } from '../app.module';
import { customProviders } from '../app.providers';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../common/notification.service';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy, ProjectServiceSpy } from '../app.mock-services';
import { Project } from '../project/project';


describe('Project Distrubution', () => {
  // tslint:disable-next-line:prefer-const
  let component: DistributionComponent;
  // tslint:disable-next-line:prefer-const
  let fixture: ComponentFixture<DistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppModules
      ],
      declarations: [DistributionComponent, routingComponents],
      providers: [customProviders,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useClass: NotificationServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(DistributionComponent);
    component = fixture.componentInstance;
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
