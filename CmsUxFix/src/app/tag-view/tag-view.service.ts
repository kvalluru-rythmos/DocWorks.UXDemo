import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';
import { TagCacheService } from '../tags/tag-cache.service';

@Injectable()
export class TagViewService {

    constructor(private httpService: HttpService,
        private tagCacheService: TagCacheService) {
    }

    getAvailableTagGroups(tagGroups: any[], nodeTags: any[]) {
        const allTagGroups = JSON.parse(JSON.stringify(tagGroups));
        return _.filter(allTagGroups, function (tagGroup) {
            tagGroup.tags = _.filter(tagGroup.tags, function (tag) {
                if (_.indexOf(nodeTags, tag.tagId) < 0) {
                    return tag;
                }
            });
            return tagGroup;
        });
    }

    getAssignedTagGroups(tagGroups: any[], nodeTags: any[]) {
        const allTagGroups = JSON.parse(JSON.stringify(tagGroups));
        return _.filter(allTagGroups, function (tagGroup) {
            tagGroup.tags = _.filter(tagGroup.tags, function (tag) {
                if (_.indexOf(nodeTags, tag.tagId) > -1) {
                    return tag;
                }
            });
            return tagGroup;
        });
    }

    addTagsToNode(requestModel: any): Promise<string> {
        return this.httpService.post(environment.API_BASE_URL + '/api/nodes/AddTagsToNode', requestModel)
            .toPromise()
            .then(response => {
                return response.json().responseId;
            });
    }

    removeTagsFromNode(requestModel: any) {
        return this.httpService.post(environment.API_BASE_URL + '/api/nodes/DeleteTagsFromNode', requestModel)
            .toPromise()
            .then(response => {
                return response.json().responseId;
            });
    }

    getTagsForNode(nodeId: string): Promise<any> {
        return this.httpService.get(environment.API_BASE_URL + '/api/nodes/' + nodeId + '/tags')
            .toPromise().then(response => {
                return response.json().responseId;
            });
    }

    getTagsByTagGroupIds(tagGroupIds: string[]): any[] {
        let tags = [];
        _.each(tagGroupIds, function (tagGroupId) {
            const tagGroup = this.tagCacheService.getTagGroup(tagGroupId);
            _.each(tagGroup.tags, function (tag) {
                tag.tagGroupId = tagGroup.tagGroupId;
                tag.limitToOne = tagGroup.limitToOne;
                tag.tagGroupName = tagGroup.tagGroupName;
                tag.displayGroupName = tagGroup.displayGroupName;
                tag.isSystemManaged = tagGroup.isSystemManaged;
                tag.colour = tagGroup.colour;
                tags.push(tag);
            });
        }.bind(this));
        return tags;
    }

    getAvailableTags(tags: any[], tagIds: any[]) {
        const allTags = JSON.parse(JSON.stringify(tags));
        return _.filter(allTags, function (tag) {
            if (_.indexOf(tagIds, tag.tagId) < 0) {
                if (!tag.isSystemManaged && (!tag.limitToOne || !this.checkLimitToOne(tag, tagIds))) { return tag; }
            }
        }.bind(this));
    }

    checkLimitToOne(selectedTag: any, tagIds: any[]) {
        const allTagIds = _.pluck(this.getTagsByTagGroupIds([selectedTag.tagGroupId]), 'tagId');
        return _.intersection(allTagIds, tagIds).length > 0 ? true : false;
    }

    getAssignedTags(tags: any[], tagIds: any[]) {
        const allTags = JSON.parse(JSON.stringify(tags));
        return _.filter(allTags, function (tag) {
            if (_.indexOf(tagIds, tag.tagId) > -1) {
                return tag;
            }
        });
    }
}
