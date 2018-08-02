import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TagCacheService } from '../tags/tag-cache.service';
import { BaseComponent } from '../base.component';
import { pageTitleList, topics, TagGroupType, MultipleNodesTaggingOperation } from '../constants';
import { TreeNode } from 'primeng/components/common/api';
import * as _ from 'underscore';
import { TagViewService } from '../tag-view/tag-view.service';
import { TreeViewService } from '../treeview/treeview.service';

@Component({
    selector: 'app-manage-tags-to-multiple-nodes',
    templateUrl: './manage-tags-to-multiple-nodes.component.html',
    providers: [TagViewService]
})
export class ManageTagsToMultipleNodesComponent extends BaseComponent implements OnInit {

    constructor(public injector: Injector, private treeViewService: TreeViewService,
        private tagCacheService: TagCacheService, public dialogRef: MatDialogRef<ManageTagsToMultipleNodesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(injector, { title: pageTitleList.manageTagsForMultipleNodes } as any);
        this.selectedNodes = data.nodes;
        this.selectedProject = data.project;
        this.operation = data.operation;
        this.selecetdDistributionId = data.distributionId;
        this.getAvailableTags();
        this.topic = { value: topics.Node, subscriptionTopic: topics.Node, eventName: undefined };
        this.getAvailableTags();
    }
    operation: any;
    selectedNodes: TreeNode[];
    selectedProject: any;
    tagGroupType = TagGroupType;
    availableTagGroups: any;
    selecetdDistributionId: string;
    assignedTagGroups = [];
    multipleNodesTaggingOperation = MultipleNodesTaggingOperation;
    searchString: string;

    ngOnInit() {
    }


    getAvailableTags() {
        this.availableTagGroups = this.tagCacheService.getTagGroupsForIds(this.selectedProject.tagGroups);
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

    }

    removeTag(tag: any, tagGroup: any) {
        this.assignedTagGroups = this.removeTagFromTagGroup(tag.tagId, tagGroup.tagGroupId, this.assignedTagGroups);
        this.availableTagGroups = this.assignTagToTagGroup(tag, tagGroup.tagGroupId, this.availableTagGroups);
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

    checkLimitToOne(tagGroup: any) {
        if (!tagGroup.limitToOne) {
            return true;
        }
        const assignedTagGroup = _.find(this.assignedTagGroups, function (aTagGroup) {
            return aTagGroup.tagGroupId === tagGroup.tagGroupId;
        });
        if (assignedTagGroup && assignedTagGroup.tags.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    addOrRemoveTags() {
        let tags = [];
        let nodes = [];
        _.each(this.assignedTagGroups, function (tagGroup) {
            _.each(tagGroup.tags, function (tag) {
                tags.push(tag.tagId);
            });
        });
        _.each(this.selectedNodes, function (node) {
            nodes.push(node.data.documentId);
        });
        if (this.operation === MultipleNodesTaggingOperation.AddTags) {
            this.addTagsToMultipleNodes(tags, nodes);
        } else {
            this.removeTagsFromMultipleNodes(tags, nodes);
        }
        this.dialogRef.close();
    }

    addTagsToMultipleNodes(tags: string[], nodes: string[]) {
        const requestObject = {
            nodes: nodes,
            tags: tags,
            distributionId: this.selecetdDistributionId
        };
        this.treeViewService.addTagsToMultipleNodes(requestObject);
    }

    removeTagsFromMultipleNodes(tags: string[], nodes: string[]) {
        const requestObject = {
            nodes: nodes,
            tags: tags,
            distributionId: this.selecetdDistributionId
        };
        this.treeViewService.removeTagsFromMultipleNodes(requestObject);
    }
}
