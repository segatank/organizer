import {Component} from '@angular/core';
import {DateManagerService} from '../shared/date-manager.service';
import * as moment from 'moment';


@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent {
  constructor(
    private dateManagerService: DateManagerService,
  ) {
  }

  public changeCurrentDate(value: number, time: moment.DurationInputArg2): void {
    this.dateManagerService.changeDate(value, time);
  }

}
