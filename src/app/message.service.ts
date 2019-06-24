import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket = io('http://localhost:3000');
  //this is line of code which when executed will triiger connection event for node io and
  //new connection is made is logged.

  joinRoom(data){
    this.socket.emit('join',data);
  }
  //here we are emitting event when a client joins with a payload i.e. data.
  newUserJoined(){
    let observable = new Observable<{user:String,message:String}>((observer)=>{
      this.socket.on('new user joined',(data)=>{
        observer.next(data);
      });
      return ()=>{this.socket.disconnect();}
    })

    //here we are creating an observable specifing its payload in <> and then creating its function when
   // it will be emitted and error condition which specifies socket to be disconncted.

    return observable;
  }

  leaveRoom(data){
    console.log('leave data',data);
    this.socket.emit('leave',data);
  }


  userLeft(){
    let observable = new Observable<{user:String,message:String}>((observer)=>{
      this.socket.on('left room',(data)=>{
        observer.next(data);
      });
      return ()=>{this.socket.disconnect();}
    })
    return observable;
  }


  sendMessage(reqBody) :Observable<any>{
    console.log("-in service req bod", reqBody);
    return this.http.post('/api/login/message', reqBody);
  }
  logoutFlag(reqBody):Observable<any>{
    return this.http.post('/api/login/logout',reqBody);
  }

  activeUsers():Observable<any>{
    console.log('in get active service');
    return this.http.get('/api/login/active');
  }

  sendMessageSocket(data){
    this.socket.emit('message',data);
  }

  newMessageSent(){
    let observable =new Observable<{user:String,message:String}>((observer)=>{
      this.socket.on('sent message',(data)=>{
        observer.next(data);
      });
      return ()=>{this.socket.disconnect();}
    })
    return observable;
  }

  constructor(private http: HttpClient) { }

}
