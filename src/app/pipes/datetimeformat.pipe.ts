import { Injectable, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({name: 'dateTimeFormat'})
@Injectable()
export class DateTimeFormatPipe implements PipeTransform {
  // Custom pipe since Angular date pipe does not work on iOS
  transform(date: string | undefined, format: string): any {
    if (date === undefined) return '00:00';
    return moment(date).format(format);
  }
}
