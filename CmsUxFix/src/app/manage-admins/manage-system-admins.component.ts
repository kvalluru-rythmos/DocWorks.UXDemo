import { Component, OnInit, OnChanges, Injector, Input, Inject, Optional } from '@angular/core';
import { BaseComponent } from '../base.component';
import { pageTitleList, cmsOperation, eventStatus, topics, applicationConstants } from '../constants';
import { AdminService } from './admin.service';
import { commonResponseErrorHandler } from '../common/error-handler';
import * as _ from 'underscore';
import { Operation } from '../operation-status/operation';
import { BaseParams } from '../common/base-params';

@Component({
    selector: 'app-manage-system-admins',
    templateUrl: './manage-admins.component.html',
    providers: [AdminService]
})
export class ManageSystemAdminsComponent extends BaseComponent implements OnChanges {
    @Input() selectedTabIndex: number;
    assignedAdmins: any[];
    filterString: string;
    searchString: string;
    recordsFetched = true;
    filteredUsers: any[];
    adminService: AdminService;
    topics = topics;
    adminDataFetched = false;
    lastSearchString: string;
    selectedProject: any;
    allowedCmsOperations = [cmsOperation.AssignOrRemoveSystemAdmin];

    constructor(public injector: Injector, @Optional() public parameters: BaseParams
    ) {
        super(injector, { title: parameters ? parameters.title : pageTitleList.manageSystemAdmins } as any);
        this.adminService = injector.get(AdminService);
    }


    ngOnChanges() {
        if (this.selectedTabIndex === 1) {
            this.unsubscribe();
            this.topic = { value: topics.SystemAdmin, subscriptionTopic: topics.SystemAdmin, eventName: 'assignOrRemoveSystemAdminEvent' };
            this.subscribeTopic();
            this.getAssignedAdmins();
        }
    }

    private getAssignedAdmins() {
        this.adminService.getAssignedSystemAdmins().then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getSystemAdmin });
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    getSystemAdminEvent(notification: any) {
        this.adminDataFetched = true;
        this.assignedAdmins = notification.data.content.userDetails;
    }

    getMatchingRecords() {
        if (this.lastSearchString !== this.filterString) {
            this.filteredUsers = [];
            this.recordsFetched = false;
            this.adminService.getFilteredUsers(this.filterString).then(responseId => {
                this.lastSearchString = this.filterString;
                this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getUserDetails });
            }, error => {
                const errorMessage = commonResponseErrorHandler(error);
            });
        }
    }

    getUserDetailsEvent(notification: any) {
        this.recordsFetched = true;
        this.filteredUsers = _.filter(notification.data.content.userProfiles, function (user) {
            return !this.checkUserAssigned(user);
        }.bind(this));
    }

    checkUserAssigned(user: any) {
        return _.find(this.assignedAdmins, function (admin) {
            return admin.userId === user.userId;
        }) ? true : false;
    }

    addAdmin(user: any) {
        this.adminService.addOrRemoveSystemAdmin(user.userId, true).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.assignOrRemoveSystemAdmin });
            const operation = new Operation(responseId, cmsOperation.AssignOrRemoveSystemAdmin, eventStatus.Wait, { userName: user.firstName + ' ' + user.lastName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    removeAdmin(user: any) {
        this.adminService.addOrRemoveSystemAdmin(user.userId, false).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.assignOrRemoveSystemAdmin });
            const operation = new Operation(responseId, cmsOperation.AssignOrRemoveSystemAdmin, eventStatus.Wait, { userName: user.firstName + ' ' + user.lastName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    assignOrRemoveSystemAdminEvent(notification: any) {
        this.getAssignedAdmins();
    }
}
