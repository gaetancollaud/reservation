import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'datetime'
})
export class DatetimePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return value ? moment(value).format(args && args[0] ? args[0] : 'DD.MM.YYYY HH:mm:ss') : '';
    }
}
