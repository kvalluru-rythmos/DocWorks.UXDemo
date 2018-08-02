import { Component, OnInit, OnDestroy, Output, EventEmitter, Injector } from '@angular/core';
import { TreeNode } from 'primeng/components/common/api';
import { TreeDragDropService } from 'primeng/primeng';
import * as _ from 'underscore';
import { Router, ActivatedRoute } from '@angular/router';
import { utils } from '../common/utils';
import { MatDialog } from '@angular/material';
import { TagCacheService } from '../tags/tag-cache.service';
import { TagGroupsComponent } from '../tag-groups/tag-groups.component';
import { StorageService } from '../common/storage.service';
import { topics, cmsOperation, eventStatus, applicationConstants, DocumentationType, MultipleNodesTaggingOperation } from '../constants';
import { AddNodeComponent } from '../add-node/add-node.component';
import { Operation } from '../operation-status/operation';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { commonResponseErrorHandler } from '../common/error-handler';
import { ManageTagsToMultipleNodesComponent } from '../manage-tags-to-multiple-nodes/manage-tags-to-multiple-nodes.component';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-treeview',
    templateUrl: './treeview.component.html',
    providers: [TreeDragDropService]
})
export class TreeViewComponent extends OperationBaseComponent implements OnInit, OnDestroy {
    @Output() nodeClick = new EventEmitter<Object>();
    selectedNodes: TreeNode[] = [];
    filteredNodes: TreeNode[];
    searchText = '';
    nodes: TreeNode[];
    selectedNodeId: string;
    selectedTags = [];
    selectedTagGroups = [];
    filterTree = false;
    selectedDistributionId: string;
    selectedProjectId: string;
    selectedProject: any;
    documentationType = DocumentationType;
    treeNodeOperationInProgress = false;
    updatingNodeId = '';
    oldNodeName = '';
    orphanNodes: any;
    isTreeviewLoading = false;
    tagGroups: any;
    expandedNodeIds = [];
    contextMenuForNode = [
        {
            label: 'Delete Node',
            icon: 'mdi mdi-delete',
            command: (event) => this.deleteNode(this.selectedNodes[0])
        },
        {
            label: 'Rename Short Title',
            icon: 'mdi mdi-pencil',
            command: (event) => {
                this.updatingNodeId = this.selectedNodes[0].data.documentId;
                this.oldNodeName = this.selectedNodes[0].label;
                this.selectedNodes[0].data.updateInProgress = true;
            }
        },
        {
            label: 'Add Tags',
            icon: 'mdi mdi-plus',
            command: (event) => this.addTags(this.selectedNodes)
        },
        {
            label: 'Remove Tags',
            icon: 'mdi mdi-delete',
            command: (event) => this.removeTags(this.selectedNodes)
        }
    ];

    contextMenuForFolderNode = [
        {
            label: 'New Node',
            icon: 'mdi mdi-plus',
            command: (event) => this.addNode(this.selectedNodes[0])
        },
        {
            label: 'New Folder Node',
            icon: 'mdi mdi-plus',
            command: (event) => this.addFolder()
        },
        {
            label: 'Delete Node',
            icon: 'mdi mdi-delete',
            command: (event) => this.deleteNode(this.selectedNodes[0])
        },
        {
            label: 'Rename Short Title',
            icon: 'mdi mdi-pencil',
            command: (event) => {
                this.updatingNodeId = this.selectedNodes[0].data.documentId;
                this.oldNodeName = this.selectedNodes[0].label;
                this.selectedNodes[0].data.updateInProgress = true;
            }
        }
    ];

    contextMenuForDiv = [
        {
            label: 'Add Folder Node',
            icon: 'mdi mdi-plus',
            command: (event) => this.addFolder()
        }
    ];

    contextMenuForMultipleNodes = [
        {
            label: 'Add Tags',
            icon: 'mdi mdi-plus',
            command: (event) => this.addTags(this.selectedNodes)
        },
        {
            label: 'Remove Tags',
            icon: 'mdi mdi-delete',
            command: (event) => this.removeTags(this.selectedNodes)
        }
    ];

    constructor(public injector: Injector, private tagCacheService: TagCacheService, private router: Router,
        private storageService: StorageService, private route: ActivatedRoute,
        public dialog: MatDialog) {
        super(injector, { title: undefined } as any);
        this.subscribeToRouteParams();
    }

    ngOnInit() {
        this.getTagGroupsFromLocalStorage();
    }

    getTagGroupsFromLocalStorage() {
        const preferredTagGroupIds = this.storageService.read<string[]>('PreferredTagGroupIds');
        this.selectedTagGroups = this.tagCacheService.getTagGroupsForIds(preferredTagGroupIds);
        this.filterNodes();
    }

