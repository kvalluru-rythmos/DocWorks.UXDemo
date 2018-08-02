import { Component, OnInit, Injector, Inject } from '@angular/core';
import { AdminService } from './admin.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProjectContent } from '../project/project';
import { commonResponseErrorHandler } from '../common/error-handler';
import { Operation } from '../operation-status/operation';
import { pageTitleList, cmsOperation, eventStatus, topics, applicationConstants } from '../constants';
import { ManageSystemAdminsComponent } from './manage-system-admins.component';
import { BaseParams } from '../common/base-params';

@Component({
    selector: 'app-manage-project-admins',
    templateUrl: './manage-admins.component.html',
    providers: [AdminService]
})
export class ManageProjectAdminsComponent extends ManageSystemAdminsComponent implements OnInit {
    selectedProject: ProjectContent;
    assignedAdmins: any[];
    filterString: string;
    searchString: string;
    recordsFetched = true;
    filteredUsers: any[];
    adminDataFetched = false;
    allowedCmsOperations = [cmsOperation.AssignOrRemoveProjectAdmin];

    constructor(public injector: Injector, public adminService: AdminService, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, { title: pageTitleList.manageProjectAdmins } as BaseParams);
        this.selectedProject = data.project;
        this.topic = { value: topics.Project, subscriptionTopic: topics.Project, eventName: undefined };
    }

    ngOnInit() {
        this.getAssignedProjectAdmins();
    }

    getAssignedProjectAdmins() {
        this.adminService.getAssignedProjectAdmins(this.selectedProject._id).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getProjectAdmin });
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    getProjectAdminEvent(notification: any) {
        this.adminDataFetched = true;
        this.assignedAdmins = notification.data.content.userDetails;
    }

    assignOrRemoveProjectAdminEvent(notification: any) {
        this.getAssignedProjectAdmins();
    }

    removeAdmin(user: any) {
        this.adminService.addOrRemoveProjectAdmin(user.userId, this.selectedProject._id, false).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.assignOrRemoveProjectAdmin });
            const operation = new Operation(responseId, cmsOperation.AssignOrRemoveProjectAdmin, eventStatus.Wait, { userName: user.firstName + ' ' + user.lastName, projectName: this.selectedProject.projectName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    addAdmin(user: any) {
        this.adminService.addOrRemoveProjectAdmin(user.userId, this.selectedProject._id, true).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.assignOrRemoveProjectAdmin });
            const operation = new Operation(responseId, cmsOperation.AssignOrRemoveProjectAdmin, eventStatus.Wait, { userName: user.firstName + ' ' + user.lastName, projectName: this.selectedProject.projectName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }
}
