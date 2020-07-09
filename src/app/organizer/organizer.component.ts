import {Component, OnInit} from '@angular/core';
import {DateManagerService} from '../shared/date-manager.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../shared/tasks.service';
import {Task} from '../shared/interfaces/task';
import {switchMap} from 'rxjs/operators';
import {ToasterService} from 'angular2-toaster';
import {
  REMOVE,
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
import {TasksListService} from '../shared/tasks-list.service';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  textRemove = REMOVE;
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
    private dateManagerService: DateManagerService,
    private tasksService: TasksService,
    private toasterService: ToasterService,
    private tasksList: TasksListService,
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
      date: this.dateManagerService.date.value.format('DD-MM-YYYY'),
    };

    this.tasksService.create(task).subscribe(t => {
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageSaveTaskSuccess);
        this.tasksList.insertTask(t);
        this.form.reset();
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageSaveTaskFail)
    );
  }

  removeAll(): void {
    this.tasksService.removeAll(this.dateManagerService.date.value).subscribe(() => {
        this.tasksList.clearAll();
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteAllSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageDeleteAllFail)
    );
  }

  private showPopup(type: string, title: string, message: string): void {
    this.toasterService.pop(type, title, message);
  }
}