    subscribeToRouteParams() {
        this.route.params.subscribe(params => {
            this.filteredNodes = undefined;
            this.selectedProjectId = this.projectService.getSelectedProjectId();
            this.selectedDistributionId = this.distributionService.getDistributionIdFromCache();
            this.selectedProject = this.projectService.getSelectedProject();
            this.tagGroups = this.tagCacheService.getTagGroupsForIds(this.selectedProject.tagGroups);
            this.isTreeviewLoading = true;
            this.getNodes(this.selectedDistributionId);
            this.unsubscribe();
            this.topic = { value: topics.Distribution + '/' + this.selectedDistributionId, subscriptionTopic: topics.Distribution + '/' + this.selectedDistributionId, eventName: 'updateNodeList' };
            this.subscribeTopic();
            this.expandedNodeIds = [];
        });
    }

    refreshNodes(data) {
        if (data.value.distributionId === this.selectedDistributionId) {
            if (data.value.nodeList) {
                this.filterNodes();
                this.treeNodeOperationInProgress = false;
            }
            this.getOrphanNodes(this.selectedDistributionId);
            if (!this.treeViewService.getSelectedNodeId()) {
                this.emitLocalEvent({ eventName: 'nodeSelectedEvent', value: undefined });
            }
            this.isTreeviewLoading = false;
        }
        this.emitLocalEvent({ eventName: 'refreshNodesEvent', value: data.value });
    }

    TreeFilter(data: any) {
        this.selectedTags = data.value.tagGroups;
        if (_.find(this.selectedTags, function (tagGroup) {
            return tagGroup.tagIds.length > 0;
        })) {
            this.filterTree = true;
        }
        this.filterNodes();
    }

    PreferredTagGroups(data: any) {
        this.selectedTagGroups = this.tagCacheService.getTagGroupsForIds(data.value.tagGroupIds);
        this.storageService.write('PreferredTagGroupIds', data.value.tagGroupIds);
        this.filterNodes();
    }

    tagGroupsUpdate(data: any) {
        this.getTagGroupsFromLocalStorage();
        this.filterNodes();
    }


    getOrphanNodes(distributionId) {
        const nodes = this.distributionService.authoringCacheService.getOrphanNodes(distributionId);
        if (nodes) {
            this.orphanNodes = nodes;
            this.formatOrphanNodes();
        }
    }

    onNodeSelect(event) {
        if (event.originalEvent.ctrlKey) {
            if (event.node.isFolder) {
                if (event.node.expanded) {
                    this.selectedNodes = _.filter(this.selectedNodes, function (node) {
                        return node.nodeId !== event.node.nodeId;
                    }.bind(this));
                    return;
                } else {
                    this.setChildrenSelected(event.node);
                    return;
                }
            } else {
                this.setChildrenSelected(event.node);
                return;
            }
        }
        if (event.node.data.updateInProgress) {
            return;
        }
        this.openAuthoringPane();
    }

    openAuthoringPane() {
        if (!this.selectedNodes[0]['isFolder']) {
            this.nodeClick.emit();
            this.selectedNodeId = this.selectedNodes[0].data.documentId;
            this.treeViewService.setNodeIdToCache(this.selectedNodes[0].data.documentId);
            this.emitLocalEvent({ eventName: 'nodeSelectedEvent', value: this.selectedNodes[0].data.documentId });
            this.router.navigate(['./document', this.selectedNodes[0].data.documentId], { relativeTo: this.route });
        } else {
            this.selectedNodes = _.filter(this.selectedNodes, function (node) {
                return node.nodeId !== this.selectedNodes[0].nodeId;
            }.bind(this));
        }
    }

    nodeCollapse(event) {
        this.selectedNodes = _.filter(this.selectedNodes, function (node) {
            return node.nodeId !== event.node.nodeId;
        }.bind(this));
        const isAnyChildSelected = _.find(this.selectedNodes, function (node) {
            return node.parentId === event.node.nodeId;
        }.bind(this));
        if (isAnyChildSelected) {
            this.selectedNodes.push(event.node);
        }

        this.expandedNodeIds = _.filter(this.expandedNodeIds, function (nodeId) {
            return nodeId !== event.node.nodeId;
        }.bind(this));
    }

    nodeExpand(event) {
        this.selectedNodes = _.filter(this.selectedNodes, function (node) {
            return node.nodeId !== event.node.nodeId;
        }.bind(this));

        const value = _.filter(this.expandedNodeIds, function (nodeId) {
            return nodeId === event.node.nodeId;
        }.bind(this));
        if (!value) {
            this.expandedNodeIds.push(event.node.nodeId);
        }
    }

    setChildrenSelected(node) {
        if (node.children) {
            _.each(node.children, function (childNode) {
                if (childNode.children) {
                    this.setChildrenSelected(childNode);
                }
                this.selectedNodes = _.union(this.selectedNodes, [childNode]);
            }.bind(this));
        }
    }

