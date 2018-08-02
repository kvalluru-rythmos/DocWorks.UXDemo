import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddGlossaryComponent } from '../add-glossary/add-glossary.component';
import { glossaryData } from './staticGlossarydata';

@Component({
    selector: 'app-glossary-home',
    templateUrl: './glossary-home.component.html'
})
export class GlossaryHomeComponent implements OnInit {
    constructor(public dialog: MatDialog) { }

    searchString = '';

    addGlossaryDialog() {
        const dialogRef = this.dialog.open(AddGlossaryComponent, {
            width: '40vw'
        });
    }

    glossaryFilters = ['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4', 'Filter 5'];

    glossaryList: any;
    ngOnInit() {
        this.glossaryList = glossaryData;
    }
}
