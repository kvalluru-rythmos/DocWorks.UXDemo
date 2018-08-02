import {Component, OnInit, Inject, Injector} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import * as _ from 'underscore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DraftService} from './draft.service';
import {
  pageTitleList,
  DraftType,
  DraftCreationType,
  cmsOperation,
  eventStatus,
  applicationConstants
} from '../constants';
import {BaseComponent} from '../base.component';
import {WhiteSpaceValidator} from '../common/whitespace-validator';
import {Operation} from '../operation-status/operation';
import {DistributionService} from '../distribution/distribution.service';
import {ProjectService} from '../project/project.service';
import {TreeViewService} from '../treeview/treeview.service';

@Component({
  selector: 'app-new-draft',
  templateUrl: './new-draft.component.html'
})
export class NewDraftComponent extends BaseComponent implements OnInit {
  draftForm: FormGroup;
  draftName = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
  existingDraft = new FormControl('');
  draftType = new FormControl('');
  draftArray = [];
  nodeId = undefined;
  topic = {value: 'Draft', key: 'Draft', eventName: undefined};
  isValidDraftName = true;
  draftCreationType = DraftCreationType;
  node;

  constructor(private projectService: ProjectService, private distributionService: DistributionService,
              private formBuilder: FormBuilder, public injector: Injector, private treeviewService: TreeViewService,
              private draftService: DraftService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewDraftComponent>) {
    super(injector, {title: pageTitleList.addDraft} as any);
    this.newDraftForm();
    this.draftArray = data.nodeDrafts;
    this.node = data.node;
    this.nodeId = data.nodeId;
    if (this.draftArray.length > 0) {
      this.existingDraft.setValue(this.draftArray[0].draftId, {onlySelf: true});
    }
  }

  ngOnInit() {
    this.draftType.setValue(DraftCreationType.ExistingDraft, {onlySelf: true});
  }

  checkDuplicateName() {
    const draftName = this.draftName.value;
    const foundDraft = _.find(this.draftArray, function (draft) {
      return draft.draftName.toLowerCase() === draftName.toLowerCase();
    }.bind(this));
    this.isValidDraftName = foundDraft ? false : true;
  }

  newDraftForm(): any {
    this.draftForm = this.formBuilder.group({
      draftName: this.draftName,
      draftType: this.draftType,
      existingDraft: this.existingDraft,
    });
  }

  newDraft() {
    const draft = {
      targetNodeId: this.nodeId,
      sourceDraftId: this.draftForm.value.draftType === DraftCreationType.ExistingDraft ? this.draftForm.value.existingDraft : null,
      targetDraftName: this.draftForm.value.draftName,
      targetDraftType: DraftType.WorkInProgress
    };
    this.draftService.newDraft(draft).then(responseId => {
      this.subscribeForResponse({subscriptionTopic: responseId, operation: applicationConstants.operation.createDraft});
      const selectedProjectId = this.projectService.getSelectedProjectId();
      const selectedDistributionId = this.distributionService.getDistributionIdFromCache();
      const selectedNodeId = this.treeviewService.getSelectedNodeId();
      const url = '/project/' + selectedProjectId + '/distribution/' + selectedDistributionId + '/document/' + selectedNodeId + '/draft/{{draftId}}';
      const operation = new Operation(responseId, cmsOperation.CreateDraft, eventStatus.Wait, {
        draftName: draft.targetDraftName,
        nodeName: this.node.shortTitle
      }, url);
      this.addOperationEvent(operation);
      this.dialogRef.close();
    });
  }
}
