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
      url: '/dash'
    },
    {
      title: 'My Account',
      url: '/account'
    },
    {
      title: 'Logout',
      url: '/logout'
    }
  ];

  readonly navBarLoggedOut = [
    {
      title: 'Login',
      url: '/login'
    }
  ];

  readonly navBarAdmin = [
    {
      title: 'Manage Events',
      url: '/admin/events'
    },
    {
      title: 'Manage Users',
      url: '/admin/users'
    },
  ];

  constructor(
    public readonly apiService: APIService
  ) {
  }

  ngOnInit() {
  }

}
