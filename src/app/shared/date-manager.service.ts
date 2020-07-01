import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DateManagerService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());

  changeDate(value: number, monthYear: moment.DurationInputArg2) {
    // const newDate = this.date.value.add(value, monthYear);
    const newDate = this.date.value.add(value, monthYear);
    this.date.next(newDate);
  }
}
