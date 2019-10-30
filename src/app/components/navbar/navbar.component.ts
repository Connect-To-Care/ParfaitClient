import {Component, OnInit} from '@angular/core';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  readonly navBarAnnouncements = [
    {
      title: 'Back to home',
      url: 'https://connect-tocare.org'
    }
  ];

  readonly navBarLinks = [
    {
      title: 'Browse Events',
      url: '/'
    },
    {
      title: 'My Account',
      url: 'account'
    },
    {
      title: 'Logout',
      url: 'logout'
    }
  ];

  readonly navBarAdmin = [
    {
      title: 'Backroom',
      url: 'admin'
    },
  ];

  constructor(
    public readonly apiService: APIService
  ) {
  }

  ngOnInit() {
  }

}
