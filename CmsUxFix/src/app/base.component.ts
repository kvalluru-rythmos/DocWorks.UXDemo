import { Component, OnDestroy, OnInit, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NotificationService } from './common/notification.service';
import { applicationConstants, cmsOperation } from './constants';
import { BaseParams } from './common/base-params';
import { UserService } from './common/user.service';
import { AuthorizationService } from './common/authorization.service';
import { LocalEventEmitterService } from './common/local-event-emitter.service';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';
import * as _ from 'underscore';

@Component({
    selector: 'app-base',
    template: '<div><div>',
})
export class BaseComponent implements OnDestroy {
    responseCollection = [];
    subscription: any;
    notificationService: NotificationService;
    userService: UserService;
    authorizationService: AuthorizationService;
    localEventEmitterService: LocalEventEmitterService;
    titleService: Title;
    topic: any;
    title: any;
    cmsOperations = cmsOperation;
    loggedInUserId: string;

    constructor(public injector: Injector, public parameters: BaseParams) {
        this.notificationService = injector.get(NotificationService);
        this.authorizationService = injector.get(AuthorizationService);
        this.localEventEmitterService = injector.get(LocalEventEmitterService);
        this.titleService = injector.get(Title);
        this.userService = injector.get(UserService);
        this.title = parameters.title;
        this.loggedInUserId = this.userService.user ? (this.userService.user.profile ? this.userService.user.profile.userId : '') : '';
        this.subscribeForLocalEventEmitter();
        this.setPageTitle(this.title);
    }

    subscribeForResponse(value) {
        if (!value.operation.raiseOperationEvent) {
            this.responseCollection.push({ subscriptionTopic: value.subscriptionTopic, eventName: value.operation.eventName, raiseOperationEvent: value.operation.raiseOperationEvent });
        }
        this.notificationService.subscribeForResponse(value);
    }

    setPageTitle(title) {
        if (title) {
            this.titleService.setTitle(title);
        }
    }

    subscribeForLocalEventEmitter() {
        this.subscription = new Subject();
        this.localEventEmitterService.localEvent.takeUntil(this.subscription).subscribe((data: any) => {
            const eventName = data.eventName;
            let subscriptionTopic = _.find(this.responseCollection, function (value) {
                return value.subscriptionTopic === data.subscriptionTopic;
            });
            if ((!data.notificationType) || data.notificationType === applicationConstants.notificationType.Broadcast || subscriptionTopic) {
                if (eventName && this[eventName]) {
                    this[eventName](data);
                }
            }
            if (data.notificationType !== applicationConstants.notificationType.Broadcast) {
                if (data.subscriptionTopic) {
                    this.responseCollection = _.filter(this.responseCollection, function (value) {
                        return value.subscriptionTopic !== data.subscriptionTopic;
                    });
                }
            }
        });
    }

    subscribeTopic() {
        if (this.topic) {
            this.notificationService.subscribeTopic(this.topic);
        }
    }

    ngOnDestroy() {
        this.cleanUp();
    }

    cleanUp() {
        this.unsubscribe();
        if (this.subscription) {
            this.subscription.next();
            this.subscription.complete();
        }
        this.notificationService.clearSubscriptions(this.responseCollection, true, this.constructor.name);
    }

    unsubscribe() {
        if (this.topic) {
            this.notificationService.unsubscribeTopic(this.topic);
        }
    }

    isOperationAllowed(operations) {
        return this.authorizationService.isOperationAllowed(operations);
    }

    checkAccess(project, cmsOperations) {
        if (this.authorizationService.isOperationAllowed(cmsOperations)) {
            return true;
        } else {

            return this.authorizationService.isProjectAdmin(project ? project.projectAdmins : []);
        }
    }

    getProfileShortName(value) {
        return (value.firstName ? value.firstName.charAt(0).toString().toUpperCase() : '') + (value.lastName ? value.lastName.charAt(0).toString().toUpperCase() : '');
    }

    addOperationEvent(operation) {
        this.localEventEmitterService.operationEvent.emit({ eventName: 'addOperation', value: operation });
    }

    emitLocalEvent(value) {
        this.localEventEmitterService.localEvent.emit(value);
    }

    equals(oldValue, newValue) {
        if (newValue === '' || JSON.stringify(newValue) === '[]') {
            return false;
        }
        if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
            return true;
        } else {
            return false;
        }
    }
}
