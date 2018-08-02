import { Component, OnInit, Injector, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseComponent } from '../base.component';
import { pageTitleList, cmsOperation, eventStatus } from '../constants';
import { Operation } from '../operation-status/operation';
import { ProjectService } from '../project/project.service';

@Component({
    selector: 'app-delete-project-confirmation-dialog',
    templateUrl: './delete-project-confirmation-dialog.component.html',
})
export class DeleteProjectConfirmationDialogComponent extends BaseComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeleteProjectConfirmationDialogComponent>, private projectService: ProjectService,
        @Inject(MAT_DIALOG_DATA) public data: any, public injector: Injector) {
        super(injector, { title: pageTitleList.deleteProject } as any);
        this.project = data;
    }

    project: any;

    ngOnInit() {
    }

    deleteProject() {
        this.projectService.deleteProject(this.project._id).then(responseId => {
            const operation = new Operation(
                responseId,
                cmsOperation.DeleteProject,
                eventStatus.Wait,
                { distributionName: this.project.projectName }
            );
            this.addOperationEvent(operation);
            this.dialogRef.close();
        });
    }

    cancelDelete() {
        this.dialogRef.close();
    }
}
