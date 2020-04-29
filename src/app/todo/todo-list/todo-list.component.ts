import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoModel } from '../../shared/models';
import { Constance } from '../../shared/constants';
import { $e } from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  @Input() set todoList(todoList: TodoModel[]) {
    if (todoList) {
      this.allTodo = todoList;
      this.filterTodos();
    }
  }
  @Output() deleteItem = new EventEmitter();
  @Output() updateItem = new EventEmitter();
  allTodo: TodoModel[];
  listOfTodo: TodoModel[];
  lastPlace = 'all';

  constructor() { }

  ngOnInit(): void {
  }

  delete(id: string) {
    this.deleteItem.emit(id);
  }

  update($event: TodoModel) {
    this.updateItem.emit($event);
  }

  filterTodos($event?) {
    const place = $event ? $event.toString() : this.lastPlace;
    switch (place) {
      case Constance.todoStatuses.active : {
        this.listOfTodo = this.allTodo.filter((todo) => todo.status === place);
        break;
      }
      case Constance.todoStatuses.complete : {
        this.listOfTodo = this.allTodo.filter((todo) => todo.status === place);
        break;
      }
      default : {
        this.listOfTodo = this.allTodo;
        break;
      }
    }
    this.lastPlace = place;
  }
}
