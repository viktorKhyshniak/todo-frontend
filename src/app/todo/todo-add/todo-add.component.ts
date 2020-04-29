import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  @Output() sendFormValue = new EventEmitter();

  form = this.fb.group({
    todo: [''],
    status: ['active']
  });

  ngOnInit(): void {
    this.initForm();
  }

  submitTodoForm() {
    this.sendFormValue.emit(this.form.value);
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      todo: [''],
      status: ['active']
    });
  }

}
