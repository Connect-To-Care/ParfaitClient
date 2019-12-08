import {Component, OnInit} from '@angular/core';
import {APIService, UserModel} from '../../services/api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public user: UserModel;

  constructor(
    private readonly apiService: APIService
  ) {
  }

  public ngOnInit() {
    this.user = this.apiService.userSession.data.user;
  }

}
