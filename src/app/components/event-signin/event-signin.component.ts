import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';

import * as io from 'socket.io-client';
import {ConfigService} from '../../services/config.service';
import {APIService, EventModel, SignupModel, UserModel} from '../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-event-signin',
  templateUrl: './event-signin.component.html',
  styleUrls: ['./event-signin.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *',
        [
          query(':enter', [
            style({opacity: 0, transform: 'translateY(-15px)'}),
            stagger('50ms',
              animate('550ms ease-out',
                style({opacity: .7, transform: 'translateY(0px)'})))
          ], {optional: true})
        ])
    ])
  ]
})
export class EventSigninComponent implements OnInit, AfterViewInit {

  socket: SocketIOClient.Socket;
  private elem: any;

  event: EventModel;
  signedUp: Array<SignupModel>;

  public timeSubscription: Subscription;
  public time: string;
  public minsLeft: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly apiService: APIService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    @Inject(DOCUMENT) private document: any
  ) {
    console.log(configService.config.apiRoot);
    this.socket = io.connect(configService.config.apiRoot);
    this.elem = document.documentElement;
  }

  ngOnInit() {
    const eventId = this.activatedRoute.snapshot.paramMap.get('event');

    this.updateTime();
    this.timeSubscription = interval(1000).subscribe(() => this.updateTime());

    this.socket.on('connect', () => {
      this.socket.emit('subscribe', {
        authorization: `Bearer ${this.apiService.userSession.token}`,
        event: eventId
      }, data => this.updateSignup(data));

      this.socket.on('eventUpdate', data => this.updateSignup(data));
    });
  }

  public updateSignup = (event: EventModel) => {
    this.event = event;
    this.signedUp = event.signedUp.filter(signUp => !signUp.attended);
  };

  ngAfterViewInit() {
    this.openFullscreen();
  }

  public openFullscreen = () => {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen().catch(e => console.log('Failed opening full screen:', e));
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  };

  public attend = async (user: UserModel) => {
    try {
      await this.apiService.attend(this.event._id, user._id);
    } catch (e) {
      this.snackbar.open('Failed to signin (' + e + ')')._dismissAfter(2000);
    }
  };

  public updateTime = () => {
    const date = new Date();
    const unit = (date.getHours() < 12) ? 'AM' : 'PM';

    let hour: string | number = (date.getHours() < 12) ? date.getHours() : date.getHours() - 12;
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();

    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    this.time = `${hour}:${minutes}:${seconds} ${unit}`;

    if (this.event) {
      const endTime = new Date(this.event.endTime);
      this.minsLeft = Math.floor((endTime.getTime() - new Date().getTime()) / 1000 / 60);
    } else {
      this.minsLeft = 0;
    }
  };

}
