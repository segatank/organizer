import {Component, OnInit} from '@angular/core';
import {DateManagerService} from '../shared/date-manager.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../shared/tasks.service';
import {Task} from '../shared/interfaces/task';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  textOrganizer = 'Органайзер';
  textAddNewTask = 'Додати справу';
  textNoTasks = 'Справ немає';
  form: FormGroup;
  displayedTasks: Task[] = [];

  constructor(
    private dateManagerService: DateManagerService,
    private tasksService: TasksService,
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
      this.displayedTasks.push(t);
      this.form.reset();
    }, err => console.error(err));
  }

  remove(task:Task): void {
    this.tasksService.remove(task).subscribe(() => {
        this.displayedTasks = this.displayedTasks.filter( t => t.id !== task.id)
      }, error => console.error(error)
    );
  }
}
