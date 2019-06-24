import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../pusher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  Status: String = '';
  reqBody = {
    "username": "Ishant",
    "password": "qwerty123"
  }

  profileForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.profileForm.value);
    // this.http.post('/api/v1/users/create',this.profileForm.value).subscribe(res => console.log(res));

    this.http.post('/api/login', this.profileForm.value).subscribe(res => {
      console.log(res);
      this.pusher.sendUsername(this.profileForm.controls['username'].value);
      this.router.navigateByUrl('/chat');
    }, err => {
      this.Status = err.error;

    });

  }

  constructor(private fb: FormBuilder, private http: HttpClient, private pusher: PusherService,private router :Router) { }

  ngOnInit() {
  }

}
