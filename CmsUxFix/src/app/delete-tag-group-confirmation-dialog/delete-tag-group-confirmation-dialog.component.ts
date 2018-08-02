import { Component, OnInit, Injector, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseComponent } from '../base.component';
import { pageTitleList } from '../constants';
import { TagGroup } from '../tags/TagGroup';
import { TagCacheService } from '../tags/tag-cache.service';

@Component({
  selector: 'app-delete-tag-group-confirmation-dialog',
  templateUrl: './delete-tag-group-confirmation-dialog.component.html'
})
export class DeleteTagGroupConfirmationDialogComponent  extends BaseComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeleteTagGroupConfirmationDialogComponent>, private tagCacheService: TagCacheService,
        @Inject(MAT_DIALOG_DATA) public data: any, public injector: Injector) {
        super(injector, { title: pageTitleList.deleteTagGroup } as any);
        this.tagGroup = data;
    }

    tagGroup: TagGroup;

  ngOnInit() {
  }

  deleteTagGroup() {
      this.tagCacheService.deleteTagGroup(this.tagGroup);
      this.dialogRef.close();
  }

  cancelDelete() {
      this.dialogRef.close();
  }
}
