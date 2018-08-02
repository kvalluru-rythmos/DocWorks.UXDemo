import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TreeNode } from 'primeng/components/common/treenode';
import { utils } from '../common/utils';
import { BaseParams } from '../common/base-params';
import { TreeDragDropService } from 'primeng/primeng';
import * as _ from 'underscore';
import { TagGroupsComponent } from '../tag-groups/tag-groups.component';
import { MatDialog } from '@angular/material';
import { TagCacheService } from '../tags/tag-cache.service';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-import-distribution-treeview',
    templateUrl: './import-distribution-treeview.component.html',
    providers: [TreeDragDropService]
})
export class ImportDistributionTreeviewComponent extends OperationBaseComponent implements OnInit {

    sourceTreeViewFilterForm: FormGroup;
    sourceProject = new FormControl('');
    sourceDistribution = new FormControl('');
    sourceSearchText = new FormControl('');
    destinationTreeViewFilterForm: FormGroup;
    destinationProject = new FormControl('');
    destinationDistribution = new FormControl('');
    destinationSearchText = new FormControl('');

    projectList = [];
    isProjectLoading: boolean;

    sourceIsDistributionLoading: boolean;
    sourceIsTreeViewLoading: boolean;
    sourceNodeList = [];
    sourceFlatNodes = [];
    sourceDistributionList = [];
    sourceFilteredNodes = [];

    destinationIsDistributionLoading: boolean;
    destinationIsTreeViewLoading: boolean;
    destinationNodeList = [];
    destinationFlatNodes = [];
    destinationDistributionList = [];
    destinationFilteredNodes = [];

    matchedNodes = [];
    sourceSelectedTags = [];
    destinationSelectedTags = [];
    isAllSelected = false;

    constructor(public injector: Injector, private formBuilder: FormBuilder,
        private tagCacheService: TagCacheService, private dialog: MatDialog) {
        super(injector, { title: undefined } as BaseParams);
        this.createTreeViewFilterForms();
    }

    ngOnInit() {
        this.isProjectLoading = true;
        this.sourceProject.setValue(this.projectService.getSelectedProjectId(), { onlySelf: true });
        this.getProjects();
        this.getDistributions(true);
        this.sourceDistribution.setValue(this.distributionService.getDistributionIdFromCache(), { onlySelf: true });
        this.requestTree(true);
    }

    refreshProjects(data) {
        this.isProjectLoading = false;
        this.projectList = data.value;

    }

    createTreeViewFilterForms() {
        this.sourceTreeViewFilterForm = this.formBuilder.group({
            sourceProject: this.sourceProject,
            sourceDistribution: this.sourceDistribution,
            sourceSearchText: this.sourceSearchText
        });
        this.destinationTreeViewFilterForm = this.formBuilder.group({
            destinationProject: this.destinationProject,
            destinationDistribution: this.destinationDistribution,
            destinationSearchText: this.destinationSearchText
        });
    }

    getDistributions(isSource) {
        this.matchedNodes = [];
        let projectId;
        if (isSource) {
            this.sourceIsDistributionLoading = true;
            this.sourceNodeList = [];
            this.sourceDistributionList = [];
            this.sourceDistribution.setValue('', { onlySelf: true });
            this.sourceFilteredNodes = [];
            projectId = this.sourceProject.value;
        } else {
            this.destinationIsDistributionLoading = true;
            this.destinationNodeList = [];
            this.destinationDistributionList = [];
            this.destinationDistribution.setValue('', { onlySelf: true });
            this.destinationFilteredNodes = [];
            projectId = this.destinationProject.value;
        }
        this.getDistributionList(projectId);
        this.emitMatchedData();
    }

    refreshDistributions(data: any) {
        if (data.value.projectId === this.sourceProject.value) {
            this.sourceDistributionList = (data && data.value.distributions) ? data.value.distributions : [];
            this.sourceIsDistributionLoading = false;
        }
        if (data.value.projectId === this.destinationProject.value) {
            this.destinationDistributionList = (data && data.value.distributions) ? data.value.distributions : [];
            this.destinationIsDistributionLoading = false;
        }
    }

    requestTree(isSource) {
        this.matchedNodes = [];
        let distributionId;
        if (isSource) {
            this.sourceIsTreeViewLoading = true;
            this.sourceNodeList = [];
            this.sourceFilteredNodes = [];
            distributionId = this.sourceDistribution.value;
        } else {
            this.destinationIsTreeViewLoading = true;
            this.destinationNodeList = [];
            this.destinationFilteredNodes = [];
            distributionId = this.destinationDistribution.value;
        }
        this.getNodes(distributionId);
        this.emitMatchedData();
    }

