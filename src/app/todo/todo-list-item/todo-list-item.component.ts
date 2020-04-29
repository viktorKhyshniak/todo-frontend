import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoModel } from '../../shared/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Constance } from '../../shared/constants';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.css']
})
export class TodoListItemComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  @Input() todoItem: TodoModel;
  @Output() deleteItem = new EventEmitter();
  @Output() updateItem = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  showOptions = false;
  editMode = false;
  editForm = this.fb.group({
    _id: [''],
    status: ['Active', Validators.required],
    todo: ['', Validators.required]
  });
  statusConst = Constance.todoStatuses;

  ngOnInit(): void {
  }

  deleteCurrentItem($event, id: string) {
    $event.stopPropagation();
    this.deleteItem.emit(id);
  }

  editCurrentItem($event, value) {
    $event.stopPropagation();
    this.updateItem.emit(value);
    this.editMode = this.editMode ? this.changeMode($event, this.editMode) : this.editMode;
  }

  changeEditMode($event, value) {
    $event.stopPropagation();
    this.editMode = this.changeMode($event, this.editMode);
    this.editForm.patchValue(value);
  }

  changeMode($event, value) {
    $event.stopPropagation();
    return !value;
  }

  changeStatus($event, status) {
    let newStatus: string;
    switch (status) {
      case Constance.todoStatuses.active : {
        newStatus = Constance.todoStatuses.complete;
        break;
      }
      case Constance.todoStatuses.complete  : {
        newStatus = Constance.todoStatuses.active;
        break;
      }
      default : {
        newStatus = Constance.todoStatuses.complete;
        break;
      }
    }
    this.todoItem = {...this.todoItem, status: newStatus};
    this.editCurrentItem($event, this.todoItem);
    this.statusChange.emit();
  }

  formChange($event) {
    $event.stopPropagation();
  }
}
