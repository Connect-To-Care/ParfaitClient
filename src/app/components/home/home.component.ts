import {Component, OnInit} from '@angular/core';
import {APIService, EventModel, MyEventsResponse} from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  availableEvents: Array<EventModel> = [];
  myEvents: MyEventsResponse = {
    future: [],
    now: [],
    past: []
  };

  constructor(
    private readonly apiService: APIService
  ) {
  }

  async ngOnInit() {
    this.availableEvents = await this.apiService.getAvailableEvents();
    this.myEvents = await this.apiService.getEvents();
  }

}
