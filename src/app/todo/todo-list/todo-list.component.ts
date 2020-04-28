import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoModel } from '../../shared/models';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  @Input() todoList: TodoModel[];
  @Output() deleteItem = new EventEmitter();
  @Output() updateItem = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  delete(id: string) {
    this.deleteItem.emit(id);
  }

  update($event: TodoModel) {
    this.updateItem.emit($event);
  }
}
