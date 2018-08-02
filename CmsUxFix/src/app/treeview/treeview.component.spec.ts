import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent } from './treeview.component';
import { AppModules } from '../app.module';
import { customProviders } from '../app.providers';
import { NotificationService } from '../common/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationServiceSpy, ProjectServiceSpy, mockRouter } from '../app.mock-services';
import { TreeViewService } from './treeview.service';
import { Observable } from 'rxjs/Observable';
import { inject } from '@angular/core/testing';

describe('TreeViewComponent', () => {
    let component: TreeViewComponent;
    let fixture: ComponentFixture<TreeViewComponent>;
    let treeViewServiceSpy: TreeViewServiceSpy;
    let notificationServiceSpy: NotificationServiceSpy;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TreeViewComponent],
            imports: [AppModules],
            providers: [
                { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'defaultDistributionId': 1 }]) } },
                { provide: Router, useValue: mockRouter },
                { provide: TreeViewService, useClass: TreeViewServiceSpy },
                { provide: NotificationService, useClass: NotificationServiceSpy }]
        });
        fixture = TestBed.createComponent(TreeViewComponent);
        component = fixture.componentInstance;
        treeViewServiceSpy = TestBed.get(TreeViewService);
        notificationServiceSpy = TestBed.get(NotificationService);
        component.selectedDistribution = null;
    }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
    it('Init is called and request for tree is not made', () => {
        expect(treeViewServiceSpy.requestTree.calls.count()).toBe(0, 'requestTree called');
    });
    it('Init is called and request for tree is made', () => {
        component.ngOnInit();
        expect(treeViewServiceSpy.requestTree.calls.count()).toBe(1, 'requestTree called');
    });
    it('get Tree availabe', () => {
        expect(component.GetTree).toBeTruthy();
    });
    it('is subscribe for FCM notification exists', () => {
        expect(component.subscribeForFCMNotification).toBeTruthy();
    });
    it('on init of Tree component subscribe topic', () => {
        fixture.detectChanges();
        expect(notificationServiceSpy.subscribeTopic.calls.count()).toBe(1, 'topic subscribed');
    });
    it('on unsubscribe topic', () => {
        fixture.detectChanges();
        expect(notificationServiceSpy.unsubscribeTopic.calls.count()).toBe(0, 'topic unsubscribed');
    });
    it('Tree is fetched', () => {
        const notificationObject = {
            'title': 'Get Projects',
            'body': {
                'cmsOperation': 'GetProjects',
                'notificationTopic': 'NA',
                'notificationType': 0,
                'responseId': '1',

            },
            'data': {
                'content': {
                    'nodeList': [
                        { 'nodeId': 1, 'nodeName': 'Working in Unity', 'parentId': null },
                        { 'nodeId': 2, 'nodeName': 'Basics', 'parentId': 1 },
                        { 'nodeId': 3, 'nodeName': 'Getting started', 'parentId': 1 },
                        { 'nodeId': 4, 'nodeName': 'Downloading and installing Unity', 'parentId': 2 },
                        { 'nodeId': 5, 'nodeName': 'Work', 'parentId': null },
                        { 'nodeId': 6, 'nodeName': 'sampleParentNode', 'parentId': null },
                        { 'nodeId': 7, 'nodeName': 'Downloading...', 'parentId': 4 }
                    ]
                }
            }
        };
        component.GetTree(notificationObject);
        expect(treeViewServiceSpy.convertToPrimeNgTree.calls.count()).toBeGreaterThan(0);
    });
    it('on node Select, check if setSelected node is called', () => {
        component.selectedNode = { data: '5.2' };
        component.onNodeSelect();
        expect(treeViewServiceSpy.setSelectedNode.calls.count()).toBe(1);
    });
    it('on node Select, Navigate to document', () => {
        component.selectedNode = { data: '5.2' };
        component.onNodeSelect();
        expect(mockRouter.navigate('./document')).toBe('./document');
    });
});

export class TreeViewServiceSpy {
    requestTree = jasmine.createSpy('requestTree').and.callFake(() => Promise
        .resolve(true)
        .then(() => 1));
    convertToPrimeNgTree = jasmine.createSpy('convertToPrimeNgTree').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, [])));
    setSelectedNode = jasmine.createSpy('setSelectedNode').and.callFake(() => Promise
        .resolve(true));
}
