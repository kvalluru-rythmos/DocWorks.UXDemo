import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';
import * as _ from 'underscore';
import { applicationConstants } from '../constants';
import { NotificationService } from '../common/notification.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';
import { StorageService } from '../common/storage.service';
import { UserService } from '../common/user.service';

@Injectable()
export class OperationStatusService {

    operations = [];
    loggedInUserId: string;

    constructor(private httpService: HttpService, private storageService: StorageService, private userService: UserService,
        private notificationService: NotificationService, public localEventEmitterService: LocalEventEmitterService) {
        this.loggedInUserId = this.userService.getProfile().userId;
        this.subscribeForOperationEventEmitter();
        this.getOperationsFromLocalStorage();
    }

    getOperationsFromLocalStorage() {
        let pendingResponseIds = [];
        const operations = this.storageService.read(this.loggedInUserId + '_pendingOperations');
        if (operations) {
            this.operations = _.filter(operations, function (operation) {
                return operation.status === applicationConstants.eventStatus.wait;
            });
            pendingResponseIds = _.pluck(this.operations, 'responseId');
        }
        this.getPendingResponses(pendingResponseIds);
    }

    subscribeForOperationEventEmitter() {
        this.localEventEmitterService.operationEvent.subscribe(data => {
            if (data.eventName && this[data.eventName]) {
                this[data.eventName](data.value);
            }
        });
    }

    updateLocalStorage() {
        this.storageService.write(this.loggedInUserId + '_pendingOperations', this.operations);
    }

    operationStatusUpdated(payload: any) {
        this.operations = _.filter(this.operations, function (operation) {
            if (operation.responseId === payload.responseId) {
                operation.status = payload.status;
                operation.isRead = false;
                operation.completedEventCount = payload.completedEventCount;
                operation.totalEventCount = payload.totalEventCount;
                operation.operationDate = payload.modifiedDate;

                if (operation.url && operation.url.length > 0) {
                    operation.url = this.getUrl(operation.url, payload.data);
                }
            }
            return operation;
        }.bind(this));
        this.updateLocalStorage();
        this.addOperationEvent(this.operations);
    }

    addOperation(operation) {
        operation.isRead = false;
        this.operations.unshift(operation);
        this.updateLocalStorage();
        this.addOperationEvent(this.operations);
    }

    markOperationAsRead() {
        _.each(this.operations, function (value) {
            value.isRead = true;
        });
        this.addOperationEvent(this.operations);
    }

    getUnreadOperationCount() {
        const unreadOperationList = _.filter(this.operations, function (value) { return (value.isRead !== true); });
        return unreadOperationList.length;
    }

    getPendingResponses(pendingResponseIds) {
        _.each(pendingResponseIds, function (responseId) {
            this.httpService.getResponse(responseId).then(response => {
                const payload = response.json();

                _.each(this.operations, function (operation) {
                    if (operation.responseId === responseId) {
                        operation.status = payload ? payload.status : applicationConstants.eventStatus.unknown;
                        operation.isRead = false;
                        operation.completedEventCount = payload ? payload.completedEventCount : undefined;
                        operation.totalEventCount = payload ? payload.totalEventCount : undefined;
                    }
                });

                if (payload && payload.status === applicationConstants.eventStatus.wait) {
                    this.notificationService.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getPendingResponses });
                }
                this.addOperationEvent(this.operations);
            });
        }.bind(this));
    }


    getUrl(url, data) {
        const properties = _.keys(data);
        _.each(properties, function (aProp) {
            url = url.replace(new RegExp('{{' + aProp + '}}', 'g'), data[aProp]);
        });
        return url;
    }

    addOperationEvent(operation) {
        this.localEventEmitterService.operationEvent.emit({ eventName: 'operationStatusUpdateEvent', value: operation });
    }
}
