import {Component} from '@angular/core';
import {DateManagerService} from '../shared/services/date-manager.service';
import * as moment from 'moment';
import {
  ADD_MONTH,
  MINUS_MONTH,
  ADD_YEAR,
  MINUS_YEAR,
  TODAY
} from '../shared/constants';


@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent {
  addMonth = ADD_MONTH;
  minusMonth = MINUS_MONTH;
  addYear = ADD_YEAR;
  minusYear = MINUS_YEAR;
  today = TODAY;

  constructor(
    public dateManagerService: DateManagerService,
  ) {
  }

  public changeCurrentDate(value: number, time: moment.DurationInputArg2): void {
    this.dateManagerService.changeDate(value, time);
  }

  public showToday(): void {
    this.dateManagerService.showToday();
  }
}
