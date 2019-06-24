import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../message.service';
import { PusherService } from '../pusher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {


  user: string;
  message: string = '';
  room = 'single_channel';
  emotion;


  constructor(private messageService: MessageService, private pusherService: PusherService,
    private router: Router) {

  }

  newMessage() {
    let reqBody = { "username": this.user, "message": this.message };
    console.log("-req bod", reqBody);

    this.messageService.sendMessage(reqBody).subscribe((res) => {
      console.log('new message passed to mongo..', res);
      this.emotion = res;
      console.log(this.emotion);
      setTimeout(()=>{
        this.emotion=''
      },10000)
    },(err)=>{console.log(err)});
    this.messageService.sendMessageSocket({ user: this.user, message: this.message, room: this.room });
    this.message = '';

  }

  ngOnInit() {
    this.pusherService.getUsername().subscribe((name) => {
      this.user = name;
    })
    console.log('user from subject..', this.user);


  }



}
