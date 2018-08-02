import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-glossary',
    templateUrl: './add-glossary.component.html'
})
export class AddGlossaryComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AddGlossaryComponent>, private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    termName = new FormControl('', [Validators.required]);
    termType = new FormControl('');
    shortDescription = new FormControl('');
    longDescription = new FormControl('');
    styleGuidance = new FormControl('');
    forbiddenStatus = new FormControl(false);
    localisationStatus = new FormControl(false);
    addGlossaryForm: FormGroup;

    termTypes = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];

    ngOnInit() {
        this.createAddGlossaryForm();
    }

    createAddGlossaryForm() {
        this.addGlossaryForm = this.formBuilder.group({
            termName: this.termName,
            termType: this.termType,
            shortDescription: this.shortDescription,
            longDescription: this.longDescription,
            styleGuidance: this.styleGuidance,
            forbiddenStatus: this.forbiddenStatus,
            localisationStatus: this.localisationStatus
        });
    }
}
