import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { Headers, Http, Response, HttpModule, BaseRequestOptions, RequestMethod } from '@angular/http';
import { TestBed, fakeAsync, inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { FakeNotificationService } from '../app.mock-services';

describe('Notification Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NotificationService, useValue: FakeNotificationService },
                HttpService,
            ]
        });
    });

    it('should be created', inject([NotificationService], (service: FakeNotificationService) => {
        expect(service).toBeTruthy();
    }));

    it('subscribe Topic for Project', inject([NotificationService], (nservice: FakeNotificationService) => {
        const topic = '';
        // tslint:disable-next-line:prefer-const
        let service = new FakeNotificationService();
        expect(service.subscribeTopic(topic)).toEqual('success');
    }));

    it('unsubscribe Topic for Project', inject([NotificationService], (nservice: FakeNotificationService) => {
        const topic = 'Project';
        // tslint:disable-next-line:prefer-const
        let service = new FakeNotificationService();
        expect(service.unsubscribeTopic(topic)).toEqual('success');
    }));
});



