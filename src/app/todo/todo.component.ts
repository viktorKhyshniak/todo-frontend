import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { TodoModel } from '../shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../shared/modals/login-modal/login-modal.component';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private authService: AuthService) { }

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  todoListGlobal: TodoModel[];
  todoListPrivate: TodoModel[];
  isUserLoggedIn = false;
  userInfo;
  selectedTabIndex = 0;

  ngOnInit(): void {
    this.getTodoList();
    this.getUserInfo();
  }

  getUserInfo() {
    this.isUserLoggedIn = this.authService.isLoggedIn();
    this.authService.currentUserSubject$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (res) => {
          if (res) {
            this.userInfo = res;
            this.getUserTodo(res._id);
          }
        },
        (err) => console.log(err)
        );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getUserTodo(id: string) {
    this.todoService.getTodoByUserId(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (userTodo) => {
          this.todoListPrivate = userTodo;
          this.selectedTabIndex = 1;
        },
        (err) => console.log(err)
      );
  }

  getTodoList() {
    this.todoService.getTodoList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        ((todos) => {
          this.todoListGlobal = todos;
          this.selectedTabIndex = 0;
        }),
        ((err) => console.log(err))
      );
  }

  postTodoFormValue(formData) {
    this.todoService.postTodo({...formData, userId: this.userInfo ? this.userInfo._id : undefined})
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (todo) => this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList(),
        (err) => console.log(err)
      );
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      ((todos) => this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList()),
      ((err) => console.log(err))
    );
  }

  updateTodo(formBody: TodoModel) {
    this.todoService.putTodo(formBody._id, formBody)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      (todos) => this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList(),
      (err) => console.log(err)
    );
  }

  openLoginDialog() {
    this.dialog.open(LoginModalComponent, {data: {buttonText: 'Login'}}).beforeClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (item) => item && this.login(item),
        (err) => console.log(err),
      );
  }

  openRegistrationDialog() {
    this.dialog.open(LoginModalComponent, {data: {buttonText: 'Registration'}}).beforeClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (item) => item && this.registrationNewUser(item),
        (err) => console.log(err),
      );
  }

  login(item) {
    this.authService.login(item)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (res) => {
          if (res) {
            this.isUserLoggedIn = item;
          }
        },
        error => console.log(error)
      );
  }

  logout() {
    this.authService.logout()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        this.isUserLoggedIn = res;
        this.userInfo = null;
        this.selectedTabIndex = 0;
        this.todoListPrivate = null;
      }, (err) => console.log(err));
  }

  registrationNewUser(formBody) {
    this.authService.registrationNewUser(formBody)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => console.log(res))
  }
}
