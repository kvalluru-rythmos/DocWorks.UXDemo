import { Component, OnInit, Injector, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { utils } from '../common/utils';
import { TreeNode } from 'primeng/components/common/treenode';
import * as _ from 'underscore';
import { MatMenuTrigger } from '@angular/material';
import { AuthoringTabbedViewService } from '../authoring-tabbed-view/authoring-tabbed-view.service';
import { ServiceResponse } from '../common/data-promise-response';
import { applicationConstants } from '../constants';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-comparison-tool-filter-view',
    templateUrl: './comparison-tool-filter-view.component.html'
})
export class ComparisonToolFilterViewComponent extends OperationBaseComponent implements OnInit {

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @Input() isLeft: boolean;
    @Input() isProjectLoading: boolean;
    @Output() onContentLoad = new EventEmitter<any>();

    @Input() projectList = [];
    @Input() distributionList = [];
    @Input() nodeList = [];
    @Input() draftList = [];
    @Input() selectedProjectId: any;
    @Input() selectedDistributionId: any;
    @Input() selectedNodeId: any;
    @Input() selectedDraftId: any;
    @Output() selectDraftIdChange: EventEmitter<any> = new EventEmitter();
    selectedNode: any;
    selectedNodeText: string;
    mdContent = '';
    selectedFiles: any;

    isDistributionLoading: boolean;
    isTreeViewLoading: boolean;
    isDraftLoading: boolean;
    isMdContentLoading: boolean;

    filteredNodes = [];
    comparisonFilterForm: FormGroup;
    project = new FormControl('');
    distribution = new FormControl('');
    draft = new FormControl('');
    searchText = new FormControl('');

    constructor(public injector: Injector, private formBuilder: FormBuilder,
        private tabbedViewService: AuthoringTabbedViewService) {
        super(injector, { title: undefined } as any);
        this.createComparisonForm();
    }


    ngOnInit() {
        this.emitContentLoad();
        this.setFormValues();
    }

    createComparisonForm() {
        this.comparisonFilterForm = this.formBuilder.group({
            project: this.project,
            distribution: this.distribution,
            draft: this.draft,
            searchText: this.searchText
        });
    }

    setFormValues() {
        this.comparisonFilterForm.setValue({
            project: this.selectedProjectId,
            distribution: this.selectedDistributionId,
            draft: this.selectedDraftId,
            searchText: ''
        });
        if (this.draft.value) {
            this.getDraftMDContent();
        }
        if (this.selectedNodeId) {
            this.selectedNodeText = this.treeViewService.getSelectedNode()['shortTitle'];
        }
        if (this.nodeList && this.nodeList.length > 0) {
            this.emitLocalEvent({ eventName: 'refreshNodes', value: { nodeList: this.nodeList, distributionId: this.selectedDistributionId } });
        }
    }

    getDistributions() {
        this.isDistributionLoading = true;
        this.isTreeViewLoading = false;
        this.isDraftLoading = false;
        this.isMdContentLoading = false;
        this.mdContent = '';
        this.draftList = [];
        this.nodeList = [];
        this.distributionList = [];
        this.selectedDistributionId = undefined;
        this.distribution.setValue(undefined);
        this.selectedNodeId = undefined;
        this.selectedNodeText = undefined;
        this.selectedDraftId = undefined;
        this.draft.setValue(undefined);
        this.emitContentLoad();
        this.getDistributionList(this.selectedProjectId);
    }

    refreshDistributions(data: any) {
        if (data.value.projectId === this.selectedProjectId) {
            this.distributionList = (data && data.value.distributions) ? data.value.distributions : [];
            this.isDistributionLoading = false;
        }
    }

    requestTree() {
        this.isTreeViewLoading = true;
        this.isDraftLoading = false;
        this.isMdContentLoading = false;
        this.mdContent = '';
        this.draftList = [];
        this.draft.setValue(undefined);
        this.nodeList = [];
        this.selectedNodeId = undefined;
        this.selectedNodeText = undefined;
        this.selectedDraftId = undefined;
        this.emitContentLoad();
        this.getNodes(this.selectedDistributionId);
    }

    refreshNodes(data: any) {
        if (data.value.distributionId === this.selectedDistributionId) {
            this.isTreeViewLoading = false;
            this.nodeList = data.value.nodeList;
            this.searchTree();
        }
    }

    getDrafts() {
        this.isDraftLoading = true;
        this.isMdContentLoading = false;
        this.mdContent = '';
        this.draftList = [];
        this.selectedDraftId = undefined;
        this.emitContentLoad();
        this.getDraftList(this.selectedNodeId, false);
        this.draft.setValue(undefined);
    }

    refreshDrafts(data) {
        if (data.value.nodeId === this.selectedNodeId) {
            this.isDraftLoading = false;
            this.draftList = data.value.drafts;
        }
    }

    getDraftMDContent() {
        this.mdContent = '';
        this.isMdContentLoading = true;
        this.emitContentLoad();
        this.getDraftContent(this.selectedDraftId);
    }

    getDraftContent(draftId) {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.tabbedViewService.getDraftContent(draftId, 'md') as ServiceResponse;
        serviceResponse.responseObservable.toPromise().then(response => {
            this.subscribeForResponse({ subscriptionTopic: response.json().responseId, operation: applicationConstants.operation['md'] });
        });
    }

    mdEvent(response: any) {
        this.bindMdContent({ content: response.data.content.draftContent, draftId: response.data.content.draftId });
    }

    bindMdContent(value) {
        if (value.draftId === this.selectedDraftId) {
            this.isMdContentLoading = false;
            this.mdContent = value.content;
            this.emitContentLoad();
        }
    }

    emitContentLoad() {
        this.onContentLoad.emit({ content: this.mdContent, isLeft: this.isLeft, selectedDraftId: this.selectedDraftId, selectedNodeId: this.selectedNodeId, nodeDrafts: this.draftList });
    }

    nodeSelect($event) {
        this.selectedNodeId = $event.node.nodeId;
        this.selectedNodeText = $event.node.shortTitle;
        this.trigger.closeMenu();
        this.getDrafts();
    }

    searchTree() {
        let clonedNodes; clonedNodes = <TreeNode[]>JSON.parse(JSON.stringify(this.nodeList));
        _.each(clonedNodes, function (node) {
            node.styleClass = 'visible';
        });
        this.filteredNodes = new utils().convertAndResetPrimeNgTree(new utils().listToTree(clonedNodes), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
        this.filteredNodes = new utils().searchTree(this.filteredNodes, this.searchText.value, true);
    }

    getSelectedNodeName() {
        return this.selectedNodeText ? (this.selectedNodeText.length > 10 ? this.selectedNodeText.substring(0, 10) + '...' : this.selectedNodeText) : 'Select Node';
    }
}
