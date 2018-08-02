import { Component, OnInit, Inject, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { pageTitleList, NodeCreationType, DraftType, cmsOperation, eventStatus, applicationConstants } from '../constants';
import { BaseComponent } from '../base.component';
import { TreeViewService } from '../treeview/treeview.service';
import { Operation } from '../operation-status/operation';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { ProjectService } from '../project/project.service';
import { DistributionService } from '../distribution/distribution.service';

@Component({
    selector: 'app-add-node',
    templateUrl: './add-node.component.html',
})
export class AddNodeComponent extends BaseComponent implements OnInit {
    nodeCreationType = NodeCreationType;
    nodeForm: FormGroup;
    title = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    shortTitle = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    existingDraft = new FormControl('');
    draftName = new FormControl('');
    nodeType = new FormControl('');
    parentNodeId = undefined;
    distributionId = undefined;
    isFolder = false;

    constructor(private formBuilder: FormBuilder, private projectService: ProjectService, private distributionService: DistributionService, public injector: Injector, @Inject(MAT_DIALOG_DATA) public data: any,
        public treeViewService: TreeViewService,
        public dialogRef: MatDialogRef<AddNodeComponent>) {
        super(injector, { title: pageTitleList.addNode } as any);
        this.parentNodeId = data.parentNode ? data.parentNode.nodeId : undefined;
        this.distributionId = data.distributionId;
        this.isFolder = data.isFolder;
        this.newNodeForm();
    }

    ngOnInit() {
        if (this.isFolder) {
            this.nodeType.setValue(NodeCreationType.None, { onlySelf: true });
        } else {
            this.nodeType.setValue(NodeCreationType.Blank, { onlySelf: true });
        }
    }

    newNodeForm(): any {
        this.nodeForm = this.formBuilder.group({
            shortTitle: this.shortTitle,
            title: this.title,
            nodeType: this.nodeType,
            draftName: this.draftName,
            existingDraft: this.existingDraft,
        });
    }

    addNode() {
        const node = {
            parentId: this.parentNodeId,
            distributionId: this.distributionId,
            shortTitle: this.shortTitle.value,
            title: this.title.value,
            isFolder: this.isFolder,
            targetDraftName: this.nodeType.value === NodeCreationType.Blank ? this.draftName.value : undefined,
            targetDraftType: this.isFolder ? 0 : (this.nodeType.value === NodeCreationType.Blank ? DraftType.WorkInProgress : undefined),
        };
        this.treeViewService.addNode(node).then(responseId => {
            this.subscribeForResponse({ subscriptionTopic: responseId, operation: applicationConstants.operation.addNode });
            const selectedProjectId = this.projectService.getSelectedProject();
            const selectedDistributionId = this.distributionService.getDistributionIdFromCache();
            const url = '/project/' + selectedProjectId + '/distribution/' + selectedDistributionId + '/document/{{targetNodeId}}';
            const operation = new Operation(responseId, cmsOperation.AddNode, eventStatus.Wait, { nodeName: node.title }, url);
            this.addOperationEvent(operation);
            this.emitLocalEvent({ eventName: 'AddNodeEvent', value: node });
        });
        this.dialogRef.close();
    }
}
