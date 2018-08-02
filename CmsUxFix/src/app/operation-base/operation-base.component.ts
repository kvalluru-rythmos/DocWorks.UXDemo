import { Component, Injector, Optional } from '@angular/core';
import { BaseComponent } from '../base.component';
import { BaseParams } from '../common/base-params';
import { ServiceResponse } from '../common/data-promise-response';
import { ProjectService } from '../project/project.service';
import { applicationConstants } from '../constants';
import { AuthoringCacheService } from '../common/authoring-cache.service';
import { DistributionService } from '../distribution/distribution.service';
import { TreeViewService } from '../treeview/treeview.service';
import { DraftService } from '../new-draft/draft.service';

@Component({
    selector: 'app-operation-base',
    templateUrl: './operation-base.component.html',
})
export class OperationBaseComponent extends BaseComponent {

    constructor(public injector: Injector, @Optional() public parameters: BaseParams) {
        super(injector, { title: parameters ? parameters.title : undefined } as any);
        this.projectService = injector.get(ProjectService);
        this.authoringCacheService = injector.get(AuthoringCacheService);
        this.distributionService = injector.get(DistributionService);
        this.treeViewService = injector.get(TreeViewService);
        this.draftService = injector.get(DraftService);
    }

    projectService: any;
    distributionService: any;
    authoringCacheService: any;
    treeViewService: any;
    draftService: any;

    getProjects(@Optional() isCacheRequired = true) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.projectService.getProjects() as ServiceResponse;
        if (isCacheRequired && serviceResponse.data && serviceResponse.data.length >= 0) {
            this.emitLocalEvent({ eventName: 'refreshProjects', value: serviceResponse.data });
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getProjects });
        });
    }

    getProjectsEvent(response: any) {
        const newValue = response.data.content.projects;
        const oldValue = this.authoringCacheService.getProjects();
        const equals = this.equals(oldValue, newValue);
        if (!equals) {
            this.emitLocalEvent({ eventName: 'refreshProjects', value: newValue });
            this.projectService.setProjects(newValue);
        }
    }

    getDistributionList(projectId, @Optional() isCacheRequired = true) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.distributionService.getDistributions(projectId) as ServiceResponse;
        if (isCacheRequired && serviceResponse.data && serviceResponse.data.length >= 0) {
            const data = { distributions: serviceResponse.data, projectId: projectId };
            this.emitLocalEvent({ eventName: 'refreshDistributions', value: data });
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getDistributionsForProject });
        });
    }

    getDistributionsForProjectEvent(response: any) {
        const newValue = response.data.content.distributionList;
        const projectId = response.data.content.projectId;
        const oldValue = this.distributionService.getDistributionsFromCache(projectId);
        const equals = this.equals(oldValue, newValue);
        if (!equals) {
            this.distributionService.setDistributions(projectId, newValue);
        }
        const data = { distributions: newValue, projectId: projectId };
        this.emitLocalEvent({ eventName: 'refreshDistributions', value: data });
    }

    getNodes(distributionId, @Optional() isCacheRequired = true) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.treeViewService.getNodes(distributionId) as ServiceResponse;
        if (isCacheRequired && serviceResponse.data && serviceResponse.data.length >= 0) {
            const data = { nodeList: serviceResponse.data, distributionId: distributionId };
            this.emitLocalEvent({ eventName: 'refreshNodes', value: data });
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getNodesForDistribution });
        });
    }

    getNodesForDistributionEvent(response: any) {
        const distributionId = response.data.content.distributionId;
        const newValue = response.data.content.nodeList;
        const oldValue = this.treeViewService.getNodesFromCache(distributionId);
        const equals = this.equals(oldValue, newValue);
        if (!equals) {
            const data = { nodeList: newValue, distributionId: distributionId };
            this.treeViewService.setNodesToCache(distributionId, { nodeList: response.data.content.nodeList, orphanNodeList: response.data.content.orphanNodeList });
            this.emitLocalEvent({ eventName: 'refreshNodes', value: data });
        }
    }

    getDraftList(nodeId, @Optional() isCacheRequired = true) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.draftService.getDraftList(nodeId) as ServiceResponse;
        if (isCacheRequired && serviceResponse.data && serviceResponse.data.length >= 0) {
            this.emitLocalEvent({ eventName: 'refreshDrafts', value: { drafts: serviceResponse.data, nodeId: nodeId } });
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.getDraftsForNode });
        });
    }

    getDraftsForNodeEvent(response) {
        const newValue = response.data.content.drafts;
        const nodeId = response.data.content.nodeId;
        const oldValue = this.draftService.getCachedDrafts(nodeId);
        const equals = this.equals(oldValue, newValue);
        if (!equals) {
            this.draftService.setDraftsToCache(nodeId, newValue);
        }
        this.emitLocalEvent({ eventName: 'refreshDrafts', value: { drafts: newValue, nodeId: nodeId } });
    }
}
