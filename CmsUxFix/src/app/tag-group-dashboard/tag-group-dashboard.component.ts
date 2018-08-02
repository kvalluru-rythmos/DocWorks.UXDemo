import { Component, Injector, OnChanges, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateTagGroupComponent } from '../create-tag-group/create-tag-group.component';
import { ManageTagsComponent } from '../manage-tags/manage-tags.component';
import { TagCacheService } from '../tags/tag-cache.service';
import { TagGroup } from '../tags/TagGroup';
import { pageTitleList, TagGroupType } from '../constants';
import { BaseComponent } from '../base.component';
import { DeleteTagGroupConfirmationDialogComponent } from '../delete-tag-group-confirmation-dialog/delete-tag-group-confirmation-dialog.component';

@Component({
    selector: 'app-tag-group-dashboard',
    templateUrl: './tag-group-dashboard.component.html',
})
export class TagGroupDashboardComponent extends BaseComponent implements OnChanges {
    @Input() selectedTabIndex: number;
    tagGroups: TagGroup[];
    searchString = '';
    tagGroupType = TagGroupType;
    constructor(
        private tagCacheService: TagCacheService,
        public injector: Injector,
        public dialog: MatDialog
    ) {
        super(injector, { title: pageTitleList.system } as any);
    }

    ngOnChanges() {
        if (this.selectedTabIndex === 0) {
            this.tagGroups = this.tagCacheService.fetchTagGroups();
        }
    }

    tagGroupsUpdate(data: any) {
        this.tagGroups = this.tagCacheService.getTagGroups();
    }

    addNewTagGroup() {
        this.dialog.open(CreateTagGroupComponent, { width: '50vw' });
    }

    editTagGroup(tagGroup: TagGroup) {
        this.dialog.open(CreateTagGroupComponent, { data: tagGroup, width: '50vw' });
    }

    manageTags(tagGroup: TagGroup) {
        this.dialog.open(ManageTagsComponent, { data: tagGroup, width: '700px' });
    }

    deleteTagGroup(tagGroup: TagGroup) {
        this.dialog.open(DeleteTagGroupConfirmationDialogComponent, { data: tagGroup, width: '700px', height: '300px' });
    }
}
