import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/de';
dayjs.locale('en');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

@Pipe({
    name: 'dayJS',
})
export class DateFormatePipe implements PipeTransform {
    transform(value: string, withoutSuffix = false): string {
        // switch (true) {
        //     case method === 'formNow':
        //         return dayjs(value).fromNow(withoutSuffix);
        //     case method === 'toNow':

        //     default:
        //         break;
        // }

        const dayObject = dayjs(value);
        if (dayObject.isBefore(dayjs().subtract(7, 'day'))) {
            return dayObject.format('ll');
        } else {
            return dayObject.fromNow(withoutSuffix);
        }
    }
}
