import {Component} from '@angular/core';
import {DateManagerService} from '../shared/date-manager.service';
import * as moment from 'moment';


@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent {
  addMonth = 'На місяць вперед';
  minusMonth = 'На місяць назад';
  addYear = 'На рік вперед';
  minusYear = 'На рік назад';
  today = 'Сьогодні';

  constructor(
    private dateManagerService: DateManagerService,
  ) {
  }

  public changeCurrentDate(value: number, time: moment.DurationInputArg2): void {
    this.dateManagerService.changeDate(value, time);
  }

  public showToday(): void {
    this.dateManagerService.showToday();
  }

}
