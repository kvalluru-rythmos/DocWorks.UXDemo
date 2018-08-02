import { Component, OnInit, Injector } from '@angular/core';
import { pageTitleList, nodeStatus, localisation } from '../constants';
import { DistributionService } from '../distribution/distribution.service';
import { DraftService } from '../new-draft/draft.service';
import { TreeViewService } from '../treeview/treeview.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TreeNode } from 'primeng/primeng';
import * as _ from 'underscore';
import { utils } from '../common/utils';
import { TagGroupsComponent } from '../tag-groups/tag-groups.component';
import { MatDialog } from '@angular/material';
import { BaseParams } from '../common/base-params';
import { nodeList } from './staticNodeList';
import { TagCacheService } from '../tags/tag-cache.service';
import { StorageService } from '../common/storage.service';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-developer-dashboard',
    templateUrl: './developer-dashboard.component.html',
    providers: [DistributionService, DraftService, TreeViewService]
})
export class DeveloperDashboardComponent extends OperationBaseComponent implements OnInit {

    constructor(public injector: Injector,
        private formBuilder: FormBuilder,
        private tagCacheService: TagCacheService,
        private storageService: StorageService,
        private dialog: MatDialog) {
        super(injector, { title: pageTitleList.developerDashboard } as BaseParams);
        this.createDashboardForm();
    }

    nodeStatus = nodeStatus;
    localisation = localisation;
    projectList: any;
    distributionList: any;
    nodeList: any;
    isProjectsLoading = false;
    isDistributionsLoading = false;
    isNodesLoading = false;
    filterTree = false;
    developerDashboardForm: FormGroup;
    project = new FormControl('');
    distribution = new FormControl('');
    nodesWithStatus = false;
    localisationStatus = false;
    isExpanded = true;
    selectedNode: any;
    tagGroups: any;
    clonedNodes = undefined;
    viewAsToc = false;
    searchText = '';
    filteredNodes = undefined;
    selectedTags = [];
    selectedTagGroups = [];
    nodesForSelectedTagGroups;

    ngOnInit() {
        this.subscribeForLocalEventEmitter();
        this.isProjectsLoading = true;
        this.getProjects();
    }

    refreshProjects(data) {
        this.isProjectsLoading = false;
        this.projectList = data.value;
    }

    createDashboardForm() {
        this.developerDashboardForm = this.formBuilder.group({
            project: this.project,
            distribution: this.distribution,
        });
    }

    updateDistributionList(value) {
        this.tagGroups = this.tagCacheService.getTagGroupsForIds(this.project.value.tagGroups);
        this.distributionList = [];
        this.nodeList = [];
        this.distribution.setValue(undefined, { onlySelf: true });
        this.selectedNode = undefined;
        this.isDistributionsLoading = true;
        this.getDistributionList(this.project.value._id);
    }

    refreshDistributions(data: any) {
        if (data.value.projectId === this.project.value._id) {
            this.isDistributionsLoading = false;
            this.distributionList = data.value.distributions;
            this.getNodedata();
        }
    }

    refreshNodes(data) {
        this.nodeList = nodeList;
        this.filterNodes();
    }

    getNodedata() {
        if (!this.distribution.value) {
            return;
        }
        this.isNodesLoading = true;
        this.nodeList = undefined;
        this.selectedNode = undefined;
        this.getNodes(this.distribution.value);
    }

    filterNodes() {
        this.clonedNodes = JSON.parse(JSON.stringify(this.nodeList));
        this.nodesForSelectedTagGroups = this.filterNodesBySelectedTagGroups(this.clonedNodes);
        this.nodesForSelectedTagGroups = this.populateSelectedtags(this.nodesForSelectedTagGroups);
        if (this.viewAsToc) {
            this.nodesForSelectedTagGroups = new utils().listToTree(this.nodesForSelectedTagGroups);
        }
        this.nodesForSelectedTagGroups = this.treeViewService.convertToPrimeNgTree(this.nodesForSelectedTagGroups, 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
        this.searchTree();
    }

    searchTree() {
        const Nodes = <TreeNode[]>JSON.parse(JSON.stringify(this.nodesForSelectedTagGroups));
        this.filteredNodes = new utils().searchTree(Nodes, this.searchText, true);
    }

    populateSelectedtags(treeNodes: any): any[] {
        return _.each(treeNodes, function (treeNode) {
            treeNode.tagGroups = _.filter(JSON.parse(JSON.stringify(this.selectedTagGroups)), function (tagGroup) {
                tagGroup.tags = this.getFilteredTags(tagGroup.tags, treeNode.tags);
                return tagGroup;
            }.bind(this));
        }.bind(this));
    }

    filterNodesBySelectedTagGroups(nodes) {
        return _.filter(nodes, function (treeNode) {
            treeNode.styleClass = 'visible';
            _.each(this.selectedTags, function (tagGroup) {
                if (tagGroup.tagIds.length > 0 && _.intersection(tagGroup.tagIds, treeNode.tags).length < 1) {
                    treeNode.styleClass = 'inVisible';
                }
            });
            return treeNode;
        }.bind(this));
    }

    nodeSelect() {
    }


    filterNodesDialog() {
        this.dialog.open(TagGroupsComponent, { data: { tagGroups: this.tagGroups, filteredTags: this.selectedTags, operationType: 'TreeFilter' }, width: '500px' });
    }

    selectTagGroupsDialog() {
        this.dialog.open(TagGroupsComponent, { data: { tagGroups: this.tagGroups, operationType: 'PreferredTagGroups' }, width: '500px' });
    }

    viewAsTocChange() {
        this.filterNodes();
    }

    TreeFilter(data: any) {
        this.selectedTags = data.value.tagGroups;
        this.filterNodes();
    }

    PreferredTagGroups(data: any) {
        this.selectedTagGroups = this.tagCacheService.getTagGroupsForIds(data.value.tagGroupIds);
        this.storageService.write('PreferredTagGroupIds', data.value.tagGroupIds);
        this.filterNodes();
    }

    nodesWithStatusChange() {
    }
}
