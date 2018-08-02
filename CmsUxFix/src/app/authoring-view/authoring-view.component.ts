import { Component, OnInit, Inject, OnDestroy, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material';
import { AuthoringViewService } from './authoring-view.service';
import { NewDraftComponent } from '../new-draft/new-draft.component';
import { InsertAssetComponent } from '../insert-asset/insert-asset.component';
import { DOCUMENT } from '@angular/platform-browser';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, topics, DraftType } from '../constants';
import { applicationConstants, DocumentationType } from '../constants';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TabService } from './tab.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { InsertLinkComponent } from '../insert-link/insert-link.component';
import { ProjectContent } from '../project/project';
import { MatSidenav } from '@angular/material';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-project-view',
    templateUrl: './authoring-view.component.html',
    providers: [TabService, AuthoringViewService]
})
export class AuthoringViewComponent extends OperationBaseComponent implements OnInit, OnDestroy {
    toggle = false;
    tabs: any[];
    selectedTabIndex = 0;
    selectedNodeId: string;
    selectedNode: any;
    isLeftDivVisible = true;
    isRightDivVisible = true;
    nodeDrafts: any[] = [];
    hierarchy: any[];
    selectedProject: ProjectContent = new ProjectContent();
    selectedDistribution: any;
    selectedNodeDrafts;
    differentDrafts = false;
    selectedDrafts = [];
    assetType = applicationConstants.assetType;
    private dom: Document;
    draftType = DraftType;
    documentationType = DocumentationType;
    draftsFetched = false;
    disableAuthoringView = false;
    isEditNodeTitleInProgress: boolean;
    updateNodeTitleForm: FormGroup;
    sideNavPosition: boolean;
    nodeTitle = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    editorsExpanded;
    @ViewChild('documentHistorySidenav') public documentHistorySidenav: MatSidenav;
    @ViewChild('sidenav') public sidenav: MatSidenav;

    constructor(private route: ActivatedRoute, private tabService: TabService, public injector: Injector,
        private authoringViewService: AuthoringViewService, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog,
        @Inject(DOCUMENT) dom: Document) {
        super(injector, { title: undefined } as any); this.dom = dom;
        this.updateNodeTitleForm = this.formBuilder.group({ nodeTitle: this.nodeTitle, });
    }

    ngOnInit() {
        this.subscribeForParentParams();
        this.subscribeForRouteParams();
    }

    subscribeForRouteParams() {
        this.route.params.subscribe(params => {
            this.selectedNodeId = params.documentId;
            this.treeViewService.setNodeIdToCache(params.documentId);
            this.nodeDrafts = [];
            this.selectedNodeDrafts = undefined;
            this.selectedNode = this.treeViewService.getNode(this.selectedNodeId);
            this.nodeTitle.setValue(this.selectedNode ? (this.selectedNode.title ? this.selectedNode.title : '') : '');
            this.emitLocalEvent({ eventName: 'nodeSelectedEvent', value: this.selectedNodeId });
            this.createBreadCrumb();
            this.draftsFetched = false;
            this.disableAuthoringView = false;
            this.getDraftList(this.selectedNodeId, false);
            this.saveMetaDataToLocalStorage();
            this.unsubscribe();
            this.topic = { value: topics.Node + '/' + this.selectedNodeId, subscriptionTopic: topics.Node + '/' + this.selectedNodeId, eventName: 'updateDraftList' };
            this.subscribeTopic();
        });
    }

    updateDraftList() {
        this.getDraftList(this.selectedNodeId);
    }

