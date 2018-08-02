import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const duration = moment.duration(moment().diff(value)).asDays();
        if (duration > 3) {
            return moment(value).format('MMM D YYYY');
        } else {
            return moment(value).fromNow();
        }
    }
}
