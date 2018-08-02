import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'epocToDatetime'
})
export class EpocToDatetimePipe implements PipeTransform {

  transform(value: any, format?: any): any {
    if (value) {
      const datetime = new Date(value * 1000);
      return datetime;
    }
    return null;
  }

}
