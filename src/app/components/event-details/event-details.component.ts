import {Component, Input, OnInit} from '@angular/core';
import {EventModel, UserModel} from '../../services/api.service';
import {DateUtil} from '../../../DateUtil';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  @Input() event: EventModel;
  public formatDate = DateUtil.formatDate; // Make this accessible in the component

  constructor() {
  }

  ngOnInit() {
  }

  getSignUps = (event: EventModel): Array<UserModel> => {
    return event.signedUp.map(signUp => signUp.user);
  };

  formatMembers = (people: UserModel[]): string => {
    let members = '';
    people.forEach(member => {
      members += member.name.fullName + ', ';
    });

    members = members === '' ? 'No one' : members.substring(0, members.length - 2);
    return members;
  };
}
