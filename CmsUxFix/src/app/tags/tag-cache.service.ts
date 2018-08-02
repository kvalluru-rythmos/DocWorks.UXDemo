import { Injectable, Injector } from '@angular/core';
import { Tag } from '../tags/tag';
import { TagGroup } from '../tags/TagGroup';
import { HttpService } from '../common/http.service';
import * as _ from 'underscore';
import { LocalEventEmitterService } from '../common/local-event-emitter.service';
import { environment } from '../../environments/environment';
import { StorageService } from '../common/storage.service';

@Injectable()
export class TagCacheService {
    constructor(private httpService: HttpService, public localEventEmitterService: LocalEventEmitterService, public injector: Injector, private storageService: StorageService) {
        this.tagGroups = this.getTagGroupsFromLocalStorage();
    }

    pendingResponseId: string;
    tagGroups: any = {};
    tagVsTagGroup: any = {};

    addTagsToCache(tagGroups: any) {
        this.tagGroups = {};
        this.tagVsTagGroup = {};
        _.each(tagGroups, function (tagGroup) {
            let tags = {};
            _.each(tagGroup.tags, function (tag) {
                if (tag.tagId) {
                    tags[tag.tagId] = tag;
                    this.tagVsTagGroup[tag.tagId] = tagGroup.tagGroupId;
                }
            }.bind(this));
            tagGroup.tags = tags;
            this.tagGroups[tagGroup.tagGroupId] = tagGroup;
        }.bind(this));
        this.setTagGroupsToLocalStorage(this.tagGroups);
    }

    getTagGroup(tagGroupId: string): TagGroup {
        let tagGroup = this.tagGroups[tagGroupId];
        tagGroup.tags = _.values(tagGroup.tags);
        return tagGroup;
    }

    getTags(TagGroupId: string): Tag[] {
        return _.values(this.tagGroups[TagGroupId].tags);
    }

    getTagGroups(): TagGroup[] {
        let tagGroups = _.values(this.tagGroups);
        return _.each(tagGroups, function (tagGroup) {
            tagGroup.tags = _.values(tagGroup.tags);
            return tagGroup;
        });
    }

    tagGroupNameExists(selectedTagGroup: any): boolean {
        const foundTagGroup = _.find(this.getTagGroups(), function (tagGroup) {
            return selectedTagGroup.tagGroupName.toLowerCase() === tagGroup.tagGroupName.toLowerCase() && tagGroup.tagGroupId !== selectedTagGroup.tagGroupId;
        });
        return foundTagGroup ? true : false;
    }

    tagNameExists(selectedTag: any, tagGroupId: string): boolean {
        if (!selectedTag.tagId) {
            selectedTag = { tagId: '', tagName: selectedTag };
        }
        const tagGroup = this.getTagGroup(tagGroupId);
        const tags = _.values(tagGroup.tags);
        const foundTag = _.find(tags, function (tag) {
            return tag.tagName.toLowerCase() === selectedTag.tagName.toLowerCase() && tag.tagId !== selectedTag.tagId;
        });
        return foundTag ? true : false;
    }

    getTagGroupForTag(tagId: string): TagGroup[] {
        return _.filter(this.tagGroups, function (tagGroup) {
            if (tagGroup.value.tags[tagId]) {
                return tagGroup.value;
            }
        });
    }

    addTag(tagGroupId: string, tag: any): any {
        tag.inProgress = true;
        tag.tagId = '_new';
        this.tagGroups[tagGroupId].tags['_new'] = tag;
        this.emitLocalEvent({ eventName: 'tagGroupsUpdate', value: this.getTagGroups() });
        return tag;
    }

    addTagGroup(tagGroup: any): any {
        tagGroup.tagGroupId = '_new';
        tagGroup.inProgress = true;
        this.tagGroups['_new'] = tagGroup;
        this.emitLocalEvent({ eventName: 'tagGroupsUpdate', value: this.getTagGroups() });
        return tagGroup;
    }

