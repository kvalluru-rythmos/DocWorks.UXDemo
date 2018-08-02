import { Component, Inject, Injector } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DraftService } from '../new-draft/draft.service';
import { Operation } from '../operation-status/operation';
import { cmsOperation, eventStatus, DraftType, applicationConstants } from '../constants';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import * as _ from 'underscore';

@Component({
  selector: 'app-create-draft-from-snapshot',
  templateUrl: './create-draft-from-snapshot.component.html'
})
export class CreateDraftFromSnapshotComponent extends BaseComponent {

  draftForm: FormGroup;
  draftName = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);

  draftArray = [];
  isValidDraftName = true;
  constructor(public injector: Injector, private formBuilder: FormBuilder, public createDraftFromSnapshotDialogRef: MatDialogRef<CreateDraftFromSnapshotComponent>,
    private draftService: DraftService, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, { title: undefined } as any);
    this.createDraftForm();
    this.draftArray = data.nodeDrafts;
  }

  createDraftForm(): any {
    this.draftForm = this.formBuilder.group({
      draftName: this.draftName,
    });
  }

  createDraftFromSnapshot() {
    const draft = {
      nodeId: this.data.nodeId,
      targetDraftName: this.draftName.value,
      targetDraftType: DraftType.WorkInProgress,
      snapshotId: this.data.snapshotId
    };
    this.draftService.createDraftFromSnapshot(draft).then(responseId => {
      const operation = new Operation(responseId, cmsOperation.CreateDraftWithSnapshot, eventStatus.Wait, { draftName: draft.targetDraftName });
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createDraftWithSnapshot });
      this.addOperationEvent(operation);
      this.createDraftFromSnapshotDialogRef.close(true);
    });
  }

  createDraftUsingMergeContent() {
    const draft = {
      targetNodeId: this.data.nodeId,
      targetDraftName: this.draftName.value,
      targetDraftType: DraftType.WorkInProgress,
      DraftContent: this.data.content
    };
    this.draftService.createDraftUsingMergeContent(draft).then(responseId => {
      const operation = new Operation(responseId, cmsOperation.CreateDraftWithContent, eventStatus.Wait, { draftName: draft.targetDraftName });
      this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createDraftWithContent });
      this.addOperationEvent(operation);
      this.createDraftFromSnapshotDialogRef.close(true);
    });
  }

  checkDuplicateName() {
    const draftName = this.draftName.value;
    const foundDraft = _.find(this.draftArray, function (draft) {
      return draft.draftName.toLowerCase() === draftName.toLowerCase();
    }.bind(this));
    this.isValidDraftName = foundDraft ? false : true;
  }
}
