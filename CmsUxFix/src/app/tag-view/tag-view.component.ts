import { Component, OnInit, Input, Injector } from '@angular/core';
import { ManageNodeTagComponent } from '../manage-node-tag/manage-node-tag.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { commonResponseErrorHandler } from '../common/error-handler';
import { TagViewService } from './tag-view.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreeViewService } from '../treeview/treeview.service';
import { BaseComponent } from '../base.component';
import { pageTitleList, topics, cmsOperation, eventStatus, DraftType, applicationConstants, DocumentationType } from '../constants';
import { Operation } from '../operation-status/operation';
import { DraftService } from '../new-draft/draft.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { ProjectService } from '../project/project.service';
import { DistributionService } from '../distribution/distribution.service';

@Component({
    selector: 'app-tag-view',
    templateUrl: './tag-view.component.html',
    providers: [TagViewService]
})
export class TagViewComponent extends BaseComponent implements OnInit {
    selectedNode: any;
    selectedNodeId: string;
    selectedProject: any;
    availableTags: any[] = [];
    assignedTags: any[];
    filteredTags: Observable<any[]>;
    tagCtrl: FormControl;
    @Input() nodeDrafts: any[];
    documentName: string;
    draftType = DraftType;
    selectedDraft = { draftId: '', draftName: '' };
    isValidDraftName = true;
    oldDraftName = '';
    isNodeShortTitleUpdateInProgress: boolean;
    isNodeFileNameUpdateInProgress: boolean;
    documentationType = DocumentationType;
    updateNodeForm: FormGroup;
    shortTitle = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    fileName = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator, Validators.pattern(applicationConstants.inputPattern.fileName)]);

    constructor(private route: ActivatedRoute, private tagViewService: TagViewService, private draftService: DraftService,
        public injector: Injector, private treeViewService: TreeViewService, private projectService: ProjectService, private distributionService: DistributionService,
        public dialog: MatDialog, private formBuilder: FormBuilder) {
        super(injector, { title: pageTitleList.tagManagementNodeLevel } as any);
        this.topic = { value: topics.Node, subscriptionTopic: topics.Node, eventName: undefined };
        this.tagCtrl = new FormControl();
        this.createUpdateNodeForm();
    }

    ngOnInit() {
        this.selectedProject = this.projectService.getSelectedProject();
        this.filteredTags = this.tagCtrl.valueChanges.startWith(null).map(tag => tag ? this.filterTags(tag) : this.availableTags.slice());
        this.subscribeForRouteParams();
    }

    createUpdateNodeForm() {
        this.updateNodeForm = this.formBuilder.group({
            shortTitle: this.shortTitle,
            fileName: this.fileName,
        });
    }

    tagGroupsUpdate(data: any) {
        this.getTags();
    }

    subscribeForRouteParams() {
        this.route.params.subscribe(params => {
            this.selectedNodeId = params.documentId;
            this.selectedNode = this.treeViewService.getNode(this.selectedNodeId);
            this.documentName = this.selectedNode ? this.selectedNode.shortTitle : '';
            this.fileName.setValue(this.selectedNode ? this.selectedNode.fileName : '');
            this.shortTitle.setValue(this.selectedNode ? this.selectedNode.shortTitle : '');
            this.getTags();
        });
    }

    refreshNodesEvent(data) {
        this.selectedNode = _.find(data.value.nodeList, function (node) {
            return node.nodeId === this.selectedNodeId;
        }.bind(this));
        this.getTags();
    }

    getTags() {
        if (!this.selectedProject || !this.selectedNode) { return; }
        const allTags = this.tagViewService.getTagsByTagGroupIds(this.selectedProject.tagGroups);
        this.availableTags = this.tagViewService.getAvailableTags(allTags, this.selectedNode.tags);
        this.assignedTags = this.tagViewService.getAssignedTags(allTags, this.selectedNode.tags);
    }

    filterTags(event: string | any) {
        const availableTags = this.availableTags.filter(tag => {
            if (event.tagName) {
                return tag.tagName.toLowerCase().indexOf(event.tagName.toLowerCase()) === 0;
            } else {
                return tag.tagName.toLowerCase().indexOf(event.toLowerCase()) === 0;
            }
        });
        return availableTags;
    }

    addTag(event) {
        let tag = event.option.value;
        tag.inProgress = true;
        this.availableTags = _.filter(this.availableTags, function (atag) {
            if (atag.tagId !== tag.tagId) {
                return atag;
            }
        });
        this.assignedTags.push(tag);
        this.selectedNode.tags.push(tag.tagId);
        this.getTags();
        this.tagCtrl.setValue('', { onlySelf: true });
        const requestObject = { nodeId: this.selectedNode.nodeId, tags: [tag.tagId] };
        this.tagViewService.addTagsToNode(requestObject).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.addTagsToNode });
            const operation = new Operation(responseId, cmsOperation.AddTagsToNode, eventStatus.Wait, { tagName: tag.tagName, nodeName: this.selectedNode.shortTitle });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    removeTag(tag: any) {
        tag.inProgress = true;
        this.assignedTags = _.filter(this.assignedTags, function (atag) {
            if (atag.tagId !== tag.tagId) {
                return atag;
            }
        });
        this.availableTags.push(tag);
        this.selectedNode.tags = _.without(this.selectedNode.tags, tag.tagId);
        this.getTags();
        const requestObject = { nodeId: this.selectedNode.nodeId, tags: [tag.tagId] };
        this.tagViewService.removeTagsFromNode(requestObject).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteTagsFromNode });
            const operation = new Operation(responseId, cmsOperation.DeleteTagsFromNode, eventStatus.Wait, { tagName: tag.tagName, nodeName: this.selectedNode.shortTitle });
            this.addOperationEvent(operation);
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }

    openDialog() {
        this.dialog.open(ManageNodeTagComponent, {
            data: {
                node: this.selectedNode,
                project: this.selectedProject,
            }, width: '990px', height: '600px'
        });
    }

    deleteDraft(draft: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { message: 'Do you want to delete the Draft: ' + draft.draftName + ' ?', showButton: true, buttonText: applicationConstants.confirmButtonText.Delete }, width: '400px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.draftService.deleteDraft(draft.draftId).then(responseId => {
                    draft.inProgress = true;
                    this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.deleteDraft });
                    const operation = new Operation(responseId, cmsOperation.DeleteDraft, eventStatus.Wait, { draftName: draft.draftName, nodeName: this.selectedNode.shortTitle });
                    this.addOperationEvent(operation);
                }, error => {
                    const errorMessage = commonResponseErrorHandler(error);
                });
            }
        });
    }

    checkValidName(draft) {
        if (this.draftService.draftNameExists(draft, this.nodeDrafts)) {
            this.isValidDraftName = false;
        } else {
            this.isValidDraftName = true;
        }
    }

    setSelectedDraft(draft: any) {
        if (draft.inProgress) { return; }
        this.isValidDraftName = true;
        this.selectedDraft.draftId = draft.draftId;
        this.selectedDraft.draftName = draft.draftName;
        this.oldDraftName = draft.draftName;
    }

    refreshSelectedDraft() {
        this.isValidDraftName = true;
        this.selectedDraft.draftId = '';
        this.selectedDraft.draftName = '';
        this.oldDraftName = '';
    }

    editDraft() {
        this.draftService.renameDraft({ draftId: this.selectedDraft.draftId, draftName: this.selectedDraft.draftName, draftType: DraftType.WorkInProgress }).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.renameDraft });
            const operation = new Operation(responseId, cmsOperation.RenameDraft, eventStatus.Wait, { oldDraftName: this.oldDraftName, newDraftName: this.selectedDraft.draftName });
            this.addOperationEvent(operation);
            this.refreshSelectedDraft();
        }, error => {
            const errorMessage = commonResponseErrorHandler(error);
        });
    }


    doNodeOperation(requestType) {
        switch (requestType) {
            case 'editShortTitle':
                this.shortTitle.setValue(this.selectedNode.shortTitle);
                this.shortTitle.enabled ? this.shortTitle.disable() : this.shortTitle.enable();
                break;
            case 'updateShortTitle':
                this.isNodeShortTitleUpdateInProgress = true;
                this.updateNode({
                    nodeId: this.selectedNode.nodeId, title: this.selectedNode.title,
                    shortTitle: this.shortTitle.value, fileName: this.selectedNode.fileName
                });
                break;
            case 'editFileName':
                this.fileName.enabled ? this.fileName.disable() : this.fileName.enable();
                this.fileName.setValue(this.selectedNode.fileName);
                break;
            case 'updateFileName':
                this.isNodeFileNameUpdateInProgress = true;
                this.updateNode({
                    nodeId: this.selectedNode.nodeId, title: this.selectedNode.title,
                    shortTitle: this.shortTitle.value, fileName: this.fileName.value
                });
                break;
            default: break;
        }
    }

    isScriptRef() {
        if (this.selectedProject['typeOfContent'] === this.documentationType.ScriptRef) {
            return true;
        }
        return false;
    }

    updateNode(node) {
        this.treeViewService.updateNode(node).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.updateNode });
            const operation = new Operation(responseId, cmsOperation.UpdateNode, eventStatus.Wait, { nodeName: node.title });
            this.addOperationEvent(operation);
            this.isNodeFileNameUpdateInProgress = false;
            this.isNodeShortTitleUpdateInProgress = false;
            this.shortTitle.enabled ? this.shortTitle.disable() : this.shortTitle.enable();
            this.fileName.enabled ? this.fileName.disable() : this.fileName.enable();
        });
    }
}
