import { Component, OnInit, Injector, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseComponent } from '../base.component';
import { pageTitleList, cmsOperation, eventStatus } from '../constants';
import { DistributionService } from '../distribution/distribution.service';
import { Operation } from '../operation-status/operation';

@Component({
  selector: 'app-delete-distribution-confirmation-dialog',
  templateUrl: './delete-distribution-confirmation-dialog.component.html',
})
export class DeleteDistributionConfirmationDialogComponent extends BaseComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeleteDistributionConfirmationDialogComponent>, private distributionService: DistributionService,
        @Inject(MAT_DIALOG_DATA) public data: any, public injector: Injector) {
        super(injector, { title: pageTitleList.deleteDistribution } as any);
        this.distribution = data;
    }

    distribution: any;

    ngOnInit() {
    }

    deleteDistribution() {
        this.distributionService.deleteDistribution(this.distribution.distributionId).then(responseId => {
            const operation = new Operation(
                responseId,
                cmsOperation.DeleteDistribution,
                eventStatus.Wait,
                { distributionName: this.distribution.distributionName}
            );
            this.addOperationEvent(operation);
            this.dialogRef.close();
        });
    }

    cancelDelete() {
        this.dialogRef.close();
    }
}
