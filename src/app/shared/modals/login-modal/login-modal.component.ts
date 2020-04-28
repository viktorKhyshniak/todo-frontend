import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef <LoginModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogData = this.data;
  }

  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });
  dialogData: {buttonText: string};

  onSubmit(value) {
    this.dialogRef.close(value);
  }

  ngOnInit(): void {
  }

}
