import { Component, OnInit, Injector, Inject } from '@angular/core';
import * as _ from 'underscore';
import { BaseComponent } from '../base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImportDistributionService } from './import-distribution.service';
import { cmsOperation, eventStatus, applicationConstants } from '../constants';
import { Operation } from '../operation-status/operation';

@Component({
    selector: 'app-import-distribution',
    templateUrl: './import-distribution.component.html',
    providers: [ImportDistributionService]
})
export class ImportDistributionComponent extends BaseComponent implements OnInit {
    matchedNodes = [];
    manuallyMatchedNodes = [];
    unMatchedNodes = [];
    projectDisplayValues: any;
    isBatchMerge: boolean;
    nodes = [];
    constructor(public injector: Injector, public dialogRef: MatDialogRef<ImportDistributionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private importDistributionService: ImportDistributionService) {
        super(injector, { title: undefined } as any);
        this.isBatchMerge = data.isBatchMerge;
    }

    ngOnInit() {
    }

    submitClick() {
        if (this.isBatchMerge) {
            this.batchMerge();
        } else {
            this.importDistribution();
        }
    }

    importDistribution() {
        const importNodeArray = _.filter(this.nodes, function (value) { return (value.isMatched || value.manuallyMatched); });
        let values = [];
        _.each(importNodeArray, function (importNode) {
            values.push({ sourceNodeId: importNode.sourceNode.nodeId, targetNodeId: importNode.destinationNode.nodeId });
        }.bind(this));
        if ((this.matchedNodes && this.matchedNodes.length > 0) || (this.manuallyMatchedNodes && this.manuallyMatchedNodes.length > 0)) {
            const value = {
                DistributionId: this.projectDisplayValues.sourceDistribution.distributionId,
                MappingNodes: values
            };
            this.importDistributionService.importDistribution(value).then(responseId => {
                this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.importDistribution });
                const operation = new Operation(responseId, cmsOperation.ImportDistribution, eventStatus.Wait, {
                    distributionName: this.projectDisplayValues.sourceDistribution.distributionName
                });
                this.addOperationEvent(operation);
            });
            this.dialogRef.close();
        }
    }

    setMatchedData(matchedData: any) {
        this.projectDisplayValues = matchedData.value.value;
        this.nodes = matchedData.value.matchedNodes;
        this.matchedNodes = _.filter(matchedData.value.matchedNodes, function (value) { return value.isMatched; });
        this.manuallyMatchedNodes = _.filter(matchedData.value.matchedNodes, function (value) { return value.manuallyMatched; });
        this.unMatchedNodes = _.filter(matchedData.value.matchedNodes, function (value) { return value.isMatched === false; });
    }

    batchMerge() {
        const matchedNodes = _.filter(this.nodes, function (node) {
            return node.isMatched || node.manuallyMatched;
        });
        this.dialogRef.close({ matchedNodes: matchedNodes, values: this.projectDisplayValues });
    }
}
