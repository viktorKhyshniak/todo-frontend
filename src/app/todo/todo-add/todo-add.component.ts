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
    todo: ['', Validators.required]
  });

  ngOnInit(): void {
  }

  submitTodoForm() {
    this.sendFormValue.emit(this.form.value);
    this.form.reset();
  }

}
