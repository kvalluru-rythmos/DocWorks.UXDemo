import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'sort'
})

export class ArraySortPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!field) {
      return array;
    }

    let isAscending = true;
    if (field.startsWith('-')) {
      isAscending = false;
      field = field.substr(1);
    }

    return this.sortArray(array, field, isAscending);
  }

  sortArray(array: any[], field: string, isAscending: boolean) {
    array = _.sortBy(array, function (object) {
      return object[field].toLowerCase();
    });

    if (!isAscending) {
      array.reverse();
    }

    return array;
  }
}
