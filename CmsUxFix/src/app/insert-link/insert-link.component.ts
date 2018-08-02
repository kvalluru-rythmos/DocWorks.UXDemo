import { Component, OnInit, Injector, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { utils } from '../common/utils';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TreeNode } from 'primeng/primeng';
import { DOCUMENT } from '@angular/platform-browser';
import { assetTags } from '../constants';
import { OperationBaseComponent } from '../operation-base/operation-base.component';

@Component({
    selector: 'app-insert-link',
    templateUrl: './insert-link.component.html'
})
export class InsertLinkComponent extends OperationBaseComponent implements OnInit {
    insertLinkFilterForm: FormGroup;
    project = new FormControl('');
    distribution = new FormControl('');
    searchText = new FormControl('');
    isProjectsLoading: boolean;
    isDistributionsLoading: boolean;
    isTreeViewLoading: boolean;
    projectList = [];
    distributionList = [];
    nodeList = [];
    selectedProjectId: string;
    selectedDistributionId: string;
    selectedNode: any;
    filteredNodes = [];
    copyToClipboardText = '';
    isValueCopied: boolean;
    dom: Document;

    constructor(public injector: Injector, private formBuilder: FormBuilder, @Inject(DOCUMENT) dom: Document,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, { title: undefined } as any);
        this.createInsertLinkForm();
        this.dom = dom;
    }

    ngOnInit() {
        this.isProjectsLoading = true;
        this.getProjects();
    }

    createInsertLinkForm() {
        this.insertLinkFilterForm = this.formBuilder.group({
            project: this.project,
            distribution: this.distribution,
            searchText: this.searchText,
        });
    }

    refreshProjects(data) {
        this.isProjectsLoading = false;
        this.projectList = data.value;
        if (this.data.selectedProjectId) {
            this.project.setValue(this.data.selectedProjectId);
            this.selectedProjectId = this.data.selectedProjectId;
            this.data.selectedProjectId = undefined;
            this.getDistributions();
        }
    }

    getDistributions() {
        this.isDistributionsLoading = true;
        this.distribution.setValue(undefined);
        this.distributionList = [];
        this.nodeList = [];
        this.filteredNodes = [];
        this.selectedNode = undefined;
        this.copyToClipboardText = '';
        this.isValueCopied = false;
        this.getDistributionList(this.selectedProjectId);
    }

    refreshDistributions(data: any) {
        if (data.value.projectId === this.selectedProjectId) {
            this.distributionList = (data && data.value.distributions) ? data.value.distributions : [];
            this.isDistributionsLoading = false;
            if (this.data.selectedDistributionId) {
                this.distribution.setValue(this.data.selectedDistributionId);
                this.selectedDistributionId = this.data.selectedDistributionId;
                this.data.selectedDistributionId = undefined;
                this.requestTree();
            }
        }
    }

    requestTree() {
        this.isTreeViewLoading = true;
        this.nodeList = [];
        this.filteredNodes = [];
        this.selectedNode = undefined;
        this.copyToClipboardText = '';
        this.isValueCopied = false;
        this.getNodes(this.selectedDistributionId);
    }

    refreshNodes(data: any) {
        if (data.value.distributionId === this.selectedDistributionId) {
            this.isTreeViewLoading = false;
            this.nodeList = new utils().convertAndResetPrimeNgTree(new utils().listToTree(data.value.nodeList), 'fa-folder-open', 'fa-folder', 'fa-file-word-o', true);
            this.searchTree();
            if (this.data.selectedNode) {
                this.selectedNode = this.data.selectedNode;
                this.data.selectedNode = undefined;
                const link = assetTags.assetLinkStart + 'Project/' + this.selectedProjectId + '/Distribution/' + this.selectedDistributionId + '/Document/' + this.selectedNode.nodeId + assetTags.assetLinkEnd;
                this.copyToClipboardText = link;
            }
        }
    }

    searchTree() {
        const clonedNodes = <TreeNode[]>JSON.parse(JSON.stringify(this.nodeList));
        this.filteredNodes = new utils().searchTree(clonedNodes, this.searchText.value ? this.searchText.value : '', true);
    }

    onNodeSelect(event) {
        const selectedNodeId = event.node.nodeId;
        const link = assetTags.assetLinkStart + 'Project/' + this.selectedProjectId + '/Distribution/' + this.selectedDistributionId + '/Document/' + selectedNodeId + assetTags.assetLinkEnd;
        this.copyToClipboardText = link;
        this.isValueCopied = false;
    }

    public copyToClipboard(value: string): Promise<any> {
        this.isValueCopied = true;
        const promise = new Promise(
            (resolve, reject): void => {
                let textarea = null;
                try {
                    textarea = this.dom.createElement('textarea');
                    textarea.style.height = '0px';
                    textarea.style.width = '0px';
                    this.dom.body.appendChild(textarea);

                    textarea.value = value;
                    textarea.select();
                    this.dom.execCommand('copy');
                    resolve(value);
                } finally {
                    if (textarea && textarea.parentNode) {
                        textarea.parentNode.removeChild(textarea);
                    }
                }
            }
        );
        return (promise);
    }
}
