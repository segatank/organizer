import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DateManagerService} from '../shared/services/date-manager.service';
import {Week} from '../shared/interfaces/weekdays';
import {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
} from '../shared/constants';
import {TasksService} from '../shared/services/tasks.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  mainCalendar: Week[];
  daysOfWeek: string[] = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY];
  tasksPerMonth = {};

  constructor(
    private dateManagerService: DateManagerService,
    private tasksService: TasksService,
  ) {
  }

  ngOnInit() {
    this.dateManagerService.date.subscribe(this.checkExistingTasks.bind(this));
  }

  private checkExistingTasks(): void {
    this.tasksService.getDaysWithTasksForMonth(this.dateManagerService.date.value).subscribe(
      response => {
        if (response) {
          this.tasksPerMonth = response.reduce((result, item) => {
            result[item] = item;
            return result;
          }, {chosenDate: this.dateManagerService.date.value.format('YYYY-MM')});
        }
        this.createCalendar(this.dateManagerService.date.value);
      }
    );
  }

  private createCalendar(now: moment.Moment): void {
    const firstDay = now.clone().startOf('month').startOf('week');
    const lastDay = now.clone().endOf('month').endOf('week');

    const date = firstDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(lastDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const chosenDate = 'chosenDate';
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');
            const hasTasks = this.tasksPerMonth[value.format('DD')] > 0
              && this.tasksPerMonth[chosenDate] === date.format('YYYY-MM');

            return {
              value,
              active,
              disabled,
              selected,
              hasTasks,
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
