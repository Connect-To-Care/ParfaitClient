import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly apiService: APIService
  ) { }

  ngOnInit() {
    this.apiService.logOut();
    this.router.navigateByUrl('/login');
  }

}
