import { Component, OnInit, ViewChild, Type, Injector } from '@angular/core';
import { ImageCropperComponent, CropperSettings, CropPosition } from 'ngx-img-cropper';
import { applicationConstants, cmsOperation, eventStatus } from '../constants';
import { UserService } from '../common/user.service';
import { MatDialogRef } from '@angular/material';
import { ProfileService } from './profile.service';
import * as _ from 'underscore';
import { BaseComponent } from '../base.component';
import { Operation } from '../operation-status/operation';

@Component({
  selector: 'app-update-profile-picture',
  templateUrl: './update-profile-picture.component.html',
  providers: [ProfileService]
})
export class UpdateProfilePictureComponent extends BaseComponent implements OnInit {

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  uploadErrorMessage: any;
  dropUploadClass: any;
  userProfile: any;
  data: any;
  cropperSettings: CropperSettings;
  cropPosition: any;
  isUpdateInProgress: any;
  dragEnteredElements = [];

  constructor(public injector: Injector, public userService: UserService, private profileService: ProfileService, public dialogRef: MatDialogRef<UpdateProfilePictureComponent>) {
    super(injector, { title: undefined } as any);
    this.initilizeCropperSettings();
    this.data = {};
    this.cropPosition = new CropPosition(applicationConstants.cropPosition.x, applicationConstants.cropPosition.y, applicationConstants.cropPosition.w, applicationConstants.cropPosition.h);
    this.userProfile = this.userService.getProfile();
  }

  ngOnInit() {
  }

  initilizeCropperSettings() {
    this.cropperSettings = new CropperSettings(applicationConstants.cropperSettings);
  }

  getImage() {
    this.data.image = this.cropper.cropper.getCroppedImage(true).src;
  }

  updateCropPosition() {
    this.cropPosition = new CropPosition(this.cropPosition.x, this.cropPosition.y, this.cropPosition.w, this.cropPosition.h);
  }

  resetCroppers() {
    this.cropper.reset();
  }

  onChange($event: any) {
    const files: File = $event.target.files;
    this.checkFileValidation(files);
  }

  checkFileValidation(files) {
    this.resetCroppers();
    this.uploadErrorMessage = this.validateFile(files);
    if (!this.uploadErrorMessage) {
      this.ConvertFileToBase64AndUpload(files[0]);
    }
  }

  validateFile(files): string {
    let returnMessage: any;
    if (files && files.length > 0) {
      const file = files[0];
      if (files.length > 1) {
        returnMessage = 'Only 1 file allowed';
      } else {
        const fileName = file.name ? file.name.toLowerCase() : '';
        returnMessage = this.validateFileExtension(fileName);
      }
    } else {
      returnMessage = 'Select atleast 1 file.';
    }
    return returnMessage;
  }

  validateFileExtension(filename) {
    if (!applicationConstants.allowedImageExtensions.exec(filename)) {
      return 'Only .jpeg/.jpg/.png format allowed.';
    }
    return '';
  }

  dragEnter(evt) {
    this.dragEnteredElements.push(evt.target);
    this.dropUploadClass = 'dropping';
    evt.preventDefault();
  }

  dragLeave(evt) {
    this.dragEnteredElements = _.without(this.dragEnteredElements, evt.target);
    if (this.dragEnteredElements.length === 0) {
      this.dragEnteredElements = [];
      this.dropUploadClass = '';
    }
    evt.preventDefault();
  }

  dragOver(evt) {
    this.dropUploadClass = 'dropping';
    evt.preventDefault();
  }

  drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.dragEnteredElements = [];
    this.dropUploadClass = '';
    const files = evt.dataTransfer.files;
    this.checkFileValidation(files);
  }

  ConvertFileToBase64AndUpload(value) {
    const reader = new FileReader();
    reader.onloadend = (loadEvent: any) => {
      let image: any = new Image();
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
    };
    reader.onerror = (err) => {
      console.log('error on ConvertFileToBase64AndUpload reader');
    };
    reader.onabort = () => {
      console.log('abort on ConvertFileToBase64AndUpload reader');
    };
    reader.readAsDataURL(value);
  }

  uploadUserProfilePic() {
    this.isUpdateInProgress = true;
    this.profileService.uploadUserProfilePic({ profilePicContent: this.data.image }).then(responseId => {
      this.isUpdateInProgress = false;
      this.dialogRef.close(responseId);
    }, error => {
      this.isUpdateInProgress = false;
      console.log(error);
    });
  }

}
