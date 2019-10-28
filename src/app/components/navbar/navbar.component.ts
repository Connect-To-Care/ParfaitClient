import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  readonly navBarAnnouncements = [
    {
      title: 'Back to home',
      isAdmin: false,
      url: 'https://connect-tocare.org'
    }
  ];

  readonly navBarLinks = [
    {
      title: 'Browse Events',
      isAdmin: false,
      url: 'events'
    },
    {
      title: 'Backroom',
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
