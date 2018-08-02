import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { applicationConstants } from '../constants';
import { MatDialog } from '@angular/material';
import { ReplaceAssetConfirmationComponent } from '../replace-asset-confirmation/replace-asset-confirmation.component';

@Component({
    selector: 'app-dam-drag-and-drop',
    templateUrl: './dam-drag-and-drop.component.html',
})
export class DamDragAndDropComponent implements OnInit {
    dropUploadAssetClass = '';
    uploadErrorMessage: any;
    maxFileSize = environment.assetMaxFileSize;
    constantAssetType = applicationConstants.assetType;
    dragDropComponentViewType = applicationConstants.dragDropComponentViewType;
    @Input() assetData: any;
    @Input() isDataLoading: any;
    @Output() onFileSelect = new EventEmitter<Object>();
    @Output() getAsset = new EventEmitter<Object>();
    @Input() viewType: number;
    @Input() assetType: any;
    @Input() selectedAssetId: any;
    @Input() isAssetUploading: any;
    @Input() isAssetAdded: boolean;
    @ViewChild('myInput') fileInput: any;
    @Output() onScroll = new EventEmitter<any>();
    dragEnteredElements = [];

    constructor(public dialog: MatDialog, ) {
    }

    ngOnInit() {

    }

    dragEnter(evt) {
        this.dragEnteredElements.push(evt.target);
        this.dropUploadAssetClass = 'dropping';
        evt.preventDefault();
    }

    dragLeave(evt) {
        this.dragEnteredElements = _.without(this.dragEnteredElements, evt.target);
        if (this.dragEnteredElements.length === 0) {
            this.dragEnteredElements = [];
            this.dropUploadAssetClass = '';
        }
        evt.preventDefault();
    }

    dragOver(evt) {
        this.dropUploadAssetClass = 'dropping';
        evt.preventDefault();
    }

    onFileInput(evt) {
        this.dropUploadAssetClass = '';
        const files = evt.currentTarget.files;
        this.showConfirmationDialog(files, this.assetData.assetId);
    }

    showConfirmationDialog(files, assetId) {
        if (assetId) {
            const dialogRef = this.dialog.open(ReplaceAssetConfirmationComponent, {
                width: '400px',
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.checkFileValidation(files);
                }
            });
        } else {
            if (this.viewType === this.dragDropComponentViewType.replaceView && !assetId) {
                this.uploadErrorMessage = 'Please select a asset to replace.';
            } else {
                this.checkFileValidation(files);
            }
        }
    }

    checkFileValidation(files) {
        this.uploadErrorMessage = this.validateFile(files);
        if (!this.uploadErrorMessage) {
            this.ConvertFileToBase64AndUpload(files[0]);
        }
    }

    validateFile(files): string {
        let returnMessage: any;
        if (files && files.length > 0) {
            if (files.length > 1) {
                returnMessage = 'Only 1 file allowed';
            } else {
                const fileName = files[0].name ? files[0].name.toLowerCase() : '';
                if (this.validateFileExtension(fileName)) {
                    returnMessage = this.validateFileExtension(fileName);
                } else if (files[0]['size'] > this.maxFileSize) {
                    returnMessage = 'Max ' + this.maxFileSize / 1024 / 1024 + 'MB size allowed';
                }
            }
        } else {
            returnMessage = 'Select atleast 1 file.';
        }
        return returnMessage;
    }

    validateFileExtension(filename) {
        if (this.assetType === applicationConstants.assetType.image) {
            if (!applicationConstants.allowedImageExtensions.exec(filename)) {
                return 'Only .jpeg/.jpg/.png/.gif format allowed.';
            }
        } else if (this.assetType === applicationConstants.assetType.codeSnippet) {
            if (!applicationConstants.allowedCodeExtensions.exec(filename)) {
                return 'Only .txt/.cs format allowed.';
            }
        }
        return '';
    }

    drop(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.dragEnteredElements = [];
        this.dropUploadAssetClass = '';
        const files = evt.dataTransfer.files;
        this.showConfirmationDialog(files, this.assetData.assetId);
    }

    ConvertFileToBase64AndUpload(asset) {
        const observableFile = Observable.create((observer) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                observer.next(reader.result);
                observer.complete();
            };
            reader.onerror = (err) => {
                observer.error(err);
            };
            reader.onabort = () => {
                observer.error('aborted');
            };
            if (this.assetType === applicationConstants.assetType.image) {
                reader.readAsDataURL(asset);
            } else if (this.assetType === applicationConstants.assetType.codeSnippet) {
                reader.readAsText(asset);
            }
        });

        observableFile.subscribe(data => {
            const value = {
                assetType: this.assetType,
                fileName: asset.name.substring(0, asset.name.lastIndexOf('.')),
                fileSize: asset.size,
                assetContent: data,
                assetId: this.viewType === this.dragDropComponentViewType.replaceView ? this.assetData.assetId : undefined
            };
            this.onFileSelect.emit(value);
        });
    }

    getAssetDetail(asset) {
        this.getAsset.emit(asset);
    }

    scrolldown(value) {
        if (this.viewType === applicationConstants.dragDropComponentViewType.uploadView) {
            this.onScroll.emit(value);
        }
    }

    formatCodeContent(assetContent) {
        return assetContent.split(' ').join('&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
}
