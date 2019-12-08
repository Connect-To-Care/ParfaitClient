import {Component, OnInit} from '@angular/core';
import {APIService, EventModel} from '../../services/api.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {FacilitatorActionsDialogComponent} from '../facilitator-actions/facilitator-actions.component';
import {MatDialog} from '@angular/material';

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

  pastEvents: Array<EventModel>;
  pastEventsSource: Array<EventModel>;

  events: Array<EventModel>;

  constructor(
    private readonly apiService: APIService,
    private readonly dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    const events = await this.apiService.getEvents();

    this.pastEvents = [];
    this.events = [];

    events.forEach(event => {
      if (new Date(event.endTime).getTime() < new Date().getTime()) { // Past
        this.pastEvents.push(event);
      } else {
        this.events.push(event);
      }
    });

    this.pastEventsSource = this.pastEvents;
  }

  public applyPastFilter = (filter: string) => {
    if (filter) {
      this.pastEventsSource = this.pastEvents.filter(
        candidate => candidate.displayName.toLowerCase().includes(filter.toLowerCase()) ||
          candidate._id.includes(filter)
      );
    } else {
      this.pastEventsSource = this.pastEvents;
    }
  };

  openFacilitatorActions = (event: EventModel) => {
    this.dialog.open(FacilitatorActionsDialogComponent, {
      data: {
        event
      }
    });
  };

}
