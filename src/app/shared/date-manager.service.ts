import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DateManagerService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment().locale('uk'));

  changeDate(value: number, monthYear: moment.DurationInputArg2): void {
    const newDate = this.date.value.add(value, monthYear);
    this.date.next(newDate);
  }

  selectDay(date: moment.Moment): void {
    const value = this.date.value.set({
      date: date.date(),
      month: date.month(),
    });
    this.date.next(value);
  }
}