    setParentSelected(node) {
        if (node.parent) {
            const unSelectedChild = _.find(node.parent.children, function (item) {
                return !this.checkNodeSelected(item);
            }.bind(this));
            if (!unSelectedChild) {
                this.selectedNodes = _.union(this.selectedNodes, [node.parent]);
                this.setParentSelected(node.parent);
            }
        }
    }

    checkNodeSelected(item) {
        const selectedNode = _.find(this.selectedNodes, function (node) {
            return node.data.documentId === item.data.documentId;
        });
        return selectedNode ? true : false;
    }

    nodeUnselect(event) {
        if (event.originalEvent.ctrlKey) {
            this.unselectParentNodes(event.node);
            this.unselectChildNodes(event.node);
        }
    }

    unselectParentNodes(node) {
        if (node.parent) {
            this.unselectParentNodes(node.parent);
        }
        this.selectedNodes = _.filter(this.selectedNodes, function (childNode) {
            return childNode.data.documentId !== node.data.documentId;
        });
    }

    unselectChildNodes(node) {
        if (node.children) {
            _.each(node.children, function (childNode) {
                if (childNode.children) {
                    this.unselectChildNodes(childNode);
                }
                this.selectedNodes = _.filter(this.selectedNodes, function (item) {
                    return item.data.documentId !== childNode.data.documentId;
                });
            }.bind(this));
        }
    }

    searchTree() {
        const clonedNodes = <TreeNode[]>JSON.parse(JSON.stringify(this.nodes));
        if (clonedNodes && clonedNodes.length > 0) {
            this.filteredNodes = new utils().searchTree(clonedNodes, this.searchText, this.filterTree);
            this.filteredNodes = this.treeViewService.expandTree(this.filteredNodes, this.selectedNodeId, this.searchText);
        } else {
            this.filteredNodes = [];
        }
    }

    filterNodesDialog() {
        this.dialog.open(TagGroupsComponent, { data: { tagGroups: this.tagGroups, filteredTags: this.selectedTags, operationType: 'TreeFilter' }, width: '500px' });
    }

