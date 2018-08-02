import { Component, OnInit, Inject, OnDestroy, Injector } from '@angular/core';
import { TagCacheService } from '../tags/tag-cache.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StorageService } from '../common/storage.service';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';
import { BaseComponent } from '../base.component';
import { ProjectService } from '../project/project.service';
export const operationType = {
    TreeFilter: 'TreeFilter',
    PreferredTagGroups: 'PreferredTagGroups'
};
@Component({
    selector: 'app-tag-groups',
    templateUrl: './tag-groups.component.html',
})
export class TagGroupsComponent extends BaseComponent implements OnInit, OnDestroy {


    operationType: string;
    tagGroups: any[];
    selectedProject: any;
    subscription: any;
    selectedTagGroups: any;
    constructor(public injector: Injector, private route: ActivatedRoute,
        public localEventEmitterService: LocalEventEmitterService,
        private storageService: StorageService, private projectService: ProjectService,
        public dialogRef: MatDialogRef<TagGroupsComponent>,
        private tagCacheService: TagCacheService, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, { title: undefined } as any);
        this.operationType = data.operationType;
        this.tagGroups = data.tagGroups;
        this.selectedTagGroups = data.filteredTags;
    }


    ngOnInit() {
        this.selectedProject = this.projectService.getSelectedProject();
        this.getTagGroups();
    }

    tagGroupsUpdate(data: any) {
        this.getTagGroups();
    }

    getTagGroups() {
        if (this.operationType === operationType.PreferredTagGroups) {
            this.updatePreferredTagGroups();
        } else {
            this.updateFilteredTagGroups();
        }
    }

    updatePreferredTagGroups() {
        const preferredTagGroupIds = this.storageService.read<string[]>('PreferredTagGroupIds');
        _.each(this.tagGroups, function (tagGroup) {
            tagGroup.selected = false;
            if (_.indexOf(preferredTagGroupIds, tagGroup.tagGroupId) > -1) {
                tagGroup.selected = true;
            }
        });
    }

    updateFilteredTagGroups() {
        let tagIds = [];
        if (this.selectedTagGroups) {
            _.each(this.selectedTagGroups, function (tagGroup) {
                tagIds = tagIds.concat(tagGroup.tagIds);
            });
        }
        _.each(this.tagGroups, function (tagGroup) {
            tagGroup.selected = false;
            _.each(tagGroup.tags, function (tag) {
                tag.selected = false;
                if (_.intersection([tag.tagId], tagIds).length > 0) {
                    tag.selected = true;
                }
            });
            if (!_.find(tagGroup.tags, function (tag) { return !tag.selected; })) {
                tagGroup.selected = true;
            }
        });
    }

    treeFilter() {
        const tagGroups = [];
        _.each(this.tagGroups, function (tagGroup) {
            const selectedTagIds = _.pluck(_.filter(tagGroup.tags, function (tag) {
                if (tag.selected) {
                    return tag.tagId;
                }
            }), 'tagId');
            tagGroups.push({ tagGroupId: tagGroup.tagGroupId, tagIds: selectedTagIds });
        });
        this.emitLocalEvent({ eventName: this.operationType, value: { tagGroups: tagGroups, isSource: this.data.isSource } });
        this.dialogRef.close();
    }

    applyChanges() {
        this.operationType === operationType.PreferredTagGroups ? this.preferredTagGroups() : this.treeFilter();
    }

    preferredTagGroups() {
        const tagGroupIds = [];
        _.each(this.tagGroups, function (tagGroup) {
            if (tagGroup.selected) {
                tagGroupIds.push(tagGroup.tagGroupId);
            }
        });
        this.emitLocalEvent({ eventName: this.operationType, value: { tagGroupIds: tagGroupIds, isSource: this.data.isSource } });
        this.dialogRef.close();
    }

    selectTag(event: Event, tag: any, tagGroup: any) {
        if (tag.selected) {
            tagGroup.selected = false;
        }
        event.stopPropagation();
    }

    selectTagGroup(event: Event, tagGroup: any) {
        event.stopPropagation();
        if (this.operationType === operationType.PreferredTagGroups) {
            return;
        }
        _.each(tagGroup.tags, function (tag) {
            tag.selected = !tagGroup.selected;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.next();
            this.subscription.complete();
        }
    }
}



