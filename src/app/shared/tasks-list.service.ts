import {Injectable} from '@angular/core';
import {Task} from './interfaces/task';


@Injectable({
  providedIn: 'root'
})
export class TasksListService {
  public listOfTasks: Task[] = [];

  prepareList(tasks: Task[]): void {
    this.listOfTasks = [...tasks];
  }

  public insertTask(task: Task): void {
    this.listOfTasks.push(task);
  }

  public updateTask(taskId: string, newTitle: string): void {
    this.listOfTasks.forEach(item => {
      if (item.id === taskId) {
        item.title = newTitle;
      }
    });
  }

  public removeTask(task: Task): void {
    this.listOfTasks = this.listOfTasks.filter(item => item.id !== task.id);
  }

  public clearAll(): void {
    this.listOfTasks = [];
  }
}
