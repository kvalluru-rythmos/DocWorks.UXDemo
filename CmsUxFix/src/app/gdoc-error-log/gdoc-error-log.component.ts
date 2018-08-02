import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-gdoc-error-log',
    templateUrl: './gdoc-error-log.component.html',
})
export class GDocErrorLogComponent {
    failedAssets: any;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.failedAssets = data;
    }
}
