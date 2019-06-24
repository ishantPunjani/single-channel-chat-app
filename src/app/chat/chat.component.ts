import { Component, OnInit, Input, OnChanges,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../pusher.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc'; // Add


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  localStream: Stream // Add
  remoteCalls: any = []; // Add

  @ViewChild('video',{static:false}) Video:ElementRef;

  messages;
  user;
  room = 'single_channel';
  alert: String = '';
  leftAlert: String;
  activeUsers = [];

  constructor(private http: HttpClient, private pusher: PusherService,
    private messageService: MessageService, private router: Router,
    private agoraService: AngularAgoraRtcService,private renderer:Renderer2
  ) {

    this.agoraService.createClient();

    this.messageService.newUserJoined().subscribe((data) => {
      this.getAcitiveUsers();
      console.log(data.user);
      this.alert = data.user + '-' + data.message;
      setTimeout(() => {
        this.alert = ''
      }, 3000)
    })

    this.messageService.userLeft().subscribe((data) => {
      this.getAcitiveUsers();
      console.log('data in h3 leave', data);
      this.leftAlert = data.user + '-' + data.message;
      setTimeout(() => {
        this.leftAlert = ''
      }, 3000)
    })
  }

  
  ngOnInit() {
    this.pusher.getUsername().subscribe((res) => {
      this.user = res;
    })
    this.getmessages();

    this.messageService.newMessageSent().subscribe((data) => {
      this.getmessages();
    })
    //it avoids refreshing and list of msgs is always updated whenever new msg sent
    this.join();
    //generating the event when a user logs in by sending event to through client socket and received
    //by node socket 
    this.getAcitiveUsers();
  }

  startCall() {
    this.renderer.setStyle(this.Video.nativeElement,'display','block');
    // this.Video.nativeElement.style.display='block';

    this.agoraService.client.join(null, '1000', null, (uid) => {
      this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
      this.localStream.setVideoProfile('720p_3');
      this.subscribeToStreams();
    });
  }
  leave() {
    this.agoraService.client.leave(() => {
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
    this.renderer.setStyle(this.Video.nativeElement,'display','none');
    // this.Video.nativeElement.style.display='none';

  }
  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    // Add
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

      // Add
      this.agoraService.client.on('peer-leave', (evt) => {
        const stream = evt.stream;
        if (stream) {
          stream.stop();
          this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
          console.log(`${evt.uid} left from this channel`);
        }
      });
  }

  getmessages() {
    this.http.get('/api/login/message').subscribe((res) => {
      this.messages = res;
    })
  }
  join() {
    this.messageService.joinRoom({ user: this.user, room: this.room });
  }
  leaveChat() {
    this.messageService.leaveRoom({ user: this.user, room: 'single_channel' });
    this.messageService.logoutFlag({ username: this.user }).subscribe((res) => {
      console.log(res);
    });
    this.router.navigateByUrl('/login');
  }

  getAcitiveUsers() {
    this.messageService.activeUsers().subscribe((res) => {
      console.log('active users res', res);
      this.activeUsers = [];
      Object.assign(this.activeUsers, res);
      console.log('active users array', this.activeUsers);
    })
  }

  compare(name) {
    if (this.user == name) {
      return false;
    }
    else
      return true;
  }
  checkUser(name) {
    if (name == this.user)
      return true;
    else
      return false;
  }

}
