import { Injectable, Injector, Optional } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';
import * as _ from 'underscore';
import { TreeNode } from 'primeng/components/common/api';
import { AuthoringCacheService } from '../common/authoring-cache.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';

@Injectable()
export class TreeViewService {

    constructor(private httpService: HttpService, public injector: Injector, private authoringCacheService: AuthoringCacheService, public localEventEmitterService: LocalEventEmitterService) {
    }

    getSelectedNodeId() {
        return this.authoringCacheService.selectedNodeId;
    }

    getSelectedNode() {
        return this.authoringCacheService.getSelectedNode();
    }

    setNodeIdToCache(nodeId) {
        this.authoringCacheService.selectedNodeId = nodeId;
    }

    getNodes(distributionId) {
        return {
            data: this.authoringCacheService.getNodes(distributionId),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Distributions/' + distributionId + '/nodes')
        };
    }

    getNodesFromCache(distributionId) {
        return this.authoringCacheService.getNodes(distributionId);
    }

    setNodesToCache(distributionId, data) {
        this.authoringCacheService.setNodes(distributionId, data);
    }

    convertToPrimeNgTree(tree: any[], expandedIcon: string, collapsedIcon: string, fileIcon: string, @Optional() isExpanded = false, @Optional() expandedNodeIds = []): TreeNode[] {
        _.each(tree, function (node) {
            const isExpand = _.find(expandedNodeIds, function (nodeId) { return nodeId === node['nodeId']; }.bind(this));
            node['label'] = node['shortTitle'];
            node['expanded'] = isExpanded ? isExpanded : (isExpand ? true : false);
            if (node['isFolder']) {
                node['expandedIcon'] = expandedIcon;
                node['collapsedIcon'] = collapsedIcon;
            } else {
                node['icon'] = fileIcon;
            }
            node['data'] = { 'documentId': node.nodeId, 'name': node.label };
            if (node['children'] && node['children'].length > 0) {
                this.convertToPrimeNgTree(node.children, expandedIcon, collapsedIcon, fileIcon, isExpanded);
            }
        }.bind(this));
        return tree;
    }

    expandTree(array: TreeNode[], selectedNode: string, searchText: string): TreeNode[] {
        searchText = searchText ? searchText : '';
        _.each(array, function (node) {
            node.expanded = node.expanded ? true : false;
            if (node.children) {
                node.children = this.expandTree(node.children, selectedNode, searchText);
                if (_.filter(node.children, function (data) { return data.expanded === true; }).length > 0 || node.nodeId === selectedNode || searchText.length > 2) {
                    node.expanded = true;
                }
            } else if (node.nodeId === selectedNode || searchText.length > 2) {
                node.expanded = true;
            }
        }.bind(this));
        return array;
    }

    getNode(nodeId: string): any {
        const treeNodes = this.getTreeNodesFromCache();
        if (treeNodes) {
            const selectedTreeNode = _.find(treeNodes, function (node) {
                return node.nodeId === nodeId;
            }.bind(this));
            return selectedTreeNode;
        } else {
            return undefined;
        }
    }

    getTreeNodesFromCache() {
        const selectedDistributionId = this.authoringCacheService.selectedDistributionId;
        return this.authoringCacheService.getNodes(selectedDistributionId);
    }

    findHierarchy(nodeId: string, hierarchyArray: any[]): any[] {
        const treeNodes = this.getTreeNodesFromCache();
        let array = [];
        if (!treeNodes || treeNodes.length < 1) {
            return;
        } else {
            array = treeNodes;
        }
        hierarchyArray = hierarchyArray ? hierarchyArray : [];
        const currentNode = _.find(array, function (node) {
            if (node.nodeId === nodeId) {
                return node;
            }
        });
        if (currentNode) {
            hierarchyArray.push(currentNode);

            if (currentNode.parentId) {
                this.findHierarchy(currentNode.parentId, hierarchyArray);
            }
        }
        return hierarchyArray;
    }

    changeNodeLocation(requestModel: any): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Nodes/ChangeNodeLocation', requestModel).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    addNode(requestModel: any): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/Nodes', requestModel).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    deleteNode(nodeId: string): Promise<string> {
        return this.httpService.delete(environment.API_BASE_URL + '/api/Nodes/' + nodeId + '/DeleteNode').toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    updateNode(value): Promise<string> {
        return this.httpService.put(environment.API_BASE_URL + '/api/Nodes', value).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    addTagsToMultipleNodes(requestObject) {
        this.httpService.post(environment.API_BASE_URL + '/api/nodes/addTagsToMultipleNodes', requestObject).toPromise().then(response => {
            return response.json().responseId;
        });
    }
    removeTagsFromMultipleNodes(requestObject) {
        this.httpService.post(environment.API_BASE_URL + '/api/nodes/DeleteTagsFromMultipleNodes', requestObject).toPromise().then(response => {
            return response.json().responseId;
        });
    }

}
