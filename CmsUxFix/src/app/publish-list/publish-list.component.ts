import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { topics, entityStatus, pageTitleList, cmsOperation, eventStatus, applicationConstants, PublishNodeOperation } from '../constants';
import { PublishService } from './publish.service';
import { BaseComponent } from '../base.component';
import { MatTabChangeEvent } from '@angular/material';
import { Operation } from '../operation-status/operation';
import * as _ from 'underscore';
import { ProjectService } from '../project/project.service';
import { MatDialog } from '@angular/material';
import { PublishConfigurationComponent } from '../publish-configuration/publish-configuration.component';

@Component({
    selector: 'app-publish-list',
    templateUrl: './publish-list.component.html',
    providers: [PublishService]
})
export class PublishListComponent extends BaseComponent implements OnInit, OnDestroy {

    isDataLoading: boolean;
    entityStatus = entityStatus;
    isPublishQueue = true;
    isPublishDistributionInProgress: boolean;
    publishHistoryArray = [];
    publishQueueArray = [];
    liveDraftNodeArray = [];
    isLiveDraftDataLoading: any;
    selectedDistributionId: string;
    selectedProjectId: string;
    selectedDistributionTitle: string;
    selectedProject: any;
    filterNodes = '';
    selectAllNodes = false;
    indeterminate = false;
    publishNodeOperation = PublishNodeOperation;
    searchString: string;

    constructor(public injector: Injector,
        public publishService: PublishService,
        public dialog: MatDialog,
        private projectService: ProjectService
    ) {
        super(injector, { title: pageTitleList.publishList } as any);
    }

    ngOnInit() {
        this.subscribeTabs();
    }

    subscribeTabs() {
        this.unsubscribe();
        this.topic = this.isPublishQueue ? { value: topics.PublishQueue, subscriptionTopic: topics.PublishQueue, eventName: 'getDistributionsQueuedForPublish' } : { value: topics.PublishHistory, subscriptionTopic: topics.PublishHistory, eventName: 'getPublishHistoryList' };
        this.subscribeTopic();
        this.getTabData();
    }
    changeTab(event: MatTabChangeEvent) {
        this.isPublishQueue = event.index === 0;
        this.subscribeTabs();
    }

    getTabData() {
        this.isPublishDistributionInProgress = false;
        this.publishHistoryArray = [];
        this.publishQueueArray = [];
        this.liveDraftNodeArray = [];
        this.selectedDistributionTitle = '';
        if (this.isPublishQueue) {
            this.getDistributionsQueuedForPublish();
        } else {
            this.getPublishHistoryList();
        }
    }

