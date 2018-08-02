import { Component, OnInit, Inject, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { DraftService } from '../new-draft/draft.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { applicationConstants } from '../constants';

@Component({
  selector: 'app-view-draft',
  templateUrl: './view-draft.component.html'
})
export class ViewDraftComponent extends BaseComponent implements OnInit {
  isDataLoading: boolean;
  snapshotContent: any;
  constructor(public injector: Injector, private draftService: DraftService, @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer) {
    super(injector, {  title: undefined } as any);
  }

  ngOnInit() {
    this.getDraftContent();
  }

  getDraftContent() {
    this.isDataLoading = true;
    this.draftService.getSnapshotContent(this.data.snapshotId).then(responseId => {
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.viewDraftSnapshot });
    }, error => {
      this.isDataLoading = false;
      console.log(error);
    });
  }

  viewDraftSnapshotEvent(notification) {
    this.isDataLoading = false;
    this.snapshotContent = notification.data.content.draftContent;
  }

  formatCodeContent(assetContent) {
    if (assetContent) {
      return assetContent.split(' ').join('&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
    } else {
      return '';
    }
  }
}
