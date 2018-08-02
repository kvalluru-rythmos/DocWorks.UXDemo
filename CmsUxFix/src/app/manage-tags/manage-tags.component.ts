import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Tag } from '../tags/tag';
import { TagCacheService } from '../tags/tag-cache.service';
import { pageTitleList, cmsOperation, applicationConstants, eventStatus } from '../constants';
import { BaseComponent } from '../base.component';
import { TagGroup } from '../tags/TagGroup';
import { Operation } from '../operation-status/operation';
import { MatDialog } from '@angular/material';
import { DeleteTagConfirmationDialogComponent } from '../delete-tag-confirmation-dialog/delete-tag-confirmation-dialog.component';

@Component({
    selector: 'app-manage-tags',
    templateUrl: './manage-tags.component.html',
})
export class ManageTagsComponent extends BaseComponent implements OnInit {
    tags: Tag[];
    tagGroup: TagGroup;
    isValidTagName = true;
    createNewTag = false;
    newTagName = '';
    selectedTag = { tagId: '', tagName: '' };
    searchString: string;

    constructor(public injector: Injector,
        private tagCacheService: TagCacheService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super(injector, { title: pageTitleList.manageTags } as any);
        this.tagGroup = data;
        this.getTags();
    }
    ngOnInit() {
        this.refreshSelectedTag();
    }

    getTags() {
        this.tags = this.tagCacheService.getTags(this.tagGroup.tagGroupId);
    }

    addNewTag() {
        this.tagCacheService.postTag(this.tagGroup, { tagName: this.newTagName }).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.createTag });
            const operation = new Operation(responseId, cmsOperation.CreateTag, eventStatus.Wait, { tagName: this.newTagName, tagGroupName: this.tagGroup.tagGroupName });
            this.addOperationEvent(operation);
        });
    }

    tagGroupsUpdate() {
        this.getTags();
    }

    createTagEvent(notification: any) {
        this.emitLocalEvent({ eventName: 'getTagGroupList', value: undefined });
        this.getTags();
    }

    editTag() {
        this.tagCacheService.editTag(this.tagGroup, { tagId: this.selectedTag.tagId, tagName: this.selectedTag.tagName }).then(responseId => {
            this.subscribeForResponse ({ subscriptionTopic: responseId, operation: applicationConstants.operation.editTag });
            const operation = new Operation(responseId, cmsOperation.EditTag, eventStatus.Wait, { tagName: this.selectedTag.tagName, tagGroupName: this.tagGroup.tagGroupName });
            this.addOperationEvent(operation);
        });
        this.refreshSelectedTag();
    }

    editTagEvent() {
        this.emitLocalEvent({ eventName: 'getTagGroupList', value: undefined });
        this.getTags();
    }

    checkValidName(tag: Tag) {
        if (this.tagCacheService.tagNameExists(tag, this.tagGroup.tagGroupId)) {
            this.isValidTagName = false;
        } else {
            this.isValidTagName = true;
        }
    }

    setSelectedTag(tag: any) {
        if (tag.inProgress) { return; }
        this.createNewTag = false;
        this.isValidTagName = true;
        this.selectedTag.tagId = tag.tagId;
        this.selectedTag.tagName = tag.tagName;
    }

    refreshSelectedTag() {
        this.isValidTagName = true;
        this.selectedTag.tagId = '';
        this.selectedTag.tagName = '';
    }

    deleteTag(tag: Tag) {
        this.dialog.open(DeleteTagConfirmationDialogComponent, { data: tag, width: '700px', height: '300px' });
    }
}
