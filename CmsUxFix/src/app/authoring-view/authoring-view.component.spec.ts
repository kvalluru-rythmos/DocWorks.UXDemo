import { AuthoringViewComponent } from './authoring-view.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AuthoringViewService } from './authoring-view.service';
import { AuthoringTabbedViewComponent } from '../authoring-tabbed-view/authoring-tabbed-view.component';
import { AuthoringTabbedViewService } from '../authoring-tabbed-view/authoring-tabbed-view.service';
import { AppModules } from '../app.module';
import { Observable } from 'rxjs/Observable';
import { inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../common/notification.service';
import { customProviders } from '../app.providers';
import { NotificationServiceSpy, ProjectServiceSpy, mockRouter } from '../app.mock-services';
import { TreeViewService } from '../treeview/treeview.service';
import { StorageService } from '../common/storage.service';
import { DraftService } from '../new-draft/draft.service';
import { Tab } from '../authoring-tabbed-view/tab';

describe('AuthoringViewComponent', () => {
    let component: AuthoringViewComponent;
    let fixture: ComponentFixture<AuthoringViewComponent>;
    let authoringViewServiceSpy: AuthoringViewServiceSpy;
    let notificationServiceSpy: NotificationServiceSpy;
    let treeViewServiceSpy: TreeViewServiceSpy;
    let draftServiceSpy: DraftServiceSpy;
    let storageServiceSpy: StorageServiceSpy;
    let authoringTabbedViewServiceSpy: AuthoringTabbedViewService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AuthoringViewComponent, AuthoringTabbedViewComponent],
            imports: [AppModules],
            providers: [customProviders,
                { provide: Router },
                { provide: StorageService, useClass: StorageServiceSpy },
                { provide: AuthoringTabbedViewService, useClass: AuthoringTabbbedViewServiceSpy },
                { provide: DraftService, useClass: DraftServiceSpy },
                { provide: SnackBarService },
                { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'projectId': '1', 'defaultDistributionId': 1 }]), '_routerState': { 'snapshot': { 'url': '' } } } },
                { provide: AuthoringViewService, useClass: AuthoringViewServiceSpy },
                { provide: TreeViewService, useClass: TreeViewServiceSpy },
                { provide: NotificationService, useClass: NotificationServiceSpy }]
        });
        fixture = TestBed.createComponent(AuthoringViewComponent);
        component = fixture.componentInstance;
        component.tabs = [{ title: '' }] as Tab[];
        component.selectedTabIndex = 0;
        component.selectedTreeNode = {};
        component.nodeDrafts = [{ title: '' }];
        component.hierarchy = [];
        component.hierarchy.reverse();
        authoringViewServiceSpy = TestBed.get(AuthoringViewService);
        treeViewServiceSpy = TestBed.get(TreeViewService);
        draftServiceSpy = TestBed.get(DraftService);
        storageServiceSpy = TestBed.get(StorageService);
        authoringTabbedViewServiceSpy = TestBed.get(AuthoringTabbedViewService);
    }));

    it('component is created', () => {
        expect(component).toBeTruthy();
    });

    it('is subscribe for FCM notification exists', () => {
        expect(component.subscribeForFCMNotification).toBeTruthy();
    });

    it('Tree hierarchy is fetched on the init', () => {
        component.createBreadCrumb();
        expect(treeViewServiceSpy.findHierarchy.calls.count()).toBeGreaterThan(0);
    });

    it('clicking on Accept Draft to Live button pushDraftToLive should be called', () => {
        component.ngOnInit();
        component.tabs = [{ 'title': 'gDoc', 'apiURL': '', 'displayContentInIframe': true }];
        component.nodeDrafts = [{ 'nodeName': 'WIP', 'nodeId': '1', 'parentId': '1' }];

        const btn = fixture.debugElement.nativeElement.querySelector('button[id="btnAcceptDraftToLive"]');
        btn.click();
        fixture.detectChanges();
        expect(authoringViewServiceSpy.pushDraftToLive.calls.count()).toBe(1);
    });
});

export class AuthoringViewServiceSpy {
    pushDraftToLive = jasmine.createSpy('pushDraftToLive').and.callFake(() => Promise
        .resolve(true));
}
export class TreeViewServiceSpy {
    requestTree = jasmine.createSpy('requestTree').and.callFake(() => Promise
        .resolve(true)
        .then(() => 1));
    convertToPrimeNgTree = jasmine.createSpy('convertToPrimeNgTree').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, [])));
    setSelectedNode = jasmine.createSpy('setSelectedNode').and.callFake(() => Promise
        .resolve(true));
    getSelectedNode = jasmine.createSpy('getSelectedNode').and.callFake(() => Promise
        .resolve(true));
    findHierarchy = jasmine.createSpy('findHierarchy').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, []))
    );
}
export class AuthoringTabbbedViewServiceSpy {

    getTabs = jasmine.createSpy('getTabs').and.callFake(() => Promise
        .resolve(true));

}
export class DraftServiceSpy {
    newDraftEmitter = jasmine.createSpy('getNewDraftEmitter').and.callFake(() => Promise
        .resolve(true));

    getDrafts = jasmine.createSpy('getDrafts').and.callFake(() => Promise
        .resolve(true));
}
export class StorageServiceSpy {
    add = jasmine.createSpy('add').and.callFake(() => Promise
        .resolve(true));
}
