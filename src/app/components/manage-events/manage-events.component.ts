import {Component, OnInit} from '@angular/core';
import {APIService, EventModel} from '../../services/api.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.scss'],
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
export class ManageEventsComponent implements OnInit {

  pastEvents: Array<EventModel> = [];
  events: Array<EventModel> = [];

  constructor(
    private readonly apiService: APIService,
  ) {
  }

  async ngOnInit() {
    const events = await this.apiService.getEvents();

    events.forEach(event => {
      if (new Date(event.endTime).getTime() < new Date().getTime()) { // Past
        this.pastEvents.push(event);
      } else {
        this.events.push(event);
      }
    });
  }
}
