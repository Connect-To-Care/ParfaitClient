import {Component, Input, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {EventModel} from '../../services/api.service';
import {DateUtil} from '../../../DateUtil';

@Component({
  selector: 'app-event-signin-clock',
  templateUrl: './event-signin-clock.component.html',
  styleUrls: ['./event-signin-clock.component.scss']
})
export class EventSigninClockComponent implements OnInit {

  public timeSubscription: Subscription;
  public time: string;
  public minsLeft: number;

  @Input() event: EventModel;


  constructor() { }

  ngOnInit() {
    this.updateTime();
    this.timeSubscription = interval(1000).subscribe(() => this.updateTime());
  }

  public updateTime = () => {
    const date = new Date();

    this.time = DateUtil.getStrTime(date);

    if (this.event) {
      const endTime = new Date(this.event.endTime);
      this.minsLeft = Math.max(0, Math.floor((endTime.getTime() - date.getTime()) / 1000 / 60));
    } else {
      this.minsLeft = 0;
    }
  };

}
