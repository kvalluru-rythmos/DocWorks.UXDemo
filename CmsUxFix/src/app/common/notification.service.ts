import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { applicationConstants } from '../constants';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { LocalEventEmitterService } from './local-event-emitter.service';
import * as _ from 'underscore';
import * as moment from 'moment';

@Injectable()
export class NotificationService {
    subscriptionEPOC = new Date().getTime() / 1000;
    subscriptionArray = [];

    constructor(private httpService: HttpService, private firestoreDb: AngularFirestore, public localEventEmitterService: LocalEventEmitterService) {
        setInterval(function () {
            if (this.clearSubscriptions) {
                this.clearSubscriptions(this.subscriptionArray, false);
            }
        }.bind(this), applicationConstants.notificationClearInterval);
    }

    clearSubscriptions(subscriptions, isAllUnsubscribe, componentName) {
        console.log('****** Subscription Topics **********');
        _.each(subscriptions, function (value) {
            console.log('subscriptionTopic: ' + value.subscriptionTopic + (isAllUnsubscribe ? (',' + componentName + ' Component Destroyed :-(') : (', subscriptionCollection: ' + value.subscriptionCollection + ', startDate: ' + value.startDate + ', eventName: ' + value.eventName)));
            if (isAllUnsubscribe || (value.expiryDate ? (value.expiryDate < new Date().getTime()) : false)) {
                this.unsubscribe(value);
            }
        }.bind(this));
    }

    subscribeForResponse(value) {
        const epocCurrentTime = Math.round(new Date().getTime() / 1000);
        let subscriptionSubject = new Subject();
        const subscriptionObject = {
            eventName: value.operation.eventName,
            subscriptionSubject: subscriptionSubject,
            startDate: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
            subscriptionTopic: value.subscriptionTopic,
            subscriptionCollection: 'Response',
            handleNotification: value.operation.handleNotification,
            raiseOperationEvent : value.operation.raiseOperationEvent
        };
        this.addToSubscriptionArray(subscriptionObject);
        this.firestoreDb.collection(subscriptionObject.subscriptionCollection).doc(subscriptionObject.subscriptionTopic.toString()).valueChanges().takeUntil(subscriptionSubject).subscribe((payload: any) => {
            if (payload) {
                payload = this.returnPayload(payload, subscriptionObject, applicationConstants.notificationType.Targeted);
                this.emitNotification(payload);
            }
        });
    }

    returnPayload(payload, value, notificationType) {
        payload.eventName = value.eventName;
        payload.expiryDate = value.expiryDate;
        payload.subscriptionTopic = value.subscriptionTopic;
        payload.notificationType = notificationType;
        payload.handleNotification = value.handleNotification;
        payload.raiseOperationEvent = value.raiseOperationEvent;
        return payload;
    }

    unsubscribe(topic) {
        let subscription;
        subscription = _.find(this.subscriptionArray, function (value) {
            return value.subscriptionTopic === topic.subscriptionTopic;
        });
        if (subscription && subscription.subscriptionSubject) {
            subscription.subscriptionSubject.next();
            subscription.subscriptionSubject.complete();
            this.subscriptionArray = _.filter(this.subscriptionArray, function (value) {
                if (value.subscriptionTopic === topic.subscriptionTopic && value.eventName === topic.eventName) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    }

    subscribeTopic(topic) {
        if (topic && !(topic instanceof Array)) {
            this.subscribe(topic);
        } else if (topic && topic instanceof Array) {
            _.each(topic, function (topicValue) {
                this.subscribe(topicValue);
            }.bind(this));
        }
    }

    subscribe(topic) {
        let subscriptionSubject = new Subject();
        const subscriptionObject = {
            eventName: topic.eventName,
            expiryDate: undefined,
            subscriptionSubject: subscriptionSubject,
            startDate: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
            subscriptionTopic: topic.subscriptionTopic,
            subscriptionCollection: topic.value
        };
        this.addToSubscriptionArray(subscriptionObject);
        const subscriptionEPOCTime = new Date().getTime() / 1000;
        this.firestoreDb.doc(subscriptionObject.subscriptionCollection).valueChanges().takeUntil(subscriptionSubject).subscribe(async payload => {
            if (payload && payload['updatedTimeInEpoch'] > subscriptionEPOCTime) {
                payload['notificationType'] = applicationConstants.notificationType.Broadcast;
                payload['eventName'] = subscriptionObject.eventName;
                this.emitNotification(payload);
            }
        });
    }

    subscribeTopicWithQuery(collection, key, operator, value, eventName) {
        let subscriptionSubject = new Subject();
        const subscriptionObject = {
            eventName: eventName,
            expiryDate: undefined,
            subscriptionSubject: subscriptionSubject,
            startDate: moment(new Date()).format('MMMM Do YYYY, h:mm:ss a'),
            subscriptionTopic: value,
            subscriptionCollection: collection
        };
        this.addToSubscriptionArray(subscriptionObject);
        this.firestoreDb.collection(collection, x => x.where(key, operator, value)).valueChanges().takeUntil(subscriptionSubject).subscribe(async payload => {
            if (payload && payload.length > 0) {
                const payloadValue = {
                    data: payload,
                    notificationType: applicationConstants.notificationType.Broadcast,
                    eventName: eventName,
                    isTop: true,
                };
                this.emitNotification(payloadValue);
            }
        });
    }

    unsubscribeTopic(topic) {
        if (topic && !(topic instanceof Array)) {
            this.unsubscribe(topic);
        } else if (topic && topic instanceof Array) {
            _.each(topic, function (topicValue) {
                this.unsubscribe(topicValue);
            }.bind(this));
        }
    }

    emitNotification(payload) {
        if (payload.notificationType === applicationConstants.notificationType.Broadcast) {
            this.emitLocalEvent(payload);
        } else {
            if (payload.status === applicationConstants.eventStatus.success || payload.status === applicationConstants.eventStatus.failure) {
                if (!payload.handleNotification || payload.status === applicationConstants.eventStatus.failure) {
                    this.emitResponse(payload);
                }
            } else {
                if (payload.raiseOperationEvent) {
                    const updatedStatus = {
                        responseId: payload.subscriptionTopic,
                        status: payload.status,
                        completedEventCount: payload.completedEventCount,
                        totalEventCount: payload.totalEventCount,
                        modifiedDate: new Date().getTime() / 1000
                    };
                    this.addOperationEvent(updatedStatus);
                }
            }
        }
    }

    emitResponse(payload) {
        this.httpService.getResponse(payload.subscriptionTopic).then(response => {
            payload.data = response.json();
            if ((payload.data.status === applicationConstants.eventStatus.success || payload.data.status === applicationConstants.eventStatus.failure)) {
                const updatedStatus = {
                    responseId: payload.subscriptionTopic,
                    status: payload.status,
                    completedEventCount: payload.completedEventCount,
                    totalEventCount: payload.totalEventCount,
                    modifiedDate: new Date().getTime() / 1000,
                    data: payload.data.content
                };
                this.addOperationEvent(updatedStatus);
                this.emitLocalEvent(payload);
                this.unsubscribe({ subscriptionTopic: payload.subscriptionTopic, eventName: payload.eventName });
            }
        });
    }

    emitLocalEvent(value) {
        this.localEventEmitterService.localEvent.emit(value);
    }

    addOperationEvent(operation) {
        this.localEventEmitterService.operationEvent.emit({ eventName: 'operationStatusUpdated', value: operation });
    }

    addToSubscriptionArray(value) {
        this.subscriptionArray.push(value);
    }

}