    refreshNodes(data: any) {
        if (data.value.distributionId === this.sourceDistribution.value) {
            this.sourceIsTreeViewLoading = false;
            this.sourceFlatNodes = data.value.nodeList;
        }

        if (data.value.distributionId === this.destinationDistribution.value) {
            this.destinationIsTreeViewLoading = false;
            this.destinationFlatNodes = data.value.nodeList;
        }
        this.matchedNodes = [];
        this.destinationNodeList = new utils().convertAndResetPrimeNgTree(new utils().listToTree(this.destinationFlatNodes), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
        this.sourceNodeList = new utils().convertAndResetPrimeNgTree(new utils().listToTree(this.sourceFlatNodes), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
        this.refreshSourceDestinationTree();
    }


    onDropNode($event) {
        this.matchNodeManually($event.dragNode, $event.dropNode);
    }

    removePreviousMatchedNode(sourceNode) {
        const oldNode = _.find(this.matchedNodes, function (node) {
            return node.sourceNode.nodeId === sourceNode.nodeId;
        });
        if (oldNode) {
            const previousNode = oldNode.destinationNode;
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', previousNode.nodeId, 'manuallyMatched', false);
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', previousNode.nodeId, 'isMatched', false);
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', previousNode.nodeId, 'isChecked', false);
        }
    }

    matchNodeManually(sourceNode, destinationNode) {

        if (!sourceNode.manuallyMatched) {
            this.removePreviousMatchedNode(sourceNode);
            this.matchedNodes = _.filter(this.matchedNodes, function (node) {
                return node.sourceNode.nodeId !== sourceNode.nodeId;
            });
            this.matchedNodes = _.filter(this.matchedNodes, function (node) {
                return (node.destinationNode ? node.destinationNode.nodeId : '') !== destinationNode.nodeId;
            });
        }
        const sourceNodeHierarchyList = new utils().findNodeHierarchy(destinationNode.nodeId, this.sourceFlatNodes);
        const destinationNodeHierarchyList = new utils().findNodeHierarchy(sourceNode.nodeId, this.destinationFlatNodes);
        sourceNode.sourcePathTitle = _.pluck(sourceNodeHierarchyList, 'shortTitle');
        destinationNode.destinationPathTitle = _.pluck(destinationNodeHierarchyList, 'shortTitle');

        this.addRemoveNodeFromTree(sourceNode, destinationNode);
        this.matchedNodes.push({ sourceNode: sourceNode, destinationNode: destinationNode, manuallyMatched: true });
        new utils().setNodeProperties(this.sourceNodeList, 'nodeId', destinationNode.nodeId, 'manuallyMatched', true);
        new utils().setNodeProperties(this.destinationNodeList, 'nodeId', sourceNode.nodeId, 'manuallyMatched', true);
        new utils().setNodeProperties(this.sourceNodeList, 'nodeId', destinationNode.nodeId, 'isMatched', false);
        new utils().setNodeProperties(this.destinationNodeList, 'nodeId', sourceNode.nodeId, 'isMatched', false);
        new utils().setNodeProperties(this.sourceNodeList, 'nodeId', destinationNode.nodeId, 'isChecked', true);
        new utils().setNodeProperties(this.destinationNodeList, 'nodeId', sourceNode.nodeId, 'isChecked', true);
        this.emitMatchedData();
        this.refreshSourceDestinationTree();
    }

    addRemoveNodeFromTree(sourceNode, destinationNode) {
        sourceNode.isDragDropNode = true;
        destinationNode.isDragDropNode = true;
        new utils().addRemoveNodeFromTree(this.sourceNodeList, sourceNode, destinationNode.nodeId, false);
        new utils().addRemoveNodeFromTree(this.destinationNodeList, sourceNode, sourceNode.parentId, true);
    }

    findMatchedNode(node) {
        const sourceNodeHierarchyList = new utils().findNodeHierarchy(node.nodeId, this.sourceFlatNodes);
        node.destinationPathTitle = _.pluck(sourceNodeHierarchyList, 'shortTitle');
        const destinationNode = new utils().returnMatchedNode(node.destinationPathTitle, this.destinationNodeList);
        if (!node.manuallyMatched && node.isChecked) {
            node.isMatched = false;
            if (destinationNode) {
                const destinationNodeHierarchyList = new utils().findNodeHierarchy(destinationNode.nodeId, this.destinationFlatNodes);
                destinationNode.sourcePathTitle = _.pluck(destinationNodeHierarchyList, 'shortTitle');
                node.isMatched = true;
            }
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', node.nodeId, 'isChecked', true);
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', node.nodeId, 'isMatched', node.isMatched);
            new utils().setNodeProperties(this.destinationNodeList, 'nodeId', destinationNode ? destinationNode.nodeId : undefined, 'isMatched', node.isMatched);
            this.matchedNodes.push({ sourceNodeId: node.nodeId, destinationNode: node, sourceNode: destinationNode ? destinationNode : {}, isMatched: node.isMatched });
        } else {
            new utils().setNodeProperties(this.sourceNodeList, 'nodeId', node.nodeId, 'isChecked', false);
            new utils().setNodeProperties(this.destinationNodeList, 'nodeId', destinationNode ? destinationNode.nodeId : undefined, 'isMatched', false);
            this.matchedNodes = _.filter(this.matchedNodes, function (value) { return (value.sourceNodeId !== node.nodeId); });
        }
        this.isAllSelected = this.isAllChecked();
        this.emitMatchedData();
        this.refreshSourceDestinationTree();
    }

    isAllChecked() {
        if (this.sourceFlatNodes.length === this.matchedNodes.length) {
            return true;
        } else {
            return false;
        }
    }

    refreshSourceDestinationTree() {
        this.searchTree(true);
        this.searchTree(false);
    }

    getProjectDistribution() {
        const selectedSourceProject = _.find(this.projectList, function (project) {
            return project._id === this.sourceProject.value;
        }.bind(this));
        const selectedDestinationProject = _.find(this.projectList, function (project) {
            return project._id === this.destinationProject.value;
        }.bind(this));
        const selectedSourceDistribution = _.find(this.sourceDistributionList, function (distribution) {
            return distribution.distributionId === this.sourceDistribution.value;
        }.bind(this));
        const selectedDestinationDistribution = _.find(this.destinationDistributionList, function (distribution) {
            return distribution.distributionId === this.destinationDistribution.value;
        }.bind(this));

        return {
            sourceProject: selectedSourceProject ? selectedSourceProject : {},
            sourceDistribution: selectedSourceDistribution ? selectedSourceDistribution : {},
            destinationProject: selectedDestinationProject ? selectedDestinationProject : {},
            destinationDistribution: selectedDestinationDistribution ? selectedDestinationDistribution : {}
        };
    }

    emitMatchedData() {
        const value = this.getProjectDistribution();
        this.emitLocalEvent({ eventName: 'setMatchedData', value: { value: value, matchedNodes: this.matchedNodes } });
    }

    filterNodesDialog(isSource) {
        const projectId = isSource ? this.sourceProject.value : this.destinationProject.value;
        const selectedTags = isSource ? this.sourceSelectedTags : this.destinationSelectedTags;
        const project = _.find(this.projectList, function (aProject) {
            return aProject._id === projectId;
        });
        const tagGroups = this.tagCacheService.getTagGroupsForIds(project.tagGroups);
        this.dialog.open(TagGroupsComponent, { data: { tagGroups: tagGroups, filteredTags: selectedTags, operationType: 'TreeFilter', isSource: isSource }, width: '500px' });
    }

    TreeFilter(data: any) {
        if (data.value.isSource) {
            this.sourceSelectedTags = data.value.tagGroups;
        }
        if (data.value.isSource === false) {
            this.destinationSelectedTags = data.value.tagGroups;
        }
        this.searchTree(data.value.isSource);
    }

    searchTree(isSource) {
        const clonedNodes = <TreeNode[]>JSON.parse(JSON.stringify(isSource ? this.sourceNodeList : this.destinationNodeList));
        if (isSource) {
            this.sourceFilteredNodes = new utils().implementTagSearch(clonedNodes, this.sourceSelectedTags);
            this.sourceFilteredNodes = new utils().searchTree(this.sourceFilteredNodes, this.sourceSearchText.value ? this.sourceSearchText.value : '', false);
        } else {
            this.destinationFilteredNodes = new utils().implementTagSearch(clonedNodes, this.destinationSelectedTags);
            this.destinationFilteredNodes = new utils().searchTree(this.destinationFilteredNodes, this.destinationSearchText.value ? this.destinationSearchText.value : '', false);
        }
    }

    checkUncheckAllNodes(isAllSelected) {
        this.setNodeProperty(this.sourceNodeList, isAllSelected);
    }

    setNodeProperty(tree: any[], isChecked) {
        _.each(tree, function (node) {
            if (node['children'] && node['children'].length > 0) {
                this.setNodeProperty(node.children, isChecked);
            }
            if (!node.manuallyMatched) {
                node.isChecked = isChecked;
                this.findMatchedNode(node);
            }
        }.bind(this));
        return tree;
    }

}
