import { Component, OnInit, Injector, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseComponent } from '../base.component';
import { pageTitleList } from '../constants';
import { TagCacheService } from '../tags/tag-cache.service';
import { Tag } from '../tags/tag';

@Component({
  selector: 'app-delete-tag-confirmation-dialog',
  templateUrl: './delete-tag-confirmation-dialog.component.html',
})
export class DeleteTagConfirmationDialogComponent extends BaseComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeleteTagConfirmationDialogComponent>, private tagCacheService: TagCacheService,
        @Inject(MAT_DIALOG_DATA) public data: any, public injector: Injector) {
        super(injector, { title: pageTitleList.deleteTag } as any);
        this.tag = data;
    }

    tag: Tag;

    ngOnInit() {
    }

    deleteTag() {
        this.tagCacheService.deleteTag(this.tag);
        this.dialogRef.close();
    }

    cancelDelete() {
        this.dialogRef.close();
    }
}
