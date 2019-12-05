import {Component, Input, OnInit} from '@angular/core';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() hideLinks: boolean;

  readonly navBarAnnouncements = [
    {
      title: 'Back to site',
      url: 'https://connect-tocare.org'
    }
  ];

  readonly navBarLinks = [
    {
      title: 'Browse Events',
      url: '/dash',
      icon: 'event'
    }
  ];

  readonly accountLoggedIn = [
    {
      title: 'My Account',
      url: '/account'
    },
    {
      title: 'About',
      url: '/about'
    },
    {
      title: 'Logout',
      url: '/logout'
    },
  ];

  readonly accountLoggedOut = [
    {
      title: 'Login',
      url: '/login'
    },
    {
      title: 'About',
      url: '/about'
    }
  ];

  readonly navBarAdmin = [
    {
      title: 'Manage Events',
      url: '/admin/events',
      icon: 'note_add'
    },
    {
      title: 'Manage Users',
      url: '/admin/users',
      icon: 'supervised_user_circle'
    },
  ];

  constructor(
    public readonly apiService: APIService
  ) {
  }

  ngOnInit() {
  }

}
