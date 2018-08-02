import { Component, OnInit, Inject, Optional, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DistributionService } from '../distribution/distribution.service';
import { Distribution } from '../distribution/distribution';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, entityStatus, topics, pageTitleList, SourceControlType, applicationConstants } from '../constants';
import { BaseComponent } from '../base.component';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { ServiceResponse } from '../common/data-promise-response';
import { DeleteDistributionConfirmationDialogComponent } from '../delete-distribution-confirmation-dialog/delete-distribution-confirmation-dialog.component';

@Component({
    selector: 'app-create-distribution',
    templateUrl: './create-distribution.component.html',
})
export class CreateDistributionComponent extends BaseComponent implements OnInit {
    project: any;
    distributionForm: FormGroup;
    isBranchDataLoadInProgress: boolean;
    isDistributionDataLoadInProgress: boolean;
    sourceControlType = SourceControlType;
    distributionsArray: Distribution[];
    branchesArray: any[];
    entityStatus = entityStatus;
    distributionId = new FormControl('');
    distributionName = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    branch = new FormControl('');
    mercurialBranch = new FormControl('');
    description = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
    tocPath = new FormControl('', [Validators.maxLength(100), WhiteSpaceValidator]);
    isValidToc = true;
    selectedDistribution: any;

    constructor(private distributionService: DistributionService, private router: Router, private dialog: MatDialog,
        public injector: Injector, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public createDistributionDialogRef: MatDialogRef<CreateDistributionComponent>) {
        super(injector, { title: pageTitleList.createDistribution } as any);
        this.project = data.selectedProject;
        this.distributionsArray = data.distributions;
        this.createDistributionForm();
        this.topic = { value: topics.Distribution, subscriptionTopic: topics.Distribution, eventName: undefined };
    }

    ngOnInit() {
        if (this.project.sourceControlType === this.sourceControlType.GIT) {
            this.getProjectBranches();
            this.isBranchDataLoadInProgress = true;
        }
    }

    getProjectBranches() {
        let serviceResponse: ServiceResponse;
        serviceResponse = this.distributionService.getProjectBranches(this.project._id) as ServiceResponse;
        if (serviceResponse.data && serviceResponse.data.length >= 0) {
            this.setProjectBranchList({ branches: serviceResponse.data, projectId: this.project._id });
        }
        serviceResponse.responseObservable.toPromise().then(response => {
            const responseId = response.json().responseId as string;
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.getBranchList });
        });
    }

    createDistributionForm() {
        this.distributionForm = this.formBuilder.group({
            distributionId: this.distributionId,
            distributionName: this.distributionName,
            branch: this.branch,
            description: this.description,
            tocPath: this.tocPath,
            mercurialBranch: this.mercurialBranch
        });
    }

    getBranchListEvent(notification: any) {
        const branches = notification.data.content ? notification.data.content.branches : [];
        this.setProjectBranchList(branches);
    }

    setProjectBranchList(data) {
        this.isBranchDataLoadInProgress = false;
        this.branchesArray = data;
    }

    resetDistributionForm() {
        this.distributionForm.reset();
    }

    createDistribution() {
        const value = {
            projectId: this.project._id,
            branchName: this.project.sourceControlType === this.sourceControlType.GIT ? this.distributionForm.value.branch : this.distributionForm.value.mercurialBranch,
            distributionName: this.distributionForm.value.distributionName,
            description: this.distributionForm.value.description,
            tocPath: this.distributionForm.value.tocPath
        };

        this.distributionService.createDistribution(value).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createDistribution });
            const url = '/project/' + this.project._id + '/distribution/{{distributionId}}';
            const operation = new Operation(responseId, cmsOperation.CreateDistribution, eventStatus.Wait, { distributionName: value.distributionName, projectName: this.project.projectName }, url);
            this.addOperationEvent(operation);
            this.createDistributionDialogRef.close();
            this.router.navigate(['dashboard']);
        });
    }

    checkValidTocPath(tocPath: string) {
        if (tocPath && tocPath.length > 0) {
            if (tocPath.charAt(0) === '.' || tocPath.charAt(0) === '/' || tocPath.slice(-1) === '/') {
                this.isValidToc = false;
            } else {
                this.isValidToc = true;
            }
        } else {
            this.isValidToc = true;
        }
    }

    deleteDistribution(distribution) {
        this.dialog.open(DeleteDistributionConfirmationDialogComponent, { data: distribution, width: '700px', height: '300px' });
    }

    setSelectedDistribution(distribution) {
        this.selectedDistribution = distribution;
        this.distributionForm.setValue({
            distributionId: distribution.distributionId,
            distributionName: distribution.distributionName,
            branch: distribution.branchName ? distribution.branchName : '',
            description: distribution.description,
            tocPath: distribution.tocPath,
            mercurialBranch: distribution.branchName ? distribution.branchName : ''
        });
    }

    cancelUpdate() {
        this.selectedDistribution = undefined;
    }

    updateDistribution() {
        const value = {
            distributionId: this.distributionForm.value.distributionId,
            branchName: this.project.sourceControlType === this.sourceControlType.GIT ? this.distributionForm.value.branch : this.distributionForm.value.mercurialBranch,
            distributionName: this.distributionForm.value.distributionName,
            description: this.distributionForm.value.description,
            tocPath: this.distributionForm.value.tocPath
        };

        this.distributionService.updateDistribution(value).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.updateDistribution });
            const url = '/project/' + this.project._id + '/distribution/{{distributionId}}';
            const operation = new Operation(responseId, cmsOperation.UpdateDistribution, eventStatus.Wait, { distributionName: value.distributionName, projectName: this.project.projectName }, url);
            this.addOperationEvent(operation);
            this.createDistributionDialogRef.close();
            this.router.navigate(['dashboard']);
        });

    }
}
