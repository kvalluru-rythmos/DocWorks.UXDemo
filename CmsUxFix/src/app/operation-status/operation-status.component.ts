import { Component, OnInit, Injector } from '@angular/core';
import * as _ from 'underscore';
import { eventStatus, cmsOperation } from '../constants';
import { Router } from '@angular/router';
import { BaseComponent } from '../base.component';
import { TemplateService } from '../common/template.service';
import { Subject } from 'rxjs/Subject';
import { utils } from '../common/utils';

@Component({
    selector: 'app-operation-status',
    templateUrl: './operation-status.component.html',
    providers: [TemplateService]
})
export class OperationStatusComponent extends BaseComponent implements OnInit {
    userOperations: any;
    isDataLoading: boolean;
    constEventStatus = eventStatus;
    constructor(public injector: Injector, private templateService: TemplateService,
        private router: Router) {
        super(injector, { title: undefined } as any);
    }

    ngOnInit() {
        this.subscription = new Subject();
        this.subscribeToOperationEvent();
    }

    subscribeToOperationEvent() {
        this.localEventEmitterService.operationEvent.subscribe((data: any) => {
            const eventName = data.eventName;
            if (eventName && this[eventName]) {
                this[eventName](data.value);
            }
        });
    }

    operationStatusUpdateEvent(operations: any) {
        this.userOperations = operations;
        _.each(this.userOperations, function (operation) {
            operation.description = this.templateService.getTemplateString('operationStatus.' + operation.cmsOperation.toString() + '.' + operation.status.toString(), operation.data);
            operation.progress = operation.completedEventCount * 100 / operation.totalEventCount;
        }.bind(this));
        this.userOperations = new utils().clone(this.userOperations);
    }

    returnCMSOperationName(value: any) {
        const type = cmsOperation[value];
        return type;
    }

    navigateToErrorDetail(responseId) {
        this.router.navigate(['/errordetail', responseId]);
    }

    getClass(item) {
        if (item.status === this.constEventStatus.Wait || item.status === this.constEventStatus.Unknown) {
            return 'operation-progress';
        } else if (item.status === this.constEventStatus.Success) {
            return 'operation-success';
        } else {
            return 'operation-error';
        }
    }

    navigateToURL(operation) {
        if (operation.url && operation.url.length > 0) {
            this.router.navigateByUrl(operation.url);
            this.emitLocalEvent({ eventName: 'openNotificationSideNav', value: false });
        } else {
            return;
        }
    }
}
