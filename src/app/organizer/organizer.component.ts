import {Component, OnInit} from '@angular/core';
import {DateManagerService} from '../shared/services/date-manager.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../shared/services/tasks.service';
import {Task} from '../shared/interfaces/task';
import {switchMap} from 'rxjs/operators';
import {
  REMOVE_ALL_TASKS,
  ORGANIZER,
  ADD_NEW_TASK,
  NO_TASKS,
  SUCCESS,
  FAIL,
  SAVE_TASK_SUCCESS,
  SAVE_TASK_FAIL,
  DELETE_ALL_TASKS_SUCCESS,
  DELETE_ALL_TASKS_FAIL,
} from '../shared/constants';
import {TasksListService} from '../shared/services/tasks-list.service';
import {NotificationsService} from '../shared/services/notifications.service';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  textRemoveAll = REMOVE_ALL_TASKS;
  textOrganizer = ORGANIZER;
  textAddNewTask = ADD_NEW_TASK;
  textNoTasks = NO_TASKS;
  popupTitleSuccess = SUCCESS;
  popupTitleFail = FAIL;
  popupMessageSaveTaskSuccess = SAVE_TASK_SUCCESS;
  popupMessageSaveTaskFail = SAVE_TASK_FAIL;
  popupMessageDeleteAllSuccess = DELETE_ALL_TASKS_SUCCESS;
  popupMessageDeleteAllFail = DELETE_ALL_TASKS_FAIL;
  form: FormGroup;

  constructor(
    public dateManagerService: DateManagerService,
    public tasksList: TasksListService,
    private tasksService: TasksService,
    private notificationService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this.dateManagerService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => this.tasksList.prepareList(tasks));

    this.form = new FormGroup({
      title: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(1)
        ]
      )
    });
  }

  submit(): void {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: {
        day: this.dateManagerService.date.value.format('DD'),
        month: this.dateManagerService.date.value.format('MM'),
        year: this.dateManagerService.date.value.format('YYYY'),
      },
    };

    this.tasksService.create(task).subscribe(t => {
        this.notificationService.showPopup('success', this.popupTitleSuccess, this.popupMessageSaveTaskSuccess);
        this.tasksList.insertTask(t);
        this.dateManagerService.selectDay(this.dateManagerService.date.value);
        this.form.reset();
      }, () => this.notificationService.showPopup('error', this.popupTitleFail, this.popupMessageSaveTaskFail)
    );
  }

  removeAll(): void {
    this.tasksService.removeAll(this.dateManagerService.date.value).subscribe(() => {
        this.tasksList.clearAll();
        this.notificationService.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteAllSuccess);
        this.dateManagerService.selectDay(this.dateManagerService.date.value);
      }, () => this.notificationService.showPopup('error', this.popupTitleFail, this.popupMessageDeleteAllFail)
    );
  }
}
