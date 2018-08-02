import { Component, OnInit, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TagCacheService } from '../tags/tag-cache.service';
import { BaseComponent } from '../base.component';
import { pageTitleList, TagGroupType, applicationConstants, cmsOperation, eventStatus } from '../constants';
import { WhiteSpaceValidator } from '../common/whitespace-validator';
import { Operation } from '../operation-status/operation';

@Component({
    selector: 'app-create-tag-group',
    templateUrl: './create-tag-group.component.html',
})

export class CreateTagGroupComponent extends BaseComponent implements OnInit {

    tagGroupForm: FormGroup;
    tagGroupName = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), WhiteSpaceValidator]);
    colour = new FormControl('');
    tagGroupId = new FormControl('');
    limitToOne = new FormControl(false);
    displayGroupName = new FormControl(false);
    publicTag = new FormControl(false);
    publish = new FormControl(false);
    childNodesInherit = new FormControl(false);
    userTagGroup = new FormControl(false);
    selectedTagGroup: any;
    isValidTagGroup = true;
    tagGroupType = TagGroupType;

    constructor(private tagCacheService: TagCacheService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CreateTagGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, public injector: Injector
    ) {
        super(injector, { title: pageTitleList.addTagGroup } as any);
        this.createAddTagGroupForm();
        this.selectedTagGroup = data;
    }

    ngOnInit() {
        if (this.selectedTagGroup) {
            this.setFormGroupValue();
        }
    }

    addTagGroup() {
        let tagGroup = this.tagGroupForm.value;
        tagGroup.colour = tagGroup.colour ? tagGroup.colour : '#ff0000';
        tagGroup.tagGroupType = tagGroup.userTagGroup ? this.tagGroupType.UserTagGroup : this.tagGroupType.OtherTagGroup;
        this.tagCacheService.postTagGroup(tagGroup).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createTagGroup });
            const operation = new Operation(responseId, cmsOperation.CreateTagGroup, eventStatus.Wait, { tagGroupName: tagGroup.tagGroupName });
            this.addOperationEvent(operation);
        });

        this.dialogRef.close();
    }

    createTagGroupEvent() {
        this.emitLocalEvent({ eventName: 'getTagGroupList', value: undefined });
    }

    editTagGroup() {
        const tagGroup = this.tagGroupForm.value;
        tagGroup.tagGroupType = tagGroup.userTagGroup ? this.tagGroupType.UserTagGroup : this.tagGroupType.OtherTagGroup;
        this.tagCacheService.editTagGroup(tagGroup).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.editTagGroup });
            const operation = new Operation(responseId, cmsOperation.EditTagGroup, eventStatus.Wait, { tagGroupName: tagGroup.tagGroupName });
            this.addOperationEvent(operation);
        });
        this.dialogRef.close();
    }

    editTagGroupEvent() {
        this.emitLocalEvent({ eventName: 'getTagGroupList', value: undefined });
    }

    checkValidName() {
        if (this.tagCacheService.tagGroupNameExists(this.tagGroupForm.value)) {
            this.isValidTagGroup = false;
        } else {
            this.isValidTagGroup = true;
        }
    }

    setFormGroupValue() {
        this.tagGroupForm.setValue({
            tagGroupId: this.selectedTagGroup.tagGroupId,
            tagGroupName: this.selectedTagGroup.tagGroupName,
            colour: this.selectedTagGroup.colour,
            limitToOne: this.selectedTagGroup.limitToOne,
            childNodesInherit: this.selectedTagGroup.childNodesInherit,
            displayGroupName: this.selectedTagGroup.displayGroupName,
            publicTag: this.selectedTagGroup.public,
            publish: this.selectedTagGroup.publish,
            userTagGroup: this.selectedTagGroup.tagGroupType === this.tagGroupType.UserTagGroup
        });
    }

    createAddTagGroupForm() {
        this.tagGroupForm = this.formBuilder.group({
            tagGroupId: this.tagGroupId,
            tagGroupName: this.tagGroupName,
            colour: this.colour,
            limitToOne: this.limitToOne,
            childNodesInherit: this.childNodesInherit,
            displayGroupName: this.displayGroupName,
            publicTag: this.publicTag,
            publish: this.publish,
            userTagGroup: this.userTagGroup
        });
    }
}
