import { Component, OnInit, Injector, Renderer2 } from '@angular/core';
import { ImportDistributionService } from '../import-distribution/import-distribution.service';
import { FormControl } from '@angular/forms';
import { applicationConstants } from '../constants';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthoringTabbedViewService } from '../authoring-tabbed-view/authoring-tabbed-view.service';
import { CreateDraftFromSnapshotComponent } from '../create-draft-from-snapshot/create-draft-from-snapshot.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { ServiceResponse } from '../common/data-promise-response';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-batch-merge-tool',
    templateUrl: './batch-merge-tool.component.html'
})
export class BatchMergeToolComponent extends OperationBaseComponent implements OnInit {
    mergelyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(applicationConstants.mergelyUrl + '?displayType=1');
    nodeList: any = [];
    selectedNode: any;
    selectedNodeIndex = 0;
    sourceNodeDraftList = [];
    destinationNodeDraftList = [];
    sourceNodeDraft = new FormControl('');
    destinationNodeDraft = new FormControl('');
    sourceNodeDraftMDContent = '';
    destinationNodeDraftMDContent = '';
    values: any;
    listenOnMessage: Function;
    isSwap = false;
    leftDataLoadInProgress = false;
    rightDataLoadInProgress = false;

    constructor(public injector: Injector, private location: Location,
        private authoringTabbedViewService: AuthoringTabbedViewService,
        private importDistributionService: ImportDistributionService, private renderer: Renderer2,
        private sanitizer: DomSanitizer, public dialog: MatDialog) {
        super(injector, { title: undefined } as any);
    }

    ngOnInit() {
        this.listenMessage();
        this.nodeList = this.importDistributionService.matchedNodes ? this.importDistributionService.matchedNodes : [];
        this.values = this.importDistributionService.values ? this.importDistributionService.values : {};
        this.selectedNode = this.nodeList[this.selectedNodeIndex];
        this.getDrafts();
    }

    setSelectedNode(index) {
        this.selectedNodeIndex = index;
        this.selectedNode = this.nodeList[this.selectedNodeIndex];
        this.getDrafts();
    }

    getDrafts() {
        this.leftDataLoadInProgress = true;
        this.rightDataLoadInProgress = true;
        this.postEmptyMessage(true);
        this.postEmptyMessage(false);
        this.getDraftList(this.selectedNode.sourceNode.nodeId, false);
        this.getDraftList(this.selectedNode.destinationNode.nodeId, false);
    }

    prevClick() {
        this.selectedNodeIndex = this.selectedNodeIndex - 1;
        this.selectedNode = this.nodeList[this.selectedNodeIndex];
        this.getDrafts();
    }

    nextClick() {
        this.selectedNodeIndex = this.selectedNodeIndex + 1;
        this.selectedNode = this.nodeList[this.selectedNodeIndex];
        this.getDrafts();
    }

    refreshDrafts(data) {
        if (data.value.nodeId === this.selectedNode.sourceNode.nodeId) {
            this.leftDataLoadInProgress = false;
            this.sourceNodeDraftList = data.value.drafts;
            if (this.sourceNodeDraftList && this.sourceNodeDraftList.length > 0) {
                this.sourceNodeDraft.setValue(this.sourceNodeDraftList[0], { onlySelf: true });
                this.leftDataLoadInProgress = true;
                this.getDraftMDContent(this.sourceNodeDraft.value.draftId);
            }

        }
        if (data.value.nodeId === this.selectedNode.destinationNode.nodeId) {
            this.rightDataLoadInProgress = false;
            this.destinationNodeDraftList = data.value.drafts;
            if (this.destinationNodeDraftList && this.destinationNodeDraftList.length > 0) {
                this.destinationNodeDraft.setValue(this.destinationNodeDraftList[0], { onlySelf: true });
                this.rightDataLoadInProgress = true;
                this.getDraftMDContent(this.destinationNodeDraft.value.draftId);
            }
        }
    }

    onSourceNodeDraftChange() {
        this.postEmptyMessage(true);
        this.leftDataLoadInProgress = true;
        this.getDraftMDContent(this.sourceNodeDraft.value.draftId);
    }

    onDestinationNodeDraftChange() {
        this.postEmptyMessage(false);
        this.rightDataLoadInProgress = true;
        this.getDraftMDContent(this.destinationNodeDraft.value.draftId);
    }

    getDraftMDContent(draftId) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.authoringTabbedViewService.getDraftContent(draftId, 'md') as ServiceResponse;
        serviceResponse.responseObservable.toPromise().then(response => {
            this.subscribeForResponse({ subscriptionTopic: response.json().responseId, operation: applicationConstants.operation['md'] });
        });
    }

    mdEvent(response: any) {
        this.bindMdContent({ content: response.data.content.draftContent, draftId: response.data.content.draftId });
    }

    bindMdContent(data) {
        if (data.draftId === this.sourceNodeDraft.value.draftId) {
            this.leftDataLoadInProgress = false;
            this.sourceNodeDraftMDContent = data.content;
            const value = {
                content: this.sourceNodeDraftMDContent,
                isLeft: true,
                selectedDraftId: this.sourceNodeDraft.value.draftId,
                selectedNodeId: this.selectedNode.sourceNode.nodeId,
                nodeDrafts: this.sourceNodeDraftList,
                disableLeft: true,
                disableRight: false
            };
            this.postMessage(value);
        }
        if (data.draftId === this.destinationNodeDraft.value.draftId) {
            this.rightDataLoadInProgress = false;
            this.destinationNodeDraftMDContent = data.content;
            const value = {
                content: this.destinationNodeDraftMDContent,
                isLeft: false,
                selectedDraftId: this.destinationNodeDraft.value.draftId,
                selectedNodeId: this.selectedNode.destinationNode.nodeId,
                nodeDrafts: this.destinationNodeDraftList,
                disableLeft: true,
                disableRight: false
            };
            this.postMessage(value);
        }
    }

    postEmptyMessage(isLeft) {
        this.postMessage({
            content: '',
            isLeft: isLeft,
            selectedDraftId: '',
            selectedNodeId: '',
            nodeDrafts: [],
            disableLeft: true,
            disableRight: false
        });
    }

    postMessage(value) {
        var frame = document.getElementById('mergely-iframe');
        if (frame) {
            let doc = frame['contentWindow'];
            doc.postMessage(value, '*');
        }
    }

    listenMessage() {
        this.listenOnMessage = this.renderer.listen('window', 'message', (event) => {
            this.isSwap = event.data.isSwap ? event.data.isSwap : false;
            if (event.data.isCreateDraft) {
                this.createDraft(event.data);
            }
        });
    }

    createDraft(value) {
        value.selectedNodeId = this.destinationNodeDraft.value.draftId;
        value.nodeDrafts = this.destinationNodeDraftList;
        this.openCreateDraftDialog(value);
    }

    openCreateDraftDialog(value) {
        this.dialog.open(CreateDraftFromSnapshotComponent, { data: { nodeId: value.selectedNodeId, content: value.content, isMergedDraft: true, nodeDrafts: value.nodeDrafts }, width: '360px' });
    }

    skipFile() {
        this.nodeList.splice(this.selectedNodeIndex, 1);
        if (this.selectedNodeIndex === this.nodeList.length) {
            this.selectedNodeIndex = this.selectedNodeIndex - 1;
        }
        this.setSelectedNode(this.selectedNodeIndex);
    }

    finish() {
        this.location.back();
    }

}
