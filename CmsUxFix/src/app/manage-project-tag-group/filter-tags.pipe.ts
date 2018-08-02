import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
    name: 'filterTags'
})
export class FilterTagsPipe implements PipeTransform {

    transform(tagGroups: any[], searchString: string): any[] {
        if (!searchString || !tagGroups || tagGroups.length < 1) {
            return tagGroups;
        }
        let filteredTagGroups = JSON.parse(JSON.stringify(tagGroups));
        filteredTagGroups = _.filter(filteredTagGroups, function (tagGroup) {
            tagGroup.tags = tagGroup.tags.filter(object => object.tagName.toLowerCase().indexOf(searchString.toLowerCase()) >= 0);
            return tagGroup;
        });
        return filteredTagGroups;
    }
}
