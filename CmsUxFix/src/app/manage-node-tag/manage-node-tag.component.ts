import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { commonResponseErrorHandler } from '../common/error-handler';
import { TagCacheService } from '../tags/tag-cache.service';
import { TagViewService } from '../tag-view/tag-view.service';
import { ManageTagOperation } from '../tags/tagConstants';
import * as _ from 'underscore';
import { BaseComponent } from '../base.component';
import { pageTitleList, topics, cmsOperation, eventStatus, TagGroupType, applicationConstants } from '../constants';
import { Operation } from '../operation-status/operation';
import { AdminService } from '../manage-admins/admin.service';
@Component({
    selector: 'app-manage-node-tag',
    templateUrl: '../tags/manage-project-tag-group.component.html',
    providers: [TagViewService, AdminService]
})
export class ManageNodeTagComponent extends BaseComponent implements OnInit {
    selectedProject: any;
    selectedNode: any;
    availableTagGroups: any;
    assignedTagGroups: any;
    manageTagOperation = ManageTagOperation.ManageNodeTag;
    tagGroupType = TagGroupType;
    tagGroupResponseIdMap = {};
    searchString: string;

    constructor(public injector: Injector, private tagService: TagViewService,
        private tagCacheService: TagCacheService,
        private adminService: AdminService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(injector, { title: pageTitleList.manageTagGroupNodeLevel } as any);
        this.selectedNode = data.node;
        this.selectedProject = data.project;
        this.getAvailableTags();
        this.topic = { value: topics.Node + '/' + this.selectedNode.nodeId, subscriptionTopic: topics.Node + '/' + this.selectedNode.nodeId, eventName: 'updateNodeTagList' };
    }

    ngOnInit() {
    }

    refreshNodesEvent(data) {
        this.selectedNode = _.find(data.value.nodeList, function (node) {
            return node.nodeId === this.selectedNode.nodeId;
        }.bind(this));
        this.getAvailableTags();
    }

    tagGroupsUpdate(data: any) {
        this.getAvailableTags();
    }

    getAvailableTags() {
        const allTagGroups = this.tagCacheService.getTagGroupsForIds(this.selectedProject.tagGroups);
        this.availableTagGroups = this.tagService.getAvailableTagGroups(allTagGroups, this.selectedNode.tags);
        this.assignedTagGroups = this.tagService.getAssignedTagGroups(allTagGroups, this.selectedNode.tags);
    }

    addTag(tag: any, tagGroup: any) {
        tag.inProgress = true;
        this.assignedTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.assignedTagGroups);
        this.availableTagGroups = this.removeTagFromTagGroup(tag.tagId, tagGroup.tagGroupId, this.availableTagGroups);
        const requestObject = { nodeId: this.selectedNode.nodeId, tags: [tag.tagId] };
        this.tagService.addTagsToNode(requestObject).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.addTagsToNode });
            const operation = new Operation(responseId, cmsOperation.AddTagsToNode, eventStatus.Wait, { tagName: tag.tagName, nodeName: this.selectedNode.shortTitle });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
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


    getTagsForNodeEvent(notification: any) {
        this.selectedNode.tags = notification.data.content.tags;
        this.getAvailableTags();
    }

    checkLimitToOne(tagGroup: any) {
        if (!tagGroup.limitToOne) {
            return true;
        } else if (_.find(this.assignedTagGroups, function (aTagGroup) {
            return aTagGroup.tagGroupId === tagGroup.tagGroupId;
        }).tags.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    removeTag(tag: any, tagGroup: any) {
        tag.inProgress = true;
        this.assignedTagGroups = this.removeTagFromTagGroup(tag.tagId, tagGroup.tagGroupId, this.assignedTagGroups);
        this.availableTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.availableTagGroups);
        const requestObject = { nodeId: this.selectedNode.nodeId, tags: [tag.tagId] };
        this.tagService.removeTagsFromNode(requestObject).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteTagsFromNode });
            const operation = new Operation(responseId, cmsOperation.DeleteTagsFromNode, eventStatus.Wait, { tagName: tag.tagName, nodeName: this.selectedNode.shortTitle });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }


    getUsers(tagGroup, searchString) {
        this.adminService.getFilteredUsers(searchString).then(responseId => {
            this.tagGroupResponseIdMap[tagGroup.tagGroupId] = responseId;
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getUserDetails });
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    getUserDetailsEvent(notification: any) {
        _.each(this.availableTagGroups, function (tagGroup) {
            if (this.tagGroupResponseIdMap[tagGroup.tagGroupId] === notification.subscriptionTopic) {
                tagGroup.fetchingRecords = false;
                tagGroup.filteredUsers = this.filterUsers(tagGroup.tagGroupId, notification.data.content.userProfiles);
            }
        }.bind(this));
    }

    filterUsers(tagGroupId, users) {
        const assignedTagGroup = _.find(this.assignedTagGroups, function (tagGroup) {
            return tagGroup.tagGroupId === tagGroupId;
        });
        const assignedUsers = assignedTagGroup.tags ? assignedTagGroup.tags : [];
        return _.filter(users, function (user) {
            return !this.checkUserAssigned(user, assignedUsers);
        }.bind(this));


    }

    checkUserAssigned(user: any, assignedUsers: any[]) {
        return _.find(assignedUsers, function (assignedUser) {
            return assignedUser.assigneeUserId === user.userId;
        }) ? true : false;
    }

    assignUserToNode(tagGroup, user) {
        const tag = { tagId: '', tagName: user.firstName + ' ' + user.lastName, inProgress: true };
        this.assignedTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.assignedTagGroups);

        this.availableTagGroups = _.each(this.availableTagGroups, function (item) {
            if (item.tagGroupId === tagGroup.tagGroupId) {
                tagGroup.filteredUsers = _.filter(tagGroup.filteredUsers, function (availableUser) {
                    return availableUser.userId !== user.userId;
                });
            }
        });
        const requestObject = { nodeId: this.selectedNode.nodeId, tagGroupId: tagGroup.tagGroupId, assigneeUserId: user.userId };
        this.tagService.addTagsToNode(requestObject).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.addTagsToNode });
            const operation = new Operation(responseId, cmsOperation.AddTagsToNode, eventStatus.Wait, { tagName: user.firstName + ' ' + user.lastName, nodeName: this.selectedNode.shortTitle });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }
}
