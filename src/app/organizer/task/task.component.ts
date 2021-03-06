import {Component, Input} from '@angular/core';
import {Task} from '../../shared/interfaces/task';
import {TasksService} from '../../shared/services/tasks.service';
import {TasksListService} from '../../shared/services/tasks-list.service';
import {
  FAIL,
  REMOVE,
  SUCCESS,
  DELETE_TASK_FAIL,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  UPDATE_TASK_SUCCESS,
} from '../../shared/constants';
import {NotificationsService} from '../../shared/services/notifications.service';


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
    private notificationService: NotificationsService,
  ) {
  }

  public updateTask($event, task: Task): void {
    if ($event.key === 'Enter') {
      this.tasksService.update({id: task.id, title: $event.target.textContent, date: task.date}).subscribe(() => {
        this.tasksList.updateTask(task.id, $event.target.textContent);
        this.notificationService.showPopup('success', this.popupTitleSuccess, this.popupMessageUpdateTaskSuccess);
      }, () => this.notificationService.showPopup('error', this.popupTitleFail, this.popupMessageUpdateTaskFail));
      $event.target.blur();
    } else if ($event.key === 'Escape') {
      $event.target.textContent = task.title;
      $event.target.blur();
    }
  }

  public removeSingle(task: Task): void {
    this.tasksService.remove(task).subscribe(() => {
        this.tasksList.removeTask(task);
        this.notificationService.showPopup('success', this.popupTitleSuccess, this.popupMessageDeleteTaskSuccess);
      }, () => this.notificationService.showPopup('error', this.popupTitleFail, this.popupMessageDeleteTaskFail)
    );
  }
}