    filterNodes() {
        let treeNodes = _.filter(this.treeViewService.getNodesFromCache(this.selectedDistributionId), function (treeNode) {
            treeNode.styleClass = 'visible';
            _.each(this.selectedTags, function (tagGroup) {
                if (tagGroup.tagIds.length > 0 && _.intersection(tagGroup.tagIds, treeNode.tags).length < 1) {
                    treeNode.styleClass = 'inVisible';
                }
            });
            return treeNode;
        }.bind(this));
        treeNodes = this.updateTreeNodes(treeNodes);
        this.nodes = this.treeViewService.convertToPrimeNgTree(new utils().listToTree(treeNodes), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', false, this.expandedNodeIds);
        this.nodes = this.treeViewService.expandTree(this.nodes, this.selectedNodeId, this.searchText);
        this.searchTree();
    }

    updateTreeNodes(treeNodes: any): any[] {
        return _.each(treeNodes, function (treeNode) {
            treeNode.tagGroups = _.filter(JSON.parse(JSON.stringify(this.selectedTagGroups)), function (tagGroup) {
                tagGroup.tags = this.getFilteredTags(tagGroup.tags, treeNode.tags);
                return tagGroup;
            }.bind(this));
        }.bind(this));
    }

    getFilteredTags(tags: any[], tagIds: string[]) {
        return _.filter(tags, function (tag) {
            return _.indexOf(tagIds, tag.tagId) > -1;
        });
    }

    selectTagGroupsDialog() {
        this.dialog.open(TagGroupsComponent, { data: { tagGroups: this.tagGroups, operationType: 'PreferredTagGroups' }, width: '500px' });
    }

    nodeDropComplete(event) {
        if (this.isDropCompleteAllowed(event)) {
            const value = this.returnTargetNodeAndIndex(event);
            const request = {
                targetParentNodeId: value.targetParentNode ? value.targetParentNode.nodeId : undefined,
                nodeId: event.dragNode.nodeId,
                updateNodeOrderIndex: value.targetNodeOrderIndex
            };
            this.treeViewService.changeNodeLocation(request).then(responseId => {
                this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.changeNodeLocation });
                const operation = new Operation(responseId, cmsOperation.ChangeNodeLocation, eventStatus.Wait, { nodeName: event.dragNode.shortTitle, parentNodeName: value.targetParentNode ? value.targetParentNode.shortTitle : '' });
                this.addOperationEvent(operation);
                this.treeNodeOperationInProgress = true;
            });
        } else {
            this.filterNodes();
        }
    }

    isDropCompleteAllowed(event) {
        return event.dropNode.isFolder || (!event.dropNode.isFolder && !event.index);
    }

    returnTargetNodeAndIndex(event) {
        let targetNodeOrderIndex = 0;
        let targetParentNode;
        if (event.index >= 0) {
            targetParentNode = event.dropNode ? event.dropNode : undefined;
        } else {
            targetParentNode = event.dropNode.parent ? event.dropNode.parent : undefined;
            targetNodeOrderIndex = event.dropIndex;
        }
        return { targetNodeOrderIndex: targetNodeOrderIndex, targetParentNode: targetParentNode };
    }

    addNode(node: TreeNode) {
        this.dialog.open(AddNodeComponent, { data: { parentNode: node, distributionId: this.selectedDistributionId, isFolder: false }, width: '50vw' });
    }

    addFolder() {
        this.dialog.open(AddNodeComponent, { data: { parentNode: undefined, distributionId: this.selectedDistributionId, isFolder: true }, width: '50vw' });
    }

    AddNodeEvent(data: any) {
        this.treeNodeOperationInProgress = true;
    }

    deleteNode(node: any) {
        const confirmText = 'Do you want to delete the Node: <b>' + node.label + '</b>' + (node.children && node.children.length > 0 ? ' and all the subNodes' : '') + '?';
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { message: confirmText, showButton: true, buttonText: applicationConstants.confirmButtonText.Delete }, width: '400px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.treeViewService.deleteNode(node.nodeId).then(responseId => {
                    this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteNode });
                    const operation = new Operation(responseId, cmsOperation.DeleteNode, eventStatus.Wait, { nodeName: node.shortTitle });
                    this.addOperationEvent(operation);
                    this.treeNodeOperationInProgress = true;
                    if (node.nodeId === this.selectedNodeId) {
                        this.emitLocalEvent({ eventName: 'disableAuthoringViewEvent', value: true });
                    }
                }, error => {
                    const errorMessage = commonResponseErrorHandler(error);
                });
            }
        });
    }

    getContextMenu() {
        if (this.selectedNodes.length > 1) {
            return this.contextMenuForMultipleNodes;
        } else {
            return (this.selectedNodes && this.selectedNodes.length > 0 && !this.selectedNodes[0]['isFolder']) ? this.contextMenuForNode : this.contextMenuForFolderNode;
        }
    }

    addTags(selectedNodes) {
        selectedNodes = _.filter(selectedNodes, function (node) { return !node.isFolder; });
        const selectedProject = this.projectService.getSelectedProject();
        this.dialog.open(ManageTagsToMultipleNodesComponent, {
            data: {
                project: selectedProject,
                nodes: selectedNodes,
                operation: MultipleNodesTaggingOperation.AddTags,
                distributionId: this.selectedDistributionId
            }, width: '990px', height: '600px'
        });
    }

    removeTags(selectedNodes) {
        const selectedProject = this.projectService.getSelectedProject();
        this.dialog.open(ManageTagsToMultipleNodesComponent, {
            data: {
                project: selectedProject,
                nodes: this.selectedNodes,
                operation: MultipleNodesTaggingOperation.RemoveTags,
                distributionId: this.selectedDistributionId
            }, width: '990px', height: '600px'
        });
    }

    showContextMenu() {
        if (this.selectedNodes.length > 1) {
            return this.isOperationAllowed([this.cmsOperations.AddTagsToMultipleNodes, this.cmsOperations.DeleteTagsFromMultipleNodes]);
        } else {
            return this.isOperationAllowed([this.cmsOperations.DeleteNode, this.cmsOperations.AddNode]);
        }
    }

    updateShortTitle() {
        const selectedNode: any = this.selectedNodes[0];
        const requestObject = {
            nodeId: selectedNode.nodeId, title: selectedNode.title,
            shortTitle: selectedNode.label, fileName: selectedNode.fileName
        };
        this.treeViewService.updateNode(requestObject).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.updateNode });
            const operation = new Operation(responseId, cmsOperation.UpdateNode, eventStatus.Wait, { nodeName: selectedNode.title });
            this.addOperationEvent(operation);
            selectedNode.data.updateInProgress = false;
            this.treeNodeOperationInProgress = true;
        });
    }

    updateNodeList() {
        this.isTreeviewLoading = true;
        this.getNodes(this.selectedDistributionId);
    }

    updateNodeEvent(response) {
        this.updateNodeList();
    }

    deleteNodeEvent(response) {
        if (this.selectedNodeId === response.data.content.nodeId) {
            this.treeNodeOperationInProgress = false;
            const link = ['/project', this.selectedProjectId, 'distribution', this.selectedDistributionId];
            this.router.navigate(link);
        } else {
            this.isTreeviewLoading = true;
            this.getNodes(this.selectedDistributionId);
        }
    }

    changeNodeLocationEvent(response) {
        this.updateNodeList();
    }

    formatOrphanNodes() {
        this.orphanNodes = this.treeViewService.convertToPrimeNgTree(this.orphanNodes, 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
    }

}
