import {Component, Input} from '@angular/core';
import {Task} from '../../shared/interfaces/task';
import {TasksService} from '../../shared/tasks.service';
import {TasksListService} from '../../shared/tasks-list.service';
import {ToasterService} from 'angular2-toaster';
import {
  FAIL,
  REMOVE,
  SUCCESS,
  DELETE_TASK_FAIL,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  UPDATE_TASK_SUCCESS,
} from '../../shared/constants';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  textRemove = REMOVE;
  popupTitleSuccess = SUCCESS;
  popupTitleFail = FAIL;
  popupMessageUpdateTaskSuccess = UPDATE_TASK_SUCCESS;
  popupMessageUpdateTaskFail = UPDATE_TASK_FAIL;
  popupMessageDeleteTaskSuccess = DELETE_TASK_SUCCESS;
  popupMessageDeleteTaskFail = DELETE_TASK_FAIL;
  @Input() indexOfTask: number;
  @Input() task: Task;

  constructor(
    private tasksService: TasksService,
    private tasksList: TasksListService,
    private toasterService: ToasterService,
  ) {
  }

  public updateTask($event, task: Task): void {
    if ($event.key === 'Enter') {
      this.tasksService.update({id: task.id, title: $event.target.textContent, date: task.date}).subscribe(() => {
        this.tasksList.updateTask(task.id, $event.target.textContent);
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageUpdateTaskSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageUpdateTaskFail));
      $event.target.blur();
    } else if ($event.key === 'Escape') {
      $event.target.textContent = task.title;
      $event.target.blur();
    }
  }

  public removeSingle(task: Task): void {
    this.tasksService.remove(task).subscribe(() => {
      this.tasksList.removeTask(task);
        this.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteTaskSuccess);
      }, () => this.showPopup('error', this.popupTitleFail, this.popupMessageDeleteTaskFail)
    );
  }

  private showPopup(type: string, title: string, message: string): void {
    this.toasterService.pop(type, title, message);
  }
}
