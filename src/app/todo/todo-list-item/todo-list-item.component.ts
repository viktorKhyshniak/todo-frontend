import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoModel } from '../../shared/models';
import { FormBuilder, Validators } from '@angular/forms';

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
  showOptions = false;
  editMode = false;
  editForm = this.fb.group({
    _id: [''],
    todo: ['', Validators.required]
  });

  ngOnInit(): void {
  }

  deleteCurrentItem(id: string) {
    this.deleteItem.emit(id);
  }

  editCurrentItem() {
    this.updateItem.emit(this.editForm.value);
    this.editMode = !this.editMode;
  }

  changeEditMode(value) {
    this.editMode = !this.editMode;
    this.editForm.patchValue(value);
  }
}
