import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from '../shared/services/todo.service';
import { TodoModel } from '../shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../shared/modals/login-modal/login-modal.component';
import { AuthService } from '../shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog,
    private authService: AuthService,
    private toastrService: ToastrService
    ) { }

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
        (err) => this.toastrService.error(err.error)
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
        (err) => this.toastrService.error(err.error)
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
        ((err) => this.toastrService.error(err.error))
      );
  }

  postTodoFormValue(formData) {
    this.todoService.postTodo({...formData, userId: this.userInfo ? this.userInfo._id : undefined})
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (todo) => {
          this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList();
          this.toastrService.success('Add Success');
        },
        (err) => this.toastrService.error(err.error)
      );
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      ((todos) => this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList()),
      ((err) => this.toastrService.error(err.error))
    );
  }

  updateTodo(formBody: TodoModel) {
    this.todoService.putTodo(formBody._id, formBody)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      (todos) => this.userInfo ? this.getUserTodo(this.userInfo._id) : this.getTodoList(),
      (err) => this.toastrService.error(err.error)
    );
  }

  openLoginDialog() {
    this.dialog.open(LoginModalComponent, {data: {buttonText: 'Login'}}).beforeClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (item) => item && this.login(item),
        (err) => this.toastrService.error(err.error),
      );
  }

  openRegistrationDialog() {
    this.dialog.open(LoginModalComponent, {data: {buttonText: 'Registration'}}).beforeClosed()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (item) => item && this.registrationNewUser(item),
        (err) => this.toastrService.error(err.error),
      );
  }

  login(item) {
    this.authService.login(item)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (res) => {
          if (!res.error) {
            this.isUserLoggedIn = item;
            this.toastrService.success('WELCOME USER');
          } else {
            this.toastrService.error(res.error);
          }
        },
        (err) => this.toastrService.error(err.error)
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
      }, (err) => this.toastrService.error(err.error));
  }

  registrationNewUser(formBody) {
    this.authService.registrationNewUser(formBody)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => this.toastrService.success(res), (err) => this.toastrService.error(err.error))
  }
}
