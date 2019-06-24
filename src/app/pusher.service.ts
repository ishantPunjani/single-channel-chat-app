import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
 
  constructor() {
  }

  private subject = new BehaviorSubject('');

  sendUsername(name: string) {
      this.subject.next(name);
      console.log('name in pusher',name);
  }


  getUsername(): Observable<any> {
      return this.subject.asObservable();
  }
}
