import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DateManagerService} from '../shared/services/date-manager.service';
import {Week} from '../shared/interfaces/weekdays';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  mainCalendar: Week[];
  daysOfWeek: string[] = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

  constructor(
    private dateManagerService: DateManagerService,
  ) {
  }

  ngOnInit() {
    this.dateManagerService.date.subscribe(this.createCalendar.bind(this));
  }

  private createCalendar(now: moment.Moment): void {
    const firstDay = now.clone().startOf('month').startOf('week');
    const lastDay = now.clone().endOf('month').endOf('week');

    const date = firstDay.clone().subtract(1, 'day');
    const calendar= [];

    while (date.isBefore(lastDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');

            return {
              value, active, disabled, selected
            };
          })
      });
    }
    this.mainCalendar = calendar;
  }

  public selectDay(day: moment.Moment): void {
    this.dateManagerService.selectDay(day);
  }
}
