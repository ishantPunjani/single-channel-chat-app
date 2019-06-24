import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  reqBody={
    "user":"Ishant",
    "password":"qwerty123"
  }
  constructor(private http :HttpClient){

  }
  ngOnInit(){
    // this.http.get('/api/v1/users').subscribe(res => console.log(res));
    // this.http.post('/api/v1/users',this.reqBody).subscribe(res => console.log(res));
    // this.http.post('/api/v1/users/create',this.reqBody).subscribe(res => console.log(res));
    // this.http.get('/api/v1/users/create').subscribe(res => console.log(res));
  }
  title = 'practice';
}
