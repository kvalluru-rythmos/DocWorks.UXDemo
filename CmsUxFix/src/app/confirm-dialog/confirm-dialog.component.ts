import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {
    message: string;
    showButton: boolean;
    buttonText: string;
    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = data.message;
        this.showButton = data.showButton;
        this.buttonText = data.buttonText ? data.buttonText : '';
    }

    ngOnInit() {
    }

    confirm() {
        this.dialogRef.close(true);
    }
}
