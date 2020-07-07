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
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  DELETE_ALL_TASKS_SUCCESS,
  DELETE_ALL_TASKS_FAIL,
} from '../shared/constants';


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
  popupMessageUpdateTaskSuccess = UPDATE_TASK_SUCCESS;
  popupMessageUpdateTaskFail = UPDATE_TASK_FAIL;
  popupMessageDeleteTaskSuccess = DELETE_TASK_SUCCESS;
  popupMessageDeleteTaskFail = DELETE_TASK_FAIL;
  popupMessageDeleteAllSuccess = DELETE_ALL_TASKS_SUCCESS;
  popupMessageDeleteAllFail = DELETE_ALL_TASKS_FAIL;
  form: FormGroup;
  displayedTasks: Task[] = [];

  constructor(
    private dateManagerService: DateManagerService,
    private tasksService: TasksService,
    private toasterService: ToasterService,
  ) {
  }

  ngOnInit() {
    this.dateManagerService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => this.displayedTasks = tasks);

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
        this.displayedTasks.push(t);
        this.form.reset();
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageSaveTaskFail)
    );
  }

  updateTask(event, task): void {
    if (event.key === 'Enter') {
      this.tasksService.update({id: task.id, title: event.target.textContent, date: task.date}).subscribe(() => {
        this.updateDisplayed(task.id, event.target.textContent);
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageUpdateTaskSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageUpdateTaskFail));
      event.target.blur();
    } else if (event.key === 'Escape') {
      event.target.textContent = task.title;
      event.target.blur();
    }
  }

  private updateDisplayed(taskId: string, newTitle: string): void {
    this.displayedTasks.forEach(item => {
      if (item.id === taskId) {
        item.title = newTitle;
      }
    });
  }

  removeSingle(task: Task): void {
    this.tasksService.remove(task).subscribe(() => {
        this.displayedTasks = this.displayedTasks.filter(t => t.id !== task.id);
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteTaskSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageDeleteTaskFail)
    );
  }

  removeAll(): void {
    this.tasksService.removeAll(this.dateManagerService.date.value).subscribe(() => {
        this.displayedTasks = [];
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteAllSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageDeleteAllFail)
    );
  }

  private showPopup(type: string, title: string, message: string): void {
    this.toasterService.pop(type, title, message);
  }
}
