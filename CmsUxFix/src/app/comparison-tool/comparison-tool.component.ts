import { Component, OnInit, Injector, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateDraftFromSnapshotComponent } from '../create-draft-from-snapshot/create-draft-from-snapshot.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { applicationConstants } from '../constants';
import { MatDialog } from '@angular/material';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-comparison-tool',
    templateUrl: './comparison-tool.component.html'
})
export class ComparisonToolComponent extends OperationBaseComponent implements OnInit, OnDestroy {

    mergelyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(applicationConstants.mergelyUrl);
    isProjectLoading: boolean;
    projectList = [];
    distributionListLeft = [];
    distributionListRight = [];
    nodeListLeft = [];
    nodeListRight = [];
    draftListLeft = [];
    draftListRight = [];
    selectedProjectIdLeft: any;
    selectedProjectIdRight: any;
    selectedDistributionIdLeft: any;
    selectedDistributionIdRight: any;
    selectedNodeIdLeft: any;
    selectedNodeIdRight: any;
    selectedDraftIdLeft: any;
    selectedDraftIdRight: any;
    contentLeft: any;
    contentRight: any;
    mergedContentLeft: any;
    mergedContentRight: any;
    isSwap: boolean;
    listenOnMessage: Function;

    constructor(public injector: Injector, private location: Location,
        private sanitizer: DomSanitizer, private renderer: Renderer2,
       public dialog: MatDialog) {
        super(injector, { title: undefined } as any);

    }

    ngOnInit() {
        this.isProjectLoading = true;
        this.getProjects();
        this.setSelectedValues();
        this.listenMessage();
    }

    refreshProjects(projects) {
        this.isProjectLoading = false;
        this.projectList = projects.value;
    }

    setSelectedValues() {
        this.selectedProjectIdLeft = this.authoringCacheService.selectedProjectId;
        this.selectedProjectIdRight = this.authoringCacheService.selectedProjectId;
        this.selectedDistributionIdLeft = this.authoringCacheService.selectedDistributionId;
        this.selectedDistributionIdRight = this.authoringCacheService.selectedDistributionId;
        this.selectedNodeIdLeft = this.authoringCacheService.selectedNodeId;
        this.selectedNodeIdRight = this.authoringCacheService.selectedNodeId;
        this.selectedDraftIdLeft = this.authoringCacheService.selectedLeftDraftId;
        this.selectedDraftIdRight = this.authoringCacheService.selectedRightDraftId;
        this.projectList = this.authoringCacheService.getProjects();
        this.distributionListLeft = this.authoringCacheService.getDistributions(this.selectedProjectIdLeft);
        this.distributionListRight = this.authoringCacheService.getDistributions(this.selectedProjectIdRight);
        this.nodeListLeft = this.authoringCacheService.getNodes(this.selectedDistributionIdLeft);
        this.nodeListRight = this.authoringCacheService.getNodes(this.selectedDistributionIdRight);
        this.draftListLeft = this.authoringCacheService.getDrafts(this.selectedNodeIdLeft);
        this.draftListRight = this.authoringCacheService.getDrafts(this.selectedNodeIdRight);
    }

    backToAuthoringView() {
        this.postMessage({ isDataCompare: true });
    }

    loadContent(value) {
        if (value.isLeft) {
            this.selectedDraftIdLeft = value.selectedDraftId;
            this.selectedNodeIdLeft = value.selectedNodeId;
            this.contentLeft = value.content;
            this.draftListLeft = value.nodeDrafts;
        } else {
            this.selectedDraftIdRight = value.selectedDraftId;
            this.selectedNodeIdRight = value.selectedNodeId;
            this.draftListRight = value.nodeDrafts;
            this.contentRight = value.content;
        }
        this.postMessage(value);
    }

    postMessage(value) {
        var frame = document.getElementById('mergely-iframe');
        if (frame) {
            let doc = frame['contentWindow'];
            doc.postMessage(value, '*');
        }
    }

    createDraft(value) {
        if (this.isSwap) {
            value.selectedNodeId = value.isLeft ? this.selectedNodeIdRight : this.selectedNodeIdLeft;
            value.nodeDrafts = value.isLeft ? this.draftListRight : this.draftListLeft;
        } else {
            value.selectedNodeId = value.isLeft ? this.selectedNodeIdLeft : this.selectedNodeIdRight;
            value.nodeDrafts = value.isLeft ? this.draftListLeft : this.draftListRight;
        }
        this.openCreateDraftDialog(value);
    }

    openCreateDraftDialog(value) {
        this.dialog.open(CreateDraftFromSnapshotComponent, { data: { nodeId: value.selectedNodeId, content: value.content, isMergedDraft: true, nodeDrafts: value.nodeDrafts }, width: '360px' });
    }

    isContentChanged() {
        let isContentModified = true;
        if (this.mergedContentLeft !== this.contentLeft) {
            isContentModified = false;
        }
        if (this.mergedContentRight !== this.contentRight) {
            isContentModified = false;
        }
        return isContentModified;
    }

    listenMessage() {
        this.listenOnMessage = this.renderer.listen('window', 'message', (event) => {
            this.isSwap = event.data.isSwap ? event.data.isSwap : false;
            if (event.data.isCreateDraft) {
                this.createDraft(event.data);
            }
            if (event.data.isDataCompare) {
                this.mergedContentLeft = event.data.leftContent;
                this.mergedContentRight = event.data.rightContent;
                if (!this.isContentChanged()) {
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        data: { message: 'You have unsaved changes. Do you want to exit?', showButton: true, buttonText: 'Ok' }, width: '400px'
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.location.back();
                        }
                    });
                } else {
                    this.location.back();
                }
            }
        });
    }


    ngOnDestroy() {
        if (this.listenOnMessage) {
            this.listenOnMessage();
        }
    }
}
