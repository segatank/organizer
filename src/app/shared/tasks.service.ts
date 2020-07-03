import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs';
import {Task, CreateResponse} from './interfaces/task';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static databaseUrl = 'https://testfirebase-9221e.firebaseio.com/tasks';

  constructor(
    private http: HttpClient,
  ) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.databaseUrl}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
        }));
  }

  public create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.databaseUrl}/${task.date}.json`, task)
      .pipe(
        map(res => {
        return {...task, id: res.name};
      }));
  }

  public remove(task:Task): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.databaseUrl}/${task.date}/${task.id}.json`);
  }
}
