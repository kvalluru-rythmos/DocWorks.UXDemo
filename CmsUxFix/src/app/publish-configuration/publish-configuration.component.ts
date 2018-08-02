import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthoringCacheService } from '../common/authoring-cache.service';
import { TagCacheService } from '../tags/tag-cache.service';
import { TreeNode } from 'primeng/primeng';
import { TreeViewService } from '../treeview/treeview.service';
import * as _ from 'underscore';
import { utils } from '../common/utils';
import { PublishService } from '../publish-list/publish.service';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, pageTitleList, applicationConstants } from '../constants';
import { BaseComponent } from '../base.component';

@Component({
    selector: 'app-publish-configuration',
    templateUrl: './publish-configuration.component.html',
    providers: [TreeViewService, PublishService]
})
export class PublishConfigurationComponent extends BaseComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<PublishConfigurationComponent>, public injector: Injector,
        private authoringCacheService: AuthoringCacheService,
        private publishService: PublishService,
        private treeViewService: TreeViewService,
        private tagCacheService: TagCacheService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, { title: pageTitleList.publishList } as any);
        this.selectedProjectId = data.selectedProjectId;
        this.selectedDistributionId = data.selectedDistributionId;
        this.selectedNodeIdList = data.selectedNodes;
        this.distributionTitle = data.selectedDistributionTitle;
    }

    selectedProjectId = '';
    selectedDistributionId = '';
    distributionTitle = '';
    selectedNodeIdList = [];
    filteredNodes: TreeNode[];
    treeLoadInProgress = false;
    nodeList: any;
    selectedTags = [];
    assignedTagGroups = [];
    availableTagGroups = [];
    indeterminate = false;

    ngOnInit() {
        this.treeLoadInProgress = true;
        const selectedproject = this.authoringCacheService.getProjectById(this.selectedProjectId);
        this.availableTagGroups = this.tagCacheService.getTagGroupsForIds(selectedproject.tagGroups);
        this.publishService.getNodeListForPublish(this.selectedNodeIdList, this.selectedDistributionId).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getNodeListForPublish });
        }, error => {
            this.treeLoadInProgress = false;
        });
    }

    getNodeListForPublishEvent(notification) {
        if (notification.data.content.distributionId === this.selectedDistributionId) {
            this.nodeList = notification.data.content.distributionSnapshotDataList;
            this.treeLoadInProgress = false;
            this.filterNodes();
        }
    }

    filterNodes() {
        this.filteredNodes = JSON.parse(JSON.stringify(this.nodeList));
        this.filteredNodes = this.filterNodesBySelectedTagGroups(this.filteredNodes);
        this.filteredNodes = this.treeViewService.convertToPrimeNgTree(new utils().listToTree(this.filteredNodes), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
        this.filteredNodes = new utils().searchTree(this.filteredNodes, '', true);
    }

    filterNodesBySelectedTagGroups(nodes) {
        let tagIds = [];

        _.each(this.assignedTagGroups, function (tagGroup) {
            if (tagGroup.tags && tagGroup.tags.length > 0) {
                const tags = _.pluck(tagGroup.tags, 'tagId');
                tagIds = tagIds.concat(tags);
            }
        });

        return _.filter(nodes, function (treeNode) {
            treeNode.styleClass = 'visible';
            if (_.intersection(tagIds, treeNode.tags).length < 1) {
                treeNode.styleClass = 'inVisible';
            }
            return treeNode;
        }.bind(this));
    }

    addTag(tag: any, tagGroup: any) {
        if (!_.find(this.assignedTagGroups, function (atagGroup) { return tagGroup.tagGroupId === atagGroup['tagGroupId']; })) {
            this.assignedTagGroups.push({
                tagGroupName: tagGroup.tagGroupName,
                tagGroupId: tagGroup.tagGroupId,
                colour: tagGroup.colour,
                tagGroupType: tagGroup.tagGroupType,
                tags: []
            });
        }
        this.assignedTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.assignedTagGroups);
        this.availableTagGroups = this.removeTagFromTagGroup(tag.tagId, tagGroup.tagGroupId, this.availableTagGroups);
        this.filterNodes();
    }

    removeTag(tag: any, tagGroup: any) {
        this.assignedTagGroups = this.removeTagFromTagGroup(tag.tagId, tagGroup.tagGroupId, this.assignedTagGroups);
        this.availableTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.availableTagGroups);
        this.filterNodes();
    }

    assignTagToTagGroup(tag: any, tagGroupId: any, tagGroups: any[]) {
        tagGroups = _.filter(tagGroups, function (item) {
            if (item.tagGroupId === tagGroupId) {
                item.tags.push(tag);
            }
            return item;
        });
        return tagGroups;
    }

    removeTagFromTagGroup(tagId: string, tagGroupId: string, tagGroups: any[]) {
        tagGroups = _.filter(tagGroups, function (item) {
            if (item.tagGroupId === tagGroupId) {
                item.tags = _.filter(item.tags, function (atag) {
                    if (atag.tagId !== tagId) {
                        return atag;
                    }
                });
            }
            return item;
        });
        return tagGroups;
    }

    publishClick() {
        let tags = [];
        _.each(this.assignedTagGroups, function (tagGroup) {
            _.each(tagGroup.tags, function (tag) {
                tags.push(tag.tagId);
            });
        });

        const value = { distributionId: this.selectedDistributionId, selectedNodeIdList: this.selectedNodeIdList, excludedTagIdList: tags };
        this.publishService.publishDistribution(value).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.publishDistribution });
            const operation = new Operation(responseId, cmsOperation.PublishDistribution, eventStatus.Wait, { distributionName: this.distributionTitle });
            this.addOperationEvent(operation);
            this.dialogRef.close(responseId);
        }, error => {
            console.log(error);
        });

    }
}
