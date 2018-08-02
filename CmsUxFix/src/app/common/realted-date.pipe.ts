import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const names: any = [
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
];

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {

    getDuration(dateStamp: number) {
        let timeAgoInSeconds = Math.ceil((new Date().getTime() - new Date(dateStamp).getTime()) / 1000);
        for (let [name, seconds] of names) {
            let interval = Math.ceil(timeAgoInSeconds / seconds);
            if (interval > 24 && name === 'hour') {
                return {
                    interval: interval,
                    name: name,
                    time: new Date(dateStamp),
                };
            } else {
                if (interval > 1) {
                    return {
                        interval: interval,
                        name: name,
                        time: undefined
                    };
                }
            }
        }
        return {
            interval: 0,
            name: 'second',
            time: undefined
        };
    }

    transform(dateStamp: number): string {
        let { interval, name, time } = this.getDuration(dateStamp * 1000);
        let suffix = interval === 1 || interval === 0 ? '' : 's';
        return time ? moment(time).format('MMM D YYYY, h:mm A') : `${interval === 1 || interval === 0 ? 'a' : interval} ${name}${suffix} ago`;
    }
}