    getPublishHistoryList() {
        this.isDataLoading = true;
        this.publishHistoryArray = [];
        this.publishService.getPublishHistoryQueues().then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getPublishHistory });
        });
    }

    getPublishHistoryEvent(notification) {
        this.publishHistoryArray = notification.data.content.publishHistory;
        this.isDataLoading = false;
    }

    getDistributionsQueuedForPublish() {
        this.isDataLoading = true;
        this.publishQueueArray = [];
        this.publishService.getDistributionsQueuedForPublish().then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getDistributionsQueuedForPublish });
        }, error => {
            this.isDataLoading = false;
        });
    }

    getDistributionsQueuedForPublishEvent(notification) {
        this.publishQueueArray = notification.data.content.projects;
        if (this.publishQueueArray && this.publishQueueArray.length > 0 && this.publishQueueArray[0].distributions && this.publishQueueArray[0].distributions.length > 0) {
            this.selectedDistributionId = this.publishQueueArray[0].distributions[0].distributionId;
            this.selectedProjectId = this.publishQueueArray[0].projectId;
            this.selectedProject = this.publishQueueArray[0];
            this.selectedDistributionTitle = this.publishQueueArray[0].projectName + ' - ' + this.publishQueueArray[0].distributions[0].distributionName + ' - ';
            this.getNodeListForLiveDraft(this.publishQueueArray[0].distributions[0]);
        } else {
            this.publishQueueArray = [];
        }
        this.isDataLoading = false;
    }

    getNodeListForLiveDraft(distribution) {
        this.indeterminate = false;
        this.selectAllNodes = false;
        this.isLiveDraftDataLoading = true;
        this.isPublishDistributionInProgress = false;
        this.liveDraftNodeArray = [];
        this.userService.removeRole(applicationConstants.roles.ProjectAdmin);
        const project = this.projectService.getSelectedProject();
        const isProjectAdmin = this.authorizationService.isProjectAdmin(project.projectAdmins);
        if (isProjectAdmin) {
            this.userService.assignRole(applicationConstants.roles.ProjectAdmin);
        } else {
            this.userService.removeRole(applicationConstants.roles.ProjectAdmin);
        }
        this.publishService.getNodesForLiveDraftsAfterDistributionPublish(distribution.distributionId).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getNodesForLiveDraftsAfterDistributionPublish });
        });
    }

    getNodesForLiveDraftsAfterDistributionPublishEvent(notification: any) {
        this.isLiveDraftDataLoading = false;
        if (notification.data.content.nodeList && notification.data.content.nodeList.length > 0) {
            this.liveDraftNodeArray = notification.data.content.nodeList;
        } else {
            this.liveDraftNodeArray = [];
        }
    }

    publishConfiguration() {
        const nodes = _.filter(this.liveDraftNodeArray, function (node) {
            return node.isSelected;
        });
        const selectedNodeIdList = _.pluck(nodes, 'nodeId');
        let dialogRef = this.dialog.open(PublishConfigurationComponent, {
            data: { selectedProjectId: this.selectedProjectId, selectedDistributionId: this.selectedDistributionId, selectedDistributionTitle: this.selectedDistributionTitle, selectedNodes: selectedNodeIdList },
            width: '90vw',
            height: '85vh',
            panelClass: 'publish-distribution-dialog',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isPublishDistributionInProgress = true;
            }
        });
    }

    publishDistributionEvent(notification) {
        this.getTabData();
    }

    getTotalLiveDistributionCount(distributions) {
        let totalCount = 0;
        _.each(distributions, function (distribution) {
            try {
                // tslint:disable-next-line:radix
                totalCount = totalCount + (distribution.liveDraftsToBePublishedCount ? parseInt(distribution.liveDraftsToBePublishedCount) : 0);
            } catch (e) {
                console.log(distribution.liveDraftsToBePublishedCount + ' not a valid number.');
            }
        });
        return totalCount;
    }

    ngOnDestroy() {
        this.userService.removeRole(applicationConstants.roles.ProjectAdmin);
        this.cleanUp();
    }

    selectAll() {
        _.each(this.liveDraftNodeArray, function (node) {
            if (node.title.toLowerCase().indexOf(this.filterNodes.toLowerCase()) >= 0) {
                node.isSelected = !this.selectAllNodes;
            }
        }.bind(this));
    }

    checkIndeterminate() {
        let isNodeSelected = false;
        let isNodeUnselecetd = false;
        _.each(this.liveDraftNodeArray, function (node) {
            if (node.title.toLowerCase().indexOf(this.filterNodes.toLowerCase()) >= 0 && node.isSelected) {
                isNodeSelected = true;
            }
        }.bind(this));

        _.each(this.liveDraftNodeArray, function (node) {
            if (node.title.toLowerCase().indexOf(this.filterNodes.toLowerCase()) >= 0 && !node.isSelected) {
                isNodeUnselecetd = true;
            }
        }.bind(this));
        if (isNodeSelected && isNodeUnselecetd) {
            this.indeterminate = true;
        } else if (isNodeSelected) {
            this.indeterminate = false;
            this.selectAllNodes = true;
        } else {
            this.indeterminate = false;
            this.selectAllNodes = false;
        }
    }

    acceptDraftToLiveEvent() {
        this.getTabData();
    }
}
