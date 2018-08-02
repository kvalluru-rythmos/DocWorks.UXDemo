import {Injectable} from '@angular/core';
import * as _ from 'underscore';
import {templateStrings} from './template-strings';
import {TagCacheService} from '../tags/tag-cache.service';

@Injectable()
export class TemplateService {

  constructor(private tagCacheService: TagCacheService) {
  }

  getTemplateString(id, data) {
    let template = templateStrings[id];
    if (!template) {
      return;
    }
    let properties = _.keys(data);
    _.each(properties, function (aProp) {
      template = template.replace(new RegExp('{{' + aProp + '}}', 'g'), data[aProp]);
    });
    return template;
  }

  getTagByTagId(tagId: string) {
    const tagGroupId = this.tagCacheService.tagVsTagGroup[tagId];
    const tagGroup = this.tagCacheService.getTagGroup(tagGroupId);
    const value = _.find(tagGroup.tags, function (tag) {
      tag.colour = tagGroup.colour;
      return tag.tagId === tagId;
    });
    return value;
  }

  TagResolver(resourceChange) {
    let tags = resourceChange.tags;
    let text = '';
    for (let i = 0; i < tags.length; i++) {
      let tag = this.getTagByTagId(tags[i]);
      text += '<mat-chip class="mat-chip mat-primary ng-star-inserted" style="background-color:' + tag.colour + '">' + tag.tagName + '</mat-chip>';
    }
    return text;
  }
}
