import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  readonly navBarAnnouncements = [
    {
      title: 'Home',
      isAdmin: false,
      url: 'https://connect-tocare.org'
    }
  ];

  readonly navBarLinks = [
    {
      title: 'Your Events',
      isAdmin: false,
      url: 'events'
    },
    {
      title: 'Manage Events',
      isAdmin: true,
      url: 'admin'
    },
    {
      title: 'My Account',
      isAdmin: false,
      url: 'account'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
