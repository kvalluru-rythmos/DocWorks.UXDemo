import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-replace-asset-confirmation',
  templateUrl: './replace-asset-confirmation.component.html',
})
export class ReplaceAssetConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<ReplaceAssetConfirmationComponent>) { }

  replaceAsset() {
    this.dialogRef.close(true);
  }

}
