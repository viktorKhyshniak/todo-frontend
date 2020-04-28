import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { TodoModel } from '../shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

  constructor(private todoService: TodoService) { }

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  todoList: TodoModel[];

  ngOnInit(): void {
    this.getTodoList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getTodoList() {
    this.todoService.getTodoList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        ((todos) => this.todoList = todos),
        ((err) => console.log(err))
      );
  }

  postTodoFormValue(formData) {
    this.todoService.postTodo(formData)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (todo) => this.getTodoList(),
        (err) => console.log(err)
      );
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      ((todos) => this.getTodoList()),
      ((err) => console.log(err))
    );
  }

  updateTodo(formBody: TodoModel) {
    this.todoService.putTodo(formBody._id, formBody)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      ((todos) => this.getTodoList()),
      ((err) => console.log(err))
    );
  }

}
