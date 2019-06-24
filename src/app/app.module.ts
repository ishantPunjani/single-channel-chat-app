import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes  } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MessagesComponent } from './messages/messages.component';
import { PusherService } from './pusher.service';
import { ChatComponent } from './chat/chat.component';
import {MatCardModule} from '@angular/material/card';
import 'hammerjs';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc'; // Add
import {MatSnackBarModule} from '@angular/material/snack-bar';


const agoraConfig: AgoraConfig = {
  AppID: '6cbfcbdaebb14e93b57e0e9395d9ed81',
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccountComponent,
    MessagesComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AngularAgoraRtcModule.forRoot(agoraConfig), // Add
    MatSnackBarModule
  ],
  providers: [PusherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
