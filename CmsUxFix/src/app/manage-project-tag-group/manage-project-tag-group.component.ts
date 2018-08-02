import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { commonResponseErrorHandler } from '../common/error-handler';
import { TagCacheService } from '../tags/tag-cache.service';
import { ProjectService } from '../project/project.service';
import * as _ from 'underscore';
import { ManageTagOperation } from '../tags/tagConstants';
import { pageTitleList, topics, cmsOperation, eventStatus, TagGroupType, applicationConstants } from '../constants';
import { BaseComponent } from '../base.component';
import { Operation } from '../operation-status/operation';
import { ServiceResponse } from '../common/data-promise-response';

@Component({
    selector: 'app-manage-project-tag-group',
    templateUrl: '../tags/manage-project-tag-group.component.html'
})
export class ManageProjectTagGroupComponent extends BaseComponent implements OnInit {
    selectedProject: any;
    availableTagGroups: any;
    assignedTagGroups: any;
    tagGroupType = TagGroupType;
    manageTagOperation = ManageTagOperation.ManageProjectTagGroup;
    searchString: string;

    constructor(public injector: Injector,
        private projectService: ProjectService, private tagCacheService: TagCacheService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(injector, { title: pageTitleList.manageTagGroupProjectLevel } as any);
        this.selectedProject = data.project;
        this.getAvailableTagGroups();
        this.unsubscribe();
        this.topic = { value: topics.Project + '/' + data.project._id, subscriptionTopic: topics.Project + '/' + data.project._id, eventName: 'refreshTagGroupForProject' };
        this.subscribeTopic();
    }

    ngOnInit() {
    }

    refreshTagGroupForProject() {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.projectService.getTagGroupsForProject(this.selectedProject._id) as ServiceResponse;
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getTagGroupsForProject });
        });
    }

    tagGroupsUpdate(data: any) {
        this.getAvailableTagGroups();
    }

    getAvailableTagGroups() {
        this.assignedTagGroups = this.tagCacheService.getTagGroupsForIds(this.selectedProject.tagGroups);
        this.availableTagGroups = this.tagCacheService.getExcludedTagGroups(this.selectedProject.tagGroups);
    }

    addTagGroup(tagGroup: any) {
        tagGroup.inProgress = true;
        this.assignedTagGroups.push(tagGroup);
        this.availableTagGroups = _.filter(this.availableTagGroups, function (item) {
            if (item.tagGroupId !== tagGroup.tagGroupId) {
                return tagGroup;
            }
        });
        const requestObject = { projectId: this.selectedProject._id, tagGroups: [tagGroup.tagGroupId] };
        this.projectService.addTagGroupsToProject(requestObject).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.addTagGroupsToProject });
            const operation = new Operation(responseId, cmsOperation.AddTagGroupsToProject, eventStatus.Wait, { tagGroupName: tagGroup.tagGroupName, projectName: this.selectedProject.projectName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    addTagGroupsToProjectEvent() {
        this.refreshTagGroupForProject();
    }

    getTagGroupsForProjectEvent(notification: any) {
        this.selectedProject.tagGroups = notification.data.content.tagGroups;
        this.emitLocalEvent({ eventName: 'ProjectTagGroupsUpdateEvent', value: this.selectedProject });
        this.getAvailableTagGroups();
    }

    removeTagGroup(tagGroup: any) {
        tagGroup.inProgress = true;
        this.availableTagGroups.push(tagGroup);
        this.assignedTagGroups = _.filter(this.assignedTagGroups, function (item) {
            if (item.tagGroupId !== tagGroup.tagGroupId) {
                return tagGroup;
            }
        });
        const requestObject = { projectId: this.selectedProject._id, tagGroups: [tagGroup.tagGroupId] };
        this.projectService.removeTagGroupsFromProject(requestObject).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteTagGroupsFromProject });
            const operation = new Operation(responseId, cmsOperation.DeleteTagGroupsFromProject, eventStatus.Wait, { tagGroupName: tagGroup.tagGroupName, projectName: this.selectedProject.projectName });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    deleteTagGroupsFromProjectEvent(notification: any) {
        this.refreshTagGroupForProject();
    }
}
