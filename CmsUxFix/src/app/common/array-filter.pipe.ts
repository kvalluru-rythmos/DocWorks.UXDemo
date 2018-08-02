import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class ArrayFilterPipe implements PipeTransform {
  transform(array: any[], field: string, searchString: string): any[] {
    if (!searchString || !field) {
      return array;
    }
    if (array) {
      var value = array.filter(object => (object[field] ? object[field].toLowerCase() : '').indexOf(searchString.toLowerCase()) >= 0);
      return value;
    } else {
      return array;
    }
  }
}


@Pipe({
  name: 'filterProperties',
  pure: false
})
export class FilterPropertiesPipe implements PipeTransform {

  transform(values: Array<any>, args: any[]): any {
    return values.filter((value) => {
      for (let i = 0; i < args.length; i++) {
        if (value[args[i][0]]) {
          if (value[args[i][0]] !== args[i][1]) {
            return false;
          }
        } else {
          return true;
        }
      }
      return true;
    });
  }
}
