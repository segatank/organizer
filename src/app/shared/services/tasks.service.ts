import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Task, CreateResponse} from '../interfaces/task';


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
      .get<Task[]>(`${TasksService.databaseUrl}/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}.json`)
      .pipe(
        map(tasks => tasks ? Object.keys(tasks).map(key => ({...tasks[key], id: key})) : [])
      );
  }

  public getDaysWithTasksForMonth(date: moment.Moment): Observable<string[]> {
    return this.http
      .get<Task[]>(`${TasksService.databaseUrl}/${date.format('YYYY')}/${date.format('MM')}.json`)
      .pipe(
        map(tasks => tasks ? Object.keys(tasks).map(key => key) : [])
      );
  }

  public create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.databaseUrl}/${task.date.year}/${task.date.month}/${task.date.day}.json`, task)
      .pipe(
        map(res => {
          return {...task, id: res.name};
        }));
  }

  public update(task: Task): Observable<Task> {
    return this.http
      .patch<CreateResponse>(`${TasksService.databaseUrl}/${task.date.year}/${task.date.month}/${task.date.day}/${task.id}.json`, task)
      .pipe(
        map(res => {
          return {...task, id: res.name};
        }));
  }

  public remove(task: Task): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.databaseUrl}/${task.date.year}/${task.date.month}/${task.date.day}/${task.id}.json`);
  }

  public removeAll(date: moment.Moment): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.databaseUrl}/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}.json`);
  }
}