    refreshDrafts(data) {
        if (data.value.nodeId !== this.selectedNodeId) { return; }
        this.draftsFetched = true;
        const nodeDrafts = data.value.drafts;
        if (nodeDrafts && nodeDrafts.length > 0) {
            this.nodeDrafts = this.sortDrafts(nodeDrafts, [this.draftType.CoderDraft, this.draftType.LiveDraft, this.draftType.WorkInProgress]);
        } else {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { message: 'No drafts available.Do you want to create one?', showButton: true, buttonText: applicationConstants.confirmButtonText.Create }, width: '400px'
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.openNewDraftDialog();
                }
            });
        }
    }

    refreshNodes(data: any) {
        if (data.value.distributionId === this.distributionService.getDistributionIdFromCache()) {
            this.selectedNode = this.treeViewService.getNode(this.selectedNodeId);
            this.nodeTitle.setValue(this.selectedNode ? (this.selectedNode.title ? this.selectedNode.title : '') : '');
            this.createBreadCrumb();
        }
    }

    subscribeForParentParams() {
        this.route.parent.params.subscribe(params => {
            this.selectedProject = this.projectService.getSelectedProject();
            this.getTabs();
            this.selectedDistribution = this.distributionService.getSelectedDistributionFromCache();
        });
    }

    disableAuthoringViewEvent(data: any) {
        this.disableAuthoringView = data;
    }

    navigate(selectdNode: any) {
        this.router.navigate(['../../document', selectdNode.nodeId], { relativeTo: this.route });
    }

    getTabs() {
        this.tabs = undefined;
        if (this.selectedProject['typeOfContent'] === this.documentationType.ScriptRef) {
            this.tabs = this.tabService.getScriptRefTabs();
        } else {
            this.tabs = this.tabService.getDefaultTabs();
        }
    }

    createBreadCrumb() {
        const nodes = this.treeViewService.getTreeNodesFromCache();
        if (nodes && nodes.length > 0) {
            this.hierarchy = this.treeViewService.findHierarchy(this.selectedNodeId, undefined);
            this.hierarchy.reverse();
        }
    }


    draftChange(draft: any, key: string) {
        if (!draft || !draft.draftId) {
            return;
        }
        if (!this.selectedNodeDrafts) {
            this.selectedNodeDrafts = {};
        }
        this.selectedNodeDrafts[key] = draft;
        const leftDraftId = this.selectedNodeDrafts['LEFT'] ? this.selectedNodeDrafts['LEFT'].draftId : '';
        const rightDraftId = this.selectedNodeDrafts['RIGHT'] ? this.selectedNodeDrafts['RIGHT'].draftId : '';
        this.draftService.setDraftIdToCache(leftDraftId, true);
        this.draftService.setDraftIdToCache(rightDraftId, false);
        this.differentDrafts = leftDraftId === rightDraftId ? true : false;
        this.selectedDrafts = _.values(this.selectedNodeDrafts);
    }

    pushDraftToLive(draft: any) {
        if (!draft) {
            draft = this.selectedNodeDrafts['LEFT'];
        }
        this.authoringViewService.pushDraftToLive(draft.draftId).
            then(responseId => {
                this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.acceptDraftToLive });
                const operation = new Operation(
                    responseId,
                    cmsOperation.AcceptDraftToLive,
                    eventStatus.Wait,
                    { draftName: draft.draftName }
                );
                this.addOperationEvent(operation);
            });
    }

    saveMetaDataToLocalStorage() {
        const value = {
            date: new Date(),
            url: this.route['_routerState'].snapshot.url,
            projectName: this.selectedProject['projectName'],
            projectId: this.selectedProject['_id'],
            distributionName: this.selectedDistribution['distributionName'],
            title: this.nodeTitle.value
        };
        this.authoringViewService.addRecentlyViewedDocuments(value);
    }

    openNewDraftDialog() {
        this.dialog.open(NewDraftComponent, { data: { nodeDrafts: this.nodeDrafts, nodeId: this.selectedNodeId, node: this.selectedNode }, width: '560px' });
    }

    ngOnDestroy() {
        this.emitLocalEvent({ eventName: 'nodeSelectedEvent', value: undefined });
        this.cleanUp();
    }

    insertAssetDialog(assetTypeValue) {
        if (assetTypeValue === applicationConstants.assetType.image || assetTypeValue === applicationConstants.assetType.codeSnippet) {
            this.dialog.open(InsertAssetComponent, {
                width: '1090px',
                height: '600px',
                data: { assetType: assetTypeValue }
            });
        } else {
            this.dialog.open(InsertLinkComponent, {
                width: '700px',
                data: {
                    assetType: assetTypeValue,
                    selectedProjectId: this.selectedProject['_id'],
                    selectedDistributionId: this.selectedDistribution ? this.selectedDistribution.distributionId : undefined,
                    selectedNodeId: this.selectedNodeId,
                    selectedNode: this.selectedNode
                }
            });
        }
    }

    sortDrafts(draftList: any[], sortOrder: DraftType[]) {
        let sortedCollection = [];
        _.each(sortOrder, function (draftType) {
            let drafts = _.filter(draftList, function (draft) {
                return draft.draftType === draftType;
            });
            if (draftType === this.draftType.WorkInProgress) {
                drafts = _.sortBy(drafts, function (draft) { return draft.draftName.toLowerCase(); });
            }
            sortedCollection = sortedCollection.concat(drafts);
        }.bind(this));

        return sortedCollection;
    }

    openDocumentHistorySidenav() {
        this.documentHistorySidenav.toggle();
        this.sidenav.close();
    }

    toggleDocumentHistorySideNav(value) {
        this.documentHistorySidenav.toggle();
    }

    openComparisionTool() {
        this.router.navigate(['/comparison-tool']);
    }

    doNodeOperation(requestType) {
        switch (requestType) {
            case 'updateTitle':
                this.updateNode();
                break;
            default:
                this.nodeTitle.setValue(this.selectedNode.title);
                this.nodeTitle.enabled ? this.nodeTitle.disable() : this.nodeTitle.enable();
                break;
        }
    }

    isScriptRef() {
        if (this.selectedProject['typeOfContent'] === this.documentationType.ScriptRef) {
            return true;
        }
        return false;
    }

    updateNode() {
        this.isEditNodeTitleInProgress = true;
        const node = {
            nodeId: this.selectedNode.nodeId,
            title: this.nodeTitle.value,
            shortTitle: this.selectedNode.shortTitle,
            fileName: this.selectedNode.fileName
        };
        this.treeViewService.updateNode(node).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.updateNode });
            const operation = new Operation(responseId, cmsOperation.UpdateNode, eventStatus.Wait, { nodeName: node.title });
            this.addOperationEvent(operation);
            this.isEditNodeTitleInProgress = false;
            this.nodeTitle.enabled ? this.nodeTitle.disable() : this.nodeTitle.enable();
        });
    }
}
