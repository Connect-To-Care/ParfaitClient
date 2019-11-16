import {Component, Input, OnInit} from '@angular/core';
import {EventModel, UserModel} from '../../services/api.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  @Input() event: EventModel;

  constructor() {
  }

  ngOnInit() {
  }

  formatDate = (strDate: string): string => {
    const date = new Date(strDate);

    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
  };

  getSignUps = (event: EventModel): Array<UserModel> => {
    return event.signedUp.map(signUp => signUp.user);
  };

  formatMembers = (people: UserModel[]): string => {
    let members = '';
    people.forEach(member => {
      members += member.fullName + ', ';
    });

    if (members === '') {
      members = 'No one';
    } else {
      members = members.substring(0, members.length - 2);
    }
    return members;
  };
}
