import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthoringTabbedViewComponent } from './authoring-tabbed-view.component';
import { AppModules } from '../app.module';
import { AuthoringTabbedViewService } from './authoring-tabbed-view.service';
import { customProviders } from '../app.providers';
import { mockRouter, mockActivatedRoute, NotificationServiceSpy, ProjectServiceSpy } from '../app.mock-services';
import { ActivatedRoute, Router } from '@angular/router';

describe('AuthoringTabbedViewComponent', () => {
    let component: AuthoringTabbedViewComponent;
    let fixture: ComponentFixture<AuthoringTabbedViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuthoringTabbedViewComponent],
            imports: [AppModules],
            providers: [AuthoringTabbedViewService, customProviders,
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }, ]
        });
        fixture = TestBed.createComponent(AuthoringTabbedViewComponent);
        component = fixture.componentInstance;
        component.selectedTabIndex = 0;
        component.config = [];
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
