import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  Status: String = '';

  profileForm = this.fb.group({
    username: ['', Validators.required],
    fullName:['',Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
    Email:['',[Validators.required,Validators.email]]
  });
  onSubmit() {
    const reqBody = {
      username: this.profileForm.controls['username'].value,
      password: this.profileForm.controls['password'].value,
      fullName: this.profileForm.controls['fullName'].value,
      Email: this.profileForm.controls['Email'].value
    }

    if (this.profileForm.controls['password'].value != this.profileForm.controls['confirm_password'].value) {
      this.Status = 'passwords dont match';
      return;
    }
    console.log(this.profileForm.value);

    this.http.post('/api/login/create', reqBody).subscribe(res => {
      console.log('create res',res);
          this.Status = res["msg"];
          setTimeout(() => {
            this.Status='';
            this.router.navigateByUrl('/login');
          }, 3000)

    },err=>{
      console.log('err msg',err);
      this.Status = err.error["msg"];
      setTimeout(() => {
        this.Status='';
      }, 3000)
    });
    
  }
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

}