    updateTagGroup(tagGroupId: string, tagGroup: any) {
        this.tagGroups[tagGroupId].inProgress = true;
        this.tagGroups[tagGroupId].tagGroupName = tagGroup.tagGroupName;
        this.tagGroups[tagGroupId].colour = tagGroup.colour;
        this.tagGroups[tagGroupId].limitToOne = tagGroup.limitToOne;
        this.tagGroups[tagGroupId].childNodesInherit = tagGroup.childNodesInherit;
        this.tagGroups[tagGroupId].displayGroupName = tagGroup.displayGroupName;
        this.tagGroups[tagGroupId].public = tagGroup.public;
        this.tagGroups[tagGroupId].publish = tagGroup.publish;
        this.emitLocalEvent({ eventName: 'tagGroupsUpdate', value: this.getTagGroups() });
    }

    updateTag(tagGroupId: string, tagId: string, tag: any) {
        _.each(this.tagGroups[tagGroupId].tags, function (atag) {
            if (atag.tagId === tagId) {
                atag.tagName = tag.tagName;
                atag.inProgress = true;
            }
        });
        this.emitLocalEvent({ eventName: 'tagGroupsUpdate', value: this.getTagGroups() });
    }

    getTagByTagId(tagId: string): any {
        const tagGroupId = this.tagVsTagGroup[tagId];
        const tagGroup = this.getTagGroup(tagGroupId);
        return _.find(tagGroup.tags, function (tag) { return tag.tagId === tagId; });
    }

    getTagGroupsForIds(tagGroupIds: string[]): any[] {
        let tagGroups = [];
        const clonedTagGroups = JSON.parse(JSON.stringify(this.getTagGroups()));
        _.each(clonedTagGroups, function (tagGroup) {
            if (_.indexOf(tagGroupIds, tagGroup.tagGroupId) > -1) {
                tagGroup.selected = false;
                tagGroup.inProgress = false;
                tagGroups.push(tagGroup);
            }
        }.bind(this));
        return tagGroups;
    }

    getExcludedTagGroups(tagGroupIds: string[]): any[] {
        let tagGroups = [];
        _.each(this.getTagGroups(), function (tagGroup) {
            if (_.indexOf(tagGroupIds, tagGroup.tagGroupId) < 0) {
                tagGroup.inProgress = false;
                tagGroups.push(tagGroup);
            }
        }.bind(this));
        return tagGroups;
    }

    fetchTagGroups(): any {
        if (!this.pendingResponseId) {
            this.requestTagGroups();
        }
        return this.getTagGroups();
    }

    getTagGroupList() {
        return {
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/tagGroups'),
            data: this.getTagGroups()
        };
    }

    requestTagGroups() {
        return this.httpService.get(environment.API_BASE_URL + '/api/tagGroups').toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    postTagGroup(tagGroup: any): Promise<string> {
        this.addTagGroup(tagGroup);
        return this.httpService.post(environment.API_BASE_URL + '/api/tagGroups', tagGroup).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    editTagGroup(tagGroup: any): Promise<string> {
        this.updateTagGroup(tagGroup.tagGroupId, tagGroup);
        return this.httpService.put(environment.API_BASE_URL + '/api/tagGroups', tagGroup).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    postTag(tagGroup: TagGroup, tag: any): Promise<string> {
        this.addTag(tagGroup.tagGroupId, tag);
        return this.httpService.post(environment.API_BASE_URL + '/api/tags', { tagName: tag.tagName, tagGroupId: tagGroup.tagGroupId }).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    editTag(tagGroup: TagGroup, tag: any): Promise<string> {
        this.updateTag(tagGroup.tagGroupId, tag.tagId, tag);
        return this.httpService.put(environment.API_BASE_URL + '/api/tags', tag).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }


    getTagGroupsFromLocalStorage() {
        const tagGroups = this.storageService.read('tagGroups');
        return tagGroups ? tagGroups : {};
    }

    setTagGroupsToLocalStorage(tagGroups) {
        this.storageService.write('tagGroups', tagGroups);
    }

    emitLocalEvent(value) {
        this.localEventEmitterService.localEvent.emit(value);
    }

    deleteTagGroup(tagGroup: TagGroup): Promise<string> {
        return this.httpService.delete(environment.API_BASE_URL + '/api/tagGroups/' + tagGroup.tagGroupId)
            .toPromise()
            .then(response => {
                return response.json().responseId as string;
            });
    }

    deleteTag(tag: Tag): Promise<string> {
        return this.httpService.delete(environment.API_BASE_URL + '/api/tags/' + tag.tagId)
            .toPromise()
            .then(response => {
                return response.json().responseId as string;
            });
    }
}
