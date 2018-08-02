import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Asset } from '../media/asset';
import { applicationConstants } from '../constants';
import { WhiteSpaceValidator } from '../common/whitespace-validator';

@Component({
  selector: 'app-asset-properties',
  templateUrl: './asset-properties.component.html',
})
export class AssetPropertiesComponent {

  @Input() assetDetail: Asset;
  @Input() isDataLoading: boolean;
  @Input() isEditProperties: boolean;
  @Input() isUpdateInProgress: boolean;
  @Input() isAssetReplaceInProgress: boolean;
  assetPropertyForm: FormGroup;
  unityProjectSource = new FormControl('', [Validators.maxLength(100), WhiteSpaceValidator]);
  instructionsToReCreateImage = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
  depicted = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
  altTitle = new FormControl('', [Validators.maxLength(100), WhiteSpaceValidator]);
  description = new FormControl('', [Validators.maxLength(1000), WhiteSpaceValidator]);
  assetType = applicationConstants.assetType;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.assetPropertyForm = this.formBuilder.group({
      unityProjectSource: this.unityProjectSource,
      instructionsToReCreateImage: this.instructionsToReCreateImage,
      depicted: this.depicted,
      altTitle: this.altTitle,
      description: this.description,
    });
  }
}
